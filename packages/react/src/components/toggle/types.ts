import type { ButtonBaseProps } from "@mui/material/ButtonBase";
import type { MouseEvent, ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { ControlSize } from "../../shared/controlSize";

export type ToggleSize = ControlSize;

/**
 * Label placement relative to the switch:
 * - `left` — label on the left, switch on the right
 * - `right` — switch on the left, label on the right
 *
 * (Corrects inverted Figma `labelPlacement` naming.)
 */
export type ToggleLabelPlacement = "left" | "right";

export interface ToggleProps
  extends Omit<ButtonBaseProps, "onChange" | "children" | "color"> {
  /**
   * @default "medium"
   */
  size?: ToggleSize;
  /** Optional adjacent label (Figma Toggle + Label). */
  label?: ReactNode;
  /**
   * Where the label sits relative to the switch.
   * @default "left"
   */
  labelPlacement?: ToggleLabelPlacement;
  /** Controlled on/off (Figma `isOn`). */
  checked?: boolean;
  /** Uncontrolled default. */
  defaultChecked?: boolean;
  onChange?: (event: MouseEvent<HTMLButtonElement>, checked: boolean) => void;
  /**
   * When false, hide track icons entirely (Figma `hasIcons`).
   * @default true
   */
  hasIcons?: boolean;
  /**
   * FA Pro icon shown on the track when on (left slot).
   * @default "check"
   */
  onIcon?: FaIconName | (string & {});
  /**
   * FA Pro icon shown on the track when off (right slot).
   * @default "xmark"
   */
  offIcon?: FaIconName | (string & {});
}
