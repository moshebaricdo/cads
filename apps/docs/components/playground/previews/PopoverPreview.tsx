"use client";

import { useState } from "react";
import { Button, Popover } from "@codeai/cads-react";
import type { PreviewProps } from "./shared";

/** Anchored Popover — playground shows only a trigger until opened. */
export default function PopoverPreview({
  values,
  inspect = false,
}: PreviewProps) {
  const v = values;
  const [open, setOpen] = useState(false);
  const content =
    (v.content as "textOnly" | "textImage" | "custom") ?? "textOnly";
  const close = () => setOpen(false);

  const shared = {
    content,
    caretPlacement: (v.caretPlacement as
      | "bottomLeft"
      | "bottomCenter"
      | "bottomRight"
      | "topLeft"
      | "topCenter"
      | "topRight"
      | "leftTop"
      | "leftCenter"
      | "leftBottom"
      | "rightTop"
      | "rightCenter"
      | "rightBottom") ?? "bottomLeft",
    hasCaret: v.hasCaret !== false,
    title: v.title != null ? String(v.title) : undefined,
    body: v.body != null ? String(v.body) : undefined,
    hasActionRow: v.hasActionRow !== false,
    hasStepper: v.hasStepper !== false,
    stepperText:
      v.stepperText != null ? String(v.stepperText) : undefined,
    hasPrimaryAction: v.hasPrimaryAction !== false,
    hasSecondaryAction: v.hasSecondaryAction !== false,
    primaryActionLabel:
      v.primaryActionLabel != null
        ? String(v.primaryActionLabel)
        : undefined,
    secondaryActionLabel:
      v.secondaryActionLabel != null
        ? String(v.secondaryActionLabel)
        : undefined,
    isDismissible: v.isDismissible !== false,
    customContent:
      content === "custom" ? (
        <div style={{ padding: 20 }}>Popover with custom content</div>
      ) : undefined,
  } as const;

  if (inspect) {
    return <Popover {...shared} surfaceOnly />;
  }

  return (
    <Popover
      {...shared}
      open={open}
      onOpenChange={setOpen}
      onClose={close}
      onPrimaryAction={close}
      onSecondaryAction={close}
    >
      <Button size="medium">Open popover</Button>
    </Popover>
  );
}
