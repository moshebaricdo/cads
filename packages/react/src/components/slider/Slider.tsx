import MuiSlider from "@mui/material/Slider";
import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
} from "react";
import { Button } from "../button/index";
import { FaIcon } from "../../icons/FaIcon";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import {
  FIELD_WRAPPER_SIZE,
  SLIDER_CHROME,
  TRANSITION_COLORS,
} from "../../shared/controlSize";
import styles from "./slider.module.scss";
import type { SliderProps, SliderStartsFrom } from "./types";

export type { SliderProps, SliderSize, SliderSentiment, SliderStartsFrom } from "./types";

/** Matches Figma Slider symbol width (`16344:15611` variants are 300px). */
export const SLIDER_DEFAULT_WIDTH = 300;

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

function resolveCenterTrackGeometry(
  value: number,
  min: number,
  max: number,
): {
  left: string;
  width: string;
  hidden: boolean;
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

function finiteOr(
  value: number | undefined,
  fallback: number,
): number {
  return value != null && Number.isFinite(Number(value))
    ? Number(value)
    : fallback;
}

function resolveSliderRange(
  startsFrom: SliderStartsFrom,
  min: number | undefined,
  max: number | undefined,
  defaultValue: number | number[] | undefined,
): { min: number; max: number; defaultValue: number | number[] } {
  const defaults =
    startsFrom === "center" ? SLIDER_CENTER_RANGE : SLIDER_SIDE_RANGE;
  const resolvedMin = finiteOr(min, defaults.min);
  const resolvedMax = finiteOr(max, defaults.max);
  let resolvedDefault: number | number[];
  if (Array.isArray(defaultValue)) {
    resolvedDefault = defaultValue.map((v) =>
      Number.isFinite(Number(v)) ? Number(v) : defaults.defaultValue,
    );
  } else {
    resolvedDefault = finiteOr(defaultValue, defaults.defaultValue);
  }
  return {
    min: resolvedMin,
    max: resolvedMax,
    defaultValue: resolvedDefault,
  };
}

/**
 * Tick label values for `showTicks`.
 * - Continuous (`step` null / non-positive): `[min, max]` only.
 * - Discrete: every `step` from min through the last on-grid value ≤ max.
 */
export function resolveSliderTickValues(
  min: number,
  max: number,
  step: number | null,
): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
  if (!(max > min)) return [min];
  if (step == null || !(step > 0)) return [min, max];
  const values: number[] = [];
  const n = Math.floor((max - min) / step + 1e-9);
  for (let i = 0; i <= n; i++) {
    const raw = min + i * step;
    const value =
      i === n && Math.abs(raw - max) <= Math.abs(step) * 1e-6 ? max : raw;
    values.push(Number(value.toPrecision(12)));
  }
  return values.length >= 2 ? values : [min, max];
}

function formatTickLabel(value: number): string {
  if (!Number.isFinite(value)) return "";
  if (Math.abs(value - Math.round(value)) < 1e-9) return String(Math.round(value));
  return String(Number(value.toPrecision(6)));
}

function SliderTicks({
  values,
  disabled,
  withControlOffsets,
}: {
  values: number[];
  disabled?: boolean;
  withControlOffsets: boolean;
}) {
  const count = values.length;
  return (
    <div aria-hidden className={styles.tickRow}>
      {withControlOffsets ? (
        <div
          style={{
            flexShrink: 0,
            width: SLIDER_CHROME.controlOffset,
            height: SLIDER_CHROME.stepperTickHeight,
          }}
        />
      ) : null}
      <div
        className={styles.tickInner}
        style={{
          height: `calc(${SLIDER_CHROME.stepperTickHeight} + ${SLIDER_CHROME.stepperTickGap} + ${SLIDER_CHROME.stepperLabelHeight})`,
        }}
      >
        {values.map((tickValue, i) => {
          const t = count > 1 ? i / (count - 1) : 0;
          const label = formatTickLabel(tickValue);
          return (
            <div
              key={`${label}-${i}`}
              className={styles.tick}
              style={{
                left: `calc(${SLIDER_CHROME.knobInset} + (100% - 2 * ${SLIDER_CHROME.knobInset}) * ${t})`,
                gap: SLIDER_CHROME.stepperTickGap,
              }}
            >
              <div
                className={`${styles.tickMark} ${disabled ? styles.tickMarkDisabled : ""}`}
                style={{ height: SLIDER_CHROME.stepperTickHeight }}
              />
              <span
                className={`${styles.tickLabel} ${disabled ? styles.tickLabelDisabled : ""}`}
                style={{ height: SLIDER_CHROME.stepperLabelHeight }}
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

const FOCUS_RING =
  "0 0 0 2px var(--background-neutral-primary), 0 0 0 4px var(--border-focused-primary)";

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
    showTicks = false,
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

  const resolvedStep: number | null =
    step == null ? null : Number(step) > 0 ? Number(step) : 1;
  const tickValues = showTicks
    ? resolveSliderTickValues(min, max, resolvedStep)
    : null;
  const nudgeStep =
    resolvedStep == null || !(resolvedStep > 0)
      ? Math.max((max - min) / 100, Number.EPSILON)
      : resolvedStep;

  const commit = (event: Event, next: number | number[], activeThumb = 0) => {
    if (valueProp === undefined) setUncontrolled(next);
    onChange?.(event, next, activeThumb);
  };

  const nudge = (delta: number) => {
    if (disabled) return;
    const next = Math.min(
      Number(max),
      Math.max(Number(min), Number(numeric) + delta * nudgeStep),
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
    (typeof numeric === "number" && Number.isFinite(numeric)
      ? numeric.toFixed(1)
      : String(Number.isFinite(Number(numeric)) ? Number(numeric) : min));

  return (
    <div
      className={styles.wrapper}
      style={{
        gap: SLIDER_CHROME.stackGap,
        width: resolvedWidth,
      }}
    >
      {showLabelRow && (label != null || showDisplayValue) ? (
        <div className={styles.labelRow}>
          <div
            className={styles.labelInner}
            style={{
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
                style={{ fontWeight: "var(--font-weight-semibold)" }}
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
              className={styles.helperRow}
              style={{
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

      <div
        className={styles.barSection}
        style={{ gap: SLIDER_CHROME.stackGap }}
      >
        <div
          className={styles.barRow}
          style={{
            gap: SLIDER_CHROME.controlGap,
            height: SLIDER_CHROME.trackHeight,
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
          <MuiSlider
            ref={ref}
            value={value}
            min={min}
            max={max}
            step={resolvedStep}
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
                ...(centerTrack
                  ? {
                      left: `${centerTrack.left} !important`,
                      width: `${centerTrack.hidden ? "0%" : centerTrack.width} !important`,
                      visibility: centerTrack.hidden
                        ? ("hidden" as const)
                        : ("visible" as const),
                    }
                  : {}),
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
        {tickValues ? (
          <SliderTicks
            values={tickValues}
            disabled={disabled}
            withControlOffsets={showControls}
          />
        ) : null}
      </div>
    </div>
  );
});
