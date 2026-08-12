import { jsxs as d, Fragment as W, jsx as e } from "react/jsx-runtime";
import U from "@mui/material/ButtonBase";
import { motion as Z } from "@moshebaricdo/cads-variables";
import { useReducedMotion as _, motion as q } from "motion/react";
import { forwardRef as A, useId as D, useState as J } from "react";
import { FaIcon as x } from "../../icons/FaIcon.js";
import { TOGGLE_SIZE as K } from "../../shared/controlSize.js";
import { useExperimentalMotion as Q, springTransition as V } from "../../theme/experimentalMotion.js";
import r from "./toggle.module.scss.js";
const la = A(
  function({
    size: b = "medium",
    label: o,
    labelPlacement: s = "left",
    checked: p,
    defaultChecked: k = !1,
    onChange: i,
    hasIcons: $ = !0,
    onIcon: w = "check",
    offIcon: S = "xmark",
    disabled: n = !1,
    id: I,
    sx: B,
    "aria-label": N,
    onClick: l,
    ...R
  }, G) {
    const T = D(), u = I ?? T, m = `${u}-label`, a = K[b], g = p !== void 0, [z, E] = J(k), t = g ? !!p : z, F = Q(), H = _(), M = V(
      Z.indicator.spring,
      H
    ), L = (c) => {
      if (l == null || l(c), c.defaultPrevented || n) return;
      const v = !t;
      g || E(v), i == null || i(c, v);
    }, P = n ? "var(--background-disabled-neutral)" : t ? "var(--background-selected-primary)" : "var(--background-neutral-septenary)", j = t ? "var(--background-selected-strong)" : "var(--background-neutral-octonary)", h = n ? "var(--background-neutral-primary)" : t ? "var(--background-selected-primary-inverse)" : "var(--background-neutral-primary)", O = n ? "var(--text-disabled-neutral-inverse)" : t ? "var(--text-selected-primary)" : "var(--text-neutral-primary-inverse)", f = /* @__PURE__ */ d(
      U,
      {
        ...R,
        ref: G,
        id: u,
        type: "button",
        role: "switch",
        disabled: n,
        "aria-checked": t,
        "aria-label": o == null ? N : void 0,
        "aria-labelledby": o != null ? m : void 0,
        onClick: L,
        disableRipple: !0,
        focusRipple: !1,
        "data-cads-toggle": "",
        "data-on": t ? "true" : "false",
        className: r.track,
        style: {
          width: a.trackWidth,
          height: a.trackHeight,
          padding: a.pad,
          cursor: n ? "not-allowed" : "pointer",
          "--cads-toggle-bg": P,
          "--cads-toggle-bg-hover": j,
          "--cads-toggle-fg": O
        },
        sx: B,
        children: [
          $ ? /* @__PURE__ */ d(W, { children: [
            /* @__PURE__ */ e(
              "span",
              {
                "aria-hidden": !0,
                className: r.iconSlot,
                style: {
                  left: a.iconInsetLeft,
                  width: `calc(100% - ${a.iconInsetLeft} - ${a.iconGap} - ${a.handle} - ${a.pad})`,
                  opacity: t ? 1 : 0
                },
                children: /* @__PURE__ */ e(x, { name: w, family: "solid", fontSize: a.iconPx })
              }
            ),
            /* @__PURE__ */ e(
              "span",
              {
                "aria-hidden": !0,
                className: r.iconSlot,
                style: {
                  right: a.iconInsetRight,
                  width: `calc(100% - ${a.iconInsetRight} - ${a.iconGap} - ${a.handle} - ${a.pad})`,
                  opacity: t ? 0 : 1
                },
                children: /* @__PURE__ */ e(x, { name: S, family: "solid", fontSize: a.iconPx })
              }
            )
          ] }) : null,
          F ? /* @__PURE__ */ e(
            q.span,
            {
              "aria-hidden": !0,
              "data-cads-indicator": "",
              "data-cads-indicator-spring": "",
              className: r.handleSpring,
              initial: !1,
              animate: { x: t ? a.handleTravelPx : 0 },
              transition: M,
              style: {
                top: a.pad,
                left: a.pad,
                width: a.handle,
                height: a.handle
              },
              children: /* @__PURE__ */ e(
                "span",
                {
                  "data-cads-indicator-face": "",
                  className: r.handleFace,
                  style: { backgroundColor: h }
                }
              )
            }
          ) : /* @__PURE__ */ e(
            "span",
            {
              "aria-hidden": !0,
              "data-cads-indicator": "",
              className: r.handle,
              style: {
                top: a.pad,
                left: t ? `calc(100% - ${a.handle} - ${a.pad})` : a.pad,
                width: a.handle,
                height: a.handle,
                backgroundColor: h
              }
            }
          )
        ]
      }
    );
    if (o == null) return f;
    const y = /* @__PURE__ */ e(
      "span",
      {
        id: m,
        style: {
          fontFamily: "var(--font-family-main)",
          fontWeight: 400,
          fontSize: a.fontSize,
          lineHeight: a.lineHeight,
          color: "var(--text-neutral-primary)",
          whiteSpace: "nowrap"
        },
        children: o
      }
    );
    return /* @__PURE__ */ d(
      "label",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: a.labelGap,
          cursor: n ? "not-allowed" : "pointer"
        },
        children: [
          s === "left" ? y : null,
          f,
          s === "right" ? y : null
        ]
      }
    );
  }
);
export {
  la as Toggle
};
//# sourceMappingURL=Toggle.js.map
