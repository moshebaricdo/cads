import { forwardRef, useId, useState, type ReactNode } from "react";
import { FieldWrapper } from "./FieldWrapper";
import { Chip, type ChipColor, type ChipLabelStyle, type ChipSize } from "./Chip";
import { CHIP_SIZE } from "../shared/controlSize";
import type { FaIconName } from "../icons/faProRegularCodepoints";

export type ChipGroupSize = ChipSize;
export type ChipGroupColor = ChipColor;
export type ChipGroupLabelStyle = ChipLabelStyle;

export interface ChipGroupOption {
  value: string;
  label: ReactNode;
  startIcon?: boolean;
  endIcon?: boolean;
  startIconName?: FaIconName | (string & {});
  endIconName?: FaIconName | (string & {});
  disabled?: boolean;
}

export interface ChipGroupProps {
  /**
   * @default "medium"
   */
  size?: ChipGroupSize;
  /**
   * Unselected chip border treatment.
   * @default "primary"
   */
  color?: ChipGroupColor;
  /**
   * @default "thick"
   */
  labelStyle?: ChipGroupLabelStyle;
  label?: ReactNode;
  helperText?: ReactNode;
  helperIconName?: FaIconName | (string & {});
  /**
   * @default true
   */
  showHelper?: boolean;
  options: ChipGroupOption[];
  /** Multi-select selected values. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

/**
 * CADS Chip Group — labeled multi-select chips with Field Wrapper chrome.
 * Spec: Figma Chip Group `15953:3568` / key `65c61f6f006c06e27b293ca8f5e573d650c69c06`.
 */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(
  function ChipGroup(
    {
      size = "medium",
      color = "primary",
      labelStyle = "thick",
      label,
      helperText,
      helperIconName,
      showHelper = true,
      options,
      value: valueProp,
      defaultValue,
      onChange,
      disabled,
      "aria-label": ariaLabel,
      className,
    },
    ref,
  ) {
    const listId = useId();
    const [uncontrolled, setUncontrolled] = useState<string[]>(
      defaultValue ?? [],
    );
    const selected = valueProp ?? uncontrolled;
    const dims = CHIP_SIZE[size];

    const toggle = (optionValue: string) => {
      const next = selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue];
      if (valueProp === undefined) setUncontrolled(next);
      onChange?.(next);
    };

    const wrap = (
      <div
        ref={ref}
        id={listId}
        role="group"
        aria-label={ariaLabel}
        className={className}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: dims.groupGap,
        }}
      >
        {options.map((opt) => (
          <Chip
            key={opt.value}
            size={size}
            color={color}
            labelStyle={labelStyle}
            label={opt.label}
            selected={selected.includes(opt.value)}
            startIcon={opt.startIcon}
            endIcon={opt.endIcon}
            startIconName={opt.startIconName}
            endIconName={opt.endIconName}
            disabled={disabled || opt.disabled}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>
    );

    if (label == null && helperText == null) {
      return wrap;
    }

    return (
      <FieldWrapper
        size={size}
        label={label}
        helperText={helperText}
        helperIconName={helperIconName}
        showHelper={showHelper}
        disabled={disabled}
      >
        {wrap}
      </FieldWrapper>
    );
  },
);
