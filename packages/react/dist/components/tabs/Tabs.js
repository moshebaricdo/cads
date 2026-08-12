import { jsxs as T, jsx as b, Fragment as kr } from "react/jsx-runtime";
import ar from "@mui/material/ButtonBase";
import { motion as Br } from "@moshebaricdo/cads-variables";
import { useReducedMotion as Lr, motion as Nr } from "motion/react";
import { forwardRef as Or, useId as Er, useRef as P, useState as O, useCallback as V, useEffect as W, useLayoutEffect as or } from "react";
import { FaIcon as X } from "../../icons/FaIcon.js";
import { TABS_SIZE as Mr } from "../../shared/controlSize.js";
import { useExperimentalMotion as Tr, springTransition as Pr } from "../../theme/experimentalMotion.js";
import { Button as Wr } from "../button/Button.js";
import { CloseIconButton as Cr } from "../close-icon-button/CloseIconButton.js";
import m from "./tabs.module.scss.js";
const Fr = {
  large: { box: "1.5rem", icon: "1rem" },
  medium: { box: "1.125rem", icon: "0.875rem" },
  small: { box: "1.125rem", icon: "0.75rem" },
  extraSmall: { box: "0.8125rem", icon: "0.625rem" }
};
function lr(w) {
  if (w)
    return w === "smile" ? "face-smile" : w === "close" ? "xmark" : w;
}
const Zr = Or(function({
  type: u = "primary",
  size: s = "medium",
  items: d,
  value: _,
  defaultValue: nr,
  onChange: C,
  onItemDismiss: F,
  "aria-label": sr,
  className: ir
}, dr) {
  var tr;
  const l = Mr[s], K = Er(), f = P(null), y = P([]), z = P(!1), Z = P(!1), U = _ !== void 0, [cr, br] = O(
    nr ?? ((tr = d.find((r) => !r.disabled)) == null ? void 0 : tr.value)
  ), S = U ? _ : cr, n = u === "secondary", ur = Tr(), $ = Lr(), p = ur && !n, [A, D] = O(null), [fr, Y] = O(!1), [c, pr] = O({
    scrollable: !1,
    before: !1,
    after: !1
  }), vr = Pr(
    Br.indicator.spring,
    $ || !fr
  ), mr = (r) => {
    U || br(r), C == null || C(r);
  }, i = d.map((r, e) => r.disabled ? -1 : e).filter((r) => r >= 0), R = i.find((r) => {
    var e;
    return ((e = d[r]) == null ? void 0 : e.value) === S;
  }) ?? i[0] ?? -1, x = d.findIndex((r) => r.value === S), k = V(() => {
    const r = f.current;
    if (!r) return;
    const e = Math.max(0, r.scrollWidth - r.clientWidth), t = e > 1, a = {
      scrollable: t,
      before: t && r.scrollLeft > 1,
      after: t && r.scrollLeft < e - 1
    };
    pr(
      (o) => o.scrollable === a.scrollable && o.before === a.before && o.after === a.after ? o : a
    );
  }, []), yr = V((r) => {
    const e = f.current;
    if (!e) return;
    const t = Math.max(80, Math.round(e.clientWidth * 0.75)) * r;
    e.scrollBy({
      left: t,
      behavior: $ ? "auto" : "smooth"
    });
  }, [$]), E = V((r) => {
    const e = f.current, t = y.current[r];
    if (!e || !t) return;
    const a = 24, o = Math.max(0, e.scrollWidth - e.clientWidth), g = t.offsetLeft, L = g + t.offsetWidth, v = e.scrollLeft, j = v + e.clientWidth;
    let h = v;
    g < v + a ? h = g - a : L > j - a && (h = L - e.clientWidth + a);
    const N = Math.max(0, Math.min(o, h));
    Math.abs(N - v) > 1 && e.scrollTo({ left: N, behavior: "auto" });
  }, []), [J, B] = O(R), xr = i.includes(J) ? J : R;
  W(() => {
    B(R);
  }, [R]), or(() => {
    k();
  }, [d, s, u, c.scrollable, k]), W(() => {
    const r = f.current;
    if (!r) return;
    const e = () => k();
    if (typeof ResizeObserver > "u")
      return window.addEventListener("resize", e), () => window.removeEventListener("resize", e);
    const t = new ResizeObserver(e);
    t.observe(r);
    for (const a of y.current)
      a && t.observe(a);
    return () => t.disconnect();
  }, [d.length, s, u, c.scrollable, k]), W(() => {
    if (!Z.current) {
      Z.current = !0;
      return;
    }
    x >= 0 && E(x);
  }, [x, E]);
  const M = () => {
    const r = f.current, e = x >= 0 ? y.current[x] : null;
    if (!r || !e) {
      D(null);
      return;
    }
    const t = r.getBoundingClientRect(), a = e.getBoundingClientRect();
    D({
      left: a.left - t.left + r.scrollLeft,
      width: a.width
    }), z.current || (z.current = !0, requestAnimationFrame(() => Y(!0)));
  };
  or(() => {
    if (!p) {
      z.current = !1, Y(!1), D(null);
      return;
    }
    M();
  }, [p, S, d, s, u, x]), W(() => {
    if (!p) return;
    const r = f.current;
    if (!r || typeof ResizeObserver > "u") return;
    const e = new ResizeObserver(() => M());
    e.observe(r);
    for (const t of y.current)
      t && e.observe(t);
    return window.addEventListener("resize", M), () => {
      e.disconnect(), window.removeEventListener("resize", M);
    };
  }, [p, d.length, s, u, S]);
  const G = (r) => {
    var e;
    B(r), (e = y.current[r]) == null || e.focus(), E(r);
  }, Q = (r, e) => {
    if (i.length === 0) return;
    const t = i.indexOf(r), o = ((t === -1 ? 0 : t) + e + i.length) % i.length;
    G(i[o]);
  }, rr = (r) => {
    const e = d[r];
    !e || e.disabled || (B(r), mr(e.value), E(r));
  }, gr = (r, e) => {
    switch (r.key) {
      case "ArrowRight":
        r.preventDefault(), Q(e, 1);
        break;
      case "ArrowLeft":
        r.preventDefault(), Q(e, -1);
        break;
      case "Home": {
        r.preventDefault();
        const t = i[0];
        if (t === void 0) break;
        G(t);
        break;
      }
      case "End": {
        r.preventDefault();
        const t = i[i.length - 1];
        if (t === void 0) break;
        G(t);
        break;
      }
      case " ":
      case "Enter": {
        r.preventDefault(), rr(e);
        break;
      }
    }
  }, hr = (r) => {
    const e = r.relatedTarget;
    e instanceof Node && r.currentTarget.contains(e) || B(R);
  }, Ir = [m.root, ir].filter(Boolean).join(" "), H = Fr[s === "large" ? "medium" : s], er = (r) => {
    const e = r < 0 ? "Scroll tabs left" : "Scroll tabs right", t = r < 0 ? "chevron-left" : "chevron-right", a = r < 0 ? !c.before : !c.after, o = () => yr(r);
    return n ? /* @__PURE__ */ b(
      ar,
      {
        type: "button",
        "aria-label": e,
        disabled: a,
        disableRipple: !0,
        className: `${m.scrollButton} ${m.scrollButtonCompact}`,
        style: {
          "--tabs-scroll-box": H.box,
          "--tabs-scroll-icon": H.icon
        },
        onClick: o,
        children: /* @__PURE__ */ b(
          X,
          {
            name: t,
            family: "solid",
            fontSize: H.icon
          }
        )
      }
    ) : /* @__PURE__ */ b(
      Wr,
      {
        variant: "text",
        color: "tertiary",
        size: s,
        iconOnly: !0,
        startIconName: t,
        "aria-label": e,
        disabled: a,
        className: m.scrollButton,
        onClick: o
      }
    );
  };
  return /* @__PURE__ */ T(
    "div",
    {
      ref: dr,
      className: Ir,
      "data-cads-tabs": "",
      "data-type": u,
      "data-size": s,
      "data-overflow": c.scrollable ? "" : void 0,
      children: [
        c.scrollable ? er(-1) : null,
        /* @__PURE__ */ T(
          "div",
          {
            ref: f,
            role: "tablist",
            "aria-label": sr,
            className: m.tablist,
            "data-type": u,
            "data-overflow-before": c.before ? "" : void 0,
            "data-overflow-after": c.after ? "" : void 0,
            onBlur: hr,
            onScroll: k,
            style: {
              gap: n ? l.secondaryGroupGap : l.primaryGroupGap
            },
            children: [
              p && A ? /* @__PURE__ */ b(
                Nr.span,
                {
                  "aria-hidden": !0,
                  "data-cads-indicator": "",
                  "data-cads-indicator-spring": "",
                  "data-cads-tabs-indicator": "primary",
                  className: m.indicator,
                  initial: !1,
                  animate: {
                    left: A.left,
                    width: A.width
                  },
                  transition: vr
                }
              ) : null,
              d.map((r, e) => {
                const t = r.value === S, a = !!r.disabled, o = !!r.iconOnly, g = lr(r.startIconName), L = lr(r.endIconName), v = n ? l.secondaryIconPx : l.primaryIconPx, j = `${K}-tab-${r.value}`, h = `${K}-label-${r.value}`, N = g && (o || r.startIconName) ? /* @__PURE__ */ b(X, { name: g, family: "solid", fontSize: v }) : null, wr = !o && L ? /* @__PURE__ */ b(X, { name: L, family: "solid", fontSize: v }) : null, q = r["aria-label"] ?? (typeof r.label == "string" ? r.label : void 0), Sr = n ? t ? {
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
                }, Rr = {
                  "--tab-height": n ? l.secondaryHeight : l.primaryHeight,
                  "--tab-gap": n ? l.secondaryItemGap : l.primaryItemGap,
                  "--tab-px": o ? n ? l.secondaryIconOnlyPadX : l.primaryIconOnlyPadX : n ? l.secondaryPadX : "0",
                  "--tab-py": n ? "0" : l.primaryPadY,
                  "--tab-font-size": n ? l.secondaryFontSize : l.primaryFontSize,
                  "--tab-line-height": n ? l.secondaryLineHeight : l.primaryLineHeight,
                  "--tab-radius": n ? "var(--shape-sm) var(--shape-sm) 0 0" : "0",
                  "--tab-overflow": n ? "hidden" : "visible",
                  ...o && n ? { minWidth: l.secondaryIconOnlyMinWidth } : {},
                  ...Sr
                };
                return /* @__PURE__ */ T(
                  ar,
                  {
                    ref: (I) => {
                      y.current[e] = I;
                    },
                    component: "div",
                    id: j,
                    role: "tab",
                    "aria-selected": t,
                    "aria-disabled": a || void 0,
                    "aria-label": o ? q : void 0,
                    "aria-labelledby": o ? void 0 : h,
                    tabIndex: e === xr ? 0 : -1,
                    disabled: a,
                    disableRipple: !0,
                    className: m.tab,
                    style: Rr,
                    onClick: () => {
                      a || rr(e);
                    },
                    onFocus: () => {
                      a || B(e);
                    },
                    onKeyDown: (I) => gr(I, e),
                    children: [
                      o ? N : /* @__PURE__ */ T(kr, { children: [
                        N,
                        /* @__PURE__ */ b("span", { id: h, children: r.label }),
                        wr
                      ] }),
                      r.dismissible ? /* @__PURE__ */ b(
                        Cr,
                        {
                          "aria-label": q ? `Dismiss ${q}` : "Dismiss tab",
                          size: s === "large" ? "medium" : s,
                          color: "secondary",
                          disabled: a,
                          onClick: (I) => {
                            I.stopPropagation(), I.preventDefault(), !a && (F == null || F(r.value));
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
        c.scrollable ? er(1) : null
      ]
    }
  );
});
export {
  Zr as Tabs
};
//# sourceMappingURL=Tabs.js.map
