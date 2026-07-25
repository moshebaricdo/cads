import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { ALERT_SIZE } from "../../shared/controlSize";
import {
  defaultStatusIcon,
  messagingChrome,
  resolveMessagingIconName,
} from "../../shared/messagingSentiment";
import { Button } from "../button/index";
import { CloseIconButton } from "../close-icon-button";
import styles from "./alert.module.scss";
import type { AlertProps } from "./types";

export type { AlertProps, AlertSentiment, AlertSize } from "./types";

function resolveActionLabel(label: ReactNode | undefined): ReactNode {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
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

  const chromeVars = {
    "--alert-min-height": dims.minHeight,
    "--alert-px": dims.paddingInline,
    "--alert-py": dims.paddingBlock,
    "--alert-gap": dims.gap,
    "--alert-content-gap": dims.contentGap,
    "--alert-action-gap": dims.actionGap,
    "--alert-font-size": dims.fontSize,
    "--alert-line-height": dims.lineHeight,
    "--alert-icon-slot": dims.iconSlot,
    "--alert-border": chrome.border,
    "--alert-bg": chrome.background,
    "--alert-icon-color": chrome.icon,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      role={role}
      className={cx(styles.root, fullWidth && styles.fullWidth, className)}
      style={chromeVars}
      data-cads-component="Alert"
    >
      <div className={styles.content}>
        {showIcon && resolvedIcon ? (
          <div className={styles.iconWrap} aria-hidden>
            <FaIcon name={resolvedIcon} fontSize={dims.iconPx} />
          </div>
        ) : null}
        <p className={styles.text}>{children}</p>
      </div>
      {hasAction || isDismissible ? (
        <div className={styles.trailing}>
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
        </div>
      ) : null}
    </div>
  );
});
