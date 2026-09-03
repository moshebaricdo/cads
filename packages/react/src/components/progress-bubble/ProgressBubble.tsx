"use client";

import ButtonBase from "@mui/material/ButtonBase";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { FaIcon } from "../../icons/FaIcon";
import styles from "./progressBubble.module.scss";
import { TutorPlusMark } from "./TutorPlusMark";
import type { ProgressBubbleProps, ProgressBubbleStatus } from "./types";

interface StatusRecipe {
  bg: string;
  fg: string;
  border?: string;
  bgHover: string;
  fgHover: string;
}

/**
 * Status chrome from the CADS Figma Progress Bubbles set (17307:1165).
 * Press reuses hover pending a dedicated Figma press spec.
 */
const STATUS_RECIPES: Record<ProgressBubbleStatus, StatusRecipe> = {
  notStarted: {
    bg: "var(--background-neutral-primary)",
    fg: "var(--text-neutral-primary)",
    border: "var(--border-neutral-secondary)",
    bgHover: "var(--background-neutral-tertiary)",
    fgHover: "var(--text-neutral-primary)",
  },
  inProgress: {
    bg: "var(--background-neutral-primary)",
    fg: "var(--text-neutral-primary)",
    border: "var(--border-success-strong)",
    bgHover: "var(--background-success-light)",
    fgHover: "var(--text-neutral-primary)",
  },
  passed: {
    bg: "var(--background-success-mid)",
    fg: "var(--text-neutral-primary)",
    bgHover: "var(--background-success-strong)",
    fgHover: "var(--text-neutral-white-fixed)",
  },
  completed: {
    bg: "var(--background-success-primary)",
    fg: "var(--text-neutral-white-fixed)",
    bgHover: "var(--background-success-strong)",
    fgHover: "var(--text-neutral-white-fixed)",
  },
  error: {
    bg: "var(--background-error-primary)",
    fg: "var(--text-neutral-white-fixed)",
    bgHover: "var(--background-error-strong)",
    fgHover: "var(--text-neutral-white-fixed)",
  },
};

function statusVars(status: ProgressBubbleStatus): CSSProperties {
  const r = STATUS_RECIPES[status];
  return {
    "--pb-bg": r.bg,
    "--pb-fg": r.fg,
    "--pb-border": r.border ?? "transparent",
    "--pb-border-width": r.border ? "1.5px" : "0px",
    "--pb-bg-hover": r.bgHover,
    "--pb-fg-hover": r.fgHover,
  } as CSSProperties;
}

function glyphVars(): CSSProperties {
  return {
    "--pb-bg": "transparent",
    "--pb-fg": "var(--text-neutral-quaternary)",
    "--pb-border": "transparent",
    "--pb-border-width": "0px",
    "--pb-bg-hover": "transparent",
    "--pb-fg-hover": "var(--text-neutral-primary)",
  } as CSSProperties;
}

function GlyphMark({
  levelType,
}: {
  levelType: "lessonExtras" | "tutorPlus";
}) {
  if (levelType === "tutorPlus") return <TutorPlusMark size={12} />;
  return <FaIcon name="flag-checkered" family="solid" fontSize="11px" />;
}

/**
 * Level progress bubble from the CADS Global Header progress widget.
 * Circle / panel-diamond level shapes with status chrome, plus
 * lesson-extras and Tutor+ glyph variants.
 *
 * Figma: Progress Bubbles (17307:1165).
 */
export const ProgressBubble = forwardRef<
  HTMLButtonElement,
  ProgressBubbleProps
>(function ProgressBubble(props, ref) {
  const {
    levelType = "default",
    status = "notStarted",
    isActive = false,
    isAssessment = false,
    levelNumber,
    interactive = true,
    className = "",
    style,
    disabled,
    ...rest
  } = props;

  const isGlyphType = levelType === "lessonExtras" || levelType === "tutorPlus";

  let content: ReactNode = null;
  let shapeClass = styles.circle;

  if (isGlyphType) {
    shapeClass = styles.glyph;
    content = <GlyphMark levelType={levelType} />;
  } else if (levelType === "panelLevel") {
    shapeClass = styles.panel;
    content = (
      <>
        <span className={styles.diamond} aria-hidden="true" />
        {isActive ? (
          <span className={styles.levelNumber}>{levelNumber}</span>
        ) : null}
      </>
    );
  } else if (isActive) {
    content = <span className={styles.levelNumber}>{levelNumber}</span>;
  }

  // Inactive assessment levels swap the dot/number for a small star;
  // active ones pin a star badge to the top-right corner instead.
  const showInlineStar = isAssessment && !isGlyphType && !isActive;
  const showStarBadge = isAssessment && !isGlyphType && isActive;

  const rootClasses = [
    styles.root,
    shapeClass,
    isActive && !isGlyphType ? styles.active : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const mergedStyle: CSSProperties = {
    ...(isGlyphType ? glyphVars() : statusVars(status)),
    ...style,
  };

  const body = (
    <>
      {content}
      {showInlineStar ? (
        <FaIcon
          name="star"
          family="solid"
          fontSize="6px"
          className={styles.inlineStar}
        />
      ) : null}
      {showStarBadge ? (
        <span className={styles.starBadge} aria-hidden="true">
          <FaIcon name="star" family="solid" fontSize="5px" />
        </span>
      ) : null}
    </>
  );

  if (!interactive) {
    return (
      <span
        className={`${rootClasses} ${styles.static}`}
        style={mergedStyle}
        aria-disabled={disabled || undefined}
      >
        {body}
      </span>
    );
  }

  return (
    <ButtonBase
      ref={ref}
      className={rootClasses}
      style={mergedStyle}
      disabled={disabled}
      disableRipple
      {...rest}
    >
      {body}
    </ButtonBase>
  );
});
