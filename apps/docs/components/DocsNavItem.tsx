"use client";

import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { Tag, Tooltip, useExperimentalMotion } from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";
import type { FaIconName } from "@codeai/cads-react/icons";

/** Maps to Figma `resourceItem` type: topLevel | subItem (+ collapsible group). */
export type DocsNavItemKind = "primary" | "child" | "group";

type SharedProps = {
  label: string;
  iconName?: FaIconName | (string & {});
  /** Shows a small Experimental Tag after the label. */
  experimental?: boolean;
  /** Shows a small Not-in-production Tag after the label. */
  notInProduction?: boolean;
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
 * floating spring highlight (not per-row fades).
 */
export function DocsNavItem(props: DocsNavItemProps) {
  const {
    label,
    iconName,
    experimental = false,
    notInProduction = false,
    active = false,
    kind = "primary",
    collapsed = false,
  } = props;

  const experimentalMotion = useExperimentalMotion();
  const isGroup = kind === "group";
  const isChild = kind === "child";
  const experimentalStateLabel = experimentalMotion ? "On" : "Off";
  const tooltipLabel = experimental
    ? `${label} (Experimental) (${experimentalStateLabel})`
    : notInProduction
      ? `${label} (Not in production)`
      : label;

  const className = [
    "docs-nav-item",
    isChild ? "docs-nav-item--child" : null,
    isGroup ? "docs-nav-item--group" : null,
    collapsed ? "docs-nav-item--collapsed" : null,
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
      {experimental && !collapsed ? (
        <Tooltip
          title={`Experiment (${experimentalStateLabel})`}
          hasCaret={false}
          placement="top"
        >
          {/* Tag takes a fixed prop set, so the tooltip needs a host element. */}
          <span className="docs-nav-item-tag" tabIndex={0}>
            <Tag
              size="small"
              color={experimentalMotion ? "success" : "neutral"}
              startIconName="flask"
              label={<span className="docs-sr-only">Experiment</span>}
            />
          </span>
        </Tooltip>
      ) : null}
      {notInProduction && !collapsed ? (
        <Tooltip
          title="Not in production"
          iconName={"circle-exclamation"}
          hasCaret={false}
          placement="top"
        >
          <span className="docs-nav-item-tag" tabIndex={0}>
            <Tag
              size="small"
              color="warning"
              startIconName="screwdriver-wrench"
              label={<span className="docs-sr-only">Not in production</span>}
            />
          </span>
        </Tooltip>
      ) : null}
      {isGroup && !collapsed ? (
        <FaIcon
          name={props.expanded ? "chevron-up" : "chevron-down"}
          fontSize="12px"
          className="docs-nav-item-chevron"
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
          aria-label={collapsed ? tooltipLabel : undefined}
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
          aria-label={collapsed ? tooltipLabel : undefined}
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
        aria-label={collapsed ? tooltipLabel : undefined}
        onClick={props.onClick}
      >
        {content}
      </button>
    );
  }

  if (!collapsed) return node;

  return (
    <Tooltip title={tooltipLabel} hasCaret={false} placement="right">
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
  /** Stable key for hover-chase section boundaries. */
  sectionId: string;
  children: ReactNode;
  collapsed?: boolean;
}) {
  return (
    <div
      className="docs-nav-section"
      data-nav-section={sectionId}
      data-collapsed={collapsed || undefined}
    >
      <div className="docs-nav-section-label">{label}</div>
      <div className="docs-nav-section-items">{children}</div>
    </div>
  );
}

/**
 * Animated expand/collapse for component sub-item lists.
 * CSS grid 0fr→1fr keeps sticky/layout stable (no Motion height:auto).
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
      className="docs-nav-children"
      data-open={open || undefined}
      {...(!open ? { inert: true } : {})}
    >
      <div className="docs-nav-children-inner">{children}</div>
    </div>
  );
}
