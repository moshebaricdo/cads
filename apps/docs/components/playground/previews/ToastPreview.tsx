"use client";

import { Toast } from "@codeai/cads-react/components/Toast";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function ToastPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const iconName = String(v.iconName ?? "").trim();
  const actionStart = String(v.actionStartIconName ?? "").trim();
  const actionEnd = String(v.actionEndIconName ?? "").trim();
  const resolvedIconName =
    v.hasIcon === false
      ? false
      : ((iconName || undefined) as FaIconName | undefined);
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
      iconName={resolvedIconName}
      hasAction={Boolean(v.hasAction)}
      actionLabel={String(v.actionLabel || "Button")}
      actionStartIconName={
        (actionStart || undefined) as FaIconName | undefined
      }
      actionEndIconName={(actionEnd || undefined) as FaIconName | undefined}
      isDismissible={v.isDismissible !== false}
    >
      {String(v.children ?? "This is a toast.")}
    </Toast>
  );
}
