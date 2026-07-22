"use client";

import { TextInput } from "@codeai/cads-react/components/TextInput";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function TextInputPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const startIconName = String(v.startIconName ?? "").trim();
  const helperIconName = String(v.helperIconName ?? "").trim();
  const multiline = Boolean(v.multiline);
  return (
    <TextInput
      label={String(v.label ?? "Email")}
      size={
        v.size as "large" | "medium" | "small" | "extraSmall" | undefined
      }
      color={v.color as "primary" | "secondary" | undefined}
      multiline={multiline}
      type={
        multiline
          ? undefined
          : v.type === "password"
            ? "password"
            : "text"
      }
      startIcon={Boolean(startIconName) && !multiline}
      startIconName={
        (startIconName || undefined) as FaIconName | undefined
      }
      disabled={Boolean(v.disabled)}
      error={Boolean(v.error)}
      readOnly={Boolean(v.readOnly)}
      required={Boolean(v.required)}
      sentiment={
        v.sentiment as
          | "default"
          | "success"
          | "warning"
          | "error"
          | undefined
      }
      helperText={v.helperText ? String(v.helperText) : undefined}
      helperIconName={
        (helperIconName || undefined) as FaIconName | undefined
      }
      showHelper={v.showHelper == null ? undefined : Boolean(v.showHelper)}
      placeholder={
        v.placeholder ? String(v.placeholder) : "you@example.com"
      }
      defaultValue={v.defaultValue ? String(v.defaultValue) : undefined}
      rows={typeof v.rows === "number" ? v.rows : undefined}
    />
  );
}
