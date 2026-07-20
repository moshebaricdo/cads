"use client";

import { useEffect, useRef, useState } from "react";

function useCopied(): [boolean, (text: string) => void] {
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
      timer.current = setTimeout(() => setCopied(false), 1400);
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
