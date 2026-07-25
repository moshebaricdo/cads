import { jsx as e } from "react/jsx-runtime";
import I from "@mui/material/ButtonBase";
import { forwardRef as O } from "react";
import { FaIcon as T } from "../../icons/FaIcon.js";
import { Tooltip as b } from "../tooltip/Tooltip.js";
import i from "./iconTooltip.module.scss.js";
const N = {
  large: "1.125rem",
  medium: "1rem",
  small: "0.875rem",
  extraSmall: "0.75rem"
}, h = {
  primary: "var(--text-brand-primary)",
  secondary: "var(--text-neutral-primary)",
  tertiary: "var(--text-neutral-quaternary)"
}, w = O(
  function({
    iconName: n = "circle-info",
    color: s = "tertiary",
    size: l = "medium",
    placement: c = "top",
    hasCaret: m = !0,
    title: r,
    triggerProps: p,
    "aria-label": d,
    ...f
  }, g) {
    const t = d ?? (typeof r == "string" ? r : void 0);
    process.env.NODE_ENV !== "production" && !t && console.warn(
      "[CADS IconTooltip] Provide `aria-label` when `title` is not a plain string — the trigger needs an accessible name."
    );
    const o = N[l], { sx: u, className: a, ...y } = p ?? {}, x = {
      "--it-size": o,
      "--it-color": h[s]
    };
    return /* @__PURE__ */ e(
      b,
      {
        title: r,
        placement: c,
        hasCaret: m,
        ...f,
        children: /* @__PURE__ */ e(
          I,
          {
            ref: g,
            type: "button",
            disableRipple: !0,
            disableTouchRipple: !0,
            focusRipple: !1,
            "aria-label": t,
            "data-cads-component": "IconTooltip",
            className: a ? `${i.trigger} ${a}` : i.trigger,
            style: x,
            sx: u,
            ...y,
            children: /* @__PURE__ */ e(T, { name: n, fontSize: o })
          }
        )
      }
    );
  }
);
export {
  w as IconTooltip
};
//# sourceMappingURL=IconTooltip.js.map
