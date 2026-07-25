import { forwardRef, useId, useState, type CSSProperties } from "react";
import { CHIP_SIZE } from "../../shared/controlSize";
import { Chip } from "../chip/index";
import { FieldWrapper } from "../field-wrapper/index";
import styles from "./chipGroup.module.scss";
import type { ChipGroupProps } from "./types";

export type {
  ChipGroupColor,
  ChipGroupLabelStyle,
  ChipGroupOption,
  ChipGroupProps,
  ChipGroupSize,
} from "./types";

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

    const groupVars = {
      "--cg-gap": dims.groupGap,
    } as CSSProperties;

    const wrap = (
      <div
        ref={ref}
        id={listId}
        role="group"
        aria-label={ariaLabel}
        className={className ? `${styles.group} ${className}` : styles.group}
        style={groupVars}
      >
        {options.map((opt) => (
          <Chip
            key={opt.value}
            size={size}
            color={color}
            labelStyle={labelStyle}
            label={opt.label}
            selected={selected.includes(opt.value)}
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
