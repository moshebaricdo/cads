import { jsx as i } from "react/jsx-runtime";
import h from "@mui/material/Radio";
import p from "@mui/material/FormControlLabel";
import { forwardRef as f } from "react";
import { RADIO_SIZE as g } from "../../shared/controlSize.js";
import r from "./radio.module.scss.js";
function u({ box: t }) {
  return /* @__PURE__ */ i(
    "span",
    {
      "aria-hidden": !0,
      className: r.circle,
      style: { width: t, height: t }
    }
  );
}
function R({ box: t, dot: e }) {
  return /* @__PURE__ */ i(
    "span",
    {
      "aria-hidden": !0,
      className: r.circle,
      style: { width: t, height: t },
      children: /* @__PURE__ */ i("span", { className: r.dot, style: { width: e, height: e } })
    }
  );
}
const y = f(
  function({
    label: e,
    size: c = "medium",
    labelStyle: d = "thin",
    disabled: n,
    sx: s,
    ...l
  }, m) {
    const o = g[c], a = /* @__PURE__ */ i(
      h,
      {
        ref: m,
        disableRipple: !0,
        disabled: n,
        icon: /* @__PURE__ */ i(u, { box: o.box }),
        checkedIcon: /* @__PURE__ */ i(R, { box: o.box, dot: o.dot }),
        "data-cads-press": "",
        className: r.root,
        sx: {
          padding: 0,
          margin: 0,
          color: "inherit",
          ...s ?? {}
        },
        ...l
      }
    );
    return e == null ? a : /* @__PURE__ */ i(
      p,
      {
        disabled: n,
        control: a,
        label: e,
        className: r.labelWrapper,
        sx: {
          // Beat MUI FormControlLabel’s default -11px margin (assumes control padding).
          margin: 0,
          gap: o.gap,
          "& .MuiFormControlLabel-label": {
            fontSize: o.fontSize,
            lineHeight: o.lineHeight,
            fontWeight: d === "thick" ? "var(--font-weight-semi-bold)" : "var(--font-weight-regular)"
          },
          "& .MuiRadio-root": {
            paddingTop: o.controlPaddingTop
          }
        }
      }
    );
  }
);
export {
  y as Radio
};
//# sourceMappingURL=Radio.js.map
