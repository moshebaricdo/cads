"use client";

import { ProgressBubble } from "@moshebaricdo/cads-react";
import type {
  ProgressBubbleLevelType,
  ProgressBubbleStatus,
} from "@moshebaricdo/cads-react";

export default function ProgressBubblePreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const isActive = Boolean(v.isActive);
  return (
    <ProgressBubble
      levelType={v.levelType as ProgressBubbleLevelType | undefined}
      status={v.status as ProgressBubbleStatus | undefined}
      isActive={isActive}
      isAssessment={Boolean(v.isAssessment)}
      levelNumber={isActive ? String(v.levelNumber ?? "6") : undefined}
      interactive={v.interactive === undefined ? true : Boolean(v.interactive)}
      disabled={Boolean(v.disabled)}
      aria-label="Level 6"
    />
  );
}
