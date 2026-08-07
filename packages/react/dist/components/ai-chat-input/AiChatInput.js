import { jsxs as h, jsx as e } from "react/jsx-runtime";
import { forwardRef as O, useId as R, useState as T } from "react";
import { Button as y } from "../button/Button.js";
import i from "./aiChatInput.module.scss.js";
const J = O(
  function({
    value: t,
    defaultValue: N = "",
    onChange: o,
    placeholder: I = "Type something",
    leftActions: w,
    addFileLabel: A = "Add file",
    onAddFile: D,
    onSubmit: c,
    disabled: s = !1,
    attachments: r,
    textareaProps: n,
    className: v,
    ...C
  }, j) {
    const K = R(), f = t !== void 0, [g, k] = T(N), u = f ? t : g, a = u.trim().length > 0, d = a && !s, B = (l) => {
      f || k(l.target.value), o == null || o(l);
    }, p = (l) => {
      l.preventDefault(), d && (c == null || c(l));
    }, z = (l) => {
      var m;
      (m = n == null ? void 0 : n.onKeyDown) == null || m.call(n, l), !l.defaultPrevented && l.key === "Enter" && !l.shiftKey && (l.preventDefault(), d && (c == null || c(l)));
    }, E = [i.root, v ?? ""].filter(Boolean).join(" "), M = [
      i.send,
      !a || s ? i.sendDisabled : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ h(
      "div",
      {
        ref: j,
        "data-cads-component": "AiChatInput",
        "data-filled": a ? "true" : "false",
        "data-disabled": s ? "true" : "false",
        className: E,
        ...C,
        children: [
          r != null ? /* @__PURE__ */ e("div", { className: i.attachments, children: r }) : null,
          /* @__PURE__ */ e(
            "textarea",
            {
              id: K,
              className: i.field,
              rows: 1,
              placeholder: I,
              disabled: s,
              value: u,
              ...n,
              "aria-label": (n == null ? void 0 : n["aria-label"]) ?? "Message",
              onChange: B,
              onKeyDown: z
            }
          ),
          /* @__PURE__ */ h("div", { className: i.actions, children: [
            /* @__PURE__ */ e("div", { className: i.leftActions, children: w ?? /* @__PURE__ */ e(
              y,
              {
                variant: "outlined",
                color: "secondary",
                size: "extraSmall",
                startIconName: "plus",
                disabled: s,
                onClick: D,
                children: A
              }
            ) }),
            /* @__PURE__ */ e("div", { className: i.rightActions, children: /* @__PURE__ */ e(
              y,
              {
                type: "button",
                variant: "contained",
                color: "primary",
                size: "extraSmall",
                iconOnly: !0,
                startIconName: "arrow-up",
                "aria-label": "Send",
                disabled: !d,
                className: M,
                onClick: (l) => {
                  p(l);
                }
              }
            ) })
          ] })
        ]
      }
    );
  }
);
export {
  J as AiChatInput
};
//# sourceMappingURL=AiChatInput.js.map
