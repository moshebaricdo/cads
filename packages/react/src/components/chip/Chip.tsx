import ButtonBase from "@mui/material/ButtonBase";
import { forwardRef, type CSSProperties } from "react";
import { FaIcon } from "../../icons/FaIcon";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import { CHIP_SIZE } from "../../shared/controlSize";
import styles from "./chip.module.scss";
import type { ChipProps } from "./types";

export type { ChipColor, ChipLabelStyle, ChipProps, ChipSize } from "./types";

function resolveIconName(
  name: FaIconName | (string & {}) | undefined,
): FaIconName {
  if (!name || name === "smile") return "face-smile";
  return name as FaIconName;
}

/**
 * CADS Chip — selectable pill for use in ChipGroup (or alone).
 * Spec: Figma Chip `5881:2187` / key `388cba2ed6150b2a9b448f1895ed2f04ca90edb2`.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  {
    size = "medium",
    color = "primary",
    labelStyle = "thick",
    selected = false,
    label = "Chips",
    startIconName,
    endIconName,
    disabled,
    sx,
    className,
    ...rest
  },
  ref,
) {
  const dims = CHIP_SIZE[size];
  const borderDefault =
    color === "secondary"
      ? "var(--border-neutral-secondary)"
      : "var(--border-neutral-solid)";
  const startName = startIconName ? resolveIconName(startIconName) : null;
  const endName = endIconName ? resolveIconName(endIconName) : null;

  const chromeVars = {
    "--chip-height": dims.height,
    "--chip-px": dims.paddingInline,
    "--chip-py": dims.paddingBlock,
    "--chip-gap": dims.gap,
    "--chip-font-size": dims.fontSize,
    "--chip-line-height": dims.lineHeight,
    "--chip-font-weight":
      labelStyle === "thick"
        ? "var(--font-weight-semibold)"
        : "var(--font-weight-normal)",
    "--chip-border": selected ? "transparent" : borderDefault,
    "--chip-bg": selected
      ? "var(--background-selected-primary)"
      : "var(--background-neutral-primary)",
    "--chip-fg": selected
      ? "var(--text-selected-primary)"
      : "var(--text-neutral-primary)",
    "--chip-bg-hover": selected
      ? "var(--background-selected-strong)"
      : "var(--background-neutral-tertiary)",
    "--chip-border-hover": selected ? "transparent" : borderDefault,
    "--chip-bg-disabled": selected
      ? "var(--background-disabled-neutral)"
      : "var(--background-neutral-primary)",
    "--chip-border-disabled": selected
      ? "transparent"
      : "var(--border-disabled-neutral)",
    "--chip-fg-disabled": selected
      ? "var(--text-disabled-neutral-inverse)"
      : "var(--text-disabled-neutral)",
  } as CSSProperties;

  return (
    <ButtonBase
      ref={ref}
      disabled={disabled}
      focusRipple={false}
      disableRipple
      aria-pressed={selected}
      data-cads-press=""
      className={className ? `${styles.root} ${className}` : styles.root}
      style={chromeVars}
      sx={sx}
      {...rest}
    >
      {startName ? <FaIcon name={startName} fontSize={dims.iconPx} /> : null}
      {label}
      {endName ? <FaIcon name={endName} fontSize={dims.iconPx} /> : null}
    </ButtonBase>
  );
});
