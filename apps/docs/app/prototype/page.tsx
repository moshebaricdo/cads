"use client";

import {
  PrototypeCanvas,
  type PrototypeSpec,
} from "@/components/PrototypeCanvas";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

function decodeBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decodeSpec(encoded: string | null): PrototypeSpec | undefined {
  if (!encoded) return undefined;

  try {
    return JSON.parse(decodeBase64Url(encoded)) as PrototypeSpec;
  } catch {
    return undefined;
  }
}

function PrototypePageInner() {
  const searchParams = useSearchParams();
  const spec = useMemo(
    () => decodeSpec(searchParams.get("spec")),
    [searchParams],
  );

  if (!spec) {
    return (
      <main style={{ padding: "var(--space-l)" }}>
        <h1>CADS prototype</h1>
        <p>
          No valid prototype specification was provided. Create one through the
          experimental CADS MCP server.
        </p>
      </main>
    );
  }

  return <PrototypeCanvas spec={spec} />;
}

export default function PrototypePage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: "var(--space-l)" }}>
          <p>Loading prototype…</p>
        </main>
      }
    >
      <PrototypePageInner />
    </Suspense>
  );
}
