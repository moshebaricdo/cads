import { SliderProps } from './types';
export type { SliderProps, SliderSize, SliderSentiment, SliderStartsFrom } from './types';
/** Matches Figma Slider symbol width (`16344:15611` variants are 300px). */
export declare const SLIDER_DEFAULT_WIDTH = 300;
/** Default numeric range when `startsFrom="side"`. */
export declare const SLIDER_SIDE_RANGE: {
    readonly min: 0;
    readonly max: 100;
    readonly defaultValue: 50;
};
/**
 * Default bipolar range when `startsFrom="center"` — 0 at the midpoint,
 * negatives left, positives right.
 */
export declare const SLIDER_CENTER_RANGE: {
    readonly min: -100;
    readonly max: 100;
    readonly defaultValue: 0;
};
/**
 * Tick label values for `showTicks`.
 * - Continuous (`step` null / non-positive): `[min, max]` only.
 * - Discrete: every `step` from min through the last on-grid value ≤ max.
 */
export declare function resolveSliderTickValues(min: number, max: number, step: number | null): number[];
/**
 * CADS Slider — continuous or stepped value control with optional ± controls.
 * Spec: Figma Slider `16344:15611`, Knob `16336:13274`, Bar `16342:13347`,
 * Stepper `16344:14959`.
 */
export declare const Slider: import('react').ForwardRefExoticComponent<Omit<SliderProps, "ref"> & import('react').RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=Slider.d.ts.map