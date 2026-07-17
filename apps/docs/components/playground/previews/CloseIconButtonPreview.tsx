"use client";

import { CloseIconButton } from "@codeai/cads-react/components/CloseIconButton";
import type {
  CloseIconButtonColor,
  CloseIconButtonSize,
} from "@codeai/cads-react/components/CloseIconButton";

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
