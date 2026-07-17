/**
 * Resolve a ColorSystem export JSON into flat CSS variable maps
 * (e.g. --background-brand-primary). No --ds- prefix — matches prod / Figma
 * semantic paths. Naming must stay in sync with Lab2 colorSystemCssExport.ts
 * (`semanticExportVarName` / FLAT_SUBGROUPS / SINGLE_FAMILY_SUBGROUPS).
 */

const DEFAULT_SEMANTIC_FAMILY_SUBGROUP = {
  neutral: "neutral",
  teal: "brand",
  purple: "brand",
  aqua: "brand",
  strawberry: "brand",
  orange: "brand",
  error: "sentiment",
  warning: "sentiment",
  success: "sentiment",
  info: "sentiment",
  alpha: "neutral",
  "alpha-2": "neutral",
};

/** Matches colorSystemCssExport.ts — sentiment/state omit subgroup from the name. */
const FLAT_SUBGROUPS = new Set(["sentiment", "state"]);

/** Matches colorSystemCssExport.ts — brand collapses its single family name. */
const SINGLE_FAMILY_SUBGROUPS = new Set(["brand"]);

function slugify(value) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-") || "family"
  );
}

function exportSurface(surface) {
  const s = slugify(surface);
  return s === "borders" ? "border" : s;
}

function semanticSubGroupForFamily(system, familyKey) {
  return (
    system.semanticFamilySubGroups?.[familyKey] ??
    DEFAULT_SEMANTIC_FAMILY_SUBGROUP[familyKey] ??
    "accent"
  );
}

function semanticFamilyPathSegment(system, familyKey) {
  const family = system.semanticFamilies?.find((item) => item.id === familyKey);
  return slugify(family?.name ?? familyKey);
}

/**
 * Prod-style semantic variable name — mirror of semanticExportVarName().
 * `{surface}-{subgroup?}-{family?}-{role}` with brand collapse + flat state/sentiment.
 */
export function semanticExportVarName(system, token) {
  const subGroupId = semanticSubGroupForFamily(system, token.familyKey);
  const subGroup = system.semanticSubGroups?.find((item) => item.id === subGroupId);
  const subName = slugify(subGroup?.name ?? subGroupId);
  const familySegment = slugify(semanticFamilyPathSegment(system, token.familyKey));

  const parts = [exportSurface(token.surface)];
  if (!FLAT_SUBGROUPS.has(subName)) parts.push(subName);
  if (
    !SINGLE_FAMILY_SUBGROUPS.has(subName) &&
    familySegment !== subName &&
    familySegment !== parts[parts.length - 1]
  ) {
    parts.push(familySegment);
  }
  parts.push(slugify(token.role));
  return parts.join("-");
}

function buildStepIndex(system) {
  const steps = new Map();
  for (const family of system.families ?? []) {
    for (const step of family.steps ?? []) {
      steps.set(step.id, step);
    }
  }
  return steps;
}

function semanticHex(system, token, mode, steps, cache = new Map(), stack = new Set()) {
  const cacheKey = `${token.id}::${mode}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  if (stack.has(token.id)) {
    return token.fallbackHex?.[mode]?.toUpperCase() ?? null;
  }
  stack.add(token.id);

  let resolved = null;
  const refId = token.ref?.[mode];
  if (refId) {
    const step = steps.get(refId);
    if (step?.hex) resolved = step.hex.toUpperCase();
  }
  if (!resolved) {
    const semanticRef = token.semanticRef?.[mode];
    if (semanticRef) {
      const target = system.semantics?.find((item) => item.id === semanticRef);
      if (target) {
        resolved = semanticHex(system, target, mode, steps, cache, stack);
      }
    }
  }
  if (!resolved) {
    const fallback = token.fallbackHex?.[mode];
    resolved = fallback ? fallback.toUpperCase() : null;
  }

  stack.delete(token.id);
  if (resolved) cache.set(cacheKey, resolved);
  return resolved;
}

/**
 * @param {object} system ColorSystem JSON
 * @param {"light"|"dark"} mode
 * @returns {Map<string, string>}
 */
export function resolveColorSystemToCssVars(system, mode) {
  const steps = buildStepIndex(system);
  const output = new Map();

  for (const token of system.semantics ?? []) {
    const hex = semanticHex(system, token, mode, steps);
    if (!hex) continue;
    output.set(semanticExportVarName(system, token), hex);
  }

  return output;
}

export function colorSystemToCssVarBlock(system, mode, indent = "  ") {
  const vars = resolveColorSystemToCssVars(system, mode);
  return [...vars.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${indent}--${name}: ${value};`)
    .join("\n");
}
