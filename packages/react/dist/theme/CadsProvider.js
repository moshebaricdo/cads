import { jsxs, jsx } from 'react/jsx-runtime';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createCadsTheme } from '@codeai/cads-variables/theme';
import { useMemo } from 'react';

function CadsProvider({ children, baseline = true }) {
  const theme = useMemo(() => createCadsTheme(), []);
  return /* @__PURE__ */ jsxs(ThemeProvider, { theme, children: [
    baseline ? /* @__PURE__ */ jsx(CssBaseline, {}) : null,
    children
  ] });
}

export { CadsProvider };
//# sourceMappingURL=CadsProvider.js.map
//# sourceMappingURL=CadsProvider.js.map