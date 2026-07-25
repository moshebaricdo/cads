import { jsx as r, jsxs as f } from "react/jsx-runtime";
import { createContext as E, forwardRef as H, useId as k, useMemo as N, useContext as P } from "react";
import { FaIcon as j } from "../../icons/FaIcon.js";
import { FIELD_WRAPPER_SIZE as z } from "../../shared/controlSize.js";
const h = E(null);
function M() {
  return P(h);
}
const L = {
  success: "circle-check",
  warning: "circle-exclamation",
  error: "circle-xmark"
};
function R(u, i) {
  if (i)
    return {
      text: "var(--text-disabled-neutral)",
      icon: "var(--text-disabled-neutral)"
    };
  switch (u) {
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
const A = H(
  function({
    size: i = "medium",
    sentiment: t = "default",
    label: o,
    required: p = !1,
    helperText: x,
    helperIconName: m = "smile",
    showHelper: y = !0,
    htmlFor: v,
    disabled: l = !1,
    children: g,
    className: I,
    style: w
  }, F) {
    const S = k(), a = v ?? `cads-field-${S}`, c = `${a}-label`, n = `${a}-helper`, e = z[i], d = R(t, l), C = l ? "var(--text-disabled-neutral)" : "var(--text-neutral-primary)", s = !!x && (t !== "default" ? !0 : y), b = N(
      () => ({
        size: i,
        sentiment: t,
        disabled: l,
        labelId: c,
        helperId: n,
        controlId: a,
        describedBy: s ? n : void 0,
        error: t === "error"
      }),
      [
        i,
        t,
        l,
        c,
        n,
        a,
        s
      ]
    ), W = t === "default" ? m : L[t];
    return /* @__PURE__ */ r(h.Provider, { value: b, children: /* @__PURE__ */ f(
      "div",
      {
        ref: F,
        className: I,
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
          ...w
        },
        children: [
          o != null && o !== "" ? /* @__PURE__ */ f(
            "label",
            {
              id: c,
              htmlFor: a,
              style: {
                display: "block",
                fontFamily: "var(--font-family-main)",
                fontWeight: "var(--font-weight-semi-bold)",
                fontSize: e.labelFontSize,
                lineHeight: e.labelLineHeight,
                color: C,
                margin: 0
              },
              children: [
                o,
                p ? /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "*" }) : null
              ]
            }
          ) : null,
          /* @__PURE__ */ r("div", { "data-cads-field-slot": "", style: { width: "100%", minWidth: 0 }, children: g }),
          s ? /* @__PURE__ */ f(
            "div",
            {
              id: n,
              "data-cads-field-helper": "",
              style: {
                display: "flex",
                alignItems: "center",
                gap: e.helperGap,
                width: "100%",
                color: d.text
              },
              children: [
                /* @__PURE__ */ r(
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
                      color: d.icon
                    },
                    children: /* @__PURE__ */ r(j, { name: W, fontSize: e.helperIconPx })
                  }
                ),
                /* @__PURE__ */ r(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-family-main)",
                      fontWeight: 400,
                      fontSize: e.helperFontSize,
                      lineHeight: e.helperLineHeight,
                      color: d.text
                    },
                    children: x
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
  A as FieldWrapper,
  M as useFieldContext
};
//# sourceMappingURL=FieldWrapper.js.map
