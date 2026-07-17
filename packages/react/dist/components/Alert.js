import { jsxs, jsx } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { ALERT_SIZE } from '../shared/controlSize.js';
import { messagingChrome, defaultStatusIcon, resolveMessagingIconName } from '../shared/messagingSentiment.js';
import { Button } from './Button.js';
import { CloseIconButton } from './CloseIconButton.js';

function resolveActionLabel(label) {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}
const Alert = forwardRef(function Alert2({
  size = "large",
  sentiment = "brand",
  children = "This is an alert.",
  hasIcon = true,
  iconName,
  hasAction = false,
  actionLabel = "Button",
  actionStartIconName,
  actionEndIconName,
  onAction,
  isDismissible = false,
  onClose,
  fullWidth = true,
  className,
  role = "status"
}, ref) {
  const dims = ALERT_SIZE[size];
  const chrome = messagingChrome(sentiment);
  const statusDefault = defaultStatusIcon(sentiment);
  const resolvedIcon = resolveMessagingIconName(
    iconName,
    statusDefault ?? "face-smile"
  );
  const label = resolveActionLabel(actionLabel);
  return /* @__PURE__ */ jsxs(
    Box,
    {
      ref,
      role,
      className,
      "data-cads-component": "Alert",
      sx: {
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: fullWidth ? "100%" : "fit-content",
        maxWidth: "100%",
        minHeight: dims.minHeight,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        gap: dims.gap,
        borderRadius: "var(--radius-md)",
        border: `1px solid ${chrome.border}`,
        backgroundColor: chrome.background,
        fontFamily: "var(--font-body)"
      },
      children: [
        /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              flex: "1 1 auto",
              alignItems: "flex-start",
              gap: dims.contentGap,
              minWidth: 0
            },
            children: [
              hasIcon ? /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    // Match the text line-box height and center the FA glyph inside it.
                    // Figma uses iconWrap paddingTop for the same optical alignment;
                    // web FA metrics need the full line-box rather than a fixed pad.
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: dims.iconSlot,
                    height: dims.lineHeight,
                    color: chrome.icon,
                    lineHeight: 0
                  },
                  "aria-hidden": true,
                  children: /* @__PURE__ */ jsx(
                    FaIcon,
                    {
                      name: resolvedIcon,
                      fontSize: dims.iconPx,
                      style: {
                        width: dims.iconSlot,
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }
                    }
                  )
                }
              ) : null,
              /* @__PURE__ */ jsx(
                Box,
                {
                  component: "p",
                  sx: {
                    m: 0,
                    flex: "1 1 auto",
                    minWidth: 0,
                    color: "var(--text-neutral-primary)",
                    fontSize: dims.fontSize,
                    lineHeight: dims.lineHeight,
                    fontWeight: "var(--font-weight-normal)"
                  },
                  children
                }
              )
            ]
          }
        ),
        hasAction || isDismissible ? /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexShrink: 0,
              gap: dims.actionGap
            },
            children: [
              hasAction ? /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outlined",
                  color: "secondary",
                  size: dims.actionButtonSize,
                  startIconName: actionStartIconName,
                  endIconName: actionEndIconName,
                  onClick: onAction,
                  children: label
                }
              ) : null,
              isDismissible ? /* @__PURE__ */ jsx(
                CloseIconButton,
                {
                  size: "medium",
                  color: sentiment === "neutral" ? "secondary" : sentiment,
                  onClick: onClose
                }
              ) : null
            ]
          }
        ) : null
      ]
    }
  );
});

export { Alert };
//# sourceMappingURL=Alert.js.map
//# sourceMappingURL=Alert.js.map