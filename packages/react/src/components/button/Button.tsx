import MuiButton from "@mui/material/Button";
import { forwardRef, type CSSProperties } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { BUTTON_SIZE } from "../../shared/controlSize";
import styles from "./button.module.scss";
import type {
  ButtonColor,
  ButtonProps,
  ButtonVariant,
} from "./types";

export type {
  ButtonColor,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./types";

/** Resolved color after restricted-combo fallbacks (tertiary / orange). */
type ResolvedButtonColor =
  | Exclude<ButtonColor, "tertiary" | "orange">
  | "tertiary"
  | "orange";

type ColorRecipe = {
  filledBg: string;
  filledBgHover: string;
  filledBgPressed: string;
  filledFg: string;
  filledDisabledBg: string;
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
        filledBg: "var(--background-brand-primary)",
        filledBgHover: "var(--background-brand-strong)",
        filledBgPressed: "var(--background-brand-strong)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-brand)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-solid)",
        outlinedFg: "var(--text-neutral-primary)",
        outlinedHoverBg: "var(--background-neutral-tertiary)",
        outlinedPressedBg: "var(--background-neutral-tertiary)",
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
        filledBgPressed: "var(--background-error-strong)",
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
      return {
        filledBg: "var(--background-accent-orange-primary)",
        filledBgHover: "var(--background-accent-orange-strong)",
        filledBgPressed: "var(--background-accent-orange-strong)",
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
        outlinedPressedBg: "var(--background-neutral-quaternary)",
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
        filledBg: "var(--background-neutral-primary-inverse)",
        filledBgHover: "var(--background-neutral-octonary)",
        filledBgPressed: "var(--background-neutral-primary-inverse)",
        filledFg: "var(--text-neutral-primary-inverse)",
        filledDisabledBg: "var(--background-disabled-neutral)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-secondary)",
        outlinedFg: "var(--text-neutral-primary)",
        outlinedHoverBg: "var(--background-neutral-tertiary)",
        outlinedPressedBg: "var(--background-neutral-tertiary)",
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

function resolveVars(
  variant: ButtonVariant,
  color: ResolvedButtonColor,
  size: ButtonProps["size"] & string,
  iconOnly: boolean,
  fullWidth: boolean,
): CSSProperties {
  const c = colorRecipe(color);
  const dims = BUTTON_SIZE[size];

  let bg: string;
  let fg: string;
  let border: string;
  let bgHover: string;
  let bgPress: string;
  let fgPress: string | undefined;
  let disabledBg: string;
  let disabledFg: string;
  let disabledBorder = "transparent";

  if (variant === "contained") {
    bg = c.filledBg;
    fg = c.filledFg;
    border = "transparent";
    bgHover = c.filledBgHover;
    bgPress = c.filledBgPressed;
    disabledBg = c.filledDisabledBg;
    disabledFg = c.filledDisabledFg;
  } else if (variant === "outlined") {
    bg = "var(--background-neutral-primary)";
    fg = c.outlinedFg;
    border = c.outlinedBorder;
    bgHover = c.outlinedHoverBg;
    bgPress = c.outlinedPressedBg;
    disabledBg = "var(--background-neutral-primary)";
    disabledFg = c.outlinedDisabledFg;
    disabledBorder = c.outlinedDisabledBorder;
  } else {
    bg = "transparent";
    fg = c.textFg;
    border = "transparent";
    bgHover = c.textHoverBg;
    bgPress = c.textPressedBg;
    fgPress = c.textFgPressed;
    disabledBg = "transparent";
    disabledFg = c.textDisabledFg;
  }

  return {
    "--btn-height": dims.height,
    "--btn-px": iconOnly ? dims.iconOnlyPadding : dims.paddingInline,
    "--btn-py": iconOnly ? dims.iconOnlyPadding : dims.paddingBlock,
    "--btn-gap": iconOnly ? "0" : dims.gap,
    "--btn-font-size": dims.fontSize,
    "--btn-line-height": dims.lineHeight,
    // Module CSS uses `width: var(--btn-width, auto)`, which beats MUI's
    // fullWidth class — set the token so fullWidth actually stretches.
    "--btn-width": iconOnly ? dims.height : fullWidth ? "100%" : undefined,
    "--btn-bg": bg,
    "--btn-fg": fg,
    "--btn-border": border,
    "--btn-bg-hover": bgHover,
    "--btn-bg-press": bgPress,
    "--btn-fg-press": fgPress,
    "--btn-disabled-bg": disabledBg,
    "--btn-disabled-fg": disabledFg,
    "--btn-disabled-border": disabledBorder,
    "--btn-spinner-fg": fg,
  } as CSSProperties;
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
      fullWidth = false,
      children,
      sx,
      disabled,
      onClick,
      className,
      ...rest
    },
    ref,
  ) {
    const dims = BUTTON_SIZE[size];
    const iconOnly =
      iconOnlyProp ??
      (!children && Boolean(startIconName || endIconName));
    const resolvedColor = resolveColor(color, variant, iconOnly);
    const showLoading = Boolean(loading) && !disabled;

    const startIcon = startIconName ? (
      <FaIcon name={startIconName} fontSize={dims.iconPx} />
    ) : null;
    const endIcon = endIconName ? (
      <FaIcon name={endIconName} fontSize={dims.iconPx} />
    ) : null;

    const chromeVars = resolveVars(
      variant,
      resolvedColor,
      size,
      iconOnly,
      fullWidth,
    );
    const rootClass = [
      styles.root,
      showLoading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <MuiButton
        ref={ref}
        disableElevation
        disabled={disabled}
        fullWidth={fullWidth}
        aria-busy={showLoading || undefined}
        onClick={showLoading ? undefined : onClick}
        startIcon={!iconOnly && startIcon ? startIcon : undefined}
        endIcon={!iconOnly && endIcon ? endIcon : undefined}
        data-cads-component="Button"
        data-cads-press=""
        className={rootClass}
        style={chromeVars}
        sx={sx}
        {...rest}
      >
        {iconOnly ? startIcon || endIcon : children}
        {showLoading ? (
          <span aria-hidden className={styles.spinner}>
            <FaIcon
              name="spinner"
              fontSize={dims.iconPx}
              className={styles.spinnerIcon}
            />
          </span>
        ) : null}
      </MuiButton>
    );
  },
);
