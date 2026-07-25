import Box from "@mui/material/Box";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { NOTIFICATION_BANNER_CHROME } from "../../shared/controlSize";
import {
  messagingChrome,
  resolveMessagingIconName,
} from "../../shared/messagingSentiment";
import { Button } from "../button/index";
import { CloseIconButton } from "../close-icon-button";
import styles from "./notificationBanner.module.scss";
import type { NotificationBannerProps } from "./types";

export type {
  NotificationBannerFillStyle,
  NotificationBannerProps,
  NotificationBannerSentiment,
} from "./types";

function resolveActionLabel(label: ReactNode | undefined): ReactNode {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * CADS Notification Banner — persistent page-level messaging.
 * Spec: Figma Notification Banner `10618:632` /
 * key `5f158e59f1188b62d671448be304f22d3a7bde42`.
 */
export const NotificationBanner = forwardRef<
  HTMLDivElement,
  NotificationBannerProps
>(function NotificationBanner(
  {
    sentiment = "brand",
    fillStyle = "none",
    title,
    description,
    iconName = "face-smile",
    hasPrimaryAction = true,
    hasSecondaryAction = true,
    primaryActionLabel = "Button",
    secondaryActionLabel = "Button",
    onPrimaryAction,
    onSecondaryAction,
    isDismissible = false,
    onClose,
    fullWidth = true,
    className,
    role = "region",
  },
  ref,
) {
  const chrome = messagingChrome(sentiment);
  const tinted = fillStyle === "color";
  const resolvedIcon = resolveMessagingIconName(iconName);
  const surfaceBg = tinted
    ? sentiment === "neutral"
      ? "var(--background-neutral-secondary)"
      : chrome.background
    : "var(--background-neutral-primary)";
  const surfaceBorder = tinted
    ? chrome.borderPrimary
    : "var(--border-neutral-primary)";
  const iconRing =
    sentiment === "neutral"
      ? "var(--border-neutral-secondary)"
      : chrome.borderPrimary;
  const iconColor =
    sentiment === "neutral"
      ? "var(--text-neutral-tertiary)"
      : chrome.icon;
  const primaryButtonColor = tinted ? "secondary" : "primary";
  const primaryLabel = resolveActionLabel(primaryActionLabel);
  const secondaryLabel = resolveActionLabel(secondaryActionLabel);

  const chromeVars = {
    "--nb-bg": surfaceBg,
    "--nb-border": surfaceBorder,
    "--nb-icon-ring": iconRing,
    "--nb-icon-color": iconColor,
  } as CSSProperties;

  return (
    <Box
      ref={ref}
      role={role}
      className={cx(styles.banner, fullWidth && styles.fullWidth, className)}
      style={chromeVars}
      data-cads-component="NotificationBanner"
    >
      <div className={styles.body}>
        <div className={styles.icon} aria-hidden>
          <FaIcon
            name={resolvedIcon}
            fontSize={NOTIFICATION_BANNER_CHROME.iconPx}
          />
        </div>
        <div className={styles.copy}>
          <p className={styles.title}>{title}</p>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
      {hasPrimaryAction || hasSecondaryAction || isDismissible ? (
        <div className={styles.trailing}>
          {hasPrimaryAction || hasSecondaryAction ? (
            <div className={styles.actions}>
              {hasSecondaryAction ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={onSecondaryAction}
                  sx={
                    tinted
                      ? {
                          borderColor: "var(--border-neutral-solid)",
                          "&:hover": {
                            borderColor: "var(--border-neutral-solid)",
                          },
                        }
                      : undefined
                  }
                >
                  {secondaryLabel}
                </Button>
              ) : null}
              {hasPrimaryAction ? (
                <Button
                  variant="contained"
                  color={primaryButtonColor}
                  size="small"
                  onClick={onPrimaryAction}
                >
                  {primaryLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
          {isDismissible ? (
            <CloseIconButton
              size="medium"
              color={sentiment === "neutral" ? "secondary" : sentiment}
              onClick={onClose}
            />
          ) : null}
        </div>
      ) : null}
    </Box>
  );
});
