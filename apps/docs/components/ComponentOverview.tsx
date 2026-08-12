"use client";

import { Link, Tag, Tooltip } from "@moshebaricdo/cads-react";
import type { TagProps } from "@moshebaricdo/cads-react";
import type { ComponentStatus } from "@/lib/componentExternalLinks";
import styles from "./ComponentOverview.module.scss";

const STATUS_PRESENTATION: Record<
  ComponentStatus,
  {
    label: string;
    color: "warning" | "error" | "info";
    tooltip: string;
    iconName: NonNullable<TagProps["startIconName"]>;
  }
> = {
  notInProduction: {
    label: "Not in Production",
    color: "warning",
    iconName: "circle-exclamation",
    tooltip:
      "Available for use in Figma only. This component has not shipped to the production component library yet.",
  },
  deprecated: {
    label: "Deprecated",
    color: "error",
    iconName: "circle-xmark",
    tooltip:
      "Kept for existing usage only. Avoid it in new work and migrate to the documented replacement.",
  },
  experimental: {
    label: "Experimental",
    color: "info",
    iconName: "flask",
    tooltip:
      "This feature is experimental and is not available in the production.",
  },
};

export function ComponentOverview({
  title,
  description,
  figmaUrl,
  storybookUrl,
  status,
}: {
  title: string;
  description: string;
  figmaUrl: string;
  storybookUrl?: string;
  status?: ComponentStatus;
}) {
  const statusPresentation = status
    ? STATUS_PRESENTATION[status]
    : undefined;

  return (
    <header className={styles.root}>
      <div className={styles.copy}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          {statusPresentation ? (
            <Tooltip title={statusPresentation.tooltip} placement="bottom">
              {/* Tag takes a fixed prop set, so the tooltip needs a host element. */}
              <span className={styles.statusTag} tabIndex={0}>
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
        <p className={styles.lead}>{description}</p>
      </div>
      <div className={styles.links}>
        <span className={styles.linkItem}>
          <Link
            href={figmaUrl}
            size="small"
            type="primary"
            target="_blank"
            rel="noreferrer"
          >
            Open in Figma
          </Link>
        </span>
        {storybookUrl ? (
          <span className={styles.linkItem}>
            <span className={styles.linkDot} aria-hidden />
            <Link
              href={storybookUrl}
              size="small"
              type="primary"
              target="_blank"
              rel="noreferrer"
            >
              View in Storybook
            </Link>
          </span>
        ) : null}
      </div>
    </header>
  );
}
