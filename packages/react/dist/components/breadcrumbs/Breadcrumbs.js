import { jsx as e, jsxs as k, Fragment as M } from "react/jsx-runtime";
import { forwardRef as C, useId as I, useMemo as F, Fragment as $ } from "react";
import { FaIcon as b } from "../../icons/FaIcon.js";
import { BREADCRUMB_SIZE as g } from "../../shared/controlSize.js";
import { Dropdown as z } from "../dropdown/Dropdown.js";
import u from "./breadcrumbs.module.scss.js";
function E(n, l, c, m) {
  const t = Math.max(0, Math.floor(c)), r = Math.max(0, Math.floor(m)), o = Math.max(2, Math.floor(l));
  if (n.length <= o)
    return n.map((a, d) => ({ kind: "item", item: a, index: d }));
  if (t + r >= n.length)
    return n.map((a, d) => ({ kind: "item", item: a, index: d }));
  const i = n.slice(0, t).map((a, d) => ({
    kind: "item",
    item: a,
    index: d
  })), f = n.length - r, h = n.slice(t, f).map((a, d) => ({
    item: a,
    index: t + d
  })), p = n.slice(f).map((a, d) => ({
    kind: "item",
    item: a,
    index: f + d
  }));
  return [
    ...i,
    { kind: "overflow", items: h },
    ...p
  ];
}
const K = C(
  function({
    size: l = "medium",
    items: c,
    maxItems: m = 8,
    itemsBeforeCollapse: t = 1,
    itemsAfterCollapse: r = 1,
    expandText: o = "Show path",
    "aria-label": i = "Breadcrumb",
    className: f,
    style: h
  }, p) {
    const a = g[l], d = I(), v = c.some((s) => s.current), y = F(
      () => E(c, m, t, r),
      [c, m, t, r]
    ), x = {
      "--crumb-link-gap": a.linkGap,
      "--crumb-font-size": a.fontSize,
      "--crumb-row": a.sepBox,
      "--crumb-trail-gap": a.trailGap
    };
    return /* @__PURE__ */ e(
      "nav",
      {
        ref: p,
        "aria-label": i,
        className: f,
        style: { ...x, ...h },
        "data-cads-breadcrumbs": "",
        "data-size": l,
        children: /* @__PURE__ */ e("ol", { className: u.trail, children: y.map((s, N) => {
          const S = N === y.length - 1, B = s.kind === "item" ? s.item.key ?? `crumb-${s.index}` : `${d}-overflow`;
          return /* @__PURE__ */ k($, { children: [
            /* @__PURE__ */ e("li", { className: u.slot, children: s.kind === "item" ? /* @__PURE__ */ e(
              P,
              {
                item: s.item,
                size: l,
                isCurrent: !!s.item.current || !v && s.index === c.length - 1
              }
            ) : /* @__PURE__ */ e(
              j,
              {
                size: l,
                items: s.items,
                expandText: o
              }
            ) }),
            S ? null : /* @__PURE__ */ e("li", { "aria-hidden": !0, className: u.separator, children: /* @__PURE__ */ e(
              b,
              {
                name: "chevron-right",
                family: "solid",
                fontSize: a.sepIconPx,
                className: u.glyph
              }
            ) })
          ] }, B);
        }) })
      }
    );
  }
);
function O() {
  return {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0
  };
}
function P({
  item: n,
  size: l,
  isCurrent: c
}) {
  const m = g[l], t = !!n.disabled, r = !!n.iconName, o = /* @__PURE__ */ k(M, { children: [
    r ? /* @__PURE__ */ e(
      b,
      {
        name: n.iconName,
        family: "solid",
        fontSize: m.iconPx,
        className: u.glyph,
        title: n.iconOnly && typeof n.label == "string" ? n.label : void 0
      }
    ) : null,
    n.iconOnly ? r && typeof n.label == "string" ? null : /* @__PURE__ */ e("span", { style: O(), children: n.label }) : /* @__PURE__ */ e("span", { className: u.label, children: n.label })
  ] }), i = {
    className: u.link,
    "data-cads-breadcrumb-link": "",
    "data-current": c ? "true" : void 0,
    "data-disabled": t ? "true" : void 0,
    style: { position: "relative" }
  };
  return c ? /* @__PURE__ */ e("span", { ...i, "aria-current": "page", children: o }) : t ? /* @__PURE__ */ e("span", { ...i, "aria-disabled": "true", children: o }) : n.href != null ? /* @__PURE__ */ e("a", { ...i, href: n.href, onClick: n.onClick, "data-cads-press": "", children: o }) : /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      ...i,
      onClick: n.onClick,
      "data-cads-press": "",
      children: o
    }
  );
}
function R(n) {
  return n === "large" ? "medium" : n === "medium" ? "small" : "extraSmall";
}
function w(n, l) {
  return n.key ?? `overflow-${l}`;
}
function j({
  size: n,
  items: l,
  expandText: c
}) {
  const m = g[n], t = (r) => {
    const o = l.find(
      ({ item: f, index: h }) => w(f, h) === r
    );
    if (!o || o.item.disabled) return;
    const { item: i } = o;
    if (i.onClick) {
      i.onClick(
        void 0
      );
      return;
    }
    i.href && typeof window < "u" && window.location.assign(i.href);
  };
  return /* @__PURE__ */ e(
    z,
    {
      role: "action",
      size: R(n),
      className: u.overflowHost,
      "aria-label": c,
      options: l.map(({ item: r, index: o }) => ({
        value: w(r, o),
        label: r.label,
        disabled: r.disabled
      })),
      onAction: t,
      trigger: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: u.overflow,
          "data-cads-breadcrumb-overflow": "",
          "data-cads-press": "",
          children: /* @__PURE__ */ e(
            b,
            {
              name: "ellipsis",
              family: "solid",
              fontSize: m.iconPx,
              className: u.glyph
            }
          )
        }
      )
    }
  );
}
export {
  K as Breadcrumbs
};
//# sourceMappingURL=Breadcrumbs.js.map
