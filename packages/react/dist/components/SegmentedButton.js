import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import ButtonBase from '@mui/material/ButtonBase';
import { forwardRef, useId, useState } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { SEGMENTED_SIZE, TRANSITION_COLORS } from '../shared/controlSize.js';

function segmentCorners(index, count) {
  const r = "var(--radius-sm)";
  const isFirst = index === 0;
  const isLast = index === count - 1;
  if (isFirst && isLast) {
    return {
      borderTopLeftRadius: r,
      borderTopRightRadius: r,
      borderBottomLeftRadius: r,
      borderBottomRightRadius: r
    };
  }
  if (isFirst) {
    return {
      borderTopLeftRadius: r,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: r,
      borderBottomRightRadius: 0
    };
  }
  if (isLast) {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: r,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: r
    };
  }
  return {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  };
}
const SegmentedButton = forwardRef(
  function SegmentedButton2({
    size = "medium",
    value: valueProp,
    defaultValue,
    onChange,
    options,
    disabled,
    iconOnly = false,
    "aria-label": ariaLabel,
    className
  }, ref) {
    const dims = SEGMENTED_SIZE[size];
    const groupId = useId();
    const controlled = valueProp !== void 0;
    const [uncontrolled, setUncontrolled] = useState(
      defaultValue ?? options[0]?.value
    );
    const value = controlled ? valueProp : uncontrolled;
    const unselectedBorder = "var(--border-neutral-secondary)";
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        role: "radiogroup",
        "aria-label": ariaLabel,
        className,
        style: {
          display: "inline-flex",
          alignItems: "stretch",
          /* Figma Group itemSpacing: -1 — collapse shared borders */
          gap: 0,
          overflow: "hidden",
          borderRadius: "var(--radius-sm)"
        },
        children: options.map((option, index) => {
          const selected = option.value === value;
          const isDisabled = disabled || option.disabled;
          const corners = segmentCorners(index, options.length);
          const startIcon = option.iconName ? /* @__PURE__ */ jsx(FaIcon, { name: option.iconName, fontSize: dims.iconPx }) : null;
          const endIcon = option.endIconName ? /* @__PURE__ */ jsx(FaIcon, { name: option.endIconName, fontSize: dims.iconPx }) : null;
          return /* @__PURE__ */ jsx(
            ButtonBase,
            {
              role: "radio",
              "aria-checked": selected,
              id: `${groupId}-${option.value}`,
              disabled: isDisabled,
              disableRipple: true,
              onClick: () => {
                if (!controlled) setUncontrolled(option.value);
                onChange?.(option.value);
              },
              sx: {
                flex: iconOnly ? "0 0 auto" : "1 1 auto",
                minWidth: dims.height,
                width: iconOnly ? dims.height : void 0,
                height: dims.height,
                paddingInline: iconOnly ? dims.iconOnlyPadding : dims.paddingInline,
                paddingBlock: iconOnly ? dims.iconOnlyPadding : dims.paddingBlock,
                gap: iconOnly ? 0 : dims.gap,
                boxSizing: "border-box",
                /* Overlap so adjacent 1px borders share a single hairline */
                marginLeft: index === 0 ? 0 : "-1px",
                border: `1px solid ${selected ? "var(--border-selected-primary)" : unselectedBorder}`,
                ...corners,
                fontFamily: "var(--font-body)",
                /* Figma Body Semi Bold at every size — no labelStyle prop */
                fontWeight: "var(--font-weight-semibold)",
                fontSize: dims.fontSize,
                lineHeight: dims.lineHeight,
                textTransform: "none",
                whiteSpace: "nowrap",
                transition: TRANSITION_COLORS,
                backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
                color: selected ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
                zIndex: selected ? 1 : 0,
                "&:hover": {
                  zIndex: 2,
                  /* Selected hover: fill stays primary; border strengthens (Figma). */
                  backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-neutral-tertiary)",
                  borderColor: selected ? "var(--border-selected-strong)" : unselectedBorder
                },
                "&:active": {
                  zIndex: 2,
                  backgroundColor: selected ? "var(--background-selected-strong)" : "var(--background-neutral-tertiary)",
                  borderColor: selected ? "var(--border-selected-strong)" : unselectedBorder
                },
                "&.Mui-focusVisible": {
                  zIndex: 3,
                  borderWidth: 2,
                  borderColor: selected ? "var(--border-focused-inverse)" : "var(--border-focused-primary)",
                  backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-brand-light)"
                },
                "&.Mui-disabled": {
                  opacity: 1,
                  /* Unselected disabled: transparent fill + disabled chrome.
                     Selected disabled: keep selected fill/border/text (Figma). */
                  ...selected ? {
                    backgroundColor: "var(--background-selected-primary)",
                    borderColor: "var(--border-selected-primary)",
                    color: "var(--text-selected-primary)"
                  } : {
                    backgroundColor: "transparent",
                    borderColor: "var(--border-disabled-neutral)",
                    color: "var(--text-disabled-neutral)"
                  }
                }
              },
              children: iconOnly ? startIcon || endIcon : /* @__PURE__ */ jsxs(Fragment, { children: [
                startIcon,
                option.label,
                endIcon
              ] })
            },
            option.value
          );
        })
      }
    );
  }
);

export { SegmentedButton };
//# sourceMappingURL=SegmentedButton.js.map
//# sourceMappingURL=SegmentedButton.js.map