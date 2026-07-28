import ButtonBase from "@mui/material/ButtonBase";
import { forwardRef, type CSSProperties } from "react";
import { FaIcon } from "../../icons/FaIcon";
import styles from "./closeIconButton.module.scss";
import type {
  CloseIconButtonColor,
  CloseIconButtonProps,
  CloseIconButtonSize,
} from "./types";

export type {
  CloseIconButtonColor,
  CloseIconButtonProps,
  CloseIconButtonSize,
} from "./types";

const DIMENSIONS: Record<
  CloseIconButtonSize,
  { box: string; icon: string }
> = {
  large: { box: "1.5rem", icon: "1rem" },
  medium: { box: "1.125rem", icon: "0.875rem" },
  small: { box: "1.125rem", icon: "0.75rem" },
  extraSmall: { box: "0.8125rem", icon: "0.625rem" },
};

const COLORS: Record<
  CloseIconButtonColor,
  { default: string; hover: string }
> = {
  primary: {
    default: "var(--text-neutral-primary)",
    hover: "var(--text-neutral-quaternary)",
  },
  secondary: {
    default: "var(--text-neutral-quaternary)",
    hover: "var(--text-neutral-primary)",
  },
  brand: {
    default: "var(--text-brand-secondary)",
    hover: "var(--text-brand-primary)",
  },
  pink: {
    default: "var(--text-accent-pink-secondary)",
    hover: "var(--text-accent-pink-primary)",
  },
  orange: {
    default: "var(--text-accent-orange-secondary)",
    hover: "var(--text-accent-orange-primary)",
  },
  success: {
    default: "var(--text-success-secondary)",
    hover: "var(--text-success-primary)",
  },
  error: {
    default: "var(--text-error-secondary)",
    hover: "var(--text-error-primary)",
  },
  warning: {
    default: "var(--text-warning-secondary)",
    hover: "var(--text-warning-primary)",
  },
  info: {
    default: "var(--text-info-secondary)",
    hover: "var(--text-info-primary)",
  },
};

/**
 * Icon-only close action for dismissible surfaces.
 * Spec: Figma Close Icon Button `6368:7269`.
 */
export const CloseIconButton = forwardRef<
  HTMLButtonElement,
  CloseIconButtonProps
>(function CloseIconButton(
  {
    size = "large",
    color = "primary",
    sx,
    className,
    "aria-label": ariaLabel = "Close",
    type = "button",
    ...rest
  },
  ref,
) {
  const dims = DIMENSIONS[size];
  const chrome = COLORS[color];

  const chromeVars = {
    "--cib-box": dims.box,
    "--cib-icon": dims.icon,
    "--cib-color": chrome.default,
    "--cib-color-hover": chrome.hover,
  } as CSSProperties;

  return (
    <ButtonBase
      ref={ref}
      type={type}
      focusRipple={false}
      disableRipple
      aria-label={ariaLabel}
      data-cads-component="CloseIconButton"
      data-cads-press=""
      className={className ? `${styles.root} ${className}` : styles.root}
      style={chromeVars}
      sx={sx}
      {...rest}
    >
      <FaIcon name="xmark" family="solid" fontSize={dims.icon} aria-hidden />
    </ButtonBase>
  );
});
