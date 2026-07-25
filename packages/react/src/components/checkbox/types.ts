import type { CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import type { ReactNode } from "react";
import type { ControlSize } from "../../shared/controlSize";

export type CheckboxSize = ControlSize;
export type CheckboxLabelStyle = "thin" | "thick";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "size" | "color"> {
  /**
   * @default "medium"
   */
  size?: CheckboxSize;
  /** Optional label (Figma Checkbox + Label `Text#252:0`). */
  label?: ReactNode;
  /**
   * Label weight from Figma `labelStyle`.
   * @default "thin"
   */
  labelStyle?: CheckboxLabelStyle;
}
