/**
 * Prod-shaped CSS export for CADS color variables.
 *
 * Generates the two files product ingest expects:
 *  - primitiveColors.css — flat `:root` of primitive hex values
 *  - colors.css          — semantic tokens referencing primitives via var(),
 *                          with Light (`:root, [data-theme='Light']`) and
 *                          Dark (`[data-theme='Dark']`) blocks
 *
 * Names are derived from collection / family / subgroup display names (never
 * internal stable ids), matching Lab2 colorSystemCssExport.
 */

export type ThemeKey = "light" | "dark";

export type PrimitiveStep = {
  id: string;
  step: string;
  hex: string;
};

export type PrimitiveFamily = {
  id: string;
  collectionId: string;
  name: string;
  stepped?: boolean;
  steps: PrimitiveStep[];
};

export type SemanticToken = {
  id: string;
  surface: string;
  familyKey: string;
  role: string;
  ref: Record<ThemeKey, string | null>;
  semanticRef?: Record<ThemeKey, string | null>;
  fallbackHex: Record<ThemeKey, string>;
  comments?: Partial<Record<ThemeKey, string>>;
};

export type ColorSystemExportDoc = {
  collections?: { id: string; name: string }[];
  families?: PrimitiveFamily[];
  semanticCollections?: { id: string; name: string }[];
  semanticSubGroups?: { id: string; name: string }[];
  semanticFamilies?: { id: string; name: string }[];
  semanticFamilySubGroups?: Record<string, string>;
  semantics?: SemanticToken[];
};

/** Fully transparent sentinel — unset steps are omitted from export. */
export const UNSET_PRIMITIVE_HEX = "#00000000";

export function isUnsetPrimitiveHex(hex: string): boolean {
  return hex.toUpperCase() === UNSET_PRIMITIVE_HEX;
}

const DEFAULT_SEMANTIC_FAMILY_SUBGROUP: Record<string, string> = {
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

/** Sentiment/state omit subgroup from the name. */
const FLAT_SUBGROUPS = new Set(["sentiment", "state"]);

/** Brand collapses its single family name. */
const SINGLE_FAMILY_SUBGROUPS = new Set(["brand"]);

function slug(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-") || "unnamed"
  );
}

function exportSurface(surface: string): string {
  const s = slug(surface);
  return s === "borders" ? "border" : s;
}

function semanticSubGroupForFamily(
  system: ColorSystemExportDoc,
  familyKey: string,
): string {
  return (
    system.semanticFamilySubGroups?.[familyKey] ??
    DEFAULT_SEMANTIC_FAMILY_SUBGROUP[familyKey] ??
    "accent"
  );
}

export function primitiveVarName(
  family: PrimitiveFamily,
  step: PrimitiveStep,
): string {
  return `${slug(family.collectionId)}-${slug(family.name)}-${slug(step.step)}`;
}

/**
 * Prod-style semantic variable name.
 * `{surface}-{subgroup?}-{family?}-{role}` with brand collapse + flat state/sentiment.
 */
export function semanticExportVarName(
  system: ColorSystemExportDoc,
  token: Pick<SemanticToken, "surface" | "familyKey" | "role">,
): string {
  const subGroupId = semanticSubGroupForFamily(system, token.familyKey);
  const subGroup = system.semanticSubGroups?.find(
    (item) => item.id === subGroupId,
  );
  const subName = slug(subGroup?.name ?? subGroupId);
  const family = system.semanticFamilies?.find(
    (item) => item.id === token.familyKey,
  );
  const familySegment = slug(family?.name ?? token.familyKey);

  const parts = [exportSurface(token.surface)];
  if (!FLAT_SUBGROUPS.has(subName)) parts.push(subName);
  if (
    !SINGLE_FAMILY_SUBGROUPS.has(subName) &&
    familySegment !== subName &&
    familySegment !== parts[parts.length - 1]
  ) {
    parts.push(familySegment);
  }
  parts.push(slug(token.role));
  return parts.join("-");
}

/* ---------------------------------------------------------------------------
 * Ordering
 *
 * Semantic tokens are grouped (not alphabetized) for readability:
 *   surface:  background, border, text
 *   group:    neutral, brand, sentiment (error, warning, success, info),
 *             accent, state
 *   roles:    primary first, then the ramp (light, mid, strong), then the
 *             neutral ordinals, then special cases (fixed, inverse, disabled,
 *             …), with neutral alphas last (numeric, 5 before 10).
 * ------------------------------------------------------------------------- */

const SURFACE_RANK: Record<string, number> = {
  background: 0,
  border: 1,
  text: 2,
};
const GROUP_RANK: Record<string, number> = {
  neutral: 0,
  brand: 1,
  sentiment: 2,
  accent: 3,
  state: 4,
};
const SENTIMENT_FAMILY_RANK: Record<string, number> = {
  error: 0,
  warning: 1,
  success: 2,
  info: 3,
};
const ROLE_RANK: string[] = [
  "primary",
  "light",
  "mid",
  "strong",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
  "senary",
  "septenary",
  "octonary",
  "hover",
  "primary-fixed",
  "primary-inverse",
  "disabled",
  "disabled-inverse",
  "placeholder",
  "solid",
  "true-base",
  "black-fixed",
  "white-fixed",
];

interface ParsedSemanticName {
  surfaceRank: number;
  groupRank: number;
  familyRank: number;
  roleRank: number;
  role: string;
}

function parseSemanticExportName(name: string): ParsedSemanticName {
  const segments = name.split("-");
  const surface = segments[0];
  const surfaceRank = SURFACE_RANK[surface] ?? 99;

  let group: string;
  let familyRank = 0;
  let roleSegments: string[];

  if (segments[1] === "neutral") {
    group = "neutral";
    if (segments[2] === "alpha") {
      return {
        surfaceRank,
        groupRank: GROUP_RANK.neutral,
        familyRank: 1,
        roleRank: 1000 + Number(segments[3] ?? 0),
        role: segments.slice(3).join("-"),
      };
    }
    roleSegments = segments.slice(2);
  } else if (segments[1] === "brand") {
    group = "brand";
    roleSegments = segments.slice(2);
  } else if (segments[1] === "accent" || segments[1] === "state") {
    group = segments[1];
    roleSegments = segments.slice(3);
    const family = segments[2] ?? "";
    return {
      surfaceRank,
      groupRank: GROUP_RANK[group] ?? 99,
      familyRank: family.charCodeAt(0) || 0,
      roleRank: roleRankOf(roleSegments.join("-")),
      role: roleSegments.join("-"),
    };
  } else {
    group = "sentiment";
    familyRank = SENTIMENT_FAMILY_RANK[segments[1]] ?? 99;
    roleSegments = segments.slice(2);
  }

  const role = roleSegments.join("-");
  return {
    surfaceRank,
    groupRank: GROUP_RANK[group] ?? 99,
    familyRank,
    roleRank: roleRankOf(role),
    role,
  };
}

function roleRankOf(role: string): number {
  const index = ROLE_RANK.indexOf(role);
  return index === -1 ? 500 : index;
}

/** Grouped, prod-readable ordering for exported semantic variable names. */
export function compareSemanticExportNames(a: string, b: string): number {
  const pa = parseSemanticExportName(a);
  const pb = parseSemanticExportName(b);
  return (
    pa.surfaceRank - pb.surfaceRank ||
    pa.groupRank - pb.groupRank ||
    pa.familyRank - pb.familyRank ||
    pa.roleRank - pb.roleRank ||
    a.localeCompare(b)
  );
}

/**
 * Primitive ordering: families alphabetical, steps numeric within a family
 * (5 before 10), non-numeric steps last.
 */
export function comparePrimitiveExportNames(a: string, b: string): number {
  const splitStep = (name: string): [string, number] => {
    const match = name.match(/^(.*)-(\d+)$/);
    return match ? [match[1], Number(match[2])] : [name, Number.NaN];
  };
  const [famA, stepA] = splitStep(a);
  const [famB, stepB] = splitStep(b);
  if (famA !== famB) {
    const purpleA = famA === "brand-purple" ? 0 : 1;
    const purpleB = famB === "brand-purple" ? 0 : 1;
    if (purpleA !== purpleB) return purpleA - purpleB;
    return a.localeCompare(b);
  }
  if (Number.isNaN(stepA) || Number.isNaN(stepB)) return a.localeCompare(b);
  return stepA - stepB;
}

function cssBlock(
  selector: string,
  sortedLines: Array<[string, string, string?]>,
): string {
  const body = sortedLines
    .flatMap(([name, value, comment]) => [
      ...(comment ? [`  /* ${comment} */`] : []),
      `  --${name}: ${value};`,
    ])
    .join("\n");
  return `${selector} {\n${body}\n}`;
}

export function buildPrimitiveColorsCss(system: ColorSystemExportDoc): string {
  const lines: Array<[string, string]> = [];
  const seen = new Set<string>();
  for (const family of system.families ?? []) {
    for (const step of family.steps ?? []) {
      if (isUnsetPrimitiveHex(step.hex)) continue;
      let name = primitiveVarName(family, step);
      while (seen.has(name)) name = `${name}-dup`;
      seen.add(name);
      lines.push([name, step.hex.toLowerCase()]);
    }
  }

  return [
    "/* Primitive Colors */",
    "",
    "/* This file consists of primitive color tokens. These values are fixed, theme-agnostic and defined at the level of the brand guidelines. */",
    "",
    "/* Aim to use semantic color tokens (colors.css) over primitive colors in the majority of cases. Primitive colors may be used for components that are truly theme-agnostic and have no semantic meaning. */",
    "",
    "/* Generated from CADS color variables — do not hand-edit; check with the design team first and then re-export from the Color foundation page. */",
    "",
    "/* stylelint-disable color-hex-length */",
    cssBlock(
      ":root",
      [...lines].sort(([a], [b]) => comparePrimitiveExportNames(a, b)),
    ),
    "",
  ].join("\n");
}

function tokenValue(
  system: ColorSystemExportDoc,
  token: SemanticToken,
  mode: ThemeKey,
  stepById: Map<string, PrimitiveStep>,
  familyByStepId: Map<string, PrimitiveFamily>,
): string {
  const refId = token.ref?.[mode];
  if (refId) {
    const step = stepById.get(refId);
    const family = familyByStepId.get(refId);
    if (step && family) return `var(--${primitiveVarName(family, step)})`;
  }
  const semanticRefId = token.semanticRef?.[mode];
  if (semanticRefId) {
    const target = system.semantics?.find((item) => item.id === semanticRefId);
    if (target) return `var(--${semanticExportVarName(system, target)})`;
  }
  const fallback = token.fallbackHex?.[mode];
  return fallback ? fallback.toLowerCase() : "transparent";
}

export function buildSemanticColorsCss(system: ColorSystemExportDoc): string {
  const stepById = new Map<string, PrimitiveStep>();
  const familyByStepId = new Map<string, PrimitiveFamily>();
  for (const family of system.families ?? []) {
    for (const step of family.steps ?? []) {
      stepById.set(step.id, step);
      familyByStepId.set(step.id, family);
    }
  }

  const buildLines = (mode: ThemeKey): Array<[string, string, string?]> => {
    const lines: Array<[string, string, string?]> = [];
    const seen = new Set<string>();
    for (const token of system.semantics ?? []) {
      let name = semanticExportVarName(system, token);
      while (seen.has(name)) name = `${name}-dup`;
      seen.add(name);
      lines.push([
        name,
        tokenValue(system, token, mode, stepById, familyByStepId),
        token.comments?.[mode],
      ]);
    }
    return lines.sort(([a], [b]) => compareSemanticExportNames(a, b));
  };

  return [
    "/* CADS Semantic Colors */",
    "",
    "/* This file consists of Semantic colors, if you need color tokens that support multiple themes, you need to import and use this file. */",
    "",
    "/* Raw values for Semantic colors are defined in Primitive Colors (primitiveColors.css), while semantic color values are specified for every theme. */",
    "",
    "/* Generated from CADS color variables — do not hand-edit; check with the design team first and then re-export from the Color foundation page. */",
    "",
    "/* Light Theme Semantic Colors (light is the default theme, that's why :root rule is included) */",
    cssBlock(":root,\n[data-theme='Light']", buildLines("light")),
    "",
    "/* Dark Theme Semantic Colors */",
    cssBlock("[data-theme='Dark']", buildLines("dark")),
    "",
  ].join("\n");
}
