import ButtonBase, {
  type ButtonBaseProps,
} from "@mui/material/ButtonBase";
import { motion as motionVars } from "@moshebaricdo/cads-variables";
import { motion, useReducedMotion } from "motion/react";
import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import { TOGGLE_SIZE } from "../../shared/controlSize";
import {
  springTransition,
  useExperimentalMotion,
} from "../../theme/experimentalMotion";
import styles from "./toggle.module.scss";
import type { ToggleProps } from "./types";

export type { ToggleProps, ToggleSize, ToggleLabelPlacement } from "./types";

/**
 * CADS Toggle — switch with customizable track icons (default check / xmark)
 * and a sliding handle. Spec: Figma Toggle + Label `327:2151`, block `8841:5569`.
 * Track heights match Checkbox/Radio (22 / 20 / 18 / 16).
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      size = "medium",
      label,
      labelPlacement = "left",
      checked,
      defaultChecked = false,
      onChange,
      hasIcons = true,
      onIcon = "check",
      offIcon = "xmark",
      disabled = false,
      id: idProp,
      sx,
      "aria-label": ariaLabel,
      onClick,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const labelId = `${id}-label`;
    const dims = TOGGLE_SIZE[size];
    const controlled = checked !== undefined;
    const [uncontrolled, setUncontrolled] = useState(defaultChecked);
    const isOn = controlled ? Boolean(checked) : uncontrolled;
    const experimentalMotion = useExperimentalMotion();
    const reduceMotion = useReducedMotion();
    const indicatorSpring = springTransition(
      motionVars.indicator.spring,
      reduceMotion,
    );

    const handleClick: ButtonBaseProps["onClick"] = (event) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;
      const next = !isOn;
      if (!controlled) setUncontrolled(next);
      onChange?.(event, next);
    };

    const trackBg = disabled
      ? "var(--background-disabled-neutral)"
      : isOn
        ? "var(--background-selected-primary)"
        : "var(--background-neutral-septenary)";

    const trackBgHover = isOn
      ? "var(--background-selected-strong)"
      : "var(--background-neutral-octonary)";

    const handleBg = disabled
      ? "var(--background-neutral-primary)"
      : isOn
        ? "var(--background-selected-primary-inverse)"
        : "var(--background-neutral-primary)";

    const iconColor = disabled
      ? "var(--text-disabled-neutral-inverse)"
      : isOn
        ? "var(--text-selected-primary)"
        : "var(--text-neutral-primary-inverse)";

    const control = (
      <ButtonBase
        {...rest}
        ref={ref}
        id={id}
        type="button"
        role="switch"
        disabled={disabled}
        aria-checked={isOn}
        aria-label={label == null ? ariaLabel : undefined}
        aria-labelledby={label != null ? labelId : undefined}
        onClick={handleClick}
        disableRipple
        focusRipple={false}
        data-cads-toggle=""
        data-on={isOn ? "true" : "false"}
        className={styles.track}
        style={{
          width: dims.trackWidth,
          height: dims.trackHeight,
          padding: dims.pad,
          cursor: disabled ? "not-allowed" : "pointer",
          "--cads-toggle-bg": trackBg,
          "--cads-toggle-bg-hover": trackBgHover,
          "--cads-toggle-fg": iconColor,
        } as CSSProperties}
        sx={sx}
      >
        {hasIcons ? (
          <>
            <span
              aria-hidden
              className={styles.iconSlot}
              style={{
                left: dims.iconInsetLeft,
                width: `calc(100% - ${dims.iconInsetLeft} - ${dims.iconGap} - ${dims.handle} - ${dims.pad})`,
                opacity: isOn ? 1 : 0,
              }}
            >
              <FaIcon name={onIcon} family="solid" fontSize={dims.iconPx} />
            </span>

            <span
              aria-hidden
              className={styles.iconSlot}
              style={{
                right: dims.iconInsetRight,
                width: `calc(100% - ${dims.iconInsetRight} - ${dims.iconGap} - ${dims.handle} - ${dims.pad})`,
                opacity: isOn ? 0 : 1,
              }}
            >
              <FaIcon name={offIcon} family="solid" fontSize={dims.iconPx} />
            </span>
          </>
        ) : null}

        {experimentalMotion ? (
          <motion.span
            aria-hidden
            data-cads-indicator=""
            data-cads-indicator-spring=""
            className={styles.handleSpring}
            initial={false}
            animate={{ x: isOn ? dims.handleTravelPx : 0 }}
            transition={indicatorSpring}
            style={{
              top: dims.pad,
              left: dims.pad,
              width: dims.handle,
              height: dims.handle,
            }}
          >
            <span
              data-cads-indicator-face=""
              className={styles.handleFace}
              style={{ backgroundColor: handleBg }}
            />
          </motion.span>
        ) : (
          <span
            aria-hidden
            data-cads-indicator=""
            className={styles.handle}
            style={{
              top: dims.pad,
              left: isOn
                ? `calc(100% - ${dims.handle} - ${dims.pad})`
                : dims.pad,
              width: dims.handle,
              height: dims.handle,
              backgroundColor: handleBg,
            }}
          />
        )}
      </ButtonBase>
    );

    if (label == null) return control;

    const labelEl = (
      <span
        id={labelId}
        style={{
          fontFamily: "var(--font-family-main)",
          fontWeight: 400,
          fontSize: dims.fontSize,
          lineHeight: dims.lineHeight,
          color: "var(--text-neutral-primary)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    );

    return (
      <label
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: dims.labelGap,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {labelPlacement === "left" ? labelEl : null}
        {control}
        {labelPlacement === "right" ? labelEl : null}
      </label>
    );
  },
);
