"use client";

import { Checkbox } from "@codeai/cads-react/components/Checkbox";
import type { FaIconName } from "@codeai/cads-react/icons";

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
