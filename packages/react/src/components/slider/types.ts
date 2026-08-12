import type { SliderProps as MuiSliderProps } from "@mui/material/Slider";
import type { ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { ControlSize } from "../../shared/controlSize";

export type SliderSize = ControlSize;
export type SliderSentiment = "default" | "error";
export type SliderStartsFrom = "side" | "center";

export interface SliderProps
  extends Omit<
    MuiSliderProps,
    | "color"
    | "size"
    | "marks"
    | "orientation"
    | "valueLabelDisplay"
    | "min"
    | "max"
  > {
  /**
   * Label / helper typography scale (Figma `labelSize`).
   * @default "medium"
   */
  size?: SliderSize;
  /**
   * Field-level state. Knob/track interaction states are CSS recipes.
   * @default "default"
   */
  sentiment?: SliderSentiment;
  label?: ReactNode;
  displayValue?: ReactNode;
  /**
   * @default true
   */
  showDisplayValue?: boolean;
  /**
   * @default true
   */
  showLabelRow?: boolean;
  helperText?: ReactNode;
  /**
   * Optional icon beside helper text when sentiment is default. Omit for no
   * icon. Error sentiment always shows a fixed validation icon.
   */
  helperIconName?: FaIconName | (string & {});
  /**
   * @default true
   */
  showHelper?: boolean;
  /**
   * ± buttons flanking the track (nudge by `step`).
   * @default false
   */
  showControls?: boolean;
  /**
   * Labeled ticks under the track (Figma Slider Stepper — separate row).
   * Labels follow the `step` grid (e.g. min=0, max=100, step=25 → 0, 25, 50, 75, 100).
   * With a continuous slider (`step={null}`), only min and max are shown.
   * @default false
   */
  showTicks?: boolean;
  /**
   * Fill origin for the track (Figma Slider Bar `startsFrom`).
   * - `"side"`: fill from `min` → value (default range 0–100).
   * - `"center"`: bipolar fill from 0 toward the value (default range -100–100).
   * @default "side"
   */
  startsFrom?: SliderStartsFrom;
  /**
   * Range minimum. Defaults by `startsFrom`: `0` (side) or `-100` (center).
   */
  min?: number;
  /**
   * Range maximum. Defaults by `startsFrom`: `100` (side or center).
   */
  max?: number;
  /**
   * Explicit control width. Numbers are px; strings are any CSS length.
   * Ignored when `fullWidth` is true.
   * @default 300
   */
  width?: number | string;
  /**
   * Stretch to 100% of the parent. Takes precedence over `width`.
   * @default false
   */
  fullWidth?: boolean;
}
