"use client";

import { FieldWrapper } from "@codeai/cads-react/components/FieldWrapper";
import { TextInput } from "@codeai/cads-react/components/TextInput";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function FieldWrapperPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <FieldWrapper
          label={String(v.label ?? "Email")}
          helperText={
            v.helperText ? String(v.helperText) : undefined
          }
          helperIconName={
            (String(v.helperIconName ?? "").trim() || undefined) as
              | FaIconName
              | undefined
          }
          showHelper={v.showHelper !== false}
          sentiment={
            v.sentiment as
              | "default"
              | "success"
              | "warning"
              | "error"
              | undefined
          }
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          disabled={Boolean(v.disabled)}
          required={Boolean(v.required)}
        >
          <TextInput placeholder="Nested control" />
        </FieldWrapper>
      );
}
