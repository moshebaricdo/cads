import ButtonBase from "@mui/material/ButtonBase";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  FOCUS_RING,
  TABS_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";
import { CloseIconButton } from "./CloseIconButton";

export type TabsSize = ControlSize;
export type TabsType = "primary" | "secondary";

export interface TabsItem {
  value: string;
  label: ReactNode;
  startIconName?: FaIconName | string;
  endIconName?: FaIconName | string;
  iconOnly?: boolean;
  /** Maps Figma Tab Item `isDismissible`. */
  dismissible?: boolean;
  disabled?: boolean;
  /** Required when `iconOnly` is true. */
  "aria-label"?: string;
}

export interface TabsProps {
  /**
   * Figma `type`: primary = underline, secondary = contained.
   * @default "primary"
   */
  type?: TabsType;
  /**
   * Control size: large / medium / small / extraSmall.
   * @default "medium"
   */
  size?: TabsSize;
  items: TabsItem[];
  /** Currently selected tab value (exclusive). */
  value?: string;
  /** Uncontrolled default. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires when a dismissible tab’s close control is activated. */
  onItemDismiss?: (value: string) => void;
  "aria-label"?: string;
  className?: string;
}

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
  const tabRefs = useRef<Array<HTMLElement | null>>([]);
  const controlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.value,
  );
  const value = controlled ? valueProp : uncontrolled;
  const isSecondary = type === "secondary";

  const selectValue = (next: string) => {
    if (!controlled) setUncontrolled(next);
    onChange?.(next);
  };

  /* Manual activation: arrows move focus only; Space/Enter commits selection. */
  const focusableIndexes = items
    .map((item, index) => (item.disabled ? -1 : index))
    .filter((index) => index >= 0);

  const selectedFocusableIndex =
    focusableIndexes.find((index) => items[index]?.value === value) ??
    focusableIndexes[0] ??
    -1;

  const [focusedIndex, setFocusedIndex] = useState(selectedFocusableIndex);
  const tabStopIndex = focusableIndexes.includes(focusedIndex)
    ? focusedIndex
    : selectedFocusableIndex;

  /* Keep the Tab stop on the selected tab when selection changes externally. */
  useEffect(() => {
    setFocusedIndex(selectedFocusableIndex);
  }, [selectedFocusableIndex]);

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
    /* Tab re-entry lands on the selected tab, not the last focused. */
    setFocusedIndex(selectedFocusableIndex);
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={ariaLabel}
      className={className}
      onBlur={onTablistBlur}
      style={{
        display: "flex",
        alignItems: isSecondary ? "flex-end" : "stretch",
        gap: isSecondary ? dims.secondaryGroupGap : dims.primaryGroupGap,
        borderBottom: "1px solid var(--border-neutral-primary)",
        boxSizing: "border-box",
      }}
    >
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
            onClick={() => {
              if (disabled) return;
              activateTab(index);
            }}
            onFocus={() => {
              if (!disabled) setFocusedIndex(index);
            }}
            onKeyDown={(event) => onTabKeyDown(event, index)}
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              flex: "0 0 auto",
              height: isSecondary ? dims.secondaryHeight : dims.primaryHeight,
              minWidth: iconOnly
                ? isSecondary
                  ? dims.secondaryIconOnlyMinWidth
                  : undefined
                : undefined,
              gap: isSecondary ? dims.secondaryItemGap : dims.primaryItemGap,
              paddingInline: iconOnly
                ? isSecondary
                  ? dims.secondaryIconOnlyPadX
                  : dims.primaryIconOnlyPadX
                : isSecondary
                  ? dims.secondaryPadX
                  : 0,
              paddingBlock: isSecondary ? 0 : dims.primaryPadY,
              marginBottom: "-1px",
              fontFamily: "var(--font-body)",
              fontWeight: "var(--font-weight-semibold)",
              fontSize: isSecondary
                ? dims.secondaryFontSize
                : dims.primaryFontSize,
              lineHeight: isSecondary
                ? dims.secondaryLineHeight
                : dims.primaryLineHeight,
              textTransform: "none",
              whiteSpace: "nowrap",
              transition: TRANSITION_COLORS,
              overflow: isSecondary ? "hidden" : "visible",
              borderRadius: isSecondary
                ? "var(--radius-sm) var(--radius-sm) 0 0"
                : 0,
              /* Primary underline / secondary chrome */
              ...(isSecondary
                ? selected
                  ? {
                      backgroundColor: "var(--background-neutral-primary)",
                      borderTop: "1px solid var(--border-neutral-primary)",
                      borderLeft: "1px solid var(--border-neutral-primary)",
                      borderRight: "1px solid var(--border-neutral-primary)",
                      borderBottom: "none",
                      color: "var(--text-selected-primary-inverse)",
                    }
                  : {
                      backgroundColor: "var(--background-neutral-secondary)",
                      border: "1px solid var(--border-neutral-primary)",
                      color: "var(--text-neutral-quaternary)",
                    }
                : selected
                  ? {
                      backgroundColor: "transparent",
                      border: "none",
                      borderBottom:
                        "2px solid var(--border-selected-primary)",
                      color: "var(--text-selected-primary-inverse)",
                    }
                  : {
                      backgroundColor: "transparent",
                      border: "none",
                      borderBottom: "2px solid transparent",
                      color: "var(--text-neutral-quaternary)",
                    }),
              "&:hover": disabled
                ? undefined
                : isSecondary
                  ? selected
                    ? {
                        backgroundColor: "var(--background-neutral-primary)",
                        color: "var(--text-selected-primary-inverse)",
                      }
                    : {
                        backgroundColor: "var(--background-neutral-tertiary)",
                        color: "var(--text-neutral-primary)",
                      }
                  : selected
                    ? {
                        borderBottomColor: "var(--border-selected-strong)",
                        color: "var(--text-selected-primary-inverse)",
                      }
                    : {
                        color: "var(--text-neutral-primary)",
                      },
              "&:active": disabled
                ? undefined
                : isSecondary
                  ? {
                      backgroundColor: "var(--background-neutral-primary)",
                      borderTop: "1px solid var(--border-neutral-primary)",
                      borderLeft: "1px solid var(--border-neutral-primary)",
                      borderRight: "1px solid var(--border-neutral-primary)",
                      borderBottom: "none",
                      color: "var(--text-selected-primary-inverse)",
                    }
                  : {
                      color: "var(--text-selected-primary-inverse)",
                    },
              "&.Mui-focusVisible": {
                zIndex: 1,
                boxShadow: FOCUS_RING,
              },
              "&.Mui-disabled": {
                opacity: 1,
                cursor: "not-allowed",
                ...(isSecondary
                  ? {
                      backgroundColor: "var(--background-neutral-primary)",
                      border: "1px solid var(--border-disabled-neutral)",
                      color: "var(--text-disabled-neutral)",
                    }
                  : {
                      backgroundColor: "transparent",
                      borderBottom: "2px solid transparent",
                      color: "var(--text-disabled-neutral)",
                    }),
              },
            }}
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
