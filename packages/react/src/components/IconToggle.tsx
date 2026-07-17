import IconButton, {
  type IconButtonProps,
} from "@mui/material/IconButton";
import {
  forwardRef,
  useState,
  type ReactNode,
} from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  FOCUS_RING,
  ICON_TOGGLE_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type IconToggleSize = ControlSize;
/** Figma Icon Toggle `color`: primary / secondary / brand / error / success. */
export type IconToggleColor =
  | "primary"
  | "secondary"
  | "brand"
  | "success"
  | "error";

export type IconToggleSecondProps = {
  /** FA Pro icon (kebab-case); Figma `smile` alias accepted. */
  iconName: FaIconName | (string & {});
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  "aria-label": string;
  disabled?: boolean;
  /** Color recipe for this toggle only (independent of parent `color`). */
  color?: IconToggleColor;
};

export interface IconToggleProps
  extends Omit<IconButtonProps, "color" | "size" | "children"> {
  /**
   * @default "medium"
   */
  size?: IconToggleSize;
  /**
   * Active (on) + hover/press surface recipe.
   * @default "brand"
   */
  color?: IconToggleColor;
  /** Controlled on/off (Figma `isOn`). */
  pressed?: boolean;
  /** Uncontrolled default. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** FA Pro icon name (kebab-case); Figma `smile` alias accepted. */
  iconName: FaIconName | (string & {});
  /**
   * Optional group label (Figma Icon Toggle + Label).
   */
  label?: ReactNode;
  /**
   * Optional second toggle for labeled groups (Figma `hasTwoToggles`, up to 2).
   * Toggles are independent unless `exclusive` is set.
   */
  secondToggle?: IconToggleSecondProps;
  /**
   * When `secondToggle` is set, turning one on turns the other off.
   * Figma does not encode exclusive pairing — defaults to independent binary
   * toggles. Use `exclusive` for thumbs-up/down-style mutual exclusion
   * (both may still be off).
   * @default false
   */
  exclusive?: boolean;
}

type ColorRecipe = {
  on: string;
  hoverIcon: string;
  pressIcon: string;
  surface: string;
};

function colorRecipe(color: IconToggleColor): ColorRecipe {
  switch (color) {
    case "primary":
      return {
        on: "var(--text-neutral-primary)",
        hoverIcon: "var(--text-neutral-primary)",
        pressIcon: "var(--text-neutral-quaternary)",
        surface: "var(--background-neutral-tertiary)",
      };
    case "secondary":
      return {
        on: "var(--text-neutral-quaternary)",
        hoverIcon: "var(--text-neutral-quaternary)",
        pressIcon: "var(--text-neutral-secondary)",
        surface: "var(--background-neutral-tertiary)",
      };
    case "success":
      return {
        on: "var(--text-success-primary-fixed)",
        hoverIcon: "var(--text-success-primary-fixed)",
        pressIcon: "var(--text-success-secondary)",
        surface: "var(--background-success-light)",
      };
    case "error":
      return {
        on: "var(--text-error-primary-fixed)",
        hoverIcon: "var(--text-error-primary-fixed)",
        pressIcon: "var(--text-error-secondary)",
        surface: "var(--background-error-light)",
      };
    case "brand":
    default:
      return {
        on: "var(--text-brand-primary-fixed)",
        hoverIcon: "var(--text-brand-primary-fixed)",
        pressIcon: "var(--text-brand-secondary)",
        surface: "var(--background-brand-light)",
      };
  }
}

function labelType(size: IconToggleSize) {
  switch (size) {
    case "large":
      return {
        fontSize: "var(--text-body-lg)",
        lineHeight: "var(--leading-body-lg)",
      };
    case "small":
      return {
        fontSize: "var(--text-body-sm)",
        lineHeight: "var(--leading-body-sm)",
      };
    case "extraSmall":
      return {
        fontSize: "var(--text-body-xs)",
        lineHeight: "var(--leading-body-xs)",
      };
    case "medium":
    default:
      return {
        fontSize: "var(--text-body-md)",
        lineHeight: "var(--leading-body-md)",
      };
  }
}

type ToggleButtonProps = {
  size: IconToggleSize;
  color: IconToggleColor;
  iconName: FaIconName | (string & {});
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
  sx?: IconButtonProps["sx"];
  onClick?: IconButtonProps["onClick"];
};

const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {
      size,
      color,
      iconName,
      pressed,
      defaultPressed,
      onPressedChange,
      disabled,
      sx,
      onClick,
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const controlled = pressed !== undefined;
    const [uncontrolled, setUncontrolled] = useState(defaultPressed ?? false);
    const isOn = controlled ? Boolean(pressed) : uncontrolled;
    const dims = ICON_TOGGLE_SIZE[size];
    const recipe = colorRecipe(color);
    const offIcon = "var(--text-neutral-quaternary)";
    const disabledIcon = "var(--text-disabled-neutral)";

    return (
      <IconButton
        ref={ref}
        disableRipple
        disabled={disabled}
        aria-pressed={isOn}
        aria-label={ariaLabel}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) {
            const next = !isOn;
            if (!controlled) setUncontrolled(next);
            onPressedChange?.(next);
          }
        }}
        sx={{
          width: dims.size,
          height: dims.size,
          padding: dims.padding,
          borderRadius: "var(--radius-sm)",
          color: "inherit",
          backgroundColor: "transparent",
          transition: TRANSITION_COLORS,
          // Icon color driven by CSS var so hover/press recipes apply.
          ["--cads-icon-toggle-icon" as string]: isOn ? recipe.on : offIcon,
          "&:hover": {
            backgroundColor: recipe.surface,
            ["--cads-icon-toggle-icon" as string]: recipe.hoverIcon,
          },
          "&:active": {
            backgroundColor: recipe.surface,
            ["--cads-icon-toggle-icon" as string]: recipe.pressIcon,
          },
          "&.Mui-focusVisible": {
            backgroundColor: "transparent",
            boxShadow: FOCUS_RING,
          },
          "&.Mui-disabled": {
            opacity: 1,
            ["--cads-icon-toggle-icon" as string]: disabledIcon,
          },
          ...((sx as object) ?? {}),
        }}
      >
        <FaIcon
          name={iconName}
          family={isOn ? "solid" : "regular"}
          fontSize={dims.iconPx}
          style={{
            width: dims.iconSlot,
            color: "var(--cads-icon-toggle-icon)",
            transition: TRANSITION_COLORS,
          }}
        />
      </IconButton>
    );
  },
);

/**
 * CADS Icon Toggle — icon-only binary control.
 * Covers Figma Icon Toggle + Icon Toggle + Label in one API.
 * Spec: `3710:461` / `3514:2239`.
 */
export const IconToggle = forwardRef<HTMLButtonElement, IconToggleProps>(
  function IconToggle(
    {
      size = "medium",
      color = "brand",
      label,
      secondToggle,
      exclusive = false,
      iconName,
      pressed,
      defaultPressed,
      onPressedChange,
      ...rest
    },
    ref,
  ) {
    const firstControlled = pressed !== undefined;
    const secondControlled = secondToggle?.pressed !== undefined;
    const useExclusivePair =
      Boolean(exclusive && secondToggle) &&
      !firstControlled &&
      !secondControlled;

    const [pair, setPair] = useState({
      first: defaultPressed ?? false,
      second: secondToggle?.defaultPressed ?? false,
    });

    const handleFirstChange = (next: boolean) => {
      if (useExclusivePair) {
        setPair((prev) => ({
          first: next,
          second: next ? false : prev.second,
        }));
      } else if (exclusive && secondToggle && next) {
        secondToggle.onPressedChange?.(false);
      }
      onPressedChange?.(next);
    };

    const handleSecondChange = (next: boolean) => {
      if (useExclusivePair) {
        setPair((prev) => ({
          first: next ? false : prev.first,
          second: next,
        }));
      } else if (exclusive && next) {
        onPressedChange?.(false);
      }
      secondToggle?.onPressedChange?.(next);
    };

    const firstPressed = useExclusivePair
      ? pair.first
      : pressed;
    const secondPressed = useExclusivePair
      ? pair.second
      : secondToggle?.pressed;

    const toggle = (
      <ToggleButton
        ref={ref}
        size={size}
        color={color}
        iconName={iconName}
        pressed={firstPressed}
        defaultPressed={useExclusivePair ? undefined : defaultPressed}
        onPressedChange={handleFirstChange}
        {...rest}
      />
    );

    if (label == null && !secondToggle) {
      return toggle;
    }

    const labelGap =
      size === "small" || size === "extraSmall" ? "0.5rem" : "0.625rem";

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: labelGap,
        }}
      >
        {label != null && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: "var(--font-weight-normal)",
              color: "var(--text-neutral-primary)",
              whiteSpace: "nowrap",
              ...labelType(size),
            }}
          >
            {label}
          </span>
        )}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.125rem",
          }}
        >
          {toggle}
          {secondToggle ? (
            <ToggleButton
              size={size}
              color={secondToggle.color ?? color}
              iconName={secondToggle.iconName}
              pressed={secondPressed}
              defaultPressed={
                useExclusivePair ? undefined : secondToggle.defaultPressed
              }
              onPressedChange={handleSecondChange}
              disabled={secondToggle.disabled}
              aria-label={secondToggle["aria-label"]}
            />
          ) : null}
        </div>
      </div>
    );
  },
);
