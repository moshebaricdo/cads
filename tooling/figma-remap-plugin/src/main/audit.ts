/**
 * Selection audit: findings-only walk of the selected frame.
 *
 * Does not descend into component instances (CADS or otherwise) — those are
 * reported as a single component finding when non-CADS. Clean CADS tokens /
 * styles / components are omitted from the result.
 */
import type {
  AuditResult,
  AuditSummary,
  AuditPaintStyleEntry,
  AuditTextStyleEntry,
  AuditVariableEntry,
  ComponentUsageEntry,
  DetachedComponentEntry,
  ExplicitModeEntry,
  FontAwesomeTextEntry,
  RawPaintEntry,
  RawRadiusEntry,
  RawTextEntry,
  UsageRef,
} from "../shared/messages";
import {
  cadsComponents,
  cadsComponentKeys,
  isPrimitiveColorCollection,
  isShapeCollection,
  isTypographyCollection,
} from "../data/cadsCatalog";
import {
  getCollectionCached,
  getVariableCached,
  resolveDisplayValues,
  rgbaToHex,
} from "./values";
import { textStyleValues } from "./styles";

const LOCAL_LIBRARY = "This file";
const UNKNOWN_LIBRARY = "Unknown library (not enabled)";
const cadsComponentNameByNormalized = new Map(
  cadsComponents.map((component) => [
    component.name.trim().toLocaleLowerCase(),
    component.name,
  ]),
);

function isFontAwesomeFamily(family: string): boolean {
  return /^font awesome\b/i.test(family.trim());
}

function isFontAwesome7Family(family: string): boolean {
  return /^font awesome\s+7\b/i.test(family.trim());
}

/** Node-level boundVariables entries we intentionally do not treat as fields. */
const SKIP_FIELDS = new Set([
  "fills",
  "strokes",
  "effects",
  "textRangeFills",
  "textRangeStrokes",
  "componentProperties",
  "layoutGrids",
]);

const RADIUS_FIELDS = [
  "topLeftRadius",
  "topRightRadius",
  "bottomLeftRadius",
  "bottomRightRadius",
] as const;

function isAliasLike(value: unknown): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as VariableAlias).type === "VARIABLE_ALIAS" &&
    typeof (value as VariableAlias).id === "string"
  );
}

function isEffectivelyHidden(node: SceneNode): boolean {
  let current: BaseNode | null = node;
  while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
    if ("visible" in current && current.visible === false) return true;
    current = current.parent;
  }
  return false;
}

function hasComponentAncestor(node: SceneNode): boolean {
  let current: BaseNode | null = node.parent;
  while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
    if (
      current.type === "COMPONENT" ||
      current.type === "COMPONENT_SET" ||
      current.type === "INSTANCE"
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

export interface AuditOptions {
  sotLibraryName: string | null;
  /** Published keys of the target catalog's text styles (for SoT detection). */
  sotStyleKeys: Set<string>;
}

function isColorFinding(entry: AuditVariableEntry): boolean {
  if (entry.resolvedType !== "COLOR") return false;
  if (entry.flag === "primitive") return true;
  return !entry.isSourceOfTruth;
}

function isTypographyVariableFinding(entry: AuditVariableEntry): boolean {
  return entry.flag === "typographyVariable";
}

function isShapeVariableFinding(entry: AuditVariableEntry): boolean {
  return (
    entry.flag === "shapeVariable" &&
    (!entry.isSourceOfTruth || !isShapeCollection(entry.collectionName))
  );
}

function isRadiusUsage(usage: UsageRef): boolean {
  return (
    usage.prop.kind === "field" &&
    (RADIUS_FIELDS as readonly string[]).includes(usage.prop.field)
  );
}

export async function auditSelection(
  { sotLibraryName, sotStyleKeys }: AuditOptions,
  onProgress: (nodesScanned: number) => void,
): Promise<AuditResult> {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    throw new Error("Select at least one frame to audit.");
  }

  const libraryByCollectionKey = new Map<string, string>();
  try {
    const libraryCollections =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    for (const c of libraryCollections) {
      libraryByCollectionKey.set(c.key, c.libraryName);
    }
  } catch {
    // teamLibrary can fail offline; audit still works with unknown attribution
  }

  const entries = new Map<string, AuditVariableEntry>();
  const paintStyles = new Map<string, AuditPaintStyleEntry>();
  const rawPaints = new Map<string, RawPaintEntry>();
  const textStyles = new Map<string, AuditTextStyleEntry>();
  const rawTexts = new Map<string, RawTextEntry>();
  const fontAwesomeTexts = new Map<string, FontAwesomeTextEntry>();
  const rawRadii = new Map<string, RawRadiusEntry>();
  const components = new Map<string, ComponentUsageEntry>();
  const detachedComponents = new Map<string, DetachedComponentEntry>();
  const styleCache = new Map<string, TextStyle | null>();
  const paintStyleCache = new Map<string, PaintStyle | null>();
  const explicitModes: ExplicitModeEntry[] = [];
  const styledTextNodeIds = new Set<string>();
  const fontAwesomeNodeIds = new Set<string>();
  const typographyVariableNodeIds = new Set<string>();
  let mixedTextSkipped = 0;
  let mixedStyleSkipped = 0;
  let nodesScanned = 0;
  let visibleNodesScanned = 0;
  let compliancePasses = 0;
  let complianceWarnings = 0;

  function recordCompliance(passed: boolean, hidden = false): void {
    if (hidden) return;
    if (passed) compliancePasses++;
    else complianceWarnings++;
  }

  function recordVariableCompliance(
    entry: AuditVariableEntry,
    hidden: boolean,
  ): void {
    if (entry.flag === "typographyVariable") {
      recordCompliance(false, hidden);
      return;
    }
    if (entry.flag === "shapeVariable") {
      recordCompliance(!isShapeVariableFinding(entry), hidden);
      return;
    }
    if (entry.resolvedType === "COLOR") {
      recordCompliance(!isColorFinding(entry), hidden);
    }
  }

  async function getTextStyle(styleId: string): Promise<TextStyle | null> {
    if (!styleCache.has(styleId)) {
      try {
        const style = await figma.getStyleByIdAsync(styleId);
        styleCache.set(
          styleId,
          style && style.type === "TEXT" ? (style as TextStyle) : null,
        );
      } catch {
        styleCache.set(styleId, null);
      }
    }
    return styleCache.get(styleId) ?? null;
  }

  async function getPaintStyle(styleId: string): Promise<PaintStyle | null> {
    if (!paintStyleCache.has(styleId)) {
      try {
        const style = await figma.getStyleByIdAsync(styleId);
        paintStyleCache.set(
          styleId,
          style && style.type === "PAINT" ? (style as PaintStyle) : null,
        );
      } catch {
        paintStyleCache.set(styleId, null);
      }
    }
    return paintStyleCache.get(styleId) ?? null;
  }

  async function visitText(node: TextNode): Promise<void> {
    const usage: UsageRef = {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      prop: { kind: "textStyle" },
      inInstance: false,
      hidden: isEffectivelyHidden(node),
    };
    const styleId = node.textStyleId;
    if (styleId === figma.mixed) {
      mixedStyleSkipped++;
      return;
    }
    if (node.fontName !== figma.mixed && node.fontSize !== figma.mixed) {
      const font = node.fontName as FontName;
      const size = node.fontSize as number;
      if (isFontAwesomeFamily(font.family)) {
        fontAwesomeNodeIds.add(node.id);
        if (isFontAwesome7Family(font.family)) {
          recordCompliance(true, usage.hidden);
          return;
        }
        const id = `fontawesome:${font.family}/${font.style}/${size}`;
        const existing = fontAwesomeTexts.get(id);
        if (existing) {
          existing.usages.push(usage);
        } else {
          fontAwesomeTexts.set(id, {
            id,
            label: `${font.family} ${font.style}`,
            values: {
              family: font.family,
              weight: font.style,
              size: String(size),
            },
            usages: [usage],
          });
        }
        recordCompliance(false, usage.hidden);
        return;
      }
    }
    if (styleId) {
      styledTextNodeIds.add(node.id);
      const id = `style:${styleId}`;
      const existing = textStyles.get(id);
      if (existing) {
        existing.usages.push(usage);
        recordCompliance(existing.isSourceOfTruth, usage.hidden);
        return;
      }
      const style = await getTextStyle(styleId);
      if (!style) return;
      const entry: AuditTextStyleEntry = {
        id,
        styleId,
        styleKey: style.key,
        name: style.name,
        remote: style.remote,
        isSourceOfTruth: sotStyleKeys.has(style.key),
        values: textStyleValues(style),
        usages: [usage],
      };
      textStyles.set(id, entry);
      recordCompliance(entry.isSourceOfTruth, usage.hidden);
      return;
    }
    if (node.fontName === figma.mixed || node.fontSize === figma.mixed) {
      mixedStyleSkipped++;
      return;
    }
    const font = node.fontName as FontName;
    const size = node.fontSize as number;
    const id = `font:${font.family}/${font.style}/${size}`;
    const existing = rawTexts.get(id);
    if (existing) {
      existing.usages.push(usage);
      return;
    }
    const values: Record<string, string> = {
      family: font.family,
      weight: font.style,
      size: String(size),
    };
    const lh = node.lineHeight;
    if (lh !== figma.mixed) {
      if (lh.unit === "PIXELS") values.lineHeight = `${lh.value}px`;
      else if (lh.unit === "PERCENT") values.lineHeight = `${Math.round(lh.value)}%`;
      else values.lineHeight = "auto";
    }
    rawTexts.set(id, {
      id,
      label: `${font.family} ${font.style} ${size}`,
      values,
      usages: [usage],
    });
  }

  async function recordVariableUsage(
    variableId: string,
    usage: UsageRef,
  ): Promise<void> {
    const id = `var:${variableId}`;
    const existing = entries.get(id);
    if (existing) {
      if (existing.flag === "shapeVariable" && !isRadiusUsage(usage)) return;
      if (isRadiusUsage(usage)) {
        if (existing.flag !== "shapeVariable") existing.usages = [];
        existing.flag = "shapeVariable";
        if (
          existing.usages.some(
            (existingUsage) => existingUsage.nodeId === usage.nodeId,
          )
        ) {
          return;
        }
      }
      if (
        existing.flag === "typographyVariable" &&
        (usage.nodeType !== "TEXT" ||
          styledTextNodeIds.has(usage.nodeId) ||
          fontAwesomeNodeIds.has(usage.nodeId))
      ) {
        return;
      }
      if (existing.flag === "typographyVariable") {
        typographyVariableNodeIds.add(usage.nodeId);
      }
      existing.usages.push(usage);
      recordVariableCompliance(existing, usage.hidden);
      return;
    }
    const variable = await getVariableCached(variableId);
    if (!variable) return;
    const collection = await getCollectionCached(variable.variableCollectionId);
    const libraryName = variable.remote
      ? (collection && libraryByCollectionKey.get(collection.key)) ??
        UNKNOWN_LIBRARY
      : LOCAL_LIBRARY;
    const collectionName = collection?.name ?? "?";
    const isSourceOfTruth =
      sotLibraryName !== null && libraryName === sotLibraryName;
    let flag: AuditVariableEntry["flag"];
    if (
      variable.resolvedType === "COLOR" &&
      isSourceOfTruth &&
      isPrimitiveColorCollection(collectionName)
    ) {
      flag = "primitive";
    } else if (isRadiusUsage(usage)) {
      flag = "shapeVariable";
    } else if (isTypographyCollection(collectionName)) {
      flag = "typographyVariable";
    }
    if (
      flag === "typographyVariable" &&
      (usage.nodeType !== "TEXT" ||
        styledTextNodeIds.has(usage.nodeId) ||
        fontAwesomeNodeIds.has(usage.nodeId))
    ) {
      return;
    }
    if (flag === "typographyVariable") {
      typographyVariableNodeIds.add(usage.nodeId);
    }
    const entry: AuditVariableEntry = {
      id,
      variableId,
      variableKey: variable.key,
      name: variable.name,
      resolvedType: variable.resolvedType,
      collectionName,
      libraryName,
      remote: variable.remote,
      isSourceOfTruth,
      flag,
      values: collection ? await resolveDisplayValues(variable, collection) : {},
      usages: [usage],
    };
    entries.set(id, entry);
    recordVariableCompliance(entry, usage.hidden);
  }

  function recordRawPaint(hex: string, usage: UsageRef): void {
    const id = `hex:${hex}`;
    const existing = rawPaints.get(id);
    if (existing) existing.usages.push(usage);
    else rawPaints.set(id, { id, hex, usages: [usage] });
    recordCompliance(false, usage.hidden);
  }

  async function visitPaints(
    node: SceneNode,
    property: "fills" | "strokes",
  ): Promise<void> {
    if (!(property in node)) return;
    const paints = (node as unknown as Record<string, unknown>)[property];
    if (paints === figma.mixed) {
      if (node.type === "TEXT" && property === "fills") mixedTextSkipped++;
      return;
    }
    if (!Array.isArray(paints)) return;
    const styleField = property === "fills" ? "fillStyleId" : "strokeStyleId";
    const styleId = (node as unknown as Record<string, unknown>)[styleField];
    if (typeof styleId === "string" && styleId) {
      const style = await getPaintStyle(styleId);
      const solidIndex = paints.findIndex(
        (paint) =>
          (paint as Paint).type === "SOLID" &&
          (paint as SolidPaint).visible !== false,
      );
      if (style && solidIndex >= 0) {
        const paint = paints[solidIndex] as SolidPaint;
        const usage: UsageRef = {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          prop: { kind: "paint", property, index: solidIndex },
          inInstance: false,
          hidden: isEffectivelyHidden(node),
        };
        const id = `paintStyle:${styleId}`;
        const existing = paintStyles.get(id);
        if (existing) existing.usages.push(usage);
        else {
          paintStyles.set(id, {
            id,
            styleId,
            name: style.name,
            hex: rgbaToHex({ ...paint.color, a: paint.opacity ?? 1 }),
            usages: [usage],
          });
        }
        recordCompliance(false, usage.hidden);
        return;
      }
    }
    for (let index = 0; index < paints.length; index++) {
      const paint = paints[index] as Paint;
      if (paint.type !== "SOLID" || paint.visible === false) continue;
      const usage: UsageRef = {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        prop: { kind: "paint", property, index },
        inInstance: false,
        hidden: isEffectivelyHidden(node),
      };
      const alias = (paint as SolidPaint).boundVariables?.color;
      if (alias && isAliasLike(alias)) {
        await recordVariableUsage(alias.id, usage);
      } else {
        recordRawPaint(rgbaToHex({ ...paint.color, a: paint.opacity ?? 1 }), usage);
      }
    }
  }

  /** One usage per node per distinct unbound radius value (not 4× corners). */
  function visitRadii(node: SceneNode): void {
    const record = node as unknown as Record<string, unknown>;
    const bound = (
      node as SceneNode & { boundVariables?: Record<string, unknown> }
    ).boundVariables;
    const unboundByValue = new Map<number, (typeof RADIUS_FIELDS)[number]>();
    for (const field of RADIUS_FIELDS) {
      const value = record[field];
      if (typeof value !== "number" || value <= 0) continue;
      if (bound && bound[field]) {
        continue;
      }
      if (!unboundByValue.has(value)) unboundByValue.set(value, field);
    }
    for (const [value, field] of unboundByValue) {
      const id = `radius:${value}`;
      const usage: UsageRef = {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        prop: { kind: "field", field },
        inInstance: false,
        hidden: isEffectivelyHidden(node),
      };
      const existing = rawRadii.get(id);
      if (existing) existing.usages.push(usage);
      else rawRadii.set(id, { id, label: `${value}px`, value, usages: [usage] });
      recordCompliance(false, usage.hidden);
    }
  }

  async function visitInstance(node: InstanceNode): Promise<void> {
    const usage: UsageRef = {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      prop: { kind: "field", field: "component" },
      inInstance: false,
      hidden: isEffectivelyHidden(node),
    };
    let main: ComponentNode | null = null;
    try {
      main = await node.getMainComponentAsync();
    } catch {
      return;
    }
    if (!main) return;
    const owner =
      main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : main;
    const key = owner.key;
    const existing = components.get(key);
    if (existing) {
      existing.instanceCount++;
      existing.usages.push(usage);
      recordCompliance(existing.isCads, usage.hidden);
      if (
        existing.sampleNodeNames.length < 5 &&
        !existing.sampleNodeNames.includes(node.name)
      ) {
        existing.sampleNodeNames.push(node.name);
      }
      return;
    }
    const entry: ComponentUsageEntry = {
      key,
      name: owner.name,
      isCads: cadsComponentKeys.has(key),
      isLocal: !main.remote,
      instanceCount: 1,
      sampleNodeNames: [node.name],
      usages: [usage],
    };
    components.set(key, entry);
    recordCompliance(entry.isCads, usage.hidden);
  }

  function visitPossibleDetachedComponent(node: SceneNode): void {
    if (node.type !== "FRAME" && node.type !== "GROUP") return;
    if (hasComponentAncestor(node)) return;
    const componentName = cadsComponentNameByNormalized.get(
      node.name.trim().toLocaleLowerCase(),
    );
    if (!componentName) return;
    const id = `detached:${componentName.toLocaleLowerCase()}`;
    const usage: UsageRef = {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      prop: { kind: "field", field: "possibleDetachedComponent" },
      inInstance: false,
      hidden: isEffectivelyHidden(node),
    };
    const existing = detachedComponents.get(id);
    if (existing) existing.usages.push(usage);
    else detachedComponents.set(id, { id, componentName, usages: [usage] });
    recordCompliance(false, usage.hidden);
  }

  async function visitSurfaceNode(node: SceneNode): Promise<void> {
    visitPossibleDetachedComponent(node);
    await visitPaints(node, "fills");
    await visitPaints(node, "strokes");
    visitRadii(node);
    if (node.type === "TEXT") await visitText(node);

    if ("effects" in node && Array.isArray(node.effects)) {
      for (let index = 0; index < node.effects.length; index++) {
        const effect = node.effects[index] as Effect & {
          boundVariables?: { color?: VariableAlias };
        };
        const alias = effect.boundVariables?.color;
        if (alias && isAliasLike(alias)) {
          await recordVariableUsage(alias.id, {
            nodeId: node.id,
            nodeName: node.name,
            nodeType: node.type,
            prop: { kind: "effect", index },
            inInstance: false,
            hidden: isEffectivelyHidden(node),
          });
        }
      }
    }

    const bound = (
      node as SceneNode & { boundVariables?: Record<string, unknown> }
    ).boundVariables;
    if (bound) {
      for (const field of Object.keys(bound)) {
        if (SKIP_FIELDS.has(field)) continue;
        const value = bound[field];
        if (!isAliasLike(value)) continue;
        await recordVariableUsage(value.id, {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          prop: { kind: "field", field },
          inInstance: false,
          hidden: isEffectivelyHidden(node),
        });
      }
    }

    if ("explicitVariableModes" in node) {
      const modes = (
        node as SceneNode & { explicitVariableModes: Record<string, string> }
      ).explicitVariableModes;
      for (const collectionId of Object.keys(modes ?? {})) {
        const collection = await getCollectionCached(collectionId);
        if (!collection) continue;
        const mode = collection.modes.find(
          (m) => m.modeId === modes[collectionId],
        );
        const libraryName = collection.remote
          ? libraryByCollectionKey.get(collection.key) ?? UNKNOWN_LIBRARY
          : LOCAL_LIBRARY;
        explicitModes.push({
          nodeId: node.id,
          nodeName: node.name,
          collectionId,
          collectionName: collection.name,
          libraryName,
          modeName: mode?.name ?? "?",
          isSourceOfTruth:
            sotLibraryName !== null && libraryName === sotLibraryName,
          hidden: isEffectivelyHidden(node),
        });
        recordCompliance(
          sotLibraryName !== null && libraryName === sotLibraryName,
          isEffectivelyHidden(node),
        );
      }
    }
  }

  // Walk selection; never descend into INSTANCE children (component finding only).
  const stack: SceneNode[] = [...selection];
  while (stack.length > 0) {
    const node = stack.pop()!;
    nodesScanned++;
    if (!isEffectivelyHidden(node)) visibleNodesScanned++;
    if (nodesScanned % 250 === 0) {
      onProgress(nodesScanned);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (node.type === "INSTANCE") {
      await visitInstance(node);
      continue;
    }

    await visitSurfaceNode(node);
    if ("children" in node) {
      for (const child of node.children) stack.push(child);
    }
  }

  const resolvedRootModes = new Set<string>();
  for (const root of selection) {
    const resolvedModes = (
      root as SceneNode & {
        resolvedVariableModes?: Record<string, string>;
      }
    ).resolvedVariableModes;
    for (const [collectionId, modeId] of Object.entries(resolvedModes ?? {})) {
      const collection = await getCollectionCached(collectionId);
      if (!collection) continue;
      const libraryName = collection.remote
        ? libraryByCollectionKey.get(collection.key) ?? UNKNOWN_LIBRARY
        : LOCAL_LIBRARY;
      if (sotLibraryName === null || libraryName !== sotLibraryName) continue;
      const modeName = collection.modes.find(
        (mode) => mode.modeId === modeId,
      )?.name;
      if (modeName && /^(light|dark)$/i.test(modeName.trim())) {
        resolvedRootModes.add(modeName);
      }
    }
  }
  const colorModeName =
    resolvedRootModes.size === 1 ? Array.from(resolvedRootModes)[0] : null;

  // A text layer using typography variables is reported in that dedicated
  // group, not again as raw typography.
  for (const [id, entry] of rawTexts) {
    entry.usages = entry.usages.filter(
      (usage) => !typographyVariableNodeIds.has(usage.nodeId),
    );
    if (entry.usages.length === 0) {
      rawTexts.delete(id);
      continue;
    }
    for (const usage of entry.usages) recordCompliance(false, usage.hidden);
  }

  // Findings-only shaping — clean SoT / CADS never leave the auditor.
  const findingEntries = Array.from(entries.values())
    .filter(
      (e) =>
        isColorFinding(e) ||
        isTypographyVariableFinding(e) ||
        isShapeVariableFinding(e),
    )
    .sort((a, b) =>
      `${a.libraryName}/${a.collectionName}/${a.name}`.localeCompare(
        `${b.libraryName}/${b.collectionName}/${b.name}`,
      ),
    );
  const findingTextStyles = Array.from(textStyles.values())
    .filter((s) => !s.isSourceOfTruth)
    .sort((a, b) => a.name.localeCompare(b.name));
  const findingRawTexts = Array.from(rawTexts.values()).sort(
    (a, b) => b.usages.length - a.usages.length,
  );
  const findingFontAwesomeTexts = Array.from(fontAwesomeTexts.values()).sort(
    (a, b) => b.usages.length - a.usages.length,
  );
  const findingRawPaints = Array.from(rawPaints.values()).sort(
    (a, b) => b.usages.length - a.usages.length,
  );
  const findingPaintStyles = Array.from(paintStyles.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const findingRadii = Array.from(rawRadii.values()).sort(
    (a, b) => a.value - b.value,
  );
  const findingComponents = Array.from(components.values())
    .filter((c) => !c.isCads)
    .sort((a, b) => b.instanceCount - a.instanceCount);
  const findingDetachedComponents = Array.from(detachedComponents.values()).sort(
    (a, b) => b.usages.length - a.usages.length,
  );
  const findingModes = explicitModes.filter((m) => !m.isSourceOfTruth);

  const visibleUsageCount = (entry: { usages: UsageRef[] }): number =>
    entry.usages.filter((usage) => !usage.hidden).length;
  const colorCount =
    findingEntries
      .filter(isColorFinding)
      .reduce((total, entry) => total + visibleUsageCount(entry), 0) +
    findingRawPaints.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0,
    ) +
    findingPaintStyles.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0,
    );
  const typographyCount =
    findingEntries
      .filter(isTypographyVariableFinding)
      .reduce((total, entry) => total + visibleUsageCount(entry), 0) +
    findingTextStyles.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0,
    ) +
    findingRawTexts.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0,
    ) +
    findingFontAwesomeTexts.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0,
    );
  const shapeCount =
    findingEntries
      .filter(isShapeVariableFinding)
      .reduce((total, entry) => total + visibleUsageCount(entry), 0) +
    findingRadii.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0,
    );
  const modesCount = findingModes.filter((mode) => !mode.hidden).length;
  const componentsCount =
    findingDetachedComponents.reduce(
      (total, component) => total + visibleUsageCount(component),
      0,
    ) +
    findingComponents.reduce(
      (total, component) => total + visibleUsageCount(component),
      0,
    );
  const totalFindings =
    colorCount + typographyCount + shapeCount + modesCount + componentsCount;
  const totalUsages = compliancePasses + complianceWarnings;

  const summary: AuditSummary = {
    colors: colorCount,
    typography: typographyCount,
    shape: shapeCount,
    modes: modesCount,
    components: componentsCount,
    totalUsages,
    passes: compliancePasses,
    warnings: complianceWarnings,
    complianceScore:
      totalUsages === 0
        ? 100
        : Math.round((compliancePasses / totalUsages) * 100),
    passed: totalFindings === 0,
    totalFindings,
  };

  const selectionLabel =
    selection.length === 1
      ? selection[0].name
      : `${selection.length} selected layers`;

  return {
    selectionLabel,
    rootNodeIds: selection.map((n) => n.id),
    colorModeName,
    nodesScanned: visibleNodesScanned,
    summary,
    entries: findingEntries,
    paintStyles: findingPaintStyles,
    rawPaints: findingRawPaints,
    textStyles: findingTextStyles,
    rawTexts: findingRawTexts,
    fontAwesomeTexts: findingFontAwesomeTexts,
    rawRadii: findingRadii,
    components: findingComponents,
    detachedComponents: findingDetachedComponents,
    explicitModes: findingModes,
    mixedTextSkipped,
    mixedStyleSkipped,
  };
}
