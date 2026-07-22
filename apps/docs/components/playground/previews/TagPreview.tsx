"use client";

import { Tag } from "@codeai/cads-react/components/Tag";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function TagPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const startIconName = String(v.startIconName ?? "").trim();
  const endIconName = String(v.endIconName ?? "").trim();
  return (
    <Tag
      color={
        v.color as
          | "neutral"
          | "brand"
          | "pink"
          | "orange"
          | "success"
          | "warning"
          | "error"
          | "info"
          | undefined
      }
      size={v.size as "large" | "medium" | "small" | undefined}
      label={String(v.label ?? "Tag")}
      startIcon={Boolean(startIconName)}
      endIcon={Boolean(endIconName)}
      startIconName={
        (startIconName || undefined) as FaIconName | undefined
      }
      endIconName={(endIconName || undefined) as FaIconName | undefined}
      isDismissible={Boolean(v.isDismissible)}
    />
  );
}
