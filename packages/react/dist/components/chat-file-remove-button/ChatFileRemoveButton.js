import { jsx as e } from "react/jsx-runtime";
import l from "@mui/material/ButtonBase";
import { forwardRef as s } from "react";
import { FaIcon as f } from "../../icons/FaIcon.js";
import t from "./chatFileRemoveButton.module.scss.js";
const B = s(function({
  className: o,
  "aria-label": r = "Remove",
  type: a = "button",
  sx: i,
  ...m
}, n) {
  return /* @__PURE__ */ e(
    l,
    {
      ref: n,
      type: a,
      focusRipple: !1,
      disableRipple: !0,
      "aria-label": r,
      "data-cads-component": "ChatFileRemoveButton",
      "data-cads-press": "",
      className: o ? `${t.root} ${o}` : t.root,
      sx: i,
      ...m,
      children: /* @__PURE__ */ e(f, { name: "xmark", family: "solid", fontSize: "0.5rem", "aria-hidden": !0 })
    }
  );
});
export {
  B as ChatFileRemoveButton
};
//# sourceMappingURL=ChatFileRemoveButton.js.map
