import { jsx as o } from "react/jsx-runtime";
import { forwardRef as j, useId as C, useState as E } from "react";
import { CHIP_SIZE as F } from "../../shared/controlSize.js";
import { Chip as H } from "../chip/Chip.js";
import { FieldWrapper as R } from "../field-wrapper/FieldWrapper.js";
import u from "./chipGroup.module.scss.js";
const D = j(
  function({
    size: l = "medium",
    color: p = "primary",
    labelStyle: f = "thick",
    label: i,
    helperText: c,
    helperIconName: I,
    showHelper: g = !0,
    options: v,
    value: s,
    defaultValue: b,
    onChange: t,
    disabled: d,
    "aria-label": N,
    className: m
  }, y) {
    const G = C(), [k, w] = E(
      b ?? []
    ), e = s ?? k, x = F[l], S = (r) => {
      const a = e.includes(r) ? e.filter((h) => h !== r) : [...e, r];
      s === void 0 && w(a), t == null || t(a);
    }, $ = {
      "--cg-gap": x.groupGap
    }, n = /* @__PURE__ */ o(
      "div",
      {
        ref: y,
        id: G,
        role: "group",
        "aria-label": N,
        className: m ? `${u.group} ${m}` : u.group,
        style: $,
        children: v.map((r) => /* @__PURE__ */ o(
          H,
          {
            size: l,
            color: p,
            labelStyle: f,
            label: r.label,
            selected: e.includes(r.value),
            startIconName: r.startIconName,
            endIconName: r.endIconName,
            disabled: d || r.disabled,
            onClick: () => S(r.value)
          },
          r.value
        ))
      }
    );
    return i == null && c == null ? n : /* @__PURE__ */ o(
      R,
      {
        size: l,
        label: i,
        helperText: c,
        helperIconName: I,
        showHelper: g,
        disabled: d,
        children: n
      }
    );
  }
);
export {
  D as ChipGroup
};
//# sourceMappingURL=ChipGroup.js.map
