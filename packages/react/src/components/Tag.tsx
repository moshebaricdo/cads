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
export type TagSize = "medium" | "small";

export interface TagProps extends Omit<ChipProps, "color" | "size" | "icon"> {
  /**
   * Semantic tone.
   * @default "neutral"
   */
  tone?: TagTone;
  /**
   * @default "medium"
   */
  size?: TagSize;
  iconName?: FaIconName;
}

const TONE_STYLES: Record<
  TagTone,
  { bg: string; color: string; border: string }
> = {
  neutral: {
    bg: "var(--background-neutral-secondary)",
    color: "var(--text-neutral-primary)",
    border: "var(--border-neutral-primary)",
  },
  brand: {
    bg: "var(--background-brand-light)",
    color: "var(--text-brand-primary)",
    border: "var(--border-brand-primary)",
  },
  success: {
    bg: "var(--background-success-light)",
    color: "var(--text-success-primary)",
    border: "var(--border-success-primary)",
  },
  warning: {
    bg: "var(--background-warning-light)",
    color: "var(--text-warning-primary)",
    border: "var(--border-warning-primary)",
  },
  error: {
    bg: "var(--background-error-light)",
    color: "var(--text-error-primary)",
    border: "var(--border-error-primary)",
  },
  info: {
    bg: "var(--background-info-light)",
    color: "var(--text-info-primary)",
    border: "var(--border-info-primary)",
  },
};

/**
 * CADS Tag (Chip) — compact labeled badge with optional icon.
 * Spec source: CADS Figma Tag / Chip component set.
 */
export const Tag = forwardRef<HTMLDivElement, TagProps>(function Tag(
  { tone = "neutral", size = "medium", iconName, label, sx, ...rest },
  ref,
) {
  const t = TONE_STYLES[tone];
  return (
    <Chip
      ref={ref}
      label={label}
      size={size === "small" ? "small" : "medium"}
      icon={
        iconName ? <FaIcon name={iconName} size="extraSmall" /> : undefined
      }
      sx={{
        height: size === "small" ? "1.25rem" : "1.5rem",
        borderRadius: "var(--radius-round)",
        backgroundColor: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-xs)",
        fontWeight: "var(--font-weight-medium)",
        "& .MuiChip-icon": { color: "inherit", marginLeft: "0.375rem" },
        ...((sx as object) ?? {}),
      }}
      {...rest}
    />
  );
});
