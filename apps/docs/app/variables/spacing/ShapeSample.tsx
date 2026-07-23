"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Tooltip } from "@codeai/cads-react";

export function ShapeSample({
  className,
  style,
  label,
  copyValue,
}: {
  className: string;
  style?: CSSProperties;
  /** Tooltip label while idle (typically the CSS variable name). */
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
      placement="top"
      iconName={copied ? "check" : undefined}
    >
      <button
        type="button"
        className={className}
        style={style}
        aria-label={`Copy ${copyValue}`}
        onClick={handleCopy}
      />
    </Tooltip>
  );
}
