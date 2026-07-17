import Box from "@mui/material/Box";
import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import { TAG_SIZE } from "../shared/controlSize";
import {
  messagingChrome,
  resolveMessagingIconName,
  type MessagingSentiment,
} from "../shared/messagingSentiment";
import { CloseIconButton } from "./CloseIconButton";

/** Figma Tag `color` axis. */
export type TagColor = Exclude<MessagingSentiment, "primary">;
export type TagSize = "large" | "medium" | "small";

export interface TagProps {
  /**
   * Figma `color`.
   * @default "neutral"
   */
  color?: TagColor;
  /**
   * @default "large"
   */
  size?: TagSize;
  /** Figma `labelText`. */
  label?: ReactNode;
  /**
   * @default true
   */
  startIcon?: boolean;
  /**
   * @default false
   */
  endIcon?: boolean;
  startIconName?: FaIconName | (string & {});
  endIconName?: FaIconName | (string & {});
  /**
   * Figma `isDismissible`.
   * @default false
   */
  isDismissible?: boolean;
  onClose?: () => void;
  className?: string;
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
    startIcon = true,
    endIcon = false,
    startIconName = "face-smile",
    endIconName = "face-smile",
    isDismissible = false,
    onClose,
    className,
  },
  ref,
) {
  const dims = TAG_SIZE[size];
  const chrome = messagingChrome(color);
  const startName = resolveMessagingIconName(startIconName);
  const endName = resolveMessagingIconName(endIconName);

  return (
    <Box
      ref={ref}
      className={className}
      data-cads-component="Tag"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "border-box",
        height: dims.height,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        gap: dims.gap,
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${chrome.border}`,
        backgroundColor: chrome.background,
        color: chrome.label,
        fontFamily: "var(--font-body)",
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        fontWeight: "var(--font-weight-semibold)",
        whiteSpace: "nowrap",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: dims.contentGap,
          minWidth: 0,
        }}
      >
        {startIcon ? (
          <FaIcon name={startName} fontSize={dims.iconPx} aria-hidden />
        ) : null}
        <Box component="span" sx={{ minWidth: 0 }}>
          {label}
        </Box>
        {endIcon ? (
          <FaIcon name={endName} fontSize={dims.iconPx} aria-hidden />
        ) : null}
      </Box>
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
    </Box>
  );
});

/** @deprecated Use `TagColor`. Kept for transitional imports from the stub API. */
export type TagTone = TagColor;
