import type { CSSProperties } from "react";
import {
  type FaBrandIconName,
  getFaBrandCodepoint,
} from "./faBrandsCodepoints";
import {
  type FaIconName,
  getFaCodepoint,
  resolveFaIconName,
} from "./faProRegularCodepoints";

export type FaIconSize =
  | "inherit"
  | "extraSmall"
  | "small"
  | "medium"
  | "large"
  /** @deprecated Prefer `extraSmall` */
  | "xs"
  /** @deprecated Prefer `small` */
  | "s"
  /** @deprecated Prefer `medium` */
  | "m"
  /** @deprecated Prefer `large` */
  | "l";

export type FaIconFamily = "solid" | "regular" | "brands";

const SIZE_PX: Record<string, string | undefined> = {
  inherit: undefined,
  extraSmall: "0.75rem", // 12px
  small: "0.875rem", // 14px
  medium: "1rem", // 16px
  large: "1.25rem", // 20px
  xs: "0.75rem",
  s: "0.875rem",
  m: "1rem",
  l: "1.25rem",
};

export interface FaIconProps {
  /**
   * FA icon name (kebab-case), e.g. `arrow-right`, `face-smile`.
   * Figma shortcode `smile` is accepted as an alias for `face-smile`.
   */
  name: FaIconName | FaBrandIconName | (string & {});
  family?: FaIconFamily;
  className?: string;
  /** Visible label for screen readers; when set, `aria-hidden` is not applied. */
  title?: string;
  size?: FaIconSize;
  /** Override glyph size (e.g. Figma button icon px). */
  fontSize?: string;
  style?: CSSProperties;
}

function resolveCodepoint(
  name: string,
  family: FaIconFamily,
): string | undefined {
  if (family === "brands") {
    return getFaBrandCodepoint(name as FaBrandIconName);
  }
  return getFaCodepoint(name);
}

/**
 * Renders a glyph from the licensed Font Awesome 7 webfont
 * (Pro Solid / Pro Regular / Brands).
 * Import `@codeai/cads-react/icons/fonts.css` once at app root.
 *
 * Unknown names render nothing (no throw) so playgrounds stay resilient
 * while typing shortcodes.
 */
export function FaIcon({
  name,
  family = "solid",
  className = "",
  title,
  size = "medium",
  fontSize: fontSizeProp,
  style,
}: FaIconProps) {
  const hex = resolveCodepoint(name, family);
  if (!hex) {
    if (process.env.NODE_ENV !== "production") {
      const hint =
        family !== "brands" && resolveFaIconName(name) == null
          ? ` (try a kebab-case FA name; "smile" → face-smile)`
          : "";
      console.warn(`[CADS FaIcon] Unknown icon name "${name}"${hint}`);
    }
    return null;
  }

  const char = String.fromCodePoint(Number.parseInt(hex, 16));
  const fontSize = fontSizeProp ?? SIZE_PX[size];

  const fontFamily =
    family === "brands"
      ? "var(--font-fa-brands)"
      : "var(--font-fa-pro)";

  const fontWeight =
    family === "brands" || family === "regular" ? 400 : 900;

  return (
    <span
      className={className}
      data-fa-icon=""
      data-fa-family={family}
      data-fa-name={name}
      style={{
        fontFamily,
        fontWeight,
        fontStyle: "normal",
        fontSize,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      title={title}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      role={title ? "img" : undefined}
    >
      {char}
    </span>
  );
}
