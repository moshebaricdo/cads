import { jsx as r, jsxs as l } from "react/jsx-runtime";
import k from "@mui/material/Dialog";
import { forwardRef as z } from "react";
import { Button as y } from "../button/Button.js";
import { CloseIconButton as I } from "../close-icon-button/CloseIconButton.js";
import e from "./modal.module.scss.js";
const M = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";
function S({
  type: t,
  title: d,
  body: n,
  image: o,
  children: s,
  hasSecondaryAction: c,
  primaryActionLabel: m,
  secondaryActionLabel: u,
  onPrimaryAction: f,
  onSecondaryAction: h,
  isDismissable: p,
  onClose: v,
  className: a,
  surfaceRef: x
}) {
  const i = n ?? "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: x,
      className: a ? `${e.surface} ${a}` : e.surface,
      "data-cads-component": "Modal",
      "data-cads-surface": "",
      role: "dialog",
      "aria-modal": !0,
      style: { "--cads-surface-origin": "center" },
      children: [
        /* @__PURE__ */ l("div", { className: e.header, children: [
          /* @__PURE__ */ r("h2", { className: e.title, children: d }),
          p ? /* @__PURE__ */ r(I, { onClick: v, size: "large", color: "secondary" }) : null
        ] }),
        t === "default" ? /* @__PURE__ */ r("div", { className: e.bodyDefault, children: s ?? /* @__PURE__ */ r("div", { className: e.bodyDefaultText, children: i }) }) : null,
        t === "verticalImage" ? /* @__PURE__ */ l("div", { className: e.bodyVertical, children: [
          /* @__PURE__ */ r("div", { className: e.imageSlotVertical, children: o }),
          /* @__PURE__ */ r("div", { className: e.bodyDefaultText, children: i })
        ] }) : null,
        t === "horizontalImage" ? /* @__PURE__ */ l("div", { className: e.bodyHorizontal, children: [
          /* @__PURE__ */ r("div", { className: e.imageSlotHorizontal, children: o }),
          /* @__PURE__ */ r("div", { className: e.textSlotHorizontal, children: i })
        ] }) : null,
        /* @__PURE__ */ l("div", { className: e.footer, children: [
          c ? /* @__PURE__ */ r(
            y,
            {
              size: "medium",
              variant: "outlined",
              color: "secondary",
              onClick: h,
              children: u
            }
          ) : null,
          /* @__PURE__ */ r(
            y,
            {
              size: "medium",
              variant: "contained",
              color: "primary",
              onClick: f,
              children: m
            }
          )
        ] })
      ]
    }
  );
}
const C = z(function({
  type: d = "default",
  title: n = "Title",
  body: o,
  image: s,
  children: c,
  hasSecondaryAction: m = !0,
  primaryActionLabel: u = "Button",
  secondaryActionLabel: f = "Button",
  onPrimaryAction: h,
  onSecondaryAction: p,
  isDismissable: v = !0,
  onClose: a,
  open: x = !1,
  surfaceOnly: i = !1,
  className: g
}, N) {
  const b = /* @__PURE__ */ r(
    S,
    {
      surfaceRef: N,
      type: d,
      title: n,
      body: o,
      image: s,
      hasSecondaryAction: m,
      primaryActionLabel: u,
      secondaryActionLabel: f,
      onPrimaryAction: h,
      onSecondaryAction: p,
      isDismissable: v,
      onClose: a,
      className: g,
      children: c
    }
  );
  return i ? /* @__PURE__ */ r("div", { className: e.scrim, children: b }) : /* @__PURE__ */ r(
    k,
    {
      open: x,
      onClose: (B, w) => a == null ? void 0 : a(),
      maxWidth: !1,
      fullWidth: !0,
      disableEnforceFocus: !0,
      slotProps: {
        backdrop: {
          sx: { backgroundColor: M }
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
            maxWidth: 800,
            width: "100%",
            m: "24px"
          }
        }
      },
      children: b
    }
  );
});
export {
  C as Modal
};
//# sourceMappingURL=Modal.js.map
