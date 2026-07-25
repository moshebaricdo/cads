import { jsxs as a, jsx as n } from "react/jsx-runtime";
import T from "@mui/material/Box";
import { forwardRef as _ } from "react";
import { FaIcon as w } from "../../icons/FaIcon.js";
import { NOTIFICATION_BANNER_CHROME as H } from "../../shared/controlSize.js";
import { messagingChrome as P, resolveMessagingIconName as V } from "../../shared/messagingSentiment.js";
import { Button as d } from "../button/Button.js";
import { CloseIconButton as W } from "../close-icon-button/CloseIconButton.js";
import r from "./notificationBanner.module.scss.js";
function u(o) {
  return o == null || typeof o == "string" && o.trim() === "" ? "Button" : o;
}
function q(...o) {
  return o.filter(Boolean).join(" ");
}
const A = _(function({
  sentiment: e = "brand",
  fillStyle: m = "none",
  title: f,
  description: p,
  iconName: b = "face-smile",
  hasPrimaryAction: c = !0,
  hasSecondaryAction: l = !0,
  primaryActionLabel: v = "Button",
  secondaryActionLabel: N = "Button",
  onPrimaryAction: y,
  onSecondaryAction: B,
  isDismissible: s = !1,
  onClose: g,
  fullWidth: h = !0,
  className: C,
  role: x = "region"
}, I) {
  const t = P(e), i = m === "color", k = V(b), z = i ? e === "neutral" ? "var(--background-neutral-secondary)" : t.background : "var(--background-neutral-primary)", R = i ? t.borderPrimary : "var(--border-neutral-primary)", j = e === "neutral" ? "var(--border-neutral-secondary)" : t.borderPrimary, L = e === "neutral" ? "var(--text-neutral-tertiary)" : t.icon, O = i ? "secondary" : "primary", E = u(v), F = u(N), M = {
    "--nb-bg": z,
    "--nb-border": R,
    "--nb-icon-ring": j,
    "--nb-icon-color": L
  };
  return /* @__PURE__ */ a(
    T,
    {
      ref: I,
      role: x,
      className: q(r.banner, h && r.fullWidth, C),
      style: M,
      "data-cads-component": "NotificationBanner",
      children: [
        /* @__PURE__ */ a("div", { className: r.body, children: [
          /* @__PURE__ */ n("div", { className: r.icon, "aria-hidden": !0, children: /* @__PURE__ */ n(
            w,
            {
              name: k,
              fontSize: H.iconPx
            }
          ) }),
          /* @__PURE__ */ a("div", { className: r.copy, children: [
            /* @__PURE__ */ n("p", { className: r.title, children: f }),
            /* @__PURE__ */ n("p", { className: r.description, children: p })
          ] })
        ] }),
        c || l || s ? /* @__PURE__ */ a("div", { className: r.trailing, children: [
          c || l ? /* @__PURE__ */ a("div", { className: r.actions, children: [
            l ? /* @__PURE__ */ n(
              d,
              {
                variant: "outlined",
                color: "secondary",
                size: "small",
                onClick: B,
                sx: i ? {
                  borderColor: "var(--border-neutral-solid)",
                  "&:hover": {
                    borderColor: "var(--border-neutral-solid)"
                  }
                } : void 0,
                children: F
              }
            ) : null,
            c ? /* @__PURE__ */ n(
              d,
              {
                variant: "contained",
                color: O,
                size: "small",
                onClick: y,
                children: E
              }
            ) : null
          ] }) : null,
          s ? /* @__PURE__ */ n(
            W,
            {
              size: "medium",
              color: e === "neutral" ? "secondary" : e,
              onClick: g
            }
          ) : null
        ] }) : null
      ]
    }
  );
});
export {
  A as NotificationBanner
};
//# sourceMappingURL=NotificationBanner.js.map
