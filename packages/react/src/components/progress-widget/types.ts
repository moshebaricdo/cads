import type {
  CSSProperties,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import type { DropdownOption } from "../dropdown/types";
import type {
  ProgressBubbleLevelType,
  ProgressBubbleStatus,
} from "../progress-bubble/types";

/**
 * Responsive mode (Figma Progress Widget `breakpoint`: >992px / <992px / <768px).
 * - `auto` — media-query driven: rail ≥992px, folded 768–991, compact <768.
 * - `desktop` — rail (Figma `>992px`).
 * - `tablet` — back · level dropdown + cloud · active bubble · action
 *   (Figma `<992px`).
 * - `smallTablet` / `mobile` — compact: back + ellipsis "More" menu ·
 *   active bubble · action; no dropdown or cloud (Figma `<768px`). Both
 *   exist so the widget can follow every GlobalHeader breakpoint.
 * - `tabletMobile` — **deprecated** alias of `tablet`.
 */
export type ProgressWidgetBreakpoint =
  | "auto"
  | "desktop"
  | "tablet"
  | "smallTablet"
  | "mobile"
  /** @deprecated Use `"tablet"`. */
  | "tabletMobile";

/**
 * Autosave/sync state shown by the cloud icon + tooltip (Figma `saveStatus`
 * saved / unsaved; Figma `n/a` is the compact layout, which has no cloud).
 * `offline` is a **deprecated** alias of `unsaved`.
 */
export type ProgressWidgetSaveStatus =
  | "saved"
  | "unsaved"
  /** @deprecated Use `"unsaved"`. */
  | "offline";

/** Figma `version` — `template` swaps the lesson UI for three blank slots. */
export type ProgressWidgetVersion = "default" | "template";

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
  /**
   * `default` — lesson widget. `template` — blank start / middle / end
   * slots in the same 30px chrome (Figma `version=template`).
   * @default "default"
   */
  version?: ProgressWidgetVersion;
  /** Level name shown in the dropdown trigger (and as the More menu heading). */
  levelLabel?: string;
  /** Levels rendered as progress bubbles in the desktop rail. */
  levels?: ProgressWidgetLevel[];
  /**
   * Index into `levels` of the current level. Renders as the large active
   * bubble in the rail; below 992px it gets its own slot after the dropdown.
   */
  activeLevelIndex?: number;
  /** @default "auto" */
  breakpoint?: ProgressWidgetBreakpoint;
  /** @default "saved" */
  saveStatus?: ProgressWidgetSaveStatus;
  /**
   * Show the cloud sync icon (Figma `showSaveStatus`). Never shown in the
   * compact (<768) layout.
   * @default true
   */
  showSaveStatus?: boolean;
  /**
   * Cloud tooltip label. Defaults to "Saved 2 minutes ago" when saved,
   * "Unsaved changes" when unsaved, "Offline" for the deprecated `offline`.
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
   * below 992px — desktop never renders the slot.
   * @default true
   */
  hasLeftAction?: boolean;
  /** Click handler for the leading back button. */
  onBackClick?: MouseEventHandler<HTMLButtonElement>;
  /** Click handler for the level dropdown trigger (opens nothing in CADS). */
  onLevelSelectClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Items for the compact (<768) ellipsis "More" menu, listed under a
   * `levelLabel` heading. GlobalHeader adds Share / Remix here below 576px
   * for `labLevel` (Figma annotation).
   */
  moreMenuOptions?: DropdownOption[];
  /** Fires with the chosen `moreMenuOptions` value. */
  onMoreMenuAction?: (value: string) => void;
  /** `version="template"` start slot (Figma `startSlot`; presence = `hasStartSlot`). */
  startSlot?: ReactNode;
  /** `version="template"` middle slot (Figma `middleSlot`). */
  middleSlot?: ReactNode;
  /** `version="template"` end slot (Figma `endSlot`; presence = `hasEndSlot`). */
  endSlot?: ReactNode;
  className?: string;
  style?: CSSProperties;
}
