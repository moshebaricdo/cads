"use client";

import { useEffect, useRef, useState } from "react";
import { Tooltip } from "@codeai/cads-react";
import styles from "../FoundationPage.module.css";

const TRAVEL_MS = 500;

function parseCubicBezier(value: string): [number, number, number, number] | null {
  const match = value.match(
    /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/,
  );
  if (!match) return null;
  return [
    Number(match[1]),
    Number(match[2]),
    Number(match[3]),
    Number(match[4]),
  ];
}

/** Point on the unit cubic bezier (0,0)→(x1,y1)→(x2,y2)→(1,1) at parameter t. */
function bezierPoint(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { x: number; y: number } {
  const mt = 1 - t;
  const a = 3 * mt * mt * t;
  const b = 3 * mt * t * t;
  const c = t * t * t;
  return { x: a * x1 + b * x2 + c, y: a * y1 + b * y2 + c };
}

/** Unit-square cubic-bezier chart; hover runs a dot along the curve, click copies. */
export function EasingChart({
  value,
  variable,
}: {
  value: string;
  variable: string;
}) {
  const points = parseCubicBezier(value) ?? [0.4, 0, 0.2, 1];
  const [x1, y1, x2, y2] = points;
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  function handleCopy() {
    void navigator.clipboard?.writeText(variable).then(() => {
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1200);
    });
  }

  function setDot(t: number) {
    const dot = dotRef.current;
    if (!dot) return;
    const { x, y } = bezierPoint(t, x1, y1, x2, y2);
    dot.setAttribute("cx", String(x));
    dot.setAttribute("cy", String(1 - y));
  }

  function runTraveler() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDot(1);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / TRAVEL_MS, 1);
      setDot(t);
      rafRef.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function resetTraveler() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setDot(0);
  }

  // SVG y grows down — invert progress so (0,0) is bottom-left.
  const path = `M 0 1 C ${x1} ${1 - y1} ${x2} ${1 - y2} 1 0`;

  return (
    <Tooltip
      title={copied ? "Copied" : variable}
      hasCaret={false}
      placement="top"
      iconName={copied ? "check" : undefined}
    >
      <button
        type="button"
        className={styles.easingSample}
        aria-label={`Copy ${variable}`}
        onClick={handleCopy}
        onMouseEnter={runTraveler}
        onMouseLeave={resetTraveler}
        onFocus={runTraveler}
        onBlur={resetTraveler}
      >
        <svg
          className={styles.easingSvg}
          viewBox="-0.08 -0.08 1.16 1.16"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <line
            className={styles.easingGuide}
            x1="0"
            y1="1"
            x2="1"
            y2="0"
          />
          <path className={styles.easingCurve} d={path} />
          <circle className={styles.easingEndpoint} cx="0" cy="1" r="0.04" />
          <circle className={styles.easingEndpoint} cx="1" cy="0" r="0.04" />
          <circle
            ref={dotRef}
            className={styles.easingTraveler}
            cx="0"
            cy="1"
            r="0.055"
          />
        </svg>
      </button>
    </Tooltip>
  );
}
