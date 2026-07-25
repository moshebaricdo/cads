import { jsx as r, jsxs as t, Fragment as I } from "react/jsx-runtime";
import S from "@mui/material/Dialog";
import { forwardRef as w } from "react";
import { FaIcon as C } from "../../icons/FaIcon.js";
import { Button as k } from "../button/Button.js";
import { CloseIconButton as W } from "../close-icon-button/CloseIconButton.js";
import e from "./dialog.module.scss.js";
const z = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";
function B(...i) {
  return i.filter(Boolean).join(" ");
}
function T({
  type: i,
  title: s,
  description: l,
  hasImage: c,
  image: d,
  topIconName: m,
  hasSecondaryAction: u,
  primaryActionLabel: f,
  secondaryActionLabel: p,
  onPrimaryAction: h,
  onSecondaryAction: g,
  isDismissable: x,
  onClose: v,
  children: o,
  className: b,
  surfaceRef: N
}) {
  const a = i === "iconTop", n = i === "customContent";
  return /* @__PURE__ */ t("div", { className: B(e.outerWrap, b), children: [
    a ? /* @__PURE__ */ r("div", { className: e.iconBadge, children: /* @__PURE__ */ r(
      C,
      {
        name: m || "smile",
        fontSize: "32px",
        style: { color: "var(--text-neutral-white-fixed)" }
      }
    ) }) : null,
    /* @__PURE__ */ t(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-modal": !0,
        "data-cads-component": "Dialog",
        "data-cads-surface": "",
        className: B(
          e.surface,
          i === "default" && e.default,
          a && e.iconTop,
          n && e.customContent
        ),
        style: { "--cads-surface-origin": "center" },
        children: [
          n ? /* @__PURE__ */ r("div", { className: e.customSlot, children: o }) : /* @__PURE__ */ t(I, { children: [
            /* @__PURE__ */ t("div", { className: e.contentWrap, children: [
              i === "default" && c ? /* @__PURE__ */ r("div", { className: e.imageSlot, children: d }) : null,
              /* @__PURE__ */ t("div", { className: e.copy, children: [
                /* @__PURE__ */ r("h2", { className: e.title, children: s }),
                /* @__PURE__ */ r("div", { className: e.description, children: l })
              ] })
            ] }),
            /* @__PURE__ */ t("div", { className: e.actions, children: [
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
  title: l = "Dialog Title",
  description: c = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  hasImage: d = !1,
  image: m,
  topIconName: u = "smile",
  hasSecondaryAction: f = !0,
  primaryActionLabel: p = "Button",
  secondaryActionLabel: h = "Button",
  onPrimaryAction: g,
  onSecondaryAction: x,
  isDismissable: v = !0,
  onClose: o,
  children: b,
  open: N = !1,
  surfaceOnly: a = !1,
  className: n
}, D) {
  const y = /* @__PURE__ */ r(
    T,
    {
      surfaceRef: D,
      type: s,
      title: l,
      description: c,
      hasImage: d,
      image: m,
      topIconName: u,
      hasSecondaryAction: f,
      primaryActionLabel: p,
      secondaryActionLabel: h,
      onPrimaryAction: g,
      onSecondaryAction: x,
      isDismissable: v,
      onClose: o,
      className: n,
      children: b
    }
  );
  return a ? /* @__PURE__ */ r("div", { className: e.scrim, children: y }) : /* @__PURE__ */ r(
    S,
    {
      open: N,
      onClose: (j, F) => o == null ? void 0 : o(),
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
