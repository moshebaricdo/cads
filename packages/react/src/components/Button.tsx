import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  BUTTON_SIZE,
  FOCUS_RING,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

/** Figma Button `variant` — contained / outlined / text. */
export type ButtonVariant = "contained" | "outlined" | "text";
/** Figma Button `color`. */
export type ButtonColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "orange"
  | "error";
/** Figma size scale. */
export type ButtonSize = ControlSize;

/** Resolved color after restricted-combo fallbacks (tertiary / orange). */
type ResolvedButtonColor =
  | Exclude<ButtonColor, "tertiary" | "orange">
  | "tertiary"
  | "orange";

export interface ButtonProps
  extends Omit<
    MuiButtonProps,
    | "variant"
    | "color"
    | "size"
    | "startIcon"
    | "endIcon"
    | "loading"
    | "loadingIndicator"
    | "loadingPosition"
  > {
  /**
   * Visual style (Figma: contained | outlined | text).
   * @default "contained"
   */
  variant?: ButtonVariant;
  /**
   * Color intent (Figma: primary | secondary | tertiary | orange | error).
   * Tertiary is only valid for `variant="text"` + icon-only; other combos
   * fall back to secondary with a development warning.
   * Orange is only valid for `variant="contained"` (run button); other
   * variants fall back to primary with a development warning.
   * @default "primary"
   */
  color?: ButtonColor;
  /**
   * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
   * @default "medium"
   */
  size?: ButtonSize;
  /** Force icon-only square geometry (also inferred when no children). */
  iconOnly?: boolean;
  /**
   * Font Awesome Pro icon at the start (kebab-case).
   * Figma shortcode `smile` is accepted (alias of `face-smile`).
   */
  startIconName?: FaIconName | (string & {});
  /**
   * Font Awesome Pro icon at the end (kebab-case).
   * Figma shortcode `smile` is accepted (alias of `face-smile`).
   */
  endIconName?: FaIconName | (string & {});
  /**
   * Replaces visible content with a centered FA spinner while preserving
   * the button's width (label/icons stay in layout, visually hidden).
   * Does not apply disabled styling; blocks interaction via pointer-events.
   */
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

/** Recipes for primary | secondary | error | orange contained | tertiary text+iconOnly. */
type ColorRecipe = {
  filledBg: string;
  filledBgHover: string;
  filledBgPressed: string;
  filledFg: string;
  filledDisabledBg: string;
  /** Contained disabled label sits on a solid fill → inverse text. */
  filledDisabledFg: string;
  outlinedBorder: string;
  outlinedFg: string;
  outlinedHoverBg: string;
  outlinedPressedBg: string;
  outlinedDisabledBorder: string;
  outlinedDisabledFg: string;
  textFg: string;
  textFgPressed: string;
  textHoverBg: string;
  textPressedBg: string;
  textDisabledFg: string;
};

/**
 * Figma: tertiary gray styling exists only for text + iconOnly.
 * Contained/outlined (and labeled text) fall back to secondary.
 * Orange (run) styling exists only for contained; other variants fall back to primary.
 */
function resolveColor(
  color: ButtonColor,
  variant: ButtonVariant,
  iconOnly: boolean,
): ResolvedButtonColor {
  if (color === "tertiary") {
    if (variant === "text" && iconOnly) return "tertiary";

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[CADS Button] color="tertiary" is only defined in Figma for variant="text" + icon-only. ` +
          `Falling back to color="secondary" for variant="${variant}"${iconOnly ? "" : " (labeled)"}.`,
      );
    }
    return "secondary";
  }

  if (color === "orange") {
    if (variant === "contained") return "orange";

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[CADS Button] color="orange" is only defined in Figma for variant="contained" (run button). ` +
          `Falling back to color="primary" for variant="${variant}".`,
      );
    }
    return "primary";
  }

  return color;
}

function colorRecipe(color: ResolvedButtonColor): ColorRecipe {
  switch (color) {
    case "primary":
      return {
        // Contained primary → brand fill
        filledBg: "var(--background-brand-primary)",
        filledBgHover: "var(--background-brand-strong)",
        filledBgPressed: "var(--background-brand-primary)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-brand)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        // Outlined primary → solid border
        outlinedBorder: "var(--border-neutral-solid)",
        outlinedFg: "var(--text-neutral-primary)",
        outlinedHoverBg: "var(--background-neutral-tertiary)",
        outlinedPressedBg: "var(--background-neutral-primary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-brand-primary)",
        textFgPressed: "var(--text-brand-secondary)",
        textHoverBg: "var(--background-brand-light)",
        textPressedBg: "var(--background-brand-light)",
        textDisabledFg: "var(--text-disabled-brand)",
      };
    case "error":
      return {
        filledBg: "var(--background-error-primary)",
        filledBgHover: "var(--background-error-strong)",
        filledBgPressed: "var(--background-error-primary)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-error)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-error-primary)",
        outlinedFg: "var(--text-error-primary)",
        outlinedHoverBg: "var(--background-error-light)",
        outlinedPressedBg: "var(--background-error-light)",
        outlinedDisabledBorder: "var(--border-disabled-error)",
        outlinedDisabledFg: "var(--text-disabled-error)",
        textFg: "var(--text-error-primary)",
        textFgPressed: "var(--text-error-secondary)",
        textHoverBg: "var(--background-error-light)",
        textPressedBg: "var(--background-error-light)",
        textDisabledFg: "var(--text-disabled-error)",
      };
    case "orange":
      // Only reached for contained (run button). Outlined/text fields unused.
      return {
        filledBg: "var(--background-accent-orange-primary)",
        filledBgHover: "var(--background-accent-orange-strong)",
        filledBgPressed: "var(--background-accent-orange-primary)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-orange)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-accent-orange-primary)",
        outlinedFg: "var(--text-accent-orange-primary)",
        outlinedHoverBg: "var(--background-accent-orange-light)",
        outlinedPressedBg: "var(--background-accent-orange-light)",
        outlinedDisabledBorder: "var(--border-disabled-orange)",
        outlinedDisabledFg: "var(--text-disabled-orange)",
        textFg: "var(--text-accent-orange-primary)",
        textFgPressed: "var(--text-accent-orange-secondary)",
        textHoverBg: "var(--background-accent-orange-light)",
        textPressedBg: "var(--background-accent-orange-light)",
        textDisabledFg: "var(--text-disabled-orange)",
      };
    case "tertiary":
      // Only reached for text + iconOnly (gray / quaternary styling).
      return {
        filledBg: "var(--background-neutral-secondary)",
        filledBgHover: "var(--background-neutral-tertiary)",
        filledBgPressed: "var(--background-neutral-secondary)",
        filledFg: "var(--text-neutral-primary)",
        filledDisabledBg: "var(--background-disabled-neutral)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-secondary)",
        outlinedFg: "var(--text-neutral-quaternary)",
        outlinedHoverBg: "var(--background-neutral-quaternary)",
        outlinedPressedBg: "var(--background-neutral-primary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-neutral-quaternary)",
        textFgPressed: "var(--text-neutral-quaternary)",
        textHoverBg: "var(--background-neutral-quaternary)",
        textPressedBg: "var(--background-neutral-quaternary)",
        textDisabledFg: "var(--text-disabled-neutral)",
      };
    case "secondary":
    default:
      return {
        // Contained secondary → primary-inverse fill
        filledBg: "var(--background-neutral-primary-inverse)",
        filledBgHover: "var(--background-neutral-octonary)",
        filledBgPressed: "var(--background-neutral-primary-inverse)",
        filledFg: "var(--text-neutral-primary-inverse)",
        filledDisabledBg: "var(--background-disabled-neutral)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-secondary)",
        outlinedFg: "var(--text-neutral-primary)",
        outlinedHoverBg: "var(--background-neutral-tertiary)",
        outlinedPressedBg: "var(--background-neutral-primary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-neutral-primary)",
        textFgPressed: "var(--text-neutral-tertiary)",
        textHoverBg: "var(--background-neutral-quaternary)",
        textPressedBg: "var(--background-neutral-quaternary)",
        textDisabledFg: "var(--text-disabled-neutral)",
      };
  }
}

function contentForeground(
  variant: ButtonVariant,
  color: ResolvedButtonColor,
): string {
  const c = colorRecipe(color);
  if (variant === "contained") return c.filledFg;
  if (variant === "outlined") return c.outlinedFg;
  return c.textFg;
}

function variantStyles(
  variant: ButtonVariant,
  color: ResolvedButtonColor,
) {
  const c = colorRecipe(color);

  if (variant === "contained") {
    return {
      backgroundColor: c.filledBg,
      color: c.filledFg,
      border: "1px solid transparent",
      "&:hover": { backgroundColor: c.filledBgHover },
      "&:active": { backgroundColor: c.filledBgPressed },
      "&.Mui-disabled": {
        backgroundColor: c.filledDisabledBg,
        color: c.filledDisabledFg,
        opacity: 1,
        // Icons must inherit inverse disabled text on solid fills.
        "& .MuiButton-startIcon, & .MuiButton-endIcon, & [data-fa-icon]": {
          color: c.filledDisabledFg,
        },
      },
    };
  }

  if (variant === "outlined") {
    return {
      backgroundColor: "var(--background-neutral-primary)",
      color: c.outlinedFg,
      border: `1px solid ${c.outlinedBorder}`,
      "&:hover": { backgroundColor: c.outlinedHoverBg },
      "&:active": {
        backgroundColor: c.outlinedPressedBg,
        color: c.outlinedFg,
      },
      "&.Mui-disabled": {
        backgroundColor: "var(--background-neutral-primary)",
        color: c.outlinedDisabledFg,
        borderColor: c.outlinedDisabledBorder,
        opacity: 1,
      },
    };
  }

  return {
    backgroundColor: "transparent",
    color: c.textFg,
    border: "1px solid transparent",
    "&:hover": { backgroundColor: c.textHoverBg },
    "&:active": {
      backgroundColor: c.textPressedBg,
      color: c.textFgPressed,
    },
    "&.Mui-disabled": {
      color: c.textDisabledFg,
      opacity: 1,
    },
  };
}

/**
 * CADS Button — MUI Button wrapped with Figma-parity variants, colors, and sizes.
 * Spec: CADS Figma Button `15724:18791` / key `2507b18076b4066c6ff738539115b36a798fd707`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "contained",
      color = "primary",
      size = "medium",
      iconOnly: iconOnlyProp,
      startIconName,
      endIconName,
      loading = false,
      children,
      sx,
      disabled,
      onClick,
      ...rest
    },
    ref,
  ) {
    const dims = BUTTON_SIZE[size];
    const iconOnly =
      iconOnlyProp ??
      (!children && Boolean(startIconName || endIconName));
    const resolvedColor = resolveColor(color, variant, iconOnly);
    const spinnerColor = contentForeground(variant, resolvedColor);
    const showLoading = Boolean(loading) && !disabled;

    const startIcon = startIconName ? (
      <FaIcon name={startIconName} fontSize={dims.iconPx} />
    ) : null;
    const endIcon = endIconName ? (
      <FaIcon name={endIconName} fontSize={dims.iconPx} />
    ) : null;

    return (
      <MuiButton
        ref={ref}
        disableElevation
        disabled={disabled}
        aria-busy={showLoading || undefined}
        onClick={showLoading ? undefined : onClick}
        startIcon={!iconOnly && startIcon ? startIcon : undefined}
        endIcon={!iconOnly && endIcon ? endIcon : undefined}
        sx={{
          "@keyframes cads-button-spin": {
            "100%": { transform: "rotate(360deg)" },
          },
          position: "relative",
          minWidth: dims.height,
          width: iconOnly ? dims.height : undefined,
          height: dims.height,
          paddingInline: iconOnly ? dims.iconOnlyPadding : dims.paddingInline,
          paddingBlock: iconOnly ? dims.iconOnlyPadding : dims.paddingBlock,
          gap: iconOnly ? 0 : dims.gap,
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-body)",
          fontWeight: "var(--font-weight-semibold)",
          fontSize: dims.fontSize,
          lineHeight: dims.lineHeight,
          textTransform: "none",
          boxShadow: "none",
          boxSizing: "border-box",
          transition: TRANSITION_COLORS,
          "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            margin: 0,
          },
          "&.Mui-focusVisible": {
            boxShadow: FOCUS_RING,
          },
          ...variantStyles(variant, resolvedColor),
          // Keep label/icons in layout for width; hide them and overlay spinner.
          ...(showLoading
            ? {
                color: "transparent",
                pointerEvents: "none",
                "&:hover, &:active": {
                  color: "transparent",
                },
                // Hide adornment/icon-only glyphs; spinner uses its own color.
                "& .MuiButton-startIcon, & .MuiButton-endIcon, & > [data-fa-icon]":
                  {
                    color: "transparent",
                  },
              }
            : null),
          ...((sx as object) ?? {}),
        }}
        {...rest}
      >
        {iconOnly ? startIcon || endIcon : children}
        {showLoading ? (
          <span
            aria-hidden
            data-cads-button-spinner=""
            style={{
              position: "absolute",
              inset: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: spinnerColor,
            }}
          >
            <FaIcon
              name="spinner"
              fontSize={dims.iconPx}
              style={{
                animation: "cads-button-spin 0.75s linear infinite",
              }}
            />
          </span>
        ) : null}
      </MuiButton>
    );
  },
);
