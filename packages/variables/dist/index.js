import {
  colorVarsDark,
  colorVarsLight,
  controlHeights,
  elevation,
  motion,
  nonColorCssVars,
  shape,
  spacing,
  typography
} from "./chunk-WIC77WFW.js";

// src/colorCssExport.ts
var UNSET_PRIMITIVE_HEX = "#00000000";
function isUnsetPrimitiveHex(hex) {
  return hex.toUpperCase() === UNSET_PRIMITIVE_HEX;
}
var DEFAULT_SEMANTIC_FAMILY_SUBGROUP = {
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
  "alpha-2": "neutral"
};
var FLAT_SUBGROUPS = /* @__PURE__ */ new Set(["sentiment", "state"]);
var SINGLE_FAMILY_SUBGROUPS = /* @__PURE__ */ new Set(["brand"]);
function slug(value) {
  return value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-") || "unnamed";
}
function exportSurface(surface) {
  const s = slug(surface);
  return s === "borders" ? "border" : s;
}
function semanticSubGroupForFamily(system, familyKey) {
  return system.semanticFamilySubGroups?.[familyKey] ?? DEFAULT_SEMANTIC_FAMILY_SUBGROUP[familyKey] ?? "accent";
}
function primitiveVarName(family, step) {
  return `${slug(family.collectionId)}-${slug(family.name)}-${slug(step.step)}`;
}
function semanticExportVarName(system, token) {
  const subGroupId = semanticSubGroupForFamily(system, token.familyKey);
  const subGroup = system.semanticSubGroups?.find(
    (item) => item.id === subGroupId
  );
  const subName = slug(subGroup?.name ?? subGroupId);
  const family = system.semanticFamilies?.find(
    (item) => item.id === token.familyKey
  );
  const familySegment = slug(family?.name ?? token.familyKey);
  const parts = [exportSurface(token.surface)];
  if (!FLAT_SUBGROUPS.has(subName)) parts.push(subName);
  if (!SINGLE_FAMILY_SUBGROUPS.has(subName) && familySegment !== subName && familySegment !== parts[parts.length - 1]) {
    parts.push(familySegment);
  }
  parts.push(slug(token.role));
  return parts.join("-");
}
var SURFACE_RANK = {
  background: 0,
  border: 1,
  text: 2
};
var GROUP_RANK = {
  neutral: 0,
  brand: 1,
  sentiment: 2,
  accent: 3,
  state: 4
};
var SENTIMENT_FAMILY_RANK = {
  error: 0,
  warning: 1,
  success: 2,
  info: 3
};
var ROLE_RANK = [
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
  "white-fixed"
];
function parseSemanticExportName(name) {
  const segments = name.split("-");
  const surface = segments[0];
  const surfaceRank = SURFACE_RANK[surface] ?? 99;
  let group;
  let familyRank = 0;
  let roleSegments;
  if (segments[1] === "neutral") {
    group = "neutral";
    if (segments[2] === "alpha") {
      return {
        surfaceRank,
        groupRank: GROUP_RANK.neutral,
        familyRank: 1,
        roleRank: 1e3 + Number(segments[3] ?? 0),
        role: segments.slice(3).join("-")
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
      role: roleSegments.join("-")
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
    role
  };
}
function roleRankOf(role) {
  const index = ROLE_RANK.indexOf(role);
  return index === -1 ? 500 : index;
}
function compareSemanticExportNames(a, b) {
  const pa = parseSemanticExportName(a);
  const pb = parseSemanticExportName(b);
  return pa.surfaceRank - pb.surfaceRank || pa.groupRank - pb.groupRank || pa.familyRank - pb.familyRank || pa.roleRank - pb.roleRank || a.localeCompare(b);
}
function comparePrimitiveExportNames(a, b) {
  const splitStep = (name) => {
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
function cssBlock(selector, sortedLines) {
  const body = sortedLines.flatMap(([name, value, comment]) => [
    ...comment ? [`  /* ${comment} */`] : [],
    `  --${name}: ${value};`
  ]).join("\n");
  return `${selector} {
${body}
}`;
}
function buildPrimitiveColorsCss(system) {
  const lines = [];
  const seen = /* @__PURE__ */ new Set();
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
    "/* Generated from CADS color variables \u2014 do not hand-edit; check with the design team first and then re-export from the Color foundation page. */",
    "",
    "/* stylelint-disable color-hex-length */",
    cssBlock(
      ":root",
      [...lines].sort(([a], [b]) => comparePrimitiveExportNames(a, b))
    ),
    ""
  ].join("\n");
}
function tokenValue(system, token, mode, stepById, familyByStepId) {
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
function buildSemanticColorsCss(system) {
  const stepById = /* @__PURE__ */ new Map();
  const familyByStepId = /* @__PURE__ */ new Map();
  for (const family of system.families ?? []) {
    for (const step of family.steps ?? []) {
      stepById.set(step.id, step);
      familyByStepId.set(step.id, family);
    }
  }
  const buildLines = (mode) => {
    const lines = [];
    const seen = /* @__PURE__ */ new Set();
    for (const token of system.semantics ?? []) {
      let name = semanticExportVarName(system, token);
      while (seen.has(name)) name = `${name}-dup`;
      seen.add(name);
      lines.push([
        name,
        tokenValue(system, token, mode, stepById, familyByStepId),
        token.comments?.[mode]
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
    "/* Generated from CADS color variables \u2014 do not hand-edit; check with the design team first and then re-export from the Color foundation page. */",
    "",
    "/* Light Theme Semantic Colors (light is the default theme, that's why :root rule is included) */",
    cssBlock(":root,\n[data-theme='Light']", buildLines("light")),
    "",
    "/* Dark Theme Semantic Colors */",
    cssBlock("[data-theme='Dark']", buildLines("dark")),
    ""
  ].join("\n");
}

// src/index.ts
var CADS_FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";
function cssVar(name) {
  return `var(--${name})`;
}
var ds = cssVar;
export {
  CADS_FIGMA_FILE_KEY,
  UNSET_PRIMITIVE_HEX,
  buildPrimitiveColorsCss,
  buildSemanticColorsCss,
  colorVarsDark,
  colorVarsLight,
  comparePrimitiveExportNames,
  compareSemanticExportNames,
  controlHeights,
  cssVar,
  ds,
  elevation,
  isUnsetPrimitiveHex,
  motion,
  nonColorCssVars,
  primitiveVarName,
  semanticExportVarName,
  shape,
  spacing,
  typography
};
//# sourceMappingURL=index.js.map