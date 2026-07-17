"use client";

import { Slider } from "@codeai/cads-react/components/Slider";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function SliderPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const widthRaw = String(v.width ?? "300").trim() || "300";
      const width = /^\d+(\.\d+)?$/.test(widthRaw)
        ? Number(widthRaw)
        : widthRaw;
      const startsFrom =
        (v.startsFrom as "side" | "center" | undefined) ?? "side";
      const min =
        v.min == null || v.min === ""
          ? startsFrom === "center"
            ? -100
            : 0
          : Number(v.min);
      const max =
        v.max == null || v.max === "" ? 100 : Number(v.max);
      const defaultValue =
        v.defaultValue == null || v.defaultValue === ""
          ? 0
          : Number(v.defaultValue);
      const step =
        v.step == null || v.step === "" ? 1 : Number(v.step);
      return (
        <Slider
          key={`${startsFrom}-${min}-${max}-${defaultValue}-${step}`}
          size={
            v.size as
              | "large"
              | "medium"
              | "small"
              | "extraSmall"
              | undefined
          }
          sentiment={v.sentiment as "default" | "error" | undefined}
          label={
            v.label == null || v.label === ""
              ? undefined
              : String(v.label)
          }
          helperText={
            v.helperText == null || v.helperText === ""
              ? undefined
              : String(v.helperText)
          }
          showHelper={v.showHelper == null ? true : Boolean(v.showHelper)}
          showControls={Boolean(v.showControls)}
          showStepper={Boolean(v.showStepper)}
          showDisplayValue={
            v.showDisplayValue == null ? true : Boolean(v.showDisplayValue)
          }
          showLabelRow={
            v.showLabelRow == null ? true : Boolean(v.showLabelRow)
          }
          startsFrom={startsFrom}
          min={min}
          max={max}
          step={step}
          stepCount={
            v.stepCount == null
              ? undefined
              : (Number(v.stepCount) as 3 | 4 | 5 | 6)
          }
          width={width}
          fullWidth={Boolean(v.fullWidth)}
          defaultValue={defaultValue}
          disabled={Boolean(v.disabled)}
          aria-label={String(v["aria-label"] || "Slider")}
        />
      );
}
