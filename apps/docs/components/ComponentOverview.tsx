"use client";

import { Link } from "@codeai/cads-react";
import styles from "./ComponentOverview.module.css";

export function ComponentOverview({
  title,
  description,
  figmaUrl,
  storybookUrl,
}: {
  title: string;
  description: string;
  figmaUrl: string;
  storybookUrl?: string;
}) {
  return (
    <header className={styles.root}>
      <div className={styles.copy}>
        <h1 className={styles.title}>{title}</h1>
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
            <Link href={storybookUrl} size="small" type="primary">
              View in Storybook
            </Link>
          </span>
        ) : null}
      </div>
    </header>
  );
}
