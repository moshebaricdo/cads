import { jsxs as c, jsx as n } from "react/jsx-runtime";
import { forwardRef as T } from "react";
import { FaIcon as d } from "../../icons/FaIcon.js";
import { TAG_SIZE as y } from "../../shared/controlSize.js";
import { messagingChrome as N, resolveMessagingIconName as p } from "../../shared/messagingSentiment.js";
import { CloseIconButton as j } from "../close-icon-button/CloseIconButton.js";
import r from "./tag.module.scss.js";
function k(...i) {
  return i.filter(Boolean).join(" ");
}
const P = T(function({
  color: t = "neutral",
  size: a = "large",
  label: f = "Tag",
  startIconName: l,
  endIconName: s,
  isDismissible: h = !1,
  onClose: u,
  className: x
}, b) {
  const e = y[a], o = N(t), g = l ? p(l) : null, m = s ? p(s) : null, S = {
    "--tag-height": e.height,
    "--tag-px": e.paddingInline,
    "--tag-py": e.paddingBlock,
    "--tag-gap": e.gap,
    "--tag-content-gap": e.contentGap,
    "--tag-font-size": e.fontSize,
    "--tag-line-height": e.lineHeight,
    "--tag-border": o.border,
    "--tag-bg": o.background,
    "--tag-fg": o.label
  };
  return /* @__PURE__ */ c(
    "div",
    {
      ref: b,
      className: k(r.root, x),
      "data-cads-component": "Tag",
      style: S,
      children: [
        /* @__PURE__ */ c("span", { className: r.content, children: [
          g ? /* @__PURE__ */ n(d, { name: g, fontSize: e.iconPx, "aria-hidden": !0 }) : null,
          /* @__PURE__ */ n("span", { className: r.label, children: f }),
          m ? /* @__PURE__ */ n(d, { name: m, fontSize: e.iconPx, "aria-hidden": !0 }) : null
        ] }),
        h ? /* @__PURE__ */ n(
          j,
          {
            size: a === "large" ? "medium" : a === "medium" ? "small" : "extraSmall",
            color: t === "neutral" ? "secondary" : t,
            onClick: u,
            sx: { width: e.closeWidth }
          }
        ) : null
      ]
    }
  );
});
export {
  P as Tag
};
//# sourceMappingURL=Tag.js.map
