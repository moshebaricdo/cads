import { jsx } from 'react/jsx-runtime';
import ButtonBase from '@mui/material/ButtonBase';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { FOCUS_RING } from '../shared/controlSize.js';
import { Tooltip } from './Tooltip.js';

const ICON_TOOLTIP_ICON_PX = {
  large: "1.125rem",
  // 18px
  medium: "1rem",
  // 16px
  small: "0.875rem",
  // 14px
  extraSmall: "0.75rem"
  // 12px
};
const ICON_TOOLTIP_COLOR = {
  primary: "var(--text-brand-primary)",
  secondary: "var(--text-neutral-primary)",
  tertiary: "var(--text-neutral-quaternary)"
};
const IconTooltip = forwardRef(
  function IconTooltip2({
    iconName = "circle-info",
    color = "tertiary",
    size = "medium",
    placement = "top",
    hasCaret = true,
    title,
    triggerProps,
    "aria-label": ariaLabelProp,
    ...rest
  }, ref) {
    const ariaLabel = ariaLabelProp ?? (typeof title === "string" ? title : void 0);
    if (process.env.NODE_ENV !== "production" && !ariaLabel) {
      console.warn(
        "[CADS IconTooltip] Provide `aria-label` when `title` is not a plain string \u2014 the trigger needs an accessible name."
      );
    }
    const iconPx = ICON_TOOLTIP_ICON_PX[size];
    const { sx: triggerSx, ...triggerRest } = triggerProps ?? {};
    return /* @__PURE__ */ jsx(
      Tooltip,
      {
        title,
        placement,
        hasCaret,
        ...rest,
        children: /* @__PURE__ */ jsx(
          ButtonBase,
          {
            ref,
            type: "button",
            disableRipple: true,
            disableTouchRipple: true,
            focusRipple: false,
            "aria-label": ariaLabel,
            "data-cads-component": "IconTooltip",
            ...triggerRest,
            sx: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: iconPx,
              height: iconPx,
              minWidth: 0,
              padding: 0,
              borderRadius: "var(--radius-sm)",
              color: ICON_TOOLTIP_COLOR[color],
              backgroundColor: "transparent",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "transparent"
              },
              "&:active": {
                backgroundColor: "transparent"
              },
              "&.Mui-focusVisible": {
                boxShadow: FOCUS_RING
              },
              "&.Mui-disabled": {
                color: "var(--text-disabled-neutral)",
                opacity: 1
              },
              ...triggerSx ?? {}
            },
            children: /* @__PURE__ */ jsx(FaIcon, { name: iconName, fontSize: iconPx })
          }
        )
      }
    );
  }
);

export { IconTooltip };
//# sourceMappingURL=IconTooltip.js.map
//# sourceMappingURL=IconTooltip.js.map