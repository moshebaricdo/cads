import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { ControlSize } from "../../shared/controlSize";

/** Figma Button `variant` — contained / outlined / text. */
export type ButtonVariant = "contained" | "outlined" | "text";
/** Figma Button `color`. */
export type ButtonColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "orange"
  | "error";
/** Figma size scale. */
export type ButtonSize = ControlSize;

export interface ButtonProps
  extends Omit<
    MuiButtonProps,
    | "variant"
    | "color"
    | "size"
    | "startIcon"
    | "endIcon"
    | "loading"
    | "loadingIndicator"
    | "loadingPosition"
  > {
  /**
   * Visual style (Figma: contained | outlined | text).
   * @default "contained"
   */
  variant?: ButtonVariant;
  /**
   * Color intent (Figma: primary | secondary | tertiary | orange | error).
   * Tertiary is only valid for `variant="text"` + icon-only; other combos
   * fall back to secondary with a development warning.
   * Orange is only valid for `variant="contained"` (run button); other
   * variants fall back to primary with a development warning.
   * @default "primary"
   */
  color?: ButtonColor;
  /**
   * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
   * @default "medium"
   */
  size?: ButtonSize;
  /** Force icon-only square geometry (also inferred when no children). */
  iconOnly?: boolean;
  /**
   * Font Awesome Pro icon at the start (kebab-case).
   * Figma shortcode `smile` is accepted (alias of `face-smile`).
   */
  startIconName?: FaIconName | (string & {});
  /**
   * Font Awesome Pro icon at the end (kebab-case).
   * Figma shortcode `smile` is accepted (alias of `face-smile`).
   */
  endIconName?: FaIconName | (string & {});
  /**
   * Replaces visible content with a centered FA spinner while preserving
   * the button's width (label/icons stay in layout, visually hidden).
   * Does not apply disabled styling; blocks interaction via pointer-events.
   */
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}
