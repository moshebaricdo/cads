import { jsx as r, jsxs as n } from "react/jsx-runtime";
import C from "@mui/material/Dialog";
import { forwardRef as D } from "react";
import { resolveOverlayMaxWidth as M, overlayDismissHandler as I } from "../../shared/overlaySurface.js";
import { Button as N } from "../button/Button.js";
import { CloseIconButton as S } from "../close-icon-button/CloseIconButton.js";
import e from "./modal.module.scss.js";
const W = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)", B = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
function H(a, o) {
  return a ?? /* @__PURE__ */ r("div", { className: e.bodyDefaultText, children: o ?? B });
}
function w({
  type: a,
  title: o,
  body: c,
  image: i,
  children: u,
  hasSecondaryAction: m,
  primaryActionLabel: f,
  secondaryActionLabel: h,
  onPrimaryAction: v,
  onSecondaryAction: p,
  isDismissable: x,
  onClose: s,
  maxWidth: d,
  className: t,
  surfaceRef: y
}) {
  const l = H(u, c), g = M(d);
  return /* @__PURE__ */ n(
    "div",
    {
      ref: y,
      className: t ? `${e.surface} ${t}` : e.surface,
      "data-cads-component": "Modal",
      "data-cads-surface": "",
      "data-cads-surface-state": "enter",
      role: "dialog",
      "aria-modal": !0,
      style: {
        "--cads-surface-origin": "center",
        maxWidth: g
      },
      children: [
        /* @__PURE__ */ n("div", { className: e.header, children: [
          /* @__PURE__ */ r("h2", { className: e.title, children: o }),
          x ? /* @__PURE__ */ r(S, { onClick: s, size: "large", color: "secondary" }) : null
        ] }),
        a === "default" ? /* @__PURE__ */ r("div", { className: e.bodyDefault, children: l }) : null,
        a === "verticalImage" ? /* @__PURE__ */ n("div", { className: e.bodyVertical, children: [
          /* @__PURE__ */ r("div", { className: e.imageSlotVertical, children: i }),
          l
        ] }) : null,
        a === "horizontalImage" ? /* @__PURE__ */ n("div", { className: e.bodyHorizontal, children: [
          /* @__PURE__ */ r("div", { className: e.imageSlotHorizontal, children: i }),
          /* @__PURE__ */ r("div", { className: e.textSlotHorizontal, children: l })
        ] }) : null,
        /* @__PURE__ */ n("div", { className: e.footer, children: [
          m ? /* @__PURE__ */ r(
            N,
            {
              size: "medium",
              variant: "outlined",
              color: "secondary",
              onClick: p,
              children: h
            }
          ) : null,
          /* @__PURE__ */ r(
            N,
            {
              size: "medium",
              variant: "contained",
              color: "primary",
              onClick: v,
              children: f
            }
          )
        ] })
      ]
    }
  );
}
const V = D(function({
  type: o = "default",
  title: c = "Title",
  body: i,
  image: u,
  children: m,
  hasSecondaryAction: f = !0,
  primaryActionLabel: h = "Button",
  secondaryActionLabel: v = "Button",
  onPrimaryAction: p,
  onSecondaryAction: x,
  isDismissable: s = !0,
  onClose: d,
  maxWidth: t,
  open: y = !1,
  surfaceOnly: l = !1,
  className: g
}, k) {
  const z = M(t), b = /* @__PURE__ */ r(
    w,
    {
      surfaceRef: k,
      type: o,
      title: c,
      body: i,
      image: u,
      hasSecondaryAction: f,
      primaryActionLabel: h,
      secondaryActionLabel: v,
      onPrimaryAction: p,
      onSecondaryAction: x,
      isDismissable: s,
      onClose: d,
      maxWidth: t,
      className: g,
      children: m
    }
  );
  return l ? /* @__PURE__ */ r("div", { className: e.scrim, children: b }) : /* @__PURE__ */ r(
    C,
    {
      open: y,
      onClose: I(s, d),
      maxWidth: !1,
      fullWidth: !0,
      disableEnforceFocus: !0,
      slotProps: {
        backdrop: {
          sx: { backgroundColor: W }
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            maxWidth: z,
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
  V as Modal
};
//# sourceMappingURL=Modal.js.map
