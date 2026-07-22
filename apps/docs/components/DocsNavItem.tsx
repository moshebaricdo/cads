"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FaIcon } from "@codeai/cads-react/icons";
import type { FaIconName } from "@codeai/cads-react/icons";

/** Maps to Figma `resourceItem` type: topLevel | subItem (+ collapsible group). */
export type DocsNavItemKind = "primary" | "child" | "group";

type SharedProps = {
  label: string;
  iconName?: FaIconName | (string & {});
  active?: boolean;
  kind?: DocsNavItemKind;
};

type LinkProps = SharedProps & {
  href: string;
  onClick?: undefined;
  expanded?: undefined;
  external?: boolean;
};

type ButtonProps = SharedProps & {
  href?: undefined;
  onClick: () => void;
  expanded?: boolean;
  external?: undefined;
};

export type DocsNavItemProps = LinkProps | ButtonProps;

/**
 * Docs-only sidebar row — not a CADS library component.
 * Spec: Figma sidebar `16847:56434`. Hover fill is a snappy CSS fade.
 */
export function DocsNavItem(props: DocsNavItemProps) {
  const {
    label,
    iconName,
    active = false,
    kind = "primary",
  } = props;

  const isGroup = kind === "group";
  const isChild = kind === "child";

  const className = [
    "docs-nav-item",
    isChild ? "docs-nav-item--child" : null,
    isGroup ? "docs-nav-item--group" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="docs-nav-item-main">
        {iconName ? (
          <FaIcon
            name={iconName}
            fontSize="12px"
            className="docs-nav-item-icon"
          />
        ) : null}
        <span className="docs-nav-item-label">{label}</span>
      </span>
      {isGroup ? (
        <FaIcon
          name={props.expanded ? "chevron-up" : "chevron-down"}
          fontSize="12px"
          className="docs-nav-item-chevron"
        />
      ) : null}
    </>
  );

  if (props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noreferrer"
          className={className}
          data-active={active || undefined}
        >
          {content}
        </a>
      );
    }
    return (
      <Link
        href={props.href}
        className={className}
        data-active={active || undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      data-active={active || undefined}
      aria-expanded={props.expanded}
      onClick={props.onClick}
    >
      {content}
    </button>
  );
}

export function DocsNavSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="docs-nav-section">
      <div className="docs-nav-section-label">{label}</div>
      <div className="docs-nav-section-items">{children}</div>
    </div>
  );
}
