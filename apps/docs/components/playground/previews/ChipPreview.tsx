"use client";

import { Chip } from "@codeai/cads-react/components/Chip";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function ChipPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Chip
          size={
            v.size as
              | "large"
              | "medium"
              | "small"
              | "extraSmall"
              | undefined
          }
          color={v.color as "primary" | "secondary" | undefined}
          labelStyle={v.labelStyle as "thick" | "thin" | undefined}
          label={String(v.label ?? "Chips")}
          selected={Boolean(v.selected)}
          startIcon={Boolean(v.startIcon)}
          endIcon={Boolean(v.endIcon)}
          startIconName={
            v.startIconName
              ? (String(v.startIconName) as FaIconName)
              : undefined
          }
          endIconName={
            v.endIconName
              ? (String(v.endIconName) as FaIconName)
              : undefined
          }
          disabled={Boolean(v.disabled)}
        />
      );
}
