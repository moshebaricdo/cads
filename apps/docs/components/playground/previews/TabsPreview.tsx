"use client";

import { Tabs } from "@codeai/cads-react/components/Tabs";
import type { FaIconName } from "@codeai/cads-react/icons";

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
            v.size as
              | "large"
              | "medium"
              | "small"
              | "extraSmall"
              | undefined
          }
          aria-label="Demo tabs"
          defaultValue="a"
          items={[
            { value: "a", label: "Tab Label" },
            { value: "b", label: "Tab Label" },
            { value: "c", label: "Tab Label" },
            { value: "d", label: "Tab Label" },
          ]}
        />
      );
}
