import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import {
  Fragment,
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  BREADCRUMB_SIZE,
  FOCUS_RING,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type BreadcrumbsSize = ControlSize;

export interface BreadcrumbItem {
  key?: string;
  label: ReactNode;
  href?: string;
  /**
   * Optional leading icon on this crumb (Figma `startIcon` + `iconName`).
   * Available on any item — not limited to the first / “home” crumb.
   */
  iconName?: FaIconName | (string & {});
  /**
   * When true with `iconName`, hide the label visually (keep accessible name).
   * Figma `iconOnly`.
   */
  iconOnly?: boolean;
  /** Maps Figma isCurrent — render as span, not a link. */
  current?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

export interface BreadcrumbsProps {
  /**
   * @default "medium"
   */
  size?: BreadcrumbsSize;
  items: BreadcrumbItem[];
  /**
   * Max visible crumbs before collapsing the middle into Breadcrumb Overflow
   * (ellipsis that opens a dropdown of truncated pages). MUI-compatible.
   * @default 8
   */
  maxItems?: number;
  /**
   * Crumbs kept before the overflow ellipsis when collapsed. MUI-compatible.
   * @default 1
   */
  itemsBeforeCollapse?: number;
  /**
   * Crumbs kept after the overflow ellipsis when collapsed. MUI-compatible.
   * Figma’s default composition shows 2 after the ellipsis.
   * @default 1
   */
  itemsAfterCollapse?: number;
  /**
   * Accessible name for the overflow trigger.
   * @default "Show path"
   */
  expandText?: string;
  /**
   * @default "Breadcrumb"
   */
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

type TrailSlot =
  | { kind: "item"; item: BreadcrumbItem; index: number }
  | { kind: "overflow"; items: Array<{ item: BreadcrumbItem; index: number }> };

function buildTrail(
  items: BreadcrumbItem[],
  maxItems: number,
  itemsBeforeCollapse: number,
  itemsAfterCollapse: number,
): TrailSlot[] {
  const before = Math.max(0, Math.floor(itemsBeforeCollapse));
  const after = Math.max(0, Math.floor(itemsAfterCollapse));
  const max = Math.max(2, Math.floor(maxItems));

  if (items.length <= max) {
    return items.map((item, index) => ({ kind: "item" as const, item, index }));
  }

  // MUI: if before+after >= length, collapse would hide nothing — show all.
  if (before + after >= items.length) {
    return items.map((item, index) => ({ kind: "item" as const, item, index }));
  }

  const head = items.slice(0, before).map((item, index) => ({
    kind: "item" as const,
    item,
    index,
  }));
  const tailStart = items.length - after;
  const collapsed = items.slice(before, tailStart).map((item, i) => ({
    item,
    index: before + i,
  }));
  const tail = items.slice(tailStart).map((item, i) => ({
    kind: "item" as const,
    item,
    index: tailStart + i,
  }));

  return [
    ...head,
    { kind: "overflow", items: collapsed },
    ...tail,
  ];
}

const crumbClass = "cads-breadcrumb-link";
const overflowClass = "cads-breadcrumb-overflow";

/**
 * CADS Breadcrumbs — trail of links with separators and optional overflow.
 * Spec: Figma Breadcrumbs `16381:3339` / key `43afede0abfd158d2c740e2801b46d13e570a8d0`.
 * Internal: Links `6862:5619`, Separators `2434:9333`, Overflow `16398:927`.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs(
    {
      size = "medium",
      items,
      maxItems = 8,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 1,
      expandText = "Show path",
      "aria-label": ariaLabel = "Breadcrumb",
      className,
      style,
    },
    ref,
  ) {
    const dims = BREADCRUMB_SIZE[size];
    const listId = useId();
    const hasExplicitCurrent = items.some((item) => item.current);
    const trail = useMemo(
      () =>
        buildTrail(items, maxItems, itemsBeforeCollapse, itemsAfterCollapse),
      [items, maxItems, itemsBeforeCollapse, itemsAfterCollapse],
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
/* Beat host/docs \`a:hover { text-decoration: underline }\` — Figma has no underline. */
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

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={className}
        style={style}
        data-cads-breadcrumbs=""
        data-size={size}
      >
        <style>{styles}</style>
        <ol
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: dims.trailGap,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {trail.map((slot, slotIndex) => {
            const isLastSlot = slotIndex === trail.length - 1;
            const slotKey =
              slot.kind === "item"
                ? (slot.item.key ?? `crumb-${slot.index}`)
                : `${listId}-overflow`;

            return (
              <Fragment key={slotKey}>
                <li>
                  {slot.kind === "item" ? (
                    <BreadcrumbLink
                      item={slot.item}
                      size={size}
                      isCurrent={
                        Boolean(slot.item.current) ||
                        (!hasExplicitCurrent &&
                          slot.index === items.length - 1)
                      }
                      className={crumbClass}
                    />
                  ) : (
                    <BreadcrumbOverflow
                      size={size}
                      items={slot.items}
                      className={overflowClass}
                      menuId={`${listId}-overflow-menu`}
                      expandText={expandText}
                    />
                  )}
                </li>
                {!isLastSlot ? (
                  <li
                    aria-hidden
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: dims.sepBox,
                      height: dims.sepBox,
                      flexShrink: 0,
                      color: "var(--text-neutral-quaternary)",
                      boxSizing: "border-box",
                    }}
                  >
                    <FaIcon
                      name="chevron-right"
                      family="solid"
                      fontSize={dims.sepIconPx}
                    />
                  </li>
                ) : null}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    );
  },
);

function visuallyHiddenStyle(): CSSProperties {
  return {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  };
}

function BreadcrumbLink({
  item,
  size,
  isCurrent,
  className,
}: {
  item: BreadcrumbItem;
  size: BreadcrumbsSize;
  isCurrent: boolean;
  className: string;
}) {
  const dims = BREADCRUMB_SIZE[size];
  const disabled = Boolean(item.disabled);
  const showIcon = Boolean(item.iconName);

  const content = (
    <>
      {showIcon ? (
        <FaIcon
          name={item.iconName!}
          family="solid"
          fontSize={dims.iconPx}
          title={
            item.iconOnly && typeof item.label === "string"
              ? item.label
              : undefined
          }
        />
      ) : null}
      {item.iconOnly ? (
        showIcon && typeof item.label === "string" ? null : (
          <span style={visuallyHiddenStyle()}>{item.label}</span>
        )
      ) : (
        item.label
      )}
    </>
  );

  const shared = {
    className,
    "data-cads-breadcrumb-link": "",
    "data-current": isCurrent ? "true" : undefined,
    "data-disabled": disabled ? "true" : undefined,
    style: { position: "relative" as const },
  };

  if (isCurrent) {
    return (
      <span {...shared} aria-current="page">
        {content}
      </span>
    );
  }

  if (disabled) {
    return (
      <span {...shared} aria-disabled="true">
        {content}
      </span>
    );
  }

  if (item.href != null) {
    return (
      <a {...shared} href={item.href} onClick={item.onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" {...shared} onClick={item.onClick}>
      {content}
    </button>
  );
}

/** Action-menu item geometry (Dropdown `role="action"`), icon slot omitted. */
const OVERFLOW_MENU_ITEM: Record<
  BreadcrumbsSize,
  {
    paddingLeft: string;
    paddingRight: string;
    paddingBlock: string;
    fontSize: string;
    lineHeight: string;
  }
> = {
  large: {
    paddingLeft: "1rem",
    paddingRight: "1.375rem",
    paddingBlock: "0.625rem",
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
  },
  medium: {
    paddingLeft: "0.75rem",
    paddingRight: "1rem",
    paddingBlock: "0.5rem",
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
  },
  small: {
    paddingLeft: "0.625rem",
    paddingRight: "0.875rem",
    paddingBlock: "0.3125rem",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
  },
  extraSmall: {
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem",
    paddingBlock: "0.125rem",
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
  },
};

function BreadcrumbOverflow({
  size,
  items,
  className,
  menuId,
  expandText,
}: {
  size: BreadcrumbsSize;
  items: Array<{ item: BreadcrumbItem; index: number }>;
  className: string;
  menuId: string;
  expandText: string;
}) {
  const dims = BREADCRUMB_SIZE[size];
  // Overflow menu: S for L/M trail, XS for S/XS trail.
  const menuDims =
    OVERFLOW_MENU_ITEM[
      size === "large" || size === "medium" ? "small" : "extraSmall"
    ];
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const triggerId = useId();

  const activate = (
    entry: { item: BreadcrumbItem; index: number },
    event: MouseEvent<HTMLElement>,
  ) => {
    const { item } = entry;
    if (item.disabled) return;
    setOpen(false);
    setActiveIndex(-1);
    if (item.onClick) {
      item.onClick(
        event as unknown as MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
      );
      return;
    }
    if (item.href && typeof window !== "undefined") {
      window.location.assign(item.href);
    }
  };

  const focusableIndexes = items
    .map((entry, index) => (entry.item.disabled ? -1 : index))
    .filter((index) => index >= 0);

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
        const next =
          focusableIndexes[
            pos === -1 ? 0 : (pos + 1) % focusableIndexes.length
          ]!;
        setActiveIndex(next);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (focusableIndexes.length === 0) break;
        const pos = focusableIndexes.indexOf(activeIndex);
        const next =
          focusableIndexes[
            pos <= 0
              ? focusableIndexes.length - 1
              : (pos - 1 + focusableIndexes.length) % focusableIndexes.length
          ]!;
        setActiveIndex(next);
        break;
      }
      case "Enter":
      case " ": {
        if (activeIndex < 0) break;
        event.preventDefault();
        const entry = items[activeIndex];
        if (entry && !entry.item.disabled) {
          activate(entry, event as unknown as MouseEvent<HTMLElement>);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (open) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <div
        style={{ position: "relative", display: "inline-flex" }}
        onKeyDown={onMenuKeyDown}
      >
        <button
          ref={anchorRef}
          id={triggerId}
          type="button"
          className={className}
          aria-label={expandText}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          data-cads-breadcrumb-overflow=""
          onClick={() => {
            setOpen((v) => {
              const next = !v;
              if (next) setActiveIndex(focusableIndexes[0] ?? -1);
              else setActiveIndex(-1);
              return next;
            });
          }}
        >
          <FaIcon name="ellipsis" family="solid" fontSize={dims.sepIconPx} />
        </button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1400 }}
          modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
        >
          <Paper
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            data-cads-breadcrumb-overflow-menu=""
            elevation={0}
            sx={{
              mt: 0,
              border: "1px solid var(--border-neutral-primary)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--background-neutral-primary)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              minWidth: 120,
              py: "4px",
            }}
          >
            {items.map(({ item, index }) => {
              const disabled = Boolean(item.disabled);
              const active = index === activeIndex;
              return (
                <div
                  key={item.key ?? `overflow-${index}`}
                  role="menuitem"
                  aria-disabled={disabled || undefined}
                  data-cads-dropdown-item=""
                  data-active={active ? "true" : undefined}
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(event) => {
                    if (!disabled) activate({ item, index }, event);
                  }}
                  onMouseEnter={() => {
                    if (!disabled) setActiveIndex(index);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    boxSizing: "border-box",
                    paddingLeft: menuDims.paddingLeft,
                    paddingRight: menuDims.paddingRight,
                    paddingBlock: menuDims.paddingBlock,
                    // Action Dropdown menu item chrome; icons omitted (label only).
                    color: disabled
                      ? "var(--text-disabled-neutral)"
                      : "var(--text-neutral-primary)",
                    backgroundColor:
                      !disabled && active
                        ? "var(--background-neutral-secondary)"
                        : "var(--background-neutral-primary)",
                    opacity: disabled ? 0.5 : 1,
                    fontFamily: "var(--font-body)",
                    fontWeight: "var(--font-weight-normal)",
                    fontSize: menuDims.fontSize,
                    lineHeight: menuDims.lineHeight,
                    cursor: disabled ? "default" : "pointer",
                    transition: TRANSITION_COLORS,
                    minWidth: 0,
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      minWidth: 0,
                      flex: "1 1 auto",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
