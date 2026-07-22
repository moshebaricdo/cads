"use client";

import { Button } from "@codeai/cads-react";
import styles from "./ComponentPageNav.module.css";

export type PageNavItem = {
  label: string;
  href: string;
};

export function ComponentPageNav({
  previous,
  next,
  "aria-label": ariaLabel = "Page pagination",
}: {
  previous: PageNavItem | null;
  next: PageNavItem | null;
  "aria-label"?: string;
}) {
  if (!previous && !next) return null;

  return (
    <nav className={styles.root} aria-label={ariaLabel}>
      <div className={styles.side}>
        {previous ? (
          <Button
            variant="text"
            color="secondary"
            size="small"
            href={previous.href}
            startIconName="chevron-left"
          >
            {previous.label}
          </Button>
        ) : null}
      </div>
      <div className={styles.sideEnd}>
        {next ? (
          <Button
            variant="text"
            color="secondary"
            size="small"
            href={next.href}
            endIconName="chevron-right"
          >
            {next.label}
          </Button>
        ) : null}
      </div>
    </nav>
  );
}
