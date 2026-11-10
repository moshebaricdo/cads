import { jsxs as l, jsx as a, Fragment as $ } from "react/jsx-runtime";
import { forwardRef as x, useState as U, useEffect as g } from "react";
import { FaIcon as f } from "../../icons/FaIcon.js";
import { ProgressWidget as G } from "../progress-widget/ProgressWidget.js";
import { CodeAiLogo as _ } from "./CodeAiLogo.js";
import { CodeAiMark as F } from "./CodeAiMark.js";
import { TutorIcon as Q } from "./TutorIcon.js";
import e from "./globalHeader.module.scss.js";
const V = [
  { label: "My Dashboard" },
  { label: "Course Catalog" },
  { label: "Professional Learning" },
  { label: "Projects" },
  { label: "Incubator" }
], q = [
  { label: "My Dashboard" },
  { label: "Course Catalog" },
  { label: "Projects" },
  { label: "Incubator" }
], Y = "(max-width: 575.98px)";
function J(b, i) {
  const [h, n] = U(!1);
  return g(() => {
    if (!i || typeof window > "u" || !window.matchMedia)
      return;
    const s = window.matchMedia(b), c = () => n(s.matches);
    return c(), s.addEventListener("change", c), () => s.removeEventListener("change", c);
  }, [b, i]), i && h;
}
const o = x(function({ variant: i, icon: h, endIcon: n, label: s, onClick: c, className: p = "", ariaLabel: v }, t) {
  const N = i === "outlined" ? e.outlinedButton : i === "iconOutlined" ? `${e.outlinedButton} ${e.iconButton}` : i === "icon" ? e.iconButton : e.textButton, k = i === "icon" ? "16px" : "12px";
  return /* @__PURE__ */ l(
    "button",
    {
      ref: t,
      type: "button",
      className: `${e.headerButton} ${N} ${p}`,
      onClick: c,
      "aria-label": v,
      children: [
        h ? /* @__PURE__ */ a(f, { name: h, family: "solid", fontSize: k }) : null,
        s ? /* @__PURE__ */ a("span", { className: e.headerButtonLabel, children: s }) : null,
        n ? /* @__PURE__ */ a(f, { name: n, family: "solid", fontSize: "12px" }) : null
      ]
    }
  );
});
function K({
  username: b,
  onClick: i
}) {
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: `${e.headerButton} ${e.outlinedButton} ${e.usernameDropdown} ${e.hideOnMobile}`,
      onClick: i,
      children: [
        /* @__PURE__ */ a("span", { className: e.usernameLabel, children: b }),
        /* @__PURE__ */ a(
          f,
          {
            name: "chevron-down",
            family: "solid",
            fontSize: "12px",
            className: e.usernameChevron
          }
        )
      ]
    }
  );
}
const se = x(
  function(i, h) {
    const {
      state: n = "labLevel",
      breakpoint: s = "auto",
      username: c = "Username",
      startContent: p,
      centerContent: v,
      progressWidgetProps: t,
      projectTitle: N = "Untitled Project",
      projectSaveStatusText: k = "Saved a few seconds ago",
      tutorLabel: O = "Tutor Challenge",
      navItems: S,
      onNewProjectClick: j,
      onUsernameClick: y,
      onHelpClick: B,
      onMenuClick: T,
      onShareClick: r,
      onRemixClick: d,
      onRenameClick: C,
      className: A = "",
      ...D
    } = i, m = s === "tabletMobile" ? "tablet" : s, R = [
      e.root,
      m === "desktop" ? e.forceDesktop : "",
      m === "tablet" || m === "smallTablet" ? e.forceTablet : "",
      m === "mobile" ? e.forceMobile : "",
      A
    ].filter(Boolean).join(" "), L = n === "teacherDashboard" || n === "studentDashboard", M = n === "labLevel" || n === "nonLabLesson", E = S ?? (n === "teacherDashboard" ? V : q), H = J(
      Y,
      m === "auto" && n === "labLevel"
    ), I = M ? /* @__PURE__ */ a(
      G,
      {
        levelLabel: "Lesson 6: Introduction to Online Puzzles",
        ...t,
        moreMenuOptions: [
          ...n === "labLevel" && (m === "mobile" || H) ? [
            { value: "share", label: "Share", iconName: "share" },
            { value: "remix", label: "Remix", iconName: "arrows-rotate" }
          ] : [],
          ...(t == null ? void 0 : t.moreMenuOptions) ?? []
        ],
        onMoreMenuAction: (u) => {
          var w;
          n === "labLevel" && u === "share" ? r == null || r(void 0) : n === "labLevel" && u === "remix" && (d == null || d(void 0)), (w = t == null ? void 0 : t.onMoreMenuAction) == null || w.call(t, u);
        },
        breakpoint: m,
        className: `${e.widget} ${(t == null ? void 0 : t.className) ?? ""}`
      }
    ) : null, z = n === "template" && p != null && p !== !1, P = n === "template" && v != null && v !== !1;
    return /* @__PURE__ */ l(
      "header",
      {
        ref: h,
        className: R,
        "data-cads-component": "GlobalHeader",
        "data-state": n,
        ...D,
        children: [
          /* @__PURE__ */ l(
            "div",
            {
              className: e.left,
              "data-gap": n === "standaloneProject" || n === "template" ? "wide" : n === "labLevel" ? "wideExceptMobile" : void 0,
              children: [
                /* @__PURE__ */ l("div", { className: e.logo, children: [
                  /* @__PURE__ */ a("span", { className: e.wordmark, children: /* @__PURE__ */ a(_, {}) }),
                  /* @__PURE__ */ a("span", { className: e.mark, children: /* @__PURE__ */ a(F, {}) })
                ] }),
                z ? /* @__PURE__ */ a("div", { className: e.startContent, "data-slot": "start-content", children: p }) : null,
                n === "standaloneProject" ? /* @__PURE__ */ l("div", { className: `${e.projectText} ${e.hideOnMobile}`, children: [
                  /* @__PURE__ */ l("span", { className: e.projectTitleRow, children: [
                    /* @__PURE__ */ a("span", { className: e.projectTitle, children: N }),
                    /* @__PURE__ */ a(f, { name: "pencil", family: "solid", fontSize: "10px" })
                  ] }),
                  /* @__PURE__ */ a("span", { className: e.projectSaveStatus, children: k })
                ] }) : null,
                n === "labLevel" ? /* @__PURE__ */ l($, { children: [
                  /* @__PURE__ */ l("div", { className: `${e.leftActions} ${e.desktopOnly}`, children: [
                    /* @__PURE__ */ a(
                      o,
                      {
                        variant: "outlined",
                        label: "Share",
                        onClick: r
                      }
                    ),
                    /* @__PURE__ */ a(
                      o,
                      {
                        variant: "outlined",
                        label: "Remix",
                        onClick: d
                      }
                    )
                  ] }),
                  /* @__PURE__ */ l("div", { className: `${e.leftActions} ${e.tabletOnly}`, children: [
                    /* @__PURE__ */ a(
                      o,
                      {
                        variant: "iconOutlined",
                        icon: "share",
                        ariaLabel: "Share",
                        onClick: r
                      }
                    ),
                    /* @__PURE__ */ a(
                      o,
                      {
                        variant: "iconOutlined",
                        icon: "arrows-rotate",
                        ariaLabel: "Remix",
                        onClick: d
                      }
                    )
                  ] })
                ] }) : null,
                n === "standaloneProject" ? /* @__PURE__ */ l($, { children: [
                  /* @__PURE__ */ l("div", { className: `${e.leftActions} ${e.desktopOnly}`, children: [
                    /* @__PURE__ */ a(
                      o,
                      {
                        variant: "outlined",
                        label: "Rename",
                        onClick: C
                      }
                    ),
                    /* @__PURE__ */ a(
                      o,
                      {
                        variant: "outlined",
                        label: "Share",
                        onClick: r
                      }
                    ),
                    /* @__PURE__ */ a(
                      o,
                      {
                        variant: "outlined",
                        label: "Remix",
                        onClick: d
                      }
                    )
                  ] }),
                  /* @__PURE__ */ l(
                    "div",
                    {
                      className: `${e.leftActions} ${e.belowDesktop}`,
                      children: [
                        /* @__PURE__ */ a(
                          o,
                          {
                            variant: "iconOutlined",
                            icon: "pencil",
                            ariaLabel: "Rename",
                            onClick: C
                          }
                        ),
                        /* @__PURE__ */ a(
                          o,
                          {
                            variant: "iconOutlined",
                            icon: "share",
                            ariaLabel: "Share",
                            onClick: r
                          }
                        ),
                        /* @__PURE__ */ a(
                          o,
                          {
                            variant: "iconOutlined",
                            icon: "arrows-rotate",
                            ariaLabel: "Remix",
                            onClick: d
                          }
                        )
                      ]
                    }
                  )
                ] }) : null,
                L ? /* @__PURE__ */ a(
                  "nav",
                  {
                    className: `${e.navLinks} ${e.desktopOnly}`,
                    "aria-label": "Primary",
                    children: E.map((u) => /* @__PURE__ */ a(
                      o,
                      {
                        variant: "text",
                        label: u.label,
                        onClick: u.onClick
                      },
                      u.label
                    ))
                  }
                ) : null
              ]
            }
          ),
          M ? /* @__PURE__ */ a("div", { className: e.center, children: I }) : null,
          n === "tutorPlus" ? /* @__PURE__ */ a("div", { className: e.center, children: /* @__PURE__ */ l("span", { className: e.tutorLabelWrap, children: [
            /* @__PURE__ */ a(Q, {}),
            /* @__PURE__ */ a("span", { className: e.tutorLabel, children: O })
          ] }) }) : null,
          P ? /* @__PURE__ */ a("div", { className: e.center, "data-slot": "center-content", children: v }) : null,
          /* @__PURE__ */ l("div", { className: e.right, children: [
            L || n === "standaloneProject" || n === "template" ? /* @__PURE__ */ a(
              o,
              {
                variant: "outlined",
                label: "New project",
                endIcon: "plus",
                onClick: j,
                className: e.desktopOnly
              }
            ) : null,
            /* @__PURE__ */ a(K, { username: c, onClick: y }),
            /* @__PURE__ */ l("div", { className: e.rightIcons, children: [
              /* @__PURE__ */ a(
                o,
                {
                  variant: "icon",
                  icon: "circle-question",
                  ariaLabel: "Help",
                  onClick: B,
                  className: e.desktopOnly
                }
              ),
              /* @__PURE__ */ a(
                o,
                {
                  variant: "icon",
                  icon: "bars",
                  ariaLabel: "Menu",
                  onClick: T
                }
              )
            ] })
          ] })
        ]
      }
    );
  }
);
export {
  se as GlobalHeader
};
//# sourceMappingURL=GlobalHeader.js.map
