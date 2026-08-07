import IconButton, {
  type IconButtonProps,
} from "@mui/material/IconButton";
import {
  forwardRef,
  useState,
  type CSSProperties,
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import { ICON_TOGGLE_SIZE } from "../../shared/controlSize";
import styles from "./iconToggle.module.scss";
import type {
  IconToggleColor,
  IconToggleProps,
  IconToggleSize,
} from "./types";

export type {
  IconToggleColor,
  IconToggleProps,
  IconToggleSecondProps,
  IconToggleSize,
} from "./types";

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
        pressIcon: "var(--text-success-primary-fixed)",
        surface: "var(--background-success-light)",
      };
    case "error":
      return {
        on: "var(--text-error-primary-fixed)",
        hoverIcon: "var(--text-error-primary-fixed)",
        pressIcon: "var(--text-error-primary-fixed)",
        surface: "var(--background-error-light)",
      };
    case "brand":
    default:
      return {
        on: "var(--text-brand-primary-fixed)",
        hoverIcon: "var(--text-brand-primary-fixed)",
        pressIcon: "var(--text-brand-primary-fixed)",
        surface: "var(--background-brand-light)",
      };
  }
}

function labelType(size: IconToggleSize) {
  switch (size) {
    case "large":
      return {
        "--it-label-font-size": "var(--text-body-lg)",
        "--it-label-line-height": "var(--leading-body-lg)",
      };
    case "small":
      return {
        "--it-label-font-size": "var(--text-body-sm)",
        "--it-label-line-height": "var(--leading-body-sm)",
      };
    case "extraSmall":
      return {
        "--it-label-font-size": "var(--text-body-xs)",
        "--it-label-line-height": "var(--leading-body-xs)",
      };
    case "medium":
    default:
      return {
        "--it-label-font-size": "var(--text-body-md)",
        "--it-label-line-height": "var(--leading-body-md)",
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
  style?: CSSProperties;
} & Omit<
  IconButtonProps,
  | "color"
  | "size"
  | "children"
  | "sx"
  | "onClick"
  | "style"
  | "disabled"
  | "aria-label"
>;

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
      style,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const controlled = pressed !== undefined;
    const [uncontrolled, setUncontrolled] = useState(defaultPressed ?? false);
    const isOn = controlled ? Boolean(pressed) : uncontrolled;
    const dims = ICON_TOGGLE_SIZE[size];
    const recipe = colorRecipe(color);
    const offIcon =
      color === "primary"
        ? "var(--text-neutral-primary)"
        : "var(--text-neutral-quaternary)";

    // Recipe tokens only — do not set --it-icon-color inline (blocks SCSS
    // :hover/:active overrides the same way Toggle's inline bg did).
    const vars = {
      "--it-size": dims.size,
      "--it-padding": dims.padding,
      "--it-icon-slot": dims.iconSlot,
      "--it-icon-off": offIcon,
      "--it-icon-on": recipe.on,
      "--it-hover-icon": recipe.hoverIcon,
      "--it-press-icon": recipe.pressIcon,
      "--it-surface": recipe.surface,
      ...style,
    } as CSSProperties;

    return (
      <IconButton
        ref={ref}
        disableRipple
        disabled={disabled}
        aria-pressed={isOn}
        aria-label={ariaLabel}
        data-cads-press=""
        className={styles.button}
        style={vars}
        sx={sx}
        {...rest}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) {
            const next = !isOn;
            if (!controlled) setUncontrolled(next);
            onPressedChange?.(next);
          }
        }}
      >
        <FaIcon
          name={iconName}
          family={isOn ? "solid" : "regular"}
          fontSize={dims.iconPx}
          className={styles.icon}
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
    const labelVars = {
      "--it-label-gap": labelGap,
      ...labelType(size),
    } as CSSProperties;

    return (
      <div className={styles.labelRow} style={labelVars}>
        {label != null && (
          <span className={styles.label}>{label}</span>
        )}
        <div className={styles.togglePair}>
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
