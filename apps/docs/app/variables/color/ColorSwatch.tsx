"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Tooltip } from "@codeai/cads-react";
import styles from "../FoundationPage.module.css";

export function ColorSwatch({
  color,
  label,
  copyValue,
}: {
  color: string;
  label: string;
  copyValue: string;
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
    void navigator.clipboard?.writeText(copyValue).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <Tooltip
      title={copied ? "Copied" : label}
      hasCaret={false}
      caretPlacement="bottom"
      startIcon={copied}
      iconName="check"
    >
      <button
        type="button"
        className={styles.swatch}
        style={{ "--swatch-color": color } as CSSProperties}
        aria-label={`Copy ${copyValue}`}
        onClick={handleCopy}
      />
    </Tooltip>
  );
}
