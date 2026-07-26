import { jsxs as d, jsx as n, Fragment as it } from "react/jsx-runtime";
import st from "@mui/material/Box";
import lt from "@mui/material/ClickAwayListener";
import at from "@mui/material/Popper";
import { forwardRef as ct, useId as dt, useState as O, isValidElement as ut, cloneElement as mt } from "react";
import { useExperimentalMotion as ft, useSurfacePresence as pt, surfaceMotionStateAttrs as gt, experimentalMotionHostAttrs as ht } from "../../theme/experimentalMotion.js";
import { Button as R } from "../button/Button.js";
import { CloseIconButton as vt } from "../close-icon-button/CloseIconButton.js";
import e from "./popover.module.scss.js";
const bt = 10, yt = 8;
function y(o) {
  return o.startsWith("bottom") ? { side: "bottom", align: o === "bottomLeft" ? "start" : o === "bottomRight" ? "end" : "center" } : o.startsWith("top") ? { side: "top", align: o === "topLeft" ? "start" : o === "topRight" ? "end" : "center" } : o.startsWith("left") ? { side: "left", align: o === "leftTop" ? "start" : o === "leftBottom" ? "end" : "center" } : { side: "right", align: o === "rightTop" ? "start" : o === "rightBottom" ? "end" : "center" };
}
function xt(o) {
  const { side: t, align: r } = y(o), i = t === "bottom" ? "top" : t === "top" ? "bottom" : t === "left" ? "right" : "left";
  return r === "center" ? i : `${i}-${r}`;
}
function Et(o) {
  const { side: t, align: r } = y(o), i = t === "bottom" ? "bottom" : t === "top" ? "top" : t === "left" ? "left" : "right";
  return r === "center" ? t === "left" || t === "right" ? `center ${i}` : `${i} center` : t === "bottom" || t === "top" ? `${i} ${r === "start" ? "left" : "right"}` : `${r === "start" ? "top" : "bottom"} ${i}`;
}
function m(...o) {
  return o.filter(Boolean).join(" ");
}
function Nt({ side: o, align: t }) {
  const r = o === "top" || o === "bottom", i = t === "start" ? "flex-start" : t === "end" ? "flex-end" : "center", f = t === "start" ? "flex-start" : t === "end" ? "flex-end" : "center";
  return /* @__PURE__ */ n(
    "div",
    {
      "aria-hidden": !0,
      className: m(
        e.caretWrap,
        r ? e.horizontal : e.vertical,
        e[o]
      ),
      style: r ? { justifyContent: i } : { alignItems: f },
      children: /* @__PURE__ */ n("div", { className: m(e.caretDiamond, e[o]) })
    }
  );
}
const St = ct(
  function({
    content: t = "textOnly",
    caretPlacement: r = "bottomLeft",
    hasCaret: i = !0,
    title: f = "This is a really long title",
    body: S = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    image: _,
    customContent: $,
    hasActionRow: C = !0,
    hasStepper: x = !0,
    stepperText: F = "1/3",
    hasPrimaryAction: E = !0,
    hasSecondaryAction: N = !0,
    primaryActionLabel: A = "Next",
    secondaryActionLabel: L = "Back",
    onPrimaryAction: W,
    onSecondaryAction: j,
    isDismissible: M = !0,
    onClose: p,
    open: g,
    defaultOpen: T = !1,
    onOpenChange: h,
    children: u,
    className: V,
    surfaceOnly: H
  }, X) {
    const P = dt(), [D, U] = O(null), [q, G] = O(T), k = g !== void 0, v = k ? !!g : q, J = ft(), {
      mounted: K,
      exiting: w,
      entering: Q
    } = pt(v), a = ut(u) && u.type !== void 0 ? u : null, Y = !a && u != null ? u : null, Z = $ ?? Y, tt = H ?? (a == null && g == null && !T), b = (s) => {
      k || G(s), h == null || h(s), s || p == null || p();
    }, { side: l, align: ot } = y(r), et = t !== "custom" && C && (E || N || x), z = /* @__PURE__ */ d(
      "div",
      {
        ref: X,
        className: m(e.card, e[t], V),
        "data-cads-component": "Popover",
        role: "dialog",
        "aria-labelledby": t !== "custom" ? P : void 0,
        children: [
          t === "textImage" ? /* @__PURE__ */ n("div", { className: e.imageSlot, children: _ }) : null,
          t === "custom" ? /* @__PURE__ */ n("div", { className: e.customSlot, children: Z ?? /* @__PURE__ */ n("div", { className: e.customFallback, children: "Popover with custom content" }) }) : null,
          t !== "custom" ? /* @__PURE__ */ d("div", { className: e.copy, children: [
            /* @__PURE__ */ n("div", { id: P, className: e.title, children: f }),
            /* @__PURE__ */ n("div", { className: e.body, children: S })
          ] }) : null,
          et ? /* @__PURE__ */ d("div", { className: e.actionRow, children: [
            x ? /* @__PURE__ */ n("div", { className: e.stepper, children: F }) : null,
            /* @__PURE__ */ d("div", { className: e.actionButtons, children: [
              N ? /* @__PURE__ */ n(
                R,
                {
                  size: "small",
                  variant: "outlined",
                  color: "secondary",
                  onClick: j,
                  children: L
                }
              ) : null,
              E ? /* @__PURE__ */ n(
                R,
                {
                  size: "small",
                  variant: "contained",
                  color: "primary",
                  onClick: W,
                  children: A
                }
              ) : null
            ] })
          ] }) : null,
          M ? /* @__PURE__ */ n(
            vt,
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
    ), rt = l === "top" || l === "bottom", B = /* @__PURE__ */ d(
      "div",
      {
        "data-cads-surface": "",
        ...ht(J),
        ...gt(Q, w),
        className: m(
          e.surfaceWrap,
          rt ? e.horizontal : e.vertical
        ),
        style: {
          "--cads-surface-origin": Et(r)
        },
        children: [
          (l === "bottom" || l === "right") && z,
          i ? /* @__PURE__ */ n(Nt, { side: l, align: ot }) : null,
          (l === "top" || l === "left") && z
        ]
      }
    );
    if (tt || !a)
      return B;
    const nt = mt(a, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...a.props,
      onClick: (s) => {
        var c, I;
        (I = (c = a.props).onClick) == null || I.call(c, s), U(s.currentTarget), b(!v);
      },
      "aria-expanded": v
    });
    return /* @__PURE__ */ d(it, { children: [
      nt,
      /* @__PURE__ */ n(
        at,
        {
          open: K,
          anchorEl: D,
          placement: xt(r),
          style: { zIndex: "var(--z-popover)" },
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [
                  0,
                  i ? bt : yt
                ]
              }
            }
          ],
          children: /* @__PURE__ */ n(
            lt,
            {
              onClickAway: (s) => {
                const c = s.target;
                c instanceof Element && (c.closest("[data-cads-dropdown-menu]") || c.closest("[data-cads-breadcrumb-overflow-menu]")) || w || b(!1);
              },
              children: /* @__PURE__ */ n(st, { children: B })
            }
          )
        }
      )
    ] });
  }
);
export {
  St as Popover
};
//# sourceMappingURL=Popover.js.map
