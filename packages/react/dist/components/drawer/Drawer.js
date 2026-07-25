import { jsx as e, jsxs as a } from "react/jsx-runtime";
import y from "@mui/material/Drawer";
import { forwardRef as N } from "react";
import { Button as w } from "../button/Button.js";
import { CloseIconButton as B } from "../close-icon-button/CloseIconButton.js";
import r from "./drawer.module.scss.js";
function D({
  type: v,
  title: t,
  description: i,
  hasDescription: s,
  hasActionRow: n,
  primaryActionLabel: c,
  secondaryActionLabel: l,
  onPrimaryAction: d,
  onSecondaryAction: u,
  children: m,
  isDismissible: f,
  onClose: h,
  className: o,
  surfaceRef: p
}) {
  return /* @__PURE__ */ a(
    "div",
    {
      ref: p,
      className: o ? `${r.surface} ${o}` : r.surface,
      "data-cads-component": "Drawer",
      "data-cads-surface": "",
      role: "dialog",
      "aria-modal": !1,
      style: { "--cads-surface-origin": "bottom center" },
      children: [
        /* @__PURE__ */ a("div", { className: r.inner, children: [
          /* @__PURE__ */ a("div", { className: r.header, children: [
            /* @__PURE__ */ e("h2", { className: r.title, children: t }),
            s ? /* @__PURE__ */ e("div", { className: r.description, children: i }) : null
          ] }),
          v === "customContent" ? /* @__PURE__ */ e("div", { className: r.customSlot, children: m }) : null,
          n ? /* @__PURE__ */ a("div", { className: r.actions, children: [
            /* @__PURE__ */ e(
              w,
              {
                size: "medium",
                variant: "outlined",
                color: "secondary",
                onClick: u,
                children: l
              }
            ),
            /* @__PURE__ */ e(
              w,
              {
                size: "medium",
                variant: "contained",
                color: "primary",
                onClick: d,
                children: c
              }
            )
          ] }) : null
        ] }),
        f ? /* @__PURE__ */ e(
          B,
          {
            onClick: h,
            size: "large",
            color: "secondary",
            sx: {
              position: "absolute",
              top: 11,
              right: 11
            }
          }
        ) : null
      ]
    }
  );
}
const E = N(function({
  type: t = "textOnly",
  title: i = "This is a heading",
  description: s = "This is descriptive text.",
  hasDescription: n = !0,
  hasActionRow: c = !0,
  primaryActionLabel: l = "Button",
  secondaryActionLabel: d = "Button",
  onPrimaryAction: u,
  onSecondaryAction: m,
  children: f,
  isDismissible: h = !0,
  onClose: o,
  open: p = !1,
  surfaceOnly: x = !1,
  className: g
}, k) {
  const b = /* @__PURE__ */ e(
    D,
    {
      surfaceRef: k,
      type: t,
      title: i,
      description: s,
      hasDescription: n,
      hasActionRow: c,
      primaryActionLabel: l,
      secondaryActionLabel: d,
      onPrimaryAction: u,
      onSecondaryAction: m,
      isDismissible: h,
      onClose: o,
      className: g,
      children: f
    }
  );
  return x ? b : /* @__PURE__ */ e(
    y,
    {
      anchor: "bottom",
      open: p,
      onClose: (S, z) => o == null ? void 0 : o(),
      hideBackdrop: !0,
      disableScrollLock: !0,
      disableEnforceFocus: !0,
      slotProps: {
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible"
          }
        }
      },
      children: b
    }
  );
});
export {
  E as Drawer
};
//# sourceMappingURL=Drawer.js.map
