"use client";

import { Toggle } from "@moshebaricdo/cads-react";
import { Suspense } from "react";
import { useDocsWideMotionFlag } from "@/lib/useDocsWideMotionFlag";

function MotionExperimentToggleInner() {
  const { enabled, setFlag } = useDocsWideMotionFlag();

  return (
    <Toggle
      size="small"
      label="Enable Motion on CADS Docs"
      hasIcons={false}
      labelPlacement="right"
      checked={enabled}
      onChange={(_, next) => setFlag(next)}
    />
  );
}

/** Docs-wide motion experiment toggle (same flag as the topbar Experiments control). */
export function MotionExperimentToggle() {
  return (
    <Suspense
      fallback={
        <Toggle
          size="small"
          label="Enable Motion on CADS Docs"
          labelPlacement="right"
          checked={false}
          disabled
        />
      }
    >
      <MotionExperimentToggleInner />
    </Suspense>
  );
}
