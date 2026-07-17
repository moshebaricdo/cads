import { jsxs, jsx, Fragment as Fragment$1 } from 'react/jsx-runtime';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { forwardRef, useId, useMemo, Fragment, useState, useRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { BREADCRUMB_SIZE, TRANSITION_COLORS, FOCUS_RING } from '../shared/controlSize.js';

function buildTrail(items, maxItems, itemsBeforeCollapse, itemsAfterCollapse) {
  const before = Math.max(0, Math.floor(itemsBeforeCollapse));
  const after = Math.max(0, Math.floor(itemsAfterCollapse));
  const max = Math.max(2, Math.floor(maxItems));
  if (items.length <= max) {
    return items.map((item, index) => ({ kind: "item", item, index }));
  }
  if (before + after >= items.length) {
    return items.map((item, index) => ({ kind: "item", item, index }));
  }
  const head = items.slice(0, before).map((item, index) => ({
    kind: "item",
    item,
    index
  }));
  const tailStart = items.length - after;
  const collapsed = items.slice(before, tailStart).map((item, i) => ({
    item,
    index: before + i
  }));
  const tail = items.slice(tailStart).map((item, i) => ({
    kind: "item",
    item,
    index: tailStart + i
  }));
  return [
    ...head,
    { kind: "overflow", items: collapsed },
    ...tail
  ];
}
const crumbClass = "cads-breadcrumb-link";
const overflowClass = "cads-breadcrumb-overflow";
const Breadcrumbs = forwardRef(
  function Breadcrumbs2({
    size = "medium",
    items,
    maxItems = 8,
    itemsBeforeCollapse = 1,
    itemsAfterCollapse = 1,
    expandText = "Show path",
    "aria-label": ariaLabel = "Breadcrumb",
    className,
    style
  }, ref) {
    const dims = BREADCRUMB_SIZE[size];
    const listId = useId();
    const hasExplicitCurrent = items.some((item) => item.current);
    const trail = useMemo(
      () => buildTrail(items, maxItems, itemsBeforeCollapse, itemsAfterCollapse),
      [items, maxItems, itemsBeforeCollapse, itemsAfterCollapse]
    );
    const styles = `
.${crumbClass} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${dims.linkGap};
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-weight: var(--font-weight-semibold);
  font-size: ${dims.fontSize};
  line-height: ${dims.lineHeight};
  color: var(--text-neutral-quaternary);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: ${TRANSITION_COLORS};
  box-sizing: border-box;
}
/* Beat host/docs \`a:hover { text-decoration: underline }\` \u2014 Figma has no underline. */
.${crumbClass}:hover,
.${crumbClass}:focus,
.${crumbClass}:active,
.${crumbClass}:visited {
  text-decoration: none;
}
.${crumbClass}:hover:not([aria-disabled="true"]):not([aria-current="page"]),
.${crumbClass}:active:not([aria-disabled="true"]):not([aria-current="page"]) {
  color: var(--text-neutral-secondary);
}
.${crumbClass}:focus { outline: none; }
.${crumbClass}:focus-visible {
  box-shadow: ${FOCUS_RING};
}
.${crumbClass}[aria-current="page"] {
  color: var(--text-selected-primary-inverse);
  cursor: default;
}
.${crumbClass}[aria-disabled="true"] {
  color: var(--text-disabled-neutral);
  cursor: default;
  pointer-events: none;
}
.${overflowClass} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${dims.sepBox};
  height: ${dims.sepBox};
  margin: 0;
  padding: 0.25rem;
  border: none;
  background: transparent;
  color: var(--text-neutral-quaternary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  box-sizing: border-box;
  transition: ${TRANSITION_COLORS};
  text-decoration: none;
}
.${overflowClass}:hover,
.${overflowClass}:active {
  color: var(--text-neutral-secondary);
  text-decoration: none;
}
.${overflowClass}:focus { outline: none; }
.${overflowClass}:focus-visible {
  box-shadow: ${FOCUS_RING};
}
.${overflowClass}[aria-expanded="true"] {
  color: var(--text-neutral-secondary);
}
`;
    return /* @__PURE__ */ jsxs(
      "nav",
      {
        ref,
        "aria-label": ariaLabel,
        className,
        style,
        "data-cads-breadcrumbs": "",
        "data-size": size,
        children: [
          /* @__PURE__ */ jsx("style", { children: styles }),
          /* @__PURE__ */ jsx(
            "ol",
            {
              style: {
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: dims.trailGap,
                listStyle: "none",
                margin: 0,
                padding: 0
              },
              children: trail.map((slot, slotIndex) => {
                const isLastSlot = slotIndex === trail.length - 1;
                const slotKey = slot.kind === "item" ? slot.item.key ?? `crumb-${slot.index}` : `${listId}-overflow`;
                return /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("li", { children: slot.kind === "item" ? /* @__PURE__ */ jsx(
                    BreadcrumbLink,
                    {
                      item: slot.item,
                      size,
                      isCurrent: Boolean(slot.item.current) || !hasExplicitCurrent && slot.index === items.length - 1,
                      className: crumbClass
                    }
                  ) : /* @__PURE__ */ jsx(
                    BreadcrumbOverflow,
                    {
                      size,
                      items: slot.items,
                      className: overflowClass,
                      menuId: `${listId}-overflow-menu`,
                      expandText
                    }
                  ) }),
                  !isLastSlot ? /* @__PURE__ */ jsx(
                    "li",
                    {
                      "aria-hidden": true,
                      style: {
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: dims.sepBox,
                        height: dims.sepBox,
                        flexShrink: 0,
                        color: "var(--text-neutral-quaternary)",
                        boxSizing: "border-box"
                      },
                      children: /* @__PURE__ */ jsx(
                        FaIcon,
                        {
                          name: "chevron-right",
                          family: "solid",
                          fontSize: dims.sepIconPx
                        }
                      )
                    }
                  ) : null
                ] }, slotKey);
              })
            }
          )
        ]
      }
    );
  }
);
function visuallyHiddenStyle() {
  return {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0
  };
}
function BreadcrumbLink({
  item,
  size,
  isCurrent,
  className
}) {
  const dims = BREADCRUMB_SIZE[size];
  const disabled = Boolean(item.disabled);
  const showIcon = Boolean(item.iconName);
  const content = /* @__PURE__ */ jsxs(Fragment$1, { children: [
    showIcon ? /* @__PURE__ */ jsx(
      FaIcon,
      {
        name: item.iconName,
        family: "solid",
        fontSize: dims.iconPx,
        title: item.iconOnly && typeof item.label === "string" ? item.label : void 0
      }
    ) : null,
    item.iconOnly ? showIcon && typeof item.label === "string" ? null : /* @__PURE__ */ jsx("span", { style: visuallyHiddenStyle(), children: item.label }) : item.label
  ] });
  const shared = {
    className,
    "data-cads-breadcrumb-link": "",
    "data-current": isCurrent ? "true" : void 0,
    "data-disabled": disabled ? "true" : void 0,
    style: { position: "relative" }
  };
  if (isCurrent) {
    return /* @__PURE__ */ jsx("span", { ...shared, "aria-current": "page", children: content });
  }
  if (disabled) {
    return /* @__PURE__ */ jsx("span", { ...shared, "aria-disabled": "true", children: content });
  }
  if (item.href != null) {
    return /* @__PURE__ */ jsx("a", { ...shared, href: item.href, onClick: item.onClick, children: content });
  }
  return /* @__PURE__ */ jsx("button", { type: "button", ...shared, onClick: item.onClick, children: content });
}
const OVERFLOW_MENU_ITEM = {
  large: {
    paddingLeft: "1rem",
    paddingRight: "1.375rem",
    paddingBlock: "0.625rem",
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)"
  },
  medium: {
    paddingLeft: "0.75rem",
    paddingRight: "1rem",
    paddingBlock: "0.5rem",
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)"
  },
  small: {
    paddingLeft: "0.625rem",
    paddingRight: "0.875rem",
    paddingBlock: "0.3125rem",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)"
  },
  extraSmall: {
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem",
    paddingBlock: "0.125rem",
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)"
  }
};
function BreadcrumbOverflow({
  size,
  items,
  className,
  menuId,
  expandText
}) {
  const dims = BREADCRUMB_SIZE[size];
  const menuDims = OVERFLOW_MENU_ITEM[size === "large" || size === "medium" ? "small" : "extraSmall"];
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const anchorRef = useRef(null);
  const triggerId = useId();
  const activate = (entry, event) => {
    const { item } = entry;
    if (item.disabled) return;
    setOpen(false);
    setActiveIndex(-1);
    if (item.onClick) {
      item.onClick(
        event
      );
      return;
    }
    if (item.href && typeof window !== "undefined") {
      window.location.assign(item.href);
    }
  };
  const focusableIndexes = items.map((entry, index) => entry.item.disabled ? -1 : index).filter((index) => index >= 0);
  const onMenuKeyDown = (event) => {
    if (!open) return;
    switch (event.key) {
      case "Escape":
        event.stopPropagation();
        event.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        anchorRef.current?.focus();
        break;
      case "ArrowDown": {
        event.preventDefault();
        if (focusableIndexes.length === 0) break;
        const pos = focusableIndexes.indexOf(activeIndex);
        const next = focusableIndexes[pos === -1 ? 0 : (pos + 1) % focusableIndexes.length];
        setActiveIndex(next);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (focusableIndexes.length === 0) break;
        const pos = focusableIndexes.indexOf(activeIndex);
        const next = focusableIndexes[pos <= 0 ? focusableIndexes.length - 1 : (pos - 1 + focusableIndexes.length) % focusableIndexes.length];
        setActiveIndex(next);
        break;
      }
      case "Enter":
      case " ": {
        if (activeIndex < 0) break;
        event.preventDefault();
        const entry = items[activeIndex];
        if (entry && !entry.item.disabled) {
          activate(entry, event);
        }
        break;
      }
    }
  };
  return /* @__PURE__ */ jsx(
    ClickAwayListener,
    {
      onClickAway: () => {
        if (open) {
          setOpen(false);
          setActiveIndex(-1);
        }
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: { position: "relative", display: "inline-flex" },
          onKeyDown: onMenuKeyDown,
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                ref: anchorRef,
                id: triggerId,
                type: "button",
                className,
                "aria-label": expandText,
                "aria-haspopup": "menu",
                "aria-expanded": open,
                "aria-controls": open ? menuId : void 0,
                "data-cads-breadcrumb-overflow": "",
                onClick: () => {
                  setOpen((v) => {
                    const next = !v;
                    if (next) setActiveIndex(focusableIndexes[0] ?? -1);
                    else setActiveIndex(-1);
                    return next;
                  });
                },
                children: /* @__PURE__ */ jsx(FaIcon, { name: "ellipsis", family: "solid", fontSize: dims.sepIconPx })
              }
            ),
            /* @__PURE__ */ jsx(
              Popper,
              {
                open,
                anchorEl: anchorRef.current,
                placement: "bottom-start",
                style: { zIndex: 1400 },
                modifiers: [{ name: "offset", options: { offset: [0, 4] } }],
                children: /* @__PURE__ */ jsx(
                  Paper,
                  {
                    id: menuId,
                    role: "menu",
                    "aria-labelledby": triggerId,
                    "data-cads-breadcrumb-overflow-menu": "",
                    elevation: 0,
                    sx: {
                      mt: 0,
                      border: "1px solid var(--border-neutral-primary)",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--background-neutral-primary)",
                      boxShadow: "var(--shadow-md)",
                      overflow: "hidden",
                      minWidth: 120,
                      py: "4px"
                    },
                    children: items.map(({ item, index }) => {
                      const disabled = Boolean(item.disabled);
                      const active = index === activeIndex;
                      return /* @__PURE__ */ jsx(
                        "div",
                        {
                          role: "menuitem",
                          "aria-disabled": disabled || void 0,
                          "data-cads-dropdown-item": "",
                          "data-active": active ? "true" : void 0,
                          tabIndex: -1,
                          onMouseDown: (e) => e.preventDefault(),
                          onClick: (event) => {
                            if (!disabled) activate({ item}, event);
                          },
                          onMouseEnter: () => {
                            if (!disabled) setActiveIndex(index);
                          },
                          style: {
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            boxSizing: "border-box",
                            paddingLeft: menuDims.paddingLeft,
                            paddingRight: menuDims.paddingRight,
                            paddingBlock: menuDims.paddingBlock,
                            // Action Dropdown menu item chrome; icons omitted (label only).
                            color: disabled ? "var(--text-disabled-neutral)" : "var(--text-neutral-primary)",
                            backgroundColor: !disabled && active ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
                            opacity: disabled ? 0.5 : 1,
                            fontFamily: "var(--font-body)",
                            fontWeight: "var(--font-weight-normal)",
                            fontSize: menuDims.fontSize,
                            lineHeight: menuDims.lineHeight,
                            cursor: disabled ? "default" : "pointer",
                            transition: TRANSITION_COLORS,
                            minWidth: 0,
                            textDecoration: "none"
                          },
                          children: /* @__PURE__ */ jsx(
                            "span",
                            {
                              style: {
                                minWidth: 0,
                                flex: "1 1 auto",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              },
                              children: item.label
                            }
                          )
                        },
                        item.key ?? `overflow-${index}`
                      );
                    })
                  }
                )
              }
            )
          ]
        }
      )
    }
  );
}

export { Breadcrumbs };
//# sourceMappingURL=Breadcrumbs.js.map
//# sourceMappingURL=Breadcrumbs.js.map