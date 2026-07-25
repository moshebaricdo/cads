import type { AnchorHTMLAttributes, ReactNode } from "react";
import type { ControlSize } from "../../shared/controlSize";

/** Figma Link size scale — includes Link-only `extraExtraSmall`. */
export type LinkSize = ControlSize | "extraExtraSmall";
/** Figma Link `type` axis (not HTML link type). */
export type LinkType = "primary" | "secondary";

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> {
  /**
   * Typography / icon scale.
   * @default "medium"
   */
  size?: LinkSize;
  /**
   * Figma `type` axis: primary (brand) | secondary (neutral).
   * @default "primary"
   */
  type?: LinkType;
  /**
   * Show FA solid `up-right-from-square` end icon.
   * @default true
   */
  isExternal?: boolean;
  /** Disables navigation and applies disabled chrome. */
  disabled?: boolean;
  children?: ReactNode;
}
