import { jsxs as r, jsx as t } from "react/jsx-runtime";
import { forwardRef as L, useRef as A, useState as C, useEffect as Q } from "react";
import { Button as y } from "../button/Button.js";
import { IconToggle as w } from "../icon-toggle/IconToggle.js";
import { Tooltip as c } from "../tooltip/Tooltip.js";
import e from "./aiChatMessage.module.scss.js";
const U = 1200, ae = L(
  function({
    context: u = "TA",
    author: d = "Human",
    children: H,
    fileUploads: m,
    hasActionRow: S = !0,
    hasLeftActions: P = !0,
    hasDownload: k = !0,
    hasRightActions: z = !0,
    hasFlagging: I = !0,
    feedbackLabel: M = "Was this helpful?",
    onCopy: s,
    onDownload: R,
    helpfulValue: p,
    defaultHelpfulValue: j = null,
    onHelpfulChange: n,
    flagged: B,
    defaultFlagged: D = !1,
    onFlagChange: E,
    className: F,
    style: O,
    ..._
  }, $) {
    const a = d === "AI", K = u === "TA", b = A(null), o = A(null), [i, f] = C(!1);
    Q(
      () => () => {
        o.current && clearTimeout(o.current);
      },
      []
    );
    const h = p !== void 0, [W, Y] = C(j), N = h ? p : W, T = (l) => {
      h || Y(l), n == null || n(l);
    }, q = () => {
      var v, g, x;
      const l = ((g = (v = b.current) == null ? void 0 : v.innerText) == null ? void 0 : g.trim()) ?? "";
      l && ((x = navigator.clipboard) == null || x.writeText(l)), s == null || s(), f(!0), o.current && clearTimeout(o.current), o.current = setTimeout(() => f(!1), U);
    }, G = a ? e.bubbleAi : K ? e.bubbleHumanTa : e.bubbleHumanTutor, J = [
      e.root,
      a ? e.rootAi : e.rootHuman,
      F ?? ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ r(
      "div",
      {
        ref: $,
        "data-cads-component": "AiChatMessage",
        "data-context": u,
        "data-author": d,
        className: J,
        style: O,
        ..._,
        children: [
          a && m != null ? /* @__PURE__ */ t("div", { className: e.fileRow, children: m }) : null,
          /* @__PURE__ */ t("div", { className: `${e.bubble} ${G}`, children: /* @__PURE__ */ t("div", { className: e.body, ref: b, children: H }) }),
          a && S ? /* @__PURE__ */ r("div", { className: e.actions, children: [
            P ? /* @__PURE__ */ r("div", { className: e.leftActions, children: [
              /* @__PURE__ */ t(
                c,
                {
                  title: i ? "Copied" : "Copy",
                  iconName: i ? "check" : "copy",
                  hasCaret: !1,
                  placement: "bottom",
                  children: /* @__PURE__ */ t("span", { className: e.tooltipHost, children: /* @__PURE__ */ t(
                    y,
                    {
                      variant: "text",
                      color: "tertiary",
                      size: "extraSmall",
                      iconOnly: !0,
                      startIconName: i ? "check" : "copy",
                      "aria-label": "Copy",
                      onClick: q
                    }
                  ) })
                }
              ),
              k ? /* @__PURE__ */ t(c, { title: "Download", placement: "bottom", children: /* @__PURE__ */ t("span", { className: e.tooltipHost, children: /* @__PURE__ */ t(
                y,
                {
                  variant: "text",
                  color: "tertiary",
                  size: "extraSmall",
                  iconOnly: !0,
                  startIconName: "download",
                  "aria-label": "Download",
                  onClick: R
                }
              ) }) }) : null
            ] }) : null,
            z ? /* @__PURE__ */ r("div", { className: e.rightActions, children: [
              /* @__PURE__ */ t(
                w,
                {
                  size: "extraSmall",
                  color: "brand",
                  label: M,
                  exclusive: !0,
                  iconName: "thumbs-up",
                  "aria-label": "Helpful",
                  pressed: N === "up",
                  onPressedChange: (l) => {
                    T(l ? "up" : null);
                  },
                  secondToggle: {
                    iconName: "thumbs-down",
                    color: "secondary",
                    "aria-label": "Not helpful",
                    pressed: N === "down",
                    onPressedChange: (l) => {
                      T(l ? "down" : null);
                    }
                  }
                }
              ),
              I ? /* @__PURE__ */ t(c, { title: "Flag this message?", placement: "bottom", children: /* @__PURE__ */ t("span", { className: e.tooltipHost, children: /* @__PURE__ */ t(
                w,
                {
                  size: "extraSmall",
                  color: "error",
                  iconName: "flag-pennant",
                  "aria-label": "Flag",
                  pressed: B,
                  defaultPressed: D,
                  onPressedChange: E
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
  ae as AiChatMessage
};
//# sourceMappingURL=AiChatMessage.js.map
