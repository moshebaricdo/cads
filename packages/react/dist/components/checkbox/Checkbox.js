import { jsx as o } from "react/jsx-runtime";
import d from "@mui/material/Checkbox";
import b from "@mui/material/FormControlLabel";
import { forwardRef as u } from "react";
import { FaIcon as x } from "../../icons/FaIcon.js";
import { CHECKBOX_SIZE as s } from "../../shared/controlSize.js";
import a from "./checkbox.module.scss.js";
function r({
  size: m,
  status: t
}) {
  const e = s[m];
  return /* @__PURE__ */ o(
    "span",
    {
      className: a.box,
      "data-cads-checkbox-status": t,
      style: {
        width: e.box,
        height: e.box
      },
      children: t !== "off" ? /* @__PURE__ */ o(
        x,
        {
          name: t === "indeterminate" ? "dash" : "check",
          family: "solid",
          fontSize: e.iconPx
        }
      ) : null
    }
  );
}
const F = u(
  function({
    label: t,
    labelStyle: e = "thin",
    size: i = "medium",
    disabled: c = !1,
    sx: f,
    ...h
  }, p) {
    const n = s[i], l = /* @__PURE__ */ o(
      d,
      {
        ref: p,
        disableRipple: !0,
        disabled: c,
        icon: /* @__PURE__ */ o(r, { size: i, status: "off" }),
        checkedIcon: /* @__PURE__ */ o(r, { size: i, status: "on" }),
        indeterminateIcon: /* @__PURE__ */ o(r, { size: i, status: "indeterminate" }),
        "data-cads-press": "",
        className: a.root,
        sx: {
          padding: 0,
          margin: 0,
          color: "inherit",
          ...f ?? {}
        },
        ...h
      }
    );
    return t == null ? l : /* @__PURE__ */ o(
      b,
      {
        control: l,
        label: t,
        disabled: c,
        className: a.labelWrapper,
        sx: {
          gap: n.gap,
          "& .MuiCheckbox-root": {
            marginTop: n.labelAlignOffset
          },
          "& .MuiFormControlLabel-label": {
            fontSize: n.fontSize,
            lineHeight: n.lineHeight,
            fontWeight: e === "thick" ? "var(--font-weight-semibold)" : "var(--font-weight-normal)"
          }
        }
      }
    );
  }
);
export {
  F as Checkbox
};
//# sourceMappingURL=Checkbox.js.map
