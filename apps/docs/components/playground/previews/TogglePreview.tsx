"use client";

import { Toggle } from "@codeai/cads-react/components/Toggle";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function TogglePreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Toggle
          label={
            v.label == null || v.label === ""
              ? undefined
              : String(v.label)
          }
          size={
            v.size as
              | "large"
              | "medium"
              | "small"
              | "extraSmall"
              | undefined
          }
          labelPlacement={
            v.labelPlacement as "left" | "right" | undefined
          }
          checked={v.checked == null ? undefined : Boolean(v.checked)}
          defaultChecked={Boolean(v.defaultChecked)}
          disabled={Boolean(v.disabled)}
          hasIcons={v.hasIcons == null ? undefined : Boolean(v.hasIcons)}
          onIcon={
            v.onIcon == null || v.onIcon === ""
              ? undefined
              : (String(v.onIcon) as FaIconName)
          }
          offIcon={
            v.offIcon == null || v.offIcon === ""
              ? undefined
              : (String(v.offIcon) as FaIconName)
          }
          aria-label={String(v["aria-label"] || "Toggle")}
        />
      );
}
