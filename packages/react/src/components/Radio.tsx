import MuiRadio, { type RadioProps as MuiRadioProps } from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef, type ReactNode } from "react";
import {
  FOCUS_RING,
  RADIO_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type RadioSize = ControlSize;
export type RadioLabelStyle = "thin" | "thick";

export interface RadioProps extends Omit<MuiRadioProps, "size" | "icon" | "checkedIcon"> {
  /** Optional label (Figma Radio Button + Label). */
  label?: ReactNode;
  /** Control size — Figma `size` axis. */
  size?: RadioSize;
  /** Label weight — Figma `labelStyle` (`thin` = regular, `thick` = semibold). */
  labelStyle?: RadioLabelStyle;
}

/**
 * Unchecked circle glyph. Colors come from CSS vars on the MUI Radio root.
 */
function RadioUncheckedIcon({ box }: { box: string }) {
  return (
    <span
      aria-hidden
      data-cads-radio-circle=""
      style={{
        boxSizing: "border-box",
        display: "block",
        width: box,
        height: box,
        borderRadius: "var(--radius-round)",
        border: "2px solid var(--cads-radio-border)",
        backgroundColor: "var(--cads-radio-bg)",
        transition: TRANSITION_COLORS,
      }}
    />
  );
}

/**
 * Selected circle + inner dot. Dot color via `--cads-radio-dot`.
 */
function RadioCheckedIcon({ box, dot }: { box: string; dot: string }) {
  return (
    <span
      aria-hidden
      data-cads-radio-circle=""
      style={{
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: box,
        height: box,
        borderRadius: "var(--radius-round)",
        border: "2px solid var(--cads-radio-border)",
        backgroundColor: "var(--cads-radio-bg)",
        transition: TRANSITION_COLORS,
      }}
    >
      <span
        data-cads-radio-dot=""
        style={{
          display: "block",
          width: dot,
          height: dot,
          borderRadius: "var(--radius-round)",
          backgroundColor: "var(--cads-radio-dot)",
          transition: TRANSITION_COLORS,
        }}
      />
    </span>
  );
}

/**
 * CADS Radio — circular radio with selected ring + inner dot (not a filled square).
 * Spec: Figma Radio Button + Label `4675:6352` / Radio Buttons Block `13257:411`.
 * Interaction states via CSS pseudo-classes — no `state` React prop.
 * Group with MUI `RadioGroup` when needed.
 */
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  function Radio(
    {
      label,
      size = "medium",
      labelStyle = "thin",
      disabled,
      sx,
      ...rest
    },
    ref,
  ) {
    const dims = RADIO_SIZE[size];

    const control = (
      <MuiRadio
        ref={ref}
        disableRipple
        disabled={disabled}
        icon={<RadioUncheckedIcon box={dims.box} />}
        checkedIcon={<RadioCheckedIcon box={dims.box} dot={dims.dot} />}
        sx={{
          padding: 0,
          margin: 0,
          color: "inherit",
          // Default / unselected
          ["--cads-radio-bg" as string]: "var(--background-neutral-primary)",
          ["--cads-radio-border" as string]: "var(--border-neutral-solid)",
          ["--cads-radio-dot" as string]: "var(--background-selected-primary)",
          transition: TRANSITION_COLORS,
          "&:hover:not(.Mui-disabled)": {
            backgroundColor: "transparent",
            ["--cads-radio-bg" as string]: "var(--background-brand-light)",
            ["--cads-radio-border" as string]: "var(--border-neutral-solid)",
          },
          "&:active:not(.Mui-disabled)": {
            ["--cads-radio-bg" as string]: "var(--background-brand-light)",
            ["--cads-radio-border" as string]: "var(--border-selected-primary)",
          },
          "&.Mui-focusVisible:not(.Mui-disabled)": {
            backgroundColor: "transparent",
            ["--cads-radio-bg" as string]: "var(--background-neutral-primary)",
            ["--cads-radio-border" as string]: "var(--border-neutral-solid)",
            "& [data-cads-radio-circle]": {
              boxShadow: FOCUS_RING,
            },
          },
          // Selected — white fill + selected ring + inner dot (not brand fill)
          "&.Mui-checked": {
            ["--cads-radio-bg" as string]: "var(--background-neutral-primary)",
            ["--cads-radio-border" as string]: "var(--border-selected-primary)",
            ["--cads-radio-dot" as string]: "var(--background-selected-primary)",
            "&:hover:not(.Mui-disabled)": {
              // Figma hover+selected: white fill, selected-strong border/dot
              ["--cads-radio-bg" as string]: "var(--background-neutral-primary)",
              ["--cads-radio-border" as string]: "var(--border-selected-strong)",
              ["--cads-radio-dot" as string]: "var(--background-selected-strong)",
            },
            "&:active:not(.Mui-disabled)": {
              ["--cads-radio-bg" as string]: "var(--background-brand-light)",
              ["--cads-radio-border" as string]: "var(--border-selected-primary)",
              ["--cads-radio-dot" as string]: "var(--background-selected-primary)",
            },
            "&.Mui-focusVisible:not(.Mui-disabled)": {
              backgroundColor: "transparent",
              ["--cads-radio-bg" as string]: "var(--background-neutral-primary)",
              ["--cads-radio-border" as string]: "var(--border-selected-primary)",
              ["--cads-radio-dot" as string]: "var(--background-selected-primary)",
              "& [data-cads-radio-circle]": {
                boxShadow: FOCUS_RING,
              },
            },
          },
          "&.Mui-disabled": {
            opacity: 1,
            ["--cads-radio-bg" as string]: "var(--background-neutral-primary)",
            ["--cads-radio-border" as string]: "var(--border-disabled-neutral)",
            ["--cads-radio-dot" as string]: "var(--background-disabled-neutral)",
          },
          ...((sx as object) ?? {}),
        }}
        {...rest}
      />
    );

    if (label == null) return control;

    return (
      <FormControlLabel
        disabled={disabled}
        control={control}
        label={label}
        sx={{
          alignItems: "flex-start",
          margin: 0,
          gap: dims.gap,
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: dims.fontSize,
            lineHeight: dims.lineHeight,
            fontWeight:
              labelStyle === "thick"
                ? "var(--font-weight-semibold)"
                : "var(--font-weight-normal)",
            color: "var(--text-neutral-primary)",
            "&.Mui-disabled": {
              color: "var(--text-disabled-neutral)",
            },
          },
          // Figma Radio Button wrapper: 2px top padding for type alignment
          "& .MuiRadio-root": {
            paddingTop: dims.controlPaddingTop,
          },
        }}
      />
    );
  },
);
