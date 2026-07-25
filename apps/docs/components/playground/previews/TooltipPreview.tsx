"use client";

import { Tooltip } from "@codeai/cads-react/components/Tooltip";
import { Button } from "@codeai/cads-react/components/Button";
import type { FaIconName } from "@codeai/cads-react/icons";
import type { TooltipProps } from "@codeai/cads-react";
import type { PreviewProps } from "./shared";

/**
 * Tooltip playground — hover trigger in preview; Inspect uses surfaceOnly so
 * the bubble (+ caret) is the measurable root (no Popper / padding wrapper).
 */
export default function TooltipPreview({
  values,
  inspect = false,
}: PreviewProps) {
  const v = values;
  const iconName = String(v.iconName ?? "").trim();
  const placement =
    (v.placement as NonNullable<TooltipProps["placement"]>) ?? "bottom";

  const shared = {
    title: String(v.title ?? "Tooltip"),
    placement,
    hasCaret: v.hasCaret !== false,
    iconName: (iconName || undefined) as FaIconName | undefined,
  } as const;

  if (inspect) {
    return <Tooltip {...shared} surfaceOnly />;
  }

  return (
    <Tooltip {...shared}>
      <Button size="medium">Hover me</Button>
    </Tooltip>
  );
}
