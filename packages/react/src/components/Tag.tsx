import Chip, { type ChipProps } from "@mui/material/Chip";
import { forwardRef } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";

export type TagTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "error"
  | "info";
export type TagSize = "m" | "s";

export interface TagProps extends Omit<ChipProps, "color" | "size" | "icon"> {
  /**
   * Semantic tone.
   * @default "neutral"
   */
  tone?: TagTone;
  /**
   * @default "m"
   */
  size?: TagSize;
  iconName?: FaIconName;
}

const TONE_STYLES: Record<
  TagTone,
  { bg: string; color: string; border: string }
> = {
  neutral: {
    bg: "var(--ds-background-neutral-secondary)",
    color: "var(--ds-text-neutral-primary)",
    border: "var(--ds-border-neutral-primary)",
  },
  brand: {
    bg: "var(--ds-background-brand-light)",
    color: "var(--ds-text-brand-primary)",
    border: "var(--ds-border-brand-primary)",
  },
  success: {
    bg: "var(--ds-background-success-light)",
    color: "var(--ds-text-success-primary)",
    border: "var(--ds-border-success-primary)",
  },
  warning: {
    bg: "var(--ds-background-warning-light)",
    color: "var(--ds-text-warning-primary)",
    border: "var(--ds-border-warning-primary)",
  },
  error: {
    bg: "var(--ds-background-error-light)",
    color: "var(--ds-text-error-primary)",
    border: "var(--ds-border-error-primary)",
  },
  info: {
    bg: "var(--ds-background-info-light)",
    color: "var(--ds-text-info-primary)",
    border: "var(--ds-border-info-primary)",
  },
};

/**
 * CADS Tag (Chip) — compact labeled badge with optional icon.
 * Spec source: CADS Figma Tag / Chip component set.
 */
export const Tag = forwardRef<HTMLDivElement, TagProps>(function Tag(
  { tone = "neutral", size = "m", iconName, label, sx, ...rest },
  ref,
) {
  const t = TONE_STYLES[tone];
  return (
    <Chip
      ref={ref}
      label={label}
      size={size === "s" ? "small" : "medium"}
      icon={iconName ? <FaIcon name={iconName} size="xs" /> : undefined}
      sx={{
        height: size === "s" ? "20px" : "24px",
        borderRadius: "var(--radius-round)",
        backgroundColor: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-xs)",
        fontWeight: "var(--font-weight-medium)",
        "& .MuiChip-icon": { color: "inherit", marginLeft: "6px" },
        ...((sx as object) ?? {}),
      }}
      {...rest}
    />
  );
});
