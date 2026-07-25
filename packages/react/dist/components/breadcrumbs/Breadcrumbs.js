import { jsx as r, jsxs as S, Fragment as C } from "react/jsx-runtime";
import D from "@mui/material/ClickAwayListener";
import E from "@mui/material/Paper";
import L from "@mui/material/Popper";
import { forwardRef as z, useId as R, useMemo as N, Fragment as O, useState as M, useRef as H } from "react";
import { FaIcon as B } from "../../icons/FaIcon.js";
import { BREADCRUMB_SIZE as I } from "../../shared/controlSize.js";
import y from "./breadcrumbs.module.scss.js";
function P(n, m, f, b) {
  const u = Math.max(0, Math.floor(f)), l = Math.max(0, Math.floor(b)), d = Math.max(2, Math.floor(m));
  if (n.length <= d)
    return n.map((t, i) => ({ kind: "item", item: t, index: i }));
  if (u + l >= n.length)
    return n.map((t, i) => ({ kind: "item", item: t, index: i }));
  const c = n.slice(0, u).map((t, i) => ({
    kind: "item",
    item: t,
    index: i
  })), h = n.length - l, p = n.slice(u, h).map((t, i) => ({
    item: t,
    index: u + i
  })), g = n.slice(h).map((t, i) => ({
    kind: "item",
    item: t,
    index: h + i
  }));
  return [
    ...c,
    { kind: "overflow", items: p },
    ...g
  ];
}
const q = z(
  function({
    size: m = "medium",
    items: f,
    maxItems: b = 8,
    itemsBeforeCollapse: u = 1,
    itemsAfterCollapse: l = 1,
    expandText: d = "Show path",
    "aria-label": c = "Breadcrumb",
    className: h,
    style: p
  }, g) {
    const t = I[m], i = R(), s = f.some((e) => e.current), k = N(
      () => P(f, b, u, l),
      [f, b, u, l]
    ), x = {
      "--crumb-link-gap": t.linkGap,
      "--crumb-font-size": t.fontSize,
      "--crumb-line-height": t.lineHeight,
      "--crumb-trail-gap": t.trailGap,
      "--crumb-sep-box": t.sepBox
    };
    return /* @__PURE__ */ r(
      "nav",
      {
        ref: g,
        "aria-label": c,
        className: h,
        style: { ...x, ...p },
        "data-cads-breadcrumbs": "",
        "data-size": m,
        children: /* @__PURE__ */ r("ol", { className: y.trail, children: k.map((e, o) => {
          const a = o === k.length - 1, v = e.kind === "item" ? e.item.key ?? `crumb-${e.index}` : `${i}-overflow`;
          return /* @__PURE__ */ S(O, { children: [
            /* @__PURE__ */ r("li", { children: e.kind === "item" ? /* @__PURE__ */ r(
              F,
              {
                item: e.item,
                size: m,
                isCurrent: !!e.item.current || !s && e.index === f.length - 1
              }
            ) : /* @__PURE__ */ r(
              K,
              {
                size: m,
                items: e.items,
                menuId: `${i}-overflow-menu`,
                expandText: d
              }
            ) }),
            a ? null : /* @__PURE__ */ r("li", { "aria-hidden": !0, className: y.separator, children: /* @__PURE__ */ r(
              B,
              {
                name: "chevron-right",
                family: "solid",
                fontSize: t.sepIconPx
              }
            ) })
          ] }, v);
        }) })
      }
    );
  }
);
function A() {
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
function F({
  item: n,
  size: m,
  isCurrent: f
}) {
  const b = I[m], u = !!n.disabled, l = !!n.iconName, d = /* @__PURE__ */ S(C, { children: [
    l ? /* @__PURE__ */ r(
      B,
      {
        name: n.iconName,
        family: "solid",
        fontSize: b.iconPx,
        title: n.iconOnly && typeof n.label == "string" ? n.label : void 0
      }
    ) : null,
    n.iconOnly ? l && typeof n.label == "string" ? null : /* @__PURE__ */ r("span", { style: A(), children: n.label }) : n.label
  ] }), c = {
    className: y.link,
    "data-cads-breadcrumb-link": "",
    "data-current": f ? "true" : void 0,
    "data-disabled": u ? "true" : void 0,
    style: { position: "relative" }
  };
  return f ? /* @__PURE__ */ r("span", { ...c, "aria-current": "page", children: d }) : u ? /* @__PURE__ */ r("span", { ...c, "aria-disabled": "true", children: d }) : n.href != null ? /* @__PURE__ */ r("a", { ...c, href: n.href, onClick: n.onClick, "data-cads-press": "", children: d }) : /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      ...c,
      onClick: n.onClick,
      "data-cads-press": "",
      children: d
    }
  );
}
const $ = {
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
function K({
  size: n,
  items: m,
  menuId: f,
  expandText: b
}) {
  const u = I[n], l = $[n === "large" || n === "medium" ? "small" : "extraSmall"], [d, c] = M(!1), [h, p] = M(-1), g = H(null), t = R(), i = (e, o) => {
    const { item: a } = e;
    if (!a.disabled) {
      if (c(!1), p(-1), a.onClick) {
        a.onClick(
          o
        );
        return;
      }
      a.href && typeof window < "u" && window.location.assign(a.href);
    }
  }, s = m.map((e, o) => e.item.disabled ? -1 : o).filter((e) => e >= 0), k = (e) => {
    var o;
    if (d)
      switch (e.key) {
        case "Escape":
          e.stopPropagation(), e.preventDefault(), c(!1), p(-1), (o = g.current) == null || o.focus();
          break;
        case "ArrowDown": {
          if (e.preventDefault(), s.length === 0) break;
          const a = s.indexOf(h), v = s[a === -1 ? 0 : (a + 1) % s.length];
          p(v);
          break;
        }
        case "ArrowUp": {
          if (e.preventDefault(), s.length === 0) break;
          const a = s.indexOf(h), v = s[a <= 0 ? s.length - 1 : (a - 1 + s.length) % s.length];
          p(v);
          break;
        }
        case "Enter":
        case " ": {
          if (h < 0) break;
          e.preventDefault();
          const a = m[h];
          a && !a.item.disabled && i(a, e);
          break;
        }
      }
  }, x = {
    "--menu-padding-left": l.paddingLeft,
    "--menu-padding-right": l.paddingRight,
    "--menu-padding-block": l.paddingBlock,
    "--menu-font-size": l.fontSize,
    "--menu-line-height": l.lineHeight
  };
  return /* @__PURE__ */ r(
    D,
    {
      onClickAway: () => {
        d && (c(!1), p(-1));
      },
      children: /* @__PURE__ */ S(
        "div",
        {
          style: { position: "relative", display: "inline-flex" },
          onKeyDown: k,
          children: [
            /* @__PURE__ */ r(
              "button",
              {
                ref: g,
                id: t,
                type: "button",
                className: y.overflow,
                "aria-label": b,
                "aria-haspopup": "menu",
                "aria-expanded": d,
                "aria-controls": d ? f : void 0,
                "data-cads-breadcrumb-overflow": "",
                "data-cads-press": "",
                onClick: () => {
                  c((e) => {
                    const o = !e;
                    return p(o ? s[0] ?? -1 : -1), o;
                  });
                },
                children: /* @__PURE__ */ r(B, { name: "ellipsis", family: "solid", fontSize: u.sepIconPx })
              }
            ),
            /* @__PURE__ */ r(
              L,
              {
                open: d,
                anchorEl: g.current,
                placement: "bottom-start",
                style: { zIndex: "var(--z-dropdown)" },
                modifiers: [{ name: "offset", options: { offset: [0, 4] } }],
                children: /* @__PURE__ */ r(
                  E,
                  {
                    id: f,
                    role: "menu",
                    "aria-labelledby": t,
                    "data-cads-breadcrumb-overflow-menu": "",
                    "data-cads-surface": "",
                    elevation: 0,
                    sx: {
                      mt: 0,
                      border: "1px solid var(--border-neutral-primary)",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--background-neutral-primary)",
                      boxShadow: "var(--shadow-md)",
                      overflow: "hidden",
                      minWidth: 120,
                      py: "4px",
                      "--cads-surface-origin": "top left"
                    },
                    children: m.map(({ item: e, index: o }) => {
                      const a = !!e.disabled;
                      return /* @__PURE__ */ r(
                        "div",
                        {
                          role: "menuitem",
                          "aria-disabled": a || void 0,
                          "data-cads-dropdown-item": "",
                          "data-active": o === h ? "true" : void 0,
                          tabIndex: -1,
                          className: y.overflowMenuItem,
                          style: x,
                          onMouseDown: (w) => w.preventDefault(),
                          onClick: (w) => {
                            a || i({ item: e }, w);
                          },
                          onMouseEnter: () => {
                            a || p(o);
                          },
                          children: /* @__PURE__ */ r("span", { className: y.overflowMenuItemLabel, children: e.label })
                        },
                        e.key ?? `overflow-${o}`
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
  q as Breadcrumbs
};
//# sourceMappingURL=Breadcrumbs.js.map
