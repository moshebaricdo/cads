"use client";

import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { Button } from "../button";
import { Dropdown } from "../dropdown";
import type { DropdownOption } from "../dropdown/types";
import { IconTooltip } from "../icon-tooltip";
import { ProgressBubble } from "../progress-bubble";
import styles from "./progressWidget.module.scss";
import type { ProgressWidgetProps } from "./types";

const DEFAULT_SAVED_LABEL = "Saved 2 minutes ago";
const DEFAULT_UNSAVED_LABEL = "Unsaved changes";
const DEFAULT_OFFLINE_LABEL = "Offline";

/**
 * Lab progress widget from the CADS Global Header (Figma 17307:1036).
 *
 * Desktop (≥992px): level dropdown (hugs its label, truncates when the
 * viewport forces it) + cloud sync status + bubble rail + action button.
 * Tablet (768–991px): leading back button · dropdown + cloud · the active
 * level bubble in its own slot · action.
 * Compact (<768px): back + ellipsis "More" menu · active bubble · action —
 * the dropdown and cloud fold away (Figma `<768px`, saveStatus `n/a`).
 * `version="template"` renders three blank slots in the same chrome.
 */
export const ProgressWidget = forwardRef<HTMLDivElement, ProgressWidgetProps>(
  function ProgressWidget(props, ref) {
    const {
      version = "default",
      levelLabel = "",
      levels = [],
      activeLevelIndex,
      breakpoint = "auto",
      saveStatus = "saved",
      showSaveStatus = true,
      saveStatusLabel,
      hasAction = true,
      actionLabel = "I finished",
      onActionClick,
      hasLeftAction = true,
      onBackClick,
      onLevelSelectClick,
      moreMenuOptions,
      onMoreMenuAction,
      startSlot,
      middleSlot,
      endSlot,
      className = "",
      ...rest
    } = props;

    const resolvedBreakpoint =
      breakpoint === "tabletMobile" ? "tablet" : breakpoint;

    const rootClasses = [
      styles.root,
      resolvedBreakpoint === "desktop" ? styles.forceDesktop : "",
      resolvedBreakpoint === "tablet" ? styles.forceTablet : "",
      resolvedBreakpoint === "smallTablet" || resolvedBreakpoint === "mobile"
        ? styles.forceCompact
        : "",
      hasLeftAction ? styles.withLeftAction : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (version === "template") {
      const slots: [string, ReactNode][] = [
        ["start", startSlot],
        ["middle", middleSlot],
        ["end", endSlot],
      ];
      return (
        <div
          ref={ref}
          className={`${styles.root} ${className}`}
          data-cads-component="ProgressWidget"
          data-version="template"
          {...rest}
        >
          {slots.map(([name, content]) =>
            name === "middle" || (content != null && content !== false) ? (
              <div
                key={name}
                className={`${styles.templateSlot} ${
                  name === "middle" ? styles.templateMiddle : ""
                }`}
                data-slot={name}
              >
                {content}
              </div>
            ) : null,
          )}
        </div>
      );
    }

    const activeLevel =
      activeLevelIndex != null ? levels[activeLevelIndex] : undefined;

    const isUnsaved = saveStatus === "unsaved" || saveStatus === "offline";
    const tooltipLabel =
      saveStatusLabel ??
      (saveStatus === "offline"
        ? DEFAULT_OFFLINE_LABEL
        : saveStatus === "unsaved"
          ? DEFAULT_UNSAVED_LABEL
          : DEFAULT_SAVED_LABEL);

    const moreOptions: DropdownOption[] = [
      ...(levelLabel ? [{ type: "group" as const, label: levelLabel }] : []),
      ...(moreMenuOptions ?? []),
    ];

    const backButton = (
      <Button
        variant="outlined"
        color="secondary"
        size="extraSmall"
        iconOnly
        startIconName="arrow-left"
        aria-label="Back"
        onClick={onBackClick}
      />
    );

    return (
      <div
        ref={ref}
        className={rootClasses}
        data-cads-component="ProgressWidget"
        {...rest}
      >
        {/* Tablet: back only. Compact: back + More. Desktop: hidden. */}
        <div className={styles.leftActionContainer}>
          {hasLeftAction ? backButton : null}
          <span className={styles.moreMenu}>
            <Dropdown
              role="action"
              size="extraSmall"
              iconOnly
              startIconName="ellipsis"
              buttonVariant="outlined"
              buttonColor="secondary"
              aria-label="More"
              menuPlacement="bottomLeft"
              options={moreOptions}
              onAction={(value) => onMoreMenuAction?.(value)}
            />
          </span>
        </div>

        <div className={styles.dropdownContainer}>
          <button
            type="button"
            className={styles.levelSelect}
            onClick={onLevelSelectClick}
            aria-label={`Current level: ${levelLabel}`}
          >
            <span className={styles.levelLabel}>{levelLabel}</span>
            <FaIcon
              name="chevron-down"
              family="solid"
              fontSize="12px"
              className={styles.chevron}
            />
          </button>
          {showSaveStatus ? (
            <span className={styles.cloudSlot}>
              <IconTooltip
                iconName={isUnsaved ? "cloud-slash" : "cloud-check"}
                title={tooltipLabel}
                placement="bottom"
                size="extraSmall"
                aria-label={`Sync status: ${tooltipLabel}`}
                triggerProps={{
                  className: [
                    styles.cloudSync,
                    isUnsaved ? styles.cloudSyncUnsaved : "",
                  ]
                    .filter(Boolean)
                    .join(" "),
                }}
              />
            </span>
          ) : null}
        </div>

        {levels.length > 0 ? (
          <div className={styles.bubbleSlot}>
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

        {activeLevel && activeLevelIndex != null ? (
          <div className={styles.activeBubbleSlot}>
            <ProgressBubble
              levelType={activeLevel.levelType}
              status={activeLevel.status}
              isAssessment={activeLevel.isAssessment}
              isActive
              levelNumber={activeLevelIndex + 1}
              onClick={activeLevel.onClick}
              aria-label={activeLevel.label ?? `Level ${activeLevelIndex + 1}`}
              aria-current="step"
            />
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
