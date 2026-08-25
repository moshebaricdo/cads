import { jsx as o, jsxs as t, Fragment as S } from "react/jsx-runtime";
import w from "@mui/material/Dialog";
import { forwardRef as M } from "react";
import { FaIcon as z } from "../../icons/FaIcon.js";
import { resolveOverlayMaxWidth as D, overlayDismissHandler as T } from "../../shared/overlaySurface.js";
import { Button as W } from "../button/Button.js";
import { CloseIconButton as j } from "../close-icon-button/CloseIconButton.js";
import e from "./dialog.module.scss.js";
const F = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";
function B(...r) {
  return r.filter(Boolean).join(" ");
}
function R({
  type: r,
  title: c,
  description: d,
  hasImage: m,
  image: u,
  topIconName: f,
  hasSecondaryAction: p,
  primaryActionLabel: h,
  secondaryActionLabel: v,
  onPrimaryAction: x,
  onSecondaryAction: g,
  isDismissable: y,
  onClose: a,
  maxWidth: i,
  children: n,
  className: N,
  surfaceRef: b
}) {
  const s = r === "iconTop", l = r === "customContent", C = D(i);
  return /* @__PURE__ */ t("div", { className: B(e.outerWrap, N), children: [
    s ? /* @__PURE__ */ o("div", { className: e.iconBadge, children: /* @__PURE__ */ o(
      z,
      {
        name: f || "smile",
        fontSize: "32px",
        style: { color: "var(--text-neutral-white-fixed)" }
      }
    ) }) : null,
    /* @__PURE__ */ t(
      "div",
      {
        ref: b,
        role: "dialog",
        "aria-modal": !0,
        "data-cads-component": "Dialog",
        "data-cads-surface": "",
        "data-cads-surface-state": "enter",
        className: B(
          e.surface,
          r === "default" && e.default,
          s && e.iconTop,
          l && e.customContent
        ),
        style: {
          "--cads-surface-origin": "center",
          maxWidth: C
        },
        children: [
          l ? /* @__PURE__ */ o("div", { className: e.customSlot, children: n }) : /* @__PURE__ */ t(S, { children: [
            /* @__PURE__ */ t("div", { className: e.contentWrap, children: [
              r === "default" && m ? /* @__PURE__ */ o("div", { className: e.imageSlot, children: u }) : null,
              /* @__PURE__ */ t("div", { className: e.copy, children: [
                /* @__PURE__ */ o("h2", { className: e.title, children: c }),
                /* @__PURE__ */ o("div", { className: e.description, children: d })
              ] })
            ] }),
            /* @__PURE__ */ t("div", { className: e.actions, children: [
              p ? /* @__PURE__ */ o(
                W,
                {
                  size: "medium",
                  variant: "outlined",
                  color: "secondary",
                  onClick: g,
                  children: v
                }
              ) : null,
              /* @__PURE__ */ o(
                W,
                {
                  size: "medium",
                  variant: "contained",
                  color: "primary",
                  onClick: x,
                  children: h
                }
              )
            ] })
          ] }),
          y ? /* @__PURE__ */ o(
            j,
            {
              onClick: a,
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
const J = M(function({
  type: c = "default",
  title: d = "Dialog Title",
  description: m = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  hasImage: u = !1,
  image: f,
  topIconName: p = "smile",
  hasSecondaryAction: h = !0,
  primaryActionLabel: v = "Button",
  secondaryActionLabel: x = "Button",
  onPrimaryAction: g,
  onSecondaryAction: y,
  isDismissable: a = !1,
  onClose: i,
  maxWidth: n,
  children: N,
  open: b = !1,
  surfaceOnly: s = !1,
  className: l
}, C) {
  const I = D(n), k = /* @__PURE__ */ o(
    R,
    {
      surfaceRef: C,
      type: c,
      title: d,
      description: m,
      hasImage: u,
      image: f,
      topIconName: p,
      hasSecondaryAction: h,
      primaryActionLabel: v,
      secondaryActionLabel: x,
      onPrimaryAction: g,
      onSecondaryAction: y,
      isDismissable: a,
      onClose: i,
      maxWidth: n,
      className: l,
      children: N
    }
  );
  return s ? /* @__PURE__ */ o("div", { className: e.scrim, children: k }) : /* @__PURE__ */ o(
    w,
    {
      open: b,
      onClose: T(a, i),
      maxWidth: !1,
      fullWidth: !0,
      disableEnforceFocus: !0,
      slotProps: {
        backdrop: {
          sx: { backgroundColor: F }
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
            maxWidth: I,
            width: "100%",
            m: "24px"
          }
        }
      },
      children: k
    }
  );
});
export {
  J as Dialog
};
//# sourceMappingURL=Dialog.js.map
