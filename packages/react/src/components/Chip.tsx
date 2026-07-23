import ButtonBase, {
  type ButtonBaseProps,
} from "@mui/material/ButtonBase";
import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  CHIP_SIZE,
  FOCUS_RING,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type ChipSize = ControlSize;
export type ChipColor = "primary" | "secondary";
export type ChipLabelStyle = "thick" | "thin";

export interface ChipProps
  extends Omit<ButtonBaseProps, "color" | "children"> {
  /**
   * @default "medium"
   */
  size?: ChipSize;
  /**
   * Unselected border treatment. Selected chrome ignores this (uses selected tokens).
   * @default "primary"
   */
  color?: ChipColor;
  /**
   * @default "thick"
   */
  labelStyle?: ChipLabelStyle;
  /** Selected fill chrome (Figma `selected=yes`). */
  selected?: boolean;
  label?: ReactNode;
  /**
   * Leading FA icon. Omit for no start icon (Figma’s boolean `startIcon` is
   * collapsed into presence of this prop).
   */
  startIconName?: FaIconName | (string & {});
  /**
   * Trailing FA icon. Omit for no end icon (Figma’s boolean `endIcon` is
   * collapsed into presence of this prop).
   */
  endIconName?: FaIconName | (string & {});
}

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

  return (
    <ButtonBase
      ref={ref}
      disabled={disabled}
      focusRipple={false}
      disableRipple
      aria-pressed={selected}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: dims.gap,
        height: dims.height,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        borderRadius: "var(--radius-round)",
        border: selected
          ? "1px solid transparent"
          : `1px solid ${borderDefault}`,
        backgroundColor: selected
          ? "var(--background-selected-primary)"
          : "var(--background-neutral-primary)",
        color: selected
          ? "var(--text-selected-primary)"
          : "var(--text-neutral-primary)",
        fontFamily: "var(--font-body)",
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        fontWeight:
          labelStyle === "thick"
            ? "var(--font-weight-semibold)"
            : "var(--font-weight-normal)",
        transition: TRANSITION_COLORS,
        overflow: "hidden",
        whiteSpace: "nowrap",
        "&:hover": disabled
          ? undefined
          : {
              backgroundColor: selected
                ? "var(--background-selected-strong)"
                : "var(--background-neutral-tertiary)",
              borderColor: selected ? "transparent" : borderDefault,
            },
        "&:active": disabled
          ? undefined
          : selected
            ? {
                backgroundColor: "var(--background-selected-strong)",
                border: "2px solid var(--border-selected-strong)",
                paddingInline: `calc(${dims.paddingInline} - 1px)`,
                paddingBlock: `calc(${dims.paddingBlock} - 1px)`,
              }
            : {
                backgroundColor: "var(--background-brand-light)",
                borderColor: "var(--border-selected-primary)",
              },
        "&.Mui-focusVisible": {
          boxShadow: FOCUS_RING,
        },
        "&.Mui-disabled": {
          backgroundColor: selected
            ? "var(--background-disabled-neutral)"
            : "var(--background-neutral-primary)",
          border: selected
            ? "1px solid transparent"
            : "1px solid var(--border-disabled-neutral)",
          color: selected
            ? "var(--text-disabled-neutral-inverse)"
            : "var(--text-disabled-neutral)",
        },
        ...((sx as object) ?? {}),
      }}
      {...rest}
    >
      {startName ? <FaIcon name={startName} fontSize={dims.iconPx} /> : null}
      {label}
      {endName ? <FaIcon name={endName} fontSize={dims.iconPx} /> : null}
    </ButtonBase>
  );
});
