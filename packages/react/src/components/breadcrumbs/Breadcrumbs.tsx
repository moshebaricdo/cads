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
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import {
  BREADCRUMB_SIZE,
  type ControlSize,
} from "../../shared/controlSize";
import styles from "./breadcrumbs.module.scss";
import type { BreadcrumbItem, BreadcrumbsProps } from "./types";

export type { BreadcrumbItem, BreadcrumbsProps, BreadcrumbsSize } from "./types";

type BreadcrumbsSize = ControlSize;

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

    const chromeVars = {
      "--crumb-link-gap": dims.linkGap,
      "--crumb-font-size": dims.fontSize,
      "--crumb-line-height": dims.lineHeight,
      "--crumb-trail-gap": dims.trailGap,
      "--crumb-sep-box": dims.sepBox,
    } as CSSProperties;

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={className}
        style={{ ...chromeVars, ...style }}
        data-cads-breadcrumbs=""
        data-size={size}
      >
        <ol className={styles.trail}>
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
                    />
                  ) : (
                    <BreadcrumbOverflow
                      size={size}
                      items={slot.items}
                      menuId={`${listId}-overflow-menu`}
                      expandText={expandText}
                    />
                  )}
                </li>
                {!isLastSlot ? (
                  <li aria-hidden className={styles.separator}>
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
}: {
  item: BreadcrumbItem;
  size: BreadcrumbsSize;
  isCurrent: boolean;
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
    className: styles.link,
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
      <a {...shared} href={item.href} onClick={item.onClick} data-cads-press="">
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...shared}
      onClick={item.onClick}
      data-cads-press=""
    >
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
  menuId,
  expandText,
}: {
  size: BreadcrumbsSize;
  items: Array<{ item: BreadcrumbItem; index: number }>;
  menuId: string;
  expandText: string;
}) {
  const dims = BREADCRUMB_SIZE[size];
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

  const menuItemVars = {
    "--menu-padding-left": menuDims.paddingLeft,
    "--menu-padding-right": menuDims.paddingRight,
    "--menu-padding-block": menuDims.paddingBlock,
    "--menu-font-size": menuDims.fontSize,
    "--menu-line-height": menuDims.lineHeight,
  } as CSSProperties;

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
          className={styles.overflow}
          aria-label={expandText}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          data-cads-breadcrumb-overflow=""
          data-cads-press=""
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
          style={{ zIndex: "var(--z-dropdown)" }}
          modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
        >
          <Paper
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            data-cads-breadcrumb-overflow-menu=""
            data-cads-surface=""
            elevation={0}
            sx={{
              mt: 0,
              border: "1px solid var(--border-neutral-primary)",
              borderRadius: "var(--shape-sm)",
              backgroundColor: "var(--background-neutral-primary)",
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              minWidth: 120,
              py: "4px",
              "--cads-surface-origin": "top left",
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
                  className={styles.overflowMenuItem}
                  style={menuItemVars}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(event) => {
                    if (!disabled) activate({ item, index }, event);
                  }}
                  onMouseEnter={() => {
                    if (!disabled) setActiveIndex(index);
                  }}
                >
                  <span className={styles.overflowMenuItemLabel}>
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
