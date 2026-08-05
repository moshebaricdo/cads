/**
 * Apply approved mappings: rebind every recorded usage to the imported target
 * variable, then handle explicit-mode normalization on the audited roots.
 */
import type {
  ApplyFailure,
  ApplyReport,
  ApplyRequest,
  AuditResult,
  UsageRef,
} from "../shared/messages";
import { getCollectionCached } from "./values";

const nodeCache = new Map<string, SceneNode | null>();

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
  (node as SceneNode & {
    setBoundVariable: (field: string, variable: Variable) => void;
  }).setBoundVariable(usage.prop.field, variable);
}

async function applyTextStyle(usage: UsageRef, style: TextStyle): Promise<void> {
  const node = await getNode(usage.nodeId);
  if (!node) throw new Error("node no longer exists");
  if (node.type !== "TEXT") throw new Error("no longer a text node");
  await (node as TextNode).setTextStyleIdAsync(style.id);
}

function isStyleSource(sourceId: string): boolean {
  return sourceId.startsWith("style:") || sourceId.startsWith("font:");
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
  for (const raw of audit.rawRadii) {
    sourceById.set(raw.id, { name: `radius ${raw.label}`, usages: raw.usages });
  }

  for (const mapping of request.mappings) {
    const source = sourceById.get(mapping.sourceId);
    const styleTarget = isStyleSource(mapping.sourceId);

    let variable: Variable | null = null;
    let style: TextStyle | null = null;
    if (styleTarget) {
      style =
        importedStylesByKey.get(mapping.targetKey) ??
        ((await figma
          .importStyleByKeyAsync(mapping.targetKey)
          .catch(() => null)) as TextStyle | null);
    } else {
      variable =
        importedByKey.get(mapping.targetKey) ??
        (await figma.variables
          .importVariableByKeyAsync(mapping.targetKey)
          .catch(() => null));
    }
    if (!source || (!variable && !style)) {
      failures.push({
        nodeName: "—",
        sourceName: source?.name ?? mapping.sourceId,
        reason: styleTarget
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
        if (style) await applyTextStyle(usage, style);
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
      const collection = await getCollectionCached(variable.variableCollectionId);
      if (collection && collection.key === request.setMode.collectionKey) {
        targetCollection = collection;
        break;
      }
    }
    if (!targetCollection && anyImported) {
      targetCollection = await getCollectionCached(
        anyImported.variableCollectionId,
      );
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

  return { usagesRebound, variablesRemapped, modesSet, modesCleared, failures };
}
