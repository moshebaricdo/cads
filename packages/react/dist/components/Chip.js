import { jsxs, jsx } from 'react/jsx-runtime';
import ButtonBase from '@mui/material/ButtonBase';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { CHIP_SIZE, FOCUS_RING, TRANSITION_COLORS } from '../shared/controlSize.js';

function resolveIconName(name) {
  if (!name || name === "smile") return "face-smile";
  return name;
}
const Chip = forwardRef(function Chip2({
  size = "medium",
  color = "primary",
  labelStyle = "thick",
  selected = false,
  label = "Chips",
  startIconName,
  endIconName,
  disabled,
  sx,
  ...rest
}, ref) {
  const dims = CHIP_SIZE[size];
  const borderDefault = color === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
  const startName = startIconName ? resolveIconName(startIconName) : null;
  const endName = endIconName ? resolveIconName(endIconName) : null;
  return /* @__PURE__ */ jsxs(
    ButtonBase,
    {
      ref,
      disabled,
      focusRipple: false,
      disableRipple: true,
      "aria-pressed": selected,
      sx: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: dims.gap,
        height: dims.height,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        borderRadius: "var(--radius-round)",
        border: selected ? "1px solid transparent" : `1px solid ${borderDefault}`,
        backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-neutral-primary)",
        color: selected ? "var(--text-selected-primary)" : "var(--text-neutral-primary)",
        fontFamily: "var(--font-body)",
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        fontWeight: labelStyle === "thick" ? "var(--font-weight-semibold)" : "var(--font-weight-normal)",
        transition: TRANSITION_COLORS,
        overflow: "hidden",
        whiteSpace: "nowrap",
        "&:hover": disabled ? void 0 : {
          backgroundColor: selected ? "var(--background-selected-strong)" : "var(--background-neutral-tertiary)",
          borderColor: selected ? "transparent" : borderDefault
        },
        "&:active": disabled ? void 0 : selected ? {
          backgroundColor: "var(--background-selected-strong)",
          border: "2px solid var(--border-selected-strong)",
          paddingInline: `calc(${dims.paddingInline} - 1px)`,
          paddingBlock: `calc(${dims.paddingBlock} - 1px)`
        } : {
          backgroundColor: "var(--background-brand-light)",
          borderColor: "var(--border-selected-primary)"
        },
        "&.Mui-focusVisible": {
          boxShadow: FOCUS_RING
        },
        "&.Mui-disabled": {
          backgroundColor: selected ? "var(--background-disabled-neutral)" : "var(--background-neutral-primary)",
          border: selected ? "1px solid transparent" : "1px solid var(--border-disabled-neutral)",
          color: selected ? "var(--text-disabled-neutral-inverse)" : "var(--text-disabled-neutral)"
        },
        ...sx ?? {}
      },
      ...rest,
      children: [
        startName ? /* @__PURE__ */ jsx(FaIcon, { name: startName, fontSize: dims.iconPx }) : null,
        label,
        endName ? /* @__PURE__ */ jsx(FaIcon, { name: endName, fontSize: dims.iconPx }) : null
      ]
    }
  );
});

export { Chip };
//# sourceMappingURL=Chip.js.map
//# sourceMappingURL=Chip.js.map