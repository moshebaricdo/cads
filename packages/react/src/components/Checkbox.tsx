import MuiCheckbox, {
  type CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef, type ReactNode } from "react";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "size"> {
  /** Optional label rendered via FormControlLabel. */
  label?: ReactNode;
  size?: "medium" | "small";
}

/**
 * CADS Checkbox — uses selected-fill recipe for checked state.
 * Spec source: CADS Figma Checkbox component set.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox({ label, size = "medium", sx, ...rest }, ref) {
    const control = (
      <MuiCheckbox
        ref={ref}
        size={size === "small" ? "small" : "medium"}
        sx={{
          color: "var(--border-neutral-primary)",
          padding: size === "small" ? "0.25rem" : "0.5rem",
          "&.Mui-checked": {
            color: "var(--background-selected-primary)",
          },
          "&.Mui-focusVisible": {
            outline: "2px solid var(--border-focused-primary)",
            outlineOffset: "2px",
          },
          "&.Mui-disabled": {
            color: "var(--background-disabled-neutral)",
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
          margin: 0,
          gap: "0.5rem",
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-sm)",
            color: "var(--text-neutral-primary)",
          },
        }}
      />
    );
  },
);
