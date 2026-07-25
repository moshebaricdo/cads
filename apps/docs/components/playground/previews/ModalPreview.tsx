"use client";

import { ModalPlaygroundPreview } from "./OverlayPreviews";
import type { PreviewProps } from "./shared";

export default function ModalPreview(props: PreviewProps) {
  return <ModalPlaygroundPreview {...props} />;
}