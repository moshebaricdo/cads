import { jsxs as i, jsx as e } from "react/jsx-runtime";
import { forwardRef as A } from "react";
import { FaIcon as C } from "../../icons/FaIcon.js";
import { ALERT_SIZE as b } from "../../shared/controlSize.js";
import { messagingChrome as j, resolveMessagingIconName as w, defaultStatusIcon as E } from "../../shared/messagingSentiment.js";
import { Button as G } from "../button/Button.js";
import { CloseIconButton as H } from "../close-icon-button/CloseIconButton.js";
import n from "./alert.module.scss.js";
function L(o) {
  return o == null || typeof o == "string" && o.trim() === "" ? "Button" : o;
}
function R(...o) {
  return o.filter(Boolean).join(" ");
}
const q = A(function({
  size: m = "large",
  sentiment: r = "brand",
  children: f = "This is an alert.",
  iconName: a,
  hasAction: c = !1,
  actionLabel: p = "Button",
  actionStartIconName: g,
  actionEndIconName: h,
  onAction: I,
  isDismissible: s = !1,
  onClose: v,
  fullWidth: B = !0,
  className: x,
  role: y = "status"
}, z) {
  const t = b[m], l = j(r), N = E(r), d = a !== !1, u = d ? w(
    typeof a == "string" ? a : void 0,
    N ?? "face-smile"
  ) : null, S = L(p), k = {
    "--alert-min-height": t.minHeight,
    "--alert-px": t.paddingInline,
    "--alert-py": t.paddingBlock,
    "--alert-gap": t.gap,
    "--alert-content-gap": t.contentGap,
    "--alert-action-gap": t.actionGap,
    "--alert-font-size": t.fontSize,
    "--alert-line-height": t.lineHeight,
    "--alert-icon-slot": t.iconSlot,
    "--alert-border": l.border,
    "--alert-bg": l.background,
    "--alert-icon-color": l.icon
  };
  return /* @__PURE__ */ i(
    "div",
    {
      ref: z,
      role: y,
      className: R(n.root, B && n.fullWidth, x),
      style: k,
      "data-cads-component": "Alert",
      children: [
        /* @__PURE__ */ i("div", { className: n.content, children: [
          d && u ? /* @__PURE__ */ e("div", { className: n.iconWrap, "aria-hidden": !0, children: /* @__PURE__ */ e(C, { name: u, fontSize: t.iconPx }) }) : null,
          /* @__PURE__ */ e("p", { className: n.text, children: f })
        ] }),
        c || s ? /* @__PURE__ */ i("div", { className: n.trailing, children: [
          c ? /* @__PURE__ */ e(
            G,
            {
              variant: "outlined",
              color: "secondary",
              size: t.actionButtonSize,
              startIconName: g,
              endIconName: h,
              onClick: I,
              children: S
            }
          ) : null,
          s ? /* @__PURE__ */ e(
            H,
            {
              size: "medium",
              color: r === "neutral" ? "secondary" : r,
              onClick: v
            }
          ) : null
        ] }) : null
      ]
    }
  );
});
export {
  q as Alert
};
//# sourceMappingURL=Alert.js.map
