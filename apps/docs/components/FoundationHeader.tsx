"use client";

import type { ReactNode } from "react";
import { Link, Tag, Tooltip } from "@codeai/cads-react";
import type { FaIconName } from "@codeai/cads-react/icons";
import overviewStyles from "./ComponentOverview.module.scss";

export type FoundationHeaderLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type FoundationStatus = "experimental";

const STATUS_PRESENTATION: Record<
  FoundationStatus,
  { label: string; color: "info"; tooltip: string; iconName: FaIconName }
> = {
  experimental: {
    label: "Experimental",
    color: "info",
    iconName: "flask",
    tooltip:
      "Safe to explore in prototypes, but the API and visuals can still change without notice.",
  },
};

export function FoundationHeader({
  title,
  lead,
  links,
  action,
  status,
}: {
  title: string;
  lead: ReactNode;
  links?: FoundationHeaderLink[];
  action?: ReactNode;
  /** Same treatment as special-status component pages. */
  status?: FoundationStatus;
}) {
  const hasLinks = Boolean(links?.length);
  const hasAction = Boolean(action);
  const statusPresentation = status
    ? STATUS_PRESENTATION[status]
    : undefined;

  return (
    <header className={overviewStyles.root}>
      <div className={overviewStyles.copy}>
        <div className={overviewStyles.titleRow}>
          <h1 className={overviewStyles.title}>{title}</h1>
          {statusPresentation ? (
            <Tooltip title={statusPresentation.tooltip} placement="bottom">
              <span className={overviewStyles.statusTag} tabIndex={0}>
                <Tag
                  size="small"
                  color={statusPresentation.color}
                  label={statusPresentation.label}
                  startIconName={statusPresentation.iconName}
                />
              </span>
            </Tooltip>
          ) : null}
        </div>
        <p className={overviewStyles.lead}>{lead}</p>
      </div>
      {hasLinks ? (
        <div className={overviewStyles.links}>
          {links!.map((link, index) => (
            <span className={overviewStyles.linkItem} key={link.href}>
              {index > 0 ? (
                <span className={overviewStyles.linkDot} aria-hidden />
              ) : null}
              <Link
                href={link.href}
                size="small"
                type="primary"
                {...(link.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      ) : null}
      {hasAction ? (
        <div className={overviewStyles.headerAction}>{action}</div>
      ) : null}
    </header>
  );
}
