import { jsx as f, jsxs as j } from "react/jsx-runtime";
import { forwardRef as N, useId as w } from "react";
import { FieldWrapper as R, useFieldContext as _ } from "../field-wrapper/FieldWrapper.js";
import { FaIcon as $ } from "../../icons/FaIcon.js";
import { resolveFaIconName as G } from "../../icons/faProRegularCodepoints.js";
import { TEXT_INPUT_SIZE as U } from "../../shared/controlSize.js";
import E from "./textInput.module.scss.js";
function W(t) {
  return t === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function X(t) {
  return G(String(t)) ?? "face-smile";
}
function Z({
  size: t,
  color: o,
  multiline: e,
  startIconName: s,
  disabled: a,
  readOnly: n,
  error: i,
  value: y,
  defaultValue: I,
  onChange: b,
  placeholder: S,
  rows: g,
  id: k,
  className: B,
  style: C,
  ...p
}) {
  const u = _(), r = U[t], l = !!s && !e;
  let m = "var(--background-neutral-primary)", d = W(o), c = "var(--text-neutral-primary)", v = o === "secondary" ? "var(--text-neutral-placeholder)" : "var(--text-neutral-primary)";
  a ? (d = "var(--border-disabled-neutral)", c = "var(--text-disabled-neutral)", v = "var(--text-disabled-neutral)") : n ? (m = "var(--background-neutral-secondary)", d = "var(--border-neutral-secondary)", c = "var(--text-neutral-quaternary)") : i && (d = "var(--border-error-primary)");
  const H = u == null ? void 0 : u.describedBy, T = [E.shell, B].filter(Boolean).join(" "), h = {
    alignItems: e ? "stretch" : "center",
    gap: l ? r.iconGap : void 0,
    height: e ? void 0 : r.height,
    minHeight: e ? r.areaHeight : void 0,
    paddingInline: e ? 0 : r.paddingInline,
    paddingBlock: e ? 0 : r.paddingBlock,
    borderColor: d,
    backgroundColor: m,
    color: c,
    ...C
  }, x = e && !a && !n, F = {
    color: c,
    fontSize: r.fontSize,
    lineHeight: r.lineHeight,
    ...e ? {
      // Subtract 1px border on each side so min-height matches Figma area chrome.
      minHeight: `calc(${r.areaHeight} - 2px)`,
      height: "auto",
      paddingInline: r.paddingInline,
      paddingBlock: r.paddingBlock,
      resize: x ? "vertical" : "none",
      alignSelf: "stretch"
    } : null
  }, z = {
    id: k,
    disabled: a,
    readOnly: n,
    placeholder: S,
    value: y,
    defaultValue: I,
    onChange: b,
    className: E.control,
    "aria-invalid": i || void 0,
    "aria-describedby": H,
    style: F
  }, P = e ? /* @__PURE__ */ f(
    "textarea",
    {
      ...p,
      ...z,
      rows: g
    }
  ) : /* @__PURE__ */ f("input", { ...p, ...z, type: p.type ?? "text" });
  return /* @__PURE__ */ j(
    "div",
    {
      className: T,
      "data-cads-text-input": e ? "area" : "field",
      "data-color": o,
      "data-readonly": n ? "true" : void 0,
      "data-error": i ? "true" : void 0,
      "data-disabled": a ? "true" : void 0,
      "data-start-icon": l ? "true" : void 0,
      style: h,
      children: [
        l && s ? /* @__PURE__ */ f(
          $,
          {
            name: X(s),
            family: "solid",
            fontSize: r.iconPx,
            style: {
              flexShrink: 0,
              color: v,
              lineHeight: 1.25
            }
          }
        ) : null,
        P
      ]
    }
  );
}
const Q = N(
  function({
    size: o = "medium",
    color: e = "primary",
    multiline: s = !1,
    startIconName: a,
    label: n,
    required: i = !1,
    helperText: y,
    helperIconName: I,
    showHelper: b = !0,
    sentiment: S = "default",
    error: g = !1,
    value: k,
    defaultValue: B,
    onChange: C,
    placeholder: p = "Placeholder",
    rows: u = 3,
    readOnly: r = !1,
    disabled: l = !1,
    className: m,
    style: d,
    id: c,
    ...v
  }, H) {
    const T = w(), h = c ?? `cads-text-input-${T}`, x = g ? "error" : S;
    return /* @__PURE__ */ f(
      R,
      {
        ref: H,
        size: o,
        sentiment: x,
        label: n,
        required: i,
        helperText: y,
        helperIconName: I,
        showHelper: b,
        htmlFor: h,
        disabled: l,
        className: m,
        style: d,
        children: /* @__PURE__ */ f(
          Z,
          {
            ...v,
            id: h,
            size: o,
            color: e,
            multiline: s,
            startIconName: a,
            disabled: l,
            readOnly: r,
            required: i,
            error: g || x === "error",
            value: k,
            defaultValue: B,
            onChange: C,
            placeholder: p,
            rows: u
          }
        )
      }
    );
  }
);
export {
  Q as TextInput
};
//# sourceMappingURL=TextInput.js.map
