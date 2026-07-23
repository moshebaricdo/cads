"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Tooltip } from "@codeai/cads-react";
import styles from "../FoundationPage.module.css";

export type InkScheme = "ramp" | "black-alpha" | "white-alpha";
export type InkTheme = "light" | "dark";

/**
 * Step label ink:
 * - Default ramp: below 50 black, 50+ white
 * - White-alpha light: always black; dark: inverted ramp
 * - Black-alpha dark: always white; light: default ramp
 * - Named base: white → black; black / true-black → white
 */
export function stepInk(
  step: string,
  scheme: InkScheme = "ramp",
  theme: InkTheme = "light",
): "#000000" | "#FFFFFF" {
  const named = step.toLowerCase();
  if (named === "white") return "#000000";
  if (named === "black" || named === "true-black") return "#FFFFFF";

  if (scheme === "white-alpha" && theme === "light") return "#000000";
  if (scheme === "black-alpha" && theme === "dark") return "#FFFFFF";

  const n = Number.parseInt(step, 10);
  if (!Number.isNaN(n)) {
    const darkSide = n >= 50;
    if (scheme === "white-alpha") return darkSide ? "#000000" : "#FFFFFF";
    return darkSide ? "#FFFFFF" : "#000000";
  }

  return "#000000";
}

export function ColorSwatch({
  color,
  label,
  copyValue,
  step,
  inkScheme = "ramp",
  theme = "light",
}: {
  color: string;
  label: string;
  copyValue: string;
  /** Ramp step (or base name) shown centered on hover. */
  step?: string;
  inkScheme?: InkScheme;
  theme?: InkTheme;
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

  const ink = step ? stepInk(step, inkScheme, theme) : undefined;

  return (
    <Tooltip
      title={copied ? "Copied" : label}
      hasCaret={false}
      placement="top"
      iconName={copied ? "check" : undefined}
    >
      <button
        type="button"
        className={styles.swatch}
        style={
          {
            "--swatch-color": color,
            ...(ink ? { "--swatch-step-ink": ink } : null),
          } as CSSProperties
        }
        aria-label={`Copy ${copyValue}`}
        onClick={handleCopy}
      >
        {step ? (
          <span className={styles.swatchStep} aria-hidden="true">
            {step}
          </span>
        ) : null}
      </button>
    </Tooltip>
  );
}
