import type { ButtonBaseProps } from "@mui/material/ButtonBase";

export type CloseIconButtonSize =
  | "large"
  | "medium"
  | "small"
  | "extraSmall";
export type CloseIconButtonColor =
  | "primary"
  | "secondary"
  | "brand"
  | "pink"
  | "orange"
  | "success"
  | "error"
  | "warning"
  | "info";

export interface CloseIconButtonProps
  extends Omit<ButtonBaseProps, "children" | "color"> {
  /** @default "large" */
  size?: CloseIconButtonSize;
  /** @default "primary" */
  color?: CloseIconButtonColor;
}
