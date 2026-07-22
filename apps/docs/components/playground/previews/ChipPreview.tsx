"use client";

import { Chip } from "@codeai/cads-react/components/Chip";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function ChipPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const startIconName = String(v.startIconName ?? "").trim();
  const endIconName = String(v.endIconName ?? "").trim();
  return (
    <Chip
      size={
        v.size as "large" | "medium" | "small" | "extraSmall" | undefined
      }
      color={v.color as "primary" | "secondary" | undefined}
      labelStyle={v.labelStyle as "thick" | "thin" | undefined}
      label={String(v.label ?? "Chips")}
      selected={Boolean(v.selected)}
      startIcon={Boolean(startIconName)}
      endIcon={Boolean(endIconName)}
      startIconName={
        (startIconName || undefined) as FaIconName | undefined
      }
      endIconName={(endIconName || undefined) as FaIconName | undefined}
      disabled={Boolean(v.disabled)}
      aria-label={
        v["aria-label"] ? String(v["aria-label"]) : undefined
      }
    />
  );
}
