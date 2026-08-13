/**
 * Prod-shaped CSS export builders for non-color CADS variables.
 *
 * Mirrors the component-library-styles file split:
 *  - fontVariables.css (families, weights, body sizes — prod-shaped)
 *  - typographyVariables.css (CADS runtime type scale — --text-* / --leading-*)
 *  - shapeAndSpacingVariables.css (prod shape/spacing + CADS elevation shadows; no z-index — prod uses Bootstrap)
 *  - motionVariables.css (CADS motion — net-new vs prod)
 */

import { nonColorCssVars, typography } from "./nonColorVariables";

function pickVars(
  vars: Record<string, string>,
  names: readonly string[],
): Array<[string, string]> {
  return names.map((name) => {
    const value = vars[name];
    if (value === undefined) {
      throw new Error(`Missing non-color CSS var: ${name}`);
    }
    return [name, value];
  });
}

function cssRootBlock(lines: Array<[string, string]>): string {
  const body = lines.map(([name, value]) => `  ${name}: ${value};`).join("\n");
  return `:root {\n${body}\n}`;
}

function pxToRem(pxValue: string): string {
  const px = Number.parseFloat(pxValue);
  if (Number.isNaN(px)) return pxValue;
  return `${Number((px / 16).toFixed(4))}rem`;
}

const TYPOGRAPHY_VAR_NAMES = [
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
  "--tracking-none",
] as const;

const SHAPE_SPACING_VAR_NAMES = [
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
] as const;

const MOTION_VAR_NAMES = [
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
  "--transition-highlight-chase",
] as const;

const REDUCED_MOTION_OVERRIDES = `  --motion-press-duration: 0ms;
  --motion-surface-duration: 100ms;
  --motion-indicator-duration: 100ms;
  --motion-highlight-chase-duration: 0ms;
  --motion-surface-from-scale: 1;
  --motion-press-scale: 1;`;

export type FontVariablesCssOptions = {
  /**
   * Include `--font-family-mono` (system stack). Prod fontVariables.css omits
   * mono — set true for CADS runtime so code samples have a token.
   */
  includeMono?: boolean;
};

/**
 * Prod-shaped `fontVariables.css`: families (+ Noto i18n), full weight ladder,
 * and `--font-size-body-*` in rem. Does not include FA font vars (residual) or
 * Barlow legacy families.
 */
export function buildFontVariablesCss(
  _vars: Record<string, string> = nonColorCssVars(),
  options: FontVariablesCssOptions = {},
): string {
  const { includeMono = false } = options;
  const indent = "  ";
  const lines: string[] = [
    `${indent}--font-family-main: ${typography.fontFamily.body};`,
    `${indent}--font-family-heading: ${typography.fontFamily.heading};`,
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
    `${indent}--font-size-body-xs: ${pxToRem(typography.fontSize.bodyXs)};`,
    `${indent}--font-size-body-sm: ${pxToRem(typography.fontSize.bodySm)};`,
    `${indent}--font-size-body-md: ${pxToRem(typography.fontSize.bodyMd)};`,
    `${indent}--font-size-body-lg: ${pxToRem(typography.fontSize.bodyLg)};`,
    ``,
    `${indent}html {`,
    `${indent}  font-size: 100%;`,
    `${indent}}`,
  );

  return [
    "/* Font CSS Variables",
    " * Generated from CADS — do not hand-edit; re-export from the Typography foundation page.",
    " * Prod-shaped: families, weight ladder, body sizes. Pair with typography.module.scss for style recipes.",
    " */",
    "",
    ":root {",
    ...lines,
    "}",
    "",
  ].join("\n");
}

/** CADS runtime type scale (`--text-*` / `--leading-*` / `--tracking-*`). Not a prod file. */
export function buildTypographyVariablesCss(
  vars: Record<string, string> = nonColorCssVars(),
): string {
  return [
    "/* Typography CSS Variables",
    " * CADS runtime type scale (size / leading / tracking). Used by @moshebaricdo/cads-react.",
    " * Prod style recipes live in typography.module.scss instead.",
    " */",
    "",
    cssRootBlock(pickVars(vars, TYPOGRAPHY_VAR_NAMES)),
    "",
  ].join("\n");
}

export function buildShapeAndSpacingCss(
  vars: Record<string, string> = nonColorCssVars(),
): string {
  return [
    "/* CADS shape (border-radius) spacing (padding) ramps, and elevation shadows.",
    " * Generated — do not hand-edit; check with the design team first, then re-export from the Shape foundation page.",
    " */",
    ":root {",
    ...pickVars(vars, SHAPE_SPACING_VAR_NAMES).map(
      ([name, value]) => `  ${name}: ${value};`,
    ),
    "}",
    "",
  ].join("\n");
}

export function buildMotionCss(
  vars: Record<string, string> = nonColorCssVars(),
): string {
  return [
    "/* CADS Motion variables — duration ladder, easings, recipes, transitions.",
    " * Generated — do not hand-edit; re-export from the Motion foundation page.",
    " */",
    cssRootBlock(pickVars(vars, MOTION_VAR_NAMES)),
    "",
    "@media (prefers-reduced-motion: reduce) {",
    "  :root {",
    REDUCED_MOTION_OVERRIDES,
    "  }",
    "}",
    "",
  ].join("\n");
}

/** Residual vars that stay in the variables.css barrel (not a separate export). */
export function buildResidualCssVars(
  vars: Record<string, string> = nonColorCssVars(),
): Record<string, string> {
  return {
    "--ring": "var(--border-focused-primary)",
    "--control-height-large": vars["--control-height-large"]!,
    "--control-height-medium": vars["--control-height-medium"]!,
    "--control-height-small": vars["--control-height-small"]!,
    "--control-height-extra-small": vars["--control-height-extra-small"]!,
    "--control-height-l": vars["--control-height-l"]!,
    "--control-height-m": vars["--control-height-m"]!,
    "--control-height-s": vars["--control-height-s"]!,
    "--control-height-xs": vars["--control-height-xs"]!,
    /* Overlay stacking — CADS runtime only; prod uses Bootstrap z-index. */
    "--z-drawer": vars["--z-drawer"]!,
    "--z-modal": vars["--z-modal"]!,
    "--z-dropdown": vars["--z-dropdown"]!,
    "--z-popover": vars["--z-popover"]!,
    "--z-toast": vars["--z-toast"]!,
    "--z-tooltip": vars["--z-tooltip"]!,
    /* FA faces — package-local, not part of prod fontVariables.css */
    "--font-fa-pro": vars["--font-fa-pro"]!,
    "--font-fa-brands": vars["--font-fa-brands"]!,
  };
}
