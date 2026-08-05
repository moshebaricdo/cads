/**
 * (OLD) DSCO Variables → CADS Semantic Colors name rewrites.
 *
 * Harvested 2026-08-04 from Figma file `NIVcvUgU3WmXpAmp9U2vVy`
 * (107 Semantic Colors). Targets verified against CADS
 * `DGekOeToRVifvFAhfqpeC1` (148 Semantic Colors).
 *
 * Rename decisions follow prod `brandCodeAiNextAliases.css` (design-signed
 * color-bridge): brand aqua/teal/purple collapse into a single CADS brand
 * family, strawberry → pink, extra-light → light, disabled/inverse path
 * moves under `state/`, and `borders/` → `border/`.
 *
 * Same-name tokens keep identity (CADS owns any meaning shift, e.g. legacy
 * error/light was heavier — call sites that need the old weight migrate to
 * mid separately). One alias CSS row pointed at a primitive
 * (`background/brand/purple/primary-fixed` → `brand-purple-50`); the plugin
 * maps to semantic `background/brand/primary` instead (primitives are never
 * remap targets).
 *
 * DSCO Primitive Colors are intentionally omitted — direct primitive usage
 * falls through to hex + layer-surface matching.
 */

/** DSCO Figma variable name → CADS Figma variable name. */
export const DSCO_COLOR_REWRITES: Record<string, string> = {
  "background/accent/orange/light": "background/accent/orange/light",
  "background/accent/orange/primary": "background/accent/orange/primary",
  "background/accent/orange/strong": "background/accent/orange/strong",
  "background/accent/strawberry/light": "background/accent/pink/light",
  "background/accent/strawberry/primary": "background/accent/pink/primary",
  "background/accent/strawberry/strong": "background/accent/pink/strong",
  "background/brand/aqua/extra-light": "background/brand/light",
  "background/brand/aqua/light": "background/brand/light",
  "background/brand/aqua/primary": "background/brand/primary",
  "background/brand/aqua/strong": "background/brand/strong",
  "background/brand/purple/extra-light": "background/brand/light",
  "background/brand/purple/hover": "background/brand/light",
  "background/brand/purple/light": "background/brand/light",
  "background/brand/purple/primary": "background/brand/primary",
  "background/brand/purple/primary-fixed": "background/brand/primary",
  "background/brand/purple/strong": "background/brand/strong",
  "background/brand/teal/extra-light": "background/brand/light",
  "background/brand/teal/light": "background/brand/light",
  "background/brand/teal/primary": "background/brand/primary",
  "background/brand/teal/strong": "background/brand/strong",
  "background/error/extra-light": "background/error/light",
  "background/error/light": "background/error/light",
  "background/error/primary": "background/error/primary",
  "background/error/strong": "background/error/strong",
  "background/info/extra-light": "background/info/light",
  "background/info/light": "background/info/light",
  "background/info/primary": "background/info/primary",
  "background/info/strong": "background/info/strong",
  "background/neutral/black-fixed": "background/neutral/black-fixed",
  "background/neutral/disabled": "background/state/disabled/neutral",
  "background/neutral/lab": "background/neutral/primary",
  "background/neutral/octonary": "background/neutral/octonary",
  "background/neutral/primary": "background/neutral/primary",
  "background/neutral/primary-inverse": "background/neutral/primary-inverse",
  "background/neutral/quaternary": "background/neutral/quaternary",
  "background/neutral/quinary": "background/neutral/quinary",
  "background/neutral/secondary": "background/neutral/secondary",
  "background/neutral/senary": "background/neutral/senary",
  "background/neutral/septenary": "background/neutral/septenary",
  "background/neutral/tertiary": "background/neutral/tertiary",
  "background/neutral/true-base": "background/neutral/true-base",
  "background/neutral/white-fixed": "background/neutral/white-fixed",
  "background/success/extra-light": "background/success/light",
  "background/success/light": "background/success/light",
  "background/success/primary": "background/success/primary",
  "background/success/strong": "background/success/strong",
  "background/warning/extra-light": "background/warning/light",
  "background/warning/light": "background/warning/light",
  "background/warning/primary": "background/warning/primary",
  "background/warning/strong": "background/warning/strong",
  "borders/brand/aqua/light": "border/brand/light",
  "borders/brand/aqua/primary": "border/brand/primary",
  "borders/brand/aqua/strong": "border/brand/strong",
  "borders/brand/purple/light": "border/brand/light",
  "borders/brand/purple/primary": "border/brand/primary",
  "borders/brand/purple/strong": "border/brand/strong",
  "borders/brand/teal/light": "border/brand/light",
  "borders/brand/teal/primary": "border/brand/primary",
  "borders/brand/teal/strong": "border/brand/strong",
  "borders/error/light": "border/error/light",
  "borders/error/primary": "border/error/primary",
  "borders/error/strong": "border/error/strong",
  "borders/info/light": "border/info/light",
  "borders/info/primary": "border/info/primary",
  "borders/info/strong": "border/info/strong",
  "borders/neutral/disabled": "border/state/disabled/neutral",
  "borders/neutral/light": "border/neutral/primary",
  "borders/neutral/primary": "border/neutral/primary",
  "borders/neutral/solid": "border/neutral/solid",
  "borders/neutral/strong": "border/neutral/secondary",
  "borders/success/light": "border/success/light",
  "borders/success/primary": "border/success/primary",
  "borders/success/strong": "border/success/strong",
  "borders/warning/light": "border/warning/light",
  "borders/warning/primary": "border/warning/primary",
  "borders/warning/strong": "border/warning/strong",
  "text/brand/aqua/primary": "text/brand/primary",
  "text/brand/aqua/primary-fixed": "text/brand/primary-fixed",
  "text/brand/aqua/secondary": "text/brand/secondary",
  "text/brand/purple/primary": "text/brand/primary",
  "text/brand/purple/primary-fixed": "text/brand/primary-fixed",
  "text/brand/purple/secondary": "text/brand/secondary",
  "text/brand/teal/primary": "text/brand/primary",
  "text/brand/teal/primary-fixed": "text/brand/primary-fixed",
  "text/brand/teal/secondary": "text/brand/secondary",
  "text/error/primary": "text/error/primary",
  "text/error/primary-fixed": "text/error/primary-fixed",
  "text/error/secondary": "text/error/secondary",
  "text/info/primary": "text/info/primary",
  "text/info/primary-fixed": "text/info/primary-fixed",
  "text/info/secondary": "text/info/secondary",
  "text/neutral/black-fixed": "text/neutral/black-fixed",
  "text/neutral/disabled": "text/state/disabled/neutral",
  "text/neutral/disabled-inverse": "text/state/disabled/neutral-inverse",
  "text/neutral/inverse": "text/neutral/primary-inverse",
  "text/neutral/placeholder": "text/neutral/placeholder",
  "text/neutral/primary": "text/neutral/primary",
  "text/neutral/quaternary": "text/neutral/quaternary",
  "text/neutral/secondary": "text/neutral/secondary",
  "text/neutral/tertiary": "text/neutral/tertiary",
  "text/neutral/white-fixed": "text/neutral/white-fixed",
  "text/success/primary": "text/success/primary",
  "text/success/primary-fixed": "text/success/primary-fixed",
  "text/success/secondary": "text/success/secondary",
  "text/warning/primary": "text/warning/primary",
  "text/warning/primary-fixed": "text/warning/primary-fixed",
  "text/warning/secondary": "text/warning/secondary",
};

/** CSS hyphen form (`background-brand-aqua-primary`) → CADS Figma path. */
const REWRITE_BY_CSS = (() => {
  const map = new Map<string, string>();
  for (const [source, target] of Object.entries(DSCO_COLOR_REWRITES)) {
    map.set(source.replace(/\//g, "-").toLowerCase(), target);
  }
  return map;
})();

/**
 * DSCO → CADS semantic color name rewrite.
 * Accepts Figma slash paths or CSS hyphen names (`background-brand-aqua-primary`).
 * Returns null when the source isn't a known DSCO semantic color.
 */
export function dscoToCadsColorName(sourceName: string): string | null {
  const trimmed = sourceName.trim();
  if (!trimmed) return null;

  if (DSCO_COLOR_REWRITES[trimmed]) return DSCO_COLOR_REWRITES[trimmed];

  const lower = trimmed.toLowerCase();
  if (DSCO_COLOR_REWRITES[lower]) return DSCO_COLOR_REWRITES[lower];

  const css = lower.replace(/^--+/, "").replace(/[_\s]+/g, "-").replace(/\//g, "-");
  return REWRITE_BY_CSS.get(css) ?? null;
}
