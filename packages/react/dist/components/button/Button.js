import { jsx as B, jsxs as q } from "react/jsx-runtime";
import w from "@mui/material/Button";
import { forwardRef as S } from "react";
import { FaIcon as m } from "../../icons/FaIcon.js";
import { BUTTON_SIZE as D } from "../../shared/controlSize.js";
import y from "./button.module.scss.js";
function C(a, t, s) {
  return a === "tertiary" ? t === "text" && s ? "tertiary" : (process.env.NODE_ENV !== "production" && console.warn(
    `[CADS Button] color="tertiary" is only defined in Figma for variant="text" + icon-only. Falling back to color="secondary" for variant="${t}"${s ? "" : " (labeled)"}.`
  ), "secondary") : a === "orange" ? t === "contained" ? "orange" : (process.env.NODE_ENV !== "production" && console.warn(
    `[CADS Button] color="orange" is only defined in Figma for variant="contained" (run button). Falling back to color="primary" for variant="${t}".`
  ), "primary") : a;
}
function E(a) {
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
function z(a, t, s, d) {
  const r = E(t), e = D[s];
  let n, o, l, g, i, v, u, b, f = "transparent";
  return a === "contained" ? (n = r.filledBg, o = r.filledFg, l = "transparent", g = r.filledBgHover, i = r.filledBgPressed, u = r.filledDisabledBg, b = r.filledDisabledFg) : a === "outlined" ? (n = "var(--background-neutral-primary)", o = r.outlinedFg, l = r.outlinedBorder, g = r.outlinedHoverBg, i = r.outlinedPressedBg, u = "var(--background-neutral-primary)", b = r.outlinedDisabledFg, f = r.outlinedDisabledBorder) : (n = "transparent", o = r.textFg, l = "transparent", g = r.textHoverBg, i = r.textPressedBg, v = r.textFgPressed, u = "transparent", b = r.textDisabledFg), {
    "--btn-height": e.height,
    "--btn-px": d ? e.iconOnlyPadding : e.paddingInline,
    "--btn-py": d ? e.iconOnlyPadding : e.paddingBlock,
    "--btn-gap": d ? "0" : e.gap,
    "--btn-font-size": e.fontSize,
    "--btn-line-height": e.lineHeight,
    "--btn-width": d ? e.height : void 0,
    "--btn-bg": n,
    "--btn-fg": o,
    "--btn-border": l,
    "--btn-bg-hover": g,
    "--btn-bg-press": i,
    "--btn-fg-press": v,
    "--btn-disabled-bg": u,
    "--btn-disabled-fg": b,
    "--btn-disabled-border": f,
    "--btn-spinner-fg": o
  };
}
const $ = S(
  function({
    variant: t = "contained",
    color: s = "primary",
    size: d = "medium",
    iconOnly: r,
    startIconName: e,
    endIconName: n,
    loading: o = !1,
    children: l,
    sx: g,
    disabled: i,
    onClick: v,
    className: u,
    ...b
  }, f) {
    const p = D[d], c = r ?? (!l && !!(e || n)), P = C(s, t, c), x = !!o && !i, F = e ? /* @__PURE__ */ B(m, { name: e, fontSize: p.iconPx }) : null, k = n ? /* @__PURE__ */ B(m, { name: n, fontSize: p.iconPx }) : null, h = z(t, P, d, c), H = [
      y.root,
      x && y.loading,
      u
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ q(
      w,
      {
        ref: f,
        disableElevation: !0,
        disabled: i,
        "aria-busy": x || void 0,
        onClick: x ? void 0 : v,
        startIcon: !c && F ? F : void 0,
        endIcon: !c && k ? k : void 0,
        "data-cads-component": "Button",
        "data-cads-press": "",
        className: H,
        style: h,
        sx: g,
        ...b,
        children: [
          c ? F || k : l,
          x ? /* @__PURE__ */ B("span", { "aria-hidden": !0, className: y.spinner, children: /* @__PURE__ */ B(
            m,
            {
              name: "spinner",
              fontSize: p.iconPx,
              className: y.spinnerIcon
            }
          ) }) : null
        ]
      }
    );
  }
);
export {
  $ as Button
};
//# sourceMappingURL=Button.js.map
