import {
  colorVarsLight,
  controlHeights,
  elevation,
  shape,
  spacing,
  typography
} from "./chunk-X5TIG6QO.js";

// src/theme.ts
import { createTheme } from "@mui/material/styles";
function hex(name, fallback) {
  const value = colorVarsLight[name];
  return value ?? fallback;
}
var cadsThemeOptions = {
  typography: {
    fontFamily: typography.fontFamily.body,
    h1: {
      fontFamily: typography.fontFamily.heading,
      fontSize: typography.fontSize.headingXxl,
      lineHeight: typography.lineHeight.headingXxl,
      fontWeight: Number(typography.fontWeight.medium),
      letterSpacing: typography.letterSpacing.headingDisplay
    },
    h2: {
      fontFamily: typography.fontFamily.heading,
      fontSize: typography.fontSize.headingXl,
      lineHeight: typography.lineHeight.headingXl,
      fontWeight: Number(typography.fontWeight.medium),
      letterSpacing: typography.letterSpacing.headingDisplay
    },
    h3: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.fontSize.headingLg,
      lineHeight: typography.lineHeight.headingLg,
      fontWeight: Number(typography.fontWeight.semibold)
    },
    h4: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.fontSize.headingMd,
      lineHeight: typography.lineHeight.headingMd,
      fontWeight: Number(typography.fontWeight.semibold)
    },
    h5: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.fontSize.headingSm,
      lineHeight: typography.lineHeight.headingSm,
      fontWeight: Number(typography.fontWeight.semibold)
    },
    h6: {
      fontFamily: typography.fontFamily.body,
      fontSize: typography.fontSize.headingXs,
      lineHeight: typography.lineHeight.headingXs,
      fontWeight: Number(typography.fontWeight.semibold)
    },
    body1: {
      fontSize: typography.fontSize.bodyMd,
      lineHeight: typography.lineHeight.bodyMd
    },
    body2: {
      fontSize: typography.fontSize.bodySm,
      lineHeight: typography.lineHeight.bodySm
    },
    button: {
      textTransform: "none",
      fontWeight: Number(typography.fontWeight.semibold)
    }
  },
  shape: {
    borderRadius: parseInt(shape.radiusSm, 10)
  },
  spacing: parseInt(spacing.xxs, 10),
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
    elevation.shadowLg
  ],
  palette: {
    mode: "light",
    primary: {
      main: hex("background-brand-primary", "#4C42CF"),
      contrastText: hex("text-neutral-white-fixed", "#FFFFFF")
    },
    secondary: {
      main: hex("background-neutral-secondary", "#F1F2F4"),
      contrastText: hex("text-neutral-primary", "#121212")
    },
    error: {
      main: hex("background-error-primary", "#EB1414"),
      contrastText: hex("text-neutral-white-fixed", "#FFFFFF")
    },
    warning: {
      main: hex("background-warning-primary", "#F5A623")
    },
    success: {
      main: hex("background-success-primary", "#258830")
    },
    info: {
      main: hex("background-info-primary", "#1570D1")
    },
    background: {
      default: hex("background-neutral-primary", "#FFFFFF"),
      paper: hex("background-neutral-primary", "#FFFFFF")
    },
    text: {
      primary: hex("text-neutral-primary", "#121212"),
      secondary: hex("text-neutral-secondary", "#4B5258"),
      disabled: hex("text-neutral-quaternary", "#87909A")
    },
    divider: hex("border-neutral-primary", "#DBDDE2")
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.radiusSm,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
          "&.Mui-focusVisible": {
            outline: "2px solid var(--ds-border-focused-primary)",
            outlineOffset: "2px"
          }
        },
        sizeLarge: { height: controlHeights.l },
        sizeMedium: { height: controlHeights.m },
        sizeSmall: { height: controlHeights.s }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: shape.radiusSm,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--ds-border-focused-primary)",
            borderWidth: 2
          }
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "var(--ds-background-neutral-primary-inverse)",
          color: "var(--ds-text-neutral-primary-inverse)",
          borderRadius: shape.radiusSm,
          fontSize: typography.fontSize.bodyXs
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "var(--ds-background-neutral-primary)",
          color: "var(--ds-text-neutral-primary)"
        }
      }
    }
  }
};
function createCadsTheme(overrides) {
  return createTheme(cadsThemeOptions, overrides ?? {});
}
export {
  cadsThemeOptions,
  controlHeights,
  createCadsTheme,
  elevation,
  shape,
  spacing,
  typography
};
//# sourceMappingURL=theme.js.map