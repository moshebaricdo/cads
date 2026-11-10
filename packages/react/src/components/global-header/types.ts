import type {
  CSSProperties,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import type { ProgressWidgetProps } from "../progress-widget/types";

/** Figma Global Header `state` — which page chrome to render. */
export type GlobalHeaderState =
  | "template"
  | "labLevel"
  | "nonLabLesson"
  | "standaloneProject"
  | "teacherDashboard"
  | "studentDashboard"
  | "tutorPlus";

/**
 * Responsive mode (Figma `breakpoint`: >992 / <992 / <768 / <576).
 * - `auto` — media-query driven across all four.
 * - `desktop` (≥992) / `tablet` (768–991) / `smallTablet` (576–767) /
 *   `mobile` (<576) — force one layout (docs/playground).
 * - `tabletMobile` — **deprecated** alias of `tablet`.
 */
export type GlobalHeaderBreakpoint =
  | "auto"
  | "desktop"
  | "tablet"
  | "smallTablet"
  | "mobile"
  /** @deprecated Use `"tablet"`. */
  | "tabletMobile";

/** Nav link in the dashboard states' left cluster. */
export interface GlobalHeaderNavItem {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface GlobalHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** @default "labLevel" */
  state?: GlobalHeaderState;
  /** @default "auto" */
  breakpoint?: GlobalHeaderBreakpoint;
  /** Account dropdown label. @default "Username" */
  username?: string;
  /**
   * `template` state: content after the logo (Figma `startContent` SLOT;
   * presence = `hasStartContent`). Hugs; 8px gap between children.
   */
  startContent?: ReactNode;
  /**
   * `template` state: centered content filling the space between the start
   * and end clusters (Figma `centerContent` SLOT; presence = `hasCenterContent`).
   */
  centerContent?: ReactNode;
  /**
   * Progress widget props for labLevel / nonLabLesson (breakpoint is
   * injected to follow the header's).
   */
  progressWidgetProps?: Omit<ProgressWidgetProps, "breakpoint">;
  /** Project title for standaloneProject. @default "Untitled Project" */
  projectTitle?: string;
  /** Save line under the title. @default "Saved a few seconds ago" */
  projectSaveStatusText?: string;
  /** Center label for tutorPlus. @default "Tutor Challenge" */
  tutorLabel?: string;
  /**
   * Dashboard nav links. Defaults per state (teacher includes
   * Professional Learning; student omits it).
   */
  navItems?: GlobalHeaderNavItem[];
  onNewProjectClick?: MouseEventHandler<HTMLButtonElement>;
  onUsernameClick?: MouseEventHandler<HTMLButtonElement>;
  onHelpClick?: MouseEventHandler<HTMLButtonElement>;
  onMenuClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Share / Remix also fire from the Progress Widget "More" menu in
   * `labLevel` below 576px (the event argument is then `undefined`).
   */
  onShareClick?: MouseEventHandler<HTMLButtonElement>;
  onRemixClick?: MouseEventHandler<HTMLButtonElement>;
  onRenameClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
}
