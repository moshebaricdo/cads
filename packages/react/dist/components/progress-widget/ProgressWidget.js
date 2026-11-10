import { jsx as t, jsxs as d } from "react/jsx-runtime";
import { forwardRef as _ } from "react";
import { FaIcon as z } from "../../icons/FaIcon.js";
import { Button as N } from "../button/Button.js";
import { Dropdown as j } from "../dropdown/Dropdown.js";
import { IconTooltip as W } from "../icon-tooltip/IconTooltip.js";
import { ProgressBubble as A } from "../progress-bubble/ProgressBubble.js";
import e from "./progressWidget.module.scss.js";
const M = "Saved 2 minutes ago", V = "Unsaved changes", R = "Offline", ee = _(
  function(k, p) {
    const {
      version: C = "default",
      levelLabel: i = "",
      levels: m = [],
      activeLevelIndex: s,
      breakpoint: v = "auto",
      saveStatus: r = "saved",
      showSaveStatus: g = !0,
      saveStatusLabel: y,
      hasAction: B = !0,
      actionLabel: T = "I finished",
      onActionClick: E,
      hasLeftAction: b = !0,
      onBackClick: w,
      onLevelSelectClick: I,
      moreMenuOptions: $,
      onMoreMenuAction: u,
      startSlot: D,
      middleSlot: P,
      endSlot: U,
      className: f = "",
      ...h
    } = k, c = v === "tabletMobile" ? "tablet" : v, x = [
      e.root,
      c === "desktop" ? e.forceDesktop : "",
      c === "tablet" ? e.forceTablet : "",
      c === "smallTablet" || c === "mobile" ? e.forceCompact : "",
      b ? e.withLeftAction : "",
      f
    ].filter(Boolean).join(" ");
    if (C === "template") {
      const l = [
        ["start", D],
        ["middle", P],
        ["end", U]
      ];
      return /* @__PURE__ */ t(
        "div",
        {
          ref: p,
          className: `${e.root} ${f}`,
          "data-cads-component": "ProgressWidget",
          "data-version": "template",
          ...h,
          children: l.map(
            ([o, a]) => o === "middle" || a != null && a !== !1 ? /* @__PURE__ */ t(
              "div",
              {
                className: `${e.templateSlot} ${o === "middle" ? e.templateMiddle : ""}`,
                "data-slot": o,
                children: a
              },
              o
            ) : null
          )
        }
      );
    }
    const n = s != null ? m[s] : void 0, S = r === "unsaved" || r === "offline", L = y ?? (r === "offline" ? R : r === "unsaved" ? V : M), F = [
      ...i ? [{ type: "group", label: i }] : [],
      ...$ ?? []
    ], O = /* @__PURE__ */ t(
      N,
      {
        variant: "outlined",
        color: "secondary",
        size: "extraSmall",
        iconOnly: !0,
        startIconName: "arrow-left",
        "aria-label": "Back",
        onClick: w
      }
    );
    return /* @__PURE__ */ d(
      "div",
      {
        ref: p,
        className: x,
        "data-cads-component": "ProgressWidget",
        ...h,
        children: [
          /* @__PURE__ */ d("div", { className: e.leftActionContainer, children: [
            b ? O : null,
            /* @__PURE__ */ t("span", { className: e.moreMenu, children: /* @__PURE__ */ t(
              j,
              {
                role: "action",
                size: "extraSmall",
                iconOnly: !0,
                startIconName: "ellipsis",
                buttonVariant: "outlined",
                buttonColor: "secondary",
                "aria-label": "More",
                menuPlacement: "bottomLeft",
                options: F,
                onAction: (l) => u == null ? void 0 : u(l)
              }
            ) })
          ] }),
          /* @__PURE__ */ d("div", { className: e.dropdownContainer, children: [
            /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: e.levelSelect,
                onClick: I,
                "aria-label": `Current level: ${i}`,
                children: [
                  /* @__PURE__ */ t("span", { className: e.levelLabel, children: i }),
                  /* @__PURE__ */ t(
                    z,
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
            g ? /* @__PURE__ */ t("span", { className: e.cloudSlot, children: /* @__PURE__ */ t(
              W,
              {
                iconName: S ? "cloud-slash" : "cloud-check",
                title: L,
                placement: "bottom",
                size: "extraSmall",
                "aria-label": `Sync status: ${L}`,
                triggerProps: {
                  className: [
                    e.cloudSync,
                    S ? e.cloudSyncUnsaved : ""
                  ].filter(Boolean).join(" ")
                }
              }
            ) }) : null
          ] }),
          m.length > 0 ? /* @__PURE__ */ t("div", { className: e.bubbleSlot, children: m.map((l, o) => {
            const a = o === s;
            return /* @__PURE__ */ t(
              A,
              {
                levelType: l.levelType,
                status: l.status,
                isAssessment: l.isAssessment,
                isActive: a,
                levelNumber: a ? o + 1 : void 0,
                onClick: l.onClick,
                "aria-label": l.label ?? `Level ${o + 1}`,
                "aria-current": a ? "step" : void 0
              },
              o
            );
          }) }) : null,
          n && s != null ? /* @__PURE__ */ t("div", { className: e.activeBubbleSlot, children: /* @__PURE__ */ t(
            A,
            {
              levelType: n.levelType,
              status: n.status,
              isAssessment: n.isAssessment,
              isActive: !0,
              levelNumber: s + 1,
              onClick: n.onClick,
              "aria-label": n.label ?? `Level ${s + 1}`,
              "aria-current": "step"
            }
          ) }) : null,
          B ? /* @__PURE__ */ t("div", { className: e.actionContainer, children: /* @__PURE__ */ t(
            N,
            {
              variant: "contained",
              color: "secondary",
              size: "extraSmall",
              endIconName: "arrow-right",
              onClick: E,
              children: T
            }
          ) }) : null
        ]
      }
    );
  }
);
export {
  ee as ProgressWidget
};
//# sourceMappingURL=ProgressWidget.js.map
