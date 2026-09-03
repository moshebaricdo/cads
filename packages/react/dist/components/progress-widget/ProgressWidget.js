import { jsxs as d, jsx as t } from "react/jsx-runtime";
import { forwardRef as T } from "react";
import { FaIcon as w } from "../../icons/FaIcon.js";
import { Button as v } from "../button/Button.js";
import { IconTooltip as I } from "../icon-tooltip/IconTooltip.js";
import { ProgressBubble as p } from "../progress-bubble/ProgressBubble.js";
import e from "./progressWidget.module.scss.js";
const $ = "Saved 2 minutes ago", D = "Offline", W = T(
  function(b, h) {
    const {
      levelLabel: m,
      levels: n = [],
      activeLevelIndex: i,
      breakpoint: u = "auto",
      saveStatus: o = "saved",
      saveStatusLabel: L,
      hasAction: r = !0,
      actionLabel: A = "I finished",
      onActionClick: N,
      hasLeftAction: S = !0,
      onBackClick: k,
      onLevelSelectClick: y,
      className: C = "",
      ...g
    } = b, a = i != null ? n[i] : void 0, f = L ?? (o === "offline" ? D : $), B = [
      e.root,
      u === "desktop" ? e.forceDesktop : "",
      u === "tabletMobile" ? e.forceTabletMobile : "",
      C
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ d(
      "div",
      {
        ref: h,
        className: B,
        "data-cads-component": "ProgressWidget",
        ...g,
        children: [
          S ? /* @__PURE__ */ t("div", { className: e.leftActionContainer, children: /* @__PURE__ */ t(
            v,
            {
              variant: "outlined",
              color: "secondary",
              size: "extraSmall",
              iconOnly: !0,
              startIconName: "arrow-left",
              "aria-label": "Back",
              onClick: k
            }
          ) }) : null,
          /* @__PURE__ */ d(
            "div",
            {
              className: `${e.dropdownContainer} ${r ? e.withActionDivider : ""}`,
              children: [
                /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    className: e.levelSelect,
                    onClick: y,
                    "aria-label": `Current level: ${m}`,
                    children: [
                      a ? /* @__PURE__ */ t("span", { className: e.nestedBubble, "aria-hidden": "true", children: /* @__PURE__ */ t(
                        p,
                        {
                          interactive: !1,
                          levelType: a.levelType,
                          status: a.status,
                          isAssessment: a.isAssessment
                        }
                      ) }) : null,
                      /* @__PURE__ */ t("span", { className: e.levelLabel, children: m }),
                      /* @__PURE__ */ t(
                        w,
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
                  I,
                  {
                    iconName: o === "offline" ? "cloud-slash" : "cloud-check",
                    title: f,
                    placement: "bottom",
                    size: "extraSmall",
                    "aria-label": o === "offline" ? "Sync status: offline" : `Sync status: ${f}`,
                    triggerProps: {
                      className: [
                        e.cloudSync,
                        o === "offline" ? e.cloudSyncOffline : ""
                      ].filter(Boolean).join(" ")
                    }
                  }
                )
              ]
            }
          ),
          n.length > 0 ? /* @__PURE__ */ t(
            "div",
            {
              className: `${e.bubbleSlot} ${r ? e.withActionDivider : ""}`,
              children: n.map((l, s) => {
                const c = s === i;
                return /* @__PURE__ */ t(
                  p,
                  {
                    levelType: l.levelType,
                    status: l.status,
                    isAssessment: l.isAssessment,
                    isActive: c,
                    levelNumber: c ? s + 1 : void 0,
                    onClick: l.onClick,
                    "aria-label": l.label ?? `Level ${s + 1}`,
                    "aria-current": c ? "step" : void 0
                  },
                  s
                );
              })
            }
          ) : null,
          r ? /* @__PURE__ */ t("div", { className: e.actionContainer, children: /* @__PURE__ */ t(
            v,
            {
              variant: "contained",
              color: "secondary",
              size: "extraSmall",
              endIconName: "arrow-right",
              onClick: N,
              children: A
            }
          ) }) : null
        ]
      }
    );
  }
);
export {
  W as ProgressWidget
};
//# sourceMappingURL=ProgressWidget.js.map
