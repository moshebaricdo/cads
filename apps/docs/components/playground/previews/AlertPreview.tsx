"use client";

import { Alert } from "@codeai/cads-react/components/Alert";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function AlertPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Alert
          size={
            v.size as
              | "large"
              | "medium"
              | "small"
              | "extraSmall"
              | undefined
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
          isDismissible={Boolean(v.isDismissible)}
          fullWidth={v.fullWidth !== false}
        >
          This is an alert.
        </Alert>
      );
}
