import {
  FaIcon
} from "./chunk-4VK5J2NK.js";
import {
  CADS_FIGMA_FILE_KEY,
  cadsManifest
} from "./chunk-O5TX7OA3.js";

// src/theme/CadsProvider.tsx
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createCadsTheme } from "@codeai/cads-variables/theme";
import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function CadsProvider({ children, baseline = true }) {
  const theme = useMemo(() => createCadsTheme(), []);
  return /* @__PURE__ */ jsxs(ThemeProvider, { theme, children: [
    baseline ? /* @__PURE__ */ jsx(CssBaseline, {}) : null,
    children
  ] });
}

// src/components/Button.tsx
import MuiButton from "@mui/material/Button";
import { forwardRef } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var SIZE_MAP = {
  l: "large",
  m: "medium",
  s: "small",
  xs: "small"
};
var ICON_SIZE = {
  l: "l",
  m: "m",
  s: "s",
  xs: "xs"
};
var HEIGHT = {
  l: "var(--control-height-l)",
  m: "var(--control-height-m)",
  s: "var(--control-height-s)",
  xs: "var(--control-height-xs)"
};
function toneStyles(variant, tone) {
  const brand = {
    bg: "var(--ds-background-brand-primary)",
    bgHover: "var(--ds-background-brand-strong)",
    text: "var(--ds-text-neutral-white-fixed)",
    border: "var(--ds-border-brand-primary)"
  };
  const neutral = {
    bg: "var(--ds-background-neutral-secondary)",
    bgHover: "var(--ds-background-neutral-tertiary)",
    text: "var(--ds-text-neutral-primary)",
    border: "var(--ds-border-neutral-primary)"
  };
  const white = {
    bg: "var(--ds-background-neutral-white-fixed)",
    bgHover: "var(--ds-background-neutral-secondary)",
    text: "var(--ds-text-neutral-primary)",
    border: "var(--ds-border-neutral-primary)"
  };
  const destructive = {
    bg: "var(--ds-background-error-primary)",
    bgHover: "var(--ds-background-error-strong)",
    text: "var(--ds-text-neutral-white-fixed)",
    border: "var(--ds-border-error-primary)"
  };
  const palette = tone === "brand" ? brand : tone === "white" ? white : tone === "destructive" ? destructive : neutral;
  if (variant === "primary") {
    return {
      backgroundColor: palette.bg,
      color: palette.text,
      border: "1px solid transparent",
      "&:hover": { backgroundColor: palette.bgHover }
    };
  }
  if (variant === "secondary") {
    return {
      backgroundColor: "transparent",
      color: tone === "brand" ? "var(--ds-text-brand-primary)" : tone === "destructive" ? "var(--ds-text-error-primary)" : "var(--ds-text-neutral-primary)",
      border: `1px solid ${palette.border}`,
      "&:hover": { backgroundColor: "var(--ds-background-neutral-secondary)" }
    };
  }
  return {
    backgroundColor: "transparent",
    color: tone === "brand" ? "var(--ds-text-brand-primary)" : tone === "destructive" ? "var(--ds-text-error-primary)" : "var(--ds-text-neutral-primary)",
    border: "1px solid transparent",
    "&:hover": { backgroundColor: "var(--ds-background-neutral-secondary)" }
  };
}
var Button = forwardRef(
  function Button2({
    variant = "secondary",
    tone = "neutral",
    size = "m",
    iconName,
    iconPosition = "start",
    children,
    sx,
    disabled,
    ...rest
  }, ref) {
    const icon = iconName ? /* @__PURE__ */ jsx2(FaIcon, { name: iconName, size: ICON_SIZE[size] }) : null;
    return /* @__PURE__ */ jsx2(
      MuiButton,
      {
        ref,
        disableElevation: true,
        disabled,
        size: SIZE_MAP[size],
        startIcon: icon && iconPosition === "start" ? icon : void 0,
        endIcon: icon && iconPosition === "end" ? icon : void 0,
        sx: {
          minWidth: children ? void 0 : HEIGHT[size],
          height: HEIGHT[size],
          paddingInline: size === "xs" ? "8px" : size === "s" ? "12px" : "16px",
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-body)",
          fontWeight: "var(--font-weight-semibold)",
          fontSize: size === "xs" || size === "s" ? "var(--text-body-xs)" : "var(--text-body-sm)",
          textTransform: "none",
          boxShadow: "none",
          "&.Mui-focusVisible": {
            outline: "2px solid var(--ds-border-focused-primary)",
            outlineOffset: "2px"
          },
          "&.Mui-disabled": {
            opacity: 0.5
          },
          ...toneStyles(variant, tone),
          ...sx ?? {}
        },
        ...rest,
        children
      }
    );
  }
);

// src/components/TextField.tsx
import MuiTextField from "@mui/material/TextField";
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var HEIGHT2 = {
  l: "var(--control-height-l)",
  m: "var(--control-height-m)",
  s: "var(--control-height-s)",
  xs: "var(--control-height-xs)"
};
var TextField = forwardRef2(
  function TextField2({ size = "m", sx, ...rest }, ref) {
    return /* @__PURE__ */ jsx3(
      MuiTextField,
      {
        ref,
        variant: "outlined",
        size: size === "l" || size === "m" ? "medium" : "small",
        sx: {
          "& .MuiOutlinedInput-root": {
            height: HEIGHT2[size],
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-body)",
            fontSize: size === "xs" || size === "s" ? "var(--text-body-xs)" : "var(--text-body-sm)",
            backgroundColor: "var(--ds-background-neutral-primary)",
            color: "var(--ds-text-neutral-primary)",
            "& fieldset": {
              borderColor: "var(--ds-border-neutral-primary)"
            },
            "&:hover fieldset": {
              borderColor: "var(--ds-border-neutral-secondary)"
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--ds-border-focused-primary)",
              borderWidth: 2
            },
            "&.Mui-error fieldset": {
              borderColor: "var(--ds-border-error-primary)"
            },
            "&.Mui-disabled": {
              backgroundColor: "var(--ds-background-disabled-neutral)"
            }
          },
          "& .MuiInputLabel-root": {
            fontFamily: "var(--font-body)",
            color: "var(--ds-text-neutral-secondary)",
            "&.Mui-focused": {
              color: "var(--ds-text-brand-primary)"
            }
          },
          "& .MuiFormHelperText-root": {
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-xs)"
          },
          ...sx ?? {}
        },
        ...rest
      }
    );
  }
);

// src/components/Checkbox.tsx
import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var Checkbox = forwardRef3(
  function Checkbox2({ label, size = "m", sx, ...rest }, ref) {
    const control = /* @__PURE__ */ jsx4(
      MuiCheckbox,
      {
        ref,
        size: size === "s" ? "small" : "medium",
        sx: {
          color: "var(--ds-border-neutral-primary)",
          padding: size === "s" ? "4px" : "8px",
          "&.Mui-checked": {
            color: "var(--ds-background-selected-primary)"
          },
          "&.Mui-focusVisible": {
            outline: "2px solid var(--ds-border-focused-primary)",
            outlineOffset: "2px"
          },
          "&.Mui-disabled": {
            color: "var(--ds-background-disabled-neutral)"
          },
          ...sx ?? {}
        },
        ...rest
      }
    );
    if (label == null) return control;
    return /* @__PURE__ */ jsx4(
      FormControlLabel,
      {
        control,
        label,
        sx: {
          marginLeft: 0,
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-sm)",
            color: "var(--ds-text-neutral-primary)"
          }
        }
      }
    );
  }
);

// src/components/Radio.tsx
import MuiRadio from "@mui/material/Radio";
import FormControlLabel2 from "@mui/material/FormControlLabel";
import { forwardRef as forwardRef4 } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var Radio = forwardRef4(
  function Radio2({ label, size = "m", sx, ...rest }, ref) {
    const control = /* @__PURE__ */ jsx5(
      MuiRadio,
      {
        ref,
        size: size === "s" ? "small" : "medium",
        sx: {
          color: "var(--ds-border-neutral-primary)",
          padding: size === "s" ? "4px" : "8px",
          "&.Mui-checked": {
            color: "var(--ds-background-selected-primary)"
          },
          "&.Mui-focusVisible": {
            outline: "2px solid var(--ds-border-focused-primary)",
            outlineOffset: "2px"
          },
          "&.Mui-disabled": {
            color: "var(--ds-background-disabled-neutral)"
          },
          ...sx ?? {}
        },
        ...rest
      }
    );
    if (label == null) return control;
    return /* @__PURE__ */ jsx5(
      FormControlLabel2,
      {
        control,
        label,
        sx: {
          marginLeft: 0,
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-sm)",
            color: "var(--ds-text-neutral-primary)"
          }
        }
      }
    );
  }
);

// src/components/Tag.tsx
import Chip from "@mui/material/Chip";
import { forwardRef as forwardRef5 } from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var TONE_STYLES = {
  neutral: {
    bg: "var(--ds-background-neutral-secondary)",
    color: "var(--ds-text-neutral-primary)",
    border: "var(--ds-border-neutral-primary)"
  },
  brand: {
    bg: "var(--ds-background-brand-light)",
    color: "var(--ds-text-brand-primary)",
    border: "var(--ds-border-brand-primary)"
  },
  success: {
    bg: "var(--ds-background-success-light)",
    color: "var(--ds-text-success-primary)",
    border: "var(--ds-border-success-primary)"
  },
  warning: {
    bg: "var(--ds-background-warning-light)",
    color: "var(--ds-text-warning-primary)",
    border: "var(--ds-border-warning-primary)"
  },
  error: {
    bg: "var(--ds-background-error-light)",
    color: "var(--ds-text-error-primary)",
    border: "var(--ds-border-error-primary)"
  },
  info: {
    bg: "var(--ds-background-info-light)",
    color: "var(--ds-text-info-primary)",
    border: "var(--ds-border-info-primary)"
  }
};
var Tag = forwardRef5(function Tag2({ tone = "neutral", size = "m", iconName, label, sx, ...rest }, ref) {
  const t = TONE_STYLES[tone];
  return /* @__PURE__ */ jsx6(
    Chip,
    {
      ref,
      label,
      size: size === "s" ? "small" : "medium",
      icon: iconName ? /* @__PURE__ */ jsx6(FaIcon, { name: iconName, size: "xs" }) : void 0,
      sx: {
        height: size === "s" ? "20px" : "24px",
        borderRadius: "var(--radius-round)",
        backgroundColor: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-xs)",
        fontWeight: "var(--font-weight-medium)",
        "& .MuiChip-icon": { color: "inherit", marginLeft: "6px" },
        ...sx ?? {}
      },
      ...rest
    }
  );
});

// src/components/Tooltip.tsx
import MuiTooltip from "@mui/material/Tooltip";
import { jsx as jsx7 } from "react/jsx-runtime";
function Tooltip({ children, title, ...rest }) {
  return /* @__PURE__ */ jsx7(
    MuiTooltip,
    {
      title,
      arrow: true,
      slotProps: {
        tooltip: {
          sx: {
            backgroundColor: "var(--ds-background-neutral-primary-inverse)",
            color: "var(--ds-text-neutral-primary-inverse)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-xs)",
            padding: "6px 10px",
            boxShadow: "var(--shadow-md)"
          }
        },
        arrow: {
          sx: {
            color: "var(--ds-background-neutral-primary-inverse)"
          }
        }
      },
      ...rest,
      children
    }
  );
}
export {
  Button,
  CADS_FIGMA_FILE_KEY,
  CadsProvider,
  Checkbox,
  Radio,
  Tag,
  TextField,
  Tooltip,
  cadsManifest
};
//# sourceMappingURL=index.js.map