"use client";

import { Tag } from "@codeai/cads-react/components/Tag";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function TagPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
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
          startIcon={v.startIcon !== false}
          endIcon={Boolean(v.endIcon)}
          startIconName={
            v.startIconName
              ? (String(v.startIconName) as FaIconName)
              : undefined
          }
          endIconName={
            v.endIconName ? (String(v.endIconName) as FaIconName) : undefined
          }
          isDismissible={Boolean(v.isDismissible)}
        />
      );
}
