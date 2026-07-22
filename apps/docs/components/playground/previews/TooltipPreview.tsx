"use client";

import { Tooltip } from "@codeai/cads-react/components/Tooltip";
import { Button } from "@codeai/cads-react/components/Button";
import type { FaIconName } from "@codeai/cads-react/icons";

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
      caretPlacement={
        (v.caretPlacement as "top" | "bottom" | "left" | "right") ?? "top"
      }
      hasCaret={v.hasCaret !== false}
      startIcon={Boolean(iconName)}
      iconName={(iconName || undefined) as FaIconName | undefined}
    >
      <Button size="medium">Hover me</Button>
    </Tooltip>
  );
}
