import { jsx as e, jsxs as v, Fragment as m } from "react/jsx-runtime";
import B from "@mui/material/ButtonBase";
import { forwardRef as P } from "react";
import { FaIcon as d } from "../../icons/FaIcon.js";
import r from "./progressBubble.module.scss.js";
import { TutorPlusMark as T } from "./TutorPlusMark.js";
const z = {
  notStarted: {
    bg: "var(--background-neutral-primary)",
    fg: "var(--text-neutral-primary)",
    border: "var(--border-neutral-secondary)",
    bgHover: "var(--background-neutral-tertiary)",
    fgHover: "var(--text-neutral-primary)"
  },
  inProgress: {
    bg: "var(--background-neutral-primary)",
    fg: "var(--text-neutral-primary)",
    border: "var(--border-success-strong)",
    bgHover: "var(--background-success-light)",
    fgHover: "var(--text-neutral-primary)"
  },
  passed: {
    bg: "var(--background-success-mid)",
    fg: "var(--text-neutral-primary)",
    bgHover: "var(--background-success-strong)",
    fgHover: "var(--text-neutral-white-fixed)"
  },
  completed: {
    bg: "var(--background-success-primary)",
    fg: "var(--text-neutral-white-fixed)",
    bgHover: "var(--background-success-strong)",
    fgHover: "var(--text-neutral-white-fixed)"
  },
  error: {
    bg: "var(--background-error-primary)",
    fg: "var(--text-neutral-white-fixed)",
    bgHover: "var(--background-error-strong)",
    fgHover: "var(--text-neutral-white-fixed)"
  }
};
function j(n) {
  const a = z[n];
  return {
    "--pb-bg": a.bg,
    "--pb-fg": a.fg,
    "--pb-border": a.border ?? "transparent",
    "--pb-border-width": a.border ? "1.5px" : "0px",
    "--pb-bg-hover": a.bgHover,
    "--pb-fg-hover": a.fgHover
  };
}
function A() {
  return {
    "--pb-bg": "transparent",
    "--pb-fg": "var(--text-neutral-quaternary)",
    "--pb-border": "transparent",
    "--pb-border-width": "0px",
    "--pb-bg-hover": "transparent",
    "--pb-fg-hover": "var(--text-neutral-primary)"
  };
}
function C({
  levelType: n
}) {
  return n === "tutorPlus" ? /* @__PURE__ */ e(T, { size: 12 }) : /* @__PURE__ */ e(d, { name: "flag-checkered", family: "solid", fontSize: "11px" });
}
const V = P(function(a, h) {
  const {
    levelType: o = "default",
    status: y = "notStarted",
    isActive: t = !1,
    isAssessment: c = !1,
    levelNumber: b,
    interactive: x = !0,
    className: k = "",
    style: H,
    disabled: i,
    ...S
  } = a, s = o === "lessonExtras" || o === "tutorPlus";
  let l = null, u = r.circle;
  s ? (u = r.glyph, l = /* @__PURE__ */ e(C, { levelType: o })) : o === "panelLevel" ? (u = r.panel, l = /* @__PURE__ */ v(m, { children: [
    /* @__PURE__ */ e("span", { className: r.diamond, "aria-hidden": "true" }),
    t ? /* @__PURE__ */ e("span", { className: r.levelNumber, children: b }) : null
  ] })) : t && (l = /* @__PURE__ */ e("span", { className: r.levelNumber, children: b }));
  const N = c && !s && !t, w = c && !s && t, g = [
    r.root,
    u,
    t && !s ? r.active : "",
    i ? r.disabled : "",
    k
  ].filter(Boolean).join(" "), p = {
    ...s ? A() : j(y),
    ...H
  }, f = /* @__PURE__ */ v(m, { children: [
    l,
    N ? /* @__PURE__ */ e(
      d,
      {
        name: "star",
        family: "solid",
        fontSize: "6px",
        className: r.inlineStar
      }
    ) : null,
    w ? /* @__PURE__ */ e("span", { className: r.starBadge, "aria-hidden": "true", children: /* @__PURE__ */ e(d, { name: "star", family: "solid", fontSize: "5px" }) }) : null
  ] });
  return x ? /* @__PURE__ */ e(
    B,
    {
      ref: h,
      className: g,
      style: p,
      disabled: i,
      disableRipple: !0,
      ...S,
      children: f
    }
  ) : /* @__PURE__ */ e(
    "span",
    {
      className: `${g} ${r.static}`,
      style: p,
      "aria-disabled": i || void 0,
      children: f
    }
  );
});
export {
  V as ProgressBubble
};
//# sourceMappingURL=ProgressBubble.js.map
