export {
  typography,
  shape,
  spacing,
  elevation,
  zIndex,
  zIndexLayers,
  controlHeights,
  motion,
  nonColorCssVars,
  pxToRem,
} from "./nonColorVariables";
export type { MotionSpringPreset, ZIndexLayer } from "./nonColorVariables";

export { colorVarsLight, colorVarsDark } from "./generated/cssVars";
export type { ColorVarName } from "./generated/cssVars";

export {
  UNSET_PRIMITIVE_HEX,
  isUnsetPrimitiveHex,
  primitiveVarName,
  semanticExportVarName,
  compareSemanticExportNames,
  comparePrimitiveExportNames,
  buildPrimitiveColorsCss,
  buildSemanticColorsCss,
  resolveColorSystemToCssVars,
} from "./colorCssExport";
export type {
  ThemeKey,
  PrimitiveStep,
  PrimitiveFamily,
  SemanticToken,
  ColorSystemExportDoc,
  SemanticColorsCssOptions,
} from "./colorCssExport";

export {
  buildFontVariablesCss,
  buildTypographyVariablesCss,
  buildShapeAndSpacingCss,
  buildMotionCss,
  buildResidualCssVars,
} from "./nonColorCssExport";
export type { FontVariablesCssOptions } from "./nonColorCssExport";

export { buildTypographyModuleScss } from "./typographyScssExport";

/** Figma file key for the CADS design system. */
export const CADS_FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";

/** CSS custom-property helper: wraps a semantic color name as var(--…). */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/** @deprecated Use `cssVar` — `--ds-*` prefix removed. */
export const ds = cssVar;
