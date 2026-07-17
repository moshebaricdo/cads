"use client";

import { TextInput } from "@codeai/cads-react/components/TextInput";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function TextInputPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <TextInput
          label={String(v.label ?? "Email")}
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          color={v.color as "primary" | "secondary" | undefined}
          multiline={Boolean(v.multiline)}
          disabled={Boolean(v.disabled)}
          error={Boolean(v.error)}
          readOnly={Boolean(v.readOnly)}
          sentiment={
            v.sentiment as
              | "default"
              | "success"
              | "warning"
              | "error"
              | undefined
          }
          helperText={
            v.helperText ? String(v.helperText) : undefined
          }
          helperIconName={
            (String(v.helperIconName ?? "").trim() || undefined) as
              | FaIconName
              | undefined
          }
          placeholder={
            v.placeholder ? String(v.placeholder) : "you@example.com"
          }
          defaultValue={
            v.defaultValue ? String(v.defaultValue) : undefined
          }
          rows={typeof v.rows === "number" ? v.rows : undefined}
        />
      );
}
