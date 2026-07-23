import { jsx } from 'react/jsx-runtime';
import ButtonBase from '@mui/material/ButtonBase';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

const CloseIconButton = forwardRef(function CloseIconButton2({
  size = "large",
  color = "primary",
  sx,
  "aria-label": ariaLabel = "Close",
  type = "button",
  ...rest
}, ref) {
  const dimensions = {
    large: { box: "1.5rem", icon: "1rem" },
    medium: { box: "1.125rem", icon: "0.875rem" },
    small: { box: "1.125rem", icon: "0.75rem" },
    extraSmall: { box: "0.8125rem", icon: "0.625rem" }
  };
  const colors = {
    primary: {
      default: "var(--text-neutral-primary)",
      hover: "var(--text-neutral-quaternary)"
    },
    secondary: {
      default: "var(--text-neutral-quaternary)",
      hover: "var(--text-neutral-primary)"
    },
    brand: {
      default: "var(--text-brand-secondary)",
      hover: "var(--text-brand-primary)"
    },
    pink: {
      default: "var(--text-accent-pink-secondary)",
      hover: "var(--text-accent-pink-primary)"
    },
    orange: {
      default: "var(--text-accent-orange-secondary)",
      hover: "var(--text-accent-orange-primary)"
    },
    success: {
      default: "var(--text-success-secondary)",
      hover: "var(--text-success-primary)"
    },
    error: {
      default: "var(--text-error-secondary)",
      hover: "var(--text-error-primary)"
    },
    warning: {
      default: "var(--text-warning-secondary)",
      hover: "var(--text-warning-primary)"
    },
    info: {
      default: "var(--text-info-secondary)",
      hover: "var(--text-info-primary)"
    }
  };
  const dims = dimensions[size];
  const chrome = colors[color];
  return /* @__PURE__ */ jsx(
    ButtonBase,
    {
      ref,
      type,
      focusRipple: false,
      disableRipple: true,
      "aria-label": ariaLabel,
      "data-cads-component": "CloseIconButton",
      sx: {
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
          backgroundColor: "transparent"
        },
        '&:active, [data-cads-force-pseudo="press"] &': {
          color: chrome.default
        },
        "&.Mui-focusVisible": {
          boxShadow: FOCUS_RING
        },
        "&.Mui-disabled": {
          color: "var(--text-disabled-neutral)",
          opacity: 1
        },
        '[data-cads-force-pseudo="hover"] &': {
          color: chrome.hover
        },
        ...sx ?? {}
      },
      ...rest,
      children: /* @__PURE__ */ jsx(FaIcon, { name: "xmark", family: "solid", fontSize: dims.icon, "aria-hidden": true })
    }
  );
});

export { CloseIconButton };
//# sourceMappingURL=CloseIconButton.js.map
//# sourceMappingURL=CloseIconButton.js.map