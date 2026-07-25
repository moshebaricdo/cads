import { jsxs as N, Fragment as P, jsx as a } from "react/jsx-runtime";
import { forwardRef as I } from "react";
import { FaIcon as b } from "../../icons/FaIcon.js";
import { LINK_SIZE as j } from "../../shared/controlSize.js";
import e from "./link.module.scss.js";
const w = "up-right-from-square";
function z(...i) {
  return i.filter(Boolean).join(" ");
}
const H = I(
  function({
    size: d = "medium",
    type: f = "primary",
    isExternal: y = !0,
    disabled: r = !1,
    children: u,
    href: h,
    onClick: t,
    className: x,
    ...l
  }, s) {
    const o = j[d], g = f === "primary", k = (n) => {
      if (r) {
        n.preventDefault(), n.stopPropagation();
        return;
      }
      t == null || t(n);
    }, v = {
      "--link-color": "var(--text-brand-primary)",
      "--link-icon-color": "var(--text-brand-primary)",
      "--link-color-hover": "var(--text-brand-secondary)",
      "--link-icon-color-hover": "var(--text-brand-secondary)"
    }, _ = {
      "--link-color": "var(--text-neutral-primary)",
      "--link-icon-color": "var(--text-neutral-primary)",
      "--link-color-hover": "var(--text-neutral-tertiary)",
      "--link-icon-color-hover": "var(--text-neutral-secondary)"
    }, c = {
      "--link-gap": o.gap,
      "--link-font-size": o.fontSize,
      "--link-line-height": o.lineHeight,
      ...r ? {} : g ? v : _
    }, m = z(
      e.root,
      r && e.disabled,
      x
    ), p = /* @__PURE__ */ N(P, { children: [
      u,
      y ? /* @__PURE__ */ a(
        b,
        {
          className: e.icon,
          name: w,
          family: "solid",
          fontSize: o.iconPx
        }
      ) : null
    ] });
    if (r) {
      const {
        target: n,
        rel: E,
        download: R,
        hrefLang: S,
        referrerPolicy: C,
        ...L
      } = l;
      return /* @__PURE__ */ a(
        "span",
        {
          ref: s,
          className: m,
          style: c,
          "aria-disabled": "true",
          "data-cads-press": "",
          ...L,
          children: p
        }
      );
    }
    return /* @__PURE__ */ a(
      "a",
      {
        ref: s,
        className: m,
        style: c,
        href: h,
        onClick: k,
        "data-cads-press": "",
        ...l,
        children: p
      }
    );
  }
);
export {
  H as Link
};
//# sourceMappingURL=Link.js.map
