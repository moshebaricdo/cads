import {
  FaIcon
} from "./chunk-H7T2BEWS.js";
import {
  CADS_FIGMA_FILE_KEY,
  cadsManifest
} from "./chunk-ONJD47LQ.js";

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

// src/shared/controlSize.ts
var CONTROL_HEIGHT = {
  large: "var(--control-height-large)",
  medium: "var(--control-height-medium)",
  small: "var(--control-height-small)",
  extraSmall: "var(--control-height-extra-small)"
};
var BUTTON_SIZE = {
  large: {
    height: CONTROL_HEIGHT.large,
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.625rem",
    // 10px
    gap: "0.556em",
    // 10px @ 18px type
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.125rem",
    // 18px
    iconOnlyPadding: "0.75rem"
    // 12px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.5rem",
    // 8px
    gap: "0.5em",
    // 8px @ 16px type
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem",
    // 16px
    iconOnlyPadding: "0.625rem"
    // 10px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingInline: "0.75rem",
    // 12px
    paddingBlock: "0.3125rem",
    // 5px
    gap: "0.429em",
    // 6px @ 14px type
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem",
    // 14px
    iconOnlyPadding: "0.4375rem"
    // 7px
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingInline: "0.5rem",
    // 8px
    paddingBlock: "0.125rem",
    // 2px
    gap: "0.333em",
    // 4px @ 12px type (Figma Button)
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem",
    // 12px
    iconOnlyPadding: "0.25rem"
    // 4px
  }
};
var ICON_TOGGLE_SIZE = {
  large: {
    size: CONTROL_HEIGHT.large,
    padding: "0.75rem",
    // 12px
    iconPx: "1.1875rem",
    // 19px
    iconSlot: "1.5rem"
    // 24px
  },
  medium: {
    size: CONTROL_HEIGHT.medium,
    padding: "0.625rem",
    // 10px
    iconPx: "1rem",
    // 16px
    iconSlot: "1.25rem"
    // 20px
  },
  small: {
    size: CONTROL_HEIGHT.small,
    padding: "0.4375rem",
    // 7px
    iconPx: "0.875rem",
    // 14px
    iconSlot: "1.125rem"
    // 18px
  },
  extraSmall: {
    size: CONTROL_HEIGHT.extraSmall,
    padding: "0.25rem",
    // 4px
    iconPx: "0.75rem",
    // 12px
    iconSlot: "1rem"
    // 16px
  }
};
var FOCUS_RING = "0 0 0 2px var(--background-neutral-primary), 0 0 0 4px var(--border-focused-primary)";
var TRANSITION_COLORS = "var(--transition-colors)";
var TEXT_INPUT_SIZE = {
  large: {
    height: CONTROL_HEIGHT.large,
    areaHeight: "6.5rem",
    // 104px
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.625rem",
    // 10px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)"
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    areaHeight: "5.5rem",
    // 88px
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.5rem",
    // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)"
  },
  small: {
    height: CONTROL_HEIGHT.small,
    areaHeight: "4.75rem",
    // 76px
    paddingInline: "0.75rem",
    // 12px
    paddingBlock: "0.3125rem",
    // 5px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)"
  },
  extraSmall: {
    // Approved exception: Figma field is 22px; CADS uses shared 24px control height.
    height: CONTROL_HEIGHT.extraSmall,
    areaHeight: "3.625rem",
    // 58px
    paddingInline: "0.5rem",
    // 8px
    paddingBlock: "0.125rem",
    // 2px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)"
  }
};
var FIELD_WRAPPER_SIZE = {
  large: {
    labelFontSize: "var(--text-body-md)",
    labelLineHeight: "var(--leading-body-md)",
    helperFontSize: "var(--text-body-md)",
    helperLineHeight: "var(--leading-body-md)",
    helperGap: "0.375rem",
    // 6px
    helperIconPx: "1rem",
    // 16px
    helperIconSlot: "1.125rem"
    // 18px
  },
  medium: {
    labelFontSize: "var(--text-body-sm)",
    labelLineHeight: "var(--leading-body-sm)",
    helperFontSize: "var(--text-body-sm)",
    helperLineHeight: "var(--leading-body-sm)",
    helperGap: "0.25rem",
    // 4px
    helperIconPx: "0.875rem",
    // 14px
    helperIconSlot: "1rem"
    // 16px
  },
  small: {
    labelFontSize: "var(--text-body-xs)",
    labelLineHeight: "var(--leading-body-xs)",
    helperFontSize: "var(--text-body-xs)",
    helperLineHeight: "var(--leading-body-xs)",
    helperGap: "0.25rem",
    // 4px
    helperIconPx: "0.75rem",
    // 12px
    helperIconSlot: "0.875rem"
    // 14px
  },
  extraSmall: {
    labelFontSize: "var(--text-body-xxs)",
    labelLineHeight: "var(--leading-body-xxs)",
    helperFontSize: "var(--text-body-xxs)",
    helperLineHeight: "var(--leading-body-xxs)",
    helperGap: "0.25rem",
    // 4px
    helperIconPx: "0.625rem",
    // 10px
    helperIconSlot: "0.75rem"
    // 12px
  }
};
var SEGMENTED_SIZE = {
  large: {
    height: CONTROL_HEIGHT.large,
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.625rem",
    // 10px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.1875rem",
    // 19px
    iconOnlyPadding: "0.75rem"
    // 12px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingInline: "0.75rem",
    // 12px
    paddingBlock: "0.5rem",
    // 8px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem",
    // 16px
    iconOnlyPadding: "0.625rem"
    // 10px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingInline: "0.625rem",
    // 10px
    paddingBlock: "0.3125rem",
    // 5px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem",
    // 14px
    iconOnlyPadding: "0.4375rem"
    // 7px
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingInline: "0.5rem",
    // 8px
    paddingBlock: "0.125rem",
    // 2px
    gap: "0.25rem",
    // 4px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem",
    // 12px
    iconOnlyPadding: "0.25rem"
    // 4px
  }
};

// src/components/Button.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function resolveColor(color, variant, iconOnly) {
  if (color !== "tertiary") return color;
  if (variant === "text" && iconOnly) return "tertiary";
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[CADS Button] color="tertiary" is only defined in Figma for variant="text" + icon-only. Falling back to color="secondary" for variant="${variant}"${iconOnly ? "" : " (labeled)"}.`
    );
  }
  return "secondary";
}
function colorRecipe(color) {
  switch (color) {
    case "primary":
      return {
        // Contained primary → brand fill
        filledBg: "var(--background-brand-primary)",
        filledBgHover: "var(--background-brand-strong)",
        filledBgPressed: "var(--background-brand-primary)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-brand)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        // Outlined primary → solid border
        outlinedBorder: "var(--border-neutral-solid)",
        outlinedFg: "var(--text-neutral-primary)",
        outlinedHoverBg: "var(--background-neutral-tertiary)",
        outlinedPressedBg: "var(--background-neutral-primary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-brand-primary)",
        textFgPressed: "var(--text-brand-secondary)",
        textHoverBg: "var(--background-brand-light)",
        textPressedBg: "var(--background-brand-light)",
        textDisabledFg: "var(--text-disabled-brand)"
      };
    case "error":
      return {
        filledBg: "var(--background-error-primary)",
        filledBgHover: "var(--background-error-strong)",
        filledBgPressed: "var(--background-error-primary)",
        filledFg: "var(--text-neutral-white-fixed)",
        filledDisabledBg: "var(--background-disabled-error)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-error-primary)",
        outlinedFg: "var(--text-error-primary)",
        outlinedHoverBg: "var(--background-error-light)",
        outlinedPressedBg: "var(--background-error-light)",
        outlinedDisabledBorder: "var(--border-disabled-error)",
        outlinedDisabledFg: "var(--text-disabled-error)",
        textFg: "var(--text-error-primary)",
        textFgPressed: "var(--text-error-secondary)",
        textHoverBg: "var(--background-error-light)",
        textPressedBg: "var(--background-error-light)",
        textDisabledFg: "var(--text-disabled-error)"
      };
    case "tertiary":
      return {
        filledBg: "var(--background-neutral-secondary)",
        filledBgHover: "var(--background-neutral-tertiary)",
        filledBgPressed: "var(--background-neutral-secondary)",
        filledFg: "var(--text-neutral-primary)",
        filledDisabledBg: "var(--background-disabled-neutral)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-secondary)",
        outlinedFg: "var(--text-neutral-quaternary)",
        outlinedHoverBg: "var(--background-neutral-quaternary)",
        outlinedPressedBg: "var(--background-neutral-primary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-neutral-quaternary)",
        textFgPressed: "var(--text-neutral-quaternary)",
        textHoverBg: "var(--background-neutral-quaternary)",
        textPressedBg: "var(--background-neutral-quaternary)",
        textDisabledFg: "var(--text-disabled-neutral)"
      };
    case "secondary":
    default:
      return {
        // Contained secondary → primary-inverse fill
        filledBg: "var(--background-neutral-primary-inverse)",
        filledBgHover: "var(--background-neutral-octonary)",
        filledBgPressed: "var(--background-neutral-primary-inverse)",
        filledFg: "var(--text-neutral-primary-inverse)",
        filledDisabledBg: "var(--background-disabled-neutral)",
        filledDisabledFg: "var(--text-disabled-neutral-inverse)",
        outlinedBorder: "var(--border-neutral-secondary)",
        outlinedFg: "var(--text-neutral-primary)",
        outlinedHoverBg: "var(--background-neutral-tertiary)",
        outlinedPressedBg: "var(--background-neutral-primary)",
        outlinedDisabledBorder: "var(--border-disabled-neutral)",
        outlinedDisabledFg: "var(--text-disabled-neutral)",
        textFg: "var(--text-neutral-primary)",
        textFgPressed: "var(--text-neutral-tertiary)",
        textHoverBg: "var(--background-neutral-quaternary)",
        textPressedBg: "var(--background-neutral-quaternary)",
        textDisabledFg: "var(--text-disabled-neutral)"
      };
  }
}
function variantStyles(variant, color) {
  const c = colorRecipe(color);
  if (variant === "contained") {
    return {
      backgroundColor: c.filledBg,
      color: c.filledFg,
      border: "1px solid transparent",
      "&:hover": { backgroundColor: c.filledBgHover },
      "&:active": { backgroundColor: c.filledBgPressed },
      "&.Mui-disabled": {
        backgroundColor: c.filledDisabledBg,
        color: c.filledDisabledFg,
        opacity: 1,
        // Icons must inherit inverse disabled text on solid fills.
        "& .MuiButton-startIcon, & .MuiButton-endIcon, & [data-fa-icon]": {
          color: c.filledDisabledFg
        }
      }
    };
  }
  if (variant === "outlined") {
    return {
      backgroundColor: "var(--background-neutral-primary)",
      color: c.outlinedFg,
      border: `1px solid ${c.outlinedBorder}`,
      "&:hover": { backgroundColor: c.outlinedHoverBg },
      "&:active": {
        backgroundColor: c.outlinedPressedBg,
        color: c.outlinedFg
      },
      "&.Mui-disabled": {
        backgroundColor: "var(--background-neutral-primary)",
        color: c.outlinedDisabledFg,
        borderColor: c.outlinedDisabledBorder,
        opacity: 1
      }
    };
  }
  return {
    backgroundColor: "transparent",
    color: c.textFg,
    border: "1px solid transparent",
    "&:hover": { backgroundColor: c.textHoverBg },
    "&:active": {
      backgroundColor: c.textPressedBg,
      color: c.textFgPressed
    },
    "&.Mui-disabled": {
      color: c.textDisabledFg,
      opacity: 1
    }
  };
}
var Button = forwardRef(
  function Button2({
    variant = "contained",
    color = "primary",
    size = "medium",
    iconOnly: iconOnlyProp,
    startIconName,
    endIconName,
    children,
    sx,
    disabled,
    ...rest
  }, ref) {
    const dims = BUTTON_SIZE[size];
    const iconOnly = iconOnlyProp ?? (!children && Boolean(startIconName || endIconName));
    const resolvedColor = resolveColor(color, variant, iconOnly);
    const startIcon = startIconName ? /* @__PURE__ */ jsx2(FaIcon, { name: startIconName, fontSize: dims.iconPx }) : null;
    const endIcon = endIconName ? /* @__PURE__ */ jsx2(FaIcon, { name: endIconName, fontSize: dims.iconPx }) : null;
    return /* @__PURE__ */ jsx2(
      MuiButton,
      {
        ref,
        disableElevation: true,
        disabled,
        startIcon: !iconOnly && startIcon ? startIcon : void 0,
        endIcon: !iconOnly && endIcon ? endIcon : void 0,
        sx: {
          minWidth: dims.height,
          width: iconOnly ? dims.height : void 0,
          height: dims.height,
          paddingInline: iconOnly ? dims.iconOnlyPadding : dims.paddingInline,
          paddingBlock: iconOnly ? dims.iconOnlyPadding : dims.paddingBlock,
          gap: iconOnly ? 0 : dims.gap,
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-body)",
          fontWeight: "var(--font-weight-semibold)",
          fontSize: dims.fontSize,
          lineHeight: dims.lineHeight,
          textTransform: "none",
          boxShadow: "none",
          boxSizing: "border-box",
          transition: TRANSITION_COLORS,
          "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            margin: 0
          },
          "&.Mui-focusVisible": {
            boxShadow: FOCUS_RING
          },
          ...variantStyles(variant, resolvedColor),
          ...sx ?? {}
        },
        ...rest,
        children: iconOnly ? startIcon || endIcon : children
      }
    );
  }
);

// src/components/SegmentedButton.tsx
import ButtonBase from "@mui/material/ButtonBase";
import { forwardRef as forwardRef2, useId, useState } from "react";
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function segmentCorners(index, count) {
  const r = "var(--radius-sm)";
  const isFirst = index === 0;
  const isLast = index === count - 1;
  if (isFirst && isLast) {
    return {
      borderTopLeftRadius: r,
      borderTopRightRadius: r,
      borderBottomLeftRadius: r,
      borderBottomRightRadius: r
    };
  }
  if (isFirst) {
    return {
      borderTopLeftRadius: r,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: r,
      borderBottomRightRadius: 0
    };
  }
  if (isLast) {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: r,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: r
    };
  }
  return {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  };
}
var SegmentedButton = forwardRef2(
  function SegmentedButton2({
    size = "medium",
    value: valueProp,
    defaultValue,
    onChange,
    options,
    disabled,
    iconOnly = false,
    "aria-label": ariaLabel,
    className
  }, ref) {
    const dims = SEGMENTED_SIZE[size];
    const groupId = useId();
    const controlled = valueProp !== void 0;
    const [uncontrolled, setUncontrolled] = useState(
      defaultValue ?? options[0]?.value
    );
    const value = controlled ? valueProp : uncontrolled;
    const unselectedBorder = "var(--border-neutral-secondary)";
    return /* @__PURE__ */ jsx3(
      "div",
      {
        ref,
        role: "radiogroup",
        "aria-label": ariaLabel,
        className,
        style: {
          display: "inline-flex",
          alignItems: "stretch",
          /* Figma Group itemSpacing: -1 — collapse shared borders */
          gap: 0,
          overflow: "hidden",
          borderRadius: "var(--radius-sm)"
        },
        children: options.map((option, index) => {
          const selected = option.value === value;
          const isDisabled = disabled || option.disabled;
          const corners = segmentCorners(index, options.length);
          const startIcon = option.iconName ? /* @__PURE__ */ jsx3(FaIcon, { name: option.iconName, fontSize: dims.iconPx }) : null;
          const endIcon = option.endIconName ? /* @__PURE__ */ jsx3(FaIcon, { name: option.endIconName, fontSize: dims.iconPx }) : null;
          return /* @__PURE__ */ jsx3(
            ButtonBase,
            {
              role: "radio",
              "aria-checked": selected,
              id: `${groupId}-${option.value}`,
              disabled: isDisabled,
              disableRipple: true,
              onClick: () => {
                if (!controlled) setUncontrolled(option.value);
                onChange?.(option.value);
              },
              sx: {
                flex: iconOnly ? "0 0 auto" : "1 1 auto",
                minWidth: dims.height,
                width: iconOnly ? dims.height : void 0,
                height: dims.height,
                paddingInline: iconOnly ? dims.iconOnlyPadding : dims.paddingInline,
                paddingBlock: iconOnly ? dims.iconOnlyPadding : dims.paddingBlock,
                gap: iconOnly ? 0 : dims.gap,
                boxSizing: "border-box",
                /* Overlap so adjacent 1px borders share a single hairline */
                marginLeft: index === 0 ? 0 : "-1px",
                border: `1px solid ${selected ? "var(--border-selected-primary)" : unselectedBorder}`,
                ...corners,
                fontFamily: "var(--font-body)",
                /* Figma Body Semi Bold at every size — no labelStyle prop */
                fontWeight: "var(--font-weight-semibold)",
                fontSize: dims.fontSize,
                lineHeight: dims.lineHeight,
                textTransform: "none",
                whiteSpace: "nowrap",
                transition: TRANSITION_COLORS,
                backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
                color: selected ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
                zIndex: selected ? 1 : 0,
                "&:hover": {
                  zIndex: 2,
                  /* Selected hover: fill stays primary; border strengthens (Figma). */
                  backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-neutral-tertiary)",
                  borderColor: selected ? "var(--border-selected-strong)" : unselectedBorder
                },
                "&:active": {
                  zIndex: 2,
                  backgroundColor: selected ? "var(--background-selected-strong)" : "var(--background-neutral-tertiary)",
                  borderColor: selected ? "var(--border-selected-strong)" : unselectedBorder
                },
                "&.Mui-focusVisible": {
                  zIndex: 3,
                  borderWidth: 2,
                  borderColor: selected ? "var(--border-focused-inverse)" : "var(--border-focused-primary)",
                  backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-brand-light)"
                },
                "&.Mui-disabled": {
                  opacity: 1,
                  /* Unselected disabled: transparent fill + disabled chrome.
                     Selected disabled: keep selected fill/border/text (Figma). */
                  ...selected ? {
                    backgroundColor: "var(--background-selected-primary)",
                    borderColor: "var(--border-selected-primary)",
                    color: "var(--text-selected-primary)"
                  } : {
                    backgroundColor: "transparent",
                    borderColor: "var(--border-disabled-neutral)",
                    color: "var(--text-disabled-neutral)"
                  }
                }
              },
              children: iconOnly ? startIcon || endIcon : /* @__PURE__ */ jsxs2(Fragment, { children: [
                startIcon,
                option.label,
                endIcon
              ] })
            },
            option.value
          );
        })
      }
    );
  }
);

// src/components/IconToggle.tsx
import IconButton from "@mui/material/IconButton";
import {
  forwardRef as forwardRef3,
  useState as useState2
} from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function colorRecipe2(color) {
  switch (color) {
    case "primary":
      return {
        on: "var(--text-neutral-primary)",
        hoverIcon: "var(--text-neutral-primary)",
        pressIcon: "var(--text-neutral-quaternary)",
        surface: "var(--background-neutral-tertiary)"
      };
    case "secondary":
      return {
        on: "var(--text-neutral-quaternary)",
        hoverIcon: "var(--text-neutral-quaternary)",
        pressIcon: "var(--text-neutral-secondary)",
        surface: "var(--background-neutral-tertiary)"
      };
    case "success":
      return {
        on: "var(--text-success-primary-fixed)",
        hoverIcon: "var(--text-success-primary-fixed)",
        pressIcon: "var(--text-success-secondary)",
        surface: "var(--background-success-light)"
      };
    case "error":
      return {
        on: "var(--text-error-primary-fixed)",
        hoverIcon: "var(--text-error-primary-fixed)",
        pressIcon: "var(--text-error-secondary)",
        surface: "var(--background-error-light)"
      };
    case "brand":
    default:
      return {
        on: "var(--text-brand-primary-fixed)",
        hoverIcon: "var(--text-brand-primary-fixed)",
        pressIcon: "var(--text-brand-secondary)",
        surface: "var(--background-brand-light)"
      };
  }
}
function labelType(size) {
  switch (size) {
    case "large":
      return {
        fontSize: "var(--text-body-lg)",
        lineHeight: "var(--leading-body-lg)"
      };
    case "small":
      return {
        fontSize: "var(--text-body-sm)",
        lineHeight: "var(--leading-body-sm)"
      };
    case "extraSmall":
      return {
        fontSize: "var(--text-body-xs)",
        lineHeight: "var(--leading-body-xs)"
      };
    case "medium":
    default:
      return {
        fontSize: "var(--text-body-md)",
        lineHeight: "var(--leading-body-md)"
      };
  }
}
var ToggleButton = forwardRef3(
  function ToggleButton2({
    size,
    color,
    iconName,
    pressed,
    defaultPressed,
    onPressedChange,
    disabled,
    sx,
    onClick,
    "aria-label": ariaLabel
  }, ref) {
    const controlled = pressed !== void 0;
    const [uncontrolled, setUncontrolled] = useState2(defaultPressed ?? false);
    const isOn = controlled ? Boolean(pressed) : uncontrolled;
    const dims = ICON_TOGGLE_SIZE[size];
    const recipe = colorRecipe2(color);
    const offIcon = "var(--text-neutral-quaternary)";
    const disabledIcon = "var(--text-disabled-neutral)";
    return /* @__PURE__ */ jsx4(
      IconButton,
      {
        ref,
        disableRipple: true,
        disabled,
        "aria-pressed": isOn,
        "aria-label": ariaLabel,
        onClick: (e) => {
          onClick?.(e);
          if (!e.defaultPrevented) {
            const next = !isOn;
            if (!controlled) setUncontrolled(next);
            onPressedChange?.(next);
          }
        },
        sx: {
          width: dims.size,
          height: dims.size,
          padding: dims.padding,
          borderRadius: "var(--radius-sm)",
          color: "inherit",
          backgroundColor: "transparent",
          transition: TRANSITION_COLORS,
          // Icon color driven by CSS var so hover/press recipes apply.
          ["--cads-icon-toggle-icon"]: isOn ? recipe.on : offIcon,
          "&:hover": {
            backgroundColor: recipe.surface,
            ["--cads-icon-toggle-icon"]: recipe.hoverIcon
          },
          "&:active": {
            backgroundColor: recipe.surface,
            ["--cads-icon-toggle-icon"]: recipe.pressIcon
          },
          "&.Mui-focusVisible": {
            backgroundColor: "transparent",
            boxShadow: FOCUS_RING
          },
          "&.Mui-disabled": {
            opacity: 1,
            ["--cads-icon-toggle-icon"]: disabledIcon
          },
          ...sx ?? {}
        },
        children: /* @__PURE__ */ jsx4(
          FaIcon,
          {
            name: iconName,
            family: isOn ? "solid" : "regular",
            fontSize: dims.iconPx,
            style: {
              width: dims.iconSlot,
              color: "var(--cads-icon-toggle-icon)",
              transition: TRANSITION_COLORS
            }
          }
        )
      }
    );
  }
);
var IconToggle = forwardRef3(
  function IconToggle2({
    size = "medium",
    color = "brand",
    label,
    secondToggle,
    exclusive = false,
    iconName,
    pressed,
    defaultPressed,
    onPressedChange,
    ...rest
  }, ref) {
    const firstControlled = pressed !== void 0;
    const secondControlled = secondToggle?.pressed !== void 0;
    const useExclusivePair = Boolean(exclusive && secondToggle) && !firstControlled && !secondControlled;
    const [pair, setPair] = useState2({
      first: defaultPressed ?? false,
      second: secondToggle?.defaultPressed ?? false
    });
    const handleFirstChange = (next) => {
      if (useExclusivePair) {
        setPair((prev) => ({
          first: next,
          second: next ? false : prev.second
        }));
      } else if (exclusive && secondToggle && next) {
        secondToggle.onPressedChange?.(false);
      }
      onPressedChange?.(next);
    };
    const handleSecondChange = (next) => {
      if (useExclusivePair) {
        setPair((prev) => ({
          first: next ? false : prev.first,
          second: next
        }));
      } else if (exclusive && next) {
        onPressedChange?.(false);
      }
      secondToggle?.onPressedChange?.(next);
    };
    const firstPressed = useExclusivePair ? pair.first : pressed;
    const secondPressed = useExclusivePair ? pair.second : secondToggle?.pressed;
    const toggle = /* @__PURE__ */ jsx4(
      ToggleButton,
      {
        ref,
        size,
        color,
        iconName,
        pressed: firstPressed,
        defaultPressed: useExclusivePair ? void 0 : defaultPressed,
        onPressedChange: handleFirstChange,
        ...rest
      }
    );
    if (label == null && !secondToggle) {
      return toggle;
    }
    const labelGap = size === "small" || size === "extraSmall" ? "0.5rem" : "0.625rem";
    return /* @__PURE__ */ jsxs3(
      "div",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: labelGap
        },
        children: [
          label != null && /* @__PURE__ */ jsx4(
            "span",
            {
              style: {
                fontFamily: "var(--font-body)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-neutral-primary)",
                whiteSpace: "nowrap",
                ...labelType(size)
              },
              children: label
            }
          ),
          /* @__PURE__ */ jsxs3(
            "div",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "0.125rem"
              },
              children: [
                toggle,
                secondToggle ? /* @__PURE__ */ jsx4(
                  ToggleButton,
                  {
                    size,
                    color: secondToggle.color ?? color,
                    iconName: secondToggle.iconName,
                    pressed: secondPressed,
                    defaultPressed: useExclusivePair ? void 0 : secondToggle.defaultPressed,
                    onPressedChange: handleSecondChange,
                    disabled: secondToggle.disabled,
                    "aria-label": secondToggle["aria-label"]
                  }
                ) : null
              ]
            }
          )
        ]
      }
    );
  }
);

// src/components/FieldWrapper.tsx
import {
  createContext,
  forwardRef as forwardRef4,
  useContext,
  useId as useId2,
  useMemo as useMemo2
} from "react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var FieldContext = createContext(null);
function useFieldContext() {
  return useContext(FieldContext);
}
var SENTIMENT_ICON = {
  success: "circle-check",
  warning: "circle-exclamation",
  error: "circle-xmark"
};
function helperColors(sentiment) {
  switch (sentiment) {
    case "success":
      return {
        text: "var(--text-success-primary-fixed)",
        icon: "var(--text-success-primary-fixed)"
      };
    case "error":
      return {
        text: "var(--text-error-primary-fixed)",
        icon: "var(--text-error-primary-fixed)"
      };
    case "warning":
      return {
        text: "var(--text-neutral-tertiary)",
        icon: "var(--text-warning-primary-fixed)"
      };
    default:
      return {
        text: "var(--text-neutral-tertiary)",
        icon: "var(--text-neutral-tertiary)"
      };
  }
}
var FieldWrapper = forwardRef4(
  function FieldWrapper2({
    size = "medium",
    sentiment = "default",
    label,
    helperText,
    helperIconName = "smile",
    showHelper = true,
    htmlFor,
    disabled = false,
    children,
    className,
    style
  }, ref) {
    const reactId = useId2();
    const controlId = htmlFor ?? `cads-field-${reactId}`;
    const labelId = `${controlId}-label`;
    const helperId = `${controlId}-helper`;
    const dims = FIELD_WRAPPER_SIZE[size];
    const colors = helperColors(sentiment);
    const shouldShowHelper = Boolean(helperText) && (sentiment !== "default" ? true : showHelper);
    const context = useMemo2(
      () => ({
        size,
        sentiment,
        disabled,
        labelId,
        helperId,
        controlId,
        describedBy: shouldShowHelper ? helperId : void 0,
        error: sentiment === "error"
      }),
      [
        size,
        sentiment,
        disabled,
        labelId,
        helperId,
        controlId,
        shouldShowHelper
      ]
    );
    const iconName = sentiment === "default" ? helperIconName : SENTIMENT_ICON[sentiment];
    return /* @__PURE__ */ jsx5(FieldContext.Provider, { value: context, children: /* @__PURE__ */ jsxs4(
      "div",
      {
        ref,
        className,
        "data-cads-field-wrapper": "",
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "2px",
          position: "relative",
          width: "100%",
          fontFamily: "var(--font-body)",
          ...style
        },
        children: [
          label != null && label !== "" ? /* @__PURE__ */ jsx5(
            "label",
            {
              id: labelId,
              htmlFor: controlId,
              style: {
                display: "block",
                fontFamily: "var(--font-body)",
                fontWeight: "var(--font-weight-semibold)",
                fontSize: dims.labelFontSize,
                lineHeight: dims.labelLineHeight,
                color: "var(--text-neutral-primary)",
                margin: 0
              },
              children: label
            }
          ) : null,
          /* @__PURE__ */ jsx5("div", { "data-cads-field-slot": "", style: { width: "100%", minWidth: 0 }, children }),
          shouldShowHelper ? /* @__PURE__ */ jsxs4(
            "div",
            {
              id: helperId,
              "data-cads-field-helper": "",
              style: {
                display: "flex",
                alignItems: "center",
                gap: dims.helperGap,
                width: "100%",
                color: colors.text
              },
              children: [
                /* @__PURE__ */ jsx5(
                  "span",
                  {
                    "aria-hidden": true,
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: dims.helperIconSlot,
                      height: dims.helperIconSlot,
                      flexShrink: 0,
                      color: colors.icon
                    },
                    children: /* @__PURE__ */ jsx5(FaIcon, { name: iconName, fontSize: dims.helperIconPx })
                  }
                ),
                /* @__PURE__ */ jsx5(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      fontSize: dims.helperFontSize,
                      lineHeight: dims.helperLineHeight,
                      color: colors.text
                    },
                    children: helperText
                  }
                )
              ]
            }
          ) : null
        ]
      }
    ) });
  }
);

// src/components/TextInput.tsx
import {
  forwardRef as forwardRef5,
  useId as useId3
} from "react";
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
function defaultBorder(color) {
  return color === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
var CONTROL_CLASS = "cads-text-input-control";
function TextInputControl({
  size,
  color,
  multiline,
  disabled,
  readOnly,
  error,
  value,
  defaultValue,
  onChange,
  placeholder,
  rows,
  id,
  className,
  style,
  ...rest
}) {
  const field = useFieldContext();
  const dims = TEXT_INPUT_SIZE[size];
  let background = "var(--background-neutral-primary)";
  let borderColor = defaultBorder(color);
  let textColor = "var(--text-neutral-primary)";
  if (disabled) {
    borderColor = "var(--border-disabled-neutral)";
    textColor = "var(--text-disabled-neutral)";
  } else if (readOnly) {
    background = "var(--background-neutral-secondary)";
    borderColor = "var(--border-neutral-secondary)";
    textColor = "var(--text-neutral-quaternary)";
  } else if (error) {
    borderColor = "var(--border-error-primary)";
  }
  const sharedStyle = {
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    height: multiline ? dims.areaHeight : dims.height,
    paddingInline: dims.paddingInline,
    paddingBlock: dims.paddingBlock,
    borderRadius: "var(--radius-sm)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor,
    backgroundColor: background,
    color: textColor,
    fontFamily: "var(--font-body)",
    fontWeight: 400,
    fontSize: dims.fontSize,
    lineHeight: dims.lineHeight,
    outline: "none",
    transition: TRANSITION_COLORS,
    resize: multiline ? "vertical" : void 0,
    ...style
  };
  const describedBy = field?.describedBy;
  const cls = [CONTROL_CLASS, className].filter(Boolean).join(" ");
  const commonProps = {
    id,
    disabled,
    readOnly,
    placeholder,
    value,
    defaultValue,
    onChange,
    className: cls,
    "aria-invalid": error || void 0,
    "aria-describedby": describedBy,
    "data-cads-text-input": multiline ? "area" : "field",
    "data-color": color,
    "data-readonly": readOnly ? "true" : void 0,
    "data-error": error ? "true" : void 0,
    style: sharedStyle
  };
  if (multiline) {
    return /* @__PURE__ */ jsx6(
      "textarea",
      {
        ...rest,
        ...commonProps,
        rows
      }
    );
  }
  return /* @__PURE__ */ jsx6("input", { ...rest, ...commonProps, type: rest.type ?? "text" });
}
var INTERACTIVE_STYLES = `
.${CONTROL_CLASS}::placeholder {
  color: var(--text-neutral-placeholder);
  opacity: 1;
}
.${CONTROL_CLASS}:hover:not(:disabled):not([data-readonly="true"]) {
  background-color: var(--background-neutral-secondary) !important;
}
.${CONTROL_CLASS}:focus-visible:not(:disabled) {
  box-shadow: ${FOCUS_RING};
  background-color: var(--background-neutral-primary) !important;
}
.${CONTROL_CLASS}:active:not(:disabled):not([data-readonly="true"]) {
  background-color: var(--background-neutral-primary) !important;
}
`;
var TextInput = forwardRef5(
  function TextInput2({
    size = "medium",
    color = "primary",
    multiline = false,
    label,
    helperText,
    helperIconName,
    showHelper = true,
    sentiment: sentimentProp = "default",
    error = false,
    value,
    defaultValue,
    onChange,
    placeholder = "Placeholder",
    rows = 3,
    readOnly = false,
    disabled = false,
    className,
    style,
    id: idProp,
    ...rest
  }, ref) {
    const reactId = useId3();
    const controlId = idProp ?? `cads-text-input-${reactId}`;
    const sentiment = error ? "error" : sentimentProp;
    const isError = error || sentiment === "error";
    return /* @__PURE__ */ jsxs5(Fragment2, { children: [
      /* @__PURE__ */ jsx6("style", { children: INTERACTIVE_STYLES }),
      /* @__PURE__ */ jsx6(
        FieldWrapper,
        {
          ref,
          size,
          sentiment,
          label,
          helperText,
          helperIconName,
          showHelper,
          htmlFor: controlId,
          disabled,
          className,
          style,
          children: /* @__PURE__ */ jsx6(
            TextInputControl,
            {
              ...rest,
              id: controlId,
              size,
              color,
              multiline,
              disabled,
              readOnly,
              error: isError,
              value,
              defaultValue,
              onChange,
              placeholder,
              rows
            }
          )
        }
      )
    ] });
  }
);

// src/components/TextField.tsx
import { forwardRef as forwardRef6 } from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
var TextField = forwardRef6(
  function TextField2(props, ref) {
    return /* @__PURE__ */ jsx7(TextInput, { ref, ...props });
  }
);

// src/components/Dropdown.tsx
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import {
  forwardRef as forwardRef7,
  useCallback,
  useEffect,
  useId as useId4,
  useMemo as useMemo3,
  useRef,
  useState as useState3
} from "react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function resolveInputWidth(width = "hug") {
  if (width === "hug") {
    return {
      rootWidth: "max-content",
      triggerWidth: "auto",
      maxWidth: "100%"
    };
  }
  if (width === "full") {
    return { rootWidth: "100%", triggerWidth: "100%" };
  }
  const resolved = typeof width === "number" ? `${width}px` : width;
  return {
    rootWidth: resolved,
    triggerWidth: "100%",
    maxWidth: "100%"
  };
}
function placementToPopper(placement) {
  switch (placement) {
    case "bottomRight":
      return "bottom-end";
    case "topLeft":
      return "top-start";
    case "topRight":
      return "top-end";
    case "bottomLeft":
    default:
      return "bottom-start";
  }
}
function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}
var MENU_ITEM_SIZE = {
  large: {
    paddingLeft: "1rem",
    // 16
    paddingRight: "1.375rem",
    // 22
    paddingBlock: "0.625rem",
    // 10
    gap: "0.75rem",
    // 12
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconSlot: "1.75rem",
    // 28
    iconPx: "1.375rem",
    // 22
    checkbox: 22
  },
  medium: {
    paddingLeft: "0.75rem",
    // 12
    paddingRight: "1rem",
    // 16
    paddingBlock: "0.5rem",
    // 8
    gap: "0.75rem",
    // 12
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconSlot: "1.5rem",
    // 24
    iconPx: "1.1875rem",
    // 19
    checkbox: 20
  },
  small: {
    paddingLeft: "0.625rem",
    // 10
    paddingRight: "0.875rem",
    // 14
    paddingBlock: "0.3125rem",
    // 5
    gap: "0.5rem",
    // 8
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconSlot: "1.25rem",
    // 20
    iconPx: "1rem",
    // 16
    checkbox: 18
  },
  extraSmall: {
    paddingLeft: "0.5rem",
    // 8
    paddingRight: "0.625rem",
    // 10
    paddingBlock: "0.125rem",
    // 2
    gap: "0.25rem",
    // 4
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconSlot: "1rem",
    // 16
    iconPx: "0.8125rem",
    // 13
    checkbox: 16
  }
};
function triggerBorder(color, error, disabled, readOnly) {
  if (disabled) return "var(--border-disabled-neutral)";
  if (error) return "var(--border-error-primary)";
  if (readOnly) return "var(--border-neutral-secondary)";
  return color === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function TriggerLabel({
  label,
  hugCandidates
}) {
  const visible = /* @__PURE__ */ jsx8(
    "span",
    {
      style: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minWidth: 0
      },
      children: label
    }
  );
  if (!hugCandidates?.length) return visible;
  return /* @__PURE__ */ jsxs6(
    "span",
    {
      style: {
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "stretch",
        minWidth: 0
      },
      children: [
        hugCandidates.map((candidate, index) => /* @__PURE__ */ jsx8(
          "span",
          {
            "aria-hidden": true,
            style: {
              gridArea: "1 / 1",
              visibility: "hidden",
              whiteSpace: "nowrap",
              pointerEvents: "none"
            },
            children: candidate
          },
          index
        )),
        /* @__PURE__ */ jsx8(
          "span",
          {
            style: {
              gridArea: "1 / 1",
              minWidth: 0,
              maxWidth: "100%",
              display: "block"
            },
            children: visible
          }
        )
      ]
    }
  );
}
function DropdownButtonTrigger({
  size,
  color,
  labelStyle,
  label,
  hugCandidates,
  startIconName,
  open,
  disabled,
  readOnly,
  error,
  onClick,
  buttonRef,
  id,
  listedBy,
  ariaLabel,
  triggerWidth
}) {
  const dims = TEXT_INPUT_SIZE[size];
  const iconDims = BUTTON_SIZE[size];
  const border = triggerBorder(color, error, disabled, readOnly);
  const hug = Boolean(hugCandidates?.length);
  return /* @__PURE__ */ jsxs6(
    "button",
    {
      ref: buttonRef,
      type: "button",
      id,
      disabled: disabled || readOnly,
      "aria-haspopup": listedBy ? "listbox" : "menu",
      "aria-expanded": open,
      "aria-controls": listedBy,
      "aria-label": ariaLabel,
      onClick,
      "data-cads-dropdown-trigger": "input",
      className: "cads-dropdown-trigger",
      style: {
        boxSizing: "border-box",
        width: triggerWidth,
        minWidth: hug ? "max-content" : void 0,
        height: dims.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: iconDims.gap,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${border}`,
        backgroundColor: readOnly ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
        color: disabled ? "var(--text-disabled-neutral)" : readOnly ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
        fontFamily: "var(--font-body)",
        fontWeight: labelStyle === "thin" ? 400 : 600,
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        cursor: disabled || readOnly ? "default" : "pointer",
        transition: TRANSITION_COLORS,
        textAlign: "left"
      },
      children: [
        /* @__PURE__ */ jsxs6(
          "span",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: iconDims.gap,
              minWidth: 0,
              paddingRight: 8,
              overflow: hug ? "visible" : "hidden",
              flex: hug ? "0 1 auto" : "1 1 auto"
            },
            children: [
              startIconName ? /* @__PURE__ */ jsx8(FaIcon, { name: startIconName, fontSize: iconDims.iconPx }) : null,
              /* @__PURE__ */ jsx8(TriggerLabel, { label, hugCandidates })
            ]
          }
        ),
        /* @__PURE__ */ jsx8(FaIcon, { name: "chevron-down", fontSize: iconDims.iconPx })
      ]
    }
  );
}
function MenuItemRow({
  option,
  size,
  selected,
  menuType,
  role,
  active,
  onSelect,
  onHighlight,
  id
}) {
  const dims = MENU_ITEM_SIZE[size];
  const destructive = Boolean(option.destructive) && role === "action";
  const textColor = destructive ? "var(--text-error-primary)" : selected ? "var(--text-selected-primary)" : "var(--text-neutral-primary)";
  let bg = "var(--background-neutral-primary)";
  if (selected) {
    bg = active ? "var(--background-selected-strong)" : "var(--background-selected-primary)";
  } else if (active && destructive) {
    bg = "var(--background-error-light)";
  } else if (active) {
    bg = "var(--background-neutral-secondary)";
  }
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      id,
      role: role === "input" ? "option" : "menuitem",
      "aria-selected": role === "input" ? selected : void 0,
      "aria-disabled": option.disabled || void 0,
      "data-cads-dropdown-item": "",
      "data-destructive": destructive ? "true" : void 0,
      "data-active": active ? "true" : void 0,
      tabIndex: -1,
      onMouseDown: (e) => {
        e.preventDefault();
      },
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!option.disabled) onSelect();
      },
      onMouseEnter: () => {
        if (!option.disabled) onHighlight();
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: dims.gap,
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: dims.paddingLeft,
        paddingRight: dims.paddingRight,
        paddingBlock: dims.paddingBlock,
        backgroundColor: bg,
        color: textColor,
        cursor: option.disabled ? "default" : "pointer",
        opacity: option.disabled ? 0.5 : 1,
        fontFamily: "var(--font-body)",
        fontWeight: 400,
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        transition: TRANSITION_COLORS,
        minWidth: 0
      },
      children: [
        menuType === "checklist" ? /* @__PURE__ */ jsx8(
          "span",
          {
            "aria-hidden": true,
            style: {
              boxSizing: "border-box",
              width: dims.checkbox,
              height: dims.checkbox,
              borderRadius: "var(--radius-sm)",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selected ? "var(--background-selected-primary-inverse)" : "var(--background-neutral-primary)",
              border: selected ? "none" : "2px solid var(--border-neutral-solid)",
              color: "var(--text-selected-primary-inverse)"
            },
            children: selected ? /* @__PURE__ */ jsx8(
              FaIcon,
              {
                name: "check",
                fontSize: size === "large" ? "0.875rem" : size === "extraSmall" ? "0.625rem" : "0.75rem"
              }
            ) : null
          }
        ) : option.iconName || destructive ? /* @__PURE__ */ jsx8(
          "span",
          {
            "aria-hidden": true,
            style: {
              width: dims.iconSlot,
              display: "inline-flex",
              justifyContent: "center",
              flexShrink: 0,
              color: textColor
            },
            children: /* @__PURE__ */ jsx8(
              FaIcon,
              {
                name: option.iconName ?? "smile",
                fontSize: dims.iconPx
              }
            )
          }
        ) : null,
        /* @__PURE__ */ jsx8(
          "span",
          {
            style: {
              minWidth: 0,
              flex: "1 1 auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            },
            children: option.label
          }
        )
      ]
    }
  );
}
var Dropdown = forwardRef7(
  function Dropdown2(props, ref) {
    const {
      size = "medium",
      menuType = "icon",
      menuPlacement = "bottomLeft",
      options,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className,
      style,
      "aria-label": ariaLabel
    } = props;
    const isInput = props.role === "input";
    const reactId = useId4();
    const listId = `cads-dropdown-list-${reactId}`;
    const triggerId = `cads-dropdown-trigger-${reactId}`;
    const [anchorEl, setAnchorEl] = useState3(null);
    const anchorRef = useRef(null);
    const setAnchor = useCallback((node) => {
      anchorRef.current = node;
      setAnchorEl(node);
    }, []);
    const [uncontrolledOpen, setUncontrolledOpen] = useState3(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    const [activeIndex, setActiveIndex] = useState3(-1);
    const setOpen = useCallback(
      (next) => {
        if (openProp === void 0) setUncontrolledOpen(next);
        onOpenChange?.(next);
        if (!next) setActiveIndex(-1);
      },
      [openProp, onOpenChange]
    );
    const inputProps = isInput ? props : null;
    const isChecklist = isInput && (menuType === "checklist" || inputProps?.menuType === "checklist");
    const [uncontrolledValue, setUncontrolledValue] = useState3(
      () => asArray(inputProps?.defaultValue)
    );
    const selectedValues = inputProps?.value !== void 0 ? asArray(inputProps.value) : uncontrolledValue;
    const selectedSet = useMemo3(
      () => new Set(selectedValues),
      [selectedValues]
    );
    const displayLabel = useMemo3(() => {
      if (!isInput) return props.label ?? "Button";
      const placeholder = inputProps?.placeholder ?? "Dropdown";
      if (selectedValues.length === 0) return placeholder;
      const labels = options.filter((o) => selectedSet.has(o.value)).map((o) => o.label);
      if (labels.length === 0) return placeholder;
      return labels.length === 1 ? labels[0] : `${labels.length} selected`;
    }, [
      isInput,
      props,
      inputProps?.placeholder,
      selectedValues,
      options,
      selectedSet
    ]);
    const hugCandidates = useMemo3(() => {
      if (!isInput) return void 0;
      const placeholder = inputProps?.placeholder ?? "Dropdown";
      const candidates = [placeholder, ...options.map((o) => o.label)];
      if (isChecklist) {
        candidates.push(`${options.length} selected`);
      }
      return candidates;
    }, [isInput, inputProps?.placeholder, options, isChecklist]);
    const commitSelection = (next) => {
      if (!inputProps) return;
      if (inputProps.value === void 0) setUncontrolledValue(next);
      inputProps.onChange?.(isChecklist ? next : next[0] ?? "");
    };
    const handleItemSelect = (option) => {
      if (option.disabled) return;
      if (isInput) {
        if (isChecklist) {
          const next = selectedSet.has(option.value) ? selectedValues.filter((v) => v !== option.value) : [...selectedValues, option.value];
          commitSelection(next);
        } else {
          commitSelection([option.value]);
          setOpen(false);
        }
      } else {
        props.onAction?.(option.value);
        setOpen(false);
      }
    };
    const handleSelectAll = () => {
      commitSelection(options.filter((o) => !o.disabled).map((o) => o.value));
    };
    const handleClearAll = () => {
      commitSelection([]);
    };
    const toggleOpen = () => {
      if (disabled) return;
      if (isInput && inputProps?.readOnly) return;
      setOpen(!open);
    };
    useEffect(() => {
      if (!open) setActiveIndex(-1);
    }, [open]);
    const moveActive = (direction) => {
      setActiveIndex((current) => {
        const start = current < 0 ? direction === 1 ? -1 : 0 : current;
        let next = start;
        for (let step = 0; step < options.length; step++) {
          next = direction === 1 ? (next + 1) % options.length : (next - 1 + options.length) % options.length;
          if (!options[next]?.disabled) return next;
        }
        return current;
      });
    };
    const onKeyDown = (event) => {
      if (!open) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(true);
          if (event.key === "ArrowUp") {
            for (let i = options.length - 1; i >= 0; i--) {
              if (!options[i]?.disabled) {
                setActiveIndex(i);
                break;
              }
            }
          } else {
            const idx = options.findIndex((o) => !o.disabled);
            setActiveIndex(idx < 0 ? -1 : idx);
          }
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        anchorRef.current?.focus();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        const idx = options.findIndex((o) => !o.disabled);
        if (idx >= 0) setActiveIndex(idx);
      }
      if (event.key === "End") {
        event.preventDefault();
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i]?.disabled) {
            setActiveIndex(i);
            break;
          }
        }
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const opt = activeIndex >= 0 ? options[activeIndex] : void 0;
        if (opt) handleItemSelect(opt);
      }
    };
    const resolvedMenuType = isInput && (inputProps?.menuType ?? menuType) === "checklist" ? "checklist" : "icon";
    const menu = /* @__PURE__ */ jsx8(
      Popper,
      {
        open: open && Boolean(anchorEl),
        anchorEl,
        placement: placementToPopper(menuPlacement),
        disablePortal: true,
        style: { zIndex: 1400 },
        modifiers: [
          { name: "offset", options: { offset: [0, 4] } }
        ],
        children: /* @__PURE__ */ jsxs6(
          Paper,
          {
            id: listId,
            role: isInput ? "listbox" : "menu",
            "aria-labelledby": triggerId,
            "aria-multiselectable": isChecklist || void 0,
            "data-cads-dropdown-menu": "",
            "data-menu-type": resolvedMenuType,
            elevation: 0,
            onKeyDown,
            sx: {
              mt: 0,
              border: "1px solid var(--border-neutral-primary)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--background-neutral-primary)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              // Checklist: size to the action row so "Select all" / "Clear all"
              // stay fully visible at every control size (Figma Menu List).
              minWidth: isChecklist ? "max-content" : isInput ? 180 : 120,
              py: isChecklist ? 0 : "4px"
            },
            children: [
              /* @__PURE__ */ jsx8(
                "div",
                {
                  style: { display: "flex", flexDirection: "column", minWidth: 0 },
                  onMouseLeave: () => setActiveIndex(-1),
                  children: options.map((option, index) => /* @__PURE__ */ jsx8(
                    MenuItemRow,
                    {
                      id: `${listId}-opt-${index}`,
                      option,
                      size,
                      selected: selectedSet.has(option.value),
                      menuType: resolvedMenuType,
                      role: props.role,
                      active: index === activeIndex,
                      onSelect: () => handleItemSelect(option),
                      onHighlight: () => setActiveIndex(index)
                    },
                    option.value
                  ))
                }
              ),
              isChecklist ? /* @__PURE__ */ jsxs6(
                "div",
                {
                  "data-cads-dropdown-action-row": "",
                  style: {
                    display: "flex",
                    // Figma Action Row: gap 4 + padding 4; large uses space-between.
                    justifyContent: size === "large" ? "space-between" : "flex-start",
                    alignItems: "flex-start",
                    borderTop: "1px solid var(--border-neutral-primary)",
                    padding: 4,
                    gap: 4,
                    boxSizing: "border-box"
                  },
                  children: [
                    /* @__PURE__ */ jsx8(
                      Button,
                      {
                        variant: "text",
                        color: "secondary",
                        size,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation();
                          handleSelectAll();
                        },
                        sx: {
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                          minWidth: "max-content"
                        },
                        children: "Select all"
                      }
                    ),
                    /* @__PURE__ */ jsx8(
                      Button,
                      {
                        variant: "text",
                        color: "secondary",
                        size,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation();
                          handleClearAll();
                        },
                        sx: {
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                          minWidth: "max-content"
                        },
                        children: "Clear all"
                      }
                    )
                  ]
                }
              ) : null
            ]
          }
        )
      }
    );
    const triggerStyles = `
.cads-dropdown-trigger:hover:not(:disabled) {
  background-color: var(--background-neutral-secondary) !important;
}
.cads-dropdown-trigger:focus-visible {
  box-shadow: ${FOCUS_RING};
}
[data-cads-dropdown-item]:not([aria-disabled="true"]):not([aria-selected="true"]):not([data-destructive="true"]):hover,
[data-cads-dropdown-item]:not([aria-disabled="true"]):not([aria-selected="true"]):not([data-destructive="true"])[data-active="true"] {
  background-color: var(--background-neutral-secondary) !important;
}
[data-cads-dropdown-item][data-destructive="true"]:not([aria-disabled="true"]):hover,
[data-cads-dropdown-item][data-destructive="true"]:not([aria-disabled="true"])[data-active="true"] {
  background-color: var(--background-error-light) !important;
}
[data-cads-dropdown-item][aria-selected="true"]:hover,
[data-cads-dropdown-item][aria-selected="true"][data-active="true"] {
  background-color: var(--background-selected-strong) !important;
}
`;
    if (isInput) {
      const ip = props;
      const sentiment = ip.error ? "error" : ip.sentiment ?? "default";
      const widthMode = ip.width ?? "hug";
      const fieldWidth = resolveInputWidth(widthMode);
      const isHug = widthMode === "hug";
      return /* @__PURE__ */ jsx8(
        ClickAwayListener,
        {
          onClickAway: () => {
            if (open) setOpen(false);
          },
          children: /* @__PURE__ */ jsxs6(
            "div",
            {
              ref,
              className,
              style: {
                position: "relative",
                width: fieldWidth.rootWidth,
                maxWidth: fieldWidth.maxWidth,
                ...style
              },
              "data-cads-dropdown": "input",
              "data-width": isHug ? "hug" : widthMode === "full" ? "full" : "fixed",
              onKeyDown,
              children: [
                /* @__PURE__ */ jsx8("style", { children: triggerStyles }),
                /* @__PURE__ */ jsx8(
                  FieldWrapper,
                  {
                    size,
                    sentiment,
                    label: ip.label,
                    helperText: ip.helperText,
                    helperIconName: ip.helperIconName,
                    showHelper: ip.showHelper,
                    htmlFor: triggerId,
                    disabled,
                    children: /* @__PURE__ */ jsx8(
                      DropdownButtonTrigger,
                      {
                        size,
                        color: ip.color ?? "primary",
                        labelStyle: ip.labelStyle ?? "thick",
                        label: displayLabel,
                        hugCandidates: isHug ? hugCandidates : void 0,
                        startIconName: ip.startIconName,
                        open,
                        disabled,
                        readOnly: Boolean(ip.readOnly),
                        error: Boolean(ip.error) || sentiment === "error",
                        onClick: toggleOpen,
                        buttonRef: setAnchor,
                        id: triggerId,
                        listedBy: open ? listId : void 0,
                        triggerWidth: fieldWidth.triggerWidth,
                        ariaLabel: typeof ariaLabel === "string" ? ariaLabel : typeof ip.label === "string" ? void 0 : "Dropdown"
                      }
                    )
                  }
                ),
                menu
              ]
            }
          )
        }
      );
    }
    const ap = props;
    return /* @__PURE__ */ jsx8(
      ClickAwayListener,
      {
        onClickAway: () => {
          if (open) setOpen(false);
        },
        children: /* @__PURE__ */ jsxs6(
          "div",
          {
            ref,
            className,
            style: { position: "relative", display: "inline-flex", ...style },
            "data-cads-dropdown": "action",
            onKeyDown,
            children: [
              /* @__PURE__ */ jsx8("style", { children: triggerStyles }),
              /* @__PURE__ */ jsx8(
                Button,
                {
                  ref: setAnchor,
                  id: triggerId,
                  size,
                  variant: ap.buttonVariant ?? "contained",
                  color: ap.buttonColor ?? "primary",
                  startIconName: ap.startIconName,
                  endIconName: "chevron-down",
                  disabled,
                  "aria-haspopup": "menu",
                  "aria-expanded": open,
                  "aria-controls": open ? listId : void 0,
                  "aria-label": ariaLabel,
                  onClick: toggleOpen,
                  children: ap.label ?? "Button"
                }
              ),
              menu
            ]
          }
        )
      }
    );
  }
);

// src/components/Checkbox.tsx
import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef as forwardRef8 } from "react";
import { jsx as jsx9 } from "react/jsx-runtime";
var Checkbox = forwardRef8(
  function Checkbox2({ label, size = "medium", sx, ...rest }, ref) {
    const control = /* @__PURE__ */ jsx9(
      MuiCheckbox,
      {
        ref,
        size: size === "small" ? "small" : "medium",
        sx: {
          color: "var(--border-neutral-primary)",
          padding: size === "small" ? "0.25rem" : "0.5rem",
          "&.Mui-checked": {
            color: "var(--background-selected-primary)"
          },
          "&.Mui-focusVisible": {
            outline: "2px solid var(--border-focused-primary)",
            outlineOffset: "2px"
          },
          "&.Mui-disabled": {
            color: "var(--background-disabled-neutral)"
          },
          ...sx ?? {}
        },
        ...rest
      }
    );
    if (label == null) return control;
    return /* @__PURE__ */ jsx9(
      FormControlLabel,
      {
        control,
        label,
        sx: {
          margin: 0,
          gap: "0.5rem",
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-sm)",
            color: "var(--text-neutral-primary)"
          }
        }
      }
    );
  }
);

// src/components/Radio.tsx
import MuiRadio from "@mui/material/Radio";
import FormControlLabel2 from "@mui/material/FormControlLabel";
import { forwardRef as forwardRef9 } from "react";
import { jsx as jsx10 } from "react/jsx-runtime";
var Radio = forwardRef9(
  function Radio2({ label, size = "medium", sx, ...rest }, ref) {
    const control = /* @__PURE__ */ jsx10(
      MuiRadio,
      {
        ref,
        size: size === "small" ? "small" : "medium",
        sx: {
          color: "var(--border-neutral-primary)",
          padding: size === "small" ? "0.25rem" : "0.5rem",
          "&.Mui-checked": {
            color: "var(--background-selected-primary)"
          },
          "&.Mui-focusVisible": {
            outline: "2px solid var(--border-focused-primary)",
            outlineOffset: "2px"
          },
          "&.Mui-disabled": {
            color: "var(--background-disabled-neutral)"
          },
          ...sx ?? {}
        },
        ...rest
      }
    );
    if (label == null) return control;
    return /* @__PURE__ */ jsx10(
      FormControlLabel2,
      {
        control,
        label,
        sx: {
          margin: 0,
          gap: "0.5rem",
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-sm)",
            color: "var(--text-neutral-primary)"
          }
        }
      }
    );
  }
);

// src/components/Tag.tsx
import Chip from "@mui/material/Chip";
import { forwardRef as forwardRef10 } from "react";
import { jsx as jsx11 } from "react/jsx-runtime";
var TONE_STYLES = {
  neutral: {
    bg: "var(--background-neutral-secondary)",
    color: "var(--text-neutral-primary)",
    border: "var(--border-neutral-primary)"
  },
  brand: {
    bg: "var(--background-brand-light)",
    color: "var(--text-brand-primary)",
    border: "var(--border-brand-primary)"
  },
  success: {
    bg: "var(--background-success-light)",
    color: "var(--text-success-primary)",
    border: "var(--border-success-primary)"
  },
  warning: {
    bg: "var(--background-warning-light)",
    color: "var(--text-warning-primary)",
    border: "var(--border-warning-primary)"
  },
  error: {
    bg: "var(--background-error-light)",
    color: "var(--text-error-primary)",
    border: "var(--border-error-primary)"
  },
  info: {
    bg: "var(--background-info-light)",
    color: "var(--text-info-primary)",
    border: "var(--border-info-primary)"
  }
};
var Tag = forwardRef10(function Tag2({ tone = "neutral", size = "medium", iconName, label, sx, ...rest }, ref) {
  const t = TONE_STYLES[tone];
  return /* @__PURE__ */ jsx11(
    Chip,
    {
      ref,
      label,
      size: size === "small" ? "small" : "medium",
      icon: iconName ? /* @__PURE__ */ jsx11(FaIcon, { name: iconName, size: "extraSmall" }) : void 0,
      sx: {
        height: size === "small" ? "1.25rem" : "1.5rem",
        borderRadius: "var(--radius-round)",
        backgroundColor: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-body-xs)",
        fontWeight: "var(--font-weight-medium)",
        "& .MuiChip-icon": { color: "inherit", marginLeft: "0.375rem" },
        ...sx ?? {}
      },
      ...rest
    }
  );
});

// src/components/Tooltip.tsx
import MuiTooltip from "@mui/material/Tooltip";
import { jsx as jsx12 } from "react/jsx-runtime";
function Tooltip({ children, title, ...rest }) {
  return /* @__PURE__ */ jsx12(
    MuiTooltip,
    {
      title,
      arrow: true,
      slotProps: {
        tooltip: {
          sx: {
            backgroundColor: "var(--background-neutral-primary-inverse)",
            color: "var(--text-neutral-primary-inverse)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-xs)",
            padding: "0.375rem 0.625rem",
            boxShadow: "var(--shadow-md)"
          }
        },
        arrow: {
          sx: {
            color: "var(--background-neutral-primary-inverse)"
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
  Dropdown,
  FieldWrapper,
  IconToggle,
  Radio,
  SegmentedButton,
  Tag,
  TextField,
  TextInput,
  Tooltip,
  cadsManifest,
  useFieldContext
};
//# sourceMappingURL=index.js.map