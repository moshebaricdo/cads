import { ThemeProvider, CssBaseline } from "@mui/material";
import { createCadsTheme } from "@codeai/cads-variables/theme";
import type { ReactNode } from "react";
import { useMemo } from "react";

export interface CadsProviderProps {
  children: ReactNode;
  /** When true, injects MUI CssBaseline. Default true. */
  baseline?: boolean;
}

/**
 * Provides the CADS MUI theme. Pair with `@codeai/cads-variables/variables.css`
 * and toggle `.dark` on an ancestor for dark mode.
 */
export function CadsProvider({ children, baseline = true }: CadsProviderProps) {
  const theme = useMemo(() => createCadsTheme(), []);
  return (
    <ThemeProvider theme={theme}>
      {baseline ? <CssBaseline /> : null}
      {children}
    </ThemeProvider>
  );
}
