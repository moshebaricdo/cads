import { forwardRef, type CSSProperties } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { TAG_SIZE } from "../../shared/controlSize";
import {
  messagingChrome,
  resolveMessagingIconName,
} from "../../shared/messagingSentiment";
import { CloseIconButton } from "../close-icon-button";
import styles from "./tag.module.scss";
import type { TagProps } from "./types";

export type { TagColor, TagProps, TagSize, TagTone } from "./types";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * CADS Tag — compact status / category label (not selectable Chip).
 * Spec: Figma Tag `16433:2625` / key `e4a964357b1eaedfab777db89058ccb4d528ec1c`.
 */
export const Tag = forwardRef<HTMLDivElement, TagProps>(function Tag(
  {
    color = "neutral",
    size = "large",
    label = "Tag",
    startIconName,
    endIconName,
    isDismissible = false,
    onClose,
    className,
  },
  ref,
) {
  const dims = TAG_SIZE[size];
  const chrome = messagingChrome(color);
  const startName = startIconName
    ? resolveMessagingIconName(startIconName)
    : null;
  const endName = endIconName ? resolveMessagingIconName(endIconName) : null;

  const chromeVars = {
    "--tag-height": dims.height,
    "--tag-px": dims.paddingInline,
    "--tag-py": dims.paddingBlock,
    "--tag-gap": dims.gap,
    "--tag-content-gap": dims.contentGap,
    "--tag-font-size": dims.fontSize,
    "--tag-line-height": dims.lineHeight,
    "--tag-border": chrome.border,
    "--tag-bg": chrome.background,
    "--tag-fg": chrome.label,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={cx(styles.root, className)}
      data-cads-component="Tag"
      style={chromeVars}
    >
      <span className={styles.content}>
        {startName ? (
          <FaIcon name={startName} fontSize={dims.iconPx} aria-hidden />
        ) : null}
        <span className={styles.label}>{label}</span>
        {endName ? (
          <FaIcon name={endName} fontSize={dims.iconPx} aria-hidden />
        ) : null}
      </span>
      {isDismissible ? (
        <CloseIconButton
          size={
            size === "large"
              ? "medium"
              : size === "medium"
                ? "small"
                : "extraSmall"
          }
          color={color === "neutral" ? "secondary" : color}
          onClick={onClose}
          sx={{ width: dims.closeWidth }}
        />
      ) : null}
    </div>
  );
});
