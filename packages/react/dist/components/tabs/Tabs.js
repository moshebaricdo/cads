import { jsxs as T, jsx as b, Fragment as Rr } from "react/jsx-runtime";
import V from "@mui/material/ButtonBase";
import { motion as Sr } from "@codeai/cads-variables";
import { useReducedMotion as Br, motion as Lr } from "motion/react";
import { forwardRef as Nr, useId as Er, useRef as P, useState as E, useCallback as X, useEffect as W, useLayoutEffect as or } from "react";
import { FaIcon as F } from "../../icons/FaIcon.js";
import { TABS_SIZE as Mr } from "../../shared/controlSize.js";
import { useExperimentalMotion as Or, springTransition as Tr } from "../../theme/experimentalMotion.js";
import { CloseIconButton as Pr } from "../close-icon-button/CloseIconButton.js";
import I from "./tabs.module.scss.js";
function lr(w) {
  if (w)
    return w === "smile" ? "face-smile" : w === "close" ? "xmark" : w;
}
const qr = Nr(function({
  type: u = "primary",
  size: s = "medium",
  items: d,
  value: K,
  defaultValue: nr,
  onChange: z,
  onItemDismiss: A,
  "aria-label": sr,
  className: ir
}, dr) {
  var ar;
  const o = Mr[s], U = Er(), f = P(null), m = P([]), C = P(!1), Y = P(!1), Z = K !== void 0, [cr, br] = E(
    nr ?? ((ar = d.find((r) => !r.disabled)) == null ? void 0 : ar.value)
  ), k = Z ? K : cr, n = u === "secondary", ur = Or(), D = Br(), p = ur && !n, [G, $] = E(null), [fr, _] = E(!1), [c, pr] = E({
    scrollable: !1,
    before: !1,
    after: !1
  }), vr = Tr(
    Sr.indicator.spring,
    D || !fr
  ), mr = (r) => {
    Z || br(r), z == null || z(r);
  }, i = d.map((r, e) => r.disabled ? -1 : e).filter((r) => r >= 0), R = i.find((r) => {
    var e;
    return ((e = d[r]) == null ? void 0 : e.value) === k;
  }) ?? i[0] ?? -1, y = d.findIndex((r) => r.value === k), S = X(() => {
    const r = f.current;
    if (!r) return;
    const e = Math.max(0, r.scrollWidth - r.clientWidth), t = e > 1, a = {
      scrollable: t,
      before: t && r.scrollLeft > 1,
      after: t && r.scrollLeft < e - 1
    };
    pr(
      (l) => l.scrollable === a.scrollable && l.before === a.before && l.after === a.after ? l : a
    );
  }, []), J = X((r) => {
    const e = f.current;
    if (!e) return;
    const t = Math.max(80, Math.round(e.clientWidth * 0.75)) * r;
    e.scrollBy({
      left: t,
      behavior: D ? "auto" : "smooth"
    });
  }, [D]), M = X((r) => {
    const e = f.current, t = m.current[r];
    if (!e || !t) return;
    const a = 24, l = Math.max(0, e.scrollWidth - e.clientWidth), g = t.offsetLeft, L = g + t.offsetWidth, v = e.scrollLeft, j = v + e.clientWidth;
    let x = v;
    g < v + a ? x = g - a : L > j - a && (x = L - e.clientWidth + a);
    const N = Math.max(0, Math.min(l, x));
    Math.abs(N - v) > 1 && e.scrollTo({ left: N, behavior: "auto" });
  }, []), [Q, B] = E(R), yr = i.includes(Q) ? Q : R;
  W(() => {
    B(R);
  }, [R]), or(() => {
    S();
  }, [d, s, u, c.scrollable, S]), W(() => {
    const r = f.current;
    if (!r) return;
    const e = () => S();
    if (typeof ResizeObserver > "u")
      return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
    const t = new ResizeObserver(e);
    t.observe(r);
    for (const a of m.current)
      a && t.observe(a);
    return () => t.disconnect();
  }, [d.length, s, u, c.scrollable, S]), W(() => {
    if (!Y.current) {
      Y.current = !0;
      return;
    }
    y >= 0 && M(y);
  }, [y, M]);
  const O = () => {
    const r = f.current, e = y >= 0 ? m.current[y] : null;
    if (!r || !e) {
      $(null);
      return;
    }
    const t = r.getBoundingClientRect(), a = e.getBoundingClientRect();
    $({
      left: a.left - t.left + r.scrollLeft,
      width: a.width
    }), C.current || (C.current = !0, requestAnimationFrame(() => _(!0)));
  };
  or(() => {
    if (!p) {
      C.current = !1, _(!1), $(null);
      return;
    }
    O();
  }, [p, k, d, s, u, y]), W(() => {
    if (!p) return;
    const r = f.current;
    if (!r || typeof ResizeObserver > "u") return;
    const e = new ResizeObserver(() => O());
    e.observe(r);
    for (const t of m.current)
      t && e.observe(t);
    return window.addEventListener("resize", O), () => {
      e.disconnect(), window.removeEventListener("resize", O);
    };
  }, [p, d.length, s, u, k]);
  const H = (r) => {
    var e;
    B(r), (e = m.current[r]) == null || e.focus(), M(r);
  }, rr = (r, e) => {
    if (i.length === 0) return;
    const t = i.indexOf(r), l = ((t === -1 ? 0 : t) + e + i.length) % i.length;
    H(i[l]);
  }, er = (r) => {
    const e = d[r];
    !e || e.disabled || (B(r), mr(e.value), M(r));
  }, gr = (r, e) => {
    switch (r.key) {
      case "ArrowRight":
        r.preventDefault(), rr(e, 1);
        break;
      case "ArrowLeft":
        r.preventDefault(), rr(e, -1);
        break;
      case "Home": {
        r.preventDefault();
        const t = i[0];
        if (t === void 0) break;
        H(t);
        break;
      }
      case "End": {
        r.preventDefault();
        const t = i[i.length - 1];
        if (t === void 0) break;
        H(t);
        break;
      }
      case " ":
      case "Enter": {
        r.preventDefault(), er(e);
        break;
      }
    }
  }, xr = (r) => {
    const e = r.relatedTarget;
    e instanceof Node && r.currentTarget.contains(e) || B(R);
  }, hr = [I.root, ir].filter(Boolean).join(" "), tr = s === "large" ? "1rem" : s === "small" ? "0.75rem" : s === "extraSmall" ? "0.625rem" : "0.875rem";
  return /* @__PURE__ */ T(
    "div",
    {
      ref: dr,
      className: hr,
      "data-cads-tabs": "",
      "data-type": u,
      "data-size": s,
      "data-overflow": c.scrollable ? "" : void 0,
      children: [
        c.scrollable ? /* @__PURE__ */ b(
          V,
          {
            type: "button",
            "aria-label": "Scroll tabs left",
            disabled: !c.before,
            disableRipple: !0,
            className: I.scrollButton,
            onClick: () => J(-1),
            children: /* @__PURE__ */ b(F, { name: "chevron-left", family: "solid", fontSize: tr })
          }
        ) : null,
        /* @__PURE__ */ T(
          "div",
          {
            ref: f,
            role: "tablist",
            "aria-label": sr,
            className: I.tablist,
            "data-type": u,
            "data-overflow-before": c.before ? "" : void 0,
            "data-overflow-after": c.after ? "" : void 0,
            onBlur: xr,
            onScroll: S,
            style: {
              gap: n ? o.secondaryGroupGap : o.primaryGroupGap
            },
            children: [
              p && G ? /* @__PURE__ */ b(
                Lr.span,
                {
                  "aria-hidden": !0,
                  "data-cads-indicator": "",
                  "data-cads-indicator-spring": "",
                  "data-cads-tabs-indicator": "primary",
                  className: I.indicator,
                  initial: !1,
                  animate: {
                    left: G.left,
                    width: G.width
                  },
                  transition: vr
                }
              ) : null,
              d.map((r, e) => {
                const t = r.value === k, a = !!r.disabled, l = !!r.iconOnly, g = lr(r.startIconName), L = lr(r.endIconName), v = n ? o.secondaryIconPx : o.primaryIconPx, j = `${U}-tab-${r.value}`, x = `${U}-label-${r.value}`, N = g && (l || r.startIconName) ? /* @__PURE__ */ b(F, { name: g, family: "solid", fontSize: v }) : null, Ir = !l && L ? /* @__PURE__ */ b(F, { name: L, family: "solid", fontSize: v }) : null, q = r["aria-label"] ?? (typeof r.label == "string" ? r.label : void 0), wr = n ? t ? {
                  "--tab-bg": "var(--background-neutral-primary)",
                  "--tab-fg": "var(--text-selected-primary-inverse)",
                  "--tab-border-top": "1px solid var(--border-neutral-primary)",
                  "--tab-border-left": "1px solid var(--border-neutral-primary)",
                  "--tab-border-right": "1px solid var(--border-neutral-primary)",
                  // Transparent (not none): reserve 1px so label doesn't shift on select.
                  "--tab-border-bottom": "1px solid transparent",
                  "--tab-bg-hover": "var(--background-neutral-primary)",
                  "--tab-fg-hover": "var(--text-selected-primary-inverse)",
                  "--tab-bg-active": "var(--background-neutral-primary)",
                  "--tab-fg-active": "var(--text-selected-primary-inverse)",
                  "--tab-border-top-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-left-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-right-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-bottom-active": "1px solid transparent",
                  "--tab-disabled-bg": "var(--background-neutral-primary)",
                  "--tab-disabled-fg": "var(--text-disabled-neutral)",
                  "--tab-disabled-border-top": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-left": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-right": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-bottom": "1px solid transparent"
                } : {
                  "--tab-bg": "var(--background-neutral-secondary)",
                  "--tab-fg": "var(--text-neutral-quaternary)",
                  "--tab-border-top": "1px solid var(--border-neutral-primary)",
                  "--tab-border-left": "1px solid var(--border-neutral-primary)",
                  "--tab-border-right": "1px solid var(--border-neutral-primary)",
                  "--tab-border-bottom": "1px solid var(--border-neutral-primary)",
                  "--tab-bg-hover": "var(--background-neutral-tertiary)",
                  "--tab-fg-hover": "var(--text-neutral-primary)",
                  "--tab-bg-active": "var(--background-neutral-primary)",
                  "--tab-fg-active": "var(--text-selected-primary-inverse)",
                  "--tab-border-top-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-left-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-right-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-bottom-active": "1px solid transparent",
                  "--tab-disabled-bg": "var(--background-neutral-primary)",
                  "--tab-disabled-fg": "var(--text-disabled-neutral)",
                  "--tab-disabled-border-top": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-left": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-right": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-bottom": "1px solid var(--border-disabled-neutral)"
                } : t ? {
                  "--tab-bg": "transparent",
                  "--tab-fg": "var(--text-selected-primary-inverse)",
                  "--tab-border-bottom": p ? "2px solid transparent" : "2px solid var(--border-selected-primary)",
                  "--tab-fg-hover": "var(--text-selected-primary-inverse)",
                  ...p ? {} : {
                    "--tab-border-bottom-hover": "2px solid var(--border-selected-strong)"
                  },
                  "--tab-fg-active": "var(--text-selected-primary-inverse)",
                  "--tab-disabled-fg": "var(--text-disabled-neutral)",
                  "--tab-disabled-border-bottom": "2px solid transparent"
                } : {
                  "--tab-bg": "transparent",
                  "--tab-fg": "var(--text-neutral-quaternary)",
                  "--tab-border-bottom": "2px solid transparent",
                  "--tab-fg-hover": "var(--text-neutral-primary)",
                  "--tab-fg-active": "var(--text-selected-primary-inverse)",
                  "--tab-disabled-fg": "var(--text-disabled-neutral)",
                  "--tab-disabled-border-bottom": "2px solid transparent"
                }, kr = {
                  "--tab-height": n ? o.secondaryHeight : o.primaryHeight,
                  "--tab-gap": n ? o.secondaryItemGap : o.primaryItemGap,
                  "--tab-px": l ? n ? o.secondaryIconOnlyPadX : o.primaryIconOnlyPadX : n ? o.secondaryPadX : "0",
                  "--tab-py": n ? "0" : o.primaryPadY,
                  "--tab-font-size": n ? o.secondaryFontSize : o.primaryFontSize,
                  "--tab-line-height": n ? o.secondaryLineHeight : o.primaryLineHeight,
                  "--tab-radius": n ? "var(--shape-sm) var(--shape-sm) 0 0" : "0",
                  "--tab-overflow": n ? "hidden" : "visible",
                  ...l && n ? { minWidth: o.secondaryIconOnlyMinWidth } : {},
                  ...wr
                };
                return /* @__PURE__ */ T(
                  V,
                  {
                    ref: (h) => {
                      m.current[e] = h;
                    },
                    component: "div",
                    id: j,
                    role: "tab",
                    "aria-selected": t,
                    "aria-disabled": a || void 0,
                    "aria-label": l ? q : void 0,
                    "aria-labelledby": l ? void 0 : x,
                    tabIndex: e === yr ? 0 : -1,
                    disabled: a,
                    disableRipple: !0,
                    className: I.tab,
                    style: kr,
                    onClick: () => {
                      a || er(e);
                    },
                    onFocus: () => {
                      a || B(e);
                    },
                    onKeyDown: (h) => gr(h, e),
                    children: [
                      l ? N : /* @__PURE__ */ T(Rr, { children: [
                        N,
                        /* @__PURE__ */ b("span", { id: x, children: r.label }),
                        Ir
                      ] }),
                      r.dismissible ? /* @__PURE__ */ b(
                        Pr,
                        {
                          "aria-label": q ? `Dismiss ${q}` : "Dismiss tab",
                          size: s === "large" ? "medium" : s,
                          color: "secondary",
                          disabled: a,
                          onClick: (h) => {
                            h.stopPropagation(), h.preventDefault(), !a && (A == null || A(r.value));
                          }
                        }
                      ) : null
                    ]
                  },
                  r.value
                );
              })
            ]
          }
        ),
        c.scrollable ? /* @__PURE__ */ b(
          V,
          {
            type: "button",
            "aria-label": "Scroll tabs right",
            disabled: !c.after,
            disableRipple: !0,
            className: I.scrollButton,
            onClick: () => J(1),
            children: /* @__PURE__ */ b(F, { name: "chevron-right", family: "solid", fontSize: tr })
          }
        ) : null
      ]
    }
  );
});
export {
  qr as Tabs
};
//# sourceMappingURL=Tabs.js.map
