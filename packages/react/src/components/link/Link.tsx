import {
  forwardRef,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import { LINK_SIZE, type LinkControlSize } from "../../shared/controlSize";
import styles from "./link.module.scss";
import type { LinkProps } from "./types";

export type { LinkProps, LinkSize, LinkType } from "./types";

const EXTERNAL_ICON = "up-right-from-square" as const;

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

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
      "--link-color": "var(--text-brand-primary)",
      "--link-icon-color": "var(--text-brand-primary)",
      "--link-color-hover": "var(--text-brand-secondary)",
      "--link-icon-color-hover": "var(--text-brand-secondary)",
    };

    const secondaryColors = {
      "--link-color": "var(--text-neutral-primary)",
      "--link-icon-color": "var(--text-neutral-primary)",
      "--link-color-hover": "var(--text-neutral-tertiary)",
      "--link-icon-color-hover": "var(--text-neutral-secondary)",
    };

    const chromeVars = {
      "--link-gap": dims.gap,
      "--link-font-size": dims.fontSize,
      "--link-line-height": dims.lineHeight,
      ...(disabled ? {} : isPrimary ? primaryColors : secondaryColors),
    } as CSSProperties;

    const rootClass = cx(
      styles.root,
      disabled && styles.disabled,
      className,
    );

    const content = (
      <>
        {children}
        {isExternal ? (
          <FaIcon
            className={styles.icon}
            name={EXTERNAL_ICON}
            family="solid"
            fontSize={dims.iconPx}
          />
        ) : null}
      </>
    );

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
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          className={rootClass}
          style={chromeVars}
          aria-disabled="true"
          data-cads-press=""
          {...spanRest}
        >
          {content}
        </span>
      );
    }

    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={rootClass}
        style={chromeVars}
        href={href}
        onClick={handleClick}
        data-cads-press=""
        {...rest}
      >
        {content}
      </a>
    );
  },
);
