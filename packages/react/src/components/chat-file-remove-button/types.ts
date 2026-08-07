import type { ButtonBaseProps } from "@mui/material/ButtonBase";

export interface ChatFileRemoveButtonProps
  extends Omit<ButtonBaseProps, "children" | "color"> {
  /**
   * Accessible name for the icon-only remove control.
   * @default "Remove"
   */
  "aria-label"?: string;
}
