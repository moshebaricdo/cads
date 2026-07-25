import { jsxs as w, jsx as l } from "react/jsx-runtime";
import z from "@mui/material/ButtonBase";
import { forwardRef as C } from "react";
import { FaIcon as d } from "../../icons/FaIcon.js";
import { CHIP_SIZE as S } from "../../shared/controlSize.js";
import c from "./chip.module.scss.js";
function h(i) {
  return !i || i === "smile" ? "face-smile" : i;
}
const $ = C(function({
  size: u = "medium",
  color: m = "primary",
  labelStyle: b = "thick",
  selected: r = !1,
  label: f = "Chips",
  startIconName: e,
  endIconName: t,
  disabled: g,
  sx: v,
  className: n,
  ...y
}, x) {
  const a = S[u], o = m === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)", p = e ? h(e) : null, s = t ? h(t) : null, k = {
    "--chip-height": a.height,
    "--chip-px": a.paddingInline,
    "--chip-py": a.paddingBlock,
    "--chip-gap": a.gap,
    "--chip-font-size": a.fontSize,
    "--chip-line-height": a.lineHeight,
    "--chip-font-weight": b === "thick" ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
    "--chip-border": r ? "transparent" : o,
    "--chip-bg": r ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
    "--chip-fg": r ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
    "--chip-bg-hover": r ? "var(--background-selected-strong)" : "var(--background-neutral-tertiary)",
    "--chip-border-hover": r ? "transparent" : o,
    "--chip-bg-disabled": r ? "var(--background-disabled-neutral)" : "var(--background-neutral-primary)",
    "--chip-border-disabled": r ? "transparent" : "var(--border-disabled-neutral)",
    "--chip-fg-disabled": r ? "var(--text-disabled-neutral-inverse)" : "var(--text-disabled-neutral)"
  };
  return /* @__PURE__ */ w(
    z,
    {
      ref: x,
      disabled: g,
      focusRipple: !1,
      disableRipple: !0,
      "aria-pressed": r,
      "data-cads-press": "",
      className: n ? `${c.root} ${n}` : c.root,
      style: k,
      sx: v,
      ...y,
      children: [
        p ? /* @__PURE__ */ l(d, { name: p, fontSize: a.iconPx }) : null,
        f,
        s ? /* @__PURE__ */ l(d, { name: s, fontSize: a.iconPx }) : null
      ]
    }
  );
});
export {
  $ as Chip
};
//# sourceMappingURL=Chip.js.map
