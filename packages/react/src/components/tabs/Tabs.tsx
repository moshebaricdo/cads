import ButtonBase from "@mui/material/ButtonBase";
import { motion as motionVars } from "@codeai/cads-variables";
import { motion, useReducedMotion } from "motion/react";
import {
  forwardRef,
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
import { CloseIconButton } from "../close-icon-button";
import styles from "./tabs.module.scss";
import type { TabsProps } from "./types";

export type { TabsProps, TabsItem, TabsSize, TabsType } from "./types";

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

  const [focusedIndex, setFocusedIndex] = useState(selectedFocusableIndex);
  const tabStopIndex = focusableIndexes.includes(focusedIndex)
    ? focusedIndex
    : selectedFocusableIndex;

  useEffect(() => {
    setFocusedIndex(selectedFocusableIndex);
  }, [selectedFocusableIndex]);

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

  const setListRef = (node: HTMLDivElement | null) => {
    listRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const tablistClass = [styles.tablist, className].filter(Boolean).join(" ");

  return (
    <div
      ref={setListRef}
      role="tablist"
      aria-label={ariaLabel}
      className={tablistClass}
      data-cads-tabs=""
      data-type={type}
      onBlur={onTablistBlur}
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
                "--tab-border-bottom": "none",
                "--tab-bg-hover": "var(--background-neutral-primary)",
                "--tab-fg-hover": "var(--text-selected-primary-inverse)",
                "--tab-bg-active": "var(--background-neutral-primary)",
                "--tab-fg-active": "var(--text-selected-primary-inverse)",
                "--tab-border-top-active": "1px solid var(--border-neutral-primary)",
                "--tab-border-left-active": "1px solid var(--border-neutral-primary)",
                "--tab-border-right-active": "1px solid var(--border-neutral-primary)",
                "--tab-border-bottom-active": "none",
                "--tab-disabled-bg": "var(--background-neutral-primary)",
                "--tab-disabled-fg": "var(--text-disabled-neutral)",
                "--tab-disabled-border-top": "1px solid var(--border-disabled-neutral)",
                "--tab-disabled-border-left": "1px solid var(--border-disabled-neutral)",
                "--tab-disabled-border-right": "1px solid var(--border-disabled-neutral)",
                "--tab-disabled-border-bottom": "none",
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
                "--tab-border-bottom-active": "none",
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
  );
});
