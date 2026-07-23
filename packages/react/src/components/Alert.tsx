import Box from "@mui/material/Box";
import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import { ALERT_SIZE, type ControlSize } from "../shared/controlSize";
import {
  defaultStatusIcon,
  messagingChrome,
  resolveMessagingIconName,
  type MessagingSentiment,
} from "../shared/messagingSentiment";
import { Button } from "./Button";
import { CloseIconButton } from "./CloseIconButton";

export type AlertSize = ControlSize;
export type AlertSentiment = Exclude<MessagingSentiment, "primary" | "orange">;

function resolveActionLabel(label: ReactNode | undefined): ReactNode {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}

export interface AlertProps {
  /**
   * @default "large"
   */
  size?: AlertSize;
  /**
   * Figma `sentiment`.
   * @default "brand"
   */
  sentiment?: AlertSentiment;
  /** Alert body copy (Figma `alertText`). */
  children?: ReactNode;
  /**
   * Leading status/custom icon (Figma `hasIcon` + `alertIcon`).
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
   * Show dismiss control (Figma `isDismissible`).
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
 * CADS Alert — inline contextual status banner.
 * Spec: Figma Alert `2133:4160` / key `dbe516b76486882d3508633715c5e4e999c183db`.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    size = "large",
    sentiment = "brand",
    children = "This is an alert.",
    iconName,
    hasAction = false,
    actionLabel = "Button",
    actionStartIconName,
    actionEndIconName,
    onAction,
    isDismissible = false,
    onClose,
    fullWidth = true,
    className,
    role = "status",
  },
  ref,
) {
  const dims = ALERT_SIZE[size];
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
      data-cads-component="Alert"
      sx={{
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: fullWidth ? "100%" : "fit-content",
        maxWidth: "100%",
        minHeight: dims.minHeight,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        gap: dims.gap,
        borderRadius: "var(--radius-md)",
        border: `1px solid ${chrome.border}`,
        backgroundColor: chrome.background,
        fontFamily: "var(--font-body)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          alignItems: "flex-start",
          gap: dims.contentGap,
          minWidth: 0,
        }}
      >
        {showIcon && resolvedIcon ? (
          <Box
            sx={{
              // Match the text line-box height and center the FA glyph inside it.
              // Figma uses iconWrap paddingTop for the same optical alignment;
              // web FA metrics need the full line-box rather than a fixed pad.
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: dims.iconSlot,
              height: dims.lineHeight,
              color: chrome.icon,
              lineHeight: 0,
            }}
            aria-hidden
          >
            <FaIcon
              name={resolvedIcon}
              fontSize={dims.iconPx}
              style={{
                width: dims.iconSlot,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Box>
        ) : null}
        <Box
          component="p"
          sx={{
            m: 0,
            flex: "1 1 auto",
            minWidth: 0,
            color: "var(--text-neutral-primary)",
            fontSize: dims.fontSize,
            lineHeight: dims.lineHeight,
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
            justifyContent: "flex-end",
            flexShrink: 0,
            gap: dims.actionGap,
          }}
        >
          {hasAction ? (
            <Button
              variant="outlined"
              color="secondary"
              size={dims.actionButtonSize}
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
              color={sentiment === "neutral" ? "secondary" : sentiment}
              onClick={onClose}
            />
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
});
