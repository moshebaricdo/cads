"use client";

import { ChipGroup } from "@codeai/cads-react/components/ChipGroup";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function ChipGroupPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const helperIconName = String(v.helperIconName ?? "").trim();
  return (
    <ChipGroup
      size={
        v.size as "large" | "medium" | "small" | "extraSmall" | undefined
      }
      color={v.color as "primary" | "secondary" | undefined}
      labelStyle={v.labelStyle as "thick" | "thin" | undefined}
      label={
        v.label == null || v.label === "" ? "Field label" : String(v.label)
      }
      helperText={
        v.helperText == null || v.helperText === ""
          ? "Helper text"
          : String(v.helperText)
      }
      helperIconName={
        (helperIconName || undefined) as FaIconName | undefined
      }
      showHelper={v.showHelper == null ? true : Boolean(v.showHelper)}
      options={[
        { value: "a", label: "Chips" },
        { value: "b", label: "Chips" },
        { value: "c", label: "Chips" },
        { value: "d", label: "Chips" },
      ]}
      defaultValue={["a"]}
      disabled={Boolean(v.disabled)}
      aria-label={
        v["aria-label"] ? String(v["aria-label"]) : undefined
      }
    />
  );
}
