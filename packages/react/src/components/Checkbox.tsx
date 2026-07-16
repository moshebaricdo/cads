import MuiCheckbox, {
  type CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef, type ReactNode } from "react";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "size"> {
  /** Optional label rendered via FormControlLabel. */
  label?: ReactNode;
  size?: "m" | "s";
}

/**
 * CADS Checkbox — uses selected-fill recipe for checked state.
 * Spec source: CADS Figma Checkbox component set.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ label, size = "m", sx, ...rest }, ref) {
    const control = (
      <MuiCheckbox
        ref={ref}
        size={size === "s" ? "small" : "medium"}
        sx={{
          color: "var(--ds-border-neutral-primary)",
          padding: size === "s" ? "4px" : "8px",
          "&.Mui-checked": {
            color: "var(--ds-background-selected-primary)",
          },
          "&.Mui-focusVisible": {
            outline: "2px solid var(--ds-border-focused-primary)",
            outlineOffset: "2px",
          },
          "&.Mui-disabled": {
            color: "var(--ds-background-disabled-neutral)",
          },
          ...((sx as object) ?? {}),
        }}
        {...rest}
      />
    );

    if (label == null) return control;

    return (
      <FormControlLabel
        control={control}
        label={label}
        sx={{
          marginLeft: 0,
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-sm)",
            color: "var(--ds-text-neutral-primary)",
          },
        }}
      />
    );
  },
);
