import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import { forwardRef, type ReactNode } from "react";

export type TextFieldSize = "l" | "m" | "s" | "xs";

export interface TextFieldProps
  extends Omit<MuiTextFieldProps, "size" | "variant"> {
  /**
   * Control height: L 48 / M 40 / S 32 / XS 24.
   * @default "m"
   */
  size?: TextFieldSize;
  /** Helper / error text below the field. */
  helperText?: ReactNode;
}

const HEIGHT: Record<TextFieldSize, string> = {
  l: "var(--control-height-l)",
  m: "var(--control-height-m)",
  s: "var(--control-height-s)",
  xs: "var(--control-height-xs)",
};

/**
 * CADS TextField — single-line input with shared control heights.
 * Spec source: CADS Figma Text Field component set.
 */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  function TextField({ size = "m", sx, ...rest }, ref) {
    return (
      <MuiTextField
        ref={ref}
        variant="outlined"
        size={size === "l" || size === "m" ? "medium" : "small"}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: HEIGHT[size],
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-body)",
            fontSize:
              size === "xs" || size === "s"
                ? "var(--text-body-xs)"
                : "var(--text-body-sm)",
            backgroundColor: "var(--ds-background-neutral-primary)",
            color: "var(--ds-text-neutral-primary)",
            "& fieldset": {
              borderColor: "var(--ds-border-neutral-primary)",
            },
            "&:hover fieldset": {
              borderColor: "var(--ds-border-neutral-secondary)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--ds-border-focused-primary)",
              borderWidth: 2,
            },
            "&.Mui-error fieldset": {
              borderColor: "var(--ds-border-error-primary)",
            },
            "&.Mui-disabled": {
              backgroundColor: "var(--ds-background-disabled-neutral)",
            },
          },
          "& .MuiInputLabel-root": {
            fontFamily: "var(--font-body)",
            color: "var(--ds-text-neutral-secondary)",
            "&.Mui-focused": {
              color: "var(--ds-text-brand-primary)",
            },
          },
          "& .MuiFormHelperText-root": {
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-xs)",
          },
          ...((sx as object) ?? {}),
        }}
        {...rest}
      />
    );
  },
);
