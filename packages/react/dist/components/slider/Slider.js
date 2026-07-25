import { jsxs as p, jsx as s } from "react/jsx-runtime";
import oe from "@mui/material/Slider";
import { forwardRef as le, useId as G, useState as se } from "react";
import { Button as z } from "../button/Button.js";
import { FaIcon as ce } from "../../icons/FaIcon.js";
import { SLIDER_CHROME as r, FIELD_WRAPPER_SIZE as ue, TRANSITION_COLORS as de } from "../../shared/controlSize.js";
import c from "./slider.module.scss.js";
const A = 300, be = {
  min: 0,
  max: 100,
  defaultValue: 50
}, me = {
  min: -100,
  max: 100,
  defaultValue: 0
};
function he(e, i) {
  return i ? "100%" : e == null ? A : typeof e == "number" ? `${e}px` : e;
}
function fe(e) {
  return !e || e === "smile" ? "face-smile" : e;
}
function pe(e, i, l) {
  const t = Number(i), o = Number(l), a = o - t;
  if (!(a > 0))
    return { left: "50%", width: "0%", hidden: !0, extendLeft: !1 };
  const u = t <= 0 && o >= 0 ? 0 : (t + o) / 2, n = (Number(e) - t) / a, d = (u - t) / a;
  return Math.abs(n - d) < 1e-6 ? {
    left: `${d * 100}%`,
    width: "0%",
    hidden: !0,
    extendLeft: !1
  } : n > d ? {
    left: `${d * 100}%`,
    width: `${(n - d) * 100}%`,
    hidden: !1,
    extendLeft: !1
  } : {
    left: `${n * 100}%`,
    width: `${(d - n) * 100}%`,
    hidden: !1,
    extendLeft: n < 1e-6
  };
}
function L(e, i) {
  return e != null && Number.isFinite(Number(e)) ? Number(e) : i;
}
function ge(e, i, l, t) {
  const o = e === "center" ? me : be, a = L(i, o.min), u = L(l, o.max);
  let n;
  return Array.isArray(t) ? n = t.map(
    (d) => Number.isFinite(Number(d)) ? Number(d) : o.defaultValue
  ) : n = L(t, o.defaultValue), {
    min: a,
    max: u,
    defaultValue: n
  };
}
function ke(e, i, l) {
  if (!Number.isFinite(e) || !Number.isFinite(i)) return [];
  if (!(i > e)) return [e];
  if (l == null || !(l > 0)) return [e, i];
  const t = [], o = Math.floor((i - e) / l + 1e-9);
  for (let a = 0; a <= o; a++) {
    const u = e + a * l, n = a === o && Math.abs(u - i) <= Math.abs(l) * 1e-6 ? i : u;
    t.push(Number(n.toPrecision(12)));
  }
  return t.length >= 2 ? t : [e, i];
}
function ve(e) {
  return Number.isFinite(e) ? Math.abs(e - Math.round(e)) < 1e-9 ? String(Math.round(e)) : String(Number(e.toPrecision(6))) : "";
}
function xe({
  values: e,
  disabled: i,
  withControlOffsets: l
}) {
  const t = e.length;
  return /* @__PURE__ */ p("div", { "aria-hidden": !0, className: c.tickRow, children: [
    l ? /* @__PURE__ */ s(
      "div",
      {
        style: {
          flexShrink: 0,
          width: r.controlOffset,
          height: r.stepperTickHeight
        }
      }
    ) : null,
    /* @__PURE__ */ s(
      "div",
      {
        className: c.tickInner,
        style: {
          height: `calc(${r.stepperTickHeight} + ${r.stepperTickGap} + ${r.stepperLabelHeight})`
        },
        children: e.map((o, a) => {
          const u = t > 1 ? a / (t - 1) : 0, n = ve(o);
          return /* @__PURE__ */ p(
            "div",
            {
              className: c.tick,
              style: {
                left: `calc(${r.knobInset} + (100% - 2 * ${r.knobInset}) * ${u})`,
                gap: r.stepperTickGap
              },
              children: [
                /* @__PURE__ */ s(
                  "div",
                  {
                    className: `${c.tickMark} ${i ? c.tickMarkDisabled : ""}`,
                    style: { height: r.stepperTickHeight }
                  }
                ),
                /* @__PURE__ */ s(
                  "span",
                  {
                    className: `${c.tickLabel} ${i ? c.tickLabelDisabled : ""}`,
                    style: { height: r.stepperLabelHeight },
                    children: n
                  }
                )
              ]
            },
            `${n}-${a}`
          );
        })
      }
    ),
    l ? /* @__PURE__ */ s(
      "div",
      {
        style: {
          flexShrink: 0,
          width: r.controlOffset,
          height: r.stepperTickHeight
        }
      }
    ) : null
  ] });
}
const Ne = "0 0 0 2px var(--background-neutral-primary), 0 0 0 4px var(--border-focused-primary)", Le = le(function({
  size: i = "medium",
  sentiment: l = "default",
  label: t,
  displayValue: o,
  showDisplayValue: a = !0,
  showLabelRow: u = !0,
  helperText: n,
  helperIconName: d = "face-smile",
  showHelper: V = !0,
  showControls: $ = !1,
  showTicks: W = !1,
  startsFrom: w = "side",
  width: B = A,
  fullWidth: C = !1,
  value: R,
  defaultValue: P,
  min: U,
  max: j,
  step: M = 1,
  disabled: b,
  onChange: k,
  "aria-label": Z,
  sx: q,
  ...J
}, K) {
  const H = G(), E = G(), v = ue[i], Q = he(B, C), { min: m, max: N, defaultValue: X } = ge(
    w,
    U,
    j,
    P
  ), [Y, T] = se(
    X
  ), I = R ?? Y, h = Array.isArray(I) ? I[0] ?? m : I, x = l === "error" && !b, D = V && n != null, S = M == null ? null : Number(M) > 0 ? Number(M) : 1, F = W ? ke(m, N, S) : null, ee = S == null || !(S > 0) ? Math.max((N - m) / 100, Number.EPSILON) : S, re = (y, g, ae = 0) => {
    R === void 0 && T(g), k == null || k(y, g, ae);
  }, O = (y) => {
    if (b) return;
    const g = Math.min(
      Number(N),
      Math.max(Number(m), Number(h) + y * ee)
    );
    R === void 0 && T(g), k == null || k({}, g, 0);
  }, _ = x ? "var(--background-error-primary)" : b ? "var(--background-disabled-neutral)" : "var(--background-selected-primary)", te = x ? "var(--border-error-primary)" : b ? "var(--border-disabled-neutral)" : "var(--border-neutral-secondary)", ie = x ? "var(--border-error-primary)" : b ? "var(--border-disabled-neutral)" : "var(--border-neutral-solid)", f = w === "center" ? pe(Number(h), Number(m), Number(N)) : null, ne = o ?? (typeof h == "number" && Number.isFinite(h) ? h.toFixed(1) : String(Number.isFinite(Number(h)) ? Number(h) : m));
  return /* @__PURE__ */ p(
    "div",
    {
      className: c.wrapper,
      style: {
        gap: r.stackGap,
        width: Q
      },
      children: [
        u && (t != null || a) ? /* @__PURE__ */ p("div", { className: c.labelRow, children: [
          /* @__PURE__ */ p(
            "div",
            {
              className: c.labelInner,
              style: {
                color: b ? "var(--text-disabled-neutral)" : x ? "var(--text-error-primary)" : "var(--text-neutral-primary)",
                fontSize: v.labelFontSize,
                lineHeight: v.labelLineHeight
              },
              children: [
                t != null ? /* @__PURE__ */ s(
                  "span",
                  {
                    id: H,
                    style: { fontWeight: "var(--font-weight-semibold)" },
                    children: t
                  }
                ) : /* @__PURE__ */ s("span", {}),
                a ? /* @__PURE__ */ s("span", { style: { fontWeight: "var(--font-weight-normal)" }, children: ne }) : null
              ]
            }
          ),
          D ? /* @__PURE__ */ p(
            "div",
            {
              id: E,
              className: c.helperRow,
              style: {
                gap: v.helperGap,
                paddingBottom: r.helperPaddingBottom,
                color: b ? "var(--text-disabled-neutral)" : x ? "var(--text-error-primary)" : "var(--text-neutral-tertiary)",
                fontSize: v.helperFontSize,
                lineHeight: v.helperLineHeight
              },
              children: [
                /* @__PURE__ */ s(
                  ce,
                  {
                    name: x ? "circle-xmark" : fe(d),
                    fontSize: v.helperIconPx
                  }
                ),
                /* @__PURE__ */ s("span", { children: n })
              ]
            }
          ) : null
        ] }) : null,
        /* @__PURE__ */ p(
          "div",
          {
            className: c.barSection,
            style: { gap: r.stackGap },
            children: [
              /* @__PURE__ */ p(
                "div",
                {
                  className: c.barRow,
                  style: {
                    gap: r.controlGap,
                    height: r.trackHeight
                  },
                  children: [
                    $ ? /* @__PURE__ */ s(
                      z,
                      {
                        variant: "outlined",
                        color: "secondary",
                        size: "extraSmall",
                        iconOnly: !0,
                        startIconName: "minus",
                        "aria-label": "Decrease",
                        disabled: b,
                        onClick: () => O(-1),
                        sx: { flexShrink: 0 }
                      }
                    ) : null,
                    /* @__PURE__ */ s(
                      oe,
                      {
                        ref: K,
                        value: I,
                        min: m,
                        max: N,
                        step: S,
                        disabled: b,
                        marks: !1,
                        onChange: (y, g) => re(y, g),
                        "aria-labelledby": t && u ? H : void 0,
                        "aria-describedby": D ? E : void 0,
                        "aria-label": Z,
                        sx: {
                          color: "transparent",
                          height: r.trackHeight,
                          padding: 0,
                          flex: 1,
                          minWidth: 0,
                          marginInline: r.knobInset,
                          overflow: "visible",
                          boxSizing: "border-box",
                          "& .MuiSlider-rail": {
                            height: r.trackHeight,
                            opacity: 1,
                            backgroundColor: "var(--background-neutral-primary)",
                            border: `1px solid ${te}`,
                            borderRadius: r.barRadius,
                            boxSizing: "border-box",
                            left: `-${r.knobInset}`,
                            width: `calc(100% + 2 * ${r.knobInset})`
                          },
                          "& .MuiSlider-track": {
                            height: r.trackHeight,
                            border: "none",
                            backgroundColor: _,
                            borderRadius: r.barRadius,
                            ...f ? {
                              left: `${f.left} !important`,
                              width: `${f.hidden ? "0%" : f.width} !important`,
                              visibility: f.hidden ? "hidden" : "visible"
                            } : {},
                            ...w === "side" && Number(h) > Number(m) || f != null && f.extendLeft ? {
                              boxShadow: `-${r.knobInset} 0 0 0 ${_}`
                            } : { boxShadow: "none" }
                          },
                          "& .MuiSlider-thumb": {
                            width: r.knob,
                            height: r.knob,
                            backgroundColor: "var(--background-neutral-primary)",
                            border: `2px solid ${ie}`,
                            boxShadow: "none",
                            transition: de,
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
                              boxShadow: Ne
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "var(--background-neutral-primary)",
                              border: "2px solid var(--border-disabled-neutral)"
                            }
                          },
                          ...q ?? {}
                        },
                        ...J
                      }
                    ),
                    $ ? /* @__PURE__ */ s(
                      z,
                      {
                        variant: "outlined",
                        color: "secondary",
                        size: "extraSmall",
                        iconOnly: !0,
                        startIconName: "plus",
                        "aria-label": "Increase",
                        disabled: b,
                        onClick: () => O(1),
                        sx: { flexShrink: 0 }
                      }
                    ) : null
                  ]
                }
              ),
              F ? /* @__PURE__ */ s(
                xe,
                {
                  values: F,
                  disabled: b,
                  withControlOffsets: $
                }
              ) : null
            ]
          }
        )
      ]
    }
  );
});
export {
  me as SLIDER_CENTER_RANGE,
  A as SLIDER_DEFAULT_WIDTH,
  be as SLIDER_SIDE_RANGE,
  Le as Slider,
  ke as resolveSliderTickValues
};
//# sourceMappingURL=Slider.js.map
