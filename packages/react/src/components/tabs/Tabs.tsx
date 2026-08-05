import ButtonBase from "@mui/material/ButtonBase";
import { motion as motionVars } from "@codeai/cads-variables";
import { motion, useReducedMotion } from "motion/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import {
  TABS_SIZE,
} from "../../shared/controlSize";
import {
  springTransition,
  useExperimentalMotion,
} from "../../theme/experimentalMotion";
import { Button } from "../button";
import { CloseIconButton } from "../close-icon-button";
import styles from "./tabs.module.scss";
import type { TabsProps } from "./types";

export type { TabsProps, TabsItem, TabsSize, TabsType } from "./types";

/** Same box/icon scale as CloseIconButton — used for secondary overflow chevrons. */
const COMPACT_SCROLL_SIZE = {
  large: { box: "1.5rem", icon: "1rem" },
  medium: { box: "1.125rem", icon: "0.875rem" },
  small: { box: "1.125rem", icon: "0.75rem" },
  extraSmall: { box: "0.8125rem", icon: "0.625rem" },
} as const;

function resolveIconName(
  name: FaIconName | string | undefined,
): FaIconName | undefined {
  if (!name) return undefined;
  if (name === "smile") return "face-smile";
  if (name === "close") return "xmark";
  return name as FaIconName;
}

/**
 * CADS Tabs — Figma Tab Group. Tab Item is an internal building block only.
 *
 * Spec: page `296:1662`, Group set `16496:3371`
 * (key `b49fe2d463645f88551c83bd8bff0ab56fcde35e`),
 * Item set `6240:7203` (key `6bdc7c7da3d1d1193ec90ba2bf1d52c03cf01e39`).
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    type = "primary",
    size = "medium",
    items,
    value: valueProp,
    defaultValue,
    onChange,
    onItemDismiss,
    "aria-label": ariaLabel,
    className,
  },
  ref,
) {
  const dims = TABS_SIZE[size];
  const groupId = useId();
  const listRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLElement | null>>([]);
  const indicatorReadyRef = useRef(false);
  const selectedRevealReadyRef = useRef(false);
  const controlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.value,
  );
  const value = controlled ? valueProp : uncontrolled;
  const isSecondary = type === "secondary";
  const experimentalMotion = useExperimentalMotion();
  const reduceMotion = useReducedMotion();
  const useIndicator = experimentalMotion && !isSecondary;
  const [indicatorBox, setIndicatorBox] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const [indicatorAnimated, setIndicatorAnimated] = useState(false);
  const [overflow, setOverflow] = useState({
    scrollable: false,
    before: false,
    after: false,
  });
  const indicatorSpring = springTransition(
    motionVars.indicator.spring,
    reduceMotion || !indicatorAnimated,
  );

  const selectValue = (next: string) => {
    if (!controlled) setUncontrolled(next);
    onChange?.(next);
  };

  const focusableIndexes = items
    .map((item, index) => (item.disabled ? -1 : index))
    .filter((index) => index >= 0);

  const selectedFocusableIndex =
    focusableIndexes.find((index) => items[index]?.value === value) ??
    focusableIndexes[0] ??
    -1;

  const selectedIndex = items.findIndex((item) => item.value === value);

  const updateOverflow = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const maxScrollLeft = Math.max(0, list.scrollWidth - list.clientWidth);
    const scrollable = maxScrollLeft > 1;
    const next = {
      scrollable,
      before: scrollable && list.scrollLeft > 1,
      after: scrollable && list.scrollLeft < maxScrollLeft - 1,
    };
    setOverflow((current) =>
      current.scrollable === next.scrollable &&
      current.before === next.before &&
      current.after === next.after
        ? current
        : next,
    );
  }, []);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    const delta = Math.max(80, Math.round(list.clientWidth * 0.75)) * direction;
    list.scrollBy({
      left: delta,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion]);

  const scrollTabIntoView = useCallback((index: number) => {
    const list = listRef.current;
    const tab = tabRefs.current[index];
    if (!list || !tab) return;

    const fadeInset = 24;
    const maxScrollLeft = Math.max(0, list.scrollWidth - list.clientWidth);
    const tabStart = tab.offsetLeft;
    const tabEnd = tabStart + tab.offsetWidth;
    const visibleStart = list.scrollLeft;
    const visibleEnd = visibleStart + list.clientWidth;
    let nextScrollLeft = visibleStart;

    if (tabStart < visibleStart + fadeInset) {
      nextScrollLeft = tabStart - fadeInset;
    } else if (tabEnd > visibleEnd - fadeInset) {
      nextScrollLeft = tabEnd - list.clientWidth + fadeInset;
    }

    const clamped = Math.max(0, Math.min(maxScrollLeft, nextScrollLeft));
    if (Math.abs(clamped - visibleStart) > 1) {
      list.scrollTo({ left: clamped, behavior: "auto" });
    }
  }, []);

  const [focusedIndex, setFocusedIndex] = useState(selectedFocusableIndex);
  const tabStopIndex = focusableIndexes.includes(focusedIndex)
    ? focusedIndex
    : selectedFocusableIndex;

  useEffect(() => {
    setFocusedIndex(selectedFocusableIndex);
  }, [selectedFocusableIndex]);

  useLayoutEffect(() => {
    updateOverflow();
  }, [items, size, type, overflow.scrollable, updateOverflow]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => updateOverflow();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const ro = new ResizeObserver(update);
    ro.observe(list);
    for (const tab of tabRefs.current) {
      if (tab) ro.observe(tab);
    }
    return () => ro.disconnect();
  }, [items.length, size, type, overflow.scrollable, updateOverflow]);

  useEffect(() => {
    if (!selectedRevealReadyRef.current) {
      selectedRevealReadyRef.current = true;
      return;
    }
    if (selectedIndex >= 0) scrollTabIntoView(selectedIndex);
  }, [selectedIndex, scrollTabIntoView]);

  const measureIndicator = () => {
    const list = listRef.current;
    const tab =
      selectedIndex >= 0 ? tabRefs.current[selectedIndex] : null;
    if (!list || !tab) {
      setIndicatorBox(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    setIndicatorBox({
      left: tabRect.left - listRect.left + list.scrollLeft,
      width: tabRect.width,
    });
    if (!indicatorReadyRef.current) {
      indicatorReadyRef.current = true;
      requestAnimationFrame(() => setIndicatorAnimated(true));
    }
  };

  useLayoutEffect(() => {
    if (!useIndicator) {
      indicatorReadyRef.current = false;
      setIndicatorAnimated(false);
      setIndicatorBox(null);
      return;
    }
    measureIndicator();
  }, [useIndicator, value, items, size, type, selectedIndex]);

  useEffect(() => {
    if (!useIndicator) return;
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measureIndicator());
    ro.observe(list);
    for (const tab of tabRefs.current) {
      if (tab) ro.observe(tab);
    }
    window.addEventListener("resize", measureIndicator);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureIndicator);
    };
  }, [useIndicator, items.length, size, type, value]);

  const focusTab = (index: number) => {
    setFocusedIndex(index);
    tabRefs.current[index]?.focus();
    scrollTabIntoView(index);
  };

  const moveFocus = (fromIndex: number, delta: number) => {
    if (focusableIndexes.length === 0) return;
    const currentPos = focusableIndexes.indexOf(fromIndex);
    const start = currentPos === -1 ? 0 : currentPos;
    const nextPos =
      (start + delta + focusableIndexes.length) % focusableIndexes.length;
    focusTab(focusableIndexes[nextPos]!);
  };

  const activateTab = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    setFocusedIndex(index);
    selectValue(item.value);
    scrollTabIntoView(index);
  };

  const onTabKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    index: number,
  ) => {
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
        if (first === undefined) break;
        focusTab(first);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = focusableIndexes[focusableIndexes.length - 1];
        if (last === undefined) break;
        focusTab(last);
        break;
      }
      case " ":
      case "Enter": {
        event.preventDefault();
        activateTab(index);
        break;
      }
      default:
        break;
    }
  };

  const onTablistBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setFocusedIndex(selectedFocusableIndex);
  };

  const rootClass = [styles.root, className].filter(Boolean).join(" ");
  // Match dismissible-tab CloseIconButton size mapping on secondary.
  const compactScrollSize = size === "large" ? "medium" : size;
  const compactScrollDims = COMPACT_SCROLL_SIZE[compactScrollSize];

  const renderScrollButton = (direction: -1 | 1) => {
    const label =
      direction < 0 ? "Scroll tabs left" : "Scroll tabs right";
    const iconName = direction < 0 ? "chevron-left" : "chevron-right";
    const disabled = direction < 0 ? !overflow.before : !overflow.after;
    const onClick = () => scrollByPage(direction);

    // Secondary tabs are short (~20–32px); full Button chrome reads as oversized
    // with a heavy hover fill. Use CloseIconButton-scale mute icons instead
    // (same recipe as dismiss on secondary tabs — not CloseIconButton itself,
    // which is xmark-only).
    if (isSecondary) {
      return (
        <ButtonBase
          type="button"
          aria-label={label}
          disabled={disabled}
          disableRipple
          className={`${styles.scrollButton} ${styles.scrollButtonCompact}`}
          style={
            {
              "--tabs-scroll-box": compactScrollDims.box,
              "--tabs-scroll-icon": compactScrollDims.icon,
            } as CSSProperties
          }
          onClick={onClick}
        >
          <FaIcon
            name={iconName}
            family="solid"
            fontSize={compactScrollDims.icon}
          />
        </ButtonBase>
      );
    }

    return (
      <Button
        variant="text"
        color="tertiary"
        size={size}
        iconOnly
        startIconName={iconName}
        aria-label={label}
        disabled={disabled}
        className={styles.scrollButton}
        onClick={onClick}
      />
    );
  };

  return (
    <div
      ref={ref}
      className={rootClass}
      data-cads-tabs=""
      data-type={type}
      data-size={size}
      data-overflow={overflow.scrollable ? "" : undefined}
    >
      {overflow.scrollable ? renderScrollButton(-1) : null}
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        className={styles.tablist}
        data-type={type}
        data-overflow-before={overflow.before ? "" : undefined}
        data-overflow-after={overflow.after ? "" : undefined}
        onBlur={onTablistBlur}
        onScroll={updateOverflow}
        style={{
          gap: isSecondary ? dims.secondaryGroupGap : dims.primaryGroupGap,
        }}
      >
        {useIndicator && indicatorBox ? (
          <motion.span
            aria-hidden
            data-cads-indicator=""
            data-cads-indicator-spring=""
            data-cads-tabs-indicator="primary"
            className={styles.indicator}
            initial={false}
            animate={{
              left: indicatorBox.left,
              width: indicatorBox.width,
            }}
            transition={indicatorSpring}
          />
        ) : null}
        {items.map((item, index) => {
          const selected = item.value === value;
          const disabled = Boolean(item.disabled);
          const iconOnly = Boolean(item.iconOnly);
          const startName = resolveIconName(item.startIconName);
          const endName = resolveIconName(item.endIconName);
          const iconPx = isSecondary ? dims.secondaryIconPx : dims.primaryIconPx;
          const tabId = `${groupId}-tab-${item.value}`;
          const labelId = `${groupId}-label-${item.value}`;

          const startIcon =
            startName && (iconOnly || item.startIconName) ? (
              <FaIcon name={startName} family="solid" fontSize={iconPx} />
            ) : null;
          const endIcon =
            !iconOnly && endName ? (
              <FaIcon name={endName} family="solid" fontSize={iconPx} />
            ) : null;

          const accessibleName =
            item["aria-label"] ??
            (typeof item.label === "string" ? item.label : undefined);

          const selectedChrome = isSecondary
            ? selected
              ? {
                  "--tab-bg": "var(--background-neutral-primary)",
                  "--tab-fg": "var(--text-selected-primary-inverse)",
                  "--tab-border-top": "1px solid var(--border-neutral-primary)",
                  "--tab-border-left": "1px solid var(--border-neutral-primary)",
                  "--tab-border-right": "1px solid var(--border-neutral-primary)",
                  // Transparent (not none): reserve 1px so label doesn't shift on select.
                  "--tab-border-bottom": "1px solid transparent",
                  "--tab-bg-hover": "var(--background-neutral-primary)",
                  "--tab-fg-hover": "var(--text-selected-primary-inverse)",
                  "--tab-bg-active": "var(--background-neutral-primary)",
                  "--tab-fg-active": "var(--text-selected-primary-inverse)",
                  "--tab-border-top-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-left-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-right-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-bottom-active": "1px solid transparent",
                  "--tab-disabled-bg": "var(--background-neutral-primary)",
                  "--tab-disabled-fg": "var(--text-disabled-neutral)",
                  "--tab-disabled-border-top": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-left": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-right": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-bottom": "1px solid transparent",
                }
              : {
                  "--tab-bg": "var(--background-neutral-secondary)",
                  "--tab-fg": "var(--text-neutral-quaternary)",
                  "--tab-border-top": "1px solid var(--border-neutral-primary)",
                  "--tab-border-left": "1px solid var(--border-neutral-primary)",
                  "--tab-border-right": "1px solid var(--border-neutral-primary)",
                  "--tab-border-bottom": "1px solid var(--border-neutral-primary)",
                  "--tab-bg-hover": "var(--background-neutral-tertiary)",
                  "--tab-fg-hover": "var(--text-neutral-primary)",
                  "--tab-bg-active": "var(--background-neutral-primary)",
                  "--tab-fg-active": "var(--text-selected-primary-inverse)",
                  "--tab-border-top-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-left-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-right-active": "1px solid var(--border-neutral-primary)",
                  "--tab-border-bottom-active": "1px solid transparent",
                  "--tab-disabled-bg": "var(--background-neutral-primary)",
                  "--tab-disabled-fg": "var(--text-disabled-neutral)",
                  "--tab-disabled-border-top": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-left": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-right": "1px solid var(--border-disabled-neutral)",
                  "--tab-disabled-border-bottom": "1px solid var(--border-disabled-neutral)",
                }
            : selected
              ? {
                  "--tab-bg": "transparent",
                  "--tab-fg": "var(--text-selected-primary-inverse)",
                  "--tab-border-bottom": useIndicator
                    ? "2px solid transparent"
                    : "2px solid var(--border-selected-primary)",
                  "--tab-fg-hover": "var(--text-selected-primary-inverse)",
                  ...(useIndicator
                    ? {}
                    : {
                        "--tab-border-bottom-hover":
                          "2px solid var(--border-selected-strong)",
                      }),
                  "--tab-fg-active": "var(--text-selected-primary-inverse)",
                  "--tab-disabled-fg": "var(--text-disabled-neutral)",
                  "--tab-disabled-border-bottom": "2px solid transparent",
                }
              : {
                  "--tab-bg": "transparent",
                  "--tab-fg": "var(--text-neutral-quaternary)",
                  "--tab-border-bottom": "2px solid transparent",
                  "--tab-fg-hover": "var(--text-neutral-primary)",
                  "--tab-fg-active": "var(--text-selected-primary-inverse)",
                  "--tab-disabled-fg": "var(--text-disabled-neutral)",
                  "--tab-disabled-border-bottom": "2px solid transparent",
                };

          const chromeVars = {
            "--tab-height": isSecondary ? dims.secondaryHeight : dims.primaryHeight,
            "--tab-gap": isSecondary ? dims.secondaryItemGap : dims.primaryItemGap,
            "--tab-px": iconOnly
              ? isSecondary
                ? dims.secondaryIconOnlyPadX
                : dims.primaryIconOnlyPadX
              : isSecondary
                ? dims.secondaryPadX
                : "0",
            "--tab-py": isSecondary ? "0" : dims.primaryPadY,
            "--tab-font-size": isSecondary
              ? dims.secondaryFontSize
              : dims.primaryFontSize,
            "--tab-line-height": isSecondary
              ? dims.secondaryLineHeight
              : dims.primaryLineHeight,
            "--tab-radius": isSecondary
              ? "var(--shape-sm) var(--shape-sm) 0 0"
              : "0",
            "--tab-overflow": isSecondary ? "hidden" : "visible",
            ...(iconOnly && isSecondary
              ? { minWidth: dims.secondaryIconOnlyMinWidth }
              : {}),
            ...selectedChrome,
          } as unknown as CSSProperties;

          return (
            <ButtonBase
              key={item.value}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              component="div"
              id={tabId}
              role="tab"
              aria-selected={selected}
              aria-disabled={disabled || undefined}
              aria-label={iconOnly ? accessibleName : undefined}
              aria-labelledby={!iconOnly ? labelId : undefined}
              tabIndex={index === tabStopIndex ? 0 : -1}
              disabled={disabled}
              disableRipple
              className={styles.tab}
              style={chromeVars}
              onClick={() => {
                if (disabled) return;
                activateTab(index);
              }}
              onFocus={() => {
                if (!disabled) setFocusedIndex(index);
              }}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {iconOnly ? (
                startIcon
              ) : (
                <>
                  {startIcon}
                  <span id={labelId}>{item.label}</span>
                  {endIcon}
                </>
              )}
              {item.dismissible ? (
                <CloseIconButton
                  aria-label={
                    accessibleName
                      ? `Dismiss ${accessibleName}`
                      : "Dismiss tab"
                  }
                  size={size === "large" ? "medium" : size}
                  color="secondary"
                  disabled={disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    if (disabled) return;
                    onItemDismiss?.(item.value);
                  }}
                />
              ) : null}
            </ButtonBase>
          );
        })}
      </div>
      {overflow.scrollable ? renderScrollButton(1) : null}
    </div>
  );
});
