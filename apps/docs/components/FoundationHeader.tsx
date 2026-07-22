"use client";

import type { ReactNode } from "react";
import { Link } from "@codeai/cads-react";
import overviewStyles from "./ComponentOverview.module.css";

export type FoundationHeaderLink = {
  href: string;
  label: string;
  external?: boolean;
};

export function FoundationHeader({
  title,
  lead,
  links,
  action,
}: {
  title: string;
  lead: ReactNode;
  links?: FoundationHeaderLink[];
  action?: ReactNode;
}) {
  const hasLinks = Boolean(links?.length);
  const hasAction = Boolean(action);

  return (
    <header className={overviewStyles.root}>
      <div className={overviewStyles.copy}>
        <h1 className={overviewStyles.title}>{title}</h1>
        <p className={overviewStyles.lead}>{lead}</p>
      </div>
      {hasLinks || hasAction ? (
        <div className={overviewStyles.links}>
          {links?.map((link, index) => (
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
          {hasAction ? (
            <span className={overviewStyles.linkItem}>{action}</span>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
