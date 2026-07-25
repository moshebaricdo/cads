import { jsxs as A, jsx as n } from "react/jsx-runtime";
import G from "@mui/material/Pagination";
import Q from "@mui/material/ButtonBase";
import { forwardRef as ee, useRef as k, useState as H, useLayoutEffect as re } from "react";
import { Button as _ } from "../button/Button.js";
import { FaIcon as $ } from "../../icons/FaIcon.js";
import { TABLE_PAGINATION_SIZE as ae, SEGMENTED_SIZE as ie, TRANSITION_COLORS as te } from "../../shared/controlSize.js";
import u from "./pagination.module.scss.js";
function ne({ page: a, count: d }) {
  return `Page ${a} of ${d}`;
}
function oe(a) {
  return a === "first" || a === "previous" || a === "next" || a === "last";
}
function le(a) {
  return a === "start-ellipsis" || a === "end-ellipsis";
}
function se(a) {
  switch (a) {
    case "first":
      return "backward-step";
    case "previous":
      return "chevron-left";
    case "next":
      return "chevron-right";
    case "last":
      return "forward-step";
    default:
      return "ellipsis";
  }
}
const ve = ee(
  function({
    size: d = "medium",
    layout: l = "auto",
    labelCompactPages: D = ne,
    showFirstButton: R = !0,
    showLastButton: S = !0,
    siblingCount: I = 1,
    boundaryCount: M = 1,
    disabled: g = !1,
    count: f = 1,
    page: N,
    defaultPage: U = 1,
    onChange: y,
    ...O
  }, m) {
    const i = ie[d], b = ae[d], W = k(null), w = k(null), v = k(0), [j, h] = H(!1), [q, V] = H(U), c = N ?? q, x = l === "compact" || l === "auto" && j, X = (e) => {
      W.current = e, typeof m == "function" ? m(e) : m && (m.current = e);
    }, C = (e, o) => {
      N === void 0 && V(o), y == null || y(e, o);
    };
    re(() => {
      if (l !== "auto") {
        h(l === "compact");
        return;
      }
      const e = W.current;
      if (!e) return;
      const o = () => {
        const r = e.clientWidth;
        if (r <= 0) return;
        if (!x) {
          const t = e.querySelector(
            ".MuiPagination-ul"
          );
          t && (v.current = t.scrollWidth, t.scrollWidth > r + 1 && h(!0));
          return;
        }
        const s = w.current;
        if (s) {
          const t = s.scrollWidth;
          v.current = t, t > 0 && t <= r && h(!1);
          return;
        }
        v.current > 0 && r >= v.current && h(!1);
      }, p = new ResizeObserver(o);
      return p.observe(e), o(), () => p.disconnect();
    }, [
      l,
      x,
      d,
      f,
      c,
      I,
      M,
      R,
      S,
      g
    ]);
    const Z = (e) => {
      const o = oe(e.type), p = le(e.type), r = !!e.selected, s = !!(g || e.disabled), t = o || p;
      let z = e.page;
      t && (z = /* @__PURE__ */ n($, { name: se(e.type), fontSize: i.iconPx }));
      const B = {
        backgroundColor: "transparent",
        borderColor: "var(--border-disabled-neutral)",
        color: "var(--text-disabled-neutral)"
      }, L = {
        backgroundColor: "var(--background-disabled-neutral)",
        borderColor: "var(--border-disabled-neutral)",
        color: "var(--text-disabled-neutral-inverse)"
      };
      if (p)
        return /* @__PURE__ */ n(
          "div",
          {
            className: `CadsPagination-item CadsPagination-ellipsis ${u.ellipsis}`,
            "aria-hidden": !0,
            "data-disabled": s ? "true" : void 0,
            style: { "--pg-height": i.height },
            children: /* @__PURE__ */ n($, { name: "ellipsis", fontSize: i.iconPx })
          }
        );
      const K = {
        boxSizing: "border-box",
        margin: 0,
        marginLeft: "-1px",
        minWidth: i.height,
        width: t ? i.height : void 0,
        height: i.height,
        paddingInline: t ? i.iconOnlyPadding : i.paddingInline,
        paddingBlock: t ? i.iconOnlyPadding : i.paddingBlock,
        borderRadius: 0,
        border: "1px solid",
        borderColor: r ? "var(--border-selected-primary)" : "var(--border-neutral-secondary)",
        backgroundColor: r ? "var(--background-selected-primary)" : o ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
        color: r ? "var(--text-selected-primary)" : o ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
        fontFamily: "var(--font-family-main)",
        fontWeight: "var(--font-weight-semi-bold)",
        fontSize: i.fontSize,
        lineHeight: i.lineHeight,
        textTransform: "none",
        transition: te,
        zIndex: r ? 1 : 0,
        ...s ? r ? L : B : null,
        "&:hover": s ? {} : {
          zIndex: 2,
          backgroundColor: r ? "var(--background-selected-primary)" : "var(--background-neutral-tertiary)",
          borderColor: r ? "var(--border-selected-strong)" : "var(--border-neutral-secondary)"
        },
        "&:active": s ? {} : {
          zIndex: 2,
          backgroundColor: r ? "var(--background-selected-strong)" : "var(--background-neutral-tertiary)",
          borderColor: r ? "var(--border-selected-strong)" : "var(--border-neutral-secondary)",
          ...!r && !o ? { color: "var(--text-neutral-tertiary)" } : null
        },
        "&.Mui-focusVisible": s ? {} : {
          zIndex: 3,
          outline: `2px solid ${r ? "var(--border-focused-inverse)" : "var(--border-focused-primary)"}`,
          outlineOffset: -2,
          backgroundColor: r ? "var(--background-selected-primary)" : "var(--background-brand-light)"
        },
        "&.Mui-disabled": {
          opacity: 1,
          ...r ? L : B
        }
      };
      return /* @__PURE__ */ n(
        Q,
        {
          className: "CadsPagination-item",
          centerRipple: !1,
          disableRipple: !0,
          focusRipple: !1,
          disabled: s,
          onClick: e.onClick,
          "aria-label": e["aria-label"],
          "aria-current": r ? "page" : void 0,
          sx: K,
          children: z
        }
      );
    }, T = {
      display: "inline-flex",
      flexWrap: "nowrap",
      alignItems: "stretch",
      gap: 0,
      padding: 0,
      margin: 0,
      listStyle: "none",
      overflowY: "hidden",
      borderRadius: "var(--shape-sm)",
      scrollbarWidth: "thin"
    }, P = {
      display: "inline-flex",
      ...l === "segmented" ? { maxWidth: "100%" } : null,
      verticalAlign: "middle",
      "& .MuiPagination-ul": {
        ...T,
        overflowX: l === "segmented" ? "auto" : "visible",
        ...l === "segmented" ? { maxWidth: "100%" } : null
      },
      "& .MuiPagination-ul > li": {
        display: "flex",
        margin: 0,
        padding: 0,
        flexShrink: 0
      },
      "& .MuiPagination-ul > li:first-of-type .CadsPagination-item": {
        marginLeft: "0 !important",
        borderTopLeftRadius: "var(--shape-sm)",
        borderBottomLeftRadius: "var(--shape-sm)"
      },
      "& .MuiPagination-ul > li:last-of-type .CadsPagination-item": {
        borderTopRightRadius: "var(--shape-sm)",
        borderBottomRightRadius: "var(--shape-sm)"
      }
    }, F = {
      display: "inline-flex",
      "& .MuiPagination-ul": {
        ...T,
        overflowX: "visible"
      },
      "& .MuiPagination-ul > li": P["& .MuiPagination-ul > li"],
      "& .MuiPagination-ul > li:first-of-type .CadsPagination-item": P["& .MuiPagination-ul > li:first-of-type .CadsPagination-item"],
      "& .MuiPagination-ul > li:last-of-type .CadsPagination-item": P["& .MuiPagination-ul > li:last-of-type .CadsPagination-item"]
    }, E = {
      disabled: g,
      count: f,
      page: c,
      onChange: C,
      showFirstButton: R,
      showLastButton: S,
      siblingCount: I,
      boundaryCount: M,
      renderItem: Z,
      ...O
    }, Y = {
      "--pg-cluster-gap": b.clusterGap,
      "--pg-cluster-height": b.height,
      "--pg-cluster-font-size": b.fontSize,
      "--pg-cluster-line-height": b.lineHeight
    }, J = /* @__PURE__ */ A(
      "div",
      {
        role: "navigation",
        "aria-label": O["aria-label"] ?? "Pagination",
        className: u.compactCluster,
        style: Y,
        children: [
          /* @__PURE__ */ n(
            _,
            {
              variant: "outlined",
              color: "secondary",
              size: d,
              iconOnly: !0,
              startIconName: "chevron-left",
              "aria-label": "Go to previous page",
              disabled: g || c <= 1,
              onClick: (e) => {
                C(e, c - 1);
              }
            }
          ),
          /* @__PURE__ */ n("span", { className: u.compactLabel, children: D({ page: c, count: f }) }),
          /* @__PURE__ */ n(
            _,
            {
              variant: "outlined",
              color: "secondary",
              size: d,
              iconOnly: !0,
              startIconName: "chevron-right",
              "aria-label": "Go to next page",
              disabled: g || c >= f,
              onClick: (e) => {
                C(e, c + 1);
              }
            }
          )
        ]
      }
    );
    return /* @__PURE__ */ A(
      "div",
      {
        ref: X,
        className: u.root,
        "data-cads-component": "Pagination",
        children: [
          l === "auto" && x ? /* @__PURE__ */ n("div", { "aria-hidden": !0, className: u.measureHidden, children: /* @__PURE__ */ n("div", { ref: w, className: u.measureInner, children: /* @__PURE__ */ n(G, { ...E, sx: F }) }) }) : null,
          x ? J : /* @__PURE__ */ n(G, { ...E, sx: P })
        ]
      }
    );
  }
);
export {
  ve as Pagination
};
//# sourceMappingURL=Pagination.js.map
