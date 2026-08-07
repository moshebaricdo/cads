/**
 * Apply approved mappings: rebind every recorded usage to the imported target
 * variable, then handle explicit-mode normalization on the audited roots.
 */
import { parseFaFamilyTargetKey } from "../shared/fontAwesome";
import type {
  ApplyFailure,
  ApplyReport,
  ApplyRequest,
  AuditResult,
  UsageRef,
} from "../shared/messages";
import { parseSurfaceSourceId } from "../shared/surfaces";
import { getCollectionCached, safeVariableCollectionId } from "./values";

const nodeCache = new Map<string, SceneNode | null>();

/** Per-corner fields — audit stores one usage/node, apply expands to matches. */
const RADIUS_FIELDS = [
  "topLeftRadius",
  "topRightRadius",
  "bottomLeftRadius",
  "bottomRightRadius",
] as const;

type RadiusField = (typeof RADIUS_FIELDS)[number];

function isRadiusField(field: string): field is RadiusField {
  return (RADIUS_FIELDS as readonly string[]).includes(field);
}

function isAliasLike(value: unknown): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as VariableAlias).type === "VARIABLE_ALIAS" &&
    typeof (value as VariableAlias).id === "string"
  );
}

async function getNode(id: string): Promise<SceneNode | null> {
  if (!nodeCache.has(id)) {
    try {
      nodeCache.set(id, (await figma.getNodeByIdAsync(id)) as SceneNode | null);
    } catch {
      nodeCache.set(id, null);
    }
  }
  return nodeCache.get(id) ?? null;
}

type BindableNode = SceneNode & {
  setBoundVariable: (field: string, variable: Variable) => void;
  boundVariables?: Record<string, unknown>;
};

/**
 * Audit records one radius usage per node. At apply time, rebind every corner
 * on that layer that still matches the audited source (same bound variable, or
 * same unbound px). Corners with other values (e.g. 0) stay untouched.
 */
function rebindRadiusCorners(
  node: BindableNode,
  auditedField: RadiusField,
  variable: Variable,
): void {
  const record = node as unknown as Record<string, unknown>;
  const bound = node.boundVariables ?? {};
  const auditedAlias = bound[auditedField];
  const fieldsToBind: RadiusField[] = [];

  if (isAliasLike(auditedAlias)) {
    for (const field of RADIUS_FIELDS) {
      const alias = bound[field];
      if (isAliasLike(alias) && alias.id === auditedAlias.id) {
        fieldsToBind.push(field);
      }
    }
  } else {
    const sourceValue = record[auditedField];
    if (typeof sourceValue !== "number") {
      fieldsToBind.push(auditedField);
    } else {
      for (const field of RADIUS_FIELDS) {
        if (record[field] !== sourceValue) continue;
        // Leave corners already bound to a different variable alone.
        if (isAliasLike(bound[field])) continue;
        fieldsToBind.push(field);
      }
    }
  }

  if (fieldsToBind.length === 0) {
    fieldsToBind.push(auditedField);
  }
  for (const field of fieldsToBind) {
    node.setBoundVariable(field, variable);
  }
}

async function rebindUsage(usage: UsageRef, variable: Variable): Promise<void> {
  const node = await getNode(usage.nodeId);
  if (!node) throw new Error("node no longer exists");

  if (usage.prop.kind === "paint") {
    const { property, index } = usage.prop;
    const paints = (node as unknown as Record<string, unknown>)[property];
    if (paints === figma.mixed || !Array.isArray(paints)) {
      throw new Error(`${property} changed since audit`);
    }
    const next = paints.slice() as Paint[];
    const paint = next[index];
    if (!paint || paint.type !== "SOLID") {
      throw new Error(`${property}[${index}] changed since audit`);
    }
    next[index] = figma.variables.setBoundVariableForPaint(
      paint,
      "color",
      variable,
    );
    (node as unknown as Record<string, unknown>)[property] = next;
    return;
  }

  if (usage.prop.kind === "effect") {
    const { index } = usage.prop;
    if (!("effects" in node) || !Array.isArray(node.effects)) {
      throw new Error("effects changed since audit");
    }
    const next = node.effects.slice();
    const effect = next[index];
    if (!effect) throw new Error(`effects[${index}] changed since audit`);
    next[index] = figma.variables.setBoundVariableForEffect(
      effect,
      "color",
      variable,
    );
    (node as unknown as { effects: readonly Effect[] }).effects = next;
    return;
  }

  if (usage.prop.kind !== "field") {
    throw new Error("text style usages must be applied via a style mapping");
  }
  const bindable = node as BindableNode;
  if (isRadiusField(usage.prop.field)) {
    rebindRadiusCorners(bindable, usage.prop.field, variable);
    return;
  }
  bindable.setBoundVariable(usage.prop.field, variable);
}

async function applyTextStyle(usage: UsageRef, style: TextStyle): Promise<void> {
  const node = await getNode(usage.nodeId);
  if (!node) throw new Error("node no longer exists");
  if (node.type !== "TEXT") throw new Error("no longer a text node");
  await (node as TextNode).setTextStyleIdAsync(style.id);
}

async function applyFontFamily(
  usage: UsageRef,
  family: string,
): Promise<void> {
  const node = await getNode(usage.nodeId);
  if (!node) throw new Error("node no longer exists");
  if (node.type !== "TEXT") throw new Error("no longer a text node");
  const text = node as TextNode;
  if (text.fontName === figma.mixed) {
    throw new Error("mixed font on layer — apply per-character in Figma");
  }
  const style = text.fontName.style;
  // Only the destination face must load — same missing-font rule as Glyphs.
  try {
    await figma.loadFontAsync({ family, style });
  } catch {
    throw new Error(
      `The font "${family} ${style}" could not be loaded — install the FA7 desktop font (or use your Kit face; kits are already current)`,
    );
  }
  text.fontName = { family, style };
}

function isStyleSource(baseSourceId: string): boolean {
  return baseSourceId.startsWith("style:") || baseSourceId.startsWith("font:");
}

function isFontAwesomeSource(baseSourceId: string): boolean {
  return baseSourceId.startsWith("fontawesome:");
}

async function resolveTargetVariable(
  key: string,
  importedByKey: Map<string, Variable>,
): Promise<Variable | null> {
  const cached = importedByKey.get(key);
  if (cached) return cached;
  try {
    const imported = await figma.variables.importVariableByKeyAsync(key);
    importedByKey.set(key, imported);
    return imported;
  } catch {
    // In the CADS source file, targets are local (library can't self-import).
  }
  try {
    const locals = await figma.variables.getLocalVariablesAsync();
    for (const variable of locals) {
      if (variable.key === key) {
        importedByKey.set(key, variable);
        return variable;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function resolveTargetTextStyle(
  key: string,
  importedStylesByKey: Map<string, TextStyle>,
): Promise<TextStyle | null> {
  const cached = importedStylesByKey.get(key);
  if (cached) return cached;
  try {
    const imported = (await figma.importStyleByKeyAsync(key)) as TextStyle;
    if (imported.type === "TEXT") {
      importedStylesByKey.set(key, imported);
      return imported;
    }
  } catch {
    // Local fallback below.
  }
  try {
    const locals = await figma.getLocalTextStylesAsync();
    for (const style of locals) {
      if (style.key === key) {
        importedStylesByKey.set(key, style);
        return style;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export async function applyMappings(
  request: ApplyRequest,
  audit: AuditResult,
  importedByKey: Map<string, Variable>,
  importedStylesByKey: Map<string, TextStyle>,
): Promise<ApplyReport> {
  nodeCache.clear();
  const failures: ApplyFailure[] = [];
  let usagesRebound = 0;
  let variablesRemapped = 0;

  const sourceById = new Map<string, { name: string; usages: UsageRef[] }>();
  for (const entry of audit.entries) {
    sourceById.set(entry.id, { name: entry.name, usages: entry.usages });
  }
  for (const style of audit.paintStyles) {
    sourceById.set(style.id, { name: style.name, usages: style.usages });
  }
  for (const raw of audit.rawPaints) {
    sourceById.set(raw.id, { name: raw.hex, usages: raw.usages });
  }
  for (const entry of audit.textStyles) {
    sourceById.set(entry.id, { name: entry.name, usages: entry.usages });
  }
  for (const raw of audit.rawTexts) {
    sourceById.set(raw.id, { name: raw.label, usages: raw.usages });
  }
  for (const fa of audit.fontAwesomeTexts) {
    sourceById.set(fa.id, { name: fa.label, usages: fa.usages });
  }
  for (const raw of audit.rawRadii) {
    sourceById.set(raw.id, { name: `radius ${raw.label}`, usages: raw.usages });
  }

  for (const mapping of request.mappings) {
    const { baseId } = parseSurfaceSourceId(mapping.sourceId);
    const source = sourceById.get(baseId);
    const faFamily = parseFaFamilyTargetKey(mapping.targetKey);
    const styleTarget = isStyleSource(baseId);
    const faTarget = isFontAwesomeSource(baseId) || Boolean(faFamily);

    let variable: Variable | null = null;
    let style: TextStyle | null = null;
    if (faTarget) {
      // Font family upgrade — no variable/style import.
    } else if (styleTarget) {
      style = await resolveTargetTextStyle(
        mapping.targetKey,
        importedStylesByKey,
      );
    } else {
      variable = await resolveTargetVariable(mapping.targetKey, importedByKey);
    }
    if (!source || (faTarget ? !faFamily : !variable && !style)) {
      failures.push({
        nodeName: "—",
        sourceName: source?.name ?? mapping.sourceId,
        reason: faTarget
          ? "target Font Awesome 7 family missing"
          : styleTarget
            ? "target text style could not be imported"
            : "target variable could not be imported",
      });
      continue;
    }
    let reboundForSource = 0;
    const usages =
      mapping.usageIndexes === undefined
        ? source.usages
        : mapping.usageIndexes
            .map((index) => source.usages[index])
            .filter((usage): usage is UsageRef => Boolean(usage));
    for (const usage of usages) {
      try {
        if (faFamily) await applyFontFamily(usage, faFamily);
        else if (style) await applyTextStyle(usage, style);
        else await rebindUsage(usage, variable!);
        reboundForSource++;
      } catch (error) {
        failures.push({
          nodeName: usage.nodeName,
          sourceName: source.name,
          reason:
            usage.inInstance
              ? `inside a component instance — fix at the source component (${String(
                  (error as Error).message ?? error,
                )})`
              : String((error as Error).message ?? error),
        });
      }
    }
    usagesRebound += reboundForSource;
    if (reboundForSource > 0) variablesRemapped++;
  }

  let modesSet = 0;
  let modesCleared = 0;

  if (request.setMode) {
    const anyImported = Array.from(importedByKey.values())[0];
    // Find the imported collection matching the requested collection key.
    let targetCollection: VariableCollection | null = null;
    for (const variable of importedByKey.values()) {
      const collectionId = safeVariableCollectionId(variable);
      if (!collectionId) continue;
      const collection = await getCollectionCached(collectionId);
      if (collection && collection.key === request.setMode.collectionKey) {
        targetCollection = collection;
        break;
      }
    }
    if (!targetCollection && anyImported) {
      const fallbackId = safeVariableCollectionId(anyImported);
      if (fallbackId) {
        targetCollection = await getCollectionCached(fallbackId);
      }
    }
    const modeName = request.setMode.modeName;
    const mode = targetCollection?.modes.find((m) => m.name === modeName);
    if (targetCollection && mode) {
      for (const rootId of audit.rootNodeIds) {
        const node = await getNode(rootId);
        if (node && "setExplicitVariableModeForCollection" in node) {
          try {
            (node as SceneNode & {
              setExplicitVariableModeForCollection: (
                collection: VariableCollection,
                modeId: string,
              ) => void;
            }).setExplicitVariableModeForCollection(targetCollection, mode.modeId);
            modesSet++;
          } catch (error) {
            failures.push({
              nodeName: node.name,
              sourceName: `mode → ${modeName}`,
              reason: String((error as Error).message ?? error),
            });
          }
        }
      }
    } else {
      failures.push({
        nodeName: "—",
        sourceName: `mode → ${modeName}`,
        reason: "mode not found in the source-of-truth collection",
      });
    }
  }

  if (request.clearForeignModes) {
    const seen = new Set<string>();
    for (const entry of audit.explicitModes) {
      if (entry.isSourceOfTruth) continue;
      const dedupeKey = `${entry.nodeId}/${entry.collectionId}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      const node = await getNode(entry.nodeId);
      const collection = await getCollectionCached(entry.collectionId);
      if (!node || !collection) continue;
      if (!("clearExplicitVariableModeForCollection" in node)) continue;
      try {
        (node as SceneNode & {
          clearExplicitVariableModeForCollection: (
            collection: VariableCollection,
          ) => void;
        }).clearExplicitVariableModeForCollection(collection);
        modesCleared++;
      } catch (error) {
        failures.push({
          nodeName: entry.nodeName,
          sourceName: `clear ${entry.collectionName} mode`,
          reason: String((error as Error).message ?? error),
        });
      }
    }
  }

  return {
    usagesRebound,
    variablesRemapped,
    componentsSwapped: 0,
    modesSet,
    modesCleared,
    failures,
  };
}
