"use client";

import { Button } from "@codeai/cads-react/components/Button";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function ButtonPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const iconOnly = Boolean(v.iconOnly);
  const iconName = String(v.iconName ?? "").trim() || "smile";
  const startIcon = iconOnly
    ? iconName
    : String(v.startIconName ?? "").trim();
  const endIcon = iconOnly ? "" : String(v.endIconName ?? "").trim();
  return (
    <Button
      variant={v.variant as "contained" | "outlined" | "text" | undefined}
      color={
        v.color as "primary" | "secondary" | "tertiary" | "error" | undefined
      }
      size={
        v.size as "large" | "medium" | "small" | "extraSmall" | undefined
      }
      iconOnly={iconOnly}
      startIconName={(startIcon || undefined) as FaIconName | undefined}
      endIconName={(endIcon || undefined) as FaIconName | undefined}
      loading={Boolean(v.loading)}
      disabled={Boolean(v.disabled)}
      fullWidth={Boolean(v.fullWidth)}
      aria-label={iconOnly ? iconName : undefined}
    >
      {iconOnly ? null : String(v.children ?? "Continue")}
    </Button>
  );
}
