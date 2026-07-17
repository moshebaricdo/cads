"use client";

import { Radio } from "@codeai/cads-react/components/Radio";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function RadioPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Radio
          label={String(v.label ?? "Radio button")}
          value="a"
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
          disabled={Boolean(v.disabled)}
        />
      );
}
