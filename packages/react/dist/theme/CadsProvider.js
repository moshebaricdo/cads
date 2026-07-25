import { jsxs, jsx } from 'react/jsx-runtime';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createCadsTheme } from '@codeai/cads-variables/theme';
import { useMemo } from 'react';
import { ExperimentalMotionContext, EXPERIMENTAL_MOTION_CSS } from './experimentalMotion.js';

function CadsProvider({
  children,
  baseline = true,
  experimentalMotion = false
}) {
  const theme = useMemo(() => createCadsTheme(), []);
  return /* @__PURE__ */ jsxs(ThemeProvider, { theme, children: [
    baseline ? /* @__PURE__ */ jsx(CssBaseline, {}) : null,
    /* @__PURE__ */ jsxs(ExperimentalMotionContext.Provider, { value: experimentalMotion, children: [
      experimentalMotion ? /* @__PURE__ */ jsx("style", { "data-cads-experimental-motion-css": "", children: EXPERIMENTAL_MOTION_CSS }) : null,
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-cads-root": "",
          ...experimentalMotion ? { "data-cads-experimental-motion": "" } : {},
          style: { display: "contents" },
          children
        }
      )
    ] })
  ] });
}

export { CadsProvider };
//# sourceMappingURL=CadsProvider.js.map
//# sourceMappingURL=CadsProvider.js.map