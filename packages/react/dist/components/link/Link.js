import { jsxs as L, Fragment as P, jsx as t } from "react/jsx-runtime";
import { forwardRef as I } from "react";
import { FaIcon as b } from "../../icons/FaIcon.js";
import { LINK_SIZE as j } from "../../shared/controlSize.js";
import a from "./link.module.scss.js";
const w = "up-right-from-square";
function z(...i) {
  return i.filter(Boolean).join(" ");
}
const D = I(
  function({
    size: f = "medium",
    type: d = "primary",
    isExternal: u = !0,
    disabled: o = !1,
    children: y,
    href: h,
    onClick: e,
    className: x,
    ...l
  }, s) {
    const r = j[f], k = d === "primary", g = (n) => {
      if (o) {
        n.preventDefault(), n.stopPropagation();
        return;
      }
      e == null || e(n);
    }, v = {
      "--link-color": "var(--text-brand-primary)",
      "--link-icon-color": "var(--text-brand-primary)",
      "--link-color-hover": "var(--text-brand-secondary)",
      "--link-icon-color-hover": "var(--text-brand-secondary)"
    }, N = {
      "--link-color": "var(--text-neutral-primary)",
      "--link-icon-color": "var(--text-neutral-primary)",
      "--link-color-hover": "var(--text-neutral-tertiary)",
      "--link-icon-color-hover": "var(--text-neutral-secondary)"
    }, c = {
      "--link-gap": r.gap,
      "--link-font-size": r.fontSize,
      "--link-line-height": r.lineHeight,
      "--link-icon-optical-offset": r.iconOpticalOffset,
      ...o ? {} : k ? v : N
    }, m = z(
      a.root,
      o && a.disabled,
      x
    ), p = /* @__PURE__ */ L(P, { children: [
      y,
      u === !0 ? /* @__PURE__ */ t("span", { className: a.iconWrapper, "aria-hidden": "true", children: /* @__PURE__ */ t(
        b,
        {
          className: a.icon,
          name: w,
          family: "solid",
          fontSize: r.iconPx
        }
      ) }) : null
    ] });
    if (o) {
      const {
        target: n,
        rel: E,
        download: O,
        hrefLang: R,
        referrerPolicy: S,
        ..._
      } = l;
      return /* @__PURE__ */ t(
        "span",
        {
          ref: s,
          className: m,
          style: c,
          "aria-disabled": "true",
          "data-cads-press": "",
          ..._,
          children: p
        }
      );
    }
    return /* @__PURE__ */ t(
      "a",
      {
        ref: s,
        className: m,
        style: c,
        href: h,
        onClick: g,
        "data-cads-press": "",
        ...l,
        children: p
      }
    );
  }
);
export {
  D as Link
};
//# sourceMappingURL=Link.js.map
