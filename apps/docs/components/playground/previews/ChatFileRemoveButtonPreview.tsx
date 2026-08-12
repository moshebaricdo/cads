"use client";

import { ChatFileRemoveButton } from "@moshebaricdo/cads-react";

export default function ChatFileRemoveButtonPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  return (
    <ChatFileRemoveButton
      disabled={Boolean(values.disabled)}
      aria-label={String(values["aria-label"] || "Remove")}
    />
  );
}
