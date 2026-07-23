import { jsxs, jsx } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { TAG_SIZE } from '../shared/controlSize.js';
import { messagingChrome, resolveMessagingIconName } from '../shared/messagingSentiment.js';
import { CloseIconButton } from './CloseIconButton.js';

const Tag = forwardRef(function Tag2({
  color = "neutral",
  size = "large",
  label = "Tag",
  startIconName,
  endIconName,
  isDismissible = false,
  onClose,
  className
}, ref) {
  const dims = TAG_SIZE[size];
  const chrome = messagingChrome(color);
  const startName = startIconName ? resolveMessagingIconName(startIconName) : null;
  const endName = endIconName ? resolveMessagingIconName(endIconName) : null;
  return /* @__PURE__ */ jsxs(
    Box,
    {
      ref,
      className,
      "data-cads-component": "Tag",
      sx: {
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "border-box",
        height: dims.height,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        gap: dims.gap,
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${chrome.border}`,
        backgroundColor: chrome.background,
        color: chrome.label,
        fontFamily: "var(--font-body)",
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        fontWeight: "var(--font-weight-semibold)",
        whiteSpace: "nowrap"
      },
      children: [
        /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "inline-flex",
              alignItems: "center",
              gap: dims.contentGap,
              minWidth: 0
            },
            children: [
              startName ? /* @__PURE__ */ jsx(FaIcon, { name: startName, fontSize: dims.iconPx, "aria-hidden": true }) : null,
              /* @__PURE__ */ jsx(Box, { component: "span", sx: { minWidth: 0 }, children: label }),
              endName ? /* @__PURE__ */ jsx(FaIcon, { name: endName, fontSize: dims.iconPx, "aria-hidden": true }) : null
            ]
          }
        ),
        isDismissible ? /* @__PURE__ */ jsx(
          CloseIconButton,
          {
            size: size === "large" ? "medium" : size === "medium" ? "small" : "extraSmall",
            color: color === "neutral" ? "secondary" : color,
            onClick: onClose,
            sx: { width: dims.closeWidth }
          }
        ) : null
      ]
    }
  );
});

export { Tag };
//# sourceMappingURL=Tag.js.map
//# sourceMappingURL=Tag.js.map