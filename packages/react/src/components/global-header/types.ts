import type { CSSProperties, HTMLAttributes, MouseEventHandler } from "react";
import type { ProgressWidgetProps } from "../progress-widget/types";

/** Figma Global Header `state` — which page chrome to render. */
export type GlobalHeaderState =
  | "labLevel"
  | "nonLabLesson"
  | "standaloneProject"
  | "teacherDashboard"
  | "studentDashboard"
  | "tutorPlus";

/**
 * Responsive mode.
 * - `auto` — media-query driven: desktop chrome ≥960px, tablet/mobile below.
 * - `desktop` / `tabletMobile` — force one layout (docs/playground).
 */
export type GlobalHeaderBreakpoint = "auto" | "desktop" | "tabletMobile";

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
  onShareClick?: MouseEventHandler<HTMLButtonElement>;
  onRemixClick?: MouseEventHandler<HTMLButtonElement>;
  onRenameClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
}
