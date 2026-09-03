import type { ButtonBaseProps } from "@mui/material/ButtonBase";
import type { ReactNode } from "react";

/**
 * Figma Progress Bubbles `levelType`.
 * - `default` — circular level bubble
 * - `panelLevel` — diamond (rotated square) level bubble
 * - `lessonExtras` — checkered-flag glyph (status does not apply)
 * - `tutorPlus` — Tutor+ mark (status does not apply)
 */
export type ProgressBubbleLevelType =
  | "default"
  | "panelLevel"
  | "lessonExtras"
  | "tutorPlus";

/** Figma Progress Bubbles `status` (ignored for lessonExtras / tutorPlus). */
export type ProgressBubbleStatus =
  | "notStarted"
  | "inProgress"
  | "passed"
  | "completed"
  | "error";

export interface ProgressBubbleProps
  extends Omit<ButtonBaseProps, "children" | "color"> {
  /**
   * Bubble shape family (Figma: default | panelLevel | lessonExtras | tutorPlus).
   * @default "default"
   */
  levelType?: ProgressBubbleLevelType;
  /**
   * Level completion status (Figma: notStarted | inProgress | passed |
   * completed | error). Ignored when levelType is lessonExtras / tutorPlus
   * (Figma status "N/A").
   * @default "notStarted"
   */
  status?: ProgressBubbleStatus;
  /**
   * Current/active level — renders the large 24px bubble with the level
   * number inside. lessonExtras / tutorPlus stay 12px (Figma parity).
   * @default false
   */
  isActive?: boolean;
  /**
   * Assessment level — star glyph inside the bubble (inactive) or a star
   * badge pinned top-right (active).
   * @default false
   */
  isAssessment?: boolean;
  /** Level number shown inside the active bubble (Figma text prop). */
  levelNumber?: ReactNode;
  /**
   * Render a non-pressable span (no hover/press chrome, no button role).
   * Used when the bubble is nested inside another control, e.g. the
   * Progress Widget dropdown start icon at the tabletMobile breakpoint.
   * @default true
   */
  interactive?: boolean;
}
