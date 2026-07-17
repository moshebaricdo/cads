export {
  typography,
  shape,
  spacing,
  elevation,
  controlHeights,
  motion,
  nonColorCssVars,
} from "./nonColorVariables";

export { colorVarsLight, colorVarsDark } from "./generated/cssVars";
export type { ColorVarName } from "./generated/cssVars";

/** Figma file key for the CADS design system. */
export const CADS_FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";

/** CSS custom-property helper: wraps a semantic color name as var(--…). */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/** @deprecated Use `cssVar` — `--ds-*` prefix removed. */
export const ds = cssVar;
