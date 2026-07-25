import MuiRadio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { forwardRef } from "react";
import { RADIO_SIZE } from "../../shared/controlSize";
import styles from "./radio.module.scss";
import type { RadioProps } from "./types";

export type { RadioProps, RadioSize, RadioLabelStyle } from "./types";

function RadioUncheckedIcon({ box }: { box: string }) {
  return (
    <span
      aria-hidden
      className={styles.circle}
      style={{ width: box, height: box }}
    />
  );
}

function RadioCheckedIcon({ box, dot }: { box: string; dot: string }) {
  return (
    <span
      aria-hidden
      className={styles.circle}
      style={{ width: box, height: box }}
    >
      <span className={styles.dot} style={{ width: dot, height: dot }} />
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
        disabled={disabled}
        control={control}
        label={label}
        className={styles.labelWrapper}
        sx={{
          gap: dims.gap,
          "& .MuiFormControlLabel-label": {
            fontSize: dims.fontSize,
            lineHeight: dims.lineHeight,
            fontWeight:
              labelStyle === "thick"
                ? "var(--font-weight-semi-bold)"
                : "var(--font-weight-regular)",
          },
          "& .MuiRadio-root": {
            paddingTop: dims.controlPaddingTop,
          },
        }}
      />
    );
  },
);
