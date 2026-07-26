import { jsx as e, jsxs as t } from "react/jsx-runtime";
import y from "@mui/material/Drawer";
import { forwardRef as N } from "react";
import { Button as w } from "../button/Button.js";
import { CloseIconButton as B } from "../close-icon-button/CloseIconButton.js";
import r from "./drawer.module.scss.js";
function D({
  type: v,
  title: o,
  description: i,
  hasDescription: s,
  hasActionRow: c,
  primaryActionLabel: n,
  secondaryActionLabel: l,
  onPrimaryAction: d,
  onSecondaryAction: u,
  children: m,
  isDismissible: f,
  onClose: h,
  className: a,
  surfaceRef: p
}) {
  return /* @__PURE__ */ t(
    "div",
    {
      ref: p,
      className: a ? `${r.surface} ${a}` : r.surface,
      "data-cads-component": "Drawer",
      "data-cads-surface": "",
      "data-cads-surface-state": "enter",
      role: "dialog",
      "aria-modal": !1,
      style: { "--cads-surface-origin": "bottom center" },
      children: [
        /* @__PURE__ */ t("div", { className: r.inner, children: [
          /* @__PURE__ */ t("div", { className: r.header, children: [
            /* @__PURE__ */ e("h2", { className: r.title, children: o }),
            s ? /* @__PURE__ */ e("div", { className: r.description, children: i }) : null
          ] }),
          v === "customContent" ? /* @__PURE__ */ e("div", { className: r.customSlot, children: m }) : null,
          c ? /* @__PURE__ */ t("div", { className: r.actions, children: [
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
                children: n
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
  type: o = "textOnly",
  title: i = "This is a heading",
  description: s = "This is descriptive text.",
  hasDescription: c = !0,
  hasActionRow: n = !0,
  primaryActionLabel: l = "Button",
  secondaryActionLabel: d = "Button",
  onPrimaryAction: u,
  onSecondaryAction: m,
  children: f,
  isDismissible: h = !0,
  onClose: a,
  open: p = !1,
  surfaceOnly: x = !1,
  className: g
}, k) {
  const b = /* @__PURE__ */ e(
    D,
    {
      surfaceRef: k,
      type: o,
      title: i,
      description: s,
      hasDescription: c,
      hasActionRow: n,
      primaryActionLabel: l,
      secondaryActionLabel: d,
      onPrimaryAction: u,
      onSecondaryAction: m,
      isDismissible: h,
      onClose: a,
      className: g,
      children: f
    }
  );
  return x ? b : /* @__PURE__ */ e(
    y,
    {
      anchor: "bottom",
      open: p,
      onClose: (S, z) => a == null ? void 0 : a(),
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
