"use client";

import { NotificationBanner } from "@moshebaricdo/cads-react";
import type { FaIconName } from "@moshebaricdo/cads-react/icons";

export default function NotificationBannerPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <NotificationBanner
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
          fillStyle={v.fillStyle as "none" | "color" | undefined}
          title={String(v.title || "This is a title")}
          description={String(
            v.description || "This is additional descriptive text.",
          )}
          iconName={
            v.iconName ? (String(v.iconName) as FaIconName) : undefined
          }
          hasPrimaryAction={v.hasPrimaryAction !== false}
          hasSecondaryAction={v.hasSecondaryAction !== false}
          primaryActionLabel={String(v.primaryActionLabel || "Button")}
          secondaryActionLabel={String(v.secondaryActionLabel || "Button")}
          isDismissible={Boolean(v.isDismissible)}
          fullWidth={v.fullWidth !== false}
        />
      );
}
