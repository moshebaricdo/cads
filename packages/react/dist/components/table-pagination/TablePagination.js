import { jsxs as d, jsx as l } from "react/jsx-runtime";
import { forwardRef as O } from "react";
import { Button as f } from "../button/Button.js";
import { Dropdown as j } from "../dropdown/Dropdown.js";
import { TABLE_PAGINATION_SIZE as k } from "../../shared/controlSize.js";
import s from "./tablePagination.module.scss.js";
function B({
  from: t,
  to: e,
  count: i
}) {
  return `${t}-${e} of ${i !== -1 ? i : `more than ${e}`}`;
}
function M(t) {
  return typeof t == "number" ? t : t.value;
}
function C(t) {
  return typeof t == "number" ? String(t) : t.label;
}
const W = O(
  function({
    size: e = "medium",
    count: i,
    page: r,
    rowsPerPage: o,
    onPageChange: p,
    onRowsPerPageChange: u,
    rowsPerPageOptions: b = [10, 25, 50, 100],
    labelRowsPerPage: c = "Rows per page",
    labelDisplayedRows: v = B,
    disabled: m,
    "aria-label": y,
    className: g
  }, N) {
    const n = k[e], G = i === 0 ? 0 : r * o + 1, S = i === -1 ? (r + 1) * o : Math.min(i, (r + 1) * o), x = i === -1 ? r + 1 : Math.max(0, Math.ceil(i / o) - 1), T = r <= 0, $ = i !== -1 && r >= x, A = b.map((a) => ({
      value: String(M(a)),
      label: C(a)
    })), I = [s.root, g].filter(Boolean).join(" "), L = {
      "--tp-group-gap": n.groupGap,
      "--tp-height": n.height,
      "--tp-mobile-gap": n.mobileGroupGap,
      "--tp-cluster-gap": n.clusterGap,
      "--tp-font-size": n.fontSize,
      "--tp-line-height": n.lineHeight,
      "--tp-divider-height": n.dividerHeight
    };
    return /* @__PURE__ */ d(
      "div",
      {
        ref: N,
        role: "navigation",
        "aria-label": y ?? "Table pagination",
        className: I,
        "data-cads-component": "TablePagination",
        style: L,
        children: [
          /* @__PURE__ */ d("div", { className: s.cluster, children: [
            /* @__PURE__ */ l("span", { className: s.label, children: c }),
            /* @__PURE__ */ l(
              j,
              {
                role: "input",
                size: e,
                color: "secondary",
                width: "hug",
                menuWidth: "trigger",
                labelStyle: "thick",
                value: String(o),
                options: A,
                disabled: m,
                "aria-label": `${typeof c == "string" ? c : "Rows per page"}: ${o}`,
                onChange: (a) => {
                  if (!u) return;
                  const h = Array.isArray(a) ? a[0] : a;
                  if (h == null) return;
                  u({
                    target: { value: h }
                  });
                }
              }
            )
          ] }),
          /* @__PURE__ */ l("div", { "aria-hidden": !0, className: s.divider }),
          /* @__PURE__ */ d("div", { className: s.cluster, children: [
            /* @__PURE__ */ l(
              f,
              {
                variant: "outlined",
                color: "secondary",
                size: e,
                iconOnly: !0,
                startIconName: "chevron-left",
                "aria-label": "Go to previous page",
                disabled: m || T,
                onClick: (a) => {
                  p(a, r - 1);
                }
              }
            ),
            /* @__PURE__ */ l("span", { className: s.label, children: v({ from: G, to: S, count: i, page: r }) }),
            /* @__PURE__ */ l(
              f,
              {
                variant: "outlined",
                color: "secondary",
                size: e,
                iconOnly: !0,
                startIconName: "chevron-right",
                "aria-label": "Go to next page",
                disabled: m || $,
                onClick: (a) => {
                  p(a, r + 1);
                }
              }
            )
          ] })
        ]
      }
    );
  }
);
export {
  W as TablePagination
};
//# sourceMappingURL=TablePagination.js.map
