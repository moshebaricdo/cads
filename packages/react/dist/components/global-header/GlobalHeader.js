import { jsxs as o, jsx as a, Fragment as D } from "react/jsx-runtime";
import { forwardRef as L } from "react";
import { FaIcon as u } from "../../icons/FaIcon.js";
import { Dropdown as R } from "../dropdown/Dropdown.js";
import { ProgressWidget as T } from "../progress-widget/ProgressWidget.js";
import { CodeAiLogo as H } from "./CodeAiLogo.js";
import { CodeAiMark as z } from "./CodeAiMark.js";
import e from "./globalHeader.module.scss.js";
const I = [
  { label: "My Dashboard" },
  { label: "Course Catalog" },
  { label: "Professional Learning" },
  { label: "Projects" },
  { label: "Incubator" }
], U = [
  { label: "My Dashboard" },
  { label: "Course Catalog" },
  { label: "Projects" },
  { label: "Incubator" }
], n = L(function({ variant: i, icon: b, endIcon: l, label: t, onClick: p, className: d = "", ariaLabel: v }, N) {
  const f = i === "outlined" ? e.outlinedButton : i === "iconOutlined" ? `${e.outlinedButton} ${e.iconButton}` : i === "icon" ? e.iconButton : e.textButton;
  return /* @__PURE__ */ o(
    "button",
    {
      ref: N,
      type: "button",
      className: `${e.headerButton} ${f} ${d}`,
      onClick: p,
      "aria-label": v,
      children: [
        b ? /* @__PURE__ */ a(u, { name: b, family: "solid", fontSize: "12px" }) : null,
        t ? /* @__PURE__ */ a("span", { className: e.headerButtonLabel, children: t }) : null,
        l ? /* @__PURE__ */ a(u, { name: l, family: "solid", fontSize: "12px" }) : null
      ]
    }
  );
});
function E({
  username: h,
  onClick: i
}) {
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: `${e.headerButton} ${e.outlinedButton} ${e.usernameDropdown} ${e.hideOnMobile}`,
      onClick: i,
      children: [
        /* @__PURE__ */ a("span", { className: e.usernameLabel, children: h }),
        /* @__PURE__ */ a(
          u,
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
const X = L(
  function(i, b) {
    const {
      state: l = "labLevel",
      breakpoint: t = "auto",
      username: p = "Username",
      progressWidgetProps: d,
      projectTitle: v = "Untitled Project",
      projectSaveStatusText: N = "Saved a few seconds ago",
      tutorLabel: f = "Tutor Challenge",
      navItems: $,
      onNewProjectClick: x,
      onUsernameClick: j,
      onHelpClick: O,
      onMenuClick: y,
      onShareClick: r,
      onRemixClick: s,
      onRenameClick: m,
      className: w = "",
      ...g
    } = i, M = [
      e.root,
      t === "desktop" ? e.forceDesktop : "",
      t === "tabletMobile" ? e.forceTabletMobile : "",
      t === "mobile" ? e.forceMobile : "",
      w
    ].filter(Boolean).join(" "), k = l === "teacherDashboard" || l === "studentDashboard", C = l === "labLevel" || l === "nonLabLesson", S = $ ?? (l === "teacherDashboard" ? I : U), P = C ? /* @__PURE__ */ a(
      T,
      {
        levelLabel: "Lesson 6: Introduction to Online Puzzles",
        ...d,
        breakpoint: t === "auto" ? "auto" : t === "mobile" ? "mobile" : t === "tabletMobile" ? "tabletMobile" : "desktop",
        className: `${e.widget} ${(d == null ? void 0 : d.className) ?? ""}`
      }
    ) : null, B = l === "standaloneProject" ? [
      { value: "rename", label: "Rename", iconName: "pencil" },
      { value: "share", label: "Share", iconName: "share" },
      { value: "remix", label: "Remix", iconName: "rotate" }
    ] : [
      { value: "share", label: "Share", iconName: "share" },
      { value: "remix", label: "Remix", iconName: "rotate" }
    ], A = /* @__PURE__ */ a("div", { className: `${e.leftActions} ${e.overflowOnly}`, children: /* @__PURE__ */ a(
      R,
      {
        role: "action",
        size: "extraSmall",
        menuPlacement: "bottomLeft",
        "aria-label": "More actions",
        disablePortal: !0,
        options: B,
        onAction: (c) => {
          c === "share" && (r == null || r({})), c === "remix" && (s == null || s({})), c === "rename" && (m == null || m({}));
        },
        trigger: /* @__PURE__ */ a(
          n,
          {
            variant: "iconOutlined",
            icon: "ellipsis",
            ariaLabel: "More actions"
          }
        )
      }
    ) });
    return /* @__PURE__ */ o(
      "header",
      {
        ref: b,
        className: M,
        "data-cads-component": "GlobalHeader",
        "data-state": l,
        ...g,
        children: [
          /* @__PURE__ */ o("div", { className: e.left, children: [
            /* @__PURE__ */ o("div", { className: e.logo, children: [
              /* @__PURE__ */ a("span", { className: e.wordmark, children: /* @__PURE__ */ a(H, {}) }),
              /* @__PURE__ */ a("span", { className: e.mark, children: /* @__PURE__ */ a(z, {}) })
            ] }),
            l === "standaloneProject" ? /* @__PURE__ */ o("div", { className: `${e.projectText} ${e.hideOnMobile}`, children: [
              /* @__PURE__ */ o("span", { className: e.projectTitleRow, children: [
                /* @__PURE__ */ a("span", { className: e.projectTitle, children: v }),
                /* @__PURE__ */ a(u, { name: "pencil", family: "solid", fontSize: "10px" })
              ] }),
              /* @__PURE__ */ a("span", { className: e.projectSaveStatus, children: N })
            ] }) : null,
            l === "labLevel" ? /* @__PURE__ */ o("div", { className: `${e.leftActions} ${e.desktopOnly}`, children: [
              /* @__PURE__ */ a(
                n,
                {
                  variant: "outlined",
                  label: "Share",
                  onClick: r
                }
              ),
              /* @__PURE__ */ a(
                n,
                {
                  variant: "outlined",
                  label: "Remix",
                  onClick: s
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
                  onClick: r
                }
              ),
              /* @__PURE__ */ a(
                n,
                {
                  variant: "iconOutlined",
                  icon: "rotate",
                  ariaLabel: "Remix",
                  onClick: s
                }
              )
            ] }) : null,
            l === "labLevel" || l === "standaloneProject" ? A : null,
            l === "standaloneProject" ? /* @__PURE__ */ o(D, { children: [
              /* @__PURE__ */ o("div", { className: `${e.leftActions} ${e.desktopOnly}`, children: [
                /* @__PURE__ */ a(
                  n,
                  {
                    variant: "outlined",
                    label: "Rename",
                    onClick: m
                  }
                ),
                /* @__PURE__ */ a(
                  n,
                  {
                    variant: "outlined",
                    label: "Share",
                    onClick: r
                  }
                ),
                /* @__PURE__ */ a(
                  n,
                  {
                    variant: "outlined",
                    label: "Remix",
                    onClick: s
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
                        onClick: m
                      }
                    ),
                    /* @__PURE__ */ a(
                      n,
                      {
                        variant: "iconOutlined",
                        icon: "share",
                        ariaLabel: "Share",
                        onClick: r
                      }
                    ),
                    /* @__PURE__ */ a(
                      n,
                      {
                        variant: "iconOutlined",
                        icon: "rotate",
                        ariaLabel: "Remix",
                        onClick: s
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
                children: S.map((c) => /* @__PURE__ */ a(
                  n,
                  {
                    variant: "text",
                    label: c.label,
                    onClick: c.onClick
                  },
                  c.label
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
                onClick: x,
                className: e.desktopOnly
              }
            ) : null,
            /* @__PURE__ */ a(E, { username: p, onClick: j }),
            /* @__PURE__ */ o("div", { className: e.rightIcons, children: [
              /* @__PURE__ */ a(
                n,
                {
                  variant: "icon",
                  icon: "circle-question",
                  ariaLabel: "Help",
                  onClick: O,
                  className: e.desktopOnly
                }
              ),
              /* @__PURE__ */ a(
                n,
                {
                  variant: "icon",
                  icon: "bars",
                  ariaLabel: "Menu",
                  onClick: y
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
  X as GlobalHeader
};
//# sourceMappingURL=GlobalHeader.js.map
