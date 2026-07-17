import { jsxs, jsx } from 'react/jsx-runtime';
import MuiSlider from '@mui/material/Slider';
import { forwardRef, useId, useState } from 'react';
import { Button } from './Button.js';
import { FaIcon } from '../icons/FaIcon.js';
import { FIELD_WRAPPER_SIZE, SLIDER_CHROME, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

const SLIDER_DEFAULT_WIDTH = 300;
const SLIDER_SIDE_RANGE = {
  min: 0,
  max: 100,
  defaultValue: 50
};
const SLIDER_CENTER_RANGE = {
  min: -100,
  max: 100,
  defaultValue: 0
};
function resolveSliderWidth(width, fullWidth) {
  if (fullWidth) return "100%";
  if (width == null) return SLIDER_DEFAULT_WIDTH;
  return typeof width === "number" ? `${width}px` : width;
}
function resolveIconName(name) {
  if (!name || name === "smile") return "face-smile";
  return name;
}
function resolveCenterTrackGeometry(value, min, max) {
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
      extendLeft: false
    };
  }
  if (t > tOrigin) {
    return {
      left: `${tOrigin * 100}%`,
      width: `${(t - tOrigin) * 100}%`,
      hidden: false,
      extendLeft: false
    };
  }
  return {
    left: `${t * 100}%`,
    width: `${(tOrigin - t) * 100}%`,
    hidden: false,
    extendLeft: t < 1e-6
  };
}
function resolveSliderRange(startsFrom, min, max, defaultValue) {
  const defaults = startsFrom === "center" ? SLIDER_CENTER_RANGE : SLIDER_SIDE_RANGE;
  return {
    min: min ?? defaults.min,
    max: max ?? defaults.max,
    defaultValue: defaultValue ?? defaults.defaultValue
  };
}
function SliderStepper({
  stepCount,
  disabled,
  withControlOffsets
}) {
  const labels = Array.from({ length: stepCount }, (_, i) => String(i + 1));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "aria-hidden": true,
      style: {
        display: "flex",
        alignItems: "flex-start",
        width: "100%"
      },
      children: [
        withControlOffsets ? /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              flexShrink: 0,
              width: SLIDER_CHROME.controlOffset,
              height: SLIDER_CHROME.stepperTickHeight
            }
          }
        ) : null,
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "relative",
              flex: 1,
              minWidth: 0,
              height: `calc(${SLIDER_CHROME.stepperTickHeight} + ${SLIDER_CHROME.stepperTickGap} + ${SLIDER_CHROME.stepperLabelHeight})`
            },
            children: labels.map((label, i) => {
              const t = i / (stepCount - 1);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: `calc(${SLIDER_CHROME.knobInset} + (100% - 2 * ${SLIDER_CHROME.knobInset}) * ${t})`,
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: SLIDER_CHROME.stepperTickGap
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          width: 0,
                          height: SLIDER_CHROME.stepperTickHeight,
                          borderLeft: `1px solid ${disabled ? "var(--border-disabled-neutral)" : "var(--border-neutral-secondary)"}`
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: SLIDER_CHROME.stepperLabelHeight,
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-body-xxs)",
                          lineHeight: "var(--leading-body-xxs)",
                          fontWeight: "var(--font-weight-normal)",
                          color: disabled ? "var(--text-disabled-neutral)" : "var(--text-neutral-primary)",
                          whiteSpace: "nowrap"
                        },
                        children: label
                      }
                    )
                  ]
                },
                label
              );
            })
          }
        ),
        withControlOffsets ? /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              flexShrink: 0,
              width: SLIDER_CHROME.controlOffset,
              height: SLIDER_CHROME.stepperTickHeight
            }
          }
        ) : null
      ]
    }
  );
}
const Slider = forwardRef(function Slider2({
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
}, ref) {
  const labelId = useId();
  const helperId = useId();
  const type = FIELD_WRAPPER_SIZE[size];
  const resolvedWidth = resolveSliderWidth(width, fullWidth);
  const { min, max, defaultValue } = resolveSliderRange(
    startsFrom,
    minProp,
    maxProp,
    defaultValueProp
  );
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue
  );
  const value = valueProp ?? uncontrolled;
  const numeric = Array.isArray(value) ? value[0] ?? min : value;
  const isError = sentiment === "error" && !disabled;
  const showHelperRow = showHelper && helperText != null;
  const commit = (event, next, activeThumb = 0) => {
    if (valueProp === void 0) setUncontrolled(next);
    onChange?.(event, next, activeThumb);
  };
  const nudge = (delta) => {
    if (disabled) return;
    const stepNum = Number(step) || 1;
    const next = Math.min(
      Number(max),
      Math.max(Number(min), Number(numeric) + delta * stepNum)
    );
    if (valueProp === void 0) setUncontrolled(next);
    onChange?.({}, next, 0);
  };
  const fillColor = isError ? "var(--background-error-primary)" : disabled ? "var(--background-disabled-neutral)" : "var(--background-selected-primary)";
  const railBorder = isError ? "var(--border-error-primary)" : disabled ? "var(--border-disabled-neutral)" : "var(--border-neutral-secondary)";
  const thumbBorder = isError ? "var(--border-error-primary)" : disabled ? "var(--border-disabled-neutral)" : "var(--border-neutral-solid)";
  const centerTrack = startsFrom === "center" ? resolveCenterTrackGeometry(Number(numeric), Number(min), Number(max)) : null;
  const resolvedDisplay = displayValue ?? (typeof numeric === "number" ? numeric.toFixed(1) : String(numeric));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: SLIDER_CHROME.stackGap,
        width: resolvedWidth,
        maxWidth: "100%",
        boxSizing: "border-box",
        fontFamily: "var(--font-body)"
      },
      children: [
        showLabelRow && (label != null || showDisplayValue) ? /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              width: "100%"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    color: disabled ? "var(--text-disabled-neutral)" : isError ? "var(--text-error-primary)" : "var(--text-neutral-primary)",
                    fontSize: type.labelFontSize,
                    lineHeight: type.labelLineHeight
                  },
                  children: [
                    label != null ? /* @__PURE__ */ jsx(
                      "span",
                      {
                        id: labelId,
                        style: {
                          fontWeight: "var(--font-weight-semibold)"
                        },
                        children: label
                      }
                    ) : /* @__PURE__ */ jsx("span", {}),
                    showDisplayValue ? /* @__PURE__ */ jsx("span", { style: { fontWeight: "var(--font-weight-normal)" }, children: resolvedDisplay }) : null
                  ]
                }
              ),
              showHelperRow ? /* @__PURE__ */ jsxs(
                "div",
                {
                  id: helperId,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: type.helperGap,
                    paddingBottom: SLIDER_CHROME.helperPaddingBottom,
                    color: disabled ? "var(--text-disabled-neutral)" : isError ? "var(--text-error-primary)" : "var(--text-neutral-tertiary)",
                    fontSize: type.helperFontSize,
                    lineHeight: type.helperLineHeight
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      FaIcon,
                      {
                        name: isError ? "circle-xmark" : resolveIconName(helperIconName),
                        fontSize: type.helperIconPx
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: helperText })
                  ]
                }
              ) : null
            ]
          }
        ) : null,
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: SLIDER_CHROME.stackGap,
              width: "100%"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: SLIDER_CHROME.controlGap,
                    width: "100%",
                    // Figma sliderBar is ~track tall; ± buttons (24) and knob (16) overflow into stackGap.
                    height: SLIDER_CHROME.trackHeight,
                    overflow: "visible"
                  },
                  children: [
                    showControls ? /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outlined",
                        color: "secondary",
                        size: "extraSmall",
                        iconOnly: true,
                        startIconName: "minus",
                        "aria-label": "Decrease",
                        disabled,
                        onClick: () => nudge(-1),
                        sx: { flexShrink: 0 }
                      }
                    ) : null,
                    /* @__PURE__ */ jsx(
                      MuiSlider,
                      {
                        ref,
                        value,
                        min,
                        max,
                        step,
                        disabled,
                        marks: false,
                        onChange: (e, v) => commit(e, v),
                        "aria-labelledby": label && showLabelRow ? labelId : void 0,
                        "aria-describedby": showHelperRow ? helperId : void 0,
                        "aria-label": ariaLabel,
                        sx: {
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
                            width: `calc(100% + 2 * ${SLIDER_CHROME.knobInset})`
                          },
                          "& .MuiSlider-track": {
                            height: SLIDER_CHROME.trackHeight,
                            border: "none",
                            backgroundColor: fillColor,
                            borderRadius: SLIDER_CHROME.barRadius,
                            // Center fill: override MUI’s min→value inline left/width.
                            ...centerTrack ? {
                              left: `${centerTrack.left} !important`,
                              width: `${centerTrack.hidden ? "0%" : centerTrack.width} !important`,
                              visibility: centerTrack.hidden ? "hidden" : "visible"
                            } : {},
                            // Extend fill into rail overhang when the filled segment reaches
                            // the left edge of the inset thumb-travel box.
                            ...startsFrom === "side" && Number(numeric) > Number(min) || centerTrack?.extendLeft ? {
                              boxShadow: `-${SLIDER_CHROME.knobInset} 0 0 0 ${fillColor}`
                            } : { boxShadow: "none" }
                          },
                          "& .MuiSlider-thumb": {
                            width: SLIDER_CHROME.knob,
                            height: SLIDER_CHROME.knob,
                            backgroundColor: "var(--background-neutral-primary)",
                            border: `2px solid ${thumbBorder}`,
                            boxShadow: "none",
                            transition: TRANSITION_COLORS,
                            "&::before": {
                              boxShadow: "none"
                            },
                            "&:hover": {
                              backgroundColor: "var(--background-neutral-tertiary)",
                              boxShadow: "none"
                            },
                            "&:hover::before": {
                              boxShadow: "none"
                            },
                            "&:active, &.Mui-active": {
                              backgroundColor: "var(--background-neutral-tertiary)",
                              boxShadow: "0 2px 2px 0 rgba(0,0,0,0.07), 0 4px 7px 0 rgba(0,0,0,0.07)"
                            },
                            "&.Mui-focusVisible": {
                              backgroundColor: "var(--background-neutral-tertiary)",
                              boxShadow: FOCUS_RING
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "var(--background-neutral-primary)",
                              border: "2px solid var(--border-disabled-neutral)"
                            }
                          },
                          ...sx ?? {}
                        },
                        ...rest
                      }
                    ),
                    showControls ? /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outlined",
                        color: "secondary",
                        size: "extraSmall",
                        iconOnly: true,
                        startIconName: "plus",
                        "aria-label": "Increase",
                        disabled,
                        onClick: () => nudge(1),
                        sx: { flexShrink: 0 }
                      }
                    ) : null
                  ]
                }
              ),
              showStepper ? /* @__PURE__ */ jsx(
                SliderStepper,
                {
                  stepCount,
                  disabled,
                  withControlOffsets: showControls
                }
              ) : null
            ]
          }
        )
      ]
    }
  );
});

export { SLIDER_CENTER_RANGE, SLIDER_DEFAULT_WIDTH, SLIDER_SIDE_RANGE, Slider };
//# sourceMappingURL=Slider.js.map
//# sourceMappingURL=Slider.js.map