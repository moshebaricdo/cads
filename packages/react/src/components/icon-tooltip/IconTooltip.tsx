import ButtonBase from "@mui/material/ButtonBase";
import { forwardRef, type CSSProperties } from "react";
import { FaIcon } from "../../icons/FaIcon";
import type { ControlSize } from "../../shared/controlSize";
import { Tooltip } from "../tooltip";
import styles from "./iconTooltip.module.scss";
import type { IconTooltipColor, IconTooltipProps } from "./types";

export type { IconTooltipColor, IconTooltipProps, IconTooltipSize } from "./types";

const ICON_TOOLTIP_ICON_PX: Record<ControlSize, string> = {
  large: "1.125rem",
  medium: "1rem",
  small: "0.875rem",
  extraSmall: "0.75rem",
};

const ICON_TOOLTIP_COLOR: Record<IconTooltipColor, string> = {
  primary: "var(--text-brand-primary)",
  secondary: "var(--text-neutral-primary)",
  tertiary: "var(--text-neutral-quaternary)",
};

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
    const { sx: triggerSx, className: triggerClassName, ...triggerRest } =
      triggerProps ?? {};

    const chromeVars = {
      "--it-size": iconPx,
      "--it-color": ICON_TOOLTIP_COLOR[color],
    } as CSSProperties;

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
          className={
            triggerClassName
              ? `${styles.trigger} ${triggerClassName}`
              : styles.trigger
          }
          style={chromeVars}
          sx={triggerSx as object}
          {...triggerRest}
        >
          <FaIcon name={iconName} fontSize={iconPx} />
        </ButtonBase>
      </Tooltip>
    );
  },
);
