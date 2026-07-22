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
  SEGMENTED_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type SegmentedButtonSize = ControlSize;

export interface SegmentedButtonOption {
  value: string;
  label: ReactNode;
  iconName?: FaIconName;
  endIconName?: FaIconName;
  disabled?: boolean;
}

export interface SegmentedButtonProps {
  /**
   * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
   * @default "medium"
   */
  size?: SegmentedButtonSize;
  /** Currently selected value (exclusive). */
  value?: string;
  /** Uncontrolled default. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SegmentedButtonOption[];
  disabled?: boolean;
  /** Square icon-only segments (Figma `iconOnly`). */
  iconOnly?: boolean;
  "aria-label"?: string;
  className?: string;
}

function segmentCorners(
  index: number,
  count: number,
): {
  borderTopLeftRadius: string | number;
  borderTopRightRadius: string | number;
  borderBottomLeftRadius: string | number;
  borderBottomRightRadius: string | number;
} {
  const r = "var(--radius-sm)";
  const isFirst = index === 0;
  const isLast = index === count - 1;
  if (isFirst && isLast) {
    return {
      borderTopLeftRadius: r,
      borderTopRightRadius: r,
      borderBottomLeftRadius: r,
      borderBottomRightRadius: r,
    };
  }
  if (isFirst) {
    return {
      borderTopLeftRadius: r,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: r,
      borderBottomRightRadius: 0,
    };
  }
  if (isLast) {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: r,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: r,
    };
  }
  return {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  };
}

/**
 * CADS Segmented Button Group — mutually exclusive connected segments.
 * Building blocks map to Figma Segmented Button Block; consumers use this group.
 *
 * Spec: page `587:1268`, Group set `8027:2099` (key `bf599e1bc1d1e651be6aab5bf90ac6a7c26dcfd1`),
 * Block set `8000:4554` (key `d8dbdc672ccdc6755ae409e31e5517571424384e`).
 */
export const SegmentedButton = forwardRef<HTMLDivElement, SegmentedButtonProps>(
  function SegmentedButton(
    {
      size = "medium",
      value: valueProp,
      defaultValue,
      onChange,
      options,
      disabled,
      iconOnly = false,
      "aria-label": ariaLabel,
      className,
    },
    ref,
  ) {
    const dims = SEGMENTED_SIZE[size];
    const groupId = useId();
    const segmentRefs = useRef<Array<HTMLElement | null>>([]);
    const controlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = useState(
      defaultValue ?? options.find((option) => !option.disabled)?.value,
    );
    const value = controlled ? valueProp : uncontrolled;

    const selectValue = (next: string) => {
      if (!controlled) setUncontrolled(next);
      onChange?.(next);
    };

    /* Manual activation: arrows move focus only; Space/Enter commits selection. */
    const focusableIndexes = options
      .map((option, index) =>
        disabled || option.disabled ? -1 : index,
      )
      .filter((index) => index >= 0);

    const selectedFocusableIndex =
      focusableIndexes.find((index) => options[index]?.value === value) ??
      focusableIndexes[0] ??
      -1;

    const [focusedIndex, setFocusedIndex] = useState(selectedFocusableIndex);
    const tabStopIndex = focusableIndexes.includes(focusedIndex)
      ? focusedIndex
      : selectedFocusableIndex;

    /* Keep the Tab stop on the selected segment when selection changes externally. */
    useEffect(() => {
      setFocusedIndex(selectedFocusableIndex);
    }, [selectedFocusableIndex]);

    const focusSegment = (index: number) => {
      setFocusedIndex(index);
      segmentRefs.current[index]?.focus();
    };

    const moveFocus = (fromIndex: number, delta: number) => {
      if (focusableIndexes.length === 0) return;
      const currentPos = focusableIndexes.indexOf(fromIndex);
      const start = currentPos === -1 ? 0 : currentPos;
      const nextPos =
        (start + delta + focusableIndexes.length) % focusableIndexes.length;
      focusSegment(focusableIndexes[nextPos]!);
    };

    const activateSegment = (index: number) => {
      const option = options[index];
      if (!option || disabled || option.disabled) return;
      setFocusedIndex(index);
      selectValue(option.value);
    };

    const onSegmentKeyDown = (
      event: KeyboardEvent<HTMLElement>,
      index: number,
    ) => {
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
          if (first === undefined) break;
          focusSegment(first);
          break;
        }
        case "End": {
          event.preventDefault();
          const last = focusableIndexes[focusableIndexes.length - 1];
          if (last === undefined) break;
          focusSegment(last);
          break;
        }
        case " ":
        case "Enter": {
          event.preventDefault();
          activateSegment(index);
          break;
        }
        default:
          break;
      }
    };

    const onGroupBlur = (event: FocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget;
      if (next instanceof Node && event.currentTarget.contains(next)) return;
      /* Tab re-entry lands on the selected segment, not the last focused. */
      setFocusedIndex(selectedFocusableIndex);
    };

    /* Unselected border: Figma always uses neutral secondary (Group color=Primary only). */
    const unselectedBorder = "var(--border-neutral-secondary)";

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={className}
        onBlur={onGroupBlur}
        style={{
          display: "inline-flex",
          alignItems: "stretch",
          /* Figma Group itemSpacing: -1 — collapse shared borders */
          gap: 0,
          overflow: "hidden",
          borderRadius: "var(--radius-sm)",
        }}
      >
        {options.map((option, index) => {
          const selected = option.value === value;
          const isDisabled = Boolean(disabled || option.disabled);
          const corners = segmentCorners(index, options.length);
          const startIcon = option.iconName ? (
            <FaIcon name={option.iconName} fontSize={dims.iconPx} />
          ) : null;
          const endIcon = option.endIconName ? (
            <FaIcon name={option.endIconName} fontSize={dims.iconPx} />
          ) : null;

          return (
            <ButtonBase
              key={option.value}
              ref={(node) => {
                segmentRefs.current[index] = node;
              }}
              role="radio"
              aria-checked={selected}
              id={`${groupId}-${option.value}`}
              tabIndex={index === tabStopIndex ? 0 : -1}
              disabled={isDisabled}
              disableRipple
              onClick={() => {
                if (isDisabled) return;
                activateSegment(index);
              }}
              onFocus={() => {
                if (!isDisabled) setFocusedIndex(index);
              }}
              onKeyDown={(event) => onSegmentKeyDown(event, index)}
              sx={{
                flex: iconOnly ? "0 0 auto" : "1 1 auto",
                minWidth: dims.height,
                width: iconOnly ? dims.height : undefined,
                height: dims.height,
                paddingInline: iconOnly
                  ? dims.iconOnlyPadding
                  : dims.paddingInline,
                paddingBlock: iconOnly
                  ? dims.iconOnlyPadding
                  : dims.paddingBlock,
                gap: iconOnly ? 0 : dims.gap,
                boxSizing: "border-box",
                /* Overlap so adjacent 1px borders share a single hairline */
                marginLeft: index === 0 ? 0 : "-1px",
                border: `1px solid ${
                  selected
                    ? "var(--border-selected-primary)"
                    : unselectedBorder
                }`,
                ...corners,
                fontFamily: "var(--font-body)",
                /* Figma Body Semi Bold at every size — no labelStyle prop */
                fontWeight: "var(--font-weight-semibold)",
                fontSize: dims.fontSize,
                lineHeight: dims.lineHeight,
                textTransform: "none",
                whiteSpace: "nowrap",
                transition: TRANSITION_COLORS,
                backgroundColor: selected
                  ? "var(--background-selected-primary)"
                  : "var(--background-neutral-primary)",
                color: selected
                  ? "var(--text-selected-primary)"
                  : "var(--text-neutral-primary)",
                zIndex: selected ? 1 : 0,
                "&:hover": {
                  zIndex: 2,
                  /* Selected hover: fill stays primary; border strengthens (Figma). */
                  backgroundColor: selected
                    ? "var(--background-selected-primary)"
                    : "var(--background-neutral-tertiary)",
                  borderColor: selected
                    ? "var(--border-selected-strong)"
                    : unselectedBorder,
                },
                "&:active": {
                  zIndex: 2,
                  backgroundColor: selected
                    ? "var(--background-selected-strong)"
                    : "var(--background-neutral-tertiary)",
                  borderColor: selected
                    ? "var(--border-selected-strong)"
                    : unselectedBorder,
                },
                "&.Mui-focusVisible": {
                  zIndex: 3,
                  /* Figma uses a 2px border — outline + -2px offset avoids layout shift. */
                  outline: `2px solid ${
                    selected
                      ? "var(--border-focused-inverse)"
                      : "var(--border-focused-primary)"
                  }`,
                  outlineOffset: -2,
                  backgroundColor: selected
                    ? "var(--background-selected-primary)"
                    : "var(--background-brand-light)",
                },
                "&.Mui-disabled": {
                  opacity: 1,
                  /* Unselected disabled: transparent fill + disabled chrome.
                     Selected disabled: keep selected fill/border/text (Figma). */
                  ...(selected
                    ? {
                        backgroundColor: "var(--background-selected-primary)",
                        borderColor: "var(--border-selected-primary)",
                        color: "var(--text-selected-primary)",
                      }
                    : {
                        backgroundColor: "transparent",
                        borderColor: "var(--border-disabled-neutral)",
                        color: "var(--text-disabled-neutral)",
                      }),
                },
              }}
            >
              {iconOnly ? startIcon || endIcon : (
                <>
                  {startIcon}
                  {option.label}
                  {endIcon}
                </>
              )}
            </ButtonBase>
          );
        })}
      </div>
    );
  },
);
