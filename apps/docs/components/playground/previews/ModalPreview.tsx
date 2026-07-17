"use client";

import { ModalPlaygroundPreview } from "./OverlayPreviews";

export default function ModalPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  return <ModalPlaygroundPreview values={values} />;
}
