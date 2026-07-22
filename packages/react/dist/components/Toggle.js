import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import ButtonBase from '@mui/material/ButtonBase';
import { forwardRef, useId, useState } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { TOGGLE_SIZE, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

const HANDLE_MOTION = "left var(--duration-medium) var(--easing-emphasized), background-color var(--duration-short) var(--easing-standard)";
const ICON_MOTION = "opacity var(--duration-short) var(--easing-standard)";
const Toggle = forwardRef(
  function Toggle2({
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
  }, ref) {
    const autoId = useId();
    const id = idProp ?? autoId;
    const labelId = `${id}-label`;
    const dims = TOGGLE_SIZE[size];
    const controlled = checked !== void 0;
    const [uncontrolled, setUncontrolled] = useState(defaultChecked);
    const isOn = controlled ? Boolean(checked) : uncontrolled;
    const handleClick = (event) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) return;
      const next = !isOn;
      if (!controlled) setUncontrolled(next);
      onChange?.(event, next);
    };
    const trackBg = disabled ? "var(--background-disabled-neutral)" : isOn ? "var(--background-selected-primary)" : "var(--background-neutral-septenary)";
    const handleBg = disabled ? "var(--background-neutral-primary)" : isOn ? "var(--background-selected-primary-inverse)" : "var(--background-neutral-primary)";
    const iconColor = disabled ? "var(--text-disabled-neutral-inverse)" : isOn ? "var(--text-selected-primary)" : "var(--text-neutral-primary-inverse)";
    const control = /* @__PURE__ */ jsxs(
      ButtonBase,
      {
        ...rest,
        ref,
        id,
        type: "button",
        role: "switch",
        disabled,
        "aria-checked": isOn,
        "aria-label": label == null ? ariaLabel : void 0,
        "aria-labelledby": label != null ? labelId : void 0,
        onClick: handleClick,
        disableRipple: true,
        focusRipple: false,
        sx: {
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
            backgroundColor: isOn ? "var(--background-selected-strong)" : "var(--background-neutral-octonary)"
          },
          "&:active:not(.Mui-disabled)": {
            backgroundColor: isOn ? "var(--background-selected-strong)" : "var(--background-neutral-octonary)",
            ...isOn ? {
              boxShadow: "inset 0 0 0 2px var(--border-selected-strong)"
            } : {}
          },
          "&.Mui-focusVisible, &:focus-visible": {
            boxShadow: FOCUS_RING
          },
          "&.Mui-focusVisible:active:not(.Mui-disabled), &:focus-visible:active:not(.Mui-disabled)": isOn ? {
            boxShadow: `${FOCUS_RING}, inset 0 0 0 2px var(--border-selected-strong)`
          } : {
            boxShadow: FOCUS_RING
          },
          ...sx ?? {}
        },
        children: [
          hasIcons ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": true,
                style: {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: dims.iconInsetLeft,
                  width: `calc(100% - ${dims.iconInsetLeft} - ${dims.iconGap} - ${dims.handle} - ${dims.pad})`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  color: "inherit",
                  opacity: isOn ? 1 : 0,
                  transition: ICON_MOTION,
                  pointerEvents: "none"
                },
                children: /* @__PURE__ */ jsx(FaIcon, { name: onIcon, family: "solid", fontSize: dims.iconPx })
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                "aria-hidden": true,
                style: {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: dims.iconInsetRight,
                  width: `calc(100% - ${dims.iconInsetRight} - ${dims.iconGap} - ${dims.handle} - ${dims.pad})`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  color: "inherit",
                  opacity: isOn ? 0 : 1,
                  transition: ICON_MOTION,
                  pointerEvents: "none"
                },
                children: /* @__PURE__ */ jsx(FaIcon, { name: offIcon, family: "solid", fontSize: dims.iconPx })
              }
            )
          ] }) : null,
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": true,
              style: {
                position: "absolute",
                top: dims.pad,
                left: isOn ? `calc(100% - ${dims.handle} - ${dims.pad})` : dims.pad,
                boxSizing: "border-box",
                width: dims.handle,
                height: dims.handle,
                borderRadius: "var(--radius-round)",
                backgroundColor: handleBg,
                transition: HANDLE_MOTION,
                pointerEvents: "none"
              }
            }
          )
        ]
      }
    );
    if (label == null) return control;
    const labelEl = /* @__PURE__ */ jsx(
      "span",
      {
        id: labelId,
        style: {
          fontFamily: "var(--font-body)",
          fontWeight: 400,
          fontSize: dims.fontSize,
          lineHeight: dims.lineHeight,
          color: "var(--text-neutral-primary)",
          whiteSpace: "nowrap"
        },
        children: label
      }
    );
    return /* @__PURE__ */ jsxs(
      "label",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: dims.labelGap,
          cursor: disabled ? "not-allowed" : "pointer"
        },
        children: [
          labelPlacement === "left" ? labelEl : null,
          control,
          labelPlacement === "right" ? labelEl : null
        ]
      }
    );
  }
);

export { Toggle };
//# sourceMappingURL=Toggle.js.map
//# sourceMappingURL=Toggle.js.map