import { jsx as B, jsxs as w } from "react/jsx-runtime";
import S from "@mui/material/Button";
import { forwardRef as C } from "react";
import { FaIcon as D } from "../../icons/FaIcon.js";
import { BUTTON_SIZE as P } from "../../shared/controlSize.js";
import y from "./button.module.scss.js";
function E(a, t, i) {
  return a === "tertiary" ? t === "text" && i ? "tertiary" : (process.env.NODE_ENV !== "production" && console.warn(
    `[CADS Button] color="tertiary" is only defined in Figma for variant="text" + icon-only. Falling back to color="secondary" for variant="${t}"${i ? "" : " (labeled)"}.`
  ), "secondary") : a === "orange" ? t === "contained" ? "orange" : (process.env.NODE_ENV !== "production" && console.warn(
    `[CADS Button] color="orange" is only defined in Figma for variant="contained" (run button). Falling back to color="primary" for variant="${t}".`
  ), "primary") : a;
}
function z(a) {
  switch (a) {
    case "primary":
      return {
        filledBg: "var(--background-brand-primary)",
        filledBgHover: "var(--background-brand-strong)",
        filledBgPressed: "var(--background-brand-strong)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-brand)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-solid)",
        outlinedFg: "var(--text-neutral-primary)",
        outlinedHoverBg: "var(--background-neutral-tertiary)",
        outlinedPressedBg: "var(--background-neutral-tertiary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-brand-primary)",
        textFgPressed: "var(--text-brand-secondary)",
        textHoverBg: "var(--background-brand-light)",
        textPressedBg: "var(--background-brand-light)",
        textDisabledFg: "var(--text-disabled-brand)"
      };
    case "error":
      return {
        filledBg: "var(--background-error-primary)",
        filledBgHover: "var(--background-error-strong)",
        filledBgPressed: "var(--background-error-strong)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-error)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-error-primary)",
        outlinedFg: "var(--text-error-primary)",
        outlinedHoverBg: "var(--background-error-light)",
        outlinedPressedBg: "var(--background-error-light)",
        outlinedDisabledBorder: "var(--border-disabled-error)",
        outlinedDisabledFg: "var(--text-disabled-error)",
        textFg: "var(--text-error-primary)",
        textFgPressed: "var(--text-error-secondary)",
        textHoverBg: "var(--background-error-light)",
        textPressedBg: "var(--background-error-light)",
        textDisabledFg: "var(--text-disabled-error)"
      };
    case "orange":
      return {
        filledBg: "var(--background-accent-orange-primary)",
        filledBgHover: "var(--background-accent-orange-strong)",
        filledBgPressed: "var(--background-accent-orange-strong)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-orange)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-accent-orange-primary)",
        outlinedFg: "var(--text-accent-orange-primary)",
        outlinedHoverBg: "var(--background-accent-orange-light)",
        outlinedPressedBg: "var(--background-accent-orange-light)",
        outlinedDisabledBorder: "var(--border-disabled-orange)",
        outlinedDisabledFg: "var(--text-disabled-orange)",
        textFg: "var(--text-accent-orange-primary)",
        textFgPressed: "var(--text-accent-orange-secondary)",
        textHoverBg: "var(--background-accent-orange-light)",
        textPressedBg: "var(--background-accent-orange-light)",
        textDisabledFg: "var(--text-disabled-orange)"
      };
    case "tertiary":
      return {
        filledBg: "var(--background-neutral-secondary)",
        filledBgHover: "var(--background-neutral-tertiary)",
        filledBgPressed: "var(--background-neutral-secondary)",
        filledFg: "var(--text-neutral-primary)",
        filledDisabledBg: "var(--background-disabled-neutral)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-secondary)",
        outlinedFg: "var(--text-neutral-quaternary)",
        outlinedHoverBg: "var(--background-neutral-quaternary)",
        outlinedPressedBg: "var(--background-neutral-quaternary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-neutral-quaternary)",
        textFgPressed: "var(--text-neutral-quaternary)",
        textHoverBg: "var(--background-neutral-quaternary)",
        textPressedBg: "var(--background-neutral-quaternary)",
        textDisabledFg: "var(--text-disabled-neutral)"
      };
    case "secondary":
    default:
      return {
        filledBg: "var(--background-neutral-primary-inverse)",
        filledBgHover: "var(--background-neutral-octonary)",
        filledBgPressed: "var(--background-neutral-primary-inverse)",
        filledFg: "var(--text-neutral-primary-inverse)",
        filledDisabledBg: "var(--background-disabled-neutral)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-secondary)",
        outlinedFg: "var(--text-neutral-primary)",
        outlinedHoverBg: "var(--background-neutral-tertiary)",
        outlinedPressedBg: "var(--background-neutral-tertiary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-neutral-primary)",
        textFgPressed: "var(--text-neutral-tertiary)",
        textHoverBg: "var(--background-neutral-quaternary)",
        textPressedBg: "var(--background-neutral-quaternary)",
        textDisabledFg: "var(--text-disabled-neutral)"
      };
  }
}
function I(a, t, i, d, p) {
  const r = z(t), e = P[i];
  let s, n, o, g, l, v, u, b, f = "transparent";
  return a === "contained" ? (s = r.filledBg, n = r.filledFg, o = "transparent", g = r.filledBgHover, l = r.filledBgPressed, u = r.filledDisabledBg, b = r.filledDisabledFg) : a === "outlined" ? (s = "var(--background-neutral-primary)", n = r.outlinedFg, o = r.outlinedBorder, g = r.outlinedHoverBg, l = r.outlinedPressedBg, u = "var(--background-neutral-primary)", b = r.outlinedDisabledFg, f = r.outlinedDisabledBorder) : (s = "transparent", n = r.textFg, o = "transparent", g = r.textHoverBg, l = r.textPressedBg, v = r.textFgPressed, u = "transparent", b = r.textDisabledFg), {
    "--btn-height": e.height,
    "--btn-px": d ? e.iconOnlyPadding : e.paddingInline,
    "--btn-py": d ? e.iconOnlyPadding : e.paddingBlock,
    "--btn-gap": d ? "0" : e.gap,
    "--btn-font-size": e.fontSize,
    "--btn-line-height": e.lineHeight,
    // Module CSS uses `width: var(--btn-width, auto)`, which beats MUI's
    // fullWidth class — set the token so fullWidth actually stretches.
    "--btn-width": d ? e.height : p ? "100%" : void 0,
    "--btn-bg": s,
    "--btn-fg": n,
    "--btn-border": o,
    "--btn-bg-hover": g,
    "--btn-bg-press": l,
    "--btn-fg-press": v,
    "--btn-disabled-bg": u,
    "--btn-disabled-fg": b,
    "--btn-disabled-border": f,
    "--btn-spinner-fg": n
  };
}
const A = C(
  function({
    variant: t = "contained",
    color: i = "primary",
    size: d = "medium",
    iconOnly: p,
    startIconName: r,
    endIconName: e,
    loading: s = !1,
    fullWidth: n = !1,
    children: o,
    sx: g,
    disabled: l,
    onClick: v,
    className: u,
    ...b
  }, f) {
    const F = P[d], c = p ?? (!o && !!(r || e)), h = E(i, t, c), x = !!s && !l, k = r ? /* @__PURE__ */ B(D, { name: r, fontSize: F.iconPx }) : null, m = e ? /* @__PURE__ */ B(D, { name: e, fontSize: F.iconPx }) : null, H = I(
      t,
      h,
      d,
      c,
      n
    ), q = [
      y.root,
      x && y.loading,
      u
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ w(
      S,
      {
        ref: f,
        disableElevation: !0,
        disabled: l,
        fullWidth: n,
        "aria-busy": x || void 0,
        onClick: x ? void 0 : v,
        startIcon: !c && k ? k : void 0,
        endIcon: !c && m ? m : void 0,
        "data-cads-component": "Button",
        "data-cads-press": "",
        className: q,
        style: H,
        sx: g,
        ...b,
        children: [
          c ? k || m : o,
          x ? /* @__PURE__ */ B("span", { "aria-hidden": !0, className: y.spinner, children: /* @__PURE__ */ B(
            D,
            {
              name: "spinner",
              fontSize: F.iconPx,
              className: y.spinnerIcon
            }
          ) }) : null
        ]
      }
    );
  }
);
export {
  A as Button
};
//# sourceMappingURL=Button.js.map
