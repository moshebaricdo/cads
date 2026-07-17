"use client";

import { Button } from "@codeai/cads-react/components/Button";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function ButtonPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const startIcon = String(v.startIconName ?? "").trim();
      const endIcon = String(v.endIconName ?? "").trim();
      return (
        <Button
          variant={v.variant as "contained" | "outlined" | "text" | undefined}
          color={
            v.color as "primary" | "secondary" | "tertiary" | "error" | undefined
          }
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          iconOnly={Boolean(v.iconOnly)}
          startIconName={(startIcon || undefined) as FaIconName | undefined}
          endIconName={(endIcon || undefined) as FaIconName | undefined}
          disabled={Boolean(v.disabled)}
          fullWidth={Boolean(v.fullWidth)}
        >
          {v.iconOnly ? null : String(v.children ?? "Continue")}
        </Button>
      );
}
