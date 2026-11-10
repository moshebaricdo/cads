import { jsx as r, jsxs as l } from "react/jsx-runtime";
import I from "@mui/material/Dialog";
import { forwardRef as W } from "react";
import { resolveOverlayMaxWidth as k, overlayDismissHandler as B } from "../../shared/overlaySurface.js";
import { Button as M } from "../button/Button.js";
import { CloseIconButton as C } from "../close-icon-button/CloseIconButton.js";
import e from "./modal.module.scss.js";
const H = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)", S = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
function w(a, o) {
  return a ?? /* @__PURE__ */ r("div", { className: e.bodyDefaultText, children: o ?? S });
}
function E({
  type: a,
  title: o,
  body: u,
  image: s,
  children: m,
  footerStartContent: t,
  hasSecondaryAction: f,
  primaryActionLabel: h,
  secondaryActionLabel: v,
  onPrimaryAction: p,
  onSecondaryAction: x,
  isDismissable: y,
  onClose: d,
  maxWidth: c,
  className: i,
  surfaceRef: g
}) {
  const n = w(m, u), N = k(c);
  return /* @__PURE__ */ l(
    "div",
    {
      ref: g,
      className: i ? `${e.surface} ${i}` : e.surface,
      "data-cads-component": "Modal",
      "data-cads-surface": "",
      "data-cads-surface-state": "enter",
      role: "dialog",
      "aria-modal": !0,
      style: {
        "--cads-surface-origin": "center",
        maxWidth: N
      },
      children: [
        /* @__PURE__ */ l("div", { className: e.header, children: [
          /* @__PURE__ */ r("h2", { className: e.title, children: o }),
          y ? /* @__PURE__ */ r(C, { onClick: d, size: "large", color: "secondary" }) : null
        ] }),
        a === "default" ? /* @__PURE__ */ r("div", { className: e.bodyDefault, children: n }) : null,
        a === "verticalImage" ? /* @__PURE__ */ l("div", { className: e.bodyVertical, children: [
          /* @__PURE__ */ r("div", { className: e.imageSlotVertical, children: s }),
          n
        ] }) : null,
        a === "horizontalImage" ? /* @__PURE__ */ l("div", { className: e.bodyHorizontal, children: [
          /* @__PURE__ */ r("div", { className: e.imageSlotHorizontal, children: s }),
          /* @__PURE__ */ r("div", { className: e.textSlotHorizontal, children: n })
        ] }) : null,
        /* @__PURE__ */ l("div", { className: e.footer, children: [
          t != null && t !== !1 ? /* @__PURE__ */ r("div", { className: e.footerStart, "data-slot": "footer-start", children: t }) : null,
          /* @__PURE__ */ l("div", { className: e.footerEnd, children: [
            f ? /* @__PURE__ */ r(
              M,
              {
                size: "medium",
                variant: "outlined",
                color: "secondary",
                onClick: x,
                children: v
              }
            ) : null,
            /* @__PURE__ */ r(
              M,
              {
                size: "medium",
                variant: "contained",
                color: "primary",
                onClick: p,
                children: h
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const $ = W(function({
  type: o = "default",
  title: u = "Title",
  body: s,
  image: m,
  children: t,
  footerStartContent: f,
  hasSecondaryAction: h = !0,
  primaryActionLabel: v = "Button",
  secondaryActionLabel: p = "Button",
  onPrimaryAction: x,
  onSecondaryAction: y,
  isDismissable: d = !0,
  onClose: c,
  maxWidth: i,
  open: g = !1,
  surfaceOnly: n = !1,
  className: N
}, z) {
  const D = k(i), b = /* @__PURE__ */ r(
    E,
    {
      surfaceRef: z,
      type: o,
      title: u,
      body: s,
      image: m,
      footerStartContent: f,
      hasSecondaryAction: h,
      primaryActionLabel: v,
      secondaryActionLabel: p,
      onPrimaryAction: x,
      onSecondaryAction: y,
      isDismissable: d,
      onClose: c,
      maxWidth: i,
      className: N,
      children: t
    }
  );
  return n ? /* @__PURE__ */ r("div", { className: e.scrim, children: b }) : /* @__PURE__ */ r(
    I,
    {
      open: g,
      onClose: B(d, c),
      maxWidth: !1,
      fullWidth: !0,
      disableEnforceFocus: !0,
      slotProps: {
        backdrop: {
          sx: { backgroundColor: H }
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            maxWidth: D,
            maxHeight: "calc(100% - 48px)",
            width: "100%",
            m: "24px",
            display: "flex",
            flexDirection: "column"
          }
        }
      },
      children: b
    }
  );
});
export {
  $ as Modal
};
//# sourceMappingURL=Modal.js.map
