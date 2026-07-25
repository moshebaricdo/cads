"use client";

import { DialogPlaygroundPreview } from "./OverlayPreviews";
import type { PreviewProps } from "./shared";

export default function DialogPreview(props: PreviewProps) {
  return <DialogPlaygroundPreview {...props} />;
}
