"use client";

import colorSystemJson from "@codeai/cads-variables/data/color-system.json";
import {
  buildPrimitiveColorsCss,
  buildSemanticColorsCss,
  type ColorSystemExportDoc,
} from "@codeai/cads-variables";
import { ExportCssButton } from "@/components/ExportCssButton";

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
    /** Prod-exact: data-theme only (no `.dark` class). */
    build: () => buildSemanticColorsCss(colorSystem),
  },
};

export function ColorExportButton({ kind }: { kind: ColorExportKind }) {
  const spec = EXPORTS[kind];
  return <ExportCssButton filename={spec.filename} build={spec.build} />;
}
