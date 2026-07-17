import Box from "@mui/material/Box";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { FaIcon } from "../icons/FaIcon";
import {
  FOCUS_RING,
  LINK_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
  type LinkControlSize,
} from "../shared/controlSize";

/** Figma Link size scale — includes Link-only `extraExtraSmall`. */
export type LinkSize = ControlSize | "extraExtraSmall";
/** Figma Link `type` axis (not HTML link type). */
export type LinkType = "primary" | "secondary";

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> {
  /**
   * Typography / icon scale.
   * @default "medium"
   */
  size?: LinkSize;
  /**
   * Figma `type` axis: primary (brand) | secondary (neutral).
   * @default "primary"
   */
  type?: LinkType;
  /**
   * Show FA solid `up-right-from-square` end icon.
   * @default true
   */
  isExternal?: boolean;
  /** Disables navigation and applies disabled chrome. */
  disabled?: boolean;
  children?: ReactNode;
}

const EXTERNAL_ICON = "up-right-from-square" as const;

/**
 * CADS Link — inline text link with optional external-affordance icon.
 * Spec: Figma Link `3480:5546` / key `87b099a460c3dad155731d3983e7ccfecefc5975`.
 */
export const Link = forwardRef<HTMLAnchorElement | HTMLSpanElement, LinkProps>(
  function Link(
    {
      size = "medium",
      type = "primary",
      isExternal = true,
      disabled = false,
      children,
      href,
      onClick,
      className,
      ...rest
    },
    ref,
  ) {
    const dims = LINK_SIZE[size as LinkControlSize];
    const isPrimary = type === "primary";

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
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
        "& .cads-link-icon": { color: "var(--text-brand-secondary)" },
      },
      "&:active": {
        color: "var(--text-brand-secondary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-brand-secondary)" },
      },
      "&:visited": {
        color: "var(--text-brand-secondary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-brand-secondary)" },
      },
      "&:visited:hover": {
        color: "var(--text-brand-secondary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-brand-secondary)" },
      },
    };

    const secondaryColors = {
      color: "var(--text-neutral-primary)",
      "& .cads-link-icon": { color: "var(--text-neutral-primary)" },
      "&:hover": {
        color: "var(--text-neutral-tertiary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-neutral-secondary)" },
      },
      "&:active": {
        color: "var(--text-neutral-tertiary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-neutral-secondary)" },
      },
      "&:visited": {
        color: "var(--text-neutral-tertiary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-neutral-secondary)" },
      },
      "&:visited:hover": {
        color: "var(--text-neutral-tertiary)",
        textDecoration: "none",
        "& .cads-link-icon": { color: "var(--text-neutral-secondary)" },
      },
    };

    const content = (
      <>
        {children}
        {isExternal ? (
          <FaIcon
            className="cads-link-icon"
            name={EXTERNAL_ICON}
            family="solid"
            fontSize={dims.iconPx}
          />
        ) : null}
      </>
    );

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
        boxShadow: FOCUS_RING,
      },
      ...(disabled
        ? {
            color: "var(--text-disabled-neutral)",
            pointerEvents: "none",
            "& .cads-link-icon": { color: "var(--text-disabled-neutral)" },
          }
        : isPrimary
          ? primaryColors
          : secondaryColors),
    } as const;

    if (disabled) {
      const {
        target: _target,
        rel: _rel,
        download: _download,
        hrefLang: _hrefLang,
        referrerPolicy: _referrerPolicy,
        ...spanRest
      } = rest;
      return (
        <Box
          component="span"
          ref={ref}
          className={className}
          aria-disabled="true"
          sx={sharedSx}
          {...spanRest}
        >
          {content}
        </Box>
      );
    }

    return (
      <Box
        component="a"
        ref={ref}
        className={className}
        href={href}
        onClick={handleClick}
        sx={sharedSx}
        {...rest}
      >
        {content}
      </Box>
    );
  },
);
