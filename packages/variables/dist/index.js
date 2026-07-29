import {
  colorVarsDark,
  colorVarsLight,
  controlHeights,
  elevation,
  motion,
  nonColorCssVars,
  pxToRem,
  shape,
  spacing,
  typography,
  zIndex,
  zIndexLayers
} from "./chunk-FKEUIARX.js";

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
function buildSemanticColorsCss(system, options = {}) {
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
  const darkSelector = options.includeDarkClass ? ".dark,\n[data-theme='Dark']" : "[data-theme='Dark']";
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
    cssBlock(darkSelector, buildLines("dark")),
    ""
  ].join("\n");
}
function buildStepIndex(system) {
  const steps = /* @__PURE__ */ new Map();
  for (const family of system.families ?? []) {
    for (const step of family.steps ?? []) {
      steps.set(step.id, step);
    }
  }
  return steps;
}
function semanticHex(system, token, mode, steps, cache = /* @__PURE__ */ new Map(), stack = /* @__PURE__ */ new Set()) {
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
function resolveColorSystemToCssVars(system, mode) {
  const steps = buildStepIndex(system);
  const output = /* @__PURE__ */ new Map();
  for (const token of system.semantics ?? []) {
    const hex = semanticHex(system, token, mode, steps);
    if (!hex) continue;
    output.set(semanticExportVarName(system, token), hex);
  }
  return output;
}

// src/nonColorCssExport.ts
function pickVars(vars, names) {
  return names.map((name) => {
    const value = vars[name];
    if (value === void 0) {
      throw new Error(`Missing non-color CSS var: ${name}`);
    }
    return [name, value];
  });
}
function cssRootBlock(lines) {
  const body = lines.map(([name, value]) => `  ${name}: ${value};`).join("\n");
  return `:root {
${body}
}`;
}
function pxToRem2(pxValue) {
  const px = Number.parseFloat(pxValue);
  if (Number.isNaN(px)) return pxValue;
  return `${Number((px / 16).toFixed(4))}rem`;
}
var TYPOGRAPHY_VAR_NAMES = [
  "--text-heading-xxl",
  "--text-heading-xl",
  "--text-heading-lg",
  "--text-heading-md",
  "--text-heading-sm",
  "--text-heading-xs",
  "--leading-heading-xxl",
  "--leading-heading-xl",
  "--leading-heading-lg",
  "--leading-heading-md",
  "--leading-heading-sm",
  "--leading-heading-xs",
  "--text-body-lg",
  "--text-body-md",
  "--text-body-sm",
  "--text-body-xs",
  "--text-body-xxs",
  "--leading-body-lg",
  "--leading-body-md",
  "--leading-body-sm",
  "--leading-body-xs",
  "--leading-body-xxs",
  "--tracking-heading-display",
  "--tracking-overline",
  "--tracking-none"
];
var SHAPE_SPACING_VAR_NAMES = [
  "--shape-sm",
  "--shape-md",
  "--shape-lg",
  "--shape-xl",
  "--shape-round",
  "--spacing-p-xxs",
  "--spacing-p-xs",
  "--spacing-p-s",
  "--spacing-p-m",
  "--spacing-p-l",
  "--spacing-p-xl",
  "--spacing-p-xxl",
  "--spacing-p-xxxl",
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
  "--z-drawer",
  "--z-modal",
  "--z-dropdown",
  "--z-popover",
  "--z-toast",
  "--z-tooltip"
];
var MOTION_VAR_NAMES = [
  "--duration-instant",
  "--duration-fast",
  "--duration-short",
  "--duration-medium",
  "--easing-standard",
  "--easing-emphasized",
  "--easing-out",
  "--motion-press-scale",
  "--motion-press-duration",
  "--motion-press-easing",
  "--motion-surface-from-scale",
  "--motion-surface-duration",
  "--motion-surface-easing",
  "--motion-indicator-duration",
  "--motion-indicator-easing",
  "--motion-fade-duration",
  "--motion-fade-easing",
  "--motion-highlight-chase-duration",
  "--motion-highlight-chase-easing",
  "--transition-colors",
  "--transition-fade",
  "--transition-press",
  "--transition-surface",
  "--transition-indicator",
  "--transition-highlight-chase"
];
var REDUCED_MOTION_OVERRIDES = `  --motion-press-duration: 0ms;
  --motion-surface-duration: 100ms;
  --motion-indicator-duration: 100ms;
  --motion-highlight-chase-duration: 0ms;
  --motion-surface-from-scale: 1;
  --motion-press-scale: 1;`;
function buildFontVariablesCss(_vars = nonColorCssVars(), options = {}) {
  const { includeMono = false } = options;
  const indent = "  ";
  const lines = [
    `${indent}--font-family-main: ${typography.fontFamily.body};`,
    `${indent}--font-family-heading: ${typography.fontFamily.heading};`
  ];
  if (includeMono) {
    lines.push(`${indent}--font-family-mono: ${typography.fontFamily.mono};`);
  }
  lines.push(
    `${indent}--font-weight-thin: 100;`,
    `${indent}--font-weight-extra-light: 200;`,
    `${indent}--font-weight-light: 300;`,
    `${indent}--font-weight-regular: ${typography.fontWeight.normal};`,
    `${indent}--font-weight-medium: ${typography.fontWeight.medium};`,
    `${indent}--font-weight-semi-bold: ${typography.fontWeight.semibold};`,
    `${indent}--font-weight-bold: ${typography.fontWeight.bold};`,
    `${indent}--font-weight-extra-bold: 800;`,
    `${indent}--font-weight-black: 900;`,
    `${indent}--font-size-body-xs: ${pxToRem2(typography.fontSize.bodyXs)};`,
    `${indent}--font-size-body-sm: ${pxToRem2(typography.fontSize.bodySm)};`,
    `${indent}--font-size-body-md: ${pxToRem2(typography.fontSize.bodyMd)};`,
    `${indent}--font-size-body-lg: ${pxToRem2(typography.fontSize.bodyLg)};`,
    ``,
    `${indent}html {`,
    `${indent}  font-size: 100%;`,
    `${indent}}`
  );
  return [
    "/* Font CSS Variables",
    " * Generated from CADS \u2014 do not hand-edit; re-export from the Typography foundation page.",
    " * Prod-shaped: families, weight ladder, body sizes. Pair with typography.module.scss for style recipes.",
    " */",
    "",
    ":root {",
    ...lines,
    "}",
    ""
  ].join("\n");
}
function buildTypographyVariablesCss(vars = nonColorCssVars()) {
  return [
    "/* Typography CSS Variables",
    " * CADS runtime type scale (size / leading / tracking). Used by @codeai/cads-react.",
    " * Prod style recipes live in typography.module.scss instead.",
    " */",
    "",
    cssRootBlock(pickVars(vars, TYPOGRAPHY_VAR_NAMES)),
    ""
  ].join("\n");
}
function buildShapeAndSpacingCss(vars = nonColorCssVars()) {
  return [
    "/* CADS shape (border-radius) and spacing (padding) ramps, plus elevation",
    " * shadows and overlay stacking. Shape/spacing match prod",
    " * shapeAndSpacingVariables.css (mode- and brand-invariant).",
    " * Generated \u2014 do not hand-edit; re-export from the Shape foundation page.",
    " */",
    ":root {",
    ...pickVars(vars, SHAPE_SPACING_VAR_NAMES).map(
      ([name, value]) => `  ${name}: ${value};`
    ),
    "}",
    ""
  ].join("\n");
}
function buildMotionCss(vars = nonColorCssVars()) {
  return [
    "/* CADS Motion variables \u2014 duration ladder, easings, recipes, transitions.",
    " * Generated \u2014 do not hand-edit; re-export from the Motion foundation page.",
    " */",
    cssRootBlock(pickVars(vars, MOTION_VAR_NAMES)),
    "",
    "@media (prefers-reduced-motion: reduce) {",
    "  :root {",
    REDUCED_MOTION_OVERRIDES,
    "  }",
    "}",
    ""
  ].join("\n");
}
function buildResidualCssVars(vars = nonColorCssVars()) {
  return {
    "--ring": "var(--border-focused-primary)",
    "--control-height-large": vars["--control-height-large"],
    "--control-height-medium": vars["--control-height-medium"],
    "--control-height-small": vars["--control-height-small"],
    "--control-height-extra-small": vars["--control-height-extra-small"],
    "--control-height-l": vars["--control-height-l"],
    "--control-height-m": vars["--control-height-m"],
    "--control-height-s": vars["--control-height-s"],
    "--control-height-xs": vars["--control-height-xs"],
    /* FA faces — package-local, not part of prod fontVariables.css */
    "--font-fa-pro": vars["--font-fa-pro"],
    "--font-fa-brands": vars["--font-fa-brands"]
  };
}

// src/typographyScssExport.ts
function buildTypographyModuleScss() {
  return `// Generated from CADS \u2014 do not hand-edit; re-export from the Typography foundation page.
// Drop-in companion to fontVariables.css (same role as prod typography.module.scss).
// Requires prod's existing font.scss for main-font-* mixins.
@use 'font.scss' as font;

@mixin heading-common {
  color: var(--text-neutral-primary);
  margin: 0 0 0.5em 0;
}

@mixin heading-xxl {
  @include heading-common;
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semi-bold);
  font-size: 3rem;
  line-height: 1.08;
  letter-spacing: -0.03rem;
}

@mixin heading-xl {
  @include heading-common;
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semi-bold);
  font-size: 2.375rem;
  line-height: 1.05;
  letter-spacing: -0.03rem;
}

@mixin heading-lg {
  @include heading-common;
  @include font.main-font-semi-bold;
  font-size: 1.75rem;
  line-height: 1.29;
}

@mixin heading-md {
  @include heading-common;
  @include font.main-font-semi-bold;
  font-size: 1.5rem;
  line-height: 1.33;
}

@mixin heading-sm {
  @include heading-common;
  @include font.main-font-semi-bold;
  font-size: 1.375rem;
  line-height: 1.36;
}

@mixin heading-xs {
  @include heading-common;
  @include font.main-font-semi-bold;
  font-size: 1.25rem;
  line-height: 1.4;
}

@mixin paragraph-common {
  @include font.main-font-regular;
  color: var(--text-neutral-primary);
  margin-bottom: 1em;
}

@mixin body-one {
  @include paragraph-common;
  font-size: var(--font-size-body-lg);
  line-height: 1.4;
}

@mixin body-two {
  @include paragraph-common;
  font-size: var(--font-size-body-md);
  line-height: 1.48;
}

@mixin body-three {
  @include paragraph-common;
  font-size: var(--font-size-body-sm);
  line-height: 1.54;
}

@mixin body-four {
  @include paragraph-common;
  font-size: var(--font-size-body-xs);
  line-height: 1.64;
}

@mixin overline-common {
  @include paragraph-common;
  @include font.main-font-semi-bold;
  text-transform: uppercase;
  letter-spacing: 0.04rem;
}

@mixin overline-one {
  @include overline-common;
  font-size: 0.875rem;
  line-height: 1.54;
}

@mixin overline-two {
  @include overline-common;
  font-size: 0.813rem;
  line-height: 1.64;
}

@mixin overline-three {
  @include overline-common;
  font-size: 0.688rem;
  line-height: 1.76;
}

@mixin strong {
  font-weight: var(--font-weight-semi-bold);
}

@mixin em {
  font-style: italic;
}

@mixin figcaption {
  @include font.main-font-semi-bold;
  color: var(--text-neutral-primary);
  font-size: 0.875rem;
  line-height: 1.54;
  margin: 0.5em 0 1em;
}

.heading-xxl {
  @include heading-xxl;
  &.wrapper {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @include heading-xxl;
    }
  }
}
.heading-xl {
  @include heading-xl;
  &.wrapper {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @include heading-xl;
    }
  }
}
.heading-lg {
  @include heading-lg;
  &.wrapper {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @include heading-lg;
    }
  }
}
.heading-md {
  @include heading-md;
  &.wrapper {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @include heading-md;
    }
  }
}
.heading-sm {
  @include heading-sm;
  &.wrapper {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @include heading-sm;
    }
  }
}
.heading-xs {
  @include heading-xs;
  &.wrapper {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      @include heading-xs;
    }
  }
}

.body-one {
  @include body-one;
  &.wrapper {
    p,
    li {
      @include body-one;
    }
  }
}

.body-two {
  @include body-two;
  &.wrapper {
    p,
    li {
      @include body-two;
    }
  }
}

.body-three {
  @include body-three;
  &.wrapper {
    p,
    li {
      @include body-three;
    }
  }
}

.body-four {
  @include body-four;
  &.wrapper {
    p,
    li {
      @include body-four;
    }
  }
}

.overline-one {
  @include overline-one;
  &.wrapper {
    p,
    li {
      @include overline-one;
    }
  }
}

.overline-two {
  @include overline-two;
  &.wrapper {
    p,
    li {
      @include overline-two;
    }
  }
}

.overline-three {
  @include overline-three;
  &.wrapper {
    p,
    li {
      @include overline-three;
    }
  }
}

strong,
.strong {
  @include strong;
  &.wrapper strong {
    @include strong;
  }
}

em,
.em {
  @include em;
  &.wrapper em {
    @include em;
  }
}

figcaption,
.figcaption {
  @include figcaption;
  &.wrapper figcaption {
    @include figcaption;
  }
}

.no-margin {
  margin: 0;
  &.wrapper {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    li {
      margin: 0;
    }

    ol,
    ul {
      margin-bottom: 0;
    }
  }
}
`;
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
  buildFontVariablesCss,
  buildMotionCss,
  buildPrimitiveColorsCss,
  buildResidualCssVars,
  buildSemanticColorsCss,
  buildShapeAndSpacingCss,
  buildTypographyModuleScss,
  buildTypographyVariablesCss,
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
  pxToRem,
  resolveColorSystemToCssVars,
  semanticExportVarName,
  shape,
  spacing,
  typography,
  zIndex,
  zIndexLayers
};
//# sourceMappingURL=index.js.map