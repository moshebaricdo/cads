import MuiCheckbox, {
  type CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import {
  CHECKBOX_SIZE,
  FOCUS_RING,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type CheckboxSize = ControlSize;
export type CheckboxLabelStyle = "thin" | "thick";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "size" | "color"> {
  /**
   * @default "medium"
   */
  size?: CheckboxSize;
  /** Optional label (Figma Checkbox + Label `Text#252:0`). */
  label?: ReactNode;
  /**
   * Label weight from Figma `labelStyle`.
   * @default "thin"
   */
  labelStyle?: CheckboxLabelStyle;
}

type GlyphStatus = "off" | "on" | "indeterminate";

function CheckboxGlyph({
  size,
  status,
}: {
  size: CheckboxSize;
  status: GlyphStatus;
}) {
  const dims = CHECKBOX_SIZE[size];
  return (
    <span
      className="cads-checkbox-box"
      data-cads-checkbox-status={status}
      style={{
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
        color: "var(--cads-checkbox-icon)",
      }}
    >
      {status !== "off" ? (
        <FaIcon
          name={status === "indeterminate" ? "dash" : "check"}
          family="solid"
          fontSize={dims.iconPx}
        />
      ) : null}
    </span>
  );
}

/**
 * CADS Checkbox — Figma Checkbox + Label / Checkbox block parity.
 * Selected chrome uses selected tokens (never brand fills for selected).
 * Interaction states via CSS (:hover / :focus-visible / :active); no `state` prop.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      labelStyle = "thin",
      size = "medium",
      disabled = false,
      sx,
      ...rest
    },
    ref,
  ) {
    const dims = CHECKBOX_SIZE[size];

    const control = (
      <MuiCheckbox
        ref={ref}
        disableRipple
        disabled={disabled}
        icon={<CheckboxGlyph size={size} status="off" />}
        checkedIcon={<CheckboxGlyph size={size} status="on" />}
        indeterminateIcon={
          <CheckboxGlyph size={size} status="indeterminate" />
        }
        sx={{
          padding: 0,
          margin: 0,
          color: "inherit",
          ["--cads-checkbox-bg" as string]:
            "var(--background-neutral-primary)",
          ["--cads-checkbox-border" as string]: "var(--border-neutral-solid)",
          ["--cads-checkbox-icon" as string]: "var(--text-selected-primary)",
          // Unselected hover
          "&:hover:not(.Mui-disabled)": {
            ["--cads-checkbox-bg" as string]: "var(--background-brand-light)",
            ["--cads-checkbox-border" as string]: "var(--border-neutral-solid)",
          },
          // Selected / indeterminate default
          "&.Mui-checked, &.MuiCheckbox-indeterminate": {
            ["--cads-checkbox-bg" as string]:
              "var(--background-selected-primary)",
            ["--cads-checkbox-border" as string]:
              "var(--border-selected-primary)",
            ["--cads-checkbox-icon" as string]: "var(--text-selected-primary)",
          },
          // Selected / indeterminate hover
          "&.Mui-checked:hover:not(.Mui-disabled), &.MuiCheckbox-indeterminate:hover:not(.Mui-disabled)":
            {
              ["--cads-checkbox-bg" as string]:
                "var(--background-selected-strong)",
              ["--cads-checkbox-border" as string]:
                "var(--border-selected-strong)",
            },
          // Unselected pressed
          "&:active:not(.Mui-disabled):not(.Mui-checked):not(.MuiCheckbox-indeterminate)":
            {
              ["--cads-checkbox-bg" as string]: "var(--background-brand-light)",
              ["--cads-checkbox-border" as string]:
                "var(--border-selected-primary)",
            },
          // Selected / indeterminate pressed
          "&.Mui-checked:active:not(.Mui-disabled), &.MuiCheckbox-indeterminate:active:not(.Mui-disabled)":
            {
              ["--cads-checkbox-bg" as string]:
                "var(--background-selected-strong)",
              ["--cads-checkbox-border" as string]:
                "var(--border-selected-strong)",
            },
          // Focus double-ring (2px surface gap + 2px focused border)
          "&.Mui-focusVisible .cads-checkbox-box": {
            boxShadow: FOCUS_RING,
          },
          // Disabled unselected
          "&.Mui-disabled": {
            ["--cads-checkbox-bg" as string]:
              "var(--background-neutral-primary)",
            ["--cads-checkbox-border" as string]:
              "var(--border-disabled-neutral)",
          },
          // Disabled selected / indeterminate
          "&.Mui-disabled.Mui-checked, &.Mui-disabled.MuiCheckbox-indeterminate":
            {
              ["--cads-checkbox-bg" as string]:
                "var(--background-disabled-neutral)",
              ["--cads-checkbox-border" as string]:
                "var(--border-disabled-neutral)",
              ["--cads-checkbox-icon" as string]:
                "var(--text-disabled-neutral-inverse)",
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
        disabled={disabled}
        sx={{
          margin: 0,
          alignItems: "flex-start",
          gap: dims.gap,
          // Figma Checkbox Block wraps the box with 2px top padding for optical align.
          "& .MuiCheckbox-root": {
            marginTop: dims.labelAlignOffset,
          },
          "& .MuiFormControlLabel-label": {
            fontFamily: "var(--font-body)",
            fontSize: dims.fontSize,
            lineHeight: dims.lineHeight,
            fontWeight:
              labelStyle === "thick"
                ? "var(--font-weight-semibold)"
                : "var(--font-weight-normal)",
            color: "var(--text-neutral-primary)",
          },
          "&.Mui-disabled .MuiFormControlLabel-label": {
            color: "var(--text-disabled-neutral)",
          },
        }}
      />
    );
  },
);
