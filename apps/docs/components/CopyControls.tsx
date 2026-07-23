"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Tooltip } from "@codeai/cads-react";

function useCopied(resetMs = 1400): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function copy(text: string) {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
    });
  }

  return [copied, copy];
}

export function CopyButton({ text }: { text: string }) {
  const [copied, copy] = useCopied();
  return (
    <button
      type="button"
      className="docs-copy-btn"
      onClick={() => copy(text)}
      aria-label="Copy to clipboard"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** Tertiary icon-only copy control for the template playground code tab. */
export function CopyCodeIconButton({ text }: { text: string }) {
  const [copied, copy] = useCopied(1000);
  return (
    <Tooltip title="copy code" hasCaret={false} placement="top">
      <Button
        variant="text"
        color="tertiary"
        size="extraSmall"
        iconOnly
        startIconName={copied ? "check" : "copy"}
        aria-label="Copy code"
        onClick={() => copy(text)}
      />
    </Tooltip>
  );
}

/** Copyable `var(--name)` chip used for variable dependencies + swatches. */
export function VarChip({ name }: { name: string }) {
  const [copied, copy] = useCopied();
  const varName = name.startsWith("--") ? name : `--${name}`;
  return (
    <button
      type="button"
      className="docs-var-chip"
      onClick={() => copy(`var(${varName})`)}
      title={`Copy var(${varName})`}
    >
      {copied ? "Copied!" : varName}
    </button>
  );
}
