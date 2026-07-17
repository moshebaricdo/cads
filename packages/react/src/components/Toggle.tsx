import ButtonBase, {
  type ButtonBaseProps,
} from "@mui/material/ButtonBase";
import {
  forwardRef,
  useId,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { FaIcon } from "../icons/FaIcon";
import {
  FOCUS_RING,
  TOGGLE_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type ToggleSize = ControlSize;

/**
 * Label placement relative to the switch:
 * - `left` — label on the left, switch on the right
 * - `right` — switch on the left, label on the right
 *
 * (Corrects inverted Figma `labelPlacement` naming.)
 */
export type ToggleLabelPlacement = "left" | "right";

export interface ToggleProps
  extends Omit<ButtonBaseProps, "onChange" | "children" | "color"> {
  /**
   * @default "medium"
   */
  size?: ToggleSize;
  /** Optional adjacent label (Figma Toggle + Label). */
  label?: ReactNode;
  /**
   * Where the label sits relative to the switch.
   * @default "left"
   */
  labelPlacement?: ToggleLabelPlacement;
  /** Controlled on/off (Figma `isOn`). */
  checked?: boolean;
  /** Uncontrolled default. */
  defaultChecked?: boolean;
  onChange?: (event: MouseEvent<HTMLButtonElement>, checked: boolean) => void;
}

const HANDLE_MOTION =
  "left var(--duration-medium) var(--easing-emphasized), background-color var(--duration-short) var(--easing-standard)";
const ICON_MOTION =
  "opacity var(--duration-short) var(--easing-standard)";

/**
 * CADS Toggle — switch with check / xmark icons and a sliding handle.
 * Spec: Figma Toggle + Label `327:2151`, block `8841:5569`.
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
        sx={{
          boxSizing: "border-box",
          position: "relative",
          display: "inline-block",
          flexShrink: 0,
          width: dims.trackWidth,
          height: dims.trackHeight,
          padding: dims.pad,
          borderRadius: "var(--radius-round)",
          overflow: "hidden",
          backgroundColor: trackBg,
          color: iconColor,
          transition: TRANSITION_COLORS,
          cursor: disabled ? "not-allowed" : "pointer",
          WebkitTapHighlightColor: "transparent",
          "&:hover:not(.Mui-disabled)": {
            backgroundColor: isOn
              ? "var(--background-selected-strong)"
              : "var(--background-neutral-octonary)",
          },
          "&:active:not(.Mui-disabled)": {
            backgroundColor: isOn
              ? "var(--background-selected-strong)"
              : "var(--background-neutral-octonary)",
            ...(isOn
              ? {
                  boxShadow: "inset 0 0 0 2px var(--border-selected-strong)",
                }
              : {}),
          },
          "&.Mui-focusVisible, &:focus-visible": {
            boxShadow: FOCUS_RING,
          },
          "&.Mui-focusVisible:active:not(.Mui-disabled), &:focus-visible:active:not(.Mui-disabled)":
            isOn
              ? {
                  boxShadow: `${FOCUS_RING}, inset 0 0 0 2px var(--border-selected-strong)`,
                }
              : {
                  boxShadow: FOCUS_RING,
                },
          ...((sx as object) ?? {}),
        }}
      >
        {/* Check — left side, visible when on */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: dims.iconInset,
            width: dims.iconSlot,
            transform: "translateY(-50%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            color: "inherit",
            opacity: isOn ? 1 : 0,
            transition: ICON_MOTION,
            pointerEvents: "none",
          }}
        >
          <FaIcon name="check" family="solid" fontSize={dims.iconPx} />
        </span>

        {/* Xmark — right side, visible when off */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            right: dims.iconInset,
            width: dims.iconSlot,
            transform: "translateY(-50%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            color: "inherit",
            opacity: isOn ? 0 : 1,
            transition: ICON_MOTION,
            pointerEvents: "none",
          }}
        >
          <FaIcon name="xmark" family="solid" fontSize={dims.iconPx} />
        </span>

        {/* Sliding handle */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: dims.pad,
            left: isOn
              ? `calc(100% - ${dims.handle} - ${dims.pad})`
              : dims.pad,
            boxSizing: "border-box",
            width: dims.handle,
            height: dims.handle,
            borderRadius: "var(--radius-round)",
            backgroundColor: handleBg,
            transition: HANDLE_MOTION,
            pointerEvents: "none",
          }}
        />
      </ButtonBase>
    );

    if (label == null) return control;

    const labelEl = (
      <span
        id={labelId}
        style={{
          fontFamily: "var(--font-body)",
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
