import MuiRadio, { type RadioProps as MuiRadioProps } from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef, type ReactNode } from "react";

export interface RadioProps extends Omit<MuiRadioProps, "size"> {
  /** Optional label rendered via FormControlLabel. */
  label?: ReactNode;
  size?: "m" | "s";
}

/**
 * CADS Radio — uses selected-fill recipe for checked state.
 * Spec source: CADS Figma Radio component set.
 */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  function Radio({ label, size = "m", sx, ...rest }, ref) {
    const control = (
      <MuiRadio
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
