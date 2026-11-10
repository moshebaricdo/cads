import { jsxs as p, jsx as t } from "react/jsx-runtime";
import C from "@mui/material/ButtonBase";
import { forwardRef as z } from "react";
import { FaIcon as h } from "../../icons/FaIcon.js";
import a from "./cardButton.module.scss.js";
const E = {
  horizontal: {
    medium: { start: "var(--text-body-lg)", end: "var(--text-body-md)" },
    small: { start: "var(--text-body-md)", end: "var(--text-body-sm)" }
  },
  vertical: {
    medium: { start: "var(--text-heading-md)", end: "var(--text-body-md)" },
    small: { start: "var(--text-heading-xs)", end: "var(--text-body-sm)" }
  }
}, F = z(
  function({
    layout: n = "horizontal",
    size: d = "medium",
    title: v,
    description: r,
    startIconName: o,
    startIconColor: l,
    startContent: e,
    endIconName: s,
    selected: i,
    fullWidth: x = !1,
    className: N,
    style: c,
    disabled: b,
    ...m
  }, g) {
    const f = E[n][d], y = m.href != null, B = n === "horizontal" && !!s, u = e != null && e !== !1;
    return process.env.NODE_ENV !== "production" && u && o && console.warn(
      `[CADS CardButton] startContent and startIconName are both set; rendering startContent and ignoring startIconName="${o}".`
    ), process.env.NODE_ENV !== "production" && n === "vertical" && s && console.warn(
      `[CADS CardButton] endIconName is only defined in Figma for layout="horizontal"; ignoring "${s}".`
    ), /* @__PURE__ */ p(
      C,
      {
        ref: g,
        disableRipple: !0,
        disabled: b,
        "data-layout": n,
        "data-size": d,
        "data-selected": i ? "" : void 0,
        "data-full-width": x ? "" : void 0,
        "data-cads-press": "",
        "aria-pressed": !y && i !== void 0 ? i : void 0,
        className: [a.root, N].filter(Boolean).join(" "),
        style: l ? { ...c, "--cb-start-custom": l } : c,
        ...m,
        children: [
          u ? /* @__PURE__ */ t("span", { className: a.startContent, "data-slot": "start-content", children: e }) : o ? /* @__PURE__ */ t("span", { className: a.startIcon, "data-slot": "start-icon", children: /* @__PURE__ */ t(h, { name: o, family: "solid", fontSize: f.start }) }) : null,
          /* @__PURE__ */ p("span", { className: a.content, children: [
            /* @__PURE__ */ t("span", { className: a.title, children: v }),
            r != null && r !== "" ? /* @__PURE__ */ t("span", { className: a.description, children: r }) : null
          ] }),
          B ? /* @__PURE__ */ t("span", { className: a.endIcon, "data-slot": "end-icon", children: /* @__PURE__ */ t(h, { name: s, family: "solid", fontSize: f.end }) }) : null
        ]
      }
    );
  }
);
export {
  F as CardButton
};
//# sourceMappingURL=CardButton.js.map
