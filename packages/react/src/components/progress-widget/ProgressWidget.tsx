"use client";

import { forwardRef } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { Button } from "../button";
import { IconTooltip } from "../icon-tooltip";
import { ProgressBubble } from "../progress-bubble";
import styles from "./progressWidget.module.scss";
import type { ProgressWidgetProps } from "./types";

const DEFAULT_SAVED_LABEL = "Saved 2 minutes ago";
const DEFAULT_OFFLINE_LABEL = "Offline";

/**
 * Lab progress widget from the CADS Global Header (Figma 17307:1036).
 *
 * Desktop (≥960px): level dropdown (hugs its label, truncates when the
 * viewport forces it) + cloud sync status + bubble rail + action button.
 * Tablet (600–959px): the rail folds away, the active level's bubble
 * nests inside the dropdown as a small non-interactive start icon, and a
 * leading outlined back button appears when `hasLeftAction` (Figma default).
 * Phone (<600px): same fold, dropdown label is the lesson number instead
 * of the full name (cloud stays).
 */

function resolveLevelNumber(
  levelLabel: string,
  activeLevelIndex?: number,
): string {
  const fromLabel = levelLabel.match(/\d+/)?.[0];
  if (fromLabel) return fromLabel;
  if (activeLevelIndex != null) return String(activeLevelIndex + 1);
  return "";
}
export const ProgressWidget = forwardRef<HTMLDivElement, ProgressWidgetProps>(
  function ProgressWidget(props, ref) {
    const {
      levelLabel,
      levels = [],
      activeLevelIndex,
      breakpoint = "auto",
      saveStatus = "saved",
      saveStatusLabel,
      hasAction = true,
      actionLabel = "I finished",
      onActionClick,
      hasLeftAction = true,
      onBackClick,
      onLevelSelectClick,
      className = "",
      ...rest
    } = props;

    const activeLevel =
      activeLevelIndex != null ? levels[activeLevelIndex] : undefined;

    const tooltipLabel =
      saveStatusLabel ??
      (saveStatus === "offline" ? DEFAULT_OFFLINE_LABEL : DEFAULT_SAVED_LABEL);

    const levelNumber = resolveLevelNumber(levelLabel, activeLevelIndex);

    const rootClasses = [
      styles.root,
      breakpoint === "desktop" ? styles.forceDesktop : "",
      breakpoint === "tabletMobile" ? styles.forceTabletMobile : "",
      breakpoint === "mobile" ? styles.forceMobile : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={rootClasses}
        data-cads-component="ProgressWidget"
        {...rest}
      >
        {hasLeftAction ? (
          <div className={styles.leftActionContainer}>
            <Button
              variant="outlined"
              color="secondary"
              size="extraSmall"
              iconOnly
              startIconName="arrow-left"
              aria-label="Back"
              onClick={onBackClick}
            />
          </div>
        ) : null}
        <div
          className={`${styles.dropdownContainer} ${
            hasAction ? styles.withActionDivider : ""
          }`}
        >
          <button
            type="button"
            className={styles.levelSelect}
            onClick={onLevelSelectClick}
            aria-label={`Current level: ${levelLabel}`}
          >
            {activeLevel ? (
              <span className={styles.nestedBubble} aria-hidden="true">
                <ProgressBubble
                  interactive={false}
                  levelType={activeLevel.levelType}
                  status={activeLevel.status}
                  isAssessment={activeLevel.isAssessment}
                />
              </span>
            ) : null}
            <span className={styles.levelLabel}>{levelLabel}</span>
            {levelNumber ? (
              <span className={styles.levelNumber} aria-hidden="true">
                {levelNumber}
              </span>
            ) : null}
            <FaIcon
              name="chevron-down"
              family="solid"
              fontSize="12px"
              className={styles.chevron}
            />
          </button>
          <span className={styles.cloudSlot}>
            <IconTooltip
              iconName={saveStatus === "offline" ? "cloud-slash" : "cloud-check"}
              title={tooltipLabel}
              placement="bottom"
              size="extraSmall"
              aria-label={
                saveStatus === "offline"
                  ? "Sync status: offline"
                  : `Sync status: ${tooltipLabel}`
              }
              triggerProps={{
                className: [
                  styles.cloudSync,
                  saveStatus === "offline" ? styles.cloudSyncOffline : "",
                ]
                  .filter(Boolean)
                  .join(" "),
              }}
            />
          </span>
        </div>

        {levels.length > 0 ? (
          <div
            className={`${styles.bubbleSlot} ${
              hasAction ? styles.withActionDivider : ""
            }`}
          >
            {levels.map((level, index) => {
              const isActive = index === activeLevelIndex;
              return (
                <ProgressBubble
                  key={index}
                  levelType={level.levelType}
                  status={level.status}
                  isAssessment={level.isAssessment}
                  isActive={isActive}
                  levelNumber={isActive ? index + 1 : undefined}
                  onClick={level.onClick}
                  aria-label={level.label ?? `Level ${index + 1}`}
                  aria-current={isActive ? "step" : undefined}
                />
              );
            })}
          </div>
        ) : null}

        {hasAction ? (
          <div className={styles.actionContainer}>
            <Button
              variant="contained"
              color="secondary"
              size="extraSmall"
              endIconName="arrow-right"
              onClick={onActionClick}
            >
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    );
  },
);
