"use client";

import { Slider } from "@codeai/cads-react/components/Slider";
import type { FaIconName } from "@codeai/cads-react/icons";

function finiteNumber(value: unknown, fallback: number): number {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Empty / null → continuous (`step={null}`); otherwise a positive number. */
function parseStep(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function SliderPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const widthRaw = String(v.width ?? "300").trim() || "300";
  const width = /^\d+(\.\d+)?$/.test(widthRaw) ? Number(widthRaw) : widthRaw;
  const startsFrom =
    (v.startsFrom as "side" | "center" | undefined) ?? "side";
  const min = finiteNumber(v.min, startsFrom === "center" ? -100 : 0);
  const max = finiteNumber(v.max, 100);
  const defaultValue = finiteNumber(
    v.defaultValue,
    startsFrom === "center" ? 0 : 50,
  );
  // Empty field → continuous (`null`). Unset/initial → 1. Explicit number → that step.
  const step = v.step === "" ? null : v.step == null ? 1 : (parseStep(v.step) ?? 1);
  const helperIconName = String(v.helperIconName ?? "").trim();
  const displayValue =
    v.displayValue == null || v.displayValue === ""
      ? undefined
      : String(v.displayValue);
  return (
    <Slider
      key={`${startsFrom}-${min}-${max}-${defaultValue}-${String(step)}`}
      size={
        v.size as "large" | "medium" | "small" | "extraSmall" | undefined
      }
      sentiment={v.sentiment as "default" | "error" | undefined}
      label={
        v.label == null || v.label === "" ? undefined : String(v.label)
      }
      displayValue={displayValue}
      helperText={
        v.helperText == null || v.helperText === ""
          ? undefined
          : String(v.helperText)
      }
      helperIconName={
        (helperIconName || undefined) as FaIconName | undefined
      }
      showHelper={v.showHelper == null ? true : Boolean(v.showHelper)}
      showControls={Boolean(v.showControls)}
      showTicks={Boolean(v.showTicks)}
      showDisplayValue={
        v.showDisplayValue == null ? true : Boolean(v.showDisplayValue)
      }
      showLabelRow={v.showLabelRow == null ? true : Boolean(v.showLabelRow)}
      startsFrom={startsFrom}
      min={min}
      max={max}
      step={step}
      width={width}
      fullWidth={Boolean(v.fullWidth)}
      defaultValue={defaultValue}
      disabled={Boolean(v.disabled)}
      aria-label={String(v["aria-label"] || "Slider")}
    />
  );
}
