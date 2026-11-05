import { jsxs as f, jsx as t } from "react/jsx-runtime";
import C from "@mui/material/ButtonBase";
import { forwardRef as b } from "react";
import { FaIcon as p } from "../../icons/FaIcon.js";
import a from "./cardButton.module.scss.js";
const B = {
  horizontal: {
    medium: { start: "var(--text-body-lg)", end: "var(--text-body-md)" },
    small: { start: "var(--text-body-md)", end: "var(--text-body-sm)" }
  },
  vertical: {
    medium: { start: "var(--text-heading-md)", end: "var(--text-body-md)" },
    small: { start: "var(--text-heading-xs)", end: "var(--text-body-sm)" }
  }
}, _ = b(
  function({
    layout: n = "horizontal",
    size: d = "medium",
    title: u,
    description: r,
    startIconName: o,
    startContent: e,
    endIconName: s,
    selected: i,
    fullWidth: h = !1,
    className: v,
    disabled: x,
    ...l
  }, N) {
    const c = B[n][d], g = l.href != null, y = n === "horizontal" && !!s, m = e != null && e !== !1;
    return process.env.NODE_ENV !== "production" && m && o && console.warn(
      `[CADS CardButton] startContent and startIconName are both set; rendering startContent and ignoring startIconName="${o}".`
    ), process.env.NODE_ENV !== "production" && n === "vertical" && s && console.warn(
      `[CADS CardButton] endIconName is only defined in Figma for layout="horizontal"; ignoring "${s}".`
    ), /* @__PURE__ */ f(
      C,
      {
        ref: N,
        disableRipple: !0,
        disabled: x,
        "data-layout": n,
        "data-size": d,
        "data-selected": i ? "" : void 0,
        "data-full-width": h ? "" : void 0,
        "data-cads-press": "",
        "aria-pressed": !g && i !== void 0 ? i : void 0,
        className: [a.root, v].filter(Boolean).join(" "),
        ...l,
        children: [
          m ? /* @__PURE__ */ t("span", { className: a.startContent, "data-slot": "start-content", children: e }) : o ? /* @__PURE__ */ t("span", { className: a.startIcon, "data-slot": "start-icon", children: /* @__PURE__ */ t(p, { name: o, family: "solid", fontSize: c.start }) }) : null,
          /* @__PURE__ */ f("span", { className: a.content, children: [
            /* @__PURE__ */ t("span", { className: a.title, children: u }),
            r != null && r !== "" ? /* @__PURE__ */ t("span", { className: a.description, children: r }) : null
          ] }),
          y ? /* @__PURE__ */ t("span", { className: a.endIcon, "data-slot": "end-icon", children: /* @__PURE__ */ t(p, { name: s, family: "solid", fontSize: c.end }) }) : null
        ]
      }
    );
  }
);
export {
  _ as CardButton
};
//# sourceMappingURL=CardButton.js.map
