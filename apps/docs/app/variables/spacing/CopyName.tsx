"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Tooltip, type TooltipProps } from "@codeai/cads-react";

/** Click-to-copy label with an icon-only tooltip (copy / check), not the variable name. */
export function CopyName({
  className,
  copyValue,
  children,
  placement = "left",
}: {
  className?: string;
  copyValue: string;
  children: ReactNode;
  placement?: TooltipProps["placement"];
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
      // Idle: icon-only (ZWSP keeps MUI from treating an empty title as disabled).
      title={copied ? "Copied" : "\u200B Copy"}
      hasCaret={false}
      placement={placement}
      startIcon
      iconName={copied ? "check" : "copy"}
    >
      <button
        type="button"
        className={className}
        aria-label={`Copy ${copyValue}`}
        onClick={handleCopy}
      >
        {children}
      </button>
    </Tooltip>
  );
}
