import type { IconButtonProps } from "@mui/material/IconButton";
import type { ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { ControlSize } from "../../shared/controlSize";

export type IconToggleSize = ControlSize;
/** Figma Icon Toggle `color`: primary / secondary / brand / error / success. */
export type IconToggleColor =
  | "primary"
  | "secondary"
  | "brand"
  | "success"
  | "error";

export type IconToggleSecondProps = {
  /** FA Pro icon (kebab-case); Figma `smile` alias accepted. */
  iconName: FaIconName | (string & {});
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  "aria-label": string;
  disabled?: boolean;
  /** Color recipe for this toggle only (independent of parent `color`). */
  color?: IconToggleColor;
};

export interface IconToggleProps
  extends Omit<IconButtonProps, "color" | "size" | "children"> {
  /**
   * @default "medium"
   */
  size?: IconToggleSize;
  /**
   * Active (on) + hover/press surface recipe.
   * @default "brand"
   */
  color?: IconToggleColor;
  /** Controlled on/off (Figma `isOn`). */
  pressed?: boolean;
  /** Uncontrolled default. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** FA Pro icon name (kebab-case); Figma `smile` alias accepted. */
  iconName: FaIconName | (string & {});
  /**
   * Optional group label (Figma Icon Toggle + Label).
   */
  label?: ReactNode;
  /**
   * Optional second toggle for labeled groups (Figma `hasTwoToggles`, up to 2).
   * Toggles are independent unless `exclusive` is set.
   */
  secondToggle?: IconToggleSecondProps;
  /**
   * When `secondToggle` is set, turning one on turns the other off.
   * Figma does not encode exclusive pairing — defaults to independent binary
   * toggles. Use `exclusive` for thumbs-up/down-style mutual exclusion
   * (both may still be off).
   * @default false
   */
  exclusive?: boolean;
}
