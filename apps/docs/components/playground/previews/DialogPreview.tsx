"use client";

import { DialogPlaygroundPreview } from "./OverlayPreviews";

export default function DialogPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  return <DialogPlaygroundPreview values={values} />;
}
