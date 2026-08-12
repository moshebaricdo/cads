import { jsxs as s, jsx as l } from "react/jsx-runtime";
import { forwardRef as Q, useRef as C, useState as w, useEffect as U } from "react";
import { Button as H } from "../button/Button.js";
import { IconToggle as S } from "../icon-toggle/IconToggle.js";
import { Tooltip as d } from "../tooltip/Tooltip.js";
import e from "./aiChatMessage.module.scss.js";
const X = 1200, se = Q(
  function({
    context: m = "TA",
    author: p = "Human",
    children: r,
    customContent: n,
    fileUploads: b,
    hasActionRow: P = !0,
    hasLeftActions: k = !0,
    hasDownload: z = !0,
    hasRightActions: I = !0,
    hasFlagging: M = !0,
    feedbackLabel: R = "Was this helpful?",
    onCopy: i,
    onDownload: j,
    helpfulValue: f,
    defaultHelpfulValue: B = null,
    onHelpfulChange: c,
    flagged: D,
    defaultFlagged: E = !1,
    onFlagChange: F,
    className: O,
    style: _,
    ...$
  }, K) {
    const o = p === "AI", W = m === "TA", h = C(null), a = C(null), [u, N] = w(!1);
    U(
      () => () => {
        a.current && clearTimeout(a.current);
      },
      []
    );
    const v = f !== void 0, [Y, q] = w(B), T = v ? f : Y, g = (t) => {
      v || q(t), c == null || c(t);
    }, G = () => {
      var x, A, y;
      const t = ((A = (x = h.current) == null ? void 0 : x.innerText) == null ? void 0 : A.trim()) ?? "";
      t && ((y = navigator.clipboard) == null || y.writeText(t)), i == null || i(), N(!0), a.current && clearTimeout(a.current), a.current = setTimeout(() => N(!1), X);
    }, J = o ? e.bubbleAi : W ? e.bubbleHumanTa : e.bubbleHumanTutor, L = [
      e.root,
      o ? e.rootAi : e.rootHuman,
      O ?? ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ s(
      "div",
      {
        ref: K,
        "data-cads-component": "AiChatMessage",
        "data-context": m,
        "data-author": p,
        className: L,
        style: _,
        ...$,
        children: [
          o && b != null ? /* @__PURE__ */ l("div", { className: e.fileRow, children: b }) : null,
          /* @__PURE__ */ s("div", { className: `${e.bubble} ${J}`, children: [
            r != null && r !== "" ? /* @__PURE__ */ l("div", { className: e.body, ref: h, children: r }) : null,
            o && n != null && n !== "" ? /* @__PURE__ */ l("div", { className: e.customContent, children: n }) : null
          ] }),
          o && P ? /* @__PURE__ */ s("div", { className: e.actions, children: [
            k ? /* @__PURE__ */ s("div", { className: e.leftActions, children: [
              /* @__PURE__ */ l(
                d,
                {
                  title: u ? "Copied" : "Copy",
                  iconName: u ? "check" : "copy",
                  hasCaret: !1,
                  placement: "bottom",
                  children: /* @__PURE__ */ l("span", { className: e.tooltipHost, children: /* @__PURE__ */ l(
                    H,
                    {
                      variant: "text",
                      color: "tertiary",
                      size: "extraSmall",
                      iconOnly: !0,
                      startIconName: u ? "check" : "copy",
                      "aria-label": "Copy",
                      onClick: G
                    }
                  ) })
                }
              ),
              z ? /* @__PURE__ */ l(d, { title: "Download", placement: "bottom", children: /* @__PURE__ */ l("span", { className: e.tooltipHost, children: /* @__PURE__ */ l(
                H,
                {
                  variant: "text",
                  color: "tertiary",
                  size: "extraSmall",
                  iconOnly: !0,
                  startIconName: "download",
                  "aria-label": "Download",
                  onClick: j
                }
              ) }) }) : null
            ] }) : null,
            I ? /* @__PURE__ */ s("div", { className: e.rightActions, children: [
              /* @__PURE__ */ l(
                S,
                {
                  size: "extraSmall",
                  color: "brand",
                  label: R,
                  exclusive: !0,
                  iconName: "thumbs-up",
                  "aria-label": "Helpful",
                  pressed: T === "up",
                  onPressedChange: (t) => {
                    g(t ? "up" : null);
                  },
                  secondToggle: {
                    iconName: "thumbs-down",
                    color: "secondary",
                    "aria-label": "Not helpful",
                    pressed: T === "down",
                    onPressedChange: (t) => {
                      g(t ? "down" : null);
                    }
                  }
                }
              ),
              M ? /* @__PURE__ */ l(d, { title: "Flag this message?", placement: "bottom", children: /* @__PURE__ */ l("span", { className: e.tooltipHost, children: /* @__PURE__ */ l(
                S,
                {
                  size: "extraSmall",
                  color: "error",
                  iconName: "flag-pennant",
                  "aria-label": "Flag",
                  pressed: D,
                  defaultPressed: E,
                  onPressedChange: F
                }
              ) }) }) : null
            ] }) : null
          ] }) : null
        ]
      }
    );
  }
);
export {
  se as AiChatMessage
};
//# sourceMappingURL=AiChatMessage.js.map
