/**
 * Apply DSCO → CADS component instance swaps with prop remapping (Wave A+B).
 *
 * Strategy:
 * 1. Capture variants from componentProperties + variantProperties +
 *    mainComponent.name (name wins — it's the selected variant child)
 * 2. Remap axes/values via componentSwaps rules
 * 3. Strict-match a CADS variant child (every wanted axis must match)
 * 4. swapComponent(exact match) — variants come from the child itself
 * 5. setProperties only for TEXT/BOOLEAN content (label, icons, …)
 * 6. Verify size/iconOnly/etc. stuck; retry exact swap once if not
 */
import {
  buildContentProperties,
  getComponentSwapRule,
  parseVariantName,
  propBaseName,
  remapVariants,
  resolveCadsComponentKey,
  type CapturedComponentProps,
  type ComponentSwapRule,
} from "../data/componentSwaps";
import { suggestCadsComponent } from "../data/dscoComponents";
import type {
  ApplyFailure,
  ApplyRequest,
  AuditResult,
  MappingProposal,
  UsageRef,
} from "../shared/messages";

export interface ComponentSwapReport {
  swapped: number;
  failures: ApplyFailure[];
}

const importedSets = new Map<string, ComponentSetNode>();

async function importCadsComponentSet(key: string): Promise<ComponentSetNode> {
  const cached = importedSets.get(key);
  if (cached) return cached;
  const node = await figma.importComponentSetByKeyAsync(key);
  importedSets.set(key, node);
  return node;
}

async function getInstance(nodeId: string): Promise<InstanceNode | null> {
  try {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type !== "INSTANCE") return null;
    return node;
  } catch {
    return null;
  }
}

function sourceNameFor(
  audit: AuditResult,
  sourceId: string,
): { name: string; usages: UsageRef[]; dscoKey: string } | null {
  if (!sourceId.startsWith("component:")) return null;
  const key = sourceId.slice("component:".length);
  const entry = audit.components.find((component) => component.key === key);
  if (!entry) return null;
  return { name: entry.name, usages: entry.usages, dscoKey: entry.key };
}

async function captureInstanceProps(
  instance: InstanceNode,
): Promise<CapturedComponentProps> {
  const properties: Record<string, string | boolean> = {};
  const variants: Record<string, string> = {};

  for (const [key, prop] of Object.entries(instance.componentProperties)) {
    if (prop.type === "VARIANT") {
      variants[propBaseName(key)] = String(prop.value).trim();
      properties[key] = String(prop.value);
    } else if (prop.type === "BOOLEAN") {
      properties[key] = Boolean(prop.value);
    } else if (prop.type === "TEXT") {
      properties[key] = String(prop.value);
    }
  }

  if (instance.variantProperties) {
    for (const [axis, value] of Object.entries(instance.variantProperties)) {
      if (typeof value === "string") variants[axis] = value.trim();
    }
  }

  try {
    const main = await instance.getMainComponentAsync();
    if (main) {
      const fromName = parseVariantName(main.name);
      for (const [axis, value] of Object.entries(fromName)) {
        variants[axis] = value.trim();
      }
    }
  } catch {
    // keep property-based capture
  }

  // Normalize legacy / spaced axis aliases onto canonical keys.
  const aliases: Record<string, string> = {
    Size: "size",
    State: "state",
    Color: "color",
    Variant: "variant",
    "Icon Only": "iconOnly",
    IconOnly: "iconOnly",
    Type: "type",
    Selected: "selected",
  };
  for (const [from, to] of Object.entries(aliases)) {
    if (variants[from] !== undefined && variants[to] === undefined) {
      variants[to] = variants[from];
    }
  }

  let tagIconPlacement: CapturedComponentProps["tagIconPlacement"] = null;
  const iconAxis = variants.Icon ?? variants.icon;
  if (iconAxis === "Left" || iconAxis === "Right" || iconAxis === "None") {
    tagIconPlacement = iconAxis;
  }

  return {
    properties,
    variants,
    capturedText: null,
    tagIconPlacement,
  };
}

function captureFirstText(instance: InstanceNode): string | null {
  const texts: TextNode[] = [];
  const walk = (node: SceneNode) => {
    if (node.type === "TEXT") texts.push(node);
    if ("children" in node) {
      for (const child of node.children) walk(child);
    }
  };
  for (const child of instance.children) walk(child);
  const text = texts[0];
  return text && typeof text.characters === "string" ? text.characters : null;
}

function targetPropMeta(
  props: ComponentProperties,
): Record<string, { type: string }> {
  const meta: Record<string, { type: string }> = {};
  for (const [key, prop] of Object.entries(props)) {
    meta[key] = { type: prop.type };
  }
  return meta;
}

/**
 * Strict match: every axis in `want` must be present on the child and equal.
 * Prefer state=default when multiple states match.
 */
function findMatchingVariant(
  set: ComponentSetNode,
  want: Record<string, string>,
): ComponentNode | null {
  const wantEntries = Object.entries(want);
  if (wantEntries.length === 0) return null;

  const matches: ComponentNode[] = [];
  for (const child of set.children) {
    if (child.type !== "COMPONENT") continue;
    const got = parseVariantName(child.name);
    let ok = true;
    for (const [axis, value] of wantEntries) {
      if (got[axis] !== value) {
        ok = false;
        break;
      }
    }
    if (ok) matches.push(child);
  }
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];

  const defaultState = matches.find((child) => {
    const got = parseVariantName(child.name);
    return (got.state ?? "").toLocaleLowerCase() === "default";
  });
  return defaultState ?? matches[0];
}

function readVariants(instance: InstanceNode): Record<string, string> {
  const out: Record<string, string> = {};
  if (instance.variantProperties) {
    for (const [axis, value] of Object.entries(instance.variantProperties)) {
      if (typeof value === "string") out[axis] = value;
    }
  }
  for (const [key, prop] of Object.entries(instance.componentProperties)) {
    if (prop.type === "VARIANT") out[propBaseName(key)] = String(prop.value);
  }
  return out;
}

function variantsMatch(
  actual: Record<string, string>,
  want: Record<string, string>,
): string[] {
  const missing: string[] = [];
  for (const [axis, value] of Object.entries(want)) {
    if (actual[axis] !== value) {
      missing.push(`${axis}=${value} (got ${actual[axis] ?? "∅"})`);
    }
  }
  return missing;
}

/** Core axes we must preserve across swaps (Button-like + FA Icon). */
function criticalAxes(want: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const axis of [
    "size",
    "variant",
    "color",
    "iconOnly",
    "selected",
    "type",
    "labelStyle",
    "sentiment",
    "fillStyle",
    // Font Awesome Icon / Duotone
    "style",
    "padding",
    "scale",
    "family",
  ]) {
    if (want[axis] !== undefined) out[axis] = want[axis];
  }
  return out;
}

function withoutState(
  want: Record<string, string>,
): Record<string, string> {
  const { state: _state, ...rest } = want;
  return rest;
}

/** Best-effort swap when no Wave A/B prop-remap rule exists (AI / name match). */
async function swapSimple(
  instance: InstanceNode,
  cadsKey: string,
): Promise<void> {
  const set = await importCadsComponentSet(cadsKey);
  const target =
    set.defaultVariant ??
    (set.children.find((child) => child.type === "COMPONENT") as
      | ComponentNode
      | undefined);
  if (!target || target.type !== "COMPONENT") {
    throw new Error("CADS component set has no default variant to swap to");
  }
  instance.swapComponent(target);
}

async function swapOne(
  instance: InstanceNode,
  rule: ComponentSwapRule,
  cadsKey: string,
): Promise<void> {
  const captured = await captureInstanceProps(instance);
  if (rule.captureText) {
    captured.capturedText = captureFirstText(instance);
  }

  const set = await importCadsComponentSet(cadsKey);
  const wantVariants = remapVariants(rule, captured);
  const critical = criticalAxes(wantVariants);

  if (Object.keys(critical).length === 0 && Object.keys(wantVariants).length === 0) {
    throw new Error(
      `could not read variant props from "${instance.name}"`,
    );
  }

  // Match on critical axes + state=default when present; fall back without state.
  const wantWithDefault = { ...critical, ...(wantVariants.state ? { state: "default" } : {}) };
  let target =
    findMatchingVariant(set, wantWithDefault) ??
    findMatchingVariant(set, critical) ??
    findMatchingVariant(set, withoutState(wantVariants)) ??
    findMatchingVariant(set, wantVariants);

  if (!target) {
    throw new Error(
      `no CADS "${rule.cadsName}" variant for ${Object.entries(
        Object.keys(critical).length > 0 ? critical : wantVariants,
      )
        .map(([k, v]) => `${k}=${v}`)
        .join(", ")}`,
    );
  }

  instance.swapComponent(target);

  // Content only — variants are owned by the matched component child.
  // (Re-setting variants via setProperties was throwing and aborting apply.)
  const content = buildContentProperties(
    rule,
    captured,
    targetPropMeta(instance.componentProperties),
  );
  if (Object.keys(content).length > 0) {
    try {
      instance.setProperties(content);
    } catch (error) {
      throw new Error(
        `swapped but content props failed: ${String((error as Error).message ?? error)}`,
      );
    }
  }

  if (Object.keys(critical).length > 0) {
    let mismatches = variantsMatch(readVariants(instance), critical);
    if (mismatches.length > 0) {
      const retry =
        findMatchingVariant(set, wantWithDefault) ??
        findMatchingVariant(set, critical);
      if (retry) {
        instance.swapComponent(retry);
        const content2 = buildContentProperties(
          rule,
          captured,
          targetPropMeta(instance.componentProperties),
        );
        if (Object.keys(content2).length > 0) {
          try {
            instance.setProperties(content2);
          } catch {
            // variants matter more than content on retry
          }
        }
      }
      mismatches = variantsMatch(readVariants(instance), critical);
      if (mismatches.length > 0) {
        throw new Error(
          `swapped but variants drifted: ${mismatches.join("; ")}`,
        );
      }
    }
  }
}

export async function applyComponentSwaps(
  request: ApplyRequest,
  audit: AuditResult,
): Promise<ComponentSwapReport> {
  importedSets.clear();
  const failures: ApplyFailure[] = [];
  let swapped = 0;

  for (const mapping of request.mappings) {
    if (!mapping.sourceId.startsWith("component:")) continue;
    const source = sourceNameFor(audit, mapping.sourceId);
    if (!source) {
      failures.push({
        nodeName: "—",
        sourceName: mapping.sourceId,
        reason: "component finding no longer in audit",
      });
      continue;
    }

    const rule = getComponentSwapRule(source.dscoKey);

    const usages =
      mapping.usageIndexes === undefined
        ? source.usages
        : mapping.usageIndexes
            .map((index) => source.usages[index])
            .filter((usage): usage is UsageRef => Boolean(usage));

    for (const usage of usages) {
      const instance = await getInstance(usage.nodeId);
      if (!instance) {
        failures.push({
          nodeName: usage.nodeName,
          sourceName: source.name,
          reason: "instance no longer exists or is not an INSTANCE",
        });
        continue;
      }
      try {
        if (rule) {
          await swapOne(instance, rule, mapping.targetKey);
        } else {
          await swapSimple(instance, mapping.targetKey);
        }
        swapped++;
      } catch (error) {
        const message = String((error as Error).message ?? error);
        if (
          message.startsWith("swapped but content props failed:") ||
          message.startsWith("swapped but variants drifted:")
        ) {
          swapped++;
        }
        failures.push({
          nodeName: usage.nodeName,
          sourceName: source.name,
          reason: message,
        });
      }
    }
  }

  return { swapped, failures };
}

/**
 * Propose a component swap: Wave A/B rule first, then deterministic name match
 * to a published CADS component (simple default-variant swap on apply).
 */
export function proposeComponentSwap(entry: {
  key: string;
  name: string;
}): MappingProposal | null {
  const rule = getComponentSwapRule(entry.key);
  if (rule) {
    const targetKey = resolveCadsComponentKey(rule.cadsName);
    if (!targetKey) return null;
    return {
      sourceId: `component:${entry.key}`,
      targetKey,
      source: "rule",
      confidence: 0.95,
      rationale: `Swap ${rule.dscoName} → ${rule.cadsName} with prop remap`,
    };
  }

  const suggested = suggestCadsComponent({ key: entry.key, name: entry.name });
  if (!suggested) {
    // Unresolved — leave for AI / manual pick (still emit an empty proposal
    // so the fix panel can show the row).
    return {
      sourceId: `component:${entry.key}`,
      targetKey: null,
      source: "none",
      confidence: 0,
    };
  }
  const targetKey = resolveCadsComponentKey(suggested);
  if (!targetKey) {
    return {
      sourceId: `component:${entry.key}`,
      targetKey: null,
      source: "none",
      confidence: 0,
    };
  }
  return {
    sourceId: `component:${entry.key}`,
    targetKey,
    source: "exact-name",
    confidence: 0.8,
    rationale: `Name match → ${suggested} (default variant; verify props)`,
  };
}
