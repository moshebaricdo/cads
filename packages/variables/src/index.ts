export {
  typography,
  shape,
  spacing,
  elevation,
  controlHeights,
  nonColorCssVars,
} from "./nonColorVariables";

export { colorVarsLight, colorVarsDark } from "./generated/cssVars";
export type { ColorVarName } from "./generated/cssVars";

/** Figma file key for the CADS design system. */
export const CADS_FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";

/** CSS custom-property helper: wraps a semantic name as var(--ds-…). */
export function ds(name: string): string {
  return `var(--ds-${name})`;
}
