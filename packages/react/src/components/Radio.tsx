import MuiRadio, { type RadioProps as MuiRadioProps } from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef, type ReactNode } from "react";

export interface RadioProps extends Omit<MuiRadioProps, "size"> {
  label?: ReactNode;
  size?: "medium" | "small";
}

/**
 * CADS Radio — uses selected-fill recipe when checked.
 * Spec source: CADS Figma Radio component set.
 */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  function Radio({ label, size = "medium", sx, ...rest }, ref) {
    const control = (
      <MuiRadio
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
