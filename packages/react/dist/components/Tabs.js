import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import ButtonBase from '@mui/material/ButtonBase';
import { forwardRef, useId, useRef, useState, useEffect } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { TABS_SIZE, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';
import { CloseIconButton } from './CloseIconButton.js';

function resolveIconName(name) {
  if (!name) return void 0;
  if (name === "smile") return "face-smile";
  if (name === "close") return "xmark";
  return name;
}
const Tabs = forwardRef(function Tabs2({
  type = "primary",
  size = "medium",
  items,
  value: valueProp,
  defaultValue,
  onChange,
  onItemDismiss,
  "aria-label": ariaLabel,
  className
}, ref) {
  const dims = TABS_SIZE[size];
  const groupId = useId();
  const tabRefs = useRef([]);
  const controlled = valueProp !== void 0;
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.value
  );
  const value = controlled ? valueProp : uncontrolled;
  const isSecondary = type === "secondary";
  const selectValue = (next) => {
    if (!controlled) setUncontrolled(next);
    onChange?.(next);
  };
  const focusableIndexes = items.map((item, index) => item.disabled ? -1 : index).filter((index) => index >= 0);
  const selectedFocusableIndex = focusableIndexes.find((index) => items[index]?.value === value) ?? focusableIndexes[0] ?? -1;
  const [focusedIndex, setFocusedIndex] = useState(selectedFocusableIndex);
  const tabStopIndex = focusableIndexes.includes(focusedIndex) ? focusedIndex : selectedFocusableIndex;
  useEffect(() => {
    setFocusedIndex(selectedFocusableIndex);
  }, [selectedFocusableIndex]);
  const focusTab = (index) => {
    setFocusedIndex(index);
    tabRefs.current[index]?.focus();
  };
  const moveFocus = (fromIndex, delta) => {
    if (focusableIndexes.length === 0) return;
    const currentPos = focusableIndexes.indexOf(fromIndex);
    const start = currentPos === -1 ? 0 : currentPos;
    const nextPos = (start + delta + focusableIndexes.length) % focusableIndexes.length;
    focusTab(focusableIndexes[nextPos]);
  };
  const activateTab = (index) => {
    const item = items[index];
    if (!item || item.disabled) return;
    setFocusedIndex(index);
    selectValue(item.value);
  };
  const onTabKeyDown = (event, index) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveFocus(index, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(index, -1);
        break;
      case "Home": {
        event.preventDefault();
        const first = focusableIndexes[0];
        if (first === void 0) break;
        focusTab(first);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = focusableIndexes[focusableIndexes.length - 1];
        if (last === void 0) break;
        focusTab(last);
        break;
      }
      case " ":
      case "Enter": {
        event.preventDefault();
        activateTab(index);
        break;
      }
    }
  };
  const onTablistBlur = (event) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setFocusedIndex(selectedFocusableIndex);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: "tablist",
      "aria-label": ariaLabel,
      className,
      onBlur: onTablistBlur,
      style: {
        display: "flex",
        alignItems: isSecondary ? "flex-end" : "stretch",
        gap: isSecondary ? dims.secondaryGroupGap : dims.primaryGroupGap,
        borderBottom: "1px solid var(--border-neutral-primary)",
        boxSizing: "border-box"
      },
      children: items.map((item, index) => {
        const selected = item.value === value;
        const disabled = Boolean(item.disabled);
        const iconOnly = Boolean(item.iconOnly);
        const startName = resolveIconName(item.startIconName);
        const endName = resolveIconName(item.endIconName);
        const iconPx = isSecondary ? dims.secondaryIconPx : dims.primaryIconPx;
        const tabId = `${groupId}-tab-${item.value}`;
        const labelId = `${groupId}-label-${item.value}`;
        const startIcon = startName && (iconOnly || item.startIconName) ? /* @__PURE__ */ jsx(FaIcon, { name: startName, family: "solid", fontSize: iconPx }) : null;
        const endIcon = !iconOnly && endName ? /* @__PURE__ */ jsx(FaIcon, { name: endName, family: "solid", fontSize: iconPx }) : null;
        const accessibleName = item["aria-label"] ?? (typeof item.label === "string" ? item.label : void 0);
        return /* @__PURE__ */ jsxs(
          ButtonBase,
          {
            ref: (node) => {
              tabRefs.current[index] = node;
            },
            component: "div",
            id: tabId,
            role: "tab",
            "aria-selected": selected,
            "aria-disabled": disabled || void 0,
            "aria-label": iconOnly ? accessibleName : void 0,
            "aria-labelledby": !iconOnly ? labelId : void 0,
            tabIndex: index === tabStopIndex ? 0 : -1,
            disabled,
            disableRipple: true,
            onClick: () => {
              if (disabled) return;
              activateTab(index);
            },
            onFocus: () => {
              if (!disabled) setFocusedIndex(index);
            },
            onKeyDown: (event) => onTabKeyDown(event, index),
            sx: {
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              flex: "0 0 auto",
              height: isSecondary ? dims.secondaryHeight : dims.primaryHeight,
              minWidth: iconOnly ? isSecondary ? dims.secondaryIconOnlyMinWidth : void 0 : void 0,
              gap: isSecondary ? dims.secondaryItemGap : dims.primaryItemGap,
              paddingInline: iconOnly ? isSecondary ? dims.secondaryIconOnlyPadX : dims.primaryIconOnlyPadX : isSecondary ? dims.secondaryPadX : 0,
              paddingBlock: isSecondary ? 0 : dims.primaryPadY,
              marginBottom: "-1px",
              fontFamily: "var(--font-body)",
              fontWeight: "var(--font-weight-semibold)",
              fontSize: isSecondary ? dims.secondaryFontSize : dims.primaryFontSize,
              lineHeight: isSecondary ? dims.secondaryLineHeight : dims.primaryLineHeight,
              textTransform: "none",
              whiteSpace: "nowrap",
              transition: TRANSITION_COLORS,
              overflow: isSecondary ? "hidden" : "visible",
              borderRadius: isSecondary ? "var(--radius-sm) var(--radius-sm) 0 0" : 0,
              /* Primary underline / secondary chrome */
              ...isSecondary ? selected ? {
                backgroundColor: "var(--background-neutral-primary)",
                borderTop: "1px solid var(--border-neutral-primary)",
                borderLeft: "1px solid var(--border-neutral-primary)",
                borderRight: "1px solid var(--border-neutral-primary)",
                borderBottom: "none",
                color: "var(--text-selected-primary-inverse)"
              } : {
                backgroundColor: "var(--background-neutral-secondary)",
                border: "1px solid var(--border-neutral-primary)",
                color: "var(--text-neutral-quaternary)"
              } : selected ? {
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "2px solid var(--border-selected-primary)",
                color: "var(--text-selected-primary-inverse)"
              } : {
                backgroundColor: "transparent",
                border: "none",
                borderBottom: "2px solid transparent",
                color: "var(--text-neutral-quaternary)"
              },
              "&:hover": disabled ? void 0 : isSecondary ? selected ? {
                backgroundColor: "var(--background-neutral-primary)",
                color: "var(--text-selected-primary-inverse)"
              } : {
                backgroundColor: "var(--background-neutral-tertiary)",
                color: "var(--text-neutral-primary)"
              } : selected ? {
                borderBottomColor: "var(--border-selected-strong)",
                color: "var(--text-selected-primary-inverse)"
              } : {
                color: "var(--text-neutral-primary)"
              },
              "&:active": disabled ? void 0 : isSecondary ? {
                backgroundColor: "var(--background-neutral-primary)",
                borderTop: "1px solid var(--border-neutral-primary)",
                borderLeft: "1px solid var(--border-neutral-primary)",
                borderRight: "1px solid var(--border-neutral-primary)",
                borderBottom: "none",
                color: "var(--text-selected-primary-inverse)"
              } : {
                color: "var(--text-selected-primary-inverse)"
              },
              "&.Mui-focusVisible": {
                zIndex: 1,
                boxShadow: FOCUS_RING
              },
              "&.Mui-disabled": {
                opacity: 1,
                cursor: "not-allowed",
                ...isSecondary ? {
                  backgroundColor: "var(--background-neutral-primary)",
                  border: "1px solid var(--border-disabled-neutral)",
                  color: "var(--text-disabled-neutral)"
                } : {
                  backgroundColor: "transparent",
                  borderBottom: "2px solid transparent",
                  color: "var(--text-disabled-neutral)"
                }
              }
            },
            children: [
              iconOnly ? startIcon : /* @__PURE__ */ jsxs(Fragment, { children: [
                startIcon,
                /* @__PURE__ */ jsx("span", { id: labelId, children: item.label }),
                endIcon
              ] }),
              item.dismissible ? /* @__PURE__ */ jsx(
                CloseIconButton,
                {
                  "aria-label": accessibleName ? `Dismiss ${accessibleName}` : "Dismiss tab",
                  size: size === "large" ? "medium" : size,
                  color: "secondary",
                  disabled,
                  onClick: (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    if (disabled) return;
                    onItemDismiss?.(item.value);
                  }
                }
              ) : null
            ]
          },
          item.value
        );
      })
    }
  );
});

export { Tabs };
//# sourceMappingURL=Tabs.js.map
//# sourceMappingURL=Tabs.js.map