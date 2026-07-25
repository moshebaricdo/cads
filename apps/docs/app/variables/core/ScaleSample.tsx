"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Tooltip } from "@codeai/cads-react";
import styles from "../FoundationPage.module.css";

/** Nested scale tile; click copies the CSS variable. */
export function ScaleSample({
  variable,
  scale,
}: {
  variable: string;
  scale: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function handleCopy() {
    void navigator.clipboard?.writeText(variable).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <Tooltip
      title={copied ? "Copied" : variable}
      hasCaret={false}
      placement="top"
      iconName={copied ? "check" : undefined}
    >
      <button
        type="button"
        className={styles.scaleSample}
        style={{ "--demo-scale": scale } as CSSProperties}
        aria-label={`Copy ${variable}`}
        onClick={handleCopy}
      >
        <span className={styles.scaleFrame}>
          <span className={styles.scaleSampleInner} />
        </span>
      </button>
    </Tooltip>
  );
}
