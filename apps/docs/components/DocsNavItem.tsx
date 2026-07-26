"use client";

import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { Tooltip } from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";
import type { FaIconName } from "@codeai/cads-react/icons";
import s from "./DocsNavItem.module.scss";

/** Maps to Figma `resourceItem` type: topLevel | subItem (+ collapsible group). */
export type DocsNavItemKind = "primary" | "child" | "group";

type SharedProps = {
  label: string;
  iconName?: FaIconName | (string & {});
  active?: boolean;
  kind?: DocsNavItemKind;
  /** Icon-only rail (30×30). Hides label/chevron; tooltips the label. */
  collapsed?: boolean;
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
 * Spec: Figma sidebar `16847:56434`. Fill comes from DocsNavScroller’s
 * floating highlight (not per-row fades).
 */
export function DocsNavItem(props: DocsNavItemProps) {
  const {
    label,
    iconName,
    active = false,
    kind = "primary",
    collapsed = false,
  } = props;

  const isGroup = kind === "group";
  const isChild = kind === "child";

  const className = [
    "docs-nav-item",
    s.item,
    isChild ? s.itemChild : null,
    collapsed ? s.itemCollapsed : null,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className={s.itemMain}>
        {iconName ? (
          <FaIcon
            name={iconName}
            fontSize="12px"
            className={s.itemIcon}
          />
        ) : null}
        <span className={s.itemLabel}>{label}</span>
      </span>
      {isGroup && !collapsed ? (
        <FaIcon
          name={props.expanded ? "chevron-up" : "chevron-down"}
          fontSize="12px"
          className={s.itemChevron}
        />
      ) : null}
    </>
  );

  let node: ReactElement;

  if (props.href) {
    if (props.external) {
      node = (
        <a
          href={props.href}
          target="_blank"
          rel="noreferrer"
          className={className}
          data-active={active || undefined}
          aria-label={collapsed ? label : undefined}
        >
          {content}
        </a>
      );
    } else {
      node = (
        <Link
          href={props.href}
          className={className}
          data-active={active || undefined}
          aria-label={collapsed ? label : undefined}
        >
          {content}
        </Link>
      );
    }
  } else {
    node = (
      <button
        type="button"
        className={className}
        data-active={active || undefined}
        aria-expanded={collapsed ? undefined : props.expanded}
        aria-label={collapsed ? label : undefined}
        onClick={props.onClick}
      >
        {content}
      </button>
    );
  }

  if (!collapsed) return node;

  return (
    <Tooltip title={label} hasCaret={false} placement="right">
      {node}
    </Tooltip>
  );
}

export function DocsNavSection({
  label,
  sectionId,
  children,
  collapsed = false,
}: {
  label: string;
  /** Stable key for the nav section (Resources / Foundations / Components). */
  sectionId: string;
  children: ReactNode;
  collapsed?: boolean;
}) {
  return (
    <div
      className={`docs-nav-section ${s.section}`}
      data-nav-section={sectionId}
      data-collapsed={collapsed || undefined}
    >
      <div className={`docs-nav-section-label ${s.sectionLabel}`}>{label}</div>
      <div className={s.sectionItems}>{children}</div>
    </div>
  );
}

/**
 * Expand/collapse for component sub-item lists.
 * CSS grid 0fr→1fr keeps sticky/layout stable (no Motion height:auto).
 * Duration only applies when the docs motion experiment is on.
 */
export function DocsNavChildren({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={`docs-nav-children ${s.children}`}
      data-open={open || undefined}
      {...(!open ? { inert: true } : {})}
    >
      <div className={s.childrenInner}>{children}</div>
    </div>
  );
}
