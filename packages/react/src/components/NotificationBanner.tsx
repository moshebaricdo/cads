import Box from "@mui/material/Box";
import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import { NOTIFICATION_BANNER_CHROME } from "../shared/controlSize";
import {
  messagingChrome,
  resolveMessagingIconName,
  type MessagingSentiment,
} from "../shared/messagingSentiment";
import { Button } from "./Button";
import { CloseIconButton } from "./CloseIconButton";

export type NotificationBannerSentiment = Exclude<
  MessagingSentiment,
  "primary" | "orange"
>;
export type NotificationBannerFillStyle = "none" | "color";

function resolveActionLabel(label: ReactNode | undefined): ReactNode {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}

export interface NotificationBannerProps {
  /**
   * Figma `sentiment`.
   * @default "brand"
   */
  sentiment?: NotificationBannerSentiment;
  /**
   * Figma `fillStyle` — white surface vs tinted.
   * @default "none"
   */
  fillStyle?: NotificationBannerFillStyle;
  /** Figma `titleText` — required. */
  title: ReactNode;
  /** Figma `descriptionText` — required. */
  description: ReactNode;
  /**
   * Figma `iconName`.
   * @default "face-smile"
   */
  iconName?: FaIconName | (string & {});
  /**
   * @default true
   */
  hasPrimaryAction?: boolean;
  /**
   * @default true
   */
  hasSecondaryAction?: boolean;
  primaryActionLabel?: ReactNode;
  secondaryActionLabel?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /**
   * @default false
   */
  isDismissible?: boolean;
  onClose?: () => void;
  /**
   * Stretch to the parent width (default). Set false for hug content.
   * @default true
   */
  fullWidth?: boolean;
  className?: string;
  role?: string;
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
  const secondaryBorderColor = tinted
    ? "var(--border-neutral-solid)"
    : undefined;
  const primaryLabel = resolveActionLabel(primaryActionLabel);
  const secondaryLabel = resolveActionLabel(secondaryActionLabel);

  return (
    <Box
      ref={ref}
      role={role}
      className={className}
      data-cads-component="NotificationBanner"
      sx={{
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: fullWidth ? "100%" : "fit-content",
        maxWidth: "100%",
        padding: NOTIFICATION_BANNER_CHROME.padding,
        gap: NOTIFICATION_BANNER_CHROME.gap,
        borderRadius: NOTIFICATION_BANNER_CHROME.radius,
        border: `1px solid ${surfaceBorder}`,
        backgroundColor: surfaceBg,
        overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          alignItems: "center",
          gap: NOTIFICATION_BANNER_CHROME.contentGap,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: NOTIFICATION_BANNER_CHROME.iconSize,
            height: NOTIFICATION_BANNER_CHROME.iconSize,
            borderRadius: "var(--radius-round)",
            border: `${NOTIFICATION_BANNER_CHROME.iconBorder} solid ${iconRing}`,
            backgroundColor: "var(--background-neutral-primary)",
            color: iconColor,
            lineHeight: 1,
            "& > *": { display: "block", lineHeight: 1 },
          }}
          aria-hidden
        >
          <FaIcon
            name={resolvedIcon}
            fontSize={NOTIFICATION_BANNER_CHROME.iconPx}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: "1 1 auto",
            minWidth: 0,
            gap: "0.125rem",
          }}
        >
          <Box
            component="p"
            sx={{
              m: 0,
              color: "var(--text-neutral-primary)",
              fontSize: NOTIFICATION_BANNER_CHROME.titleSize,
              lineHeight: NOTIFICATION_BANNER_CHROME.titleLineHeight,
              fontWeight: "var(--font-weight-semibold)",
            }}
          >
            {title}
          </Box>
          <Box
            component="p"
            sx={{
              m: 0,
              color: "var(--text-neutral-secondary)",
              fontSize: NOTIFICATION_BANNER_CHROME.descriptionSize,
              lineHeight: NOTIFICATION_BANNER_CHROME.descriptionLineHeight,
              fontWeight: "var(--font-weight-normal)",
            }}
          >
            {description}
          </Box>
        </Box>
      </Box>
      {hasPrimaryAction || hasSecondaryAction || isDismissible ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            gap: NOTIFICATION_BANNER_CHROME.actionGap,
          }}
        >
          {hasPrimaryAction || hasSecondaryAction ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: NOTIFICATION_BANNER_CHROME.buttonGap,
              }}
            >
              {hasSecondaryAction ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={onSecondaryAction}
                  sx={
                    secondaryBorderColor
                      ? {
                          borderColor: secondaryBorderColor,
                          "&:hover": { borderColor: secondaryBorderColor },
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
            </Box>
          ) : null}
          {isDismissible ? (
            <CloseIconButton
              size="medium"
              color={sentiment === "neutral" ? "secondary" : sentiment}
              onClick={onClose}
            />
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
});
