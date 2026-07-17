import MuiSlider, {
  type SliderProps as MuiSliderProps,
} from "@mui/material/Slider";
import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Button } from "./Button";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  FIELD_WRAPPER_SIZE,
  FOCUS_RING,
  SLIDER_CHROME,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type SliderSize = ControlSize;
export type SliderSentiment = "default" | "error";
export type SliderStartsFrom = "side" | "center";
export type SliderStepCount = 3 | 4 | 5 | 6;

/** Matches Figma Slider symbol width (`16344:15611` variants are 300px). */
export const SLIDER_DEFAULT_WIDTH = 300;

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
  helperIconName?: FaIconName | (string & {});
  /**
   * @default true
   */
  showHelper?: boolean;
  /**
   * ± step buttons flanking the track.
   * @default false
   */
  showControls?: boolean;
  /**
   * Tick labels under the track (Figma Slider Stepper — separate row).
   * @default false
   */
  showStepper?: boolean;
  /**
   * Stepper tick count when `showStepper` is true.
   * @default 5
   */
  stepCount?: SliderStepCount;
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
export const SLIDER_SIDE_RANGE = {
  min: 0,
  max: 100,
  defaultValue: 50,
} as const;

/**
 * Default bipolar range when `startsFrom="center"` — 0 at the midpoint,
 * negatives left, positives right.
 */
export const SLIDER_CENTER_RANGE = {
  min: -100,
  max: 100,
  defaultValue: 0,
} as const;

function resolveSliderWidth(
  width: number | string | undefined,
  fullWidth: boolean,
): CSSProperties["width"] {
  if (fullWidth) return "100%";
  if (width == null) return SLIDER_DEFAULT_WIDTH;
  return typeof width === "number" ? `${width}px` : width;
}

function resolveIconName(
  name: FaIconName | (string & {}) | undefined,
): FaIconName {
  if (!name || name === "smile") return "face-smile";
  return name as FaIconName;
}

/**
 * Figma Slider Bar `startsFrom=center`: fill grows from the origin toward the
 * thumb. Origin is `0` when it lies in `[min, max]`, otherwise the midpoint.
 * MUI always fills from min, so we override track geometry.
 */
function resolveCenterTrackGeometry(
  value: number,
  min: number,
  max: number,
): {
  left: string;
  width: string;
  hidden: boolean;
  /** Track starts at the inset box’s left edge — extend fill into rail overhang. */
  extendLeft: boolean;
} {
  const minN = Number(min);
  const maxN = Number(max);
  const range = maxN - minN;
  if (!(range > 0)) {
    return { left: "50%", width: "0%", hidden: true, extendLeft: false };
  }
  const origin = minN <= 0 && maxN >= 0 ? 0 : (minN + maxN) / 2;
  const t = (Number(value) - minN) / range;
  const tOrigin = (origin - minN) / range;
  if (Math.abs(t - tOrigin) < 1e-6) {
    return {
      left: `${tOrigin * 100}%`,
      width: "0%",
      hidden: true,
      extendLeft: false,
    };
  }
  if (t > tOrigin) {
    return {
      left: `${tOrigin * 100}%`,
      width: `${(t - tOrigin) * 100}%`,
      hidden: false,
      extendLeft: false,
    };
  }
  return {
    left: `${t * 100}%`,
    width: `${(tOrigin - t) * 100}%`,
    hidden: false,
    extendLeft: t < 1e-6,
  };
}

function resolveSliderRange(
  startsFrom: SliderStartsFrom,
  min: number | undefined,
  max: number | undefined,
  defaultValue: number | number[] | undefined,
): { min: number; max: number; defaultValue: number | number[] } {
  const defaults =
    startsFrom === "center" ? SLIDER_CENTER_RANGE : SLIDER_SIDE_RANGE;
  return {
    min: min ?? defaults.min,
    max: max ?? defaults.max,
    defaultValue: defaultValue ?? defaults.defaultValue,
  };
}

function SliderStepper({
  stepCount,
  disabled,
  withControlOffsets,
}: {
  stepCount: SliderStepCount;
  disabled?: boolean;
  withControlOffsets: boolean;
}) {
  const labels = Array.from({ length: stepCount }, (_, i) => String(i + 1));
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {withControlOffsets ? (
        <div
          style={{
            flexShrink: 0,
            width: SLIDER_CHROME.controlOffset,
            height: SLIDER_CHROME.stepperTickHeight,
          }}
        />
      ) : null}
      {/*
        Same horizontal inset as MuiSlider padding so tick 1/N centers match
        thumb centers at min/max (knobInset = half knob).
      */}
      <div
        style={{
          position: "relative",
          flex: 1,
          minWidth: 0,
          height: `calc(${SLIDER_CHROME.stepperTickHeight} + ${SLIDER_CHROME.stepperTickGap} + ${SLIDER_CHROME.stepperLabelHeight})`,
        }}
      >
        {labels.map((label, i) => {
          const t = i / (stepCount - 1);
          return (
            <div
              key={label}
              style={{
                position: "absolute",
                left: `calc(${SLIDER_CHROME.knobInset} + (100% - 2 * ${SLIDER_CHROME.knobInset}) * ${t})`,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: SLIDER_CHROME.stepperTickGap,
              }}
            >
              <div
                style={{
                  width: 0,
                  height: SLIDER_CHROME.stepperTickHeight,
                  borderLeft: `1px solid ${
                    disabled
                      ? "var(--border-disabled-neutral)"
                      : "var(--border-neutral-secondary)"
                  }`,
                }}
              />
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: SLIDER_CHROME.stepperLabelHeight,
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body-xxs)",
                  lineHeight: "var(--leading-body-xxs)",
                  fontWeight: "var(--font-weight-normal)",
                  color: disabled
                    ? "var(--text-disabled-neutral)"
                    : "var(--text-neutral-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {withControlOffsets ? (
        <div
          style={{
            flexShrink: 0,
            width: SLIDER_CHROME.controlOffset,
            height: SLIDER_CHROME.stepperTickHeight,
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * CADS Slider — continuous or stepped value control with optional ± controls.
 * Spec: Figma Slider `16344:15611`, Knob `16336:13274`, Bar `16342:13347`,
 * Stepper `16344:14959`.
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    size = "medium",
    sentiment = "default",
    label,
    displayValue,
    showDisplayValue = true,
    showLabelRow = true,
    helperText,
    helperIconName = "face-smile",
    showHelper = true,
    showControls = false,
    showStepper = false,
    stepCount = 5,
    startsFrom = "side",
    width = SLIDER_DEFAULT_WIDTH,
    fullWidth = false,
    value: valueProp,
    defaultValue: defaultValueProp,
    min: minProp,
    max: maxProp,
    step = 1,
    disabled,
    onChange,
    "aria-label": ariaLabel,
    sx,
    ...rest
  },
  ref,
) {
  const labelId = useId();
  const helperId = useId();
  const type = FIELD_WRAPPER_SIZE[size];
  const resolvedWidth = resolveSliderWidth(width, fullWidth);
  const { min, max, defaultValue } = resolveSliderRange(
    startsFrom,
    minProp,
    maxProp,
    defaultValueProp,
  );
  const [uncontrolled, setUncontrolled] = useState<number | number[]>(
    defaultValue,
  );
  const value = valueProp ?? uncontrolled;
  const numeric = Array.isArray(value) ? value[0] ?? min : value;
  const isError = sentiment === "error" && !disabled;
  const showHelperRow = showHelper && helperText != null;

  const commit = (event: Event, next: number | number[], activeThumb = 0) => {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(event, next, activeThumb);
  };

  const nudge = (delta: number) => {
    if (disabled) return;
    const stepNum = Number(step) || 1;
    const next = Math.min(
      Number(max),
      Math.max(Number(min), Number(numeric) + delta * stepNum),
    );
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.({} as Event, next, 0);
  };

  const fillColor = isError
    ? "var(--background-error-primary)"
    : disabled
      ? "var(--background-disabled-neutral)"
      : "var(--background-selected-primary)";

  const railBorder = isError
    ? "var(--border-error-primary)"
    : disabled
      ? "var(--border-disabled-neutral)"
      : "var(--border-neutral-secondary)";

  const thumbBorder = isError
    ? "var(--border-error-primary)"
    : disabled
      ? "var(--border-disabled-neutral)"
      : "var(--border-neutral-solid)";

  const centerTrack =
    startsFrom === "center"
      ? resolveCenterTrackGeometry(Number(numeric), Number(min), Number(max))
      : null;

  const resolvedDisplay =
    displayValue ??
    (typeof numeric === "number" ? numeric.toFixed(1) : String(numeric));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: SLIDER_CHROME.stackGap,
        width: resolvedWidth,
        maxWidth: "100%",
        boxSizing: "border-box",
        fontFamily: "var(--font-body)",
      }}
    >
      {showLabelRow && (label != null || showDisplayValue) ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              color: disabled
                ? "var(--text-disabled-neutral)"
                : isError
                  ? "var(--text-error-primary)"
                  : "var(--text-neutral-primary)",
              fontSize: type.labelFontSize,
              lineHeight: type.labelLineHeight,
            }}
          >
            {label != null ? (
              <span
                id={labelId}
                style={{
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                {label}
              </span>
            ) : (
              <span />
            )}
            {showDisplayValue ? (
              <span style={{ fontWeight: "var(--font-weight-normal)" }}>
                {resolvedDisplay}
              </span>
            ) : null}
          </div>
          {showHelperRow ? (
            <div
              id={helperId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: type.helperGap,
                paddingBottom: SLIDER_CHROME.helperPaddingBottom,
                color: disabled
                  ? "var(--text-disabled-neutral)"
                  : isError
                    ? "var(--text-error-primary)"
                    : "var(--text-neutral-tertiary)",
                fontSize: type.helperFontSize,
                lineHeight: type.helperLineHeight,
              }}
            >
              <FaIcon
                name={
                  isError
                    ? "circle-xmark"
                    : resolveIconName(helperIconName)
                }
                fontSize={type.helperIconPx}
              />
              <span>{helperText}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/*
        Figma sliderWrapper: bar row is short (track/knob height); ± buttons
        overflow into the stack gap. Stepper is a sibling row under the bar,
        inset by controlOffset when showControls so ticks align to the track.
      */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: SLIDER_CHROME.stackGap,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: SLIDER_CHROME.controlGap,
            width: "100%",
            // Figma sliderBar is ~track tall; ± buttons (24) and knob (16) overflow into stackGap.
            height: SLIDER_CHROME.trackHeight,
            overflow: "visible",
          }}
        >
          {showControls ? (
            <Button
              variant="outlined"
              color="secondary"
              size="extraSmall"
              iconOnly
              startIconName="minus"
              aria-label="Decrease"
              disabled={disabled}
              onClick={() => nudge(-1)}
              sx={{ flexShrink: 0 }}
            />
          ) : null}
          {/*
            Bar stays full-bleed (label-aligned, 6px from ±). Only the thumb
            travel is inset by half-knob: shrink the MUI positioning box with
            margin, then extend the rail back out so the track looks full width.
          */}
          <MuiSlider
            ref={ref}
            value={value}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            marks={false}
            onChange={(e, v) => commit(e, v)}
            aria-labelledby={label && showLabelRow ? labelId : undefined}
            aria-describedby={showHelperRow ? helperId : undefined}
            aria-label={ariaLabel}
            sx={{
              color: "transparent",
              height: SLIDER_CHROME.trackHeight,
              padding: 0,
              flex: 1,
              minWidth: 0,
              // Margins inset thumb travel; rail extends back to full-bleed below.
              marginInline: SLIDER_CHROME.knobInset,
              overflow: "visible",
              boxSizing: "border-box",
              "& .MuiSlider-rail": {
                height: SLIDER_CHROME.trackHeight,
                opacity: 1,
                backgroundColor: "var(--background-neutral-primary)",
                border: `1px solid ${railBorder}`,
                borderRadius: SLIDER_CHROME.barRadius,
                boxSizing: "border-box",
                left: `-${SLIDER_CHROME.knobInset}`,
                width: `calc(100% + 2 * ${SLIDER_CHROME.knobInset})`,
              },
              "& .MuiSlider-track": {
                height: SLIDER_CHROME.trackHeight,
                border: "none",
                backgroundColor: fillColor,
                borderRadius: SLIDER_CHROME.barRadius,
                // Center fill: override MUI’s min→value inline left/width.
                ...(centerTrack
                  ? {
                      left: `${centerTrack.left} !important`,
                      width: `${centerTrack.hidden ? "0%" : centerTrack.width} !important`,
                      visibility: centerTrack.hidden
                        ? ("hidden" as const)
                        : ("visible" as const),
                    }
                  : {}),
                // Extend fill into rail overhang when the filled segment reaches
                // the left edge of the inset thumb-travel box.
                ...((startsFrom === "side" && Number(numeric) > Number(min)) ||
                centerTrack?.extendLeft
                  ? {
                      boxShadow: `-${SLIDER_CHROME.knobInset} 0 0 0 ${fillColor}`,
                    }
                  : { boxShadow: "none" }),
              },
              "& .MuiSlider-thumb": {
                width: SLIDER_CHROME.knob,
                height: SLIDER_CHROME.knob,
                backgroundColor: "var(--background-neutral-primary)",
                border: `2px solid ${thumbBorder}`,
                boxShadow: "none",
                transition: TRANSITION_COLORS,
                "&::before": {
                  boxShadow: "none",
                },
                "&:hover": {
                  backgroundColor: "var(--background-neutral-tertiary)",
                  boxShadow: "none",
                },
                "&:hover::before": {
                  boxShadow: "none",
                },
                "&:active, &.Mui-active": {
                  backgroundColor: "var(--background-neutral-tertiary)",
                  boxShadow:
                    "0 2px 2px 0 rgba(0,0,0,0.07), 0 4px 7px 0 rgba(0,0,0,0.07)",
                },
                "&.Mui-focusVisible": {
                  backgroundColor: "var(--background-neutral-tertiary)",
                  boxShadow: FOCUS_RING,
                },
                "&.Mui-disabled": {
                  backgroundColor: "var(--background-neutral-primary)",
                  border: "2px solid var(--border-disabled-neutral)",
                },
              },
              ...((sx as object) ?? {}),
            }}
            {...rest}
          />
          {showControls ? (
            <Button
              variant="outlined"
              color="secondary"
              size="extraSmall"
              iconOnly
              startIconName="plus"
              aria-label="Increase"
              disabled={disabled}
              onClick={() => nudge(1)}
              sx={{ flexShrink: 0 }}
            />
          ) : null}
        </div>
        {showStepper ? (
          <SliderStepper
            stepCount={stepCount}
            disabled={disabled}
            withControlOffsets={showControls}
          />
        ) : null}
      </div>
    </div>
  );
});
