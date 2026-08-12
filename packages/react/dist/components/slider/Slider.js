import { jsxs as p, jsx as s } from "react/jsx-runtime";
import se from "@mui/material/Slider";
import { forwardRef as ue, useId as A, useState as de } from "react";
import { Button as V } from "../button/Button.js";
import { FaIcon as ce } from "../../icons/FaIcon.js";
import { SLIDER_CHROME as r, FIELD_WRAPPER_SIZE as be, TRANSITION_COLORS as me } from "../../shared/controlSize.js";
import d from "./slider.module.scss.js";
const W = 300, he = {
  min: 0,
  max: 100,
  defaultValue: 50
}, fe = {
  min: -100,
  max: 100,
  defaultValue: 0
};
function pe(e, i) {
  return i ? "100%" : e == null ? W : typeof e == "number" ? `${e}px` : e;
}
function ge(e) {
  return !e || e === "smile" ? "face-smile" : e;
}
function ve(e, i, l) {
  const t = Number(i), a = Number(l), o = a - t;
  if (!(o > 0))
    return { left: "50%", width: "0%", hidden: !0, extendLeft: !1 };
  const c = t <= 0 && a >= 0 ? 0 : (t + a) / 2, n = (Number(e) - t) / o, u = (c - t) / o;
  return Math.abs(n - u) < 1e-6 ? {
    left: `${u * 100}%`,
    width: "0%",
    hidden: !0,
    extendLeft: !1
  } : n > u ? {
    left: `${u * 100}%`,
    width: `${(n - u) * 100}%`,
    hidden: !1,
    extendLeft: !1
  } : {
    left: `${n * 100}%`,
    width: `${(u - n) * 100}%`,
    hidden: !1,
    extendLeft: n < 1e-6
  };
}
function L(e, i) {
  return e != null && Number.isFinite(Number(e)) ? Number(e) : i;
}
function ke(e, i, l, t) {
  const a = e === "center" ? fe : he, o = L(i, a.min), c = L(l, a.max);
  let n;
  return Array.isArray(t) ? n = t.map(
    (u) => Number.isFinite(Number(u)) ? Number(u) : a.defaultValue
  ) : n = L(t, a.defaultValue), {
    min: o,
    max: c,
    defaultValue: n
  };
}
function xe(e, i, l) {
  if (!Number.isFinite(e) || !Number.isFinite(i)) return [];
  if (!(i > e)) return [e];
  if (l == null || !(l > 0)) return [e, i];
  const t = [], a = Math.floor((i - e) / l + 1e-9);
  for (let o = 0; o <= a; o++) {
    const c = e + o * l, n = o === a && Math.abs(c - i) <= Math.abs(l) * 1e-6 ? i : c;
    t.push(Number(n.toPrecision(12)));
  }
  return t.length >= 2 ? t : [e, i];
}
function Ne(e) {
  return Number.isFinite(e) ? Math.abs(e - Math.round(e)) < 1e-9 ? String(Math.round(e)) : String(Number(e.toPrecision(6))) : "";
}
function Se({
  values: e,
  disabled: i,
  withControlOffsets: l
}) {
  const t = e.length;
  return /* @__PURE__ */ p("div", { "aria-hidden": !0, className: d.tickRow, children: [
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
        className: d.tickInner,
        style: {
          height: `calc(${r.stepperTickHeight} + ${r.stepperTickGap} + ${r.stepperLabelHeight})`
        },
        children: e.map((a, o) => {
          const c = t > 1 ? o / (t - 1) : 0, n = Ne(a);
          return /* @__PURE__ */ p(
            "div",
            {
              className: d.tick,
              style: {
                left: `calc(${r.knobInset} + (100% - 2 * ${r.knobInset}) * ${c})`,
                gap: r.stepperTickGap
              },
              children: [
                /* @__PURE__ */ s(
                  "div",
                  {
                    className: `${d.tickMark} ${i ? d.tickMarkDisabled : ""}`,
                    style: { height: r.stepperTickHeight }
                  }
                ),
                /* @__PURE__ */ s(
                  "span",
                  {
                    className: `${d.tickLabel} ${i ? d.tickLabelDisabled : ""}`,
                    style: { height: r.stepperLabelHeight },
                    children: n
                  }
                )
              ]
            },
            `${n}-${o}`
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
const ye = "0 0 0 2px var(--background-neutral-primary), 0 0 0 4px var(--border-focused-primary)", Ee = ue(function({
  size: i = "medium",
  sentiment: l = "default",
  label: t,
  displayValue: a,
  showDisplayValue: o = !0,
  showLabelRow: c = !0,
  helperText: n,
  helperIconName: u,
  showHelper: B = !0,
  showControls: $ = !1,
  showTicks: C = !1,
  startsFrom: R = "side",
  width: P = W,
  fullWidth: U = !1,
  value: w,
  defaultValue: j,
  min: Z,
  max: q,
  step: M = 1,
  disabled: b,
  onChange: v,
  "aria-label": J,
  sx: K,
  ...Q
}, X) {
  const H = A(), E = A(), k = be[i], Y = pe(P, U), { min: m, max: N, defaultValue: ee } = ke(
    R,
    Z,
    q,
    j
  ), [re, T] = de(
    ee
  ), I = w ?? re, h = Array.isArray(I) ? I[0] ?? m : I, x = l === "error" && !b, D = B && n != null, F = u != null && String(u).trim() !== "" ? u : void 0, O = x ? "circle-xmark" : F ? ge(F) : void 0, S = M == null ? null : Number(M) > 0 ? Number(M) : 1, _ = C ? xe(m, N, S) : null, te = S == null || !(S > 0) ? Math.max((N - m) / 100, Number.EPSILON) : S, ie = (y, g, le = 0) => {
    w === void 0 && T(g), v == null || v(y, g, le);
  }, G = (y) => {
    if (b) return;
    const g = Math.min(
      Number(N),
      Math.max(Number(m), Number(h) + y * te)
    );
    w === void 0 && T(g), v == null || v({}, g, 0);
  }, z = x ? "var(--background-error-primary)" : b ? "var(--background-disabled-neutral)" : "var(--background-selected-primary)", ne = x ? "var(--border-error-primary)" : b ? "var(--border-disabled-neutral)" : "var(--border-neutral-secondary)", oe = x ? "var(--border-error-primary)" : b ? "var(--border-disabled-neutral)" : "var(--border-neutral-solid)", f = R === "center" ? ve(Number(h), Number(m), Number(N)) : null, ae = a ?? (typeof h == "number" && Number.isFinite(h) ? h.toFixed(1) : String(Number.isFinite(Number(h)) ? Number(h) : m));
  return /* @__PURE__ */ p(
    "div",
    {
      className: d.wrapper,
      style: {
        gap: r.stackGap,
        width: Y
      },
      children: [
        c && (t != null || o) ? /* @__PURE__ */ p("div", { className: d.labelRow, children: [
          /* @__PURE__ */ p(
            "div",
            {
              className: d.labelInner,
              style: {
                color: b ? "var(--text-disabled-neutral)" : x ? "var(--text-error-primary)" : "var(--text-neutral-primary)",
                fontSize: k.labelFontSize,
                lineHeight: k.labelLineHeight
              },
              children: [
                t != null ? /* @__PURE__ */ s(
                  "span",
                  {
                    id: H,
                    style: { fontWeight: "var(--font-weight-semi-bold)" },
                    children: t
                  }
                ) : /* @__PURE__ */ s("span", {}),
                o ? /* @__PURE__ */ s("span", { style: { fontWeight: "var(--font-weight-regular)" }, children: ae }) : null
              ]
            }
          ),
          D ? /* @__PURE__ */ p(
            "div",
            {
              id: E,
              className: d.helperRow,
              style: {
                gap: k.helperGap,
                paddingBottom: r.helperPaddingBottom,
                color: b ? "var(--text-disabled-neutral)" : x ? "var(--text-error-primary)" : "var(--text-neutral-tertiary)",
                fontSize: k.helperFontSize,
                lineHeight: k.helperLineHeight
              },
              children: [
                O != null ? /* @__PURE__ */ s(
                  ce,
                  {
                    name: O,
                    fontSize: k.helperIconPx
                  }
                ) : null,
                /* @__PURE__ */ s("span", { children: n })
              ]
            }
          ) : null
        ] }) : null,
        /* @__PURE__ */ p(
          "div",
          {
            className: d.barSection,
            style: { gap: r.stackGap },
            children: [
              /* @__PURE__ */ p(
                "div",
                {
                  className: d.barRow,
                  style: {
                    gap: r.controlGap,
                    height: r.trackHeight
                  },
                  children: [
                    $ ? /* @__PURE__ */ s(
                      V,
                      {
                        variant: "outlined",
                        color: "secondary",
                        size: "extraSmall",
                        iconOnly: !0,
                        startIconName: "minus",
                        "aria-label": "Decrease",
                        disabled: b,
                        onClick: () => G(-1),
                        sx: { flexShrink: 0 }
                      }
                    ) : null,
                    /* @__PURE__ */ s(
                      se,
                      {
                        ref: X,
                        value: I,
                        min: m,
                        max: N,
                        step: S,
                        disabled: b,
                        marks: !1,
                        onChange: (y, g) => ie(y, g),
                        "aria-labelledby": t && c ? H : void 0,
                        "aria-describedby": D ? E : void 0,
                        "aria-label": J,
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
                            border: `1px solid ${ne}`,
                            borderRadius: r.barRadius,
                            boxSizing: "border-box",
                            left: `-${r.knobInset}`,
                            width: `calc(100% + 2 * ${r.knobInset})`
                          },
                          "& .MuiSlider-track": {
                            height: r.trackHeight,
                            border: "none",
                            backgroundColor: z,
                            borderRadius: r.barRadius,
                            ...f ? {
                              left: `${f.left} !important`,
                              width: `${f.hidden ? "0%" : f.width} !important`,
                              visibility: f.hidden ? "hidden" : "visible"
                            } : {},
                            ...R === "side" && Number(h) > Number(m) || f != null && f.extendLeft ? {
                              boxShadow: `-${r.knobInset} 0 0 0 ${z}`
                            } : { boxShadow: "none" }
                          },
                          "& .MuiSlider-thumb": {
                            width: r.knob,
                            height: r.knob,
                            backgroundColor: "var(--background-neutral-primary)",
                            border: `2px solid ${oe}`,
                            boxShadow: "none",
                            transition: me,
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
                              boxShadow: ye
                            },
                            "&.Mui-disabled": {
                              backgroundColor: "var(--background-neutral-primary)",
                              border: "2px solid var(--border-disabled-neutral)"
                            }
                          },
                          ...K ?? {}
                        },
                        ...Q
                      }
                    ),
                    $ ? /* @__PURE__ */ s(
                      V,
                      {
                        variant: "outlined",
                        color: "secondary",
                        size: "extraSmall",
                        iconOnly: !0,
                        startIconName: "plus",
                        "aria-label": "Increase",
                        disabled: b,
                        onClick: () => G(1),
                        sx: { flexShrink: 0 }
                      }
                    ) : null
                  ]
                }
              ),
              _ ? /* @__PURE__ */ s(
                Se,
                {
                  values: _,
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
  fe as SLIDER_CENTER_RANGE,
  W as SLIDER_DEFAULT_WIDTH,
  he as SLIDER_SIDE_RANGE,
  Ee as Slider,
  xe as resolveSliderTickValues
};
//# sourceMappingURL=Slider.js.map
