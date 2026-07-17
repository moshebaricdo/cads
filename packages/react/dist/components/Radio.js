import { jsx } from 'react/jsx-runtime';
import MuiRadio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { forwardRef } from 'react';
import { RADIO_SIZE, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

function RadioUncheckedIcon({ box }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": true,
      "data-cads-radio-circle": "",
      style: {
        boxSizing: "border-box",
        display: "block",
        width: box,
        height: box,
        borderRadius: "var(--radius-round)",
        border: "2px solid var(--cads-radio-border)",
        backgroundColor: "var(--cads-radio-bg)",
        transition: TRANSITION_COLORS
      }
    }
  );
}
function RadioCheckedIcon({ box, dot }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": true,
      "data-cads-radio-circle": "",
      style: {
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: box,
        height: box,
        borderRadius: "var(--radius-round)",
        border: "2px solid var(--cads-radio-border)",
        backgroundColor: "var(--cads-radio-bg)",
        transition: TRANSITION_COLORS
      },
      children: /* @__PURE__ */ jsx(
        "span",
        {
          "data-cads-radio-dot": "",
          style: {
            display: "block",
            width: dot,
            height: dot,
            borderRadius: "var(--radius-round)",
            backgroundColor: "var(--cads-radio-dot)",
            transition: TRANSITION_COLORS
          }
        }
      )
    }
  );
}
const Radio = forwardRef(
  function Radio2({
    label,
    size = "medium",
    labelStyle = "thin",
    disabled,
    sx,
    ...rest
  }, ref) {
    const dims = RADIO_SIZE[size];
    const control = /* @__PURE__ */ jsx(
      MuiRadio,
      {
        ref,
        disableRipple: true,
        disabled,
        icon: /* @__PURE__ */ jsx(RadioUncheckedIcon, { box: dims.box }),
        checkedIcon: /* @__PURE__ */ jsx(RadioCheckedIcon, { box: dims.box, dot: dims.dot }),
        sx: {
          padding: 0,
          margin: 0,
          color: "inherit",
          // Default / unselected
          ["--cads-radio-bg"]: "var(--background-neutral-primary)",
          ["--cads-radio-border"]: "var(--border-neutral-solid)",
          ["--cads-radio-dot"]: "var(--background-selected-primary)",
          transition: TRANSITION_COLORS,
          "&:hover:not(.Mui-disabled)": {
            backgroundColor: "transparent",
            ["--cads-radio-bg"]: "var(--background-brand-light)",
            ["--cads-radio-border"]: "var(--border-neutral-solid)"
          },
          "&:active:not(.Mui-disabled)": {
            ["--cads-radio-bg"]: "var(--background-brand-light)",
            ["--cads-radio-border"]: "var(--border-selected-primary)"
          },
          "&.Mui-focusVisible:not(.Mui-disabled)": {
            backgroundColor: "transparent",
            ["--cads-radio-bg"]: "var(--background-neutral-primary)",
            ["--cads-radio-border"]: "var(--border-neutral-solid)",
            "& [data-cads-radio-circle]": {
              boxShadow: FOCUS_RING
            }
          },
          // Selected — white fill + selected ring + inner dot (not brand fill)
          "&.Mui-checked": {
            ["--cads-radio-bg"]: "var(--background-neutral-primary)",
            ["--cads-radio-border"]: "var(--border-selected-primary)",
            ["--cads-radio-dot"]: "var(--background-selected-primary)",
            "&:hover:not(.Mui-disabled)": {
              // Figma hover+selected: white fill, selected-strong border/dot
              ["--cads-radio-bg"]: "var(--background-neutral-primary)",
              ["--cads-radio-border"]: "var(--border-selected-strong)",
              ["--cads-radio-dot"]: "var(--background-selected-strong)"
            },
            "&:active:not(.Mui-disabled)": {
              ["--cads-radio-bg"]: "var(--background-brand-light)",
              ["--cads-radio-border"]: "var(--border-selected-primary)",
              ["--cads-radio-dot"]: "var(--background-selected-primary)"
            },
            "&.Mui-focusVisible:not(.Mui-disabled)": {
              backgroundColor: "transparent",
              ["--cads-radio-bg"]: "var(--background-neutral-primary)",
              ["--cads-radio-border"]: "var(--border-selected-primary)",
              ["--cads-radio-dot"]: "var(--background-selected-primary)",
              "& [data-cads-radio-circle]": {
                boxShadow: FOCUS_RING
              }
            }
          },
          "&.Mui-disabled": {
            opacity: 1,
            ["--cads-radio-bg"]: "var(--background-neutral-primary)",
            ["--cads-radio-border"]: "var(--border-disabled-neutral)",
            ["--cads-radio-dot"]: "var(--background-disabled-neutral)"
          },
          ...sx ?? {}
        },
        ...rest
      }
    );
    if (label == null) return control;
    return /* @__PURE__ */ jsx(
      FormControlLabel,
      {
        disabled,
        control,
        label,
        sx: {
          alignItems: "flex-start",
          margin: 0,
          gap: dims.gap,
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: dims.fontSize,
            lineHeight: dims.lineHeight,
            fontWeight: labelStyle === "thick" ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
            color: "var(--text-neutral-primary)",
            "&.Mui-disabled": {
              color: "var(--text-disabled-neutral)"
            }
          },
          // Figma Radio Button wrapper: 2px top padding for type alignment
          "& .MuiRadio-root": {
            paddingTop: dims.controlPaddingTop
          }
        }
      }
    );
  }
);

export { Radio };
//# sourceMappingURL=Radio.js.map
//# sourceMappingURL=Radio.js.map