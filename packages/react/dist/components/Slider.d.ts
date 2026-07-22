import * as react from 'react';
import { ReactNode } from 'react';
import { SliderProps as SliderProps$1 } from '@mui/material/Slider';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

type SliderSize = ControlSize;
type SliderSentiment = "default" | "error";
type SliderStartsFrom = "side" | "center";
/** Matches Figma Slider symbol width (`16344:15611` variants are 300px). */
declare const SLIDER_DEFAULT_WIDTH = 300;
interface SliderProps extends Omit<SliderProps$1, "color" | "size" | "marks" | "orientation" | "valueLabelDisplay" | "min" | "max"> {
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
/** Default numeric range when `startsFrom="side"`. */
declare const SLIDER_SIDE_RANGE: {
    readonly min: 0;
    readonly max: 100;
    readonly defaultValue: 50;
};
/**
 * Default bipolar range when `startsFrom="center"` — 0 at the midpoint,
 * negatives left, positives right.
 */
declare const SLIDER_CENTER_RANGE: {
    readonly min: -100;
    readonly max: 100;
    readonly defaultValue: 0;
};
/**
 * Tick label values for `showTicks`.
 * - Continuous (`step` null / non-positive): `[min, max]` only.
 * - Discrete: every `step` from min through the last on-grid value ≤ max.
 */
declare function resolveSliderTickValues(min: number, max: number, step: number | null): number[];
/**
 * CADS Slider — continuous or stepped value control with optional ± controls.
 * Spec: Figma Slider `16344:15611`, Knob `16336:13274`, Bar `16342:13347`,
 * Stepper `16344:14959`.
 */
declare const Slider: react.ForwardRefExoticComponent<Omit<SliderProps, "ref"> & react.RefAttributes<HTMLSpanElement>>;

export { SLIDER_CENTER_RANGE, SLIDER_DEFAULT_WIDTH, SLIDER_SIDE_RANGE, Slider, type SliderProps, type SliderSentiment, type SliderSize, type SliderStartsFrom, resolveSliderTickValues };
