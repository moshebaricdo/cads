import { jsx as t } from "react/jsx-runtime";
import v from "@mui/material/ButtonBase";
import { forwardRef as x } from "react";
import { FaIcon as p } from "../../icons/FaIcon.js";
import o from "./closeIconButton.module.scss.js";
const f = {
  large: { box: "1.5rem", icon: "1rem" },
  medium: { box: "1.125rem", icon: "0.875rem" },
  small: { box: "1.125rem", icon: "0.75rem" },
  extraSmall: { box: "0.8125rem", icon: "0.625rem" }
}, y = {
  primary: {
    default: "var(--text-neutral-primary)",
    hover: "var(--text-neutral-quaternary)"
  },
  secondary: {
    default: "var(--text-neutral-quaternary)",
    hover: "var(--text-neutral-primary)"
  },
  brand: {
    default: "var(--text-brand-secondary)",
    hover: "var(--text-brand-primary)"
  },
  pink: {
    default: "var(--text-accent-pink-secondary)",
    hover: "var(--text-accent-pink-primary)"
  },
  orange: {
    default: "var(--text-accent-orange-secondary)",
    hover: "var(--text-accent-orange-primary)"
  },
  success: {
    default: "var(--text-success-secondary)",
    hover: "var(--text-success-primary)"
  },
  error: {
    default: "var(--text-error-secondary)",
    hover: "var(--text-error-primary)"
  },
  warning: {
    default: "var(--text-warning-secondary)",
    hover: "var(--text-warning-primary)"
  },
  info: {
    default: "var(--text-info-secondary)",
    hover: "var(--text-info-primary)"
  }
}, S = x(function({
  size: n = "large",
  color: c = "primary",
  sx: i,
  className: e,
  "aria-label": s = "Close",
  type: m = "button",
  ...l
}, d) {
  const r = f[n], a = y[c], u = {
    "--cib-box": r.box,
    "--cib-icon": r.icon,
    "--cib-color": a.default,
    "--cib-color-hover": a.hover
  };
  return /* @__PURE__ */ t(
    v,
    {
      ref: d,
      type: m,
      focusRipple: !1,
      disableRipple: !0,
      "aria-label": s,
      "data-cads-component": "CloseIconButton",
      "data-cads-press": "",
      className: e ? `${o.root} ${e}` : o.root,
      style: u,
      sx: i,
      ...l,
      children: /* @__PURE__ */ t(p, { name: "xmark", family: "solid", fontSize: r.icon, "aria-hidden": !0 })
    }
  );
});
export {
  S as CloseIconButton
};
//# sourceMappingURL=CloseIconButton.js.map
