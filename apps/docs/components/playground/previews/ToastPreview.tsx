"use client";

import { Toast } from "@codeai/cads-react/components/Toast";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function ToastPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Toast
          sentiment={
            v.sentiment as
              | "primary"
              | "pink"
              | "success"
              | "error"
              | "warning"
              | "info"
              | "neutral"
              | undefined
          }
          hasIcon={v.hasIcon !== false}
          iconName={
            v.iconName ? (String(v.iconName) as FaIconName) : undefined
          }
          hasAction={Boolean(v.hasAction)}
          actionLabel={String(v.actionLabel || "Button")}
          actionStartIconName={
            v.actionStartIconName
              ? (String(v.actionStartIconName) as FaIconName)
              : undefined
          }
          actionEndIconName={
            v.actionEndIconName
              ? (String(v.actionEndIconName) as FaIconName)
              : undefined
          }
          isDismissible={v.isDismissible !== false}
        >
          This is a toast.
        </Toast>
      );
}
