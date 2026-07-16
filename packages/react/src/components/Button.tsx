import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { forwardRef, type ReactNode } from "react";
import { FaIcon, type FaIconSize } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";

/** CADS button visual variants (Figma component set). */
export type ButtonVariant = "primary" | "secondary" | "tertiary";
/** Brand / chrome tones. */
export type ButtonTone = "brand" | "neutral" | "white" | "destructive";
/** Shared control height scale L–XS. */
export type ButtonSize = "l" | "m" | "s" | "xs";

export interface ButtonProps
  extends Omit<MuiButtonProps, "variant" | "color" | "size"> {
  /**
   * Visual style.
   * @default "secondary"
   */
  variant?: ButtonVariant;
  /**
   * Color tone.
   * @default "neutral"
   */
  tone?: ButtonTone;
  /**
   * Control height: L 48 / M 40 / S 32 / XS 24.
   * @default "m"
   */
  size?: ButtonSize;
  /** Font Awesome Pro icon name (solid). */
  iconName?: FaIconName;
  iconPosition?: "start" | "end";
  fullWidth?: boolean;
  children?: ReactNode;
}

const SIZE_MAP: Record<ButtonSize, "large" | "medium" | "small"> = {
  l: "large",
  m: "medium",
  s: "small",
  xs: "small",
};

const ICON_SIZE: Record<ButtonSize, FaIconSize> = {
  l: "l",
  m: "m",
  s: "s",
  xs: "xs",
};

const HEIGHT: Record<ButtonSize, string> = {
  l: "var(--control-height-l)",
  m: "var(--control-height-m)",
  s: "var(--control-height-s)",
  xs: "var(--control-height-xs)",
};

function toneStyles(variant: ButtonVariant, tone: ButtonTone) {
  const brand = {
    bg: "var(--ds-background-brand-primary)",
    bgHover: "var(--ds-background-brand-strong)",
    text: "var(--ds-text-neutral-white-fixed)",
    border: "var(--ds-border-brand-primary)",
  };
  const neutral = {
    bg: "var(--ds-background-neutral-secondary)",
    bgHover: "var(--ds-background-neutral-tertiary)",
    text: "var(--ds-text-neutral-primary)",
    border: "var(--ds-border-neutral-primary)",
  };
  const white = {
    bg: "var(--ds-background-neutral-white-fixed)",
    bgHover: "var(--ds-background-neutral-secondary)",
    text: "var(--ds-text-neutral-primary)",
    border: "var(--ds-border-neutral-primary)",
  };
  const destructive = {
    bg: "var(--ds-background-error-primary)",
    bgHover: "var(--ds-background-error-strong)",
    text: "var(--ds-text-neutral-white-fixed)",
    border: "var(--ds-border-error-primary)",
  };

  const palette =
    tone === "brand"
      ? brand
      : tone === "white"
        ? white
        : tone === "destructive"
          ? destructive
          : neutral;

  if (variant === "primary") {
    return {
      backgroundColor: palette.bg,
      color: palette.text,
      border: "1px solid transparent",
      "&:hover": { backgroundColor: palette.bgHover },
    };
  }
  if (variant === "secondary") {
    return {
      backgroundColor: "transparent",
      color:
        tone === "brand"
          ? "var(--ds-text-brand-primary)"
          : tone === "destructive"
            ? "var(--ds-text-error-primary)"
            : "var(--ds-text-neutral-primary)",
      border: `1px solid ${palette.border}`,
      "&:hover": { backgroundColor: "var(--ds-background-neutral-secondary)" },
    };
  }
  return {
    backgroundColor: "transparent",
    color:
      tone === "brand"
        ? "var(--ds-text-brand-primary)"
        : tone === "destructive"
          ? "var(--ds-text-error-primary)"
          : "var(--ds-text-neutral-primary)",
    border: "1px solid transparent",
    "&:hover": { backgroundColor: "var(--ds-background-neutral-secondary)" },
  };
}

/**
 * CADS Button — MUI Button wrapped with CADS variants, tones, and size scale.
 * Spec source: CADS Figma Button component set.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "secondary",
      tone = "neutral",
      size = "m",
      iconName,
      iconPosition = "start",
      children,
      sx,
      disabled,
      ...rest
    },
    ref,
  ) {
    const icon = iconName ? (
      <FaIcon name={iconName} size={ICON_SIZE[size]} />
    ) : null;

    return (
      <MuiButton
        ref={ref}
        disableElevation
        disabled={disabled}
        size={SIZE_MAP[size]}
        startIcon={icon && iconPosition === "start" ? icon : undefined}
        endIcon={icon && iconPosition === "end" ? icon : undefined}
        sx={{
          minWidth: children ? undefined : HEIGHT[size],
          height: HEIGHT[size],
          paddingInline: size === "xs" ? "8px" : size === "s" ? "12px" : "16px",
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-body)",
          fontWeight: "var(--font-weight-semibold)",
          fontSize:
            size === "xs" || size === "s"
              ? "var(--text-body-xs)"
              : "var(--text-body-sm)",
          textTransform: "none",
          boxShadow: "none",
          "&.Mui-focusVisible": {
            outline: "2px solid var(--ds-border-focused-primary)",
            outlineOffset: "2px",
          },
          "&.Mui-disabled": {
            opacity: 0.5,
          },
          ...toneStyles(variant, tone),
          ...((sx as object) ?? {}),
        }}
        {...rest}
      >
        {children}
      </MuiButton>
    );
  },
);
