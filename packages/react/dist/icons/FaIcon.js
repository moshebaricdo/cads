import { jsx as c } from "react/jsx-runtime";
import { getFaBrandCodepoint as f } from "./faBrandsCodepoints.js";
import { resolveFaIconName as u, getFaCodepoint as p } from "./faProRegularCodepoints.js";
const g = {
  inherit: void 0,
  extraSmall: "0.75rem",
  // 12px
  small: "0.875rem",
  // 14px
  medium: "1rem",
  // 16px
  large: "1.25rem",
  // 20px
  xs: "0.75rem",
  s: "0.875rem",
  m: "1rem",
  l: "1.25rem"
};
function b(e, n) {
  return n === "brands" ? f(e) : p(e);
}
function C({
  name: e,
  family: n = "solid",
  className: t = "",
  title: r,
  size: a = "medium",
  fontSize: i,
  style: s
}) {
  const o = b(e, n);
  if (!o) {
    if (process.env.NODE_ENV !== "production") {
      const l = n !== "brands" && u(e) == null ? ' (try a kebab-case FA name; "smile" → face-smile)' : "";
      console.warn(`[CADS FaIcon] Unknown icon name "${e}"${l}`);
    }
    return null;
  }
  const m = String.fromCodePoint(Number.parseInt(o, 16)), d = i ?? g[a];
  return /* @__PURE__ */ c(
    "span",
    {
      className: t,
      "data-fa-icon": "",
      "data-fa-family": n,
      "data-fa-name": e,
      style: {
        fontFamily: n === "brands" ? "var(--font-fa-brands)" : "var(--font-fa-pro)",
        fontWeight: n === "brands" || n === "regular" ? 400 : 900,
        fontStyle: "normal",
        fontSize: d,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...s
      },
      title: r,
      "aria-hidden": r ? void 0 : !0,
      "aria-label": r,
      role: r ? "img" : void 0,
      children: m
    }
  );
}
export {
  C as FaIcon
};
//# sourceMappingURL=FaIcon.js.map
