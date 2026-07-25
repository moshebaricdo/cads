import { jsx as m, jsxs as M, Fragment as Z } from "react/jsx-runtime";
import _ from "@mui/material/ButtonBase";
import { forwardRef as q, useId as J, useRef as Q, useState as P, useEffect as W } from "react";
import { FaIcon as R } from "../../icons/FaIcon.js";
import { SEGMENTED_SIZE as z } from "../../shared/controlSize.js";
import k from "./segmentedButton.module.scss.js";
function X(l, o) {
  const t = "var(--radius-sm)", d = l === 0, c = l === o - 1;
  return d && c ? { "--seg-tl": t, "--seg-tr": t, "--seg-bl": t, "--seg-br": t } : d ? { "--seg-tl": t, "--seg-tr": "0", "--seg-bl": t, "--seg-br": "0" } : c ? { "--seg-tl": "0", "--seg-tr": t, "--seg-bl": "0", "--seg-br": t } : { "--seg-tl": "0", "--seg-tr": "0", "--seg-bl": "0", "--seg-br": "0" };
}
function Y(l, o, t, d, c) {
  const s = z[l], g = "var(--border-neutral-secondary)";
  return {
    ...X(d, c),
    "--seg-height": s.height,
    "--seg-px": o ? s.iconOnlyPadding : s.paddingInline,
    "--seg-py": o ? s.iconOnlyPadding : s.paddingBlock,
    "--seg-gap": o ? "0" : s.gap,
    "--seg-font-size": s.fontSize,
    "--seg-line-height": s.lineHeight,
    "--seg-flex": o ? "0 0 auto" : "1 1 auto",
    "--seg-width": o ? s.height : void 0,
    "--seg-z": t ? "1" : "0",
    "--seg-bg": t ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--seg-fg": t ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--seg-border": t ? "var(--border-selected-primary)" : g,
    "--seg-bg-hover": t ? "var(--background-selected-primary)" : "var(--background-neutral-tertiary)",
    "--seg-border-hover": t ? "var(--border-selected-strong)" : g,
    "--seg-bg-press": t ? "var(--background-selected-strong)" : "var(--background-neutral-tertiary)",
    "--seg-border-press": t ? "var(--border-selected-strong)" : g,
    "--seg-fg-press": t ? "var(--text-selected-primary)" : "var(--text-neutral-tertiary)",
    "--seg-focus-ring": t ? "var(--border-focused-inverse)" : "var(--border-focused-primary)",
    "--seg-bg-focus": t ? "var(--background-selected-primary)" : "var(--background-brand-light)",
    "--seg-disabled-bg": t ? "var(--background-selected-primary)" : "transparent",
    "--seg-disabled-border": t ? "var(--border-selected-primary)" : "var(--border-disabled-neutral)",
    "--seg-disabled-fg": t ? "var(--text-selected-primary)" : "var(--text-disabled-neutral)"
  };
}
const ae = q(
  function({
    size: o = "medium",
    value: t,
    defaultValue: d,
    onChange: c,
    options: s,
    disabled: g,
    iconOnly: v = !1,
    "aria-label": A,
    className: y
  }, $) {
    var F;
    const I = z[o], T = J(), S = Q([]), x = t !== void 0, [V, j] = P(
      d ?? ((F = s.find((e) => !e.disabled)) == null ? void 0 : F.value)
    ), w = x ? t : V, G = (e) => {
      x || j(e), c == null || c(e);
    }, a = s.map(
      (e, r) => g || e.disabled ? -1 : r
    ).filter((e) => e >= 0), u = a.find((e) => {
      var r;
      return ((r = s[e]) == null ? void 0 : r.value) === w;
    }) ?? a[0] ?? -1, [D, i] = P(u), H = a.includes(D) ? D : u;
    W(() => {
      i(u);
    }, [u]);
    const p = (e) => {
      var r;
      i(e), (r = S.current[e]) == null || r.focus();
    }, B = (e, r) => {
      if (a.length === 0) return;
      const n = a.indexOf(e), f = ((n === -1 ? 0 : n) + r + a.length) % a.length;
      p(a[f]);
    }, E = (e) => {
      const r = s[e];
      !r || g || r.disabled || (i(e), G(r.value));
    }, K = (e, r) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault(), B(r, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault(), B(r, -1);
          break;
        case "Home": {
          e.preventDefault();
          const n = a[0];
          if (n === void 0) break;
          p(n);
          break;
        }
        case "End": {
          e.preventDefault();
          const n = a[a.length - 1];
          if (n === void 0) break;
          p(n);
          break;
        }
        case " ":
        case "Enter": {
          e.preventDefault(), E(r);
          break;
        }
      }
    }, L = (e) => {
      const r = e.relatedTarget;
      r instanceof Node && e.currentTarget.contains(r) || i(u);
    };
    return /* @__PURE__ */ m(
      "div",
      {
        ref: $,
        role: "radiogroup",
        "aria-label": A,
        className: y ? `${k.group} ${y}` : k.group,
        onBlur: L,
        children: s.map((e, r) => {
          const n = e.value === w, b = !!(g || e.disabled), f = e.iconName ? /* @__PURE__ */ m(R, { name: e.iconName, fontSize: I.iconPx }) : null, N = e.endIconName ? /* @__PURE__ */ m(R, { name: e.endIconName, fontSize: I.iconPx }) : null, U = Y(o, v, n, r, s.length);
          return /* @__PURE__ */ m(
            _,
            {
              ref: (h) => {
                S.current[r] = h;
              },
              role: "radio",
              "aria-checked": n,
              id: `${T}-${e.value}`,
              tabIndex: r === H ? 0 : -1,
              disabled: b,
              disableRipple: !0,
              onClick: () => {
                b || E(r);
              },
              onFocus: () => {
                b || i(r);
              },
              onKeyDown: (h) => K(h, r),
              className: k.segment,
              style: U,
              children: v ? f || N : /* @__PURE__ */ M(Z, { children: [
                f,
                e.label,
                N
              ] })
            },
            e.value
          );
        })
      }
    );
  }
);
export {
  ae as SegmentedButton
};
//# sourceMappingURL=SegmentedButton.js.map
