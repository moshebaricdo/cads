import { jsx as v, jsxs as E } from "react/jsx-runtime";
import F from "@mui/material/IconButton";
import { forwardRef as j, useState as k } from "react";
import { FaIcon as _ } from "../../icons/FaIcon.js";
import { ICON_TOGGLE_SIZE as L } from "../../shared/controlSize.js";
import p from "./iconToggle.module.scss.js";
function P(l) {
  switch (l) {
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
function U(l) {
  switch (l) {
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
const O = j(
  function({
    size: e,
    color: c,
    iconName: f,
    pressed: r,
    defaultPressed: u,
    onPressedChange: o,
    disabled: b,
    sx: y,
    onClick: a,
    style: S,
    "aria-label": B,
    ...q
  }, w) {
    const t = r !== void 0, [x, h] = k(u ?? !1), m = t ? !!r : x, s = L[e], n = P(c), G = c === "primary" ? "var(--text-neutral-primary)" : "var(--text-neutral-quaternary)", I = {
      "--it-size": s.size,
      "--it-padding": s.padding,
      "--it-icon-slot": s.iconSlot,
      "--it-icon-off": G,
      "--it-icon-on": n.on,
      "--it-hover-icon": n.hoverIcon,
      "--it-press-icon": n.pressIcon,
      "--it-surface": n.surface,
      ...S
    };
    return /* @__PURE__ */ v(
      F,
      {
        ref: w,
        disableRipple: !0,
        disabled: b,
        "aria-pressed": m,
        "aria-label": B,
        "data-cads-press": "",
        className: p.button,
        style: I,
        sx: y,
        ...q,
        onClick: (R) => {
          if (a == null || a(R), !R.defaultPrevented) {
            const N = !m;
            t || h(N), o == null || o(N);
          }
        },
        children: /* @__PURE__ */ v(
          _,
          {
            name: f,
            family: m ? "solid" : "regular",
            fontSize: s.iconPx,
            className: p.icon
          }
        )
      }
    );
  }
), K = j(
  function({
    size: e = "medium",
    color: c = "brand",
    label: f,
    secondToggle: r,
    exclusive: u = !1,
    iconName: o,
    pressed: b,
    defaultPressed: y,
    onPressedChange: a,
    ...S
  }, B) {
    const q = b !== void 0, w = (r == null ? void 0 : r.pressed) !== void 0, t = !!(u && r) && !q && !w, [x, h] = k({
      first: y ?? !1,
      second: (r == null ? void 0 : r.defaultPressed) ?? !1
    }), m = (i) => {
      var d;
      t ? h((z) => ({
        first: i,
        second: i ? !1 : z.second
      })) : u && r && i && ((d = r.onPressedChange) == null || d.call(r, !1)), a == null || a(i);
    }, s = (i) => {
      var d;
      t ? h((z) => ({
        first: i ? !1 : z.first,
        second: i
      })) : u && i && (a == null || a(!1)), (d = r == null ? void 0 : r.onPressedChange) == null || d.call(r, i);
    }, n = t ? x.first : b, G = t ? x.second : r == null ? void 0 : r.pressed, I = /* @__PURE__ */ v(
      O,
      {
        ref: B,
        size: e,
        color: c,
        iconName: o,
        pressed: n,
        defaultPressed: t ? void 0 : y,
        onPressedChange: m,
        ...S
      }
    );
    if (f == null && !r)
      return I;
    const N = {
      "--it-label-gap": e === "small" || e === "extraSmall" ? "0.5rem" : "0.625rem",
      ...U(e)
    };
    return /* @__PURE__ */ E("div", { className: p.labelRow, style: N, children: [
      f != null && /* @__PURE__ */ v("span", { className: p.label, children: f }),
      /* @__PURE__ */ E("div", { className: p.togglePair, children: [
        I,
        r ? /* @__PURE__ */ v(
          O,
          {
            size: e,
            color: r.color ?? c,
            iconName: r.iconName,
            pressed: G,
            defaultPressed: t ? void 0 : r.defaultPressed,
            onPressedChange: s,
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
