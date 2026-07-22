import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import ButtonBase from '@mui/material/ButtonBase';
import { forwardRef, useId, useRef, useState, useEffect } from 'react';
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
    const segmentRefs = useRef([]);
    const controlled = valueProp !== void 0;
    const [uncontrolled, setUncontrolled] = useState(
      defaultValue ?? options.find((option) => !option.disabled)?.value
    );
    const value = controlled ? valueProp : uncontrolled;
    const selectValue = (next) => {
      if (!controlled) setUncontrolled(next);
      onChange?.(next);
    };
    const focusableIndexes = options.map(
      (option, index) => disabled || option.disabled ? -1 : index
    ).filter((index) => index >= 0);
    const selectedFocusableIndex = focusableIndexes.find((index) => options[index]?.value === value) ?? focusableIndexes[0] ?? -1;
    const [focusedIndex, setFocusedIndex] = useState(selectedFocusableIndex);
    const tabStopIndex = focusableIndexes.includes(focusedIndex) ? focusedIndex : selectedFocusableIndex;
    useEffect(() => {
      setFocusedIndex(selectedFocusableIndex);
    }, [selectedFocusableIndex]);
    const focusSegment = (index) => {
      setFocusedIndex(index);
      segmentRefs.current[index]?.focus();
    };
    const moveFocus = (fromIndex, delta) => {
      if (focusableIndexes.length === 0) return;
      const currentPos = focusableIndexes.indexOf(fromIndex);
      const start = currentPos === -1 ? 0 : currentPos;
      const nextPos = (start + delta + focusableIndexes.length) % focusableIndexes.length;
      focusSegment(focusableIndexes[nextPos]);
    };
    const activateSegment = (index) => {
      const option = options[index];
      if (!option || disabled || option.disabled) return;
      setFocusedIndex(index);
      selectValue(option.value);
    };
    const onSegmentKeyDown = (event, index) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          moveFocus(index, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          moveFocus(index, -1);
          break;
        case "Home": {
          event.preventDefault();
          const first = focusableIndexes[0];
          if (first === void 0) break;
          focusSegment(first);
          break;
        }
        case "End": {
          event.preventDefault();
          const last = focusableIndexes[focusableIndexes.length - 1];
          if (last === void 0) break;
          focusSegment(last);
          break;
        }
        case " ":
        case "Enter": {
          event.preventDefault();
          activateSegment(index);
          break;
        }
      }
    };
    const onGroupBlur = (event) => {
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      setFocusedIndex(selectedFocusableIndex);
    };
    const unselectedBorder = "var(--border-neutral-secondary)";
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        role: "radiogroup",
        "aria-label": ariaLabel,
        className,
        onBlur: onGroupBlur,
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
          const isDisabled = Boolean(disabled || option.disabled);
          const corners = segmentCorners(index, options.length);
          const startIcon = option.iconName ? /* @__PURE__ */ jsx(FaIcon, { name: option.iconName, fontSize: dims.iconPx }) : null;
          const endIcon = option.endIconName ? /* @__PURE__ */ jsx(FaIcon, { name: option.endIconName, fontSize: dims.iconPx }) : null;
          return /* @__PURE__ */ jsx(
            ButtonBase,
            {
              ref: (node) => {
                segmentRefs.current[index] = node;
              },
              role: "radio",
              "aria-checked": selected,
              id: `${groupId}-${option.value}`,
              tabIndex: index === tabStopIndex ? 0 : -1,
              disabled: isDisabled,
              disableRipple: true,
              onClick: () => {
                if (isDisabled) return;
                activateSegment(index);
              },
              onFocus: () => {
                if (!isDisabled) setFocusedIndex(index);
              },
              onKeyDown: (event) => onSegmentKeyDown(event, index),
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
                  /* Figma uses a 2px border — outline + -2px offset avoids layout shift. */
                  outline: `2px solid ${selected ? "var(--border-focused-inverse)" : "var(--border-focused-primary)"}`,
                  outlineOffset: -2,
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