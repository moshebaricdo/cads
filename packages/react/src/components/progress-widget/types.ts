import type { CSSProperties, HTMLAttributes, MouseEventHandler } from "react";
import type {
  ProgressBubbleLevelType,
  ProgressBubbleStatus,
} from "../progress-bubble/types";

/**
 * Responsive mode.
 * - `auto` — media-query driven: bubble rail ≥960px, folded dropdown below.
 * - `desktop` / `tabletMobile` — force one layout (docs/playground).
 */
export type ProgressWidgetBreakpoint = "auto" | "desktop" | "tabletMobile";

/** Autosave/sync state shown by the cloud icon + tooltip. */
export type ProgressWidgetSaveStatus = "saved" | "offline";

/** One level in the progress rail. */
export interface ProgressWidgetLevel {
  /** @default "default" */
  levelType?: ProgressBubbleLevelType;
  /** @default "notStarted" */
  status?: ProgressBubbleStatus;
  /** @default false */
  isAssessment?: boolean;
  /** Accessible name, e.g. "Level 6". Falls back to a positional label. */
  label?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface ProgressWidgetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Level name shown in the dropdown trigger. */
  levelLabel: string;
  /** Levels rendered as progress bubbles in the desktop rail. */
  levels?: ProgressWidgetLevel[];
  /**
   * Index into `levels` of the current level. Renders as the large active
   * bubble in the rail; below 960px it nests (small, non-interactive) as
   * the dropdown start icon.
   */
  activeLevelIndex?: number;
  /** @default "auto" */
  breakpoint?: ProgressWidgetBreakpoint;
  /** @default "saved" */
  saveStatus?: ProgressWidgetSaveStatus;
  /**
   * Cloud tooltip label. Defaults to "Saved 2 minutes ago" when saved and
   * "Offline" when offline.
   */
  saveStatusLabel?: string;
  /**
   * Show the trailing action button (Figma `hasAction`).
   * @default true
   */
  hasAction?: boolean;
  /** @default "I finished" */
  actionLabel?: string;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Show the leading back button (Figma `hasLeftAction`). Visible only
   * below 960px / `breakpoint="tabletMobile"` — desktop never renders the slot.
   * @default true
   */
  hasLeftAction?: boolean;
  /** Click handler for the leading back button. */
  onBackClick?: MouseEventHandler<HTMLButtonElement>;
  /** Click handler for the level dropdown trigger (opens nothing in CADS). */
  onLevelSelectClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
}
