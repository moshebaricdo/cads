import { jsx } from 'react/jsx-runtime';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { CHECKBOX_SIZE, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

function CheckboxGlyph({
  size,
  status
}) {
  const dims = CHECKBOX_SIZE[size];
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "cads-checkbox-box",
      "data-cads-checkbox-status": status,
      style: {
        width: dims.box,
        height: dims.box,
        borderRadius: "var(--radius-sm)",
        borderWidth: 2,
        borderStyle: "solid",
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: TRANSITION_COLORS,
        // Colors via CSS vars set on the MUI root (inline colors would beat sx).
        backgroundColor: "var(--cads-checkbox-bg)",
        borderColor: "var(--cads-checkbox-border)",
        color: "var(--cads-checkbox-icon)"
      },
      children: status !== "off" ? /* @__PURE__ */ jsx(
        FaIcon,
        {
          name: status === "indeterminate" ? "dash" : "check",
          family: "solid",
          fontSize: dims.iconPx
        }
      ) : null
    }
  );
}
const Checkbox = forwardRef(
  function Checkbox2({
    label,
    labelStyle = "thin",
    size = "medium",
    disabled = false,
    sx,
    ...rest
  }, ref) {
    const dims = CHECKBOX_SIZE[size];
    const control = /* @__PURE__ */ jsx(
      MuiCheckbox,
      {
        ref,
        disableRipple: true,
        disabled,
        icon: /* @__PURE__ */ jsx(CheckboxGlyph, { size, status: "off" }),
        checkedIcon: /* @__PURE__ */ jsx(CheckboxGlyph, { size, status: "on" }),
        indeterminateIcon: /* @__PURE__ */ jsx(CheckboxGlyph, { size, status: "indeterminate" }),
        sx: {
          padding: 0,
          margin: 0,
          color: "inherit",
          ["--cads-checkbox-bg"]: "var(--background-neutral-primary)",
          ["--cads-checkbox-border"]: "var(--border-neutral-solid)",
          ["--cads-checkbox-icon"]: "var(--text-selected-primary)",
          // Unselected hover
          "&:hover:not(.Mui-disabled)": {
            ["--cads-checkbox-bg"]: "var(--background-brand-light)",
            ["--cads-checkbox-border"]: "var(--border-neutral-solid)"
          },
          // Selected / indeterminate default
          "&.Mui-checked, &.MuiCheckbox-indeterminate": {
            ["--cads-checkbox-bg"]: "var(--background-selected-primary)",
            ["--cads-checkbox-border"]: "var(--border-selected-primary)",
            ["--cads-checkbox-icon"]: "var(--text-selected-primary)"
          },
          // Selected / indeterminate hover
          "&.Mui-checked:hover:not(.Mui-disabled), &.MuiCheckbox-indeterminate:hover:not(.Mui-disabled)": {
            ["--cads-checkbox-bg"]: "var(--background-selected-strong)",
            ["--cads-checkbox-border"]: "var(--border-selected-strong)"
          },
          // Unselected pressed
          "&:active:not(.Mui-disabled):not(.Mui-checked):not(.MuiCheckbox-indeterminate)": {
            ["--cads-checkbox-bg"]: "var(--background-brand-light)",
            ["--cads-checkbox-border"]: "var(--border-selected-primary)"
          },
          // Selected / indeterminate pressed
          "&.Mui-checked:active:not(.Mui-disabled), &.MuiCheckbox-indeterminate:active:not(.Mui-disabled)": {
            ["--cads-checkbox-bg"]: "var(--background-selected-strong)",
            ["--cads-checkbox-border"]: "var(--border-selected-strong)"
          },
          // Focus double-ring (2px surface gap + 2px focused border)
          "&.Mui-focusVisible .cads-checkbox-box": {
            boxShadow: FOCUS_RING
          },
          // Disabled unselected
          "&.Mui-disabled": {
            ["--cads-checkbox-bg"]: "var(--background-neutral-primary)",
            ["--cads-checkbox-border"]: "var(--border-disabled-neutral)"
          },
          // Disabled selected / indeterminate
          "&.Mui-disabled.Mui-checked, &.Mui-disabled.MuiCheckbox-indeterminate": {
            ["--cads-checkbox-bg"]: "var(--background-disabled-neutral)",
            ["--cads-checkbox-border"]: "var(--border-disabled-neutral)",
            ["--cads-checkbox-icon"]: "var(--text-disabled-neutral-inverse)"
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
        control,
        label,
        disabled,
        sx: {
          margin: 0,
          alignItems: "flex-start",
          gap: dims.gap,
          // Figma Checkbox Block wraps the box with 2px top padding for optical align.
          "& .MuiCheckbox-root": {
            marginTop: dims.labelAlignOffset
          },
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: dims.fontSize,
            lineHeight: dims.lineHeight,
            fontWeight: labelStyle === "thick" ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
            color: "var(--text-neutral-primary)"
          },
          "&.Mui-disabled .MuiFormControlLabel-label": {
            color: "var(--text-disabled-neutral)"
          }
        }
      }
    );
  }
);

export { Checkbox };
//# sourceMappingURL=Checkbox.js.map
//# sourceMappingURL=Checkbox.js.map