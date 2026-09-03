"use client";

import { forwardRef, type MouseEventHandler, type ReactNode } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { ProgressWidget } from "../progress-widget";
import { CodeAiLogo } from "./CodeAiLogo";
import styles from "./globalHeader.module.scss";
import type { GlobalHeaderNavItem, GlobalHeaderProps } from "./types";

const TEACHER_NAV: GlobalHeaderNavItem[] = [
  { label: "My Dashboard" },
  { label: "Course Catalog" },
  { label: "Professional Learning" },
  { label: "Projects" },
  { label: "Incubator" },
];

const STUDENT_NAV: GlobalHeaderNavItem[] = [
  { label: "My Dashboard" },
  { label: "Course Catalog" },
  { label: "Projects" },
  { label: "Incubator" },
];

/**
 * Header chrome buttons intentionally deviate from the CADS Button variants
 * (white-on-brand outlined / text styles specific to this surface), so they
 * are private primitives rather than Button usages.
 */
function HeaderButton({
  variant,
  icon,
  endIcon,
  label,
  onClick,
  className = "",
  ariaLabel,
}: {
  variant: "text" | "outlined" | "iconOutlined" | "icon";
  icon?: string;
  endIcon?: string;
  label?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  ariaLabel?: string;
}) {
  const variantClass =
    variant === "outlined"
      ? styles.outlinedButton
      : variant === "iconOutlined"
        ? `${styles.outlinedButton} ${styles.iconButton}`
        : variant === "icon"
          ? styles.iconButton
          : styles.textButton;
  return (
    <button
      type="button"
      className={`${styles.headerButton} ${variantClass} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon ? <FaIcon name={icon} family="solid" fontSize="12px" /> : null}
      {label ? <span className={styles.headerButtonLabel}>{label}</span> : null}
      {endIcon ? (
        <FaIcon name={endIcon} family="solid" fontSize="12px" />
      ) : null}
    </button>
  );
}

function UsernameDropdown({
  username,
  onClick,
}: {
  username: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className={`${styles.headerButton} ${styles.outlinedButton} ${styles.usernameDropdown}`}
      onClick={onClick}
    >
      <span className={styles.usernameLabel}>{username}</span>
      <FaIcon
        name="chevron-down"
        family="solid"
        fontSize="12px"
        className={styles.usernameChevron}
      />
    </button>
  );
}

/**
 * Studio Global Header — persistent header chrome for all studio pages.
 * Six page states × desktop / tablet-mobile (<960px) behavior.
 *
 * Figma: Global Header (17240:2903).
 */
export const GlobalHeader = forwardRef<HTMLElement, GlobalHeaderProps>(
  function GlobalHeader(props, ref) {
    const {
      state = "labLevel",
      breakpoint = "auto",
      username = "Username",
      progressWidgetProps,
      projectTitle = "Untitled Project",
      projectSaveStatusText = "Saved a few seconds ago",
      tutorLabel = "Tutor Challenge",
      navItems,
      onNewProjectClick,
      onUsernameClick,
      onHelpClick,
      onMenuClick,
      onShareClick,
      onRemixClick,
      onRenameClick,
      className = "",
      ...rest
    } = props;

    const rootClasses = [
      styles.root,
      breakpoint === "desktop" ? styles.forceDesktop : "",
      breakpoint === "tabletMobile" ? styles.forceTabletMobile : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const isDashboard =
      state === "teacherDashboard" || state === "studentDashboard";
    const isLesson = state === "labLevel" || state === "nonLabLesson";
    const resolvedNav =
      navItems ?? (state === "teacherDashboard" ? TEACHER_NAV : STUDENT_NAV);

    const widget = isLesson ? (
      <ProgressWidget
        levelLabel="Lesson 3: Introduction to Online Puzzles"
        {...progressWidgetProps}
        breakpoint={
          breakpoint === "auto"
            ? "auto"
            : breakpoint === "tabletMobile"
              ? "tabletMobile"
              : "desktop"
        }
        className={`${styles.widget} ${progressWidgetProps?.className ?? ""}`}
      />
    ) : null;

    return (
      <header
        ref={ref}
        className={rootClasses}
        data-cads-component="GlobalHeader"
        data-state={state}
        {...rest}
      >
        {/* ----- left cluster ----- */}
        <div className={styles.left}>
          <div className={styles.logo}>
            <CodeAiLogo />
          </div>

          {state === "standaloneProject" ? (
            <div className={styles.projectText}>
              <span className={styles.projectTitleRow}>
                <span className={styles.projectTitle}>{projectTitle}</span>
                <FaIcon name="pencil" family="solid" fontSize="10px" />
              </span>
              <span className={styles.projectSaveStatus}>
                {projectSaveStatusText}
              </span>
            </div>
          ) : null}

          {state === "labLevel" ? (
            <div className={`${styles.leftActions} ${styles.desktopOnly}`}>
              <HeaderButton
                variant="outlined"
                label="Share"
                onClick={onShareClick}
              />
              <HeaderButton
                variant="outlined"
                label="Remix"
                onClick={onRemixClick}
              />
            </div>
          ) : null}
          {state === "labLevel" ? (
            <div className={`${styles.leftActions} ${styles.tabletMobileOnly}`}>
              <HeaderButton
                variant="iconOutlined"
                icon="share"
                ariaLabel="Share"
                onClick={onShareClick}
              />
              <HeaderButton
                variant="iconOutlined"
                icon="rotate"
                ariaLabel="Remix"
                onClick={onRemixClick}
              />
            </div>
          ) : null}

          {state === "standaloneProject" ? (
            <>
              <div className={`${styles.leftActions} ${styles.desktopOnly}`}>
                <HeaderButton
                  variant="outlined"
                  label="Rename"
                  onClick={onRenameClick}
                />
                <HeaderButton
                  variant="outlined"
                  label="Share"
                  onClick={onShareClick}
                />
                <HeaderButton
                  variant="outlined"
                  label="Remix"
                  onClick={onRemixClick}
                />
              </div>
              <div
                className={`${styles.leftActions} ${styles.tabletMobileOnly}`}
              >
                <HeaderButton
                  variant="iconOutlined"
                  icon="pencil"
                  ariaLabel="Rename"
                  onClick={onRenameClick}
                />
                <HeaderButton
                  variant="iconOutlined"
                  icon="share"
                  ariaLabel="Share"
                  onClick={onShareClick}
                />
                <HeaderButton
                  variant="iconOutlined"
                  icon="rotate"
                  ariaLabel="Remix"
                  onClick={onRemixClick}
                />
              </div>
            </>
          ) : null}

          {isDashboard ? (
            <nav
              className={`${styles.navLinks} ${styles.desktopOnly}`}
              aria-label="Primary"
            >
              {resolvedNav.map((item) => (
                <HeaderButton
                  key={item.label}
                  variant="text"
                  label={item.label}
                  onClick={item.onClick}
                />
              ))}
            </nav>
          ) : null}
        </div>

        {/* ----- center cluster ----- */}
        {isLesson ? <div className={styles.center}>{widget}</div> : null}
        {state === "tutorPlus" ? (
          <div className={styles.center}>
            <span className={styles.tutorLabel}>{tutorLabel}</span>
          </div>
        ) : null}

        {/* ----- right cluster ----- */}
        <div className={styles.right}>
          {(isDashboard || state === "standaloneProject") ? (
            <HeaderButton
              variant="outlined"
              label="New project"
              endIcon="plus"
              onClick={onNewProjectClick}
              className={styles.desktopOnly}
            />
          ) : null}
          <UsernameDropdown username={username} onClick={onUsernameClick} />
          <div className={styles.rightIcons}>
            <HeaderButton
              variant="icon"
              icon="circle-question"
              ariaLabel="Help"
              onClick={onHelpClick}
              className={styles.desktopOnly}
            />
            <HeaderButton
              variant="icon"
              icon="bars"
              ariaLabel="Menu"
              onClick={onMenuClick}
            />
          </div>
        </div>
      </header>
    );
  },
);
