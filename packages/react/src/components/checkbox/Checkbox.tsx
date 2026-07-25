import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { CHECKBOX_SIZE } from "../../shared/controlSize";
import styles from "./checkbox.module.scss";
import type { CheckboxProps, CheckboxSize } from "./types";

export type { CheckboxProps, CheckboxSize, CheckboxLabelStyle } from "./types";

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
      className={styles.box}
      data-cads-checkbox-status={status}
      style={{
        width: dims.box,
        height: dims.box,
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
        data-cads-press=""
        className={styles.root}
        sx={{
          padding: 0,
          margin: 0,
          color: "inherit",
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
        className={styles.labelWrapper}
        sx={{
          gap: dims.gap,
          "& .MuiCheckbox-root": {
            marginTop: dims.labelAlignOffset,
          },
          "& .MuiFormControlLabel-label": {
            fontSize: dims.fontSize,
            lineHeight: dims.lineHeight,
            fontWeight:
              labelStyle === "thick"
                ? "var(--font-weight-semibold)"
                : "var(--font-weight-normal)",
          },
        }}
      />
    );
  },
);
