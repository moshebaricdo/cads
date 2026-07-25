import { jsx as p, jsxs as j } from "react/jsx-runtime";
import { forwardRef as z, useId as N } from "react";
import { FieldWrapper as w, useFieldContext as _ } from "../field-wrapper/FieldWrapper.js";
import { FaIcon as G } from "../../icons/FaIcon.js";
import { resolveFaIconName as R } from "../../icons/faProRegularCodepoints.js";
import { TEXT_INPUT_SIZE as U } from "../../shared/controlSize.js";
import H from "./textInput.module.scss.js";
function W(t) {
  return t === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function X(t) {
  return R(String(t)) ?? "face-smile";
}
function Z({
  size: t,
  color: o,
  multiline: e,
  startIconName: d,
  disabled: s,
  readOnly: c,
  error: a,
  value: g,
  defaultValue: b,
  onChange: I,
  placeholder: S,
  rows: m,
  id: C,
  className: k,
  style: B,
  ...u
}) {
  const f = _(), r = U[t], n = !!d && !e;
  let v = "var(--background-neutral-primary)", l = W(o), i = "var(--text-neutral-primary)", y = o === "secondary" ? "var(--text-neutral-placeholder)" : "var(--text-neutral-primary)";
  s ? (l = "var(--border-disabled-neutral)", i = "var(--text-disabled-neutral)", y = "var(--text-disabled-neutral)") : c ? (v = "var(--background-neutral-secondary)", l = "var(--border-neutral-secondary)", i = "var(--text-neutral-quaternary)") : a && (l = "var(--border-error-primary)");
  const T = f == null ? void 0 : f.describedBy, F = [H.shell, k].filter(Boolean).join(" "), x = {
    alignItems: e ? "flex-start" : "center",
    gap: n ? r.iconGap : void 0,
    height: e ? r.areaHeight : r.height,
    paddingInline: r.paddingInline,
    paddingBlock: r.paddingBlock,
    borderColor: l,
    backgroundColor: v,
    color: i,
    ...B
  }, h = {
    color: i,
    fontSize: r.fontSize,
    lineHeight: r.lineHeight,
    resize: e ? "vertical" : void 0,
    alignSelf: e ? "stretch" : void 0
  }, E = {
    id: C,
    disabled: s,
    readOnly: c,
    placeholder: S,
    value: g,
    defaultValue: b,
    onChange: I,
    className: H.control,
    "aria-invalid": a || void 0,
    "aria-describedby": T,
    style: h
  }, P = e ? /* @__PURE__ */ p(
    "textarea",
    {
      ...u,
      ...E,
      rows: m
    }
  ) : /* @__PURE__ */ p("input", { ...u, ...E, type: u.type ?? "text" });
  return /* @__PURE__ */ j(
    "div",
    {
      className: F,
      "data-cads-text-input": e ? "area" : "field",
      "data-color": o,
      "data-readonly": c ? "true" : void 0,
      "data-error": a ? "true" : void 0,
      "data-disabled": s ? "true" : void 0,
      "data-start-icon": n ? "true" : void 0,
      style: x,
      children: [
        n && d ? /* @__PURE__ */ p(
          G,
          {
            name: X(d),
            family: "solid",
            fontSize: r.iconPx,
            style: {
              flexShrink: 0,
              color: y,
              lineHeight: 1.25
            }
          }
        ) : null,
        P
      ]
    }
  );
}
const M = z(
  function({
    size: o = "medium",
    color: e = "primary",
    multiline: d = !1,
    startIconName: s,
    label: c,
    required: a = !1,
    helperText: g,
    helperIconName: b,
    showHelper: I = !0,
    sentiment: S = "default",
    error: m = !1,
    value: C,
    defaultValue: k,
    onChange: B,
    placeholder: u = "Placeholder",
    rows: f = 3,
    readOnly: r = !1,
    disabled: n = !1,
    className: v,
    style: l,
    id: i,
    ...y
  }, T) {
    const F = N(), x = i ?? `cads-text-input-${F}`, h = m ? "error" : S;
    return /* @__PURE__ */ p(
      w,
      {
        ref: T,
        size: o,
        sentiment: h,
        label: c,
        required: a,
        helperText: g,
        helperIconName: b,
        showHelper: I,
        htmlFor: x,
        disabled: n,
        className: v,
        style: l,
        children: /* @__PURE__ */ p(
          Z,
          {
            ...y,
            id: x,
            size: o,
            color: e,
            multiline: d,
            startIconName: s,
            disabled: n,
            readOnly: r,
            required: a,
            error: m || h === "error",
            value: C,
            defaultValue: k,
            onChange: B,
            placeholder: u,
            rows: f
          }
        )
      }
    );
  }
);
export {
  M as TextInput
};
//# sourceMappingURL=TextInput.js.map
