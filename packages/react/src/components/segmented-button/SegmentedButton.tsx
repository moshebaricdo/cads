import ButtonBase from "@mui/material/ButtonBase";
import {
  Fragment,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import { SEGMENTED_SIZE } from "../../shared/controlSize";
import { Tooltip } from "../tooltip";
import styles from "./segmentedButton.module.scss";
import type {
  SegmentedButtonProps,
  SegmentedButtonSize,
} from "./types";

export type {
  SegmentedButtonOption,
  SegmentedButtonProps,
  SegmentedButtonSize,
} from "./types";

function segmentCornerVars(
  index: number,
  count: number,
): CSSProperties {
  const r = "var(--shape-sm)";
  const isFirst = index === 0;
  const isLast = index === count - 1;
  if (isFirst && isLast) {
    return { "--seg-tl": r, "--seg-tr": r, "--seg-bl": r, "--seg-br": r } as CSSProperties;
  }
  if (isFirst) {
    return { "--seg-tl": r, "--seg-tr": "0", "--seg-bl": r, "--seg-br": "0" } as CSSProperties;
  }
  if (isLast) {
    return { "--seg-tl": "0", "--seg-tr": r, "--seg-bl": "0", "--seg-br": r } as CSSProperties;
  }
  return { "--seg-tl": "0", "--seg-tr": "0", "--seg-bl": "0", "--seg-br": "0" } as CSSProperties;
}

function segmentVars(
  size: SegmentedButtonSize,
  iconOnly: boolean,
  selected: boolean,
  index: number,
  count: number,
): CSSProperties {
  const dims = SEGMENTED_SIZE[size];
  const unselectedBorder = "var(--border-neutral-secondary)";
  const corners = segmentCornerVars(index, count);

  return {
    ...corners,
    "--seg-height": dims.height,
    "--seg-px": iconOnly ? dims.iconOnlyPadding : dims.paddingInline,
    "--seg-py": iconOnly ? dims.iconOnlyPadding : dims.paddingBlock,
    "--seg-gap": iconOnly ? "0" : dims.gap,
    "--seg-font-size": dims.fontSize,
    "--seg-line-height": dims.lineHeight,
    "--seg-flex": iconOnly ? "0 0 auto" : "1 1 auto",
    "--seg-width": iconOnly ? dims.height : undefined,
    "--seg-z": selected ? "1" : "0",
    "--seg-bg": selected
      ? "var(--background-selected-primary)"
      : "var(--background-neutral-primary)",
    "--seg-fg": selected
      ? "var(--text-selected-primary)"
      : "var(--text-neutral-primary)",
    "--seg-border": selected
      ? "var(--border-selected-primary)"
      : unselectedBorder,
    "--seg-bg-hover": selected
      ? "var(--background-selected-primary)"
      : "var(--background-neutral-tertiary)",
    "--seg-border-hover": selected
      ? "var(--border-selected-strong)"
      : unselectedBorder,
    "--seg-bg-press": selected
      ? "var(--background-selected-strong)"
      : "var(--background-neutral-tertiary)",
    "--seg-border-press": selected
      ? "var(--border-selected-strong)"
      : unselectedBorder,
    "--seg-fg-press": selected
      ? "var(--text-selected-primary)"
      : "var(--text-neutral-tertiary)",
    "--seg-focus-ring": selected
      ? "var(--border-focused-inverse)"
      : "var(--border-focused-primary)",
    "--seg-bg-focus": selected
      ? "var(--background-selected-primary)"
      : "var(--background-brand-light)",
    "--seg-disabled-bg": selected
      ? "var(--background-selected-primary)"
      : "transparent",
    "--seg-disabled-border": selected
      ? "var(--border-selected-primary)"
      : "var(--border-disabled-neutral)",
    "--seg-disabled-fg": selected
      ? "var(--text-selected-primary)"
      : "var(--text-disabled-neutral)",
  } as CSSProperties;
}

function segmentAccessibleName(
  iconOnly: boolean,
  label: ReactNode,
  tooltip: ReactNode | undefined,
): string | undefined {
  if (!iconOnly) return undefined;
  if (typeof label === "string" && label.trim()) return label;
  if (typeof tooltip === "string" && tooltip.trim()) return tooltip;
  return undefined;
}

/** MUI has no native ToggleButton tooltip — wrap like their docs, host when disabled. */
function withSegmentTooltip(
  tooltip: ReactNode | undefined,
  isDisabled: boolean,
  segment: ReactElement,
  vars: CSSProperties,
): ReactElement {
  if (tooltip == null || tooltip === false || tooltip === "") return segment;

  const trigger = isDisabled ? (
    <span className={styles.segmentTooltipHost} style={vars}>
      {segment}
    </span>
  ) : (
    segment
  );

  return (
    <Tooltip title={tooltip} placement="bottom">
      {trigger}
    </Tooltip>
  );
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
      setFocusedIndex(selectedFocusableIndex);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        className={className ? `${styles.group} ${className}` : styles.group}
        onBlur={onGroupBlur}
      >
        {options.map((option, index) => {
          const selected = option.value === value;
          const isDisabled = Boolean(disabled || option.disabled);
          const startIcon = option.iconName ? (
            <FaIcon name={option.iconName} fontSize={dims.iconPx} />
          ) : null;
          const endIcon = option.endIconName ? (
            <FaIcon name={option.endIconName} fontSize={dims.iconPx} />
          ) : null;
          const vars = segmentVars(size, iconOnly, selected, index, options.length);
          const accessibleName = segmentAccessibleName(
            iconOnly,
            option.label,
            option.tooltip,
          );

          const segment = (
            <ButtonBase
              ref={(node) => {
                segmentRefs.current[index] = node;
              }}
              role="radio"
              aria-checked={selected}
              aria-label={accessibleName}
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
              className={styles.segment}
              style={vars}
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

          return (
            <Fragment key={option.value}>
              {withSegmentTooltip(option.tooltip, isDisabled, segment, vars)}
            </Fragment>
          );
        })}
      </div>
    );
  },
);
