import { jsx as p, jsxs as R } from "react/jsx-runtime";
import k from "@mui/material/IconButton";
import { forwardRef as E, useState as O } from "react";
import { FaIcon as F } from "../../icons/FaIcon.js";
import { ICON_TOGGLE_SIZE as _ } from "../../shared/controlSize.js";
import b from "./iconToggle.module.scss.js";
function L(c) {
  switch (c) {
    case "primary":
      return {
        on: "var(--text-neutral-primary)",
        hoverIcon: "var(--text-neutral-primary)",
        pressIcon: "var(--text-neutral-quaternary)",
        surface: "var(--background-neutral-tertiary)"
      };
    case "secondary":
      return {
        on: "var(--text-neutral-quaternary)",
        hoverIcon: "var(--text-neutral-quaternary)",
        pressIcon: "var(--text-neutral-secondary)",
        surface: "var(--background-neutral-tertiary)"
      };
    case "success":
      return {
        on: "var(--text-success-primary-fixed)",
        hoverIcon: "var(--text-success-primary-fixed)",
        pressIcon: "var(--text-success-primary-fixed)",
        surface: "var(--background-success-light)"
      };
    case "error":
      return {
        on: "var(--text-error-primary-fixed)",
        hoverIcon: "var(--text-error-primary-fixed)",
        pressIcon: "var(--text-error-primary-fixed)",
        surface: "var(--background-error-light)"
      };
    case "brand":
    default:
      return {
        on: "var(--text-brand-primary-fixed)",
        hoverIcon: "var(--text-brand-primary-fixed)",
        pressIcon: "var(--text-brand-primary-fixed)",
        surface: "var(--background-brand-light)"
      };
  }
}
function P(c) {
  switch (c) {
    case "large":
      return {
        "--it-label-font-size": "var(--text-body-lg)",
        "--it-label-line-height": "var(--leading-body-lg)"
      };
    case "small":
      return {
        "--it-label-font-size": "var(--text-body-sm)",
        "--it-label-line-height": "var(--leading-body-sm)"
      };
    case "extraSmall":
      return {
        "--it-label-font-size": "var(--text-body-xs)",
        "--it-label-line-height": "var(--leading-body-xs)"
      };
    case "medium":
    default:
      return {
        "--it-label-font-size": "var(--text-body-md)",
        "--it-label-line-height": "var(--leading-body-md)"
      };
  }
}
const z = E(
  function({
    size: e,
    color: f,
    iconName: u,
    pressed: r,
    defaultPressed: o,
    onPressedChange: m,
    disabled: y,
    sx: x,
    onClick: a,
    "aria-label": N
  }, S) {
    const h = r !== void 0, [B, i] = O(o ?? !1), n = h ? !!r : B, s = _[e], l = L(f), q = f === "primary" ? "var(--text-neutral-primary)" : "var(--text-neutral-quaternary)", w = {
      "--it-size": s.size,
      "--it-padding": s.padding,
      "--it-icon-slot": s.iconSlot,
      "--it-icon-off": q,
      "--it-icon-on": l.on,
      "--it-hover-icon": l.hoverIcon,
      "--it-press-icon": l.pressIcon,
      "--it-surface": l.surface
    };
    return /* @__PURE__ */ p(
      k,
      {
        ref: S,
        disableRipple: !0,
        disabled: y,
        "aria-pressed": n,
        "aria-label": N,
        "data-cads-press": "",
        className: b.button,
        style: w,
        sx: x,
        onClick: (I) => {
          if (a == null || a(I), !I.defaultPrevented) {
            const d = !n;
            h || i(d), m == null || m(d);
          }
        },
        children: /* @__PURE__ */ p(
          F,
          {
            name: u,
            family: n ? "solid" : "regular",
            fontSize: s.iconPx,
            className: b.icon
          }
        )
      }
    );
  }
), K = E(
  function({
    size: e = "medium",
    color: f = "brand",
    label: u,
    secondToggle: r,
    exclusive: o = !1,
    iconName: m,
    pressed: y,
    defaultPressed: x,
    onPressedChange: a,
    ...N
  }, S) {
    const h = y !== void 0, B = (r == null ? void 0 : r.pressed) !== void 0, i = !!(o && r) && !h && !B, [n, s] = O({
      first: x ?? !1,
      second: (r == null ? void 0 : r.defaultPressed) ?? !1
    }), l = (t) => {
      var v;
      i ? s((G) => ({
        first: t,
        second: t ? !1 : G.second
      })) : o && r && t && ((v = r.onPressedChange) == null || v.call(r, !1)), a == null || a(t);
    }, q = (t) => {
      var v;
      i ? s((G) => ({
        first: t ? !1 : G.first,
        second: t
      })) : o && t && (a == null || a(!1)), (v = r == null ? void 0 : r.onPressedChange) == null || v.call(r, t);
    }, w = i ? n.first : y, I = i ? n.second : r == null ? void 0 : r.pressed, d = /* @__PURE__ */ p(
      z,
      {
        ref: S,
        size: e,
        color: f,
        iconName: m,
        pressed: w,
        defaultPressed: i ? void 0 : x,
        onPressedChange: l,
        ...N
      }
    );
    if (u == null && !r)
      return d;
    const j = {
      "--it-label-gap": e === "small" || e === "extraSmall" ? "0.5rem" : "0.625rem",
      ...P(e)
    };
    return /* @__PURE__ */ R("div", { className: b.labelRow, style: j, children: [
      u != null && /* @__PURE__ */ p("span", { className: b.label, children: u }),
      /* @__PURE__ */ R("div", { className: b.togglePair, children: [
        d,
        r ? /* @__PURE__ */ p(
          z,
          {
            size: e,
            color: r.color ?? f,
            iconName: r.iconName,
            pressed: I,
            defaultPressed: i ? void 0 : r.defaultPressed,
            onPressedChange: q,
            disabled: r.disabled,
            "aria-label": r["aria-label"]
          }
        ) : null
      ] })
    ] });
  }
);
export {
  K as IconToggle
};
//# sourceMappingURL=IconToggle.js.map
