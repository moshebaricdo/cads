import { jsx as o } from "react/jsx-runtime";
import d from "@mui/material/Checkbox";
import u from "@mui/material/FormControlLabel";
import { forwardRef as b } from "react";
import { FaIcon as g } from "../../icons/FaIcon.js";
import { CHECKBOX_SIZE as s } from "../../shared/controlSize.js";
import a from "./checkbox.module.scss.js";
function n({
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
        g,
        {
          name: t === "indeterminate" ? "dash" : "check",
          family: "solid",
          fontSize: e.iconPx
        }
      ) : null
    }
  );
}
const F = b(
  function({
    label: t,
    labelStyle: e = "thin",
    size: i = "medium",
    disabled: c = !1,
    sx: f,
    ...h
  }, p) {
    const r = s[i], l = /* @__PURE__ */ o(
      d,
      {
        ref: p,
        disableRipple: !0,
        disabled: c,
        icon: /* @__PURE__ */ o(n, { size: i, status: "off" }),
        checkedIcon: /* @__PURE__ */ o(n, { size: i, status: "on" }),
        indeterminateIcon: /* @__PURE__ */ o(n, { size: i, status: "indeterminate" }),
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
      u,
      {
        control: l,
        label: t,
        disabled: c,
        className: a.labelWrapper,
        sx: {
          // Beat MUI FormControlLabel’s default -11px margin (assumes control padding).
          margin: 0,
          gap: r.gap,
          "& .MuiCheckbox-root": {
            marginTop: r.labelAlignOffset
          },
          "& .MuiFormControlLabel-label": {
            fontSize: r.fontSize,
            lineHeight: r.lineHeight,
            fontWeight: e === "thick" ? "var(--font-weight-semi-bold)" : "var(--font-weight-regular)"
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
