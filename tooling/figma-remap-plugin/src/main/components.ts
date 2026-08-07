/**
 * Apply DSCO → CADS component instance swaps with prop remapping (Pass 1 Waves A–E).
 *
 * Strategy:
 * 1. Capture variants from componentProperties + variantProperties +
 *    mainComponent.name (name wins — it's the selected variant child)
 * 2. Optional retarget (Show Text=false → bare control)
 * 3. Remap axes/values via componentSwaps rules
 * 4. Strict-match a CADS variant child (every wanted axis must match)
 * 5. swapComponent(exact match) — variants come from the child itself
 * 6. setProperties only for TEXT/BOOLEAN content (label, icons, …)
 * 7. Nested-apply + slot-TEXT for composed sets
 * 8. Verify size/iconOnly/etc. stuck; retry exact swap once if not
 */
import {
  buildContentProperties,
  buildNestedSwapProperties,
  getComponentSwapRule,
  isSourcePropFalsy,
  parseVariantName,
  propBaseName,
  remapVariants,
  resolveCadsComponentKey,
  type CapturedComponentProps,
  type ComponentSwapRule,
  type NestedApplyRule,
  type SlotTextRule,
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

async function findLocalComponentSetByKey(
  key: string,
): Promise<ComponentSetNode | null> {
  for (const page of figma.root.children) {
    try {
      if ("loadAsync" in page) await page.loadAsync();
      const matches = page.findAllWithCriteria({ types: ["COMPONENT_SET"] });
      for (const set of matches) {
        if (set.key === key) return set;
      }
    } catch {
      // Page unavailable / not loaded — try the next one.
    }
  }
  return null;
}

async function importCadsComponentSet(key: string): Promise<ComponentSetNode> {
  const cached = importedSets.get(key);
  if (cached) return cached;
  try {
    const node = await figma.importComponentSetByKeyAsync(key);
    importedSets.set(key, node);
    return node;
  } catch {
    // In the CADS source file, resolve the local set (can't import self).
    const local = await findLocalComponentSetByKey(key);
    if (local) {
      importedSets.set(key, local);
      return local;
    }
    throw new Error(`CADS component set not found for key ${key.slice(0, 8)}…`);
  }
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

function targetPropMeta(
  props: ComponentProperties,
): Record<string, { type: string }> {
  const meta: Record<string, { type: string }> = {};
  for (const [key, prop] of Object.entries(props)) {
    meta[key] = { type: prop.type };
  }
  return meta;
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

  let nestedIconName: string | null = null;
  const nestedIcon = findNestedInstances(instance, ["Tooltip Icon"])[0];
  if (nestedIcon) {
    for (const [key, prop] of Object.entries(nestedIcon.componentProperties)) {
      const base = propBaseName(key).toLocaleLowerCase();
      if (
        (base.includes("icon") || base === "name") &&
        prop.type === "TEXT" &&
        typeof prop.value === "string" &&
        prop.value.trim()
      ) {
        nestedIconName = prop.value.trim();
        break;
      }
    }
  }

  return {
    properties,
    variants,
    capturedText: null,
    tagIconPlacement,
    nestedIconName,
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

function findNestedInstances(
  root: InstanceNode,
  matchNames: string[],
): InstanceNode[] {
  const needles = matchNames.map((n) => n.toLocaleLowerCase());
  const hits: InstanceNode[] = [];
  const walk = (node: SceneNode) => {
    if (node.type === "INSTANCE") {
      const name = node.name.toLocaleLowerCase();
      let setName = "";
      try {
        const main = node.mainComponent;
        if (main?.parent?.type === "COMPONENT_SET") {
          setName = main.parent.name.toLocaleLowerCase();
        }
      } catch {
        // ignore
      }
      if (
        needles.some(
          (n) => name.includes(n) || setName.includes(n) || n.includes(name),
        )
      ) {
        hits.push(node);
      }
    }
    if ("children" in node) {
      for (const child of node.children) walk(child);
    }
  };
  walk(root);
  return hits;
}

async function applyNestedRules(
  instance: InstanceNode,
  nestedRules: NestedApplyRule[],
  captured: CapturedComponentProps,
): Promise<string[]> {
  const warnings: string[] = [];
  for (const nested of nestedRules) {
    const targets = findNestedInstances(instance, nested.matchNames);
    if (targets.length === 0) {
      warnings.push(`nested "${nested.matchNames.join("|")}" not found`);
      continue;
    }
    for (const target of targets) {
      try {
        const props = buildNestedSwapProperties(
          nested,
          captured,
          targetPropMeta(target.componentProperties),
        );
        if (Object.keys(props).length > 0) {
          target.setProperties(props);
        }
      } catch (error) {
        warnings.push(
          `nested "${nested.matchNames[0]}" apply failed: ${String((error as Error).message ?? error)}`,
        );
      }
    }
  }
  return warnings;
}

function findTextInSubtree(
  root: SceneNode,
  matchName: string,
): TextNode | null {
  const needle = matchName.toLocaleLowerCase();
  let found: TextNode | null = null;
  const walk = (node: SceneNode) => {
    if (found) return;
    if (node.type === "TEXT" && node.name.toLocaleLowerCase().includes(needle)) {
      found = node;
      return;
    }
    // Also match parent frame/slot name, then first TEXT child.
    if (
      node.name.toLocaleLowerCase().includes(needle) &&
      "children" in node
    ) {
      for (const child of node.children) {
        if (child.type === "TEXT") {
          found = child;
          return;
        }
      }
    }
    if ("children" in node) {
      for (const child of node.children) walk(child);
    }
  };
  walk(root);
  return found;
}

async function applySlotTextRules(
  instance: InstanceNode,
  slotRules: SlotTextRule[],
  captured: CapturedComponentProps,
): Promise<string[]> {
  const warnings: string[] = [];
  for (const slot of slotRules) {
    let textValue: string | null = null;
    if (slot.useCapturedText) {
      textValue = captured.capturedText;
    } else if (slot.fromProp) {
      for (const [key, value] of Object.entries(captured.properties)) {
        if (
          propBaseName(key) === slot.fromProp &&
          (typeof value === "string" || typeof value === "boolean")
        ) {
          textValue = String(value);
          break;
        }
      }
      if (textValue === null) {
        const v = captured.variants[slot.fromProp];
        if (v !== undefined) textValue = v;
      }
    }
    if (textValue === null || textValue === "") continue;

    const textNode = findTextInSubtree(instance, slot.matchName);
    if (!textNode) {
      warnings.push(`slot TEXT "${slot.matchName}" not found`);
      continue;
    }
    try {
      await figma.loadFontAsync(textNode.fontName as FontName);
      textNode.characters = textValue;
    } catch (error) {
      warnings.push(
        `slot TEXT "${slot.matchName}" write failed: ${String((error as Error).message ?? error)}`,
      );
    }
  }
  return warnings;
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

/** Core axes we must preserve across swaps. */
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
    "role",
    "menuType",
    "menuPlacement",
    "isOn",
    "isActive",
    "isCurrent",
    "status",
    "position",
    "itemType",
    "percentFilled",
    "startsFrom",
    "stepCount",
    "caretPlacement",
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

function resolveEffectiveRule(
  rule: ComponentSwapRule,
  captured: CapturedComponentProps,
  cadsKey: string,
): { rule: ComponentSwapRule; cadsKey: string } {
  if (!rule.retargetWhenFalse) return { rule, cadsKey };
  if (!isSourcePropFalsy(captured, rule.retargetWhenFalse.sourceProp)) {
    return { rule, cadsKey };
  }
  const altName = rule.retargetWhenFalse.cadsName;
  const altKey = resolveCadsComponentKey(altName);
  if (!altKey) return { rule, cadsKey };
  return {
    rule: { ...rule, cadsName: altName },
    cadsKey: altKey,
  };
}

/** Best-effort swap when no Pass 1 prop-remap rule exists (AI / name match). */
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

  const effective = resolveEffectiveRule(rule, captured, cadsKey);
  const activeRule = effective.rule;
  const activeKey = effective.cadsKey;

  const set = await importCadsComponentSet(activeKey);
  const wantVariants = remapVariants(activeRule, captured);
  const critical = criticalAxes(wantVariants);

  // FA Icon / identity sets may only carry style axes; allow empty critical
  // when the set has a default variant and we have no remapped axes.
  const hasAnyWant = Object.keys(wantVariants).length > 0;
  if (Object.keys(critical).length === 0 && !hasAnyWant) {
    // Identity swap (e.g. FA with matching surface) — use default variant.
    const fallback =
      set.defaultVariant ??
      (set.children.find((child) => child.type === "COMPONENT") as
        | ComponentNode
        | undefined);
    if (!fallback || fallback.type !== "COMPONENT") {
      throw new Error(
        `could not read variant props from "${instance.name}"`,
      );
    }
    instance.swapComponent(fallback);
    const content = buildContentProperties(
      activeRule,
      captured,
      targetPropMeta(instance.componentProperties),
    );
    if (Object.keys(content).length > 0) {
      instance.setProperties(content);
    }
    if (activeRule.nestedApply?.length) {
      await applyNestedRules(instance, activeRule.nestedApply, captured);
    }
    if (activeRule.slotText?.length) {
      await applySlotTextRules(instance, activeRule.slotText, captured);
    }
    return;
  }

  // Match on critical axes + state=default when present; fall back without state.
  const wantWithDefault = {
    ...critical,
    ...(wantVariants.state ? { state: "default" } : {}),
  };
  let target =
    findMatchingVariant(set, wantWithDefault) ??
    findMatchingVariant(set, critical) ??
    findMatchingVariant(set, withoutState(wantVariants)) ??
    findMatchingVariant(set, wantVariants);

  if (!target) {
    // Last resort: default variant + setProperties for everything.
    target =
      set.defaultVariant ??
      (set.children.find((child) => child.type === "COMPONENT") as
        | ComponentNode
        | undefined) ??
      null;
    if (!target || target.type !== "COMPONENT") {
      throw new Error(
        `no CADS "${activeRule.cadsName}" variant for ${Object.entries(
          Object.keys(critical).length > 0 ? critical : wantVariants,
        )
          .map(([k, v]) => `${k}=${v}`)
          .join(", ")}`,
      );
    }
    instance.swapComponent(target);
    const all = {
      ...buildContentProperties(
        activeRule,
        captured,
        targetPropMeta(instance.componentProperties),
      ),
    };
    // Try setting variants via setProperties when exact child missing.
    for (const [axis, value] of Object.entries(wantVariants)) {
      const meta = targetPropMeta(instance.componentProperties);
      for (const [key, prop] of Object.entries(instance.componentProperties)) {
        if (prop.type === "VARIANT" && propBaseName(key) === axis) {
          all[key] = value;
          void meta;
        }
      }
    }
    if (Object.keys(all).length > 0) {
      try {
        instance.setProperties(all);
      } catch (error) {
        throw new Error(
          `swapped (default) but props failed: ${String((error as Error).message ?? error)}`,
        );
      }
    }
  } else {
    instance.swapComponent(target);

    // Content only — variants are owned by the matched component child.
    const content = buildContentProperties(
      activeRule,
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
            activeRule,
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

  const nestedWarnings = activeRule.nestedApply?.length
    ? await applyNestedRules(instance, activeRule.nestedApply, captured)
    : [];
  const slotWarnings = activeRule.slotText?.length
    ? await applySlotTextRules(instance, activeRule.slotText, captured)
    : [];
  const warnings = [...nestedWarnings, ...slotWarnings];
  if (warnings.length > 0) {
    // Soft failure — swap succeeded; surface nested/slot issues.
    throw new Error(`swapped with warnings: ${warnings.join("; ")}`);
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
          message.startsWith("swapped but variants drifted:") ||
          message.startsWith("swapped with warnings:") ||
          message.startsWith("swapped (default) but props failed:")
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
 * Propose a component swap: Pass 1 rule first, then deterministic name match
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
