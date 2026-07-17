"use client";

import { DrawerPlaygroundPreview } from "./OverlayPreviews";

export default function DrawerPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  return <DrawerPlaygroundPreview values={values} />;
}
