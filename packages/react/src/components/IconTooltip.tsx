import ButtonBase, {
  type ButtonBaseProps,
} from "@mui/material/ButtonBase";
import { forwardRef } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import { FOCUS_RING, type ControlSize } from "../shared/controlSize";
import { Tooltip, type TooltipProps } from "./Tooltip";

export type IconTooltipColor = "primary" | "secondary" | "tertiary";
export type IconTooltipSize = ControlSize;

/**
 * Bare glyph size per control size step — no hit-box padding, since the
 * icon itself (not a button) is the visible affordance.
 */
const ICON_TOOLTIP_ICON_PX: Record<IconTooltipSize, string> = {
  large: "1.125rem", // 18px
  medium: "1rem", // 16px
  small: "0.875rem", // 14px
  extraSmall: "0.75rem", // 12px
};

const ICON_TOOLTIP_COLOR: Record<IconTooltipColor, string> = {
  primary: "var(--text-brand-primary)",
  secondary: "var(--text-neutral-primary)",
  tertiary: "var(--text-neutral-quaternary)",
};

export interface IconTooltipProps
  extends Omit<TooltipProps, "children" | "surfaceOnly" | "iconName"> {
  /**
   * FA Pro icon rendered as the tooltip trigger affordance.
   * @default "circle-info"
   */
  iconName?: FaIconName | (string & {});
  /**
   * Icon color role — brand, neutral-primary, or muted quaternary.
   * @default "tertiary"
   */
  color?: IconTooltipColor;
  /**
   * Glyph size on the shared control size scale.
   * @default "medium"
   */
  size?: IconTooltipSize;
  /**
   * Accessible name for the trigger. Falls back to `title` when it is a
   * plain string; required when `title` is rich content.
   */
  "aria-label"?: string;
  /** Escape hatch for the underlying trigger (ButtonBase) props. */
  triggerProps?: Omit<ButtonBaseProps, "children" | "color">;
}

/**
 * CADS Icon Tooltip — an info-style icon that is purely a tooltip affordance.
 * No button chrome (fill/border/press scale); only a required focus ring on
 * keyboard focus. Composes `Tooltip` for positioning/caret — this component
 * only owns the trigger glyph.
 *
 * Spec: Figma Info Tooltip `17051:27346` (size × color × state), authored from
 * this implementation. `placement` / `hasCaret` come from the `Tooltip` set
 * (`1990:7125`); Figma only models the default top placement.
 */
export const IconTooltip = forwardRef<HTMLButtonElement, IconTooltipProps>(
  function IconTooltip(
    {
      iconName = "circle-info",
      color = "tertiary",
      size = "medium",
      placement = "top",
      hasCaret = true,
      title,
      triggerProps,
      "aria-label": ariaLabelProp,
      ...rest
    },
    ref,
  ) {
    const ariaLabel =
      ariaLabelProp ?? (typeof title === "string" ? title : undefined);

    if (process.env.NODE_ENV !== "production" && !ariaLabel) {
      console.warn(
        "[CADS IconTooltip] Provide `aria-label` when `title` is not a plain string — " +
          "the trigger needs an accessible name.",
      );
    }

    const iconPx = ICON_TOOLTIP_ICON_PX[size];
    const { sx: triggerSx, ...triggerRest } = triggerProps ?? {};

    return (
      <Tooltip
        title={title}
        placement={placement}
        hasCaret={hasCaret}
        {...rest}
      >
        <ButtonBase
          ref={ref}
          type="button"
          disableRipple
          disableTouchRipple
          focusRipple={false}
          aria-label={ariaLabel}
          data-cads-component="IconTooltip"
          {...triggerRest}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: iconPx,
            height: iconPx,
            minWidth: 0,
            padding: 0,
            borderRadius: "var(--radius-sm)",
            color: ICON_TOOLTIP_COLOR[color],
            backgroundColor: "transparent",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&:active": {
              backgroundColor: "transparent",
            },
            "&.Mui-focusVisible": {
              boxShadow: FOCUS_RING,
            },
            "&.Mui-disabled": {
              color: "var(--text-disabled-neutral)",
              opacity: 1,
            },
            ...((triggerSx as object) ?? {}),
          }}
        >
          <FaIcon name={iconName} fontSize={iconPx} />
        </ButtonBase>
      </Tooltip>
    );
  },
);
