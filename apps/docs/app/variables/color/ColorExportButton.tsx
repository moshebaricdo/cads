"use client";

import { useState } from "react";
import colorSystemJson from "@codeai/cads-variables/data/color-system.json";
import {
  buildPrimitiveColorsCss,
  buildSemanticColorsCss,
  type ColorSystemExportDoc,
} from "@codeai/cads-variables";
import { Button } from "@codeai/cads-react";

const colorSystem = colorSystemJson as ColorSystemExportDoc;

type ColorExportKind = "primitive" | "semantic";

const EXPORTS: Record<
  ColorExportKind,
  { filename: string; build: () => string }
> = {
  primitive: {
    filename: "primitiveColors.css",
    build: () => buildPrimitiveColorsCss(colorSystem),
  },
  semantic: {
    filename: "colors.css",
    build: () => buildSemanticColorsCss(colorSystem),
  },
};

function downloadText(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/css;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function ColorExportButton({ kind }: { kind: ColorExportKind }) {
  const [exported, setExported] = useState(false);
  const spec = EXPORTS[kind];

  function handleExport() {
    downloadText(spec.filename, spec.build());
    setExported(true);
    window.setTimeout(() => setExported(false), 1600);
  }

  return (
    <Button
      size="extraSmall"
      variant="contained"
      color="secondary"
      startIconName={exported ? "check" : "download"}
      onClick={handleExport}
      aria-label={
        exported ? "Exported" : `Export CSS (${spec.filename})`
      }
    >
      {exported ? "Exported" : "Export CSS"}
    </Button>
  );
}
