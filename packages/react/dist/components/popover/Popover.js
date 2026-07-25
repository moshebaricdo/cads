import { jsxs as d, jsx as n, Fragment as rt } from "react/jsx-runtime";
import nt from "@mui/material/Box";
import st from "@mui/material/ClickAwayListener";
import it from "@mui/material/Popper";
import { forwardRef as lt, useId as at, useState as O, isValidElement as ct, cloneElement as dt } from "react";
import { useSurfacePresence as ut } from "../../theme/experimentalMotion.js";
import { Button as R } from "../button/Button.js";
import { CloseIconButton as mt } from "../close-icon-button/CloseIconButton.js";
import e from "./popover.module.scss.js";
const ft = 10, pt = 8;
function y(o) {
  return o.startsWith("bottom") ? { side: "bottom", align: o === "bottomLeft" ? "start" : o === "bottomRight" ? "end" : "center" } : o.startsWith("top") ? { side: "top", align: o === "topLeft" ? "start" : o === "topRight" ? "end" : "center" } : o.startsWith("left") ? { side: "left", align: o === "leftTop" ? "start" : o === "leftBottom" ? "end" : "center" } : { side: "right", align: o === "rightTop" ? "start" : o === "rightBottom" ? "end" : "center" };
}
function gt(o) {
  const { side: t, align: r } = y(o), s = t === "bottom" ? "top" : t === "top" ? "bottom" : t === "left" ? "right" : "left";
  return r === "center" ? s : `${s}-${r}`;
}
function ht(o) {
  const { side: t, align: r } = y(o), s = t === "bottom" ? "bottom" : t === "top" ? "top" : t === "left" ? "left" : "right";
  return r === "center" ? t === "left" || t === "right" ? `center ${s}` : `${s} center` : t === "bottom" || t === "top" ? `${s} ${r === "start" ? "left" : "right"}` : `${r === "start" ? "top" : "bottom"} ${s}`;
}
function m(...o) {
  return o.filter(Boolean).join(" ");
}
function vt({ side: o, align: t }) {
  const r = o === "top" || o === "bottom", s = t === "start" ? "flex-start" : t === "end" ? "flex-end" : "center", f = t === "start" ? "flex-start" : t === "end" ? "flex-end" : "center";
  return /* @__PURE__ */ n(
    "div",
    {
      "aria-hidden": !0,
      className: m(
        e.caretWrap,
        r ? e.horizontal : e.vertical,
        e[o]
      ),
      style: r ? { justifyContent: s } : { alignItems: f },
      children: /* @__PURE__ */ n("div", { className: m(e.caretDiamond, e[o]) })
    }
  );
}
const zt = lt(
  function({
    content: t = "textOnly",
    caretPlacement: r = "bottomLeft",
    hasCaret: s = !0,
    title: f = "This is a really long title",
    body: _ = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    image: $,
    customContent: C,
    hasActionRow: F = !0,
    hasStepper: x = !0,
    stepperText: S = "1/3",
    hasPrimaryAction: N = !0,
    hasSecondaryAction: E = !0,
    primaryActionLabel: L = "Next",
    secondaryActionLabel: W = "Back",
    onPrimaryAction: j,
    onSecondaryAction: A,
    isDismissible: V = !0,
    onClose: p,
    open: g,
    defaultOpen: T = !1,
    onOpenChange: h,
    children: u,
    className: X,
    surfaceOnly: D
  }, H) {
    const P = at(), [M, U] = O(null), [q, G] = O(T), k = g !== void 0, v = k ? !!g : q, { mounted: J, exiting: w } = ut(v), a = ct(u) && u.type !== void 0 ? u : null, K = !a && u != null ? u : null, Q = C ?? K, Y = D ?? (a == null && g == null && !T), b = (i) => {
      k || G(i), h == null || h(i), i || p == null || p();
    }, { side: l, align: Z } = y(r), tt = t !== "custom" && F && (N || E || x), z = /* @__PURE__ */ d(
      "div",
      {
        ref: H,
        className: m(e.card, e[t], X),
        "data-cads-component": "Popover",
        role: "dialog",
        "aria-labelledby": t !== "custom" ? P : void 0,
        children: [
          t === "textImage" ? /* @__PURE__ */ n("div", { className: e.imageSlot, children: $ }) : null,
          t === "custom" ? /* @__PURE__ */ n("div", { className: e.customSlot, children: Q ?? /* @__PURE__ */ n("div", { className: e.customFallback, children: "Popover with custom content" }) }) : null,
          t !== "custom" ? /* @__PURE__ */ d("div", { className: e.copy, children: [
            /* @__PURE__ */ n("div", { id: P, className: e.title, children: f }),
            /* @__PURE__ */ n("div", { className: e.body, children: _ })
          ] }) : null,
          tt ? /* @__PURE__ */ d("div", { className: e.actionRow, children: [
            x ? /* @__PURE__ */ n("div", { className: e.stepper, children: S }) : null,
            /* @__PURE__ */ d("div", { className: e.actionButtons, children: [
              E ? /* @__PURE__ */ n(
                R,
                {
                  size: "small",
                  variant: "outlined",
                  color: "secondary",
                  onClick: A,
                  children: W
                }
              ) : null,
              N ? /* @__PURE__ */ n(
                R,
                {
                  size: "small",
                  variant: "contained",
                  color: "primary",
                  onClick: j,
                  children: L
                }
              ) : null
            ] })
          ] }) : null,
          V ? /* @__PURE__ */ n(
            mt,
            {
              onClick: () => b(!1),
              size: "small",
              color: "secondary",
              sx: {
                position: "absolute",
                top: 5,
                right: 5
              }
            }
          ) : null
        ]
      }
    ), ot = l === "top" || l === "bottom", B = /* @__PURE__ */ d(
      "div",
      {
        "data-cads-surface": "",
        ...w ? { "data-cads-surface-state": "exit" } : {},
        className: m(
          e.surfaceWrap,
          ot ? e.horizontal : e.vertical
        ),
        style: {
          "--cads-surface-origin": ht(r)
        },
        children: [
          (l === "bottom" || l === "right") && z,
          s ? /* @__PURE__ */ n(vt, { side: l, align: Z }) : null,
          (l === "top" || l === "left") && z
        ]
      }
    );
    if (Y || !a)
      return B;
    const et = dt(a, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...a.props,
      onClick: (i) => {
        var c, I;
        (I = (c = a.props).onClick) == null || I.call(c, i), U(i.currentTarget), b(!v);
      },
      "aria-expanded": v
    });
    return /* @__PURE__ */ d(rt, { children: [
      et,
      /* @__PURE__ */ n(
        it,
        {
          open: J,
          anchorEl: M,
          placement: gt(r),
          style: { zIndex: "var(--z-popover)" },
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [
                  0,
                  s ? ft : pt
                ]
              }
            }
          ],
          children: /* @__PURE__ */ n(
            st,
            {
              onClickAway: (i) => {
                const c = i.target;
                c instanceof Element && (c.closest("[data-cads-dropdown-menu]") || c.closest("[data-cads-breadcrumb-overflow-menu]")) || w || b(!1);
              },
              children: /* @__PURE__ */ n(nt, { children: B })
            }
          )
        }
      )
    ] });
  }
);
export {
  zt as Popover
};
//# sourceMappingURL=Popover.js.map
