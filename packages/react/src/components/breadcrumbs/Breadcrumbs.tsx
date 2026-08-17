import {
  Fragment,
  forwardRef,
  useId,
  useMemo,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import {
  BREADCRUMB_SIZE,
  type ControlSize,
} from "../../shared/controlSize";
import { Dropdown } from "../dropdown/index";
import type { DropdownSize } from "../dropdown/types";
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
 * Internal: Links `6862:5619`, Separators `2434:9333`, Overflow `17408:6606`.
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
      "--crumb-row": dims.sepBox,
      "--crumb-trail-gap": dims.trailGap,
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
                <li className={styles.slot}>
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
                      className={styles.glyph}
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
          className={styles.glyph}
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
        <span className={styles.label}>{item.label}</span>
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

/** Overflow menu: medium for L, small for M, extraSmall for S/XS. */
function overflowMenuSize(size: BreadcrumbsSize): DropdownSize {
  if (size === "large") return "medium";
  if (size === "medium") return "small";
  return "extraSmall";
}

function overflowItemValue(
  item: BreadcrumbItem,
  index: number,
): string {
  return item.key ?? `overflow-${index}`;
}

function BreadcrumbOverflow({
  size,
  items,
  expandText,
}: {
  size: BreadcrumbsSize;
  items: Array<{ item: BreadcrumbItem; index: number }>;
  expandText: string;
}) {
  const dims = BREADCRUMB_SIZE[size];

  const activate = (value: string) => {
    const entry = items.find(
      ({ item, index }) => overflowItemValue(item, index) === value,
    );
    if (!entry || entry.item.disabled) return;
    const { item } = entry;
    if (item.onClick) {
      item.onClick(
        undefined as unknown as MouseEvent<
          HTMLAnchorElement | HTMLButtonElement
        >,
      );
      return;
    }
    if (item.href && typeof window !== "undefined") {
      window.location.assign(item.href);
    }
  };

  return (
    <Dropdown
      role="action"
      size={overflowMenuSize(size)}
      className={styles.overflowHost}
      aria-label={expandText}
      options={items.map(({ item, index }) => ({
        value: overflowItemValue(item, index),
        label: item.label,
        disabled: item.disabled,
      }))}
      onAction={activate}
      trigger={
        <button
          type="button"
          className={styles.overflow}
          data-cads-breadcrumb-overflow=""
          data-cads-press=""
        >
          <FaIcon
            name="ellipsis"
            family="solid"
            fontSize={dims.iconPx}
            className={styles.glyph}
          />
        </button>
      }
    />
  );
}
