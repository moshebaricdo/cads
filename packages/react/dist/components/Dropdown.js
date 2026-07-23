import { jsx, jsxs } from 'react/jsx-runtime';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { forwardRef, useId, useState, useRef, useCallback, useLayoutEffect, useMemo, useEffect } from 'react';
import { Button } from './Button.js';
import { FieldWrapper } from './FieldWrapper.js';
import { FaIcon } from '../icons/FaIcon.js';
import { FOCUS_RING, TRANSITION_COLORS, TEXT_INPUT_SIZE, BUTTON_SIZE } from '../shared/controlSize.js';

function isItemOption(option) {
  return option.type !== "separator" && option.type !== "group";
}
function isSelectableOption(option) {
  return isItemOption(option) && !option.disabled;
}
function resolveInputWidth(width = "hug") {
  if (width === "hug") {
    return {
      rootWidth: "max-content",
      triggerWidth: "auto",
      maxWidth: "100%"
    };
  }
  if (width === "full") {
    return { rootWidth: "100%", triggerWidth: "100%" };
  }
  const resolved = typeof width === "number" ? `${width}px` : width;
  return {
    rootWidth: resolved,
    triggerWidth: "100%",
    maxWidth: "100%"
  };
}
function placementToPopper(placement) {
  switch (placement) {
    case "bottomRight":
      return "bottom-end";
    case "topLeft":
      return "top-start";
    case "topRight":
      return "top-end";
    case "bottomLeft":
    default:
      return "bottom-start";
  }
}
function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}
const MENU_ITEM_SIZE = {
  large: {
    paddingLeft: "1rem",
    // 16
    paddingRight: "1.375rem",
    // 22
    paddingBlock: "0.625rem",
    // 10
    gap: "0.75rem",
    // 12
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconSlot: "1.75rem",
    // 28
    iconPx: "1.375rem",
    // 22
    checkbox: 22
  },
  medium: {
    paddingLeft: "0.75rem",
    // 12
    paddingRight: "1rem",
    // 16
    paddingBlock: "0.5rem",
    // 8
    gap: "0.75rem",
    // 12
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconSlot: "1.5rem",
    // 24
    iconPx: "1.1875rem",
    // 19
    checkbox: 20
  },
  small: {
    paddingLeft: "0.625rem",
    // 10
    paddingRight: "0.875rem",
    // 14
    paddingBlock: "0.3125rem",
    // 5
    gap: "0.5rem",
    // 8
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconSlot: "1.25rem",
    // 20
    iconPx: "1rem",
    // 16
    checkbox: 18
  },
  extraSmall: {
    paddingLeft: "0.5rem",
    // 8
    paddingRight: "0.625rem",
    // 10
    paddingBlock: "0.125rem",
    // 2
    gap: "0.25rem",
    // 4
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconSlot: "1rem",
    // 16
    iconPx: "0.8125rem",
    // 13
    checkbox: 16
  }
};
const MENU_GROUP_SIZE = {
  large: {
    height: 32,
    paddingLeft: "1rem",
    paddingRight: "1.375rem",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)"
  },
  medium: {
    height: 28,
    paddingLeft: "0.75rem",
    paddingRight: "1rem",
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)"
  },
  small: {
    height: 24,
    paddingLeft: "0.625rem",
    paddingRight: "0.875rem",
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)"
  },
  extraSmall: {
    height: 20,
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem",
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)"
  }
};
const MENU_SEPARATOR_HEIGHT = 8;
function triggerBorder(color, error, disabled, readOnly) {
  if (disabled) return "var(--border-disabled-neutral)";
  if (error) return "var(--border-error-primary)";
  if (readOnly) return "var(--border-neutral-secondary)";
  return color === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
function TriggerLabel({
  label,
  hugCandidates
}) {
  const visible = /* @__PURE__ */ jsx(
    "span",
    {
      style: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minWidth: 0
      },
      children: label
    }
  );
  if (!hugCandidates?.length) return visible;
  return /* @__PURE__ */ jsxs(
    "span",
    {
      style: {
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "stretch",
        minWidth: 0
      },
      children: [
        hugCandidates.map((candidate, index) => /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            style: {
              gridArea: "1 / 1",
              visibility: "hidden",
              whiteSpace: "nowrap",
              pointerEvents: "none"
            },
            children: candidate
          },
          index
        )),
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              gridArea: "1 / 1",
              minWidth: 0,
              maxWidth: "100%",
              display: "block"
            },
            children: visible
          }
        )
      ]
    }
  );
}
function DropdownButtonTrigger({
  size,
  color,
  labelStyle,
  label,
  hugCandidates,
  startIconName,
  open,
  disabled,
  readOnly,
  error,
  required,
  onClick,
  buttonRef,
  id,
  listedBy,
  ariaLabel,
  triggerWidth
}) {
  const dims = TEXT_INPUT_SIZE[size];
  const iconDims = BUTTON_SIZE[size];
  const border = triggerBorder(color, error, disabled, readOnly);
  const hug = Boolean(hugCandidates?.length);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref: buttonRef,
      type: "button",
      id,
      disabled: disabled || readOnly,
      "aria-haspopup": listedBy ? "listbox" : "menu",
      "aria-expanded": open,
      "aria-controls": listedBy,
      "aria-required": required || void 0,
      "aria-label": ariaLabel,
      onClick,
      "data-cads-dropdown-trigger": "input",
      className: "cads-dropdown-trigger",
      style: {
        boxSizing: "border-box",
        width: triggerWidth,
        minWidth: hug ? "max-content" : void 0,
        height: dims.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: iconDims.gap,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${border}`,
        backgroundColor: readOnly ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
        color: disabled ? "var(--text-disabled-neutral)" : readOnly ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
        fontFamily: "var(--font-body)",
        fontWeight: labelStyle === "thin" ? 400 : 600,
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        cursor: disabled || readOnly ? "default" : "pointer",
        transition: TRANSITION_COLORS,
        textAlign: "left"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "span",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: iconDims.gap,
              minWidth: 0,
              paddingRight: 8,
              overflow: hug ? "visible" : "hidden",
              flex: hug ? "0 1 auto" : "1 1 auto"
            },
            children: [
              startIconName ? /* @__PURE__ */ jsx(FaIcon, { name: startIconName, fontSize: iconDims.iconPx }) : null,
              /* @__PURE__ */ jsx(TriggerLabel, { label, hugCandidates })
            ]
          }
        ),
        /* @__PURE__ */ jsx(FaIcon, { name: "chevron-down", fontSize: iconDims.iconPx })
      ]
    }
  );
}
function MenuItemRow({
  option,
  size,
  selected,
  menuType,
  role,
  active,
  keyboardFocus,
  onSelect,
  onHighlight,
  id
}) {
  const dims = MENU_ITEM_SIZE[size];
  const destructive = Boolean(option.destructive) && role === "action";
  const showStartIcon = menuType !== "checklist" && Boolean(option.iconName);
  const textColor = destructive ? "var(--text-error-primary)" : selected ? "var(--text-selected-primary)" : "var(--text-neutral-primary)";
  const bg = selected ? "var(--background-selected-primary)" : "var(--background-neutral-primary)";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      id,
      role: role === "input" ? "option" : "menuitem",
      "aria-selected": role === "input" ? selected : void 0,
      "aria-disabled": option.disabled || void 0,
      "data-cads-dropdown-item": "",
      "data-value": option.value,
      "data-destructive": destructive ? "true" : void 0,
      "data-active": active ? "true" : void 0,
      "data-keyboard-focus": keyboardFocus ? "true" : void 0,
      tabIndex: -1,
      onMouseDown: (e) => {
        e.preventDefault();
      },
      onClick: (e) => {
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) return;
        e.stopPropagation();
        if (!option.disabled) onSelect();
      },
      onMouseEnter: () => {
        if (!option.disabled) onHighlight();
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: showStartIcon || menuType === "checklist" ? dims.gap : 0,
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: dims.paddingLeft,
        paddingRight: dims.paddingRight,
        paddingBlock: dims.paddingBlock,
        backgroundColor: bg,
        color: textColor,
        cursor: option.disabled ? "default" : "pointer",
        opacity: option.disabled ? 0.5 : 1,
        fontFamily: "var(--font-body)",
        fontWeight: 400,
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        transition: TRANSITION_COLORS,
        minWidth: 0
      },
      children: [
        menuType === "checklist" ? /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            style: {
              boxSizing: "border-box",
              width: dims.checkbox,
              height: dims.checkbox,
              borderRadius: "var(--radius-sm)",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: selected ? "var(--background-selected-primary-inverse)" : "var(--background-neutral-primary)",
              border: selected ? "none" : "2px solid var(--border-neutral-solid)",
              color: "var(--text-selected-primary-inverse)"
            },
            children: selected ? /* @__PURE__ */ jsx(
              FaIcon,
              {
                name: "check",
                fontSize: size === "large" ? "0.875rem" : size === "extraSmall" ? "0.625rem" : "0.75rem"
              }
            ) : null
          }
        ) : showStartIcon ? /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            style: {
              width: dims.iconSlot,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: textColor
            },
            children: /* @__PURE__ */ jsx(
              FaIcon,
              {
                name: option.iconName,
                fontSize: dims.iconPx
              }
            )
          }
        ) : null,
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              minWidth: 0,
              flex: "1 1 auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            },
            children: option.label
          }
        )
      ]
    }
  );
}
function MenuSeparatorRow() {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "separator",
      "aria-hidden": true,
      "data-cads-dropdown-separator": "",
      style: {
        boxSizing: "border-box",
        width: "100%",
        height: MENU_SEPARATOR_HEIGHT,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        paddingBlock: 1
      },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            width: "100%",
            height: 1,
            backgroundColor: "var(--border-neutral-primary)"
          }
        }
      )
    }
  );
}
function MenuGroupRow({
  label,
  size
}) {
  const dims = MENU_GROUP_SIZE[size];
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "presentation",
      "data-cads-dropdown-group": "",
      style: {
        boxSizing: "border-box",
        width: "100%",
        height: dims.height,
        display: "flex",
        alignItems: "center",
        paddingLeft: dims.paddingLeft,
        paddingRight: dims.paddingRight,
        backgroundColor: "var(--background-neutral-primary)",
        color: "var(--text-neutral-quaternary)",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        letterSpacing: "var(--tracking-overline)",
        textTransform: "uppercase",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        userSelect: "none",
        pointerEvents: "none"
      },
      children: /* @__PURE__ */ jsx(
        "span",
        {
          style: {
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          },
          children: label
        }
      )
    }
  );
}
const Dropdown = forwardRef(
  function Dropdown2(props, ref) {
    const {
      size = "medium",
      menuType = "default",
      menuPlacement = "bottomLeft",
      options,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className,
      style,
      "aria-label": ariaLabel
    } = props;
    const isInput = props.role === "input";
    const reactId = useId();
    const listId = `cads-dropdown-list-${reactId}`;
    const triggerId = `cads-dropdown-trigger-${reactId}`;
    const [anchorEl, setAnchorEl] = useState(null);
    const anchorRef = useRef(null);
    const setAnchor = useCallback((node) => {
      if (!node) return;
      anchorRef.current = node;
      setAnchorEl((prev) => prev === node ? prev : node);
    }, []);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    useLayoutEffect(() => {
      if (!open) return;
      const node = anchorRef.current ?? document.getElementById(triggerId);
      if (node) setAnchor(node);
    }, [open, triggerId, setAnchor]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [highlightMode, setHighlightMode] = useState(
      "pointer"
    );
    const setOpen = useCallback(
      (next) => {
        if (openProp === void 0) setUncontrolledOpen(next);
        onOpenChange?.(next);
        if (!next) {
          setActiveIndex(-1);
          setHighlightMode("pointer");
        }
      },
      [openProp, onOpenChange]
    );
    const inputProps = isInput ? props : null;
    const isChecklist = isInput && (menuType === "checklist" || inputProps?.menuType === "checklist");
    const [uncontrolledValue, setUncontrolledValue] = useState(
      () => asArray(inputProps?.defaultValue)
    );
    const selectedValues = inputProps?.value !== void 0 ? asArray(inputProps.value) : uncontrolledValue;
    const selectedSet = useMemo(
      () => new Set(selectedValues),
      [selectedValues]
    );
    const itemOptions = useMemo(
      () => options.filter(isItemOption),
      [options]
    );
    const displayLabel = useMemo(() => {
      if (!isInput) return props.label ?? "Button";
      const placeholder = inputProps?.placeholder ?? "Dropdown";
      if (selectedValues.length === 0) return placeholder;
      const labels = itemOptions.filter((o) => selectedSet.has(o.value)).map((o) => o.label);
      if (labels.length === 0) return placeholder;
      return labels.length === 1 ? labels[0] : `${labels.length} selected`;
    }, [
      isInput,
      props,
      inputProps?.placeholder,
      selectedValues,
      itemOptions,
      selectedSet
    ]);
    const hugCandidates = useMemo(() => {
      if (!isInput) return void 0;
      const placeholder = inputProps?.placeholder ?? "Dropdown";
      const candidates = [
        placeholder,
        ...itemOptions.map((o) => o.label)
      ];
      if (isChecklist) {
        candidates.push(`${itemOptions.length} selected`);
      }
      return candidates;
    }, [isInput, inputProps?.placeholder, itemOptions, isChecklist]);
    const commitSelection = (next) => {
      if (!inputProps) return;
      if (inputProps.value === void 0) setUncontrolledValue(next);
      inputProps.onChange?.(isChecklist ? next : next[0] ?? "");
    };
    const handleItemSelect = (option) => {
      if (option.disabled) return;
      if (isInput) {
        if (isChecklist) {
          const next = selectedSet.has(option.value) ? selectedValues.filter((v) => v !== option.value) : [...selectedValues, option.value];
          commitSelection(next);
        } else {
          commitSelection([option.value]);
          setOpen(false);
        }
      } else {
        props.onAction?.(option.value);
        setOpen(false);
      }
    };
    const handleSelectAll = () => {
      commitSelection(
        itemOptions.filter((o) => !o.disabled).map((o) => o.value)
      );
    };
    const handleClearAll = () => {
      commitSelection([]);
    };
    const toggleOpen = () => {
      if (disabled) return;
      if (isInput && inputProps?.readOnly) return;
      setOpen(!open);
    };
    useEffect(() => {
      if (!open) {
        setActiveIndex(-1);
        setHighlightMode("pointer");
      }
    }, [open]);
    const highlightKeyboard = (index) => {
      setHighlightMode("keyboard");
      setActiveIndex(index);
    };
    const moveActive = (direction) => {
      setHighlightMode("keyboard");
      setActiveIndex((current) => {
        const start = current < 0 ? direction === 1 ? -1 : 0 : current;
        let next = start;
        for (let step = 0; step < options.length; step++) {
          next = direction === 1 ? (next + 1) % options.length : (next - 1 + options.length) % options.length;
          if (isSelectableOption(options[next])) return next;
        }
        return current;
      });
    };
    const onKeyDown = (event) => {
      if (!open) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpen(true);
          if (event.key === "ArrowUp") {
            for (let i = options.length - 1; i >= 0; i--) {
              if (isSelectableOption(options[i])) {
                highlightKeyboard(i);
                break;
              }
            }
          } else {
            const idx = options.findIndex(isSelectableOption);
            if (idx >= 0) highlightKeyboard(idx);
          }
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        anchorRef.current?.focus();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        const idx = options.findIndex(isSelectableOption);
        if (idx >= 0) highlightKeyboard(idx);
      }
      if (event.key === "End") {
        event.preventDefault();
        for (let i = options.length - 1; i >= 0; i--) {
          if (isSelectableOption(options[i])) {
            highlightKeyboard(i);
            break;
          }
        }
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const opt = activeIndex >= 0 ? options[activeIndex] : void 0;
        if (opt && isItemOption(opt)) handleItemSelect(opt);
      }
    };
    const resolvedMenuType = isInput && (inputProps?.menuType ?? menuType) === "checklist" ? "checklist" : "default";
    const menu = /* @__PURE__ */ jsx(
      Popper,
      {
        open: open && Boolean(anchorEl),
        anchorEl,
        placement: placementToPopper(menuPlacement),
        disablePortal: true,
        style: {
          zIndex: 1400,
          ...isChecklist ? { width: "max-content", minWidth: "max-content" } : null
        },
        modifiers: [
          { name: "offset", options: { offset: [0, 4] } }
        ],
        children: /* @__PURE__ */ jsxs(
          Paper,
          {
            id: listId,
            role: isInput ? "listbox" : "menu",
            "aria-labelledby": triggerId,
            "aria-multiselectable": isChecklist || void 0,
            "data-cads-dropdown-menu": "",
            "data-menu-type": resolvedMenuType,
            elevation: 0,
            onKeyDown,
            sx: {
              mt: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              border: "1px solid var(--border-neutral-primary)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--background-neutral-primary)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              // Checklist (Figma Menu List 971:4280): hug the Action Row so
              // footer labels stay fully visible at every size.
              width: isChecklist ? "max-content" : void 0,
              minWidth: isChecklist ? "max-content" : isInput ? 180 : 120,
              // Icon menus: 4px vertical padding. Checklist: options list owns
              // the vertical padding (pt/pb 4; pb sits above the Action Row).
              py: isChecklist ? 0 : "4px"
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    // Figma Options List: pt/pb 4 on checklist (pb sits above Action Row).
                    paddingTop: isChecklist ? 4 : 0,
                    paddingBottom: isChecklist ? 4 : 0
                  },
                  onMouseLeave: () => {
                    setActiveIndex(-1);
                    setHighlightMode("pointer");
                  },
                  children: options.map((option, index) => {
                    if (option.type === "separator") {
                      return /* @__PURE__ */ jsx(MenuSeparatorRow, {}, `${listId}-sep-${index}`);
                    }
                    if (option.type === "group") {
                      return /* @__PURE__ */ jsx(
                        MenuGroupRow,
                        {
                          label: option.label,
                          size
                        },
                        `${listId}-group-${index}`
                      );
                    }
                    const active = index === activeIndex;
                    return /* @__PURE__ */ jsx(
                      MenuItemRow,
                      {
                        id: `${listId}-opt-${index}`,
                        option,
                        size,
                        selected: selectedSet.has(option.value),
                        menuType: resolvedMenuType,
                        role: props.role,
                        active,
                        keyboardFocus: active && highlightMode === "keyboard",
                        onSelect: () => handleItemSelect(option),
                        onHighlight: () => {
                          setHighlightMode("pointer");
                          setActiveIndex(index);
                        }
                      },
                      option.value
                    );
                  })
                }
              ),
              isChecklist ? /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-cads-dropdown-action-row": "",
                  style: {
                    display: "flex",
                    flexWrap: "nowrap",
                    // Figma Action Row: large = space-between; else gap 4 + start.
                    justifyContent: size === "large" ? "space-between" : "flex-start",
                    alignItems: "flex-start",
                    borderTop: "1px solid var(--border-neutral-primary)",
                    padding: 4,
                    gap: 4,
                    boxSizing: "border-box",
                    width: "100%"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "text",
                        color: "secondary",
                        size,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation();
                          handleSelectAll();
                        },
                        sx: {
                          flex: "0 0 auto",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                          minWidth: "max-content",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        },
                        children: "Select all"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "text",
                        color: "secondary",
                        size,
                        onMouseDown: (e) => e.preventDefault(),
                        onClick: (e) => {
                          e.stopPropagation();
                          handleClearAll();
                        },
                        sx: {
                          flex: "0 0 auto",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                          minWidth: "max-content",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        },
                        children: "Clear all"
                      }
                    )
                  ]
                }
              ) : null
            ]
          }
        )
      }
    );
    const triggerStyles = `
.cads-dropdown-trigger {
  outline: none;
}
.cads-dropdown-trigger:hover:not(:disabled) {
  background-color: var(--background-neutral-tertiary) !important;
}
.cads-dropdown-trigger:focus-visible {
  box-shadow: ${FOCUS_RING};
}
/* When a menu item has keyboard focus, move chrome off the trigger (Figma). */
[data-cads-dropdown]:has([data-keyboard-focus="true"]) .cads-dropdown-trigger:focus-visible,
[data-cads-dropdown]:has([data-keyboard-focus="true"]) .MuiButton-root.Mui-focusVisible {
  box-shadow: none !important;
}
/* Pointer hover \u2014 Figma Menu Item / Dropdown Button state=hover */
[data-cads-dropdown-item]:not([aria-disabled="true"]):not([aria-selected="true"]):not([data-destructive="true"]):not([data-keyboard-focus="true"]):hover {
  background-color: var(--background-neutral-tertiary) !important;
}
[data-cads-dropdown-item]:not([aria-disabled="true"]):not([aria-selected="true"]):not([data-destructive="true"]):active:not([data-keyboard-focus="true"]) {
  background-color: var(--background-neutral-tertiary) !important;
  color: var(--text-neutral-tertiary) !important;
}
[data-cads-dropdown-item][data-destructive="true"]:not([aria-disabled="true"]):not([data-keyboard-focus="true"]):hover {
  background-color: var(--background-error-light) !important;
}
[data-cads-dropdown-item][data-destructive="true"]:not([aria-disabled="true"]):active:not([data-keyboard-focus="true"]) {
  background-color: var(--background-error-primary) !important;
  color: var(--text-neutral-white-fixed) !important;
}
[data-cads-dropdown-item][aria-selected="true"]:not([data-keyboard-focus="true"]):hover {
  background-color: var(--background-selected-strong) !important;
}
/* Keyboard focus \u2014 Figma Menu Item state=focus (2px flush ring, not FOCUS_RING).
   Use outline + negative offset so geometry does not shift like a real border. */
[data-cads-dropdown-item]:not([aria-disabled="true"]):not([aria-selected="true"]):not([data-destructive="true"])[data-keyboard-focus="true"] {
  background-color: var(--background-brand-light) !important;
  outline: 2px solid var(--border-focused-primary);
  outline-offset: -2px;
}
[data-cads-dropdown-item][aria-selected="true"][data-keyboard-focus="true"] {
  background-color: var(--background-selected-primary) !important;
  color: var(--text-selected-primary) !important;
  outline: 2px solid var(--border-selected-primary-inverse);
  outline-offset: -2px;
}
[data-cads-dropdown-item][data-destructive="true"]:not([aria-disabled="true"])[data-keyboard-focus="true"] {
  background-color: var(--background-neutral-primary) !important;
  color: var(--text-error-primary) !important;
  outline: 2px solid var(--border-error-primary);
  outline-offset: -2px;
}
[data-cads-dropdown-action-row] .MuiButton-root {
  white-space: nowrap;
}
`;
    if (isInput) {
      const ip = props;
      const sentiment = ip.error ? "error" : ip.sentiment ?? "default";
      const widthMode = ip.width ?? "hug";
      const fieldWidth = resolveInputWidth(widthMode);
      const isHug = widthMode === "hug";
      return /* @__PURE__ */ jsx(
        ClickAwayListener,
        {
          onClickAway: () => {
            if (open) setOpen(false);
          },
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              ref,
              className,
              style: {
                position: "relative",
                width: fieldWidth.rootWidth,
                maxWidth: fieldWidth.maxWidth,
                ...style
              },
              "data-cads-dropdown": "input",
              "data-width": isHug ? "hug" : widthMode === "full" ? "full" : "fixed",
              onKeyDown,
              children: [
                /* @__PURE__ */ jsx("style", { children: triggerStyles }),
                /* @__PURE__ */ jsx(
                  FieldWrapper,
                  {
                    size,
                    sentiment,
                    label: ip.label,
                    required: ip.required,
                    helperText: ip.helperText,
                    helperIconName: ip.helperIconName,
                    showHelper: ip.showHelper,
                    htmlFor: triggerId,
                    disabled,
                    children: /* @__PURE__ */ jsx(
                      DropdownButtonTrigger,
                      {
                        size,
                        color: ip.color ?? "primary",
                        labelStyle: ip.labelStyle ?? "thick",
                        label: displayLabel,
                        hugCandidates: isHug ? hugCandidates : void 0,
                        startIconName: ip.startIconName,
                        open,
                        disabled,
                        readOnly: Boolean(ip.readOnly),
                        error: Boolean(ip.error) || sentiment === "error",
                        required: Boolean(ip.required),
                        onClick: toggleOpen,
                        buttonRef: setAnchor,
                        id: triggerId,
                        listedBy: open ? listId : void 0,
                        triggerWidth: fieldWidth.triggerWidth,
                        ariaLabel: typeof ariaLabel === "string" ? ariaLabel : typeof ip.label === "string" ? void 0 : "Dropdown"
                      }
                    )
                  }
                ),
                menu
              ]
            }
          )
        }
      );
    }
    const ap = props;
    return /* @__PURE__ */ jsx(
      ClickAwayListener,
      {
        onClickAway: () => {
          if (open) setOpen(false);
        },
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref,
            className,
            style: { position: "relative", display: "inline-flex", ...style },
            "data-cads-dropdown": "action",
            onKeyDown,
            children: [
              /* @__PURE__ */ jsx("style", { children: triggerStyles }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  ref: setAnchor,
                  id: triggerId,
                  size,
                  variant: ap.buttonVariant ?? "contained",
                  color: ap.buttonColor ?? "primary",
                  startIconName: ap.startIconName,
                  endIconName: "chevron-down",
                  disabled,
                  "aria-haspopup": "menu",
                  "aria-expanded": open,
                  "aria-controls": open ? listId : void 0,
                  "aria-label": ariaLabel,
                  onClick: toggleOpen,
                  children: ap.label ?? "Button"
                }
              ),
              menu
            ]
          }
        )
      }
    );
  }
);

export { Dropdown };
//# sourceMappingURL=Dropdown.js.map
//# sourceMappingURL=Dropdown.js.map