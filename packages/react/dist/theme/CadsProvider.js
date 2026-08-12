import { jsxs as r, jsx as o } from "react/jsx-runtime";
import m from "@mui/material/CssBaseline";
import { ThemeProvider as i } from "@mui/material/styles";
import { createCadsTheme as d } from "@moshebaricdo/cads-variables/theme";
import { useMemo as n } from "react";
import { ExperimentalMotionContext as l, EXPERIMENTAL_MOTION_CSS as c } from "./experimentalMotion.js";
function C({
  children: t,
  baseline: s = !0,
  experimentalMotion: e = !1
}) {
  const a = n(() => d(), []);
  return /* @__PURE__ */ r(i, { theme: a, children: [
    s ? /* @__PURE__ */ o(m, {}) : null,
    /* @__PURE__ */ r(l.Provider, { value: e, children: [
      e ? /* @__PURE__ */ o("style", { "data-cads-experimental-motion-css": "", children: c }) : null,
      /* @__PURE__ */ o(
        "div",
        {
          "data-cads-root": "",
          ...e ? { "data-cads-experimental-motion": "" } : { "data-cads-experimental-motion-scope": "off" },
          style: { display: "contents" },
          children: t
        }
      )
    ] })
  ] });
}
export {
  C as CadsProvider
};
//# sourceMappingURL=CadsProvider.js.map
