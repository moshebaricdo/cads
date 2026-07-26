"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createCadsTheme } from "@codeai/cads-variables/theme";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  ExperimentalMotionContext,
  EXPERIMENTAL_MOTION_CSS,
} from "./experimentalMotion";

export interface CadsProviderProps {
  children: ReactNode;
  /** When true, injects MUI CssBaseline. Default true. */
  baseline?: boolean;
  /**
   * Opt into experimental micro-interaction recipes (Press, Surface,
   * Indicator, Highlight chase). Default false — API/feel may change.
   */
  experimentalMotion?: boolean;
}

/**
 * Provides the CADS MUI theme. Pair with `@codeai/cads-variables/variables.css`
 * and toggle `.dark` on an ancestor for dark mode.
 */
export function CadsProvider({
  children,
  baseline = true,
  experimentalMotion = false,
}: CadsProviderProps) {
  const theme = useMemo(() => createCadsTheme(), []);
  return (
    <ThemeProvider theme={theme}>
      {baseline ? <CssBaseline /> : null}
      <ExperimentalMotionContext.Provider value={experimentalMotion}>
        {experimentalMotion ? (
          <style data-cads-experimental-motion-css="">
            {EXPERIMENTAL_MOTION_CSS}
          </style>
        ) : null}
        <div
          data-cads-root=""
          {...(experimentalMotion
            ? { "data-cads-experimental-motion": "" }
            : { "data-cads-experimental-motion-scope": "off" })}
          style={{ display: "contents" }}
        >
          {children}
        </div>
      </ExperimentalMotionContext.Provider>
    </ThemeProvider>
  );
}
