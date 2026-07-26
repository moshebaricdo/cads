import { jsxs as I, jsx as e } from "react/jsx-runtime";
import N from "@mui/material/Snackbar";
import { forwardRef as O } from "react";
import { FaIcon as R } from "../../icons/FaIcon.js";
import { TOAST_CHROME as A } from "../../shared/controlSize.js";
import { messagingChrome as F, resolveMessagingIconName as _, defaultStatusIcon as j } from "../../shared/messagingSentiment.js";
import { surfaceMotionStateAttrs as H, experimentalMotionHostAttrs as P, useExperimentalMotion as D, useSurfacePresence as W } from "../../theme/experimentalMotion.js";
import { Button as X } from "../button/Button.js";
import { CloseIconButton as U } from "../close-icon-button/CloseIconButton.js";
import u from "./toast.module.scss.js";
const V = 64;
function $(t) {
  return t == null || typeof t == "string" && t.trim() === "" ? "Button" : t;
}
function q(...t) {
  return t.filter(Boolean).join(" ");
}
function k(t) {
  switch (t) {
    case "topLeft":
      return { vertical: "top", horizontal: "left" };
    case "topCenter":
      return { vertical: "top", horizontal: "center" };
    case "topRight":
      return { vertical: "top", horizontal: "right" };
    case "bottomLeft":
      return { vertical: "bottom", horizontal: "left" };
    case "bottomRight":
      return { vertical: "bottom", horizontal: "right" };
    case "bottomCenter":
    default:
      return { vertical: "bottom", horizontal: "center" };
  }
}
function G(t) {
  switch (t) {
    case "topLeft":
      return "top left";
    case "topCenter":
      return "top center";
    case "topRight":
      return "top right";
    case "bottomLeft":
      return "bottom left";
    case "bottomRight":
      return "bottom right";
    case "bottomCenter":
    default:
      return "bottom center";
  }
}
function J(t, o) {
  const { vertical: i, horizontal: r } = k(t);
  return {
    width: "auto",
    maxWidth: `calc(100% - ${o * (r === "center" ? 2 : 1)}px)`,
    ...i === "top" ? { top: o } : { bottom: o },
    ...r === "left" ? { left: o, right: "auto", transform: "none" } : null,
    ...r === "right" ? { right: o, left: "auto", transform: "none" } : null,
    ...r === "center" ? {
      left: "50%",
      right: "auto",
      transform: "translateX(-50%)"
    } : null
  };
}
const K = O(
  function({
    sentiment: o = "primary",
    children: i = "This is a toast.",
    iconName: r,
    hasAction: l = !1,
    actionLabel: h = "Button",
    actionStartIconName: g,
    actionEndIconName: b,
    onAction: v,
    isDismissible: f = !0,
    onClose: n,
    className: m,
    role: c = "status",
    surfaceEntering: x = !1,
    surfaceExiting: y = !1,
    surfaceOrigin: T = "bottom center",
    experimentalMotion: S = !1
  }, z) {
    const a = F(o), s = j(o), p = r !== !1, d = p ? _(
      typeof r == "string" ? r : void 0,
      s ?? "face-smile"
    ) : null, B = $(h), E = {
      "--toast-border": a.border,
      "--toast-bg": a.background,
      "--toast-icon-color": a.icon,
      "--toast-surface-origin": T
    };
    return /* @__PURE__ */ I(
      "div",
      {
        ref: z,
        role: c,
        className: q(u.surface, m),
        style: E,
        "data-cads-component": "Toast",
        "data-cads-surface": "",
        ...P(S),
        ...H(x, y),
        children: [
          /* @__PURE__ */ I("div", { className: u.content, children: [
            p && d ? /* @__PURE__ */ e("div", { className: u.iconWrap, "aria-hidden": !0, children: /* @__PURE__ */ e(R, { name: d, fontSize: A.iconPx }) }) : null,
            /* @__PURE__ */ e("p", { className: u.text, children: i })
          ] }),
          l || f ? /* @__PURE__ */ I("div", { className: u.trailing, children: [
            l ? /* @__PURE__ */ e(
              X,
              {
                variant: "outlined",
                color: "secondary",
                size: "small",
                startIconName: g,
                endIconName: b,
                onClick: v,
                children: B
              }
            ) : null,
            f ? /* @__PURE__ */ e(
              U,
              {
                size: "medium",
                color: o === "primary" ? "brand" : o === "neutral" ? "secondary" : o,
                onClick: n
              }
            ) : null
          ] }) : null
        ]
      }
    );
  }
), st = O(function({
  sentiment: o = "primary",
  children: i = "This is a toast.",
  iconName: r,
  hasAction: l = !1,
  actionLabel: h = "Button",
  actionStartIconName: g,
  actionEndIconName: b,
  onAction: v,
  isDismissible: f = !0,
  onClose: n,
  open: m,
  placement: c = "bottomCenter",
  offset: x = V,
  surfaceOnly: y,
  className: T,
  role: S = "status"
}, z) {
  const a = D(), s = y ?? m === void 0, p = !!m, {
    mounted: d,
    exiting: B,
    entering: E
  } = W(p), w = G(c), C = k(c), M = /* @__PURE__ */ e(
    K,
    {
      ref: z,
      sentiment: o,
      iconName: r,
      hasAction: l,
      actionLabel: h,
      actionStartIconName: g,
      actionEndIconName: b,
      onAction: v,
      isDismissible: f,
      onClose: n,
      className: T,
      role: S,
      surfaceEntering: !s && E,
      surfaceExiting: !s && B,
      surfaceOrigin: w,
      experimentalMotion: a,
      children: i
    }
  );
  return s ? M : /* @__PURE__ */ e(
    N,
    {
      open: d,
      anchorOrigin: C,
      onClose: (Q, L) => {
        L !== "clickaway" && (n == null || n());
      },
      transitionDuration: a ? 0 : void 0,
      slotProps: {
        root: {
          style: J(c, x)
        }
      },
      children: M
    }
  );
});
export {
  st as Toast
};
//# sourceMappingURL=Toast.js.map
