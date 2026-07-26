import { jsx as t, jsxs as M, Fragment as D } from "react/jsx-runtime";
import E from "@mui/material/ClickAwayListener";
import L from "@mui/material/Paper";
import z from "@mui/material/Popper";
import { forwardRef as N, useId as C, useMemo as H, Fragment as O, useState as R, useRef as A } from "react";
import { FaIcon as B } from "../../icons/FaIcon.js";
import { BREADCRUMB_SIZE as I } from "../../shared/controlSize.js";
import { useExperimentalMotion as P, experimentalMotionHostAttrs as F } from "../../theme/experimentalMotion.js";
import x from "./breadcrumbs.module.scss.js";
function $(e, c, m, v) {
  const f = Math.max(0, Math.floor(m)), l = Math.max(0, Math.floor(v)), h = Math.max(2, Math.floor(c));
  if (e.length <= h)
    return e.map((r, i) => ({ kind: "item", item: r, index: i }));
  if (f + l >= e.length)
    return e.map((r, i) => ({ kind: "item", item: r, index: i }));
  const d = e.slice(0, f).map((r, i) => ({
    kind: "item",
    item: r,
    index: i
  })), b = e.length - l, g = e.slice(f, b).map((r, i) => ({
    item: r,
    index: f + i
  })), p = e.slice(b).map((r, i) => ({
    kind: "item",
    item: r,
    index: b + i
  }));
  return [
    ...d,
    { kind: "overflow", items: g },
    ...p
  ];
}
const Y = N(
  function({
    size: c = "medium",
    items: m,
    maxItems: v = 8,
    itemsBeforeCollapse: f = 1,
    itemsAfterCollapse: l = 1,
    expandText: h = "Show path",
    "aria-label": d = "Breadcrumb",
    className: b,
    style: g
  }, p) {
    const r = I[c], i = C(), y = m.some((u) => u.current), s = H(
      () => $(m, v, f, l),
      [m, v, f, l]
    ), w = {
      "--crumb-link-gap": r.linkGap,
      "--crumb-font-size": r.fontSize,
      "--crumb-line-height": r.lineHeight,
      "--crumb-trail-gap": r.trailGap,
      "--crumb-sep-box": r.sepBox
    };
    return /* @__PURE__ */ t(
      "nav",
      {
        ref: p,
        "aria-label": d,
        className: b,
        style: { ...w, ...g },
        "data-cads-breadcrumbs": "",
        "data-size": c,
        children: /* @__PURE__ */ t("ol", { className: x.trail, children: s.map((u, n) => {
          const o = n === s.length - 1, a = u.kind === "item" ? u.item.key ?? `crumb-${u.index}` : `${i}-overflow`;
          return /* @__PURE__ */ M(O, { children: [
            /* @__PURE__ */ t("li", { children: u.kind === "item" ? /* @__PURE__ */ t(
              U,
              {
                item: u.item,
                size: c,
                isCurrent: !!u.item.current || !y && u.index === m.length - 1
              }
            ) : /* @__PURE__ */ t(
              _,
              {
                size: c,
                items: u.items,
                menuId: `${i}-overflow-menu`,
                expandText: h
              }
            ) }),
            o ? null : /* @__PURE__ */ t("li", { "aria-hidden": !0, className: x.separator, children: /* @__PURE__ */ t(
              B,
              {
                name: "chevron-right",
                family: "solid",
                fontSize: r.sepIconPx
              }
            ) })
          ] }, a);
        }) })
      }
    );
  }
);
function K() {
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
function U({
  item: e,
  size: c,
  isCurrent: m
}) {
  const v = I[c], f = !!e.disabled, l = !!e.iconName, h = /* @__PURE__ */ M(D, { children: [
    l ? /* @__PURE__ */ t(
      B,
      {
        name: e.iconName,
        family: "solid",
        fontSize: v.iconPx,
        title: e.iconOnly && typeof e.label == "string" ? e.label : void 0
      }
    ) : null,
    e.iconOnly ? l && typeof e.label == "string" ? null : /* @__PURE__ */ t("span", { style: K(), children: e.label }) : e.label
  ] }), d = {
    className: x.link,
    "data-cads-breadcrumb-link": "",
    "data-current": m ? "true" : void 0,
    "data-disabled": f ? "true" : void 0,
    style: { position: "relative" }
  };
  return m ? /* @__PURE__ */ t("span", { ...d, "aria-current": "page", children: h }) : f ? /* @__PURE__ */ t("span", { ...d, "aria-disabled": "true", children: h }) : e.href != null ? /* @__PURE__ */ t("a", { ...d, href: e.href, onClick: e.onClick, "data-cads-press": "", children: h }) : /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      ...d,
      onClick: e.onClick,
      "data-cads-press": "",
      children: h
    }
  );
}
const V = {
  large: {
    paddingLeft: "1rem",
    paddingRight: "1.375rem",
    paddingBlock: "0.625rem",
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)"
  },
  medium: {
    paddingLeft: "0.75rem",
    paddingRight: "1rem",
    paddingBlock: "0.5rem",
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)"
  },
  small: {
    paddingLeft: "0.625rem",
    paddingRight: "0.875rem",
    paddingBlock: "0.3125rem",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)"
  },
  extraSmall: {
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem",
    paddingBlock: "0.125rem",
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)"
  }
};
function _({
  size: e,
  items: c,
  menuId: m,
  expandText: v
}) {
  const f = I[e], l = V[e === "large" || e === "medium" ? "small" : "extraSmall"], h = P(), [d, b] = R(!1), [g, p] = R(-1), r = A(null), i = C(), y = (n, o) => {
    const { item: a } = n;
    if (!a.disabled) {
      if (b(!1), p(-1), a.onClick) {
        a.onClick(
          o
        );
        return;
      }
      a.href && typeof window < "u" && window.location.assign(a.href);
    }
  }, s = c.map((n, o) => n.item.disabled ? -1 : o).filter((n) => n >= 0), w = (n) => {
    var o;
    if (d)
      switch (n.key) {
        case "Escape":
          n.stopPropagation(), n.preventDefault(), b(!1), p(-1), (o = r.current) == null || o.focus();
          break;
        case "ArrowDown": {
          if (n.preventDefault(), s.length === 0) break;
          const a = s.indexOf(g), k = s[a === -1 ? 0 : (a + 1) % s.length];
          p(k);
          break;
        }
        case "ArrowUp": {
          if (n.preventDefault(), s.length === 0) break;
          const a = s.indexOf(g), k = s[a <= 0 ? s.length - 1 : (a - 1 + s.length) % s.length];
          p(k);
          break;
        }
        case "Enter":
        case " ": {
          if (g < 0) break;
          n.preventDefault();
          const a = c[g];
          a && !a.item.disabled && y(a, n);
          break;
        }
      }
  }, u = {
    "--menu-padding-left": l.paddingLeft,
    "--menu-padding-right": l.paddingRight,
    "--menu-padding-block": l.paddingBlock,
    "--menu-font-size": l.fontSize,
    "--menu-line-height": l.lineHeight
  };
  return /* @__PURE__ */ t(
    E,
    {
      onClickAway: () => {
        d && (b(!1), p(-1));
      },
      children: /* @__PURE__ */ M(
        "div",
        {
          style: { position: "relative", display: "inline-flex" },
          onKeyDown: w,
          children: [
            /* @__PURE__ */ t(
              "button",
              {
                ref: r,
                id: i,
                type: "button",
                className: x.overflow,
                "aria-label": v,
                "aria-haspopup": "menu",
                "aria-expanded": d,
                "aria-controls": d ? m : void 0,
                "data-cads-breadcrumb-overflow": "",
                "data-cads-press": "",
                onClick: () => {
                  b((n) => {
                    const o = !n;
                    return p(o ? s[0] ?? -1 : -1), o;
                  });
                },
                children: /* @__PURE__ */ t(B, { name: "ellipsis", family: "solid", fontSize: f.sepIconPx })
              }
            ),
            /* @__PURE__ */ t(
              z,
              {
                open: d,
                anchorEl: r.current,
                placement: "bottom-start",
                style: { zIndex: "var(--z-dropdown)" },
                modifiers: [{ name: "offset", options: { offset: [0, 4] } }],
                children: /* @__PURE__ */ t(
                  L,
                  {
                    id: m,
                    role: "menu",
                    "aria-labelledby": i,
                    "data-cads-breadcrumb-overflow-menu": "",
                    "data-cads-surface": "",
                    "data-cads-surface-state": "enter",
                    ...F(h),
                    elevation: 0,
                    sx: {
                      mt: 0,
                      border: "1px solid var(--border-neutral-primary)",
                      borderRadius: "var(--shape-sm)",
                      backgroundColor: "var(--background-neutral-primary)",
                      boxShadow: "var(--shadow-md)",
                      overflow: "hidden",
                      minWidth: 120,
                      py: "4px",
                      "--cads-surface-origin": "top left"
                    },
                    children: c.map(({ item: n, index: o }) => {
                      const a = !!n.disabled;
                      return /* @__PURE__ */ t(
                        "div",
                        {
                          role: "menuitem",
                          "aria-disabled": a || void 0,
                          "data-cads-dropdown-item": "",
                          "data-active": o === g ? "true" : void 0,
                          tabIndex: -1,
                          className: x.overflowMenuItem,
                          style: u,
                          onMouseDown: (S) => S.preventDefault(),
                          onClick: (S) => {
                            a || y({ item: n }, S);
                          },
                          onMouseEnter: () => {
                            a || p(o);
                          },
                          children: /* @__PURE__ */ t("span", { className: x.overflowMenuItemLabel, children: n.label })
                        },
                        n.key ?? `overflow-${o}`
                      );
                    })
                  }
                )
              }
            )
          ]
        }
      )
    }
  );
}
export {
  Y as Breadcrumbs
};
//# sourceMappingURL=Breadcrumbs.js.map
