import Box from "@mui/material/Box";
import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import { TOAST_CHROME } from "../shared/controlSize";
import {
  defaultStatusIcon,
  messagingChrome,
  resolveMessagingIconName,
  type MessagingSentiment,
} from "../shared/messagingSentiment";
import { Button } from "./Button";
import { CloseIconButton } from "./CloseIconButton";

/** Figma Toast `sentiment` (uses `primary` for brand chrome). */
export type ToastSentiment = Exclude<MessagingSentiment, "brand" | "orange">;

function resolveActionLabel(label: ReactNode | undefined): ReactNode {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}

export interface ToastProps {
  /**
   * Figma `sentiment`.
   * @default "primary"
   */
  sentiment?: ToastSentiment;
  /** Toast body copy (Figma `toastText`). */
  children?: ReactNode;
  /**
   * Leading status/custom icon (Figma `hasIcon` + icon name).
   * - `undefined` — show the sentiment default (or face-smile)
   * - `false` — hide the icon (MUI Alert `icon={false}` convention)
   * - string — custom FA icon name
   */
  iconName?: FaIconName | false | (string & {});
  /**
   * Show trailing outlined secondary action button (variant/color/size locked).
   * @default false
   */
  hasAction?: boolean;
  /**
   * Action button label. Always required when `hasAction` — empty falls back to "Button".
   * @default "Button"
   */
  actionLabel?: ReactNode;
  /** Optional start icon on the locked secondary outlined action Button. */
  actionStartIconName?: FaIconName | (string & {});
  /** Optional end icon on the locked secondary outlined action Button. */
  actionEndIconName?: FaIconName | (string & {});
  onAction?: () => void;
  /**
   * @default true
   */
  isDismissible?: boolean;
  onClose?: () => void;
  className?: string;
  role?: string;
}

/**
 * CADS Toast — temporary elevated feedback notification.
 * Spec: Figma Toast `10587:14942` / key `29c36f3d7ec051b81e7dc42a724d9097a680f2ee`.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    sentiment = "primary",
    children = "This is a toast.",
    iconName,
    hasAction = false,
    actionLabel = "Button",
    actionStartIconName,
    actionEndIconName,
    onAction,
    isDismissible = true,
    onClose,
    className,
    role = "status",
  },
  ref,
) {
  const chrome = messagingChrome(sentiment);
  const statusDefault = defaultStatusIcon(sentiment);
  const showIcon = iconName !== false;
  const resolvedIcon = showIcon
    ? resolveMessagingIconName(
        typeof iconName === "string" ? iconName : undefined,
        statusDefault ?? "face-smile",
      )
    : null;
  const label = resolveActionLabel(actionLabel);

  return (
    <Box
      ref={ref}
      role={role}
      className={className}
      data-cads-component="Toast"
      sx={{
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: TOAST_CHROME.width,
        maxWidth: "100%",
        paddingInline: TOAST_CHROME.paddingInline,
        paddingBlock: TOAST_CHROME.paddingBlock,
        gap: TOAST_CHROME.gap,
        borderRadius: TOAST_CHROME.radius,
        border: `1px solid ${chrome.border}`,
        backgroundColor: chrome.background,
        boxShadow: TOAST_CHROME.shadow,
        fontFamily: "var(--font-body)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          alignItems: "center",
          gap: TOAST_CHROME.contentGap,
          minWidth: 0,
          color: "var(--text-neutral-primary)",
        }}
      >
        {showIcon && resolvedIcon ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: TOAST_CHROME.iconSlot,
              color: chrome.icon,
              lineHeight: 1,
              "& > *": { display: "block", lineHeight: 1 },
            }}
            aria-hidden
          >
            <FaIcon name={resolvedIcon} fontSize={TOAST_CHROME.iconPx} />
          </Box>
        ) : null}
        <Box
          component="p"
          sx={{
            m: 0,
            flex: "1 1 auto",
            minWidth: 0,
            fontSize: TOAST_CHROME.fontSize,
            lineHeight: TOAST_CHROME.lineHeight,
            fontWeight: "var(--font-weight-normal)",
          }}
        >
          {children}
        </Box>
      </Box>
      {hasAction || isDismissible ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            gap: TOAST_CHROME.actionGap,
          }}
        >
          {hasAction ? (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIconName={actionStartIconName}
              endIconName={actionEndIconName}
              onClick={onAction}
            >
              {label}
            </Button>
          ) : null}
          {isDismissible ? (
            <CloseIconButton
              size="medium"
              color={
                sentiment === "primary"
                  ? "brand"
                  : sentiment === "neutral"
                    ? "secondary"
                    : sentiment
              }
              onClick={onClose}
            />
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
});
