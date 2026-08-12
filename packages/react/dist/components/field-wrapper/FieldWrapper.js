import { jsx as r, jsxs as f } from "react/jsx-runtime";
import { createContext as E, forwardRef as k, useId as P, useMemo as j, useContext as z } from "react";
import { FaIcon as L } from "../../icons/FaIcon.js";
import { FIELD_WRAPPER_SIZE as N } from "../../shared/controlSize.js";
const m = E(null);
function A() {
  return z(m);
}
const R = {
  success: "circle-check",
  warning: "circle-exclamation",
  error: "circle-xmark"
};
function _(x, i) {
  if (i)
    return {
      text: "var(--text-disabled-neutral)",
      icon: "var(--text-disabled-neutral)"
    };
  switch (x) {
    case "success":
      return {
        text: "var(--text-success-primary-fixed)",
        icon: "var(--text-success-primary-fixed)"
      };
    case "error":
      return {
        text: "var(--text-error-primary-fixed)",
        icon: "var(--text-error-primary-fixed)"
      };
    case "warning":
      return {
        text: "var(--text-neutral-tertiary)",
        icon: "var(--text-warning-primary-fixed)"
      };
    default:
      return {
        text: "var(--text-neutral-tertiary)",
        icon: "var(--text-neutral-tertiary)"
      };
  }
}
const G = k(
  function({
    size: i = "medium",
    sentiment: t = "default",
    label: o,
    required: y = !1,
    helperText: p,
    helperIconName: c,
    showHelper: v = !0,
    htmlFor: g,
    disabled: l = !1,
    children: I,
    className: w,
    style: F
  }, S) {
    const C = P(), n = g ?? `cads-field-${C}`, d = `${n}-label`, a = `${n}-helper`, e = N[i], s = _(t, l), b = l ? "var(--text-disabled-neutral)" : "var(--text-neutral-primary)", u = !!p && (t !== "default" ? !0 : v), H = j(
      () => ({
        size: i,
        sentiment: t,
        disabled: l,
        labelId: d,
        helperId: a,
        controlId: n,
        describedBy: u ? a : void 0,
        error: t === "error"
      }),
      [
        i,
        t,
        l,
        d,
        a,
        n,
        u
      ]
    ), W = c != null && String(c).trim() !== "" ? c : void 0, h = t === "default" ? W : R[t];
    return /* @__PURE__ */ r(m.Provider, { value: H, children: /* @__PURE__ */ f(
      "div",
      {
        ref: S,
        className: w,
        "data-cads-field-wrapper": "",
        "data-disabled": l ? "true" : void 0,
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "2px",
          position: "relative",
          width: "100%",
          fontFamily: "var(--font-family-main)",
          ...F
        },
        children: [
          o != null && o !== "" ? /* @__PURE__ */ f(
            "label",
            {
              id: d,
              htmlFor: n,
              style: {
                display: "block",
                fontFamily: "var(--font-family-main)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontSize: e.labelFontSize,
                lineHeight: e.labelLineHeight,
                color: b,
                margin: 0
              },
              children: [
                o,
                y ? /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "*" }) : null
              ]
            }
          ) : null,
          /* @__PURE__ */ r("div", { "data-cads-field-slot": "", style: { width: "100%", minWidth: 0 }, children: I }),
          u ? /* @__PURE__ */ f(
            "div",
            {
              id: a,
              "data-cads-field-helper": "",
              style: {
                display: "flex",
                alignItems: "center",
                gap: e.helperGap,
                width: "100%",
                color: s.text
              },
              children: [
                h != null ? /* @__PURE__ */ r(
                  "span",
                  {
                    "aria-hidden": !0,
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: e.helperIconSlot,
                      height: e.helperIconSlot,
                      flexShrink: 0,
                      color: s.icon
                    },
                    children: /* @__PURE__ */ r(L, { name: h, fontSize: e.helperIconPx })
                  }
                ) : null,
                /* @__PURE__ */ r(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-family-main)",
                      fontWeight: 400,
                      fontSize: e.helperFontSize,
                      lineHeight: e.helperLineHeight,
                      color: s.text
                    },
                    children: p
                  }
                )
              ]
            }
          ) : null
        ]
      }
    ) });
  }
);
export {
  G as FieldWrapper,
  A as useFieldContext
};
//# sourceMappingURL=FieldWrapper.js.map
