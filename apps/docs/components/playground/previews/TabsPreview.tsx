"use client";

import { Tabs } from "@codeai/cads-react/components/Tabs";

export default function TabsPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
    <Tabs
      type={v.type as "primary" | "secondary" | undefined}
      size={
        v.size as "large" | "medium" | "small" | "extraSmall" | undefined
      }
      aria-label={String(v["aria-label"] || "Demo tabs")}
      defaultValue={String(v.defaultValue || "a")}
      items={[
        { value: "a", label: "Tab Label" },
        { value: "b", label: "Tab Label" },
        { value: "c", label: "Tab Label" },
        { value: "d", label: "Tab Label" },
      ]}
    />
  );
}
