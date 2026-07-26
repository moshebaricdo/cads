import { jsx as u, jsxs as _, Fragment as q } from "react/jsx-runtime";
import J from "@mui/material/ButtonBase";
import { forwardRef as Q, useId as W, useRef as X, useState as A, useEffect as Y, Fragment as C } from "react";
import { FaIcon as P } from "../../icons/FaIcon.js";
import { SEGMENTED_SIZE as R } from "../../shared/controlSize.js";
import { Tooltip as O } from "../tooltip/Tooltip.js";
import p from "./segmentedButton.module.scss.js";
function ee(n, s) {
  const r = "var(--shape-sm)", l = n === 0, g = n === s - 1;
  return l && g ? { "--seg-tl": r, "--seg-tr": r, "--seg-bl": r, "--seg-br": r } : l ? { "--seg-tl": r, "--seg-tr": "0", "--seg-bl": r, "--seg-br": "0" } : g ? { "--seg-tl": "0", "--seg-tr": r, "--seg-bl": "0", "--seg-br": r } : { "--seg-tl": "0", "--seg-tr": "0", "--seg-bl": "0", "--seg-br": "0" };
}
function re(n, s, r, l, g) {
  const a = R[n], i = "var(--border-neutral-secondary)";
  return {
    ...ee(l, g),
    "--seg-height": a.height,
    "--seg-px": s ? a.iconOnlyPadding : a.paddingInline,
    "--seg-py": s ? a.iconOnlyPadding : a.paddingBlock,
    "--seg-gap": s ? "0" : a.gap,
    "--seg-font-size": a.fontSize,
    "--seg-line-height": a.lineHeight,
    "--seg-flex": s ? "0 0 auto" : "1 1 auto",
    "--seg-width": s ? a.height : void 0,
    "--seg-z": r ? "1" : "0",
    "--seg-bg": r ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--seg-fg": r ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--seg-border": r ? "var(--border-selected-primary)" : i,
    "--seg-bg-hover": r ? "var(--background-selected-primary)" : "var(--background-neutral-tertiary)",
    "--seg-border-hover": r ? "var(--border-selected-strong)" : i,
    "--seg-bg-press": r ? "var(--background-selected-strong)" : "var(--background-neutral-tertiary)",
    "--seg-border-press": r ? "var(--border-selected-strong)" : i,
    "--seg-fg-press": r ? "var(--text-selected-primary)" : "var(--text-neutral-tertiary)",
    "--seg-focus-ring": r ? "var(--border-focused-inverse)" : "var(--border-focused-primary)",
    "--seg-bg-focus": r ? "var(--background-selected-primary)" : "var(--background-brand-light)",
    "--seg-disabled-bg": r ? "var(--background-selected-primary)" : "transparent",
    "--seg-disabled-border": r ? "var(--border-selected-primary)" : "var(--border-disabled-neutral)",
    "--seg-disabled-fg": r ? "var(--text-selected-primary)" : "var(--text-disabled-neutral)"
  };
}
function te(n, s, r) {
  if (n) {
    if (typeof s == "string" && s.trim()) return s;
    if (typeof r == "string" && r.trim()) return r;
  }
}
function se(n, s, r, l) {
  if (n == null || n === !1 || n === "") return r;
  const g = s ? /* @__PURE__ */ u("span", { className: p.segmentTooltipHost, style: l, children: r }) : r;
  return /* @__PURE__ */ u(O, { title: n, placement: "bottom", children: g });
}
const ue = Q(
  function({
    size: s = "medium",
    value: r,
    defaultValue: l,
    onChange: g,
    options: a,
    disabled: i,
    iconOnly: b = !1,
    "aria-label": $,
    className: k
  }, z) {
    var F;
    const I = R[s], H = W(), S = X([]), w = r !== void 0, [V, j] = A(
      l ?? ((F = a.find((e) => !e.disabled)) == null ? void 0 : F.value)
    ), x = w ? r : V, G = (e) => {
      w || j(e), g == null || g(e);
    }, o = a.map(
      (e, t) => i || e.disabled ? -1 : t
    ).filter((e) => e >= 0), d = o.find((e) => {
      var t;
      return ((t = a[e]) == null ? void 0 : t.value) === x;
    }) ?? o[0] ?? -1, [D, f] = A(d), K = o.includes(D) ? D : d;
    Y(() => {
      f(d);
    }, [d]);
    const h = (e) => {
      var t;
      f(e), (t = S.current[e]) == null || t.focus();
    }, N = (e, t) => {
      if (o.length === 0) return;
      const c = o.indexOf(e), v = ((c === -1 ? 0 : c) + t + o.length) % o.length;
      h(o[v]);
    }, B = (e) => {
      const t = a[e];
      !t || i || t.disabled || (f(e), G(t.value));
    }, L = (e, t) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault(), N(t, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault(), N(t, -1);
          break;
        case "Home": {
          e.preventDefault();
          const c = o[0];
          if (c === void 0) break;
          h(c);
          break;
        }
        case "End": {
          e.preventDefault();
          const c = o[o.length - 1];
          if (c === void 0) break;
          h(c);
          break;
        }
        case " ":
        case "Enter": {
          e.preventDefault(), B(t);
          break;
        }
      }
    }, U = (e) => {
      const t = e.relatedTarget;
      t instanceof Node && e.currentTarget.contains(t) || f(d);
    };
    return /* @__PURE__ */ u(
      "div",
      {
        ref: z,
        role: "radiogroup",
        "aria-label": $,
        className: k ? `${p.group} ${k}` : p.group,
        onBlur: U,
        children: a.map((e, t) => {
          const c = e.value === x, m = !!(i || e.disabled), v = e.iconName ? /* @__PURE__ */ u(P, { name: e.iconName, fontSize: I.iconPx }) : null, E = e.endIconName ? /* @__PURE__ */ u(P, { name: e.endIconName, fontSize: I.iconPx }) : null, T = re(s, b, c, t, a.length), M = te(
            b,
            e.label,
            e.tooltip
          ), Z = /* @__PURE__ */ u(
            J,
            {
              ref: (y) => {
                S.current[t] = y;
              },
              role: "radio",
              "aria-checked": c,
              "aria-label": M,
              id: `${H}-${e.value}`,
              tabIndex: t === K ? 0 : -1,
              disabled: m,
              disableRipple: !0,
              onClick: () => {
                m || B(t);
              },
              onFocus: () => {
                m || f(t);
              },
              onKeyDown: (y) => L(y, t),
              className: p.segment,
              style: T,
              children: b ? v || E : /* @__PURE__ */ _(q, { children: [
                v,
                e.label,
                E
              ] })
            }
          );
          return /* @__PURE__ */ u(C, { children: se(e.tooltip, m, Z, T) }, e.value);
        })
      }
    );
  }
);
export {
  ue as SegmentedButton
};
//# sourceMappingURL=SegmentedButton.js.map
