import { jsx as a, jsxs as o, Fragment as R } from "react/jsx-runtime";
import { forwardRef as w } from "react";
import { FaIcon as b } from "../../icons/FaIcon.js";
import { ProgressWidget as D } from "../progress-widget/ProgressWidget.js";
import { CodeAiLogo as M } from "./CodeAiLogo.js";
import e from "./globalHeader.module.scss.js";
const T = [
  { label: "My Dashboard" },
  { label: "Course Catalog" },
  { label: "Professional Learning" },
  { label: "Projects" },
  { label: "Incubator" }
], A = [
  { label: "My Dashboard" },
  { label: "Course Catalog" },
  { label: "Projects" },
  { label: "Incubator" }
];
function n({
  variant: t,
  icon: i,
  endIcon: c,
  label: l,
  onClick: s,
  className: m = "",
  ariaLabel: r
}) {
  const h = t === "outlined" ? e.outlinedButton : t === "iconOutlined" ? `${e.outlinedButton} ${e.iconButton}` : t === "icon" ? e.iconButton : e.textButton;
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: `${e.headerButton} ${h} ${m}`,
      onClick: s,
      "aria-label": r,
      children: [
        i ? /* @__PURE__ */ a(b, { name: i, family: "solid", fontSize: "12px" }) : null,
        l ? /* @__PURE__ */ a("span", { className: e.headerButtonLabel, children: l }) : null,
        c ? /* @__PURE__ */ a(b, { name: c, family: "solid", fontSize: "12px" }) : null
      ]
    }
  );
}
function H({
  username: t,
  onClick: i
}) {
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: `${e.headerButton} ${e.outlinedButton} ${e.usernameDropdown}`,
      onClick: i,
      children: [
        /* @__PURE__ */ a("span", { className: e.usernameLabel, children: t }),
        /* @__PURE__ */ a(
          b,
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
const V = w(
  function(i, c) {
    const {
      state: l = "labLevel",
      breakpoint: s = "auto",
      username: m = "Username",
      progressWidgetProps: r,
      projectTitle: h = "Untitled Project",
      projectSaveStatusText: N = "Saved a few seconds ago",
      tutorLabel: f = "Tutor Challenge",
      navItems: L,
      onNewProjectClick: $,
      onUsernameClick: j,
      onHelpClick: y,
      onMenuClick: x,
      onShareClick: d,
      onRemixClick: u,
      onRenameClick: v,
      className: S = "",
      ...O
    } = i, g = [
      e.root,
      s === "desktop" ? e.forceDesktop : "",
      s === "tabletMobile" ? e.forceTabletMobile : "",
      S
    ].filter(Boolean).join(" "), k = l === "teacherDashboard" || l === "studentDashboard", C = l === "labLevel" || l === "nonLabLesson", B = L ?? (l === "teacherDashboard" ? T : A), P = C ? /* @__PURE__ */ a(
      D,
      {
        levelLabel: "Lesson 3: Introduction to Online Puzzles",
        ...r,
        breakpoint: s === "auto" ? "auto" : s === "tabletMobile" ? "tabletMobile" : "desktop",
        className: `${e.widget} ${(r == null ? void 0 : r.className) ?? ""}`
      }
    ) : null;
    return /* @__PURE__ */ o(
      "header",
      {
        ref: c,
        className: g,
        "data-cads-component": "GlobalHeader",
        "data-state": l,
        ...O,
        children: [
          /* @__PURE__ */ o("div", { className: e.left, children: [
            /* @__PURE__ */ a("div", { className: e.logo, children: /* @__PURE__ */ a(M, {}) }),
            l === "standaloneProject" ? /* @__PURE__ */ o("div", { className: e.projectText, children: [
              /* @__PURE__ */ o("span", { className: e.projectTitleRow, children: [
                /* @__PURE__ */ a("span", { className: e.projectTitle, children: h }),
                /* @__PURE__ */ a(b, { name: "pencil", family: "solid", fontSize: "10px" })
              ] }),
              /* @__PURE__ */ a("span", { className: e.projectSaveStatus, children: N })
            ] }) : null,
            l === "labLevel" ? /* @__PURE__ */ o("div", { className: `${e.leftActions} ${e.desktopOnly}`, children: [
              /* @__PURE__ */ a(
                n,
                {
                  variant: "outlined",
                  label: "Share",
                  onClick: d
                }
              ),
              /* @__PURE__ */ a(
                n,
                {
                  variant: "outlined",
                  label: "Remix",
                  onClick: u
                }
              )
            ] }) : null,
            l === "labLevel" ? /* @__PURE__ */ o("div", { className: `${e.leftActions} ${e.tabletMobileOnly}`, children: [
              /* @__PURE__ */ a(
                n,
                {
                  variant: "iconOutlined",
                  icon: "share",
                  ariaLabel: "Share",
                  onClick: d
                }
              ),
              /* @__PURE__ */ a(
                n,
                {
                  variant: "iconOutlined",
                  icon: "rotate",
                  ariaLabel: "Remix",
                  onClick: u
                }
              )
            ] }) : null,
            l === "standaloneProject" ? /* @__PURE__ */ o(R, { children: [
              /* @__PURE__ */ o("div", { className: `${e.leftActions} ${e.desktopOnly}`, children: [
                /* @__PURE__ */ a(
                  n,
                  {
                    variant: "outlined",
                    label: "Rename",
                    onClick: v
                  }
                ),
                /* @__PURE__ */ a(
                  n,
                  {
                    variant: "outlined",
                    label: "Share",
                    onClick: d
                  }
                ),
                /* @__PURE__ */ a(
                  n,
                  {
                    variant: "outlined",
                    label: "Remix",
                    onClick: u
                  }
                )
              ] }),
              /* @__PURE__ */ o(
                "div",
                {
                  className: `${e.leftActions} ${e.tabletMobileOnly}`,
                  children: [
                    /* @__PURE__ */ a(
                      n,
                      {
                        variant: "iconOutlined",
                        icon: "pencil",
                        ariaLabel: "Rename",
                        onClick: v
                      }
                    ),
                    /* @__PURE__ */ a(
                      n,
                      {
                        variant: "iconOutlined",
                        icon: "share",
                        ariaLabel: "Share",
                        onClick: d
                      }
                    ),
                    /* @__PURE__ */ a(
                      n,
                      {
                        variant: "iconOutlined",
                        icon: "rotate",
                        ariaLabel: "Remix",
                        onClick: u
                      }
                    )
                  ]
                }
              )
            ] }) : null,
            k ? /* @__PURE__ */ a(
              "nav",
              {
                className: `${e.navLinks} ${e.desktopOnly}`,
                "aria-label": "Primary",
                children: B.map((p) => /* @__PURE__ */ a(
                  n,
                  {
                    variant: "text",
                    label: p.label,
                    onClick: p.onClick
                  },
                  p.label
                ))
              }
            ) : null
          ] }),
          C ? /* @__PURE__ */ a("div", { className: e.center, children: P }) : null,
          l === "tutorPlus" ? /* @__PURE__ */ a("div", { className: e.center, children: /* @__PURE__ */ a("span", { className: e.tutorLabel, children: f }) }) : null,
          /* @__PURE__ */ o("div", { className: e.right, children: [
            k || l === "standaloneProject" ? /* @__PURE__ */ a(
              n,
              {
                variant: "outlined",
                label: "New project",
                endIcon: "plus",
                onClick: $,
                className: e.desktopOnly
              }
            ) : null,
            /* @__PURE__ */ a(H, { username: m, onClick: j }),
            /* @__PURE__ */ o("div", { className: e.rightIcons, children: [
              /* @__PURE__ */ a(
                n,
                {
                  variant: "icon",
                  icon: "circle-question",
                  ariaLabel: "Help",
                  onClick: y,
                  className: e.desktopOnly
                }
              ),
              /* @__PURE__ */ a(
                n,
                {
                  variant: "icon",
                  icon: "bars",
                  ariaLabel: "Menu",
                  onClick: x
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
  V as GlobalHeader
};
//# sourceMappingURL=GlobalHeader.js.map
