import { jsxs as E, jsx as m, Fragment as vr } from "react/jsx-runtime";
import mr from "@mui/material/ButtonBase";
import { motion as yr } from "@codeai/cads-variables";
import { useReducedMotion as gr, motion as xr } from "motion/react";
import { forwardRef as hr, useId as Ir, useRef as L, useState as I, useEffect as W, useLayoutEffect as kr } from "react";
import { FaIcon as U } from "../../icons/FaIcon.js";
import { TABS_SIZE as wr } from "../../shared/controlSize.js";
import { useExperimentalMotion as Rr, springTransition as Br } from "../../theme/experimentalMotion.js";
import { CloseIconButton as Nr } from "../close-icon-button/CloseIconButton.js";
import O from "./tabs.module.scss.js";
function Y(c) {
  if (c)
    return c === "smile" ? "face-smile" : c === "close" ? "xmark" : c;
}
const Gr = hr(function({
  type: y = "primary",
  size: u = "medium",
  items: s,
  value: z,
  defaultValue: Z,
  onChange: k,
  onItemDismiss: w,
  "aria-label": _,
  className: J
}, g) {
  var j;
  const t = wr[u], A = Ir(), R = L(null), x = L([]), B = L(!1), D = z !== void 0, [Q, rr] = I(
    Z ?? ((j = s.find((r) => !r.disabled)) == null ? void 0 : j.value)
  ), p = D ? z : Q, o = y === "secondary", er = Rr(), tr = gr(), l = er && !o, [N, S] = I(null), [ar, G] = I(!1), or = Br(
    yr.indicator.spring,
    tr || !ar
  ), nr = (r) => {
    D || rr(r), k == null || k(r);
  }, n = s.map((r, e) => r.disabled ? -1 : e).filter((r) => r >= 0), f = n.find((r) => {
    var e;
    return ((e = s[r]) == null ? void 0 : e.value) === p;
  }) ?? n[0] ?? -1, T = s.findIndex((r) => r.value === p), [$, v] = I(f), ir = n.includes($) ? $ : f;
  W(() => {
    v(f);
  }, [f]);
  const h = () => {
    const r = R.current, e = T >= 0 ? x.current[T] : null;
    if (!r || !e) {
      S(null);
      return;
    }
    const a = r.getBoundingClientRect(), i = e.getBoundingClientRect();
    S({
      left: i.left - a.left + r.scrollLeft,
      width: i.width
    }), B.current || (B.current = !0, requestAnimationFrame(() => G(!0)));
  };
  kr(() => {
    if (!l) {
      B.current = !1, G(!1), S(null);
      return;
    }
    h();
  }, [l, p, s, u, y, T]), W(() => {
    if (!l) return;
    const r = R.current;
    if (!r || typeof ResizeObserver > "u") return;
    const e = new ResizeObserver(() => h());
    e.observe(r);
    for (const a of x.current)
      a && e.observe(a);
    return window.addEventListener("resize", h), () => {
      e.disconnect(), window.removeEventListener("resize", h);
    };
  }, [l, s.length, u, y, p]);
  const F = (r) => {
    var e;
    v(r), (e = x.current[r]) == null || e.focus();
  }, H = (r, e) => {
    if (n.length === 0) return;
    const a = n.indexOf(r), d = ((a === -1 ? 0 : a) + e + n.length) % n.length;
    F(n[d]);
  }, M = (r) => {
    const e = s[r];
    !e || e.disabled || (v(r), nr(e.value));
  }, dr = (r, e) => {
    switch (r.key) {
      case "ArrowRight":
        r.preventDefault(), H(e, 1);
        break;
      case "ArrowLeft":
        r.preventDefault(), H(e, -1);
        break;
      case "Home": {
        r.preventDefault();
        const a = n[0];
        if (a === void 0) break;
        F(a);
        break;
      }
      case "End": {
        r.preventDefault();
        const a = n[n.length - 1];
        if (a === void 0) break;
        F(a);
        break;
      }
      case " ":
      case "Enter": {
        r.preventDefault(), M(e);
        break;
      }
    }
  }, sr = (r) => {
    const e = r.relatedTarget;
    e instanceof Node && r.currentTarget.contains(e) || v(f);
  }, lr = (r) => {
    R.current = r, typeof g == "function" ? g(r) : g && (g.current = r);
  }, br = [O.tablist, J].filter(Boolean).join(" ");
  return /* @__PURE__ */ E(
    "div",
    {
      ref: lr,
      role: "tablist",
      "aria-label": _,
      className: br,
      "data-cads-tabs": "",
      "data-type": y,
      onBlur: sr,
      style: {
        gap: o ? t.secondaryGroupGap : t.primaryGroupGap
      },
      children: [
        l && N ? /* @__PURE__ */ m(
          xr.span,
          {
            "aria-hidden": !0,
            "data-cads-indicator": "",
            "data-cads-indicator-spring": "",
            "data-cads-tabs-indicator": "primary",
            className: O.indicator,
            initial: !1,
            animate: {
              left: N.left,
              width: N.width
            },
            transition: or
          }
        ) : null,
        s.map((r, e) => {
          const a = r.value === p, i = !!r.disabled, d = !!r.iconOnly, q = Y(r.startIconName), C = Y(r.endIconName), X = o ? t.secondaryIconPx : t.primaryIconPx, cr = `${A}-tab-${r.value}`, K = `${A}-label-${r.value}`, V = q && (d || r.startIconName) ? /* @__PURE__ */ m(U, { name: q, family: "solid", fontSize: X }) : null, ur = !d && C ? /* @__PURE__ */ m(U, { name: C, family: "solid", fontSize: X }) : null, P = r["aria-label"] ?? (typeof r.label == "string" ? r.label : void 0), pr = o ? a ? {
            "--tab-bg": "var(--background-neutral-primary)",
            "--tab-fg": "var(--text-selected-primary-inverse)",
            "--tab-border-top": "1px solid var(--border-neutral-primary)",
            "--tab-border-left": "1px solid var(--border-neutral-primary)",
            "--tab-border-right": "1px solid var(--border-neutral-primary)",
            "--tab-border-bottom": "none",
            "--tab-bg-hover": "var(--background-neutral-primary)",
            "--tab-fg-hover": "var(--text-selected-primary-inverse)",
            "--tab-bg-active": "var(--background-neutral-primary)",
            "--tab-fg-active": "var(--text-selected-primary-inverse)",
            "--tab-border-top-active": "1px solid var(--border-neutral-primary)",
            "--tab-border-left-active": "1px solid var(--border-neutral-primary)",
            "--tab-border-right-active": "1px solid var(--border-neutral-primary)",
            "--tab-border-bottom-active": "none",
            "--tab-disabled-bg": "var(--background-neutral-primary)",
            "--tab-disabled-fg": "var(--text-disabled-neutral)",
            "--tab-disabled-border-top": "1px solid var(--border-disabled-neutral)",
            "--tab-disabled-border-left": "1px solid var(--border-disabled-neutral)",
            "--tab-disabled-border-right": "1px solid var(--border-disabled-neutral)",
            "--tab-disabled-border-bottom": "none"
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
            "--tab-border-bottom-active": "none",
            "--tab-disabled-bg": "var(--background-neutral-primary)",
            "--tab-disabled-fg": "var(--text-disabled-neutral)",
            "--tab-disabled-border-top": "1px solid var(--border-disabled-neutral)",
            "--tab-disabled-border-left": "1px solid var(--border-disabled-neutral)",
            "--tab-disabled-border-right": "1px solid var(--border-disabled-neutral)",
            "--tab-disabled-border-bottom": "1px solid var(--border-disabled-neutral)"
          } : a ? {
            "--tab-bg": "transparent",
            "--tab-fg": "var(--text-selected-primary-inverse)",
            "--tab-border-bottom": l ? "2px solid transparent" : "2px solid var(--border-selected-primary)",
            "--tab-fg-hover": "var(--text-selected-primary-inverse)",
            ...l ? {} : {
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
          }, fr = {
            "--tab-height": o ? t.secondaryHeight : t.primaryHeight,
            "--tab-gap": o ? t.secondaryItemGap : t.primaryItemGap,
            "--tab-px": d ? o ? t.secondaryIconOnlyPadX : t.primaryIconOnlyPadX : o ? t.secondaryPadX : "0",
            "--tab-py": o ? "0" : t.primaryPadY,
            "--tab-font-size": o ? t.secondaryFontSize : t.primaryFontSize,
            "--tab-line-height": o ? t.secondaryLineHeight : t.primaryLineHeight,
            "--tab-radius": o ? "var(--radius-sm) var(--radius-sm) 0 0" : "0",
            "--tab-overflow": o ? "hidden" : "visible",
            ...d && o ? { minWidth: t.secondaryIconOnlyMinWidth } : {},
            ...pr
          };
          return /* @__PURE__ */ E(
            mr,
            {
              ref: (b) => {
                x.current[e] = b;
              },
              component: "div",
              id: cr,
              role: "tab",
              "aria-selected": a,
              "aria-disabled": i || void 0,
              "aria-label": d ? P : void 0,
              "aria-labelledby": d ? void 0 : K,
              tabIndex: e === ir ? 0 : -1,
              disabled: i,
              disableRipple: !0,
              className: O.tab,
              style: fr,
              onClick: () => {
                i || M(e);
              },
              onFocus: () => {
                i || v(e);
              },
              onKeyDown: (b) => dr(b, e),
              children: [
                d ? V : /* @__PURE__ */ E(vr, { children: [
                  V,
                  /* @__PURE__ */ m("span", { id: K, children: r.label }),
                  ur
                ] }),
                r.dismissible ? /* @__PURE__ */ m(
                  Nr,
                  {
                    "aria-label": P ? `Dismiss ${P}` : "Dismiss tab",
                    size: u === "large" ? "medium" : u,
                    color: "secondary",
                    disabled: i,
                    onClick: (b) => {
                      b.stopPropagation(), b.preventDefault(), !i && (w == null || w(r.value));
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
  Gr as Tabs
};
//# sourceMappingURL=Tabs.js.map
