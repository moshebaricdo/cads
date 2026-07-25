import { jsxs as o, jsx as r } from "react/jsx-runtime";
import i from "@mui/material/CssBaseline";
import { ThemeProvider as a } from "@mui/material/styles";
import { createCadsTheme as d } from "@codeai/cads-variables/theme";
import { useMemo as n } from "react";
import { ExperimentalMotionContext as l, EXPERIMENTAL_MOTION_CSS as c } from "./experimentalMotion.js";
function C({
  children: t,
  baseline: s = !0,
  experimentalMotion: e = !1
}) {
  const m = n(() => d(), []);
  return /* @__PURE__ */ o(a, { theme: m, children: [
    s ? /* @__PURE__ */ r(i, {}) : null,
    /* @__PURE__ */ o(l.Provider, { value: e, children: [
      e ? /* @__PURE__ */ r("style", { "data-cads-experimental-motion-css": "", children: c }) : null,
      /* @__PURE__ */ r(
        "div",
        {
          "data-cads-root": "",
          ...e ? { "data-cads-experimental-motion": "" } : {},
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
