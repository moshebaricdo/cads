"use client";

import {
  CloseIconButton,
  type CloseIconButtonColor,
  type CloseIconButtonSize,
} from "@moshebaricdo/cads-react";

export default function CloseIconButtonPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  return (
    <CloseIconButton
      size={values.size as CloseIconButtonSize | undefined}
      color={values.color as CloseIconButtonColor | undefined}
      disabled={Boolean(values.disabled)}
      aria-label={String(values["aria-label"] || "Close")}
    />
  );
}
