/**
 * Generated MUI theme options mapped to CADS variables.
 * Palette uses resolved light-mode hexes (MUI cannot parse CSS var() in augmentColor).
 * Runtime light/dark still comes from `@codeai/cads-variables/variables.css` + `.dark`.
 * Component wrappers should prefer semantic CSS vars (e.g. `--background-brand-primary`) in `sx` for live theme switching.
 */
import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { colorVarsLight } from "./generated/cssVars";
import {
  controlHeights,
  elevation,
  motion,
  pxToRem,
  shape,
  spacing,
  typography,
  zIndex,
} from "./nonColorVariables";

function hex(name: string, fallback: string): string {
  const value = (colorVarsLight as Record<string, string>)[name];
  return value ?? fallback;
}

/**
 * Base theme options. Light/dark visual switching is driven by the `.dark` class
 * on an ancestor (CSS variables), matching the Lab2 / CADS runtime convention.
 */
export const cadsThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: typography.fontFamily.body,
    h1: {
      fontFamily: typography.fontFamily.heading,
      fontSize: pxToRem(typography.fontSize.headingXxl),
      lineHeight: pxToRem(typography.lineHeight.headingXxl),
      fontWeight: Number(typography.fontWeight.semibold),
      letterSpacing: typography.letterSpacing.headingDisplay,
    },
    h2: {
      fontFamily: typography.fontFamily.heading,
      fontSize: pxToRem(typography.fontSize.headingXl),
      lineHeight: pxToRem(typography.lineHeight.headingXl),
      fontWeight: Number(typography.fontWeight.semibold),
      letterSpacing: typography.letterSpacing.headingDisplay,
    },
    h3: {
      fontFamily: typography.fontFamily.body,
      fontSize: pxToRem(typography.fontSize.headingLg),
      lineHeight: pxToRem(typography.lineHeight.headingLg),
      fontWeight: Number(typography.fontWeight.semibold),
    },
    h4: {
      fontFamily: typography.fontFamily.body,
      fontSize: pxToRem(typography.fontSize.headingMd),
      lineHeight: pxToRem(typography.lineHeight.headingMd),
      fontWeight: Number(typography.fontWeight.semibold),
    },
    h5: {
      fontFamily: typography.fontFamily.body,
      fontSize: pxToRem(typography.fontSize.headingSm),
      lineHeight: pxToRem(typography.lineHeight.headingSm),
      fontWeight: Number(typography.fontWeight.semibold),
    },
    h6: {
      fontFamily: typography.fontFamily.body,
      fontSize: pxToRem(typography.fontSize.headingXs),
      lineHeight: pxToRem(typography.lineHeight.headingXs),
      fontWeight: Number(typography.fontWeight.semibold),
    },
    body1: {
      fontSize: pxToRem(typography.fontSize.bodyMd),
      lineHeight: pxToRem(typography.lineHeight.bodyMd),
    },
    body2: {
      fontSize: pxToRem(typography.fontSize.bodySm),
      lineHeight: pxToRem(typography.lineHeight.bodySm),
    },
    button: {
      textTransform: "none",
      fontWeight: Number(typography.fontWeight.semibold),
    },
  },
  shape: {
    borderRadius: parseInt(shape.radiusSm, 10),
  },
  spacing: parseInt(spacing.xxs, 10),
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: zIndex.drawer,
    modal: zIndex.modal,
    snackbar: zIndex.toast,
    tooltip: zIndex.tooltip,
  },
  shadows: [
    "none",
    elevation.shadowSm,
    elevation.shadowSm,
    elevation.shadowMd,
    elevation.shadowMd,
    elevation.shadowMd,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
    elevation.shadowLg,
  ],
  palette: {
    mode: "light",
    primary: {
      main: hex("background-brand-primary", "#4C42CF"),
      contrastText: hex("text-neutral-white-fixed", "#FFFFFF"),
    },
    secondary: {
      main: hex("background-neutral-secondary", "#F1F2F4"),
      contrastText: hex("text-neutral-primary", "#121212"),
    },
    error: {
      main: hex("background-error-primary", "#EB1414"),
      contrastText: hex("text-neutral-white-fixed", "#FFFFFF"),
    },
    warning: {
      main: hex("background-warning-primary", "#F5A623"),
    },
    success: {
      main: hex("background-success-primary", "#258830"),
    },
    info: {
      main: hex("background-info-primary", "#1570D1"),
    },
    background: {
      default: hex("background-neutral-primary", "#FFFFFF"),
      paper: hex("background-neutral-primary", "#FFFFFF"),
    },
    text: {
      primary: hex("text-neutral-primary", "#121212"),
      secondary: hex("text-neutral-secondary", "#4B5258"),
      disabled: hex("text-neutral-quaternary", "#87909A"),
    },
    divider: hex("border-neutral-primary", "#D3D6DA"),
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.radiusSm,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
          "&.Mui-focusVisible": {
            outline: "2px solid var(--border-focused-primary)",
            outlineOffset: "2px",
          },
        },
        sizeLarge: { height: controlHeights.l },
        sizeMedium: { height: controlHeights.m },
        sizeSmall: { height: controlHeights.s },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: shape.radiusSm,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--border-focused-primary)",
            borderWidth: 2,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "var(--background-neutral-primary-inverse)",
          color: "var(--text-neutral-primary-inverse)",
          borderRadius: shape.radiusSm,
          fontSize: pxToRem(typography.fontSize.bodyXs),
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "var(--background-neutral-primary)",
          color: "var(--text-neutral-primary)",
        },
      },
    },
  },
};

export function createCadsTheme(overrides?: ThemeOptions) {
  return createTheme(cadsThemeOptions, overrides ?? {});
}

export {
  controlHeights,
  elevation,
  motion,
  shape,
  spacing,
  typography,
  zIndex,
};
