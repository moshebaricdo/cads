"use client";

import { Button, Tooltip, type TooltipProps } from "@moshebaricdo/cads-react";
import type { FaIconName } from "@moshebaricdo/cads-react/icons";
import type { PreviewProps } from "./shared";

/**
 * Tooltip playground — hover/focus trigger in preview; Inspect uses surfaceOnly
 * so the bubble (+ caret) is the measurable root (no Popper / padding wrapper).
 * With disableHoverListener, the bubble opens only on keyboard focus-visible.
 */
export default function TooltipPreview({
  values,
  inspect = false,
}: PreviewProps) {
  const v = values;
  const iconName = String(v.iconName ?? "").trim();
  const placement =
    (v.placement as NonNullable<TooltipProps["placement"]>) ?? "bottom";
  const disableHoverListener = Boolean(v.disableHoverListener);

  const shared = {
    title: String(v.title ?? "Tooltip"),
    placement,
    hasCaret: v.hasCaret !== false,
    iconName: (iconName || undefined) as FaIconName | undefined,
    disableHoverListener: disableHoverListener || undefined,
  } as const;

  if (inspect) {
    return <Tooltip {...shared} surfaceOnly />;
  }

  return (
    <Tooltip {...shared}>
      <Button size="medium">
        {disableHoverListener ? "Focus me (Tab)" : "Hover me"}
      </Button>
    </Tooltip>
  );
}
