"use client";

import { Tooltip } from "@codeai/cads-react/components/Tooltip";
import { Button } from "@codeai/cads-react/components/Button";
import type { FaIconName } from "@codeai/cads-react/icons";
import type { TooltipProps } from "@codeai/cads-react";

export default function TooltipPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const iconName = String(v.iconName ?? "").trim();

  return (
    <Tooltip
      title={String(v.title ?? "Tooltip")}
      placement={
        (v.placement as NonNullable<TooltipProps["placement"]>) ?? "bottom"
      }
      hasCaret={v.hasCaret !== false}
      startIcon={Boolean(iconName)}
      iconName={(iconName || undefined) as FaIconName | undefined}
    >
      <Button size="medium">Hover me</Button>
    </Tooltip>
  );
}
