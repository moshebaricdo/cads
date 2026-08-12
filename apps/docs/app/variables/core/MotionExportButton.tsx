"use client";

import { buildMotionCss } from "@moshebaricdo/cads-variables";
import { ExportCssButton } from "@/components/ExportCssButton";

export function MotionExportButton() {
  return (
    <ExportCssButton filename="motionVariables.css" build={buildMotionCss} />
  );
}
