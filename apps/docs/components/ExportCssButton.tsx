"use client";

import { useState } from "react";
import { Button } from "@codeai/cads-react";

export type ExportFileSpec = {
  filename: string;
  build: () => string;
  /** MIME type for the download blob. Defaults to text/css. */
  mimeType?: string;
};

function downloadText(
  filename: string,
  contents: string,
  mimeType = "text/css;charset=utf-8",
) {
  const blob = new Blob([contents], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ExportCssButton({
  filename,
  build,
  files,
  label = "Export CSS",
}: {
  /** Single-file export (color / shape / motion). */
  filename?: string;
  build?: () => string;
  /** Multi-file export (typography prod bundle). Downloads sequentially. */
  files?: ExportFileSpec[];
  label?: string;
}) {
  const [exported, setExported] = useState(false);
  const specs: ExportFileSpec[] = files?.length
    ? files
    : filename && build
      ? [{ filename, build }]
      : [];

  async function handleExport() {
    for (const [index, spec] of specs.entries()) {
      if (index > 0) await sleep(120);
      downloadText(
        spec.filename,
        spec.build(),
        spec.mimeType ?? "text/css;charset=utf-8",
      );
    }
    setExported(true);
    window.setTimeout(() => setExported(false), 1600);
  }

  const ariaName = specs.map((s) => s.filename).join(", ");

  return (
    <Button
      size="extraSmall"
      variant="contained"
      color="secondary"
      startIconName={exported ? "check" : "download"}
      onClick={() => void handleExport()}
      aria-label={exported ? "Exported" : `Export (${ariaName})`}
    >
      {exported ? "Exported" : label}
    </Button>
  );
}
