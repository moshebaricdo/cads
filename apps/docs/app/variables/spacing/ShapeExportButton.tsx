"use client";

import { buildShapeAndSpacingCss } from "@moshebari/cads-variables";
import { ExportCssButton } from "@/components/ExportCssButton";

export function ShapeExportButton() {
  return (
    <ExportCssButton
      filename="shapeAndSpacingVariables.css"
      build={buildShapeAndSpacingCss}
    />
  );
}
