"use client";

import { Checkbox } from "@moshebaricdo/cads-react";
import type { FaIconName } from "@moshebaricdo/cads-react/icons";

export default function CheckboxPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Checkbox
          label={String(v.label ?? "Checkbox")}
          size={
            v.size as
              | "large"
              | "medium"
              | "small"
              | "extraSmall"
              | undefined
          }
          labelStyle={v.labelStyle as "thin" | "thick" | undefined}
          checked={v.checked == null ? undefined : Boolean(v.checked)}
          defaultChecked={Boolean(v.defaultChecked)}
          indeterminate={Boolean(v.indeterminate)}
          disabled={Boolean(v.disabled)}
        />
      );
}
