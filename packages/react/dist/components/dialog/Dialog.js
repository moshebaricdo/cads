import { jsx as r, jsxs as i, Fragment as I } from "react/jsx-runtime";
import S from "@mui/material/Dialog";
import { forwardRef as w } from "react";
import { FaIcon as C } from "../../icons/FaIcon.js";
import { Button as k } from "../button/Button.js";
import { CloseIconButton as W } from "../close-icon-button/CloseIconButton.js";
import e from "./dialog.module.scss.js";
const z = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";
function B(...t) {
  return t.filter(Boolean).join(" ");
}
function T({
  type: t,
  title: s,
  description: c,
  hasImage: l,
  image: d,
  topIconName: m,
  hasSecondaryAction: u,
  primaryActionLabel: f,
  secondaryActionLabel: p,
  onPrimaryAction: h,
  onSecondaryAction: g,
  isDismissable: x,
  onClose: v,
  children: a,
  className: b,
  surfaceRef: N
}) {
  const o = t === "iconTop", n = t === "customContent";
  return /* @__PURE__ */ i("div", { className: B(e.outerWrap, b), children: [
    o ? /* @__PURE__ */ r("div", { className: e.iconBadge, children: /* @__PURE__ */ r(
      C,
      {
        name: m || "smile",
        fontSize: "32px",
        style: { color: "var(--text-neutral-white-fixed)" }
      }
    ) }) : null,
    /* @__PURE__ */ i(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-modal": !0,
        "data-cads-component": "Dialog",
        "data-cads-surface": "",
        "data-cads-surface-state": "enter",
        className: B(
          e.surface,
          t === "default" && e.default,
          o && e.iconTop,
          n && e.customContent
        ),
        style: { "--cads-surface-origin": "center" },
        children: [
          n ? /* @__PURE__ */ r("div", { className: e.customSlot, children: a }) : /* @__PURE__ */ i(I, { children: [
            /* @__PURE__ */ i("div", { className: e.contentWrap, children: [
              t === "default" && l ? /* @__PURE__ */ r("div", { className: e.imageSlot, children: d }) : null,
              /* @__PURE__ */ i("div", { className: e.copy, children: [
                /* @__PURE__ */ r("h2", { className: e.title, children: s }),
                /* @__PURE__ */ r("div", { className: e.description, children: c })
              ] })
            ] }),
            /* @__PURE__ */ i("div", { className: e.actions, children: [
              u ? /* @__PURE__ */ r(
                k,
                {
                  size: "medium",
                  variant: "outlined",
                  color: "secondary",
                  onClick: g,
                  children: p
                }
              ) : null,
              /* @__PURE__ */ r(
                k,
                {
                  size: "medium",
                  variant: "contained",
                  color: "primary",
                  onClick: h,
                  children: f
                }
              )
            ] })
          ] }),
          x ? /* @__PURE__ */ r(
            W,
            {
              onClick: v,
              size: "large",
              color: "secondary",
              sx: {
                position: "absolute",
                top: 7,
                right: 7
              }
            }
          ) : null
        ]
      }
    )
  ] });
}
const A = w(function({
  type: s = "default",
  title: c = "Dialog Title",
  description: l = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  hasImage: d = !1,
  image: m,
  topIconName: u = "smile",
  hasSecondaryAction: f = !0,
  primaryActionLabel: p = "Button",
  secondaryActionLabel: h = "Button",
  onPrimaryAction: g,
  onSecondaryAction: x,
  isDismissable: v = !0,
  onClose: a,
  children: b,
  open: N = !1,
  surfaceOnly: o = !1,
  className: n
}, D) {
  const y = /* @__PURE__ */ r(
    T,
    {
      surfaceRef: D,
      type: s,
      title: c,
      description: l,
      hasImage: d,
      image: m,
      topIconName: u,
      hasSecondaryAction: f,
      primaryActionLabel: p,
      secondaryActionLabel: h,
      onPrimaryAction: g,
      onSecondaryAction: x,
      isDismissable: v,
      onClose: a,
      className: n,
      children: b
    }
  );
  return o ? /* @__PURE__ */ r("div", { className: e.scrim, children: y }) : /* @__PURE__ */ r(
    S,
    {
      open: N,
      onClose: (j, F) => a == null ? void 0 : a(),
      maxWidth: !1,
      fullWidth: !0,
      disableEnforceFocus: !0,
      slotProps: {
        backdrop: {
          sx: { backgroundColor: z }
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
      children: y
    }
  );
});
export {
  A as Dialog
};
//# sourceMappingURL=Dialog.js.map
