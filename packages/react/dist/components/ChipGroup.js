import { jsx } from 'react/jsx-runtime';
import { forwardRef, useId, useState } from 'react';
import { FieldWrapper } from './FieldWrapper.js';
import { Chip } from './Chip.js';
import { CHIP_SIZE } from '../shared/controlSize.js';

const ChipGroup = forwardRef(
  function ChipGroup2({
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
    className
  }, ref) {
    const listId = useId();
    const [uncontrolled, setUncontrolled] = useState(
      defaultValue ?? []
    );
    const selected = valueProp ?? uncontrolled;
    const dims = CHIP_SIZE[size];
    const toggle = (optionValue) => {
      const next = selected.includes(optionValue) ? selected.filter((v) => v !== optionValue) : [...selected, optionValue];
      if (valueProp === void 0) setUncontrolled(next);
      onChange?.(next);
    };
    const wrap = /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        id: listId,
        role: "group",
        "aria-label": ariaLabel,
        className,
        style: {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: dims.groupGap
        },
        children: options.map((opt) => /* @__PURE__ */ jsx(
          Chip,
          {
            size,
            color,
            labelStyle,
            label: opt.label,
            selected: selected.includes(opt.value),
            startIconName: opt.startIconName,
            endIconName: opt.endIconName,
            disabled: disabled || opt.disabled,
            onClick: () => toggle(opt.value)
          },
          opt.value
        ))
      }
    );
    if (label == null && helperText == null) {
      return wrap;
    }
    return /* @__PURE__ */ jsx(
      FieldWrapper,
      {
        size,
        label,
        helperText,
        helperIconName,
        showHelper,
        disabled,
        children: wrap
      }
    );
  }
);

export { ChipGroup };
//# sourceMappingURL=ChipGroup.js.map
//# sourceMappingURL=ChipGroup.js.map