import { jsxs as H, jsx as S, Fragment as wr } from "react/jsx-runtime";
import Rr from "@mui/material/ButtonBase";
import { motion as kr } from "@codeai/cads-variables";
import { useReducedMotion as Lr, motion as Sr } from "motion/react";
import { forwardRef as Er, useId as Br, useRef as N, useState as E, useCallback as Q, useEffect as M, useLayoutEffect as rr } from "react";
import { FaIcon as er } from "../../icons/FaIcon.js";
import { TABS_SIZE as Or } from "../../shared/controlSize.js";
import { useExperimentalMotion as Tr, springTransition as Nr } from "../../theme/experimentalMotion.js";
import { CloseIconButton as Mr } from "../close-icon-button/CloseIconButton.js";
import C from "./tabs.module.scss.js";
function tr(x) {
  if (x)
    return x === "smile" ? "face-smile" : x === "close" ? "xmark" : x;
}
const jr = Er(function({
  type: u = "primary",
  size: d = "medium",
  items: l,
  value: j,
  defaultValue: ar,
  onChange: F,
  onItemDismiss: P,
  "aria-label": or,
  className: nr
}, B) {
  var J;
  const o = Or[d], q = Br(), f = N(null), p = N([]), W = N(!1), V = N(!1), X = j !== void 0, [sr, ir] = E(
    ar ?? ((J = l.find((r) => !r.disabled)) == null ? void 0 : J.value)
  ), h = X ? j : sr, n = u === "secondary", lr = Tr(), dr = Lr(), c = lr && !n, [z, A] = E(null), [cr, K] = E(!1), [U, br] = E({
    before: !1,
    after: !1
  }), ur = Nr(
    kr.indicator.spring,
    dr || !cr
  ), fr = (r) => {
    X || ir(r), F == null || F(r);
  }, s = l.map((r, e) => r.disabled ? -1 : e).filter((r) => r >= 0), I = s.find((r) => {
    var e;
    return ((e = l[r]) == null ? void 0 : e.value) === h;
  }) ?? s[0] ?? -1, v = l.findIndex((r) => r.value === h), w = Q(() => {
    const r = f.current;
    if (!r) return;
    const e = Math.max(0, r.scrollWidth - r.clientWidth), t = {
      before: e > 1 && r.scrollLeft > 1,
      after: e > 1 && r.scrollLeft < e - 1
    };
    br(
      (a) => a.before === t.before && a.after === t.after ? a : t
    );
  }, []), O = Q((r) => {
    const e = f.current, t = p.current[r];
    if (!e || !t) return;
    const a = 24, i = Math.max(0, e.scrollWidth - e.clientWidth), m = t.offsetLeft, k = m + t.offsetWidth, b = e.scrollLeft, G = b + e.clientWidth;
    let y = b;
    m < b + a ? y = m - a : k > G - a && (y = k - e.clientWidth + a);
    const L = Math.max(0, Math.min(i, y));
    Math.abs(L - b) > 1 && e.scrollTo({ left: L, behavior: "auto" });
  }, []), [Y, R] = E(I), pr = s.includes(Y) ? Y : I;
  M(() => {
    R(I);
  }, [I]), rr(() => {
    w();
  }, [l, d, u, w]), M(() => {
    const r = f.current;
    if (!r) return;
    const e = () => w();
    if (typeof ResizeObserver > "u")
      return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
    const t = new ResizeObserver(e);
    t.observe(r);
    for (const a of p.current)
      a && t.observe(a);
    return () => t.disconnect();
  }, [l.length, d, u, w]), M(() => {
    if (!V.current) {
      V.current = !0;
      return;
    }
    v >= 0 && O(v);
  }, [v, O]);
  const T = () => {
    const r = f.current, e = v >= 0 ? p.current[v] : null;
    if (!r || !e) {
      A(null);
      return;
    }
    const t = r.getBoundingClientRect(), a = e.getBoundingClientRect();
    A({
      left: a.left - t.left + r.scrollLeft,
      width: a.width
    }), W.current || (W.current = !0, requestAnimationFrame(() => K(!0)));
  };
  rr(() => {
    if (!c) {
      W.current = !1, K(!1), A(null);
      return;
    }
    T();
  }, [c, h, l, d, u, v]), M(() => {
    if (!c) return;
    const r = f.current;
    if (!r || typeof ResizeObserver > "u") return;
    const e = new ResizeObserver(() => T());
    e.observe(r);
    for (const t of p.current)
      t && e.observe(t);
    return window.addEventListener("resize", T), () => {
      e.disconnect(), window.removeEventListener("resize", T);
    };
  }, [c, l.length, d, u, h]);
  const D = (r) => {
    var e;
    R(r), (e = p.current[r]) == null || e.focus(), O(r);
  }, Z = (r, e) => {
    if (s.length === 0) return;
    const t = s.indexOf(r), i = ((t === -1 ? 0 : t) + e + s.length) % s.length;
    D(s[i]);
  }, _ = (r) => {
    const e = l[r];
    !e || e.disabled || (R(r), fr(e.value), O(r));
  }, vr = (r, e) => {
    switch (r.key) {
      case "ArrowRight":
        r.preventDefault(), Z(e, 1);
        break;
      case "ArrowLeft":
        r.preventDefault(), Z(e, -1);
        break;
      case "Home": {
        r.preventDefault();
        const t = s[0];
        if (t === void 0) break;
        D(t);
        break;
      }
      case "End": {
        r.preventDefault();
        const t = s[s.length - 1];
        if (t === void 0) break;
        D(t);
        break;
      }
      case " ":
      case "Enter": {
        r.preventDefault(), _(e);
        break;
      }
    }
  }, mr = (r) => {
    const e = r.relatedTarget;
    e instanceof Node && r.currentTarget.contains(e) || R(I);
  }, yr = (r) => {
    f.current = r, typeof B == "function" ? B(r) : B && (B.current = r);
  }, gr = [C.tablist, nr].filter(Boolean).join(" ");
  return /* @__PURE__ */ H(
    "div",
    {
      ref: yr,
      role: "tablist",
      "aria-label": or,
      className: gr,
      "data-cads-tabs": "",
      "data-type": u,
      "data-overflow-before": U.before ? "" : void 0,
      "data-overflow-after": U.after ? "" : void 0,
      onBlur: mr,
      onScroll: w,
      style: {
        gap: n ? o.secondaryGroupGap : o.primaryGroupGap
      },
      children: [
        c && z ? /* @__PURE__ */ S(
          Sr.span,
          {
            "aria-hidden": !0,
            "data-cads-indicator": "",
            "data-cads-indicator-spring": "",
            "data-cads-tabs-indicator": "primary",
            className: C.indicator,
            initial: !1,
            animate: {
              left: z.left,
              width: z.width
            },
            transition: ur
          }
        ) : null,
        l.map((r, e) => {
          const t = r.value === h, a = !!r.disabled, i = !!r.iconOnly, m = tr(r.startIconName), k = tr(r.endIconName), b = n ? o.secondaryIconPx : o.primaryIconPx, G = `${q}-tab-${r.value}`, y = `${q}-label-${r.value}`, L = m && (i || r.startIconName) ? /* @__PURE__ */ S(er, { name: m, family: "solid", fontSize: b }) : null, xr = !i && k ? /* @__PURE__ */ S(er, { name: k, family: "solid", fontSize: b }) : null, $ = r["aria-label"] ?? (typeof r.label == "string" ? r.label : void 0), hr = n ? t ? {
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
            "--tab-border-bottom": c ? "2px solid transparent" : "2px solid var(--border-selected-primary)",
            "--tab-fg-hover": "var(--text-selected-primary-inverse)",
            ...c ? {} : {
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
          }, Ir = {
            "--tab-height": n ? o.secondaryHeight : o.primaryHeight,
            "--tab-gap": n ? o.secondaryItemGap : o.primaryItemGap,
            "--tab-px": i ? n ? o.secondaryIconOnlyPadX : o.primaryIconOnlyPadX : n ? o.secondaryPadX : "0",
            "--tab-py": n ? "0" : o.primaryPadY,
            "--tab-font-size": n ? o.secondaryFontSize : o.primaryFontSize,
            "--tab-line-height": n ? o.secondaryLineHeight : o.primaryLineHeight,
            "--tab-radius": n ? "var(--shape-sm) var(--shape-sm) 0 0" : "0",
            "--tab-overflow": n ? "hidden" : "visible",
            ...i && n ? { minWidth: o.secondaryIconOnlyMinWidth } : {},
            ...hr
          };
          return /* @__PURE__ */ H(
            Rr,
            {
              ref: (g) => {
                p.current[e] = g;
              },
              component: "div",
              id: G,
              role: "tab",
              "aria-selected": t,
              "aria-disabled": a || void 0,
              "aria-label": i ? $ : void 0,
              "aria-labelledby": i ? void 0 : y,
              tabIndex: e === pr ? 0 : -1,
              disabled: a,
              disableRipple: !0,
              className: C.tab,
              style: Ir,
              onClick: () => {
                a || _(e);
              },
              onFocus: () => {
                a || R(e);
              },
              onKeyDown: (g) => vr(g, e),
              children: [
                i ? L : /* @__PURE__ */ H(wr, { children: [
                  L,
                  /* @__PURE__ */ S("span", { id: y, children: r.label }),
                  xr
                ] }),
                r.dismissible ? /* @__PURE__ */ S(
                  Mr,
                  {
                    "aria-label": $ ? `Dismiss ${$}` : "Dismiss tab",
                    size: d === "large" ? "medium" : d,
                    color: "secondary",
                    disabled: a,
                    onClick: (g) => {
                      g.stopPropagation(), g.preventDefault(), !a && (P == null || P(r.value));
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
  );
});
export {
  jr as Tabs
};
//# sourceMappingURL=Tabs.js.map
