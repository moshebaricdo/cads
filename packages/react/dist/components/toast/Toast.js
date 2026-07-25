import { jsxs as B, jsx as e } from "react/jsx-runtime";
import M from "@mui/material/Snackbar";
import { forwardRef as O } from "react";
import { FaIcon as N } from "../../icons/FaIcon.js";
import { TOAST_CHROME as R } from "../../shared/controlSize.js";
import { messagingChrome as F, resolveMessagingIconName as _, defaultStatusIcon as j } from "../../shared/messagingSentiment.js";
import { useExperimentalMotion as A, useSurfacePresence as P } from "../../theme/experimentalMotion.js";
import { Button as D } from "../button/Button.js";
import { CloseIconButton as H } from "../close-icon-button/CloseIconButton.js";
import u from "./toast.module.scss.js";
const W = 64;
function X(t) {
  return t == null || typeof t == "string" && t.trim() === "" ? "Button" : t;
}
function U(...t) {
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
function V(t) {
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
function $(t, o) {
  const { vertical: a, horizontal: r } = k(t);
  return {
    width: "auto",
    maxWidth: `calc(100% - ${o * (r === "center" ? 2 : 1)}px)`,
    ...a === "top" ? { top: o } : { bottom: o },
    ...r === "left" ? { left: o, right: "auto", transform: "none" } : null,
    ...r === "right" ? { right: o, left: "auto", transform: "none" } : null,
    ...r === "center" ? {
      left: "50%",
      right: "auto",
      transform: "translateX(-50%)"
    } : null
  };
}
const q = O(
  function({
    sentiment: o = "primary",
    children: a = "This is a toast.",
    iconName: r,
    hasAction: l = !1,
    actionLabel: p = "Button",
    actionStartIconName: h,
    actionEndIconName: g,
    onAction: b,
    isDismissible: f = !0,
    onClose: n,
    className: m,
    role: c = "status",
    surfaceExiting: v = !1,
    surfaceOrigin: x = "bottom center"
  }, y) {
    const i = F(o), T = j(o), d = r !== !1, s = d ? _(
      typeof r == "string" ? r : void 0,
      T ?? "face-smile"
    ) : null, S = X(p), z = {
      "--toast-border": i.border,
      "--toast-bg": i.background,
      "--toast-icon-color": i.icon,
      "--toast-surface-origin": x
    };
    return /* @__PURE__ */ B(
      "div",
      {
        ref: y,
        role: c,
        className: U(u.surface, m),
        style: z,
        "data-cads-component": "Toast",
        "data-cads-surface": "",
        ...v ? { "data-cads-surface-state": "exit" } : {},
        children: [
          /* @__PURE__ */ B("div", { className: u.content, children: [
            d && s ? /* @__PURE__ */ e("div", { className: u.iconWrap, "aria-hidden": !0, children: /* @__PURE__ */ e(N, { name: s, fontSize: R.iconPx }) }) : null,
            /* @__PURE__ */ e("p", { className: u.text, children: a })
          ] }),
          l || f ? /* @__PURE__ */ B("div", { className: u.trailing, children: [
            l ? /* @__PURE__ */ e(
              D,
              {
                variant: "outlined",
                color: "secondary",
                size: "small",
                startIconName: h,
                endIconName: g,
                onClick: b,
                children: S
              }
            ) : null,
            f ? /* @__PURE__ */ e(
              H,
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
), at = O(function({
  sentiment: o = "primary",
  children: a = "This is a toast.",
  iconName: r,
  hasAction: l = !1,
  actionLabel: p = "Button",
  actionStartIconName: h,
  actionEndIconName: g,
  onAction: b,
  isDismissible: f = !0,
  onClose: n,
  open: m,
  placement: c = "bottomCenter",
  offset: v = W,
  surfaceOnly: x,
  className: y,
  role: i = "status"
}, T) {
  const d = A(), s = x ?? m === void 0, S = !!m, { mounted: z, exiting: w } = P(S), C = V(c), E = k(c), I = /* @__PURE__ */ e(
    q,
    {
      ref: T,
      sentiment: o,
      iconName: r,
      hasAction: l,
      actionLabel: p,
      actionStartIconName: h,
      actionEndIconName: g,
      onAction: b,
      isDismissible: f,
      onClose: n,
      className: y,
      role: i,
      surfaceExiting: !s && w,
      surfaceOrigin: C,
      children: a
    }
  );
  return s ? I : /* @__PURE__ */ e(
    M,
    {
      open: z,
      anchorOrigin: E,
      onClose: (G, L) => {
        L !== "clickaway" && (n == null || n());
      },
      transitionDuration: d ? 0 : void 0,
      slotProps: {
        root: {
          style: $(c, v)
        }
      },
      children: I
    }
  );
});
export {
  at as Toast
};
//# sourceMappingURL=Toast.js.map
