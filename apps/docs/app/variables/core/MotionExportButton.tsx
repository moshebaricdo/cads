"use client";

import { buildMotionCss } from "@moshebari/cads-variables";
import { ExportCssButton } from "@/components/ExportCssButton";

export function MotionExportButton() {
  return (
    <ExportCssButton filename="motionVariables.css" build={buildMotionCss} />
  );
}
