"use client";

import { IconTooltip } from "@codeai/cads-react/components/IconTooltip";
import type {
  IconTooltipColor,
  IconTooltipSize,
} from "@codeai/cads-react/components/IconTooltip";
import type { TooltipProps } from "@codeai/cads-react";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function IconTooltipPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const iconName = String(v.iconName ?? "").trim();
  const placement =
    (v.placement as NonNullable<TooltipProps["placement"]>) ?? "top";

  return (
    <IconTooltip
      title={String(v.title ?? "Help text")}
      color={v.color as IconTooltipColor | undefined}
      size={v.size as IconTooltipSize | undefined}
      placement={placement}
      hasCaret={v.hasCaret !== false}
      iconName={(iconName || undefined) as FaIconName | undefined}
      aria-label={String(v["aria-label"] || "More info")}
    />
  );
}
