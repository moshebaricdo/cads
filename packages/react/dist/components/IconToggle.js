import { jsx, jsxs } from 'react/jsx-runtime';
import IconButton from '@mui/material/IconButton';
import { forwardRef, useState } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { ICON_TOGGLE_SIZE, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

function colorRecipe(color) {
  switch (color) {
    case "primary":
      return {
        on: "var(--text-neutral-primary)",
        hoverIcon: "var(--text-neutral-primary)",
        pressIcon: "var(--text-neutral-quaternary)",
        surface: "var(--background-neutral-tertiary)"
      };
    case "secondary":
      return {
        on: "var(--text-neutral-quaternary)",
        hoverIcon: "var(--text-neutral-quaternary)",
        pressIcon: "var(--text-neutral-secondary)",
        surface: "var(--background-neutral-tertiary)"
      };
    case "success":
      return {
        on: "var(--text-success-primary-fixed)",
        hoverIcon: "var(--text-success-primary-fixed)",
        pressIcon: "var(--text-success-secondary)",
        surface: "var(--background-success-light)"
      };
    case "error":
      return {
        on: "var(--text-error-primary-fixed)",
        hoverIcon: "var(--text-error-primary-fixed)",
        pressIcon: "var(--text-error-secondary)",
        surface: "var(--background-error-light)"
      };
    case "brand":
    default:
      return {
        on: "var(--text-brand-primary-fixed)",
        hoverIcon: "var(--text-brand-primary-fixed)",
        pressIcon: "var(--text-brand-secondary)",
        surface: "var(--background-brand-light)"
      };
  }
}
function labelType(size) {
  switch (size) {
    case "large":
      return {
        fontSize: "var(--text-body-lg)",
        lineHeight: "var(--leading-body-lg)"
      };
    case "small":
      return {
        fontSize: "var(--text-body-sm)",
        lineHeight: "var(--leading-body-sm)"
      };
    case "extraSmall":
      return {
        fontSize: "var(--text-body-xs)",
        lineHeight: "var(--leading-body-xs)"
      };
    case "medium":
    default:
      return {
        fontSize: "var(--text-body-md)",
        lineHeight: "var(--leading-body-md)"
      };
  }
}
const ToggleButton = forwardRef(
  function ToggleButton2({
    size,
    color,
    iconName,
    pressed,
    defaultPressed,
    onPressedChange,
    disabled,
    sx,
    onClick,
    "aria-label": ariaLabel
  }, ref) {
    const controlled = pressed !== void 0;
    const [uncontrolled, setUncontrolled] = useState(defaultPressed ?? false);
    const isOn = controlled ? Boolean(pressed) : uncontrolled;
    const dims = ICON_TOGGLE_SIZE[size];
    const recipe = colorRecipe(color);
    const offIcon = "var(--text-neutral-quaternary)";
    const disabledIcon = "var(--text-disabled-neutral)";
    return /* @__PURE__ */ jsx(
      IconButton,
      {
        ref,
        disableRipple: true,
        disabled,
        "aria-pressed": isOn,
        "aria-label": ariaLabel,
        onClick: (e) => {
          onClick?.(e);
          if (!e.defaultPrevented) {
            const next = !isOn;
            if (!controlled) setUncontrolled(next);
            onPressedChange?.(next);
          }
        },
        sx: {
          width: dims.size,
          height: dims.size,
          padding: dims.padding,
          borderRadius: "var(--radius-sm)",
          color: "inherit",
          backgroundColor: "transparent",
          transition: TRANSITION_COLORS,
          // Icon color driven by CSS var so hover/press recipes apply.
          ["--cads-icon-toggle-icon"]: isOn ? recipe.on : offIcon,
          "&:hover": {
            backgroundColor: recipe.surface,
            ["--cads-icon-toggle-icon"]: recipe.hoverIcon
          },
          "&:active": {
            backgroundColor: recipe.surface,
            ["--cads-icon-toggle-icon"]: recipe.pressIcon
          },
          "&.Mui-focusVisible": {
            backgroundColor: "transparent",
            boxShadow: FOCUS_RING
          },
          "&.Mui-disabled": {
            opacity: 1,
            ["--cads-icon-toggle-icon"]: disabledIcon
          },
          ...sx ?? {}
        },
        children: /* @__PURE__ */ jsx(
          FaIcon,
          {
            name: iconName,
            family: isOn ? "solid" : "regular",
            fontSize: dims.iconPx,
            style: {
              width: dims.iconSlot,
              color: "var(--cads-icon-toggle-icon)",
              transition: TRANSITION_COLORS
            }
          }
        )
      }
    );
  }
);
const IconToggle = forwardRef(
  function IconToggle2({
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
  }, ref) {
    const firstControlled = pressed !== void 0;
    const secondControlled = secondToggle?.pressed !== void 0;
    const useExclusivePair = Boolean(exclusive && secondToggle) && !firstControlled && !secondControlled;
    const [pair, setPair] = useState({
      first: defaultPressed ?? false,
      second: secondToggle?.defaultPressed ?? false
    });
    const handleFirstChange = (next) => {
      if (useExclusivePair) {
        setPair((prev) => ({
          first: next,
          second: next ? false : prev.second
        }));
      } else if (exclusive && secondToggle && next) {
        secondToggle.onPressedChange?.(false);
      }
      onPressedChange?.(next);
    };
    const handleSecondChange = (next) => {
      if (useExclusivePair) {
        setPair((prev) => ({
          first: next ? false : prev.first,
          second: next
        }));
      } else if (exclusive && next) {
        onPressedChange?.(false);
      }
      secondToggle?.onPressedChange?.(next);
    };
    const firstPressed = useExclusivePair ? pair.first : pressed;
    const secondPressed = useExclusivePair ? pair.second : secondToggle?.pressed;
    const toggle = /* @__PURE__ */ jsx(
      ToggleButton,
      {
        ref,
        size,
        color,
        iconName,
        pressed: firstPressed,
        defaultPressed: useExclusivePair ? void 0 : defaultPressed,
        onPressedChange: handleFirstChange,
        ...rest
      }
    );
    if (label == null && !secondToggle) {
      return toggle;
    }
    const labelGap = size === "small" || size === "extraSmall" ? "0.5rem" : "0.625rem";
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: labelGap
        },
        children: [
          label != null && /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                fontFamily: "var(--font-body)",
                fontWeight: "var(--font-weight-normal)",
                color: "var(--text-neutral-primary)",
                whiteSpace: "nowrap",
                ...labelType(size)
              },
              children: label
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "0.125rem"
              },
              children: [
                toggle,
                secondToggle ? /* @__PURE__ */ jsx(
                  ToggleButton,
                  {
                    size,
                    color: secondToggle.color ?? color,
                    iconName: secondToggle.iconName,
                    pressed: secondPressed,
                    defaultPressed: useExclusivePair ? void 0 : secondToggle.defaultPressed,
                    onPressedChange: handleSecondChange,
                    disabled: secondToggle.disabled,
                    "aria-label": secondToggle["aria-label"]
                  }
                ) : null
              ]
            }
          )
        ]
      }
    );
  }
);

export { IconToggle };
//# sourceMappingURL=IconToggle.js.map
//# sourceMappingURL=IconToggle.js.map