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
  return (
        <Tooltip
          title={String(v.title ?? "Tooltip")}
          caretPlacement={
            (v.caretPlacement as "top" | "bottom" | "left" | "right") ?? "top"
          }
          hasCaret={v.hasCaret !== false}
          startIcon={Boolean(v.startIcon)}
          iconName={
            v.iconName ? (String(v.iconName) as FaIconName) : undefined
          }
        >
          <Button size="medium">Hover me</Button>
        </Tooltip>
      );
}
