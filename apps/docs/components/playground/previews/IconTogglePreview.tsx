"use client";

import { IconToggle } from "@codeai/cads-react/components/IconToggle";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function IconTogglePreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const dual = Boolean(v.dualToggle);
      const firstIcon = String(v.iconName ?? "").trim() || "smile";
      const secondIcon = String(v.secondIconName ?? "").trim() || "thumbs-down";
      const firstColor =
        (v.color as
          | "primary"
          | "secondary"
          | "brand"
          | "success"
          | "error"
          | undefined) ?? (dual ? "success" : "brand");
      const secondColor =
        (v.secondColor as
          | "primary"
          | "secondary"
          | "brand"
          | "success"
          | "error"
          | undefined) ?? "error";
      const labelText = v.label ? String(v.label) : undefined;
      return (
        <IconToggle
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          color={firstColor}
          iconName={firstIcon as FaIconName}
          defaultPressed={Boolean(v.defaultPressed)}
          disabled={Boolean(v.disabled)}
          label={dual ? labelText || "Was this helpful?" : labelText}
          exclusive={Boolean(v.exclusive)}
          aria-label={String(
            v["aria-label"] || (dual ? "Thumbs up" : "Toggle"),
          )}
          secondToggle={
            dual
              ? {
                  iconName: secondIcon as FaIconName,
                  color: secondColor,
                  "aria-label": String(
                    v.secondAriaLabel || "Thumbs down",
                  ),
                }
              : undefined
          }
        />
      );
}
