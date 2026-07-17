"use client";

import { Popover } from "@codeai/cads-react/components/Popover";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function PopoverPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Popover
          content={
            (v.content as "textOnly" | "textImage" | "custom") ?? "textOnly"
          }
          caretPlacement={
            (v.caretPlacement as
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
              | "rightBottom") ?? "bottomLeft"
          }
          hasCaret={v.hasCaret !== false}
          title={v.title != null ? String(v.title) : undefined}
          body={v.body != null ? String(v.body) : undefined}
          hasActionRow={v.hasActionRow !== false}
          hasStepper={v.hasStepper !== false}
          stepperText={
            v.stepperText != null ? String(v.stepperText) : undefined
          }
          hasPrimaryAction={v.hasPrimaryAction !== false}
          hasSecondaryAction={v.hasSecondaryAction !== false}
          primaryActionLabel={
            v.primaryActionLabel != null
              ? String(v.primaryActionLabel)
              : undefined
          }
          secondaryActionLabel={
            v.secondaryActionLabel != null
              ? String(v.secondaryActionLabel)
              : undefined
          }
          isDismissible={v.isDismissible !== false}
          surfaceOnly
        />
      );
}
