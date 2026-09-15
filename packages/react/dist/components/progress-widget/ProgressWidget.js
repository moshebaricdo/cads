import { jsxs as v, jsx as l } from "react/jsx-runtime";
import { forwardRef as $ } from "react";
import { FaIcon as D } from "../../icons/FaIcon.js";
import { Button as N } from "../button/Button.js";
import { IconTooltip as E } from "../icon-tooltip/IconTooltip.js";
import { ProgressBubble as L } from "../progress-bubble/ProgressBubble.js";
import e from "./progressWidget.module.scss.js";
const I = "Saved 2 minutes ago", F = "Offline";
function P(b, a) {
  var t;
  const n = (t = b.match(/\d+/)) == null ? void 0 : t[0];
  return n || (a != null ? String(a + 1) : "");
}
const U = $(
  function(a, n) {
    const {
      levelLabel: t,
      levels: m = [],
      activeLevelIndex: s,
      breakpoint: d = "auto",
      saveStatus: i = "saved",
      saveStatusLabel: S,
      hasAction: u = !0,
      actionLabel: A = "I finished",
      onActionClick: k,
      hasLeftAction: y = !0,
      onBackClick: g,
      onLevelSelectClick: C,
      className: B = "",
      ...T
    } = a, r = s != null ? m[s] : void 0, p = S ?? (i === "offline" ? F : I), h = P(t, s), w = [
      e.root,
      d === "desktop" ? e.forceDesktop : "",
      d === "tabletMobile" ? e.forceTabletMobile : "",
      d === "mobile" ? e.forceMobile : "",
      B
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ v(
      "div",
      {
        ref: n,
        className: w,
        "data-cads-component": "ProgressWidget",
        ...T,
        children: [
          y ? /* @__PURE__ */ l("div", { className: e.leftActionContainer, children: /* @__PURE__ */ l(
            N,
            {
              variant: "outlined",
              color: "secondary",
              size: "extraSmall",
              iconOnly: !0,
              startIconName: "arrow-left",
              "aria-label": "Back",
              onClick: g
            }
          ) }) : null,
          /* @__PURE__ */ v(
            "div",
            {
              className: `${e.dropdownContainer} ${u ? e.withActionDivider : ""}`,
              children: [
                /* @__PURE__ */ v(
                  "button",
                  {
                    type: "button",
                    className: e.levelSelect,
                    onClick: C,
                    "aria-label": `Current level: ${t}`,
                    children: [
                      r ? /* @__PURE__ */ l("span", { className: e.nestedBubble, "aria-hidden": "true", children: /* @__PURE__ */ l(
                        L,
                        {
                          interactive: !1,
                          levelType: r.levelType,
                          status: r.status,
                          isAssessment: r.isAssessment
                        }
                      ) }) : null,
                      /* @__PURE__ */ l("span", { className: e.levelLabel, children: t }),
                      h ? /* @__PURE__ */ l("span", { className: e.levelNumber, "aria-hidden": "true", children: h }) : null,
                      /* @__PURE__ */ l(
                        D,
                        {
                          name: "chevron-down",
                          family: "solid",
                          fontSize: "12px",
                          className: e.chevron
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ l("span", { className: e.cloudSlot, children: /* @__PURE__ */ l(
                  E,
                  {
                    iconName: i === "offline" ? "cloud-slash" : "cloud-check",
                    title: p,
                    placement: "bottom",
                    size: "extraSmall",
                    "aria-label": i === "offline" ? "Sync status: offline" : `Sync status: ${p}`,
                    triggerProps: {
                      className: [
                        e.cloudSync,
                        i === "offline" ? e.cloudSyncOffline : ""
                      ].filter(Boolean).join(" ")
                    }
                  }
                ) })
              ]
            }
          ),
          m.length > 0 ? /* @__PURE__ */ l(
            "div",
            {
              className: `${e.bubbleSlot} ${u ? e.withActionDivider : ""}`,
              children: m.map((o, c) => {
                const f = c === s;
                return /* @__PURE__ */ l(
                  L,
                  {
                    levelType: o.levelType,
                    status: o.status,
                    isAssessment: o.isAssessment,
                    isActive: f,
                    levelNumber: f ? c + 1 : void 0,
                    onClick: o.onClick,
                    "aria-label": o.label ?? `Level ${c + 1}`,
                    "aria-current": f ? "step" : void 0
                  },
                  c
                );
              })
            }
          ) : null,
          u ? /* @__PURE__ */ l("div", { className: e.actionContainer, children: /* @__PURE__ */ l(
            N,
            {
              variant: "contained",
              color: "secondary",
              size: "extraSmall",
              endIconName: "arrow-right",
              onClick: k,
              children: A
            }
          ) }) : null
        ]
      }
    );
  }
);
export {
  U as ProgressWidget
};
//# sourceMappingURL=ProgressWidget.js.map
