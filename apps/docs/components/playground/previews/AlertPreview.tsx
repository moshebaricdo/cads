"use client";

import { Alert } from "@codeai/cads-react/components/Alert";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function AlertPreview({
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
    <Alert
      size={
        v.size as "large" | "medium" | "small" | "extraSmall" | undefined
      }
      sentiment={
        v.sentiment as
          | "brand"
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
      isDismissible={Boolean(v.isDismissible)}
      fullWidth={v.fullWidth !== false}
    >
      {String(v.children ?? "This is an alert.")}
    </Alert>
  );
}
