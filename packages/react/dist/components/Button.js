import { jsx, jsxs } from 'react/jsx-runtime';
import MuiButton from '@mui/material/Button';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { BUTTON_SIZE, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

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
function contentForeground(variant, color) {
  const c = colorRecipe(color);
  if (variant === "contained") return c.filledFg;
  if (variant === "outlined") return c.outlinedFg;
  return c.textFg;
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
const Button = forwardRef(
  function Button2({
    variant = "contained",
    color = "primary",
    size = "medium",
    iconOnly: iconOnlyProp,
    startIconName,
    endIconName,
    loading = false,
    children,
    sx,
    disabled,
    onClick,
    ...rest
  }, ref) {
    const dims = BUTTON_SIZE[size];
    const iconOnly = iconOnlyProp ?? (!children && Boolean(startIconName || endIconName));
    const resolvedColor = resolveColor(color, variant, iconOnly);
    const spinnerColor = contentForeground(variant, resolvedColor);
    const showLoading = Boolean(loading) && !disabled;
    const startIcon = startIconName ? /* @__PURE__ */ jsx(FaIcon, { name: startIconName, fontSize: dims.iconPx }) : null;
    const endIcon = endIconName ? /* @__PURE__ */ jsx(FaIcon, { name: endIconName, fontSize: dims.iconPx }) : null;
    return /* @__PURE__ */ jsxs(
      MuiButton,
      {
        ref,
        disableElevation: true,
        disabled,
        "aria-busy": showLoading || void 0,
        onClick: showLoading ? void 0 : onClick,
        startIcon: !iconOnly && startIcon ? startIcon : void 0,
        endIcon: !iconOnly && endIcon ? endIcon : void 0,
        sx: {
          "@keyframes cads-button-spin": {
            "100%": { transform: "rotate(360deg)" }
          },
          position: "relative",
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
          // Keep label/icons in layout for width; hide them and overlay spinner.
          ...showLoading ? {
            color: "transparent",
            pointerEvents: "none",
            "&:hover, &:active": {
              color: "transparent"
            },
            // Hide adornment/icon-only glyphs; spinner uses its own color.
            "& .MuiButton-startIcon, & .MuiButton-endIcon, & > [data-fa-icon]": {
              color: "transparent"
            }
          } : null,
          ...sx ?? {}
        },
        ...rest,
        children: [
          iconOnly ? startIcon || endIcon : children,
          showLoading ? /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": true,
              "data-cads-button-spinner": "",
              style: {
                position: "absolute",
                inset: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: spinnerColor
              },
              children: /* @__PURE__ */ jsx(
                FaIcon,
                {
                  name: "spinner",
                  fontSize: dims.iconPx,
                  style: {
                    animation: "cads-button-spin 0.75s linear infinite"
                  }
                }
              )
            }
          ) : null
        ]
      }
    );
  }
);

export { Button };
//# sourceMappingURL=Button.js.map
//# sourceMappingURL=Button.js.map