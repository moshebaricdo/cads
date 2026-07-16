import type { CSSProperties } from "react";
import {
  type FaBrandIconName,
  getFaBrandCodepoint,
} from "./faBrandsCodepoints";
import { type FaIconName, getFaCodepoint } from "./faProRegularCodepoints";

export type FaIconSize = "inherit" | "xs" | "s" | "m" | "l";
export type FaIconFamily = "solid" | "brands";

const SIZE_PX: Record<FaIconSize, string | undefined> = {
  inherit: undefined,
  xs: "12px",
  s: "14px",
  m: "16px",
  l: "20px",
};

export interface FaIconProps {
  /** FA icon name (kebab-case), e.g. `arrow-right`, `python` (brands). */
  name: FaIconName | FaBrandIconName;
  family?: FaIconFamily;
  className?: string;
  /** Visible label for screen readers; when set, `aria-hidden` is not applied. */
  title?: string;
  size?: FaIconSize;
  style?: CSSProperties;
}

function resolveCodepoint(
  name: FaIconName | FaBrandIconName,
  family: FaIconFamily,
): string {
  return family === "brands"
    ? getFaBrandCodepoint(name as FaBrandIconName)
    : getFaCodepoint(name as FaIconName);
}

/**
 * Renders a glyph from the licensed Font Awesome 7 webfont (Pro Solid or Brands).
 * Import `@codeai/cads-react/icons/fonts.css` once at app root.
 */
export function FaIcon({
  name,
  family = "solid",
  className = "",
  title,
  size = "m",
  style,
}: FaIconProps) {
  const hex = resolveCodepoint(name, family);
  const char = String.fromCodePoint(Number.parseInt(hex, 16));
  const fontSize = SIZE_PX[size];

  return (
    <span
      className={className}
      data-fa-icon=""
      data-fa-family={family}
      style={{
        fontFamily:
          family === "brands"
            ? "var(--font-fa-brands)"
            : "var(--font-fa-pro)",
        fontWeight: family === "brands" ? 400 : 900,
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
