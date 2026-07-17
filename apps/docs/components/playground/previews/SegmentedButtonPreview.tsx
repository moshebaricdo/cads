"use client";

import { SegmentedButton } from "@codeai/cads-react/components/SegmentedButton";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function SegmentedButtonPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <SegmentedButton
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          disabled={Boolean(v.disabled)}
          iconOnly={Boolean(v.iconOnly)}
          aria-label={String(v["aria-label"] || "Options")}
          defaultValue={String(v.defaultValue || "list")}
          options={
            v.iconOnly
              ? [
                  { value: "list", label: "List", iconName: "list" as FaIconName },
                  { value: "grid", label: "Grid", iconName: "grid" as FaIconName },
                  { value: "table", label: "Table", iconName: "table" as FaIconName },
                ]
              : [
                  { value: "list", label: "List", iconName: "list" as FaIconName },
                  { value: "grid", label: "Grid", iconName: "grid" as FaIconName },
                  { value: "table", label: "Table" },
                ]
          }
        />
      );
}
