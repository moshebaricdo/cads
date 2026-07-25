import { jsx as r, jsxs as u } from "react/jsx-runtime";
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
function R(f, i) {
  if (i)
    return {
      text: "var(--text-disabled-neutral)",
      icon: "var(--text-disabled-neutral)"
    };
  switch (f) {
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
    label: a,
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
    const S = k(), o = v ?? `cads-field-${S}`, c = `${o}-label`, n = `${o}-helper`, e = z[i], d = R(t, l), b = l ? "var(--text-disabled-neutral)" : "var(--text-neutral-primary)", s = !!x && (t !== "default" ? !0 : y), C = N(
      () => ({
        size: i,
        sentiment: t,
        disabled: l,
        labelId: c,
        helperId: n,
        controlId: o,
        describedBy: s ? n : void 0,
        error: t === "error"
      }),
      [
        i,
        t,
        l,
        c,
        n,
        o,
        s
      ]
    ), W = t === "default" ? m : L[t];
    return /* @__PURE__ */ r(h.Provider, { value: C, children: /* @__PURE__ */ u(
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
          fontFamily: "var(--font-body)",
          ...w
        },
        children: [
          a != null && a !== "" ? /* @__PURE__ */ u(
            "label",
            {
              id: c,
              htmlFor: o,
              style: {
                display: "block",
                fontFamily: "var(--font-body)",
                fontWeight: "var(--font-weight-semibold)",
                fontSize: e.labelFontSize,
                lineHeight: e.labelLineHeight,
                color: b,
                margin: 0
              },
              children: [
                a,
                p ? /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "*" }) : null
              ]
            }
          ) : null,
          /* @__PURE__ */ r("div", { "data-cads-field-slot": "", style: { width: "100%", minWidth: 0 }, children: g }),
          s ? /* @__PURE__ */ u(
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
                      fontFamily: "var(--font-body)",
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
