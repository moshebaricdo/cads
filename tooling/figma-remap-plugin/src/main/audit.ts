/**
 * Selection audit: findings-only walk of the selected frame.
 *
 * Non-CADS instances are still one component finding each. Color paints inside
 * instances are also audited (marked `inInstance`) so designers can remap fills
 * before swapping components. Typography / shape / modes stay surface-only.
 * Clean CADS tokens / styles / components are omitted from the result.
 */
import type {
  AuditResult,
  AuditSummary,
  AuditPaintStyleEntry,
  AuditTextStyleEntry,
  AuditVariableEntry,
  ColorBackdrop,
  ColorThemeAssumption,
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
  isFontAwesome7Family,
  isFontAwesomeFamily,
} from "../shared/fontAwesome";
import {
  getCollectionCached,
  getVariableCached,
  resolveDisplayValues,
  rgbaToHex,
  safeVariableCollectionId,
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

/** Figma's default component / instance outline — never a real design color. */
function isFigmaComponentOutlineHex(hex: string): boolean {
  // Match #9747ff or #9747ff + optional alpha byte.
  return /^#9747ff([0-9a-f]{2})?$/i.test(hex.trim());
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

function hexChroma(hex: string): number {
  const raw = hex.replace(/^#/, "").toLowerCase();
  if (!/^[0-9a-f]{6}/.test(raw)) return 0;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function parseHexRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const raw = hex.replace(/^#/, "").toLowerCase();
  if (!/^[0-9a-f]{6}/.test(raw)) return null;
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  };
}

/** Relative luminance 0–1 (sRGB). */
function hexLuminance(hex: string): number | null {
  const rgb = parseHexRgb(hex);
  if (!rgb) return null;
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b)
  );
}

function isNeutralDarkHex(hex: string): boolean {
  const lum = hexLuminance(hex);
  return lum != null && lum < 0.22 && hexChroma(hex) < 45;
}

function isNeutralLightHex(hex: string): boolean {
  const lum = hexLuminance(hex);
  return lum != null && lum > 0.75 && hexChroma(hex) < 45;
}

function isNearWhiteHex(hex: string): boolean {
  const rgb = parseHexRgb(hex);
  return !!rgb && rgb.r >= 245 && rgb.g >= 245 && rgb.b >= 245;
}

function isNearBlackHex(hex: string): boolean {
  const rgb = parseHexRgb(hex);
  return !!rgb && rgb.r <= 50 && rgb.g <= 50 && rgb.b <= 55;
}

function firstColorHex(values: Record<string, string>): string | null {
  for (const value of Object.values(values)) {
    if (parseHexRgb(value)) return value;
  }
  return null;
}

/**
 * Infer whether color remaps should assume CADS Dark (theme-aware white→primary)
 * vs Light (white→primary-inverse). Does not affect `-fixed` on chromatic chrome.
 */
function inferColorThemeAssumption(
  colorModeName: string | null,
  selection: readonly SceneNode[],
  colorEntries: AuditVariableEntry[],
  paintStyles: AuditPaintStyleEntry[],
  rawPaints: RawPaintEntry[],
): { colorThemeAssumption: ColorThemeAssumption; manualDarkMode: boolean } {
  if (colorModeName && /^dark$/i.test(colorModeName.trim())) {
    return { colorThemeAssumption: "dark", manualDarkMode: false };
  }

  let darkBg = 0;
  let lightBg = 0;
  let whiteText = 0;
  let blackText = 0;
  let visiblePaintUsages = 0;
  let darkStyleBoost = 0;

  const countHexUsages = (hex: string, usages: UsageRef[]) => {
    for (const usage of usages) {
      if (usage.hidden) continue;
      if (usage.prop.kind !== "paint" || usage.prop.property !== "fills") {
        continue;
      }
      visiblePaintUsages++;
      if (usage.nodeType === "TEXT") {
        if (isNearWhiteHex(hex)) whiteText++;
        else if (isNearBlackHex(hex)) blackText++;
        continue;
      }
      if (isNeutralDarkHex(hex)) darkBg++;
      else if (isNeutralLightHex(hex)) lightBg++;
    }
  };

  for (const entry of colorEntries) {
    if (entry.resolvedType !== "COLOR") continue;
    const hex = firstColorHex(entry.values);
    if (hex) countHexUsages(hex, entry.usages);
  }
  for (const style of paintStyles) {
    countHexUsages(style.hex, style.usages);
    if (/^dark\//i.test(style.name.trim())) darkStyleBoost++;
  }
  for (const raw of rawPaints) {
    countHexUsages(raw.hex, raw.usages);
  }

  let rootDark = 0;
  let rootLight = 0;
  for (const root of selection) {
    if (!("fills" in root)) continue;
    const fills = (root as GeometryMixin).fills;
    if (!Array.isArray(fills)) continue;
    for (let i = fills.length - 1; i >= 0; i--) {
      const paint = fills[i] as Paint;
      if (paint.type !== "SOLID" || paint.visible === false) continue;
      if ((paint.opacity ?? 1) < 0.08) continue;
      const hex = rgbaToHex({ ...paint.color, a: paint.opacity ?? 1 });
      if (isNeutralDarkHex(hex)) rootDark++;
      else if (isNeutralLightHex(hex)) rootLight++;
      break;
    }
  }
  const rootsLookDark = rootDark > 0 && rootDark >= rootLight;

  const bgTotal = darkBg + lightBg;
  const textTotal = whiteText + blackText;
  const darkBgRatio = bgTotal > 0 ? darkBg / bgTotal : 0;
  const whiteTextDominates = textTotal > 0 && whiteText > blackText;

  // Conservative: need a real dark-chrome sample, not one dark card.
  const densityHit =
    visiblePaintUsages >= 8 &&
    bgTotal >= 3 &&
    textTotal >= 2 &&
    darkBgRatio >= 0.65 &&
    whiteTextDominates;

  const rootBoostHit =
    rootsLookDark &&
    visiblePaintUsages >= 6 &&
    bgTotal >= 2 &&
    darkBgRatio >= 0.5 &&
    whiteTextDominates;

  const styleBoostHit =
    darkStyleBoost >= 4 &&
    darkBgRatio >= 0.5 &&
    whiteTextDominates &&
    visiblePaintUsages >= 6;

  if (densityHit || rootBoostHit || styleBoostHit) {
    return { colorThemeAssumption: "dark", manualDarkMode: true };
  }

  return { colorThemeAssumption: "light", manualDarkMode: false };
}

/** Brand / accent / sentiment fills — white/black on these should use `-fixed`. */
function classifyColorNameBackdrop(name: string): ColorBackdrop | null {
  const n = name.toLowerCase().replace(/\\/g, "/");
  if (
    /neutral|disabled|alpha|black-fixed|white-fixed|true-base|placeholder/.test(
      n,
    )
  ) {
    return "neutral";
  }
  if (
    /(^|\/)(brand|accent|error|warning|success|info|selected)(\/|$)/.test(n) ||
    /(^|\/)(aqua|teal|purple|orange|pink|strawberry|affirmative|caution)(\/|$)/.test(
      n,
    )
  ) {
    return "chromatic";
  }
  return null;
}

function classifyStyleNameBackdrop(styleName: string): ColorBackdrop | null {
  const parts = styleName
    .split("/")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  if (parts.length < 2) return null;
  const family = parts[1];
  if (
    family === "gray" ||
    family === "black" ||
    family === "white" ||
    family === "neutral"
  ) {
    return "neutral";
  }
  if (
    [
      "aqua",
      "teal",
      "purple",
      "orange",
      "pink",
      "strawberry",
      "affirmative",
      "caution",
      "info",
      "brand",
      "error",
      "warning",
      "success",
    ].includes(family)
  ) {
    return "chromatic";
  }
  return null;
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

  async function classifySolidPaint(
    paint: Paint,
    host: SceneNode,
  ): Promise<ColorBackdrop | null> {
    if (paint.type !== "SOLID" || paint.visible === false) return null;
    if ((paint.opacity ?? 1) < 0.08) return null;

    const alias = (paint as SolidPaint).boundVariables?.color;
    if (alias && isAliasLike(alias)) {
      try {
        const variable = await getVariableCached(alias.id);
        if (variable) {
          const byName = classifyColorNameBackdrop(variable.name);
          if (byName) return byName;
        }
      } catch {
        /* fall through */
      }
    }

    const styleId = (host as SceneNode & { fillStyleId?: string | symbol })
      .fillStyleId;
    if (typeof styleId === "string" && styleId) {
      const style = await getPaintStyle(styleId);
      if (style) {
        const byStyle = classifyStyleNameBackdrop(style.name);
        if (byStyle) return byStyle;
      }
    }

    const hex = rgbaToHex({
      ...paint.color,
      a: paint.opacity ?? 1,
    });
    return hexChroma(hex) >= 28 ? "chromatic" : "neutral";
  }

  /**
   * Fill behind a paint: same-node under-fills first, then ancestor fills.
   * Used so white/black only map to `-fixed` on chromatic primary chrome.
   */
  async function classifyBackdrop(
    node: SceneNode,
    property: "fills" | "strokes",
    index: number,
  ): Promise<ColorBackdrop> {
    if ("fills" in node) {
      const fills = (node as GeometryMixin).fills;
      if (Array.isArray(fills)) {
        const start = property === "fills" ? index - 1 : fills.length - 1;
        for (let i = start; i >= 0; i--) {
          const kind = await classifySolidPaint(fills[i] as Paint, node);
          if (kind) return kind;
        }
      }
    }

    let current: BaseNode | null = node.parent;
    while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
      if ("fills" in current) {
        const fills = (current as GeometryMixin).fills;
        if (Array.isArray(fills)) {
          for (let i = fills.length - 1; i >= 0; i--) {
            const kind = await classifySolidPaint(
              fills[i] as Paint,
              current as SceneNode,
            );
            if (kind) return kind;
          }
        }
      }
      current = current.parent;
    }
    return "unknown";
  }

  async function paintUsage(
    node: SceneNode,
    property: "fills" | "strokes",
    index: number,
    inInstance: boolean,
  ): Promise<UsageRef> {
    return {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      prop: { kind: "paint", property, index },
      inInstance,
      hidden: isEffectivelyHidden(node),
      backdrop: await classifyBackdrop(node, property, index),
    };
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
    if (node.textCase !== figma.mixed) values.textCase = String(node.textCase);
    if (node.textDecoration !== figma.mixed) {
      values.textDecoration = String(node.textDecoration);
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
    appliedRadius?: number,
  ): Promise<void> {
    const id = `var:${variableId}`;
    const existing = entries.get(id);
    if (existing) {
      if (existing.flag === "shapeVariable" && !isRadiusUsage(usage)) return;
      if (isRadiusUsage(usage)) {
        if (existing.flag !== "shapeVariable") existing.usages = [];
        existing.flag = "shapeVariable";
        if (
          existing.value === undefined &&
          appliedRadius !== undefined &&
          appliedRadius > 0
        ) {
          existing.value = appliedRadius;
        }
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
    if (!variable) {
      // Deleted / unresolvable binding (e.g. retired DSCO br-s) — treat the
      // applied corner radius like a raw value so it can still be remapped.
      if (
        isRadiusUsage(usage) &&
        appliedRadius !== undefined &&
        appliedRadius > 0
      ) {
        recordRawRadius(appliedRadius, usage);
      }
      return;
    }
    const collectionId = safeVariableCollectionId(variable);
    if (!collectionId) return;
    const collection = await getCollectionCached(collectionId);
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
    if (
      flag === "shapeVariable" &&
      appliedRadius !== undefined &&
      appliedRadius > 0
    ) {
      entry.value = appliedRadius;
    }
    entries.set(id, entry);
    recordVariableCompliance(entry, usage.hidden);
  }

  function recordRawPaint(hex: string, usage: UsageRef): void {
    if (isFigmaComponentOutlineHex(hex)) return;
    const id = `hex:${hex}`;
    const existing = rawPaints.get(id);
    if (existing) existing.usages.push(usage);
    else rawPaints.set(id, { id, hex, usages: [usage] });
    recordCompliance(false, usage.hidden);
  }

  async function visitPaints(
    node: SceneNode,
    property: "fills" | "strokes",
    inInstance = false,
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
        const hex = rgbaToHex({ ...paint.color, a: paint.opacity ?? 1 });
        if (isFigmaComponentOutlineHex(hex)) return;
        const usage = await paintUsage(node, property, solidIndex, inInstance);
        const id = `paintStyle:${styleId}`;
        const existing = paintStyles.get(id);
        if (existing) existing.usages.push(usage);
        else {
          paintStyles.set(id, {
            id,
            styleId,
            name: style.name,
            hex,
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
      const usage = await paintUsage(node, property, index, inInstance);
      const alias = (paint as SolidPaint).boundVariables?.color;
      if (alias && isAliasLike(alias)) {
        await recordVariableUsage(alias.id, usage);
      } else {
        recordRawPaint(
          rgbaToHex({ ...paint.color, a: paint.opacity ?? 1 }),
          usage,
        );
      }
    }
  }

  function recordRawRadius(
    value: number,
    usage: UsageRef,
  ): void {
    if (!(value > 0)) return;
    const id = `radius:${value}`;
    const existing = rawRadii.get(id);
    if (existing) existing.usages.push(usage);
    else rawRadii.set(id, { id, label: `${value}px`, value, usages: [usage] });
    recordCompliance(false, usage.hidden);
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
      recordRawRadius(value, {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        prop: { kind: "field", field },
        inInstance: false,
        hidden: isEffectivelyHidden(node),
      });
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
      // Local file components are ignored (not CADS library issues).
      recordCompliance(existing.isCads || existing.isLocal, usage.hidden);
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
    recordCompliance(entry.isCads || entry.isLocal, usage.hidden);
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
    await visitPaints(node, "fills", false);
    await visitPaints(node, "strokes", false);
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
      const record = node as unknown as Record<string, unknown>;
      for (const field of Object.keys(bound)) {
        if (SKIP_FIELDS.has(field)) continue;
        const value = bound[field];
        if (!isAliasLike(value)) continue;
        const appliedRadius =
          (RADIUS_FIELDS as readonly string[]).includes(field) &&
          typeof record[field] === "number"
            ? (record[field] as number)
            : undefined;
        await recordVariableUsage(
          value.id,
          {
            nodeId: node.id,
            nodeName: node.name,
            nodeType: node.type,
            prop: { kind: "field", field },
            inInstance: false,
            hidden: isEffectivelyHidden(node),
          },
          appliedRadius,
        );
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

  // Walk selection. Instances still get one component finding, but we also
  // descend for color paints so icon/legacy fills can be remapped pre-swap.
  const stack: { node: SceneNode; inInstance: boolean }[] = selection.map(
    (node) => ({ node, inInstance: false }),
  );
  while (stack.length > 0) {
    const { node, inInstance } = stack.pop()!;
    nodesScanned++;
    if (!isEffectivelyHidden(node)) visibleNodesScanned++;
    if (nodesScanned % 250 === 0) {
      onProgress(nodesScanned);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (node.type === "INSTANCE") {
      if (!inInstance) await visitInstance(node);
      await visitPaints(node, "fills", true);
      await visitPaints(node, "strokes", true);
      for (const child of node.children) {
        stack.push({ node: child, inInstance: true });
      }
      continue;
    }

    if (inInstance) {
      await visitPaints(node, "fills", true);
      await visitPaints(node, "strokes", true);
      if ("children" in node) {
        for (const child of node.children) {
          stack.push({ node: child, inInstance: true });
        }
      }
      continue;
    }

    await visitSurfaceNode(node);
    if ("children" in node) {
      for (const child of node.children) {
        stack.push({ node: child, inInstance: false });
      }
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
  const fontSizeKey = (values: Record<string, string>, label: string) => {
    const fromSize = Number(String(values.size ?? "").replace(/px$/i, "").trim());
    if (Number.isFinite(fromSize) && fromSize > 0) return fromSize;
    const match = /(\d+(?:\.\d+)?)\s*(?:px)?\s*$/i.exec(label);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n >= 6 && n <= 200) return n;
    }
    return Number.POSITIVE_INFINITY;
  };
  const byFontSize = <T extends { values: Record<string, string> }>(
    a: T & { name?: string; label?: string },
    b: T & { name?: string; label?: string },
  ) => {
    const aLabel = a.name ?? a.label ?? "";
    const bLabel = b.name ?? b.label ?? "";
    const sizeDiff = fontSizeKey(a.values, aLabel) - fontSizeKey(b.values, bLabel);
    if (sizeDiff !== 0) return sizeDiff;
    return aLabel.localeCompare(bLabel);
  };
  const findingTextStyles = Array.from(textStyles.values())
    .filter((s) => !s.isSourceOfTruth)
    .sort(byFontSize);
  const findingRawTexts = Array.from(rawTexts.values()).sort(byFontSize);
  const findingFontAwesomeTexts = Array.from(fontAwesomeTexts.values()).sort(
    byFontSize,
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
  // Findings: detached suspects + remote library components that aren't CADS.
  // Ignore components authored in this file (local) — they flood the card.
  const findingComponents = Array.from(components.values())
    .filter((c) => !c.isCads && !c.isLocal)
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

  const theme = inferColorThemeAssumption(
    colorModeName,
    selection,
    findingEntries,
    findingPaintStyles,
    findingRawPaints,
  );

  return {
    selectionLabel,
    rootNodeIds: selection.map((n) => n.id),
    colorModeName,
    colorThemeAssumption: theme.colorThemeAssumption,
    manualDarkMode: theme.manualDarkMode,
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
