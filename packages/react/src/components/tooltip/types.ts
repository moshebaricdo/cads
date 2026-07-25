import type { TooltipProps as MuiTooltipProps } from "@mui/material/Tooltip";
import type { ReactElement, ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";

export interface TooltipProps
  extends Omit<MuiTooltipProps, "title" | "arrow" | "children"> {
  /** Tooltip label (Figma `text`). */
  title: ReactNode;
  /**
   * Trigger element. Required for anchored mode; omit with `surfaceOnly`.
   */
  children?: ReactElement;
  /**
   * Show caret (Figma `hasCaret`). Maps to MUI `arrow`.
   * @default true
   */
  hasCaret?: boolean;
  /**
   * Leading FA icon. Omit for no icon (Figma's boolean `startIcon` is
   * collapsed into presence of this prop).
   */
  iconName?: FaIconName | (string & {});
  /**
   * MUI placement (where the tooltip sits relative to the trigger).
   * `*-start` / `*-end` also pin the caret to that edge of the bubble.
   * @default "bottom"
   */
  placement?: MuiTooltipProps["placement"];
  /**
   * Render bubble (+ caret) inline without Popper / trigger.
   * Used by docs Inspect and static fixtures.
   */
  surfaceOnly?: boolean;
}
