import { jsx as r, jsxs as o } from "react/jsx-runtime";
import k from "@mui/material/Dialog";
import { forwardRef as z } from "react";
import { Button as y } from "../button/Button.js";
import { CloseIconButton as D } from "../close-icon-button/CloseIconButton.js";
import e from "./modal.module.scss.js";
const I = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)", M = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
function S(a, i) {
  return a ?? /* @__PURE__ */ r("div", { className: e.bodyDefaultText, children: i ?? M });
}
function B({
  type: a,
  title: i,
  body: c,
  image: n,
  children: s,
  hasSecondaryAction: d,
  primaryActionLabel: u,
  secondaryActionLabel: m,
  onPrimaryAction: f,
  onSecondaryAction: h,
  isDismissable: p,
  onClose: x,
  className: t,
  surfaceRef: v
}) {
  const l = S(s, c);
  return /* @__PURE__ */ o(
    "div",
    {
      ref: v,
      className: t ? `${e.surface} ${t}` : e.surface,
      "data-cads-component": "Modal",
      "data-cads-surface": "",
      "data-cads-surface-state": "enter",
      role: "dialog",
      "aria-modal": !0,
      style: { "--cads-surface-origin": "center" },
      children: [
        /* @__PURE__ */ o("div", { className: e.header, children: [
          /* @__PURE__ */ r("h2", { className: e.title, children: i }),
          p ? /* @__PURE__ */ r(D, { onClick: x, size: "large", color: "secondary" }) : null
        ] }),
        a === "default" ? /* @__PURE__ */ r("div", { className: e.bodyDefault, children: l }) : null,
        a === "verticalImage" ? /* @__PURE__ */ o("div", { className: e.bodyVertical, children: [
          /* @__PURE__ */ r("div", { className: e.imageSlotVertical, children: n }),
          l
        ] }) : null,
        a === "horizontalImage" ? /* @__PURE__ */ o("div", { className: e.bodyHorizontal, children: [
          /* @__PURE__ */ r("div", { className: e.imageSlotHorizontal, children: n }),
          /* @__PURE__ */ r("div", { className: e.textSlotHorizontal, children: l })
        ] }) : null,
        /* @__PURE__ */ o("div", { className: e.footer, children: [
          d ? /* @__PURE__ */ r(
            y,
            {
              size: "medium",
              variant: "outlined",
              color: "secondary",
              onClick: h,
              children: m
            }
          ) : null,
          /* @__PURE__ */ r(
            y,
            {
              size: "medium",
              variant: "contained",
              color: "primary",
              onClick: f,
              children: u
            }
          )
        ] })
      ]
    }
  );
}
const j = z(function({
  type: i = "default",
  title: c = "Title",
  body: n,
  image: s,
  children: d,
  hasSecondaryAction: u = !0,
  primaryActionLabel: m = "Button",
  secondaryActionLabel: f = "Button",
  onPrimaryAction: h,
  onSecondaryAction: p,
  isDismissable: x = !0,
  onClose: t,
  open: v = !1,
  surfaceOnly: l = !1,
  className: b
}, N) {
  const g = /* @__PURE__ */ r(
    B,
    {
      surfaceRef: N,
      type: i,
      title: c,
      body: n,
      image: s,
      hasSecondaryAction: u,
      primaryActionLabel: m,
      secondaryActionLabel: f,
      onPrimaryAction: h,
      onSecondaryAction: p,
      isDismissable: x,
      onClose: t,
      className: b,
      children: d
    }
  );
  return l ? /* @__PURE__ */ r("div", { className: e.scrim, children: g }) : /* @__PURE__ */ r(
    k,
    {
      open: v,
      onClose: (w, H) => t == null ? void 0 : t(),
      maxWidth: !1,
      fullWidth: !0,
      disableEnforceFocus: !0,
      slotProps: {
        backdrop: {
          sx: { backgroundColor: I }
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            maxWidth: 800,
            maxHeight: "calc(100% - 48px)",
            width: "100%",
            m: "24px",
            display: "flex",
            flexDirection: "column"
          }
        }
      },
      children: g
    }
  );
});
export {
  j as Modal
};
//# sourceMappingURL=Modal.js.map
