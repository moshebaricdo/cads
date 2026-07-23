import ButtonBase, {
  type ButtonBaseProps,
} from "@mui/material/ButtonBase";
import { forwardRef } from "react";
import { FaIcon } from "../icons/FaIcon";
import { FOCUS_RING, TRANSITION_COLORS } from "../shared/controlSize";

export type CloseIconButtonSize =
  | "large"
  | "medium"
  | "small"
  | "extraSmall";
export type CloseIconButtonColor =
  | "primary"
  | "secondary"
  | "brand"
  | "pink"
  | "orange"
  | "success"
  | "error"
  | "warning"
  | "info";

export interface CloseIconButtonProps
  extends Omit<ButtonBaseProps, "children" | "color"> {
  /** @default "large" */
  size?: CloseIconButtonSize;
  /** @default "primary" */
  color?: CloseIconButtonColor;
}

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
    "aria-label": ariaLabel = "Close",
    type = "button",
    ...rest
  },
  ref,
) {
  const dimensions: Record<
    CloseIconButtonSize,
    { box: string; icon: string }
  > = {
    large: { box: "1.5rem", icon: "1rem" },
    medium: { box: "1.125rem", icon: "0.875rem" },
    small: { box: "1.125rem", icon: "0.75rem" },
    extraSmall: { box: "0.8125rem", icon: "0.625rem" },
  };
  const colors: Record<
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
  const dims = dimensions[size];
  const chrome = colors[color];

  return (
    <ButtonBase
      ref={ref}
      type={type}
      focusRipple={false}
      disableRipple
      aria-label={ariaLabel}
      data-cads-component="CloseIconButton"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: dims.box,
        height: dims.box,
        minWidth: 0,
        padding: 0,
        overflow: "visible",
        borderRadius: "0.25rem",
        color: chrome.default,
        backgroundColor: "transparent",
        transition: TRANSITION_COLORS,
        "&:hover": {
          color: chrome.hover,
          backgroundColor: "transparent",
        },
        '&:active, [data-cads-force-pseudo="press"] &': {
          color: chrome.default,
        },
        "&.Mui-focusVisible": {
          boxShadow: FOCUS_RING,
        },
        "&.Mui-disabled": {
          color: "var(--text-disabled-neutral)",
          opacity: 1,
        },
        '[data-cads-force-pseudo="hover"] &': {
          color: chrome.hover,
        },
        ...((sx as object) ?? {}),
      }}
      {...rest}
    >
      <FaIcon name="xmark" family="solid" fontSize={dims.icon} aria-hidden />
    </ButtonBase>
  );
});
