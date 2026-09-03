import { jsxs as m, jsx as t } from "react/jsx-runtime";
import { forwardRef as k } from "react";
import { FaIcon as C } from "../../icons/FaIcon.js";
import { Button as T } from "../button/Button.js";
import { IconTooltip as B } from "../icon-tooltip/IconTooltip.js";
import { ProgressBubble as v } from "../progress-bubble/ProgressBubble.js";
import e from "./progressWidget.module.scss.js";
const $ = "Saved 2 minutes ago", w = "Offline", z = k(
  function(p, b) {
    const {
      levelLabel: d,
      levels: i = [],
      activeLevelIndex: n,
      breakpoint: f = "auto",
      saveStatus: l = "saved",
      saveStatusLabel: h,
      hasAction: r = !0,
      actionLabel: L = "I finished",
      onActionClick: A,
      onLevelSelectClick: N,
      className: S = "",
      ...g
    } = p, s = n != null ? i[n] : void 0, u = h ?? (l === "offline" ? w : $), y = [
      e.root,
      f === "desktop" ? e.forceDesktop : "",
      f === "tabletMobile" ? e.forceTabletMobile : "",
      S
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ m(
      "div",
      {
        ref: b,
        className: y,
        "data-cads-component": "ProgressWidget",
        ...g,
        children: [
          /* @__PURE__ */ m(
            "div",
            {
              className: `${e.dropdownContainer} ${r ? e.withActionDivider : ""}`,
              children: [
                /* @__PURE__ */ m(
                  "button",
                  {
                    type: "button",
                    className: e.levelSelect,
                    onClick: N,
                    "aria-label": `Current level: ${d}`,
                    children: [
                      s ? /* @__PURE__ */ t("span", { className: e.nestedBubble, "aria-hidden": "true", children: /* @__PURE__ */ t(
                        v,
                        {
                          interactive: !1,
                          levelType: s.levelType,
                          status: s.status,
                          isAssessment: s.isAssessment
                        }
                      ) }) : null,
                      /* @__PURE__ */ t("span", { className: e.levelLabel, children: d }),
                      /* @__PURE__ */ t(
                        C,
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
                /* @__PURE__ */ t(
                  B,
                  {
                    iconName: l === "offline" ? "cloud-slash" : "cloud-check",
                    title: u,
                    placement: "bottom",
                    size: "extraSmall",
                    "aria-label": l === "offline" ? "Sync status: offline" : `Sync status: ${u}`,
                    triggerProps: {
                      className: [
                        e.cloudSync,
                        l === "offline" ? e.cloudSyncOffline : ""
                      ].filter(Boolean).join(" ")
                    }
                  }
                )
              ]
            }
          ),
          i.length > 0 ? /* @__PURE__ */ t(
            "div",
            {
              className: `${e.bubbleSlot} ${r ? e.withActionDivider : ""}`,
              children: i.map((o, a) => {
                const c = a === n;
                return /* @__PURE__ */ t(
                  v,
                  {
                    levelType: o.levelType,
                    status: o.status,
                    isAssessment: o.isAssessment,
                    isActive: c,
                    levelNumber: c ? a + 1 : void 0,
                    onClick: o.onClick,
                    "aria-label": o.label ?? `Level ${a + 1}`,
                    "aria-current": c ? "step" : void 0
                  },
                  a
                );
              })
            }
          ) : null,
          r ? /* @__PURE__ */ t("div", { className: e.actionContainer, children: /* @__PURE__ */ t(
            T,
            {
              variant: "contained",
              color: "secondary",
              size: "extraSmall",
              endIconName: "arrow-right",
              onClick: A,
              children: L
            }
          ) }) : null
        ]
      }
    );
  }
);
export {
  z as ProgressWidget
};
//# sourceMappingURL=ProgressWidget.js.map
