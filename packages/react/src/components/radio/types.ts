import type { RadioProps as MuiRadioProps } from "@mui/material/Radio";
import type { ReactNode } from "react";
import type { ControlSize } from "../../shared/controlSize";

export type RadioSize = ControlSize;
export type RadioLabelStyle = "thin" | "thick";

export interface RadioProps extends Omit<MuiRadioProps, "size" | "icon" | "checkedIcon"> {
  /** Optional label (Figma Radio Button + Label). */
  label?: ReactNode;
  /** Control size — Figma `size` axis. */
  size?: RadioSize;
  /** Label weight — Figma `labelStyle` (`thin` = regular, `thick` = semibold). */
  labelStyle?: RadioLabelStyle;
}
