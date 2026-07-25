"use client";

import { DrawerPlaygroundPreview } from "./OverlayPreviews";
import type { PreviewProps } from "./shared";

export default function DrawerPreview(props: PreviewProps) {
  return <DrawerPlaygroundPreview {...props} />;
}
