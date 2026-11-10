"use client";

import {
  forwardRef,
  useEffect,
  useState,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import { ProgressWidget } from "../progress-widget";
import type { DropdownOption } from "../dropdown/types";
import { CodeAiLogo } from "./CodeAiLogo";
import { CodeAiMark } from "./CodeAiMark";
import { TutorIcon } from "./TutorIcon";
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

/** Same edge as the SCSS `mobile` media query (Figma `<576`). */
const MOBILE_QUERY = "(max-width: 575.98px)";

/** SSR-safe media query flag (false until mounted). */
function useMediaQuery(query: string, enabled: boolean): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query, enabled]);
  return enabled && matches;
}

/**
 * Header chrome buttons intentionally deviate from the CADS Button variants
 * (white-on-brand outlined / text styles specific to this surface), so they
 * are private primitives rather than Button usages.
 */
const HeaderButton = forwardRef<
  HTMLButtonElement,
  {
    variant: "text" | "outlined" | "iconOutlined" | "icon";
    icon?: string;
    endIcon?: string;
    label?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
    ariaLabel?: string;
  }
>(function HeaderButton(
  { variant, icon, endIcon, label, onClick, className = "", ariaLabel },
  ref,
) {
  const variantClass =
    variant === "outlined"
      ? styles.outlinedButton
      : variant === "iconOutlined"
        ? `${styles.outlinedButton} ${styles.iconButton}`
        : variant === "icon"
          ? styles.iconButton
          : styles.textButton;
  // Figma: text icon buttons (help / menu) use a 16px glyph; outlined
  // icon buttons and inline icons use 12px.
  const iconSize = variant === "icon" ? "16px" : "12px";
  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.headerButton} ${variantClass} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon ? <FaIcon name={icon} family="solid" fontSize={iconSize} /> : null}
      {label ? <span className={styles.headerButtonLabel}>{label}</span> : null}
      {endIcon ? (
        <FaIcon name={endIcon} family="solid" fontSize="12px" />
      ) : null}
    </button>
  );
});

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
      className={`${styles.headerButton} ${styles.outlinedButton} ${styles.usernameDropdown} ${styles.hideOnMobile}`}
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
 * Seven page states × four breakpoints (Figma 17240:2903):
 * desktop ≥992 · tablet 768–991 · smallTablet 576–767 · mobile <576.
 */
export const GlobalHeader = forwardRef<HTMLElement, GlobalHeaderProps>(
  function GlobalHeader(props, ref) {
    const {
      state = "labLevel",
      breakpoint = "auto",
      username = "Username",
      startContent,
      centerContent,
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

    const resolvedBreakpoint =
      breakpoint === "tabletMobile" ? "tablet" : breakpoint;

    const rootClasses = [
      styles.root,
      resolvedBreakpoint === "desktop" ? styles.forceDesktop : "",
      resolvedBreakpoint === "tablet" || resolvedBreakpoint === "smallTablet"
        ? styles.forceTablet
        : "",
      resolvedBreakpoint === "mobile" ? styles.forceMobile : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const isDashboard =
      state === "teacherDashboard" || state === "studentDashboard";
    const isLesson = state === "labLevel" || state === "nonLabLesson";
    const resolvedNav =
      navItems ?? (state === "teacherDashboard" ? TEACHER_NAV : STUDENT_NAV);

    // Figma annotation (labLevel <576): Share / Remix move into the
    // Progress Widget "More" menu.
    const autoMobile = useMediaQuery(
      MOBILE_QUERY,
      resolvedBreakpoint === "auto" && state === "labLevel",
    );
    const isMobile = resolvedBreakpoint === "mobile" || autoMobile;
    const labMoreOptions: DropdownOption[] =
      state === "labLevel" && isMobile
        ? [
            { value: "share", label: "Share", iconName: "share" },
            { value: "remix", label: "Remix", iconName: "arrows-rotate" },
          ]
        : [];

    const widget = isLesson ? (
      <ProgressWidget
        levelLabel="Lesson 6: Introduction to Online Puzzles"
        {...progressWidgetProps}
        moreMenuOptions={[
          ...labMoreOptions,
          ...(progressWidgetProps?.moreMenuOptions ?? []),
        ]}
        onMoreMenuAction={(value) => {
          if (state === "labLevel" && value === "share") {
            onShareClick?.(undefined as never);
          } else if (state === "labLevel" && value === "remix") {
            onRemixClick?.(undefined as never);
          }
          progressWidgetProps?.onMoreMenuAction?.(value);
        }}
        breakpoint={resolvedBreakpoint}
        className={`${styles.widget} ${progressWidgetProps?.className ?? ""}`}
      />
    ) : null;

    const hasStartSlot =
      state === "template" && startContent != null && startContent !== false;
    const hasCenterSlot =
      state === "template" && centerContent != null && centerContent !== false;

    return (
      <header
        ref={ref}
        className={rootClasses}
        data-cads-component="GlobalHeader"
        data-state={state}
        {...rest}
      >
        {/* ----- navStartContent ----- */}
        <div
          className={styles.left}
          data-gap={
            state === "standaloneProject" || state === "template"
              ? "wide"
              : state === "labLevel"
                ? "wideExceptMobile"
                : undefined
          }
        >
          <div className={styles.logo}>
            <span className={styles.wordmark}>
              <CodeAiLogo />
            </span>
            <span className={styles.mark}>
              <CodeAiMark />
            </span>
          </div>

          {hasStartSlot ? (
            <div className={styles.startContent} data-slot="start-content">
              {startContent}
            </div>
          ) : null}

          {state === "standaloneProject" ? (
            <div className={`${styles.projectText} ${styles.hideOnMobile}`}>
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
            <>
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
              <div className={`${styles.leftActions} ${styles.tabletOnly}`}>
                <HeaderButton
                  variant="iconOutlined"
                  icon="share"
                  ariaLabel="Share"
                  onClick={onShareClick}
                />
                <HeaderButton
                  variant="iconOutlined"
                  icon="arrows-rotate"
                  ariaLabel="Remix"
                  onClick={onRemixClick}
                />
              </div>
            </>
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
                className={`${styles.leftActions} ${styles.belowDesktop}`}
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
                  icon="arrows-rotate"
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

        {/* ----- navCenterContent ----- */}
        {isLesson ? <div className={styles.center}>{widget}</div> : null}
        {state === "tutorPlus" ? (
          <div className={styles.center}>
            <span className={styles.tutorLabelWrap}>
              <TutorIcon />
              <span className={styles.tutorLabel}>{tutorLabel}</span>
            </span>
          </div>
        ) : null}
        {hasCenterSlot ? (
          <div className={styles.center} data-slot="center-content">
            {centerContent}
          </div>
        ) : null}

        {/* ----- navEndContent ----- */}
        <div className={styles.right}>
          {isDashboard ||
          state === "standaloneProject" ||
          state === "template" ? (
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
