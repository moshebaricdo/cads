"use client";

import { buildShapeAndSpacingCss } from "@moshebaricdo/cads-variables";
import { ExportCssButton } from "@/components/ExportCssButton";

export function ShapeExportButton() {
  return (
    <ExportCssButton
      filename="shapeAndSpacingVariables.css"
      build={buildShapeAndSpacingCss}
    />
  );
}
