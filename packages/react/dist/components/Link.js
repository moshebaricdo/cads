import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { LINK_SIZE, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

const EXTERNAL_ICON = "up-right-from-square";
const Link = forwardRef(
  function Link2({
    size = "medium",
    type = "primary",
    isExternal = true,
    disabled = false,
    children,
    href,
    onClick,
    className,
    ...rest
  }, ref) {
    const dims = LINK_SIZE[size];
    const isPrimary = type === "primary";
    const handleClick = (event) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };
    const primaryColors = {
      color: "var(--text-brand-primary)",
      "& .cads-link-icon": { color: "var(--text-brand-primary)" },
      "&:hover": {
        color: "var(--text-brand-secondary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-brand-secondary)" }
      },
      "&:active": {
        color: "var(--text-brand-secondary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-brand-secondary)" }
      },
      "&:visited": {
        color: "var(--text-brand-secondary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-brand-secondary)" }
      },
      "&:visited:hover": {
        color: "var(--text-brand-secondary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-brand-secondary)" }
      }
    };
    const secondaryColors = {
      color: "var(--text-neutral-primary)",
      "& .cads-link-icon": { color: "var(--text-neutral-primary)" },
      "&:hover": {
        color: "var(--text-neutral-tertiary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-neutral-secondary)" }
      },
      "&:active": {
        color: "var(--text-neutral-tertiary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-neutral-secondary)" }
      },
      "&:visited": {
        color: "var(--text-neutral-tertiary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-neutral-secondary)" }
      },
      "&:visited:hover": {
        color: "var(--text-neutral-tertiary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-neutral-secondary)" }
      }
    };
    const content = /* @__PURE__ */ jsxs(Fragment, { children: [
      children,
      isExternal ? /* @__PURE__ */ jsx(
        FaIcon,
        {
          className: "cads-link-icon",
          name: EXTERNAL_ICON,
          family: "solid",
          fontSize: dims.iconPx
        }
      ) : null
    ] });
    const sharedSx = {
      display: "inline-flex",
      alignItems: "center",
      gap: dims.gap,
      margin: 0,
      padding: 0,
      border: "none",
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-body)",
      fontWeight: "var(--font-weight-semibold)",
      fontSize: dims.fontSize,
      lineHeight: dims.lineHeight,
      textDecoration: "none",
      cursor: disabled ? "default" : "pointer",
      transition: TRANSITION_COLORS,
      outline: "none",
      boxSizing: "border-box",
      verticalAlign: "baseline",
      "&:focus-visible, &.Mui-focusVisible": {
        boxShadow: FOCUS_RING
      },
      ...disabled ? {
        color: "var(--text-disabled-neutral)",
        pointerEvents: "none",
        "& .cads-link-icon": { color: "var(--text-disabled-neutral)" }
      } : isPrimary ? primaryColors : secondaryColors
    };
    if (disabled) {
      const {
        target: _target,
        rel: _rel,
        download: _download,
        hrefLang: _hrefLang,
        referrerPolicy: _referrerPolicy,
        ...spanRest
      } = rest;
      return /* @__PURE__ */ jsx(
        Box,
        {
          component: "span",
          ref,
          className,
          "aria-disabled": "true",
          sx: sharedSx,
          ...spanRest,
          children: content
        }
      );
    }
    return /* @__PURE__ */ jsx(
      Box,
      {
        component: "a",
        ref,
        className,
        href,
        onClick: handleClick,
        sx: sharedSx,
        ...rest,
        children: content
      }
    );
  }
);

export { Link };
//# sourceMappingURL=Link.js.map
//# sourceMappingURL=Link.js.map