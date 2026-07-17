import { jsxs, jsx } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { TOAST_CHROME } from '../shared/controlSize.js';
import { messagingChrome, defaultStatusIcon, resolveMessagingIconName } from '../shared/messagingSentiment.js';
import { Button } from './Button.js';
import { CloseIconButton } from './CloseIconButton.js';

function resolveActionLabel(label) {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}
const Toast = forwardRef(function Toast2({
  sentiment = "primary",
  children = "This is a toast.",
  hasIcon = true,
  iconName,
  hasAction = false,
  actionLabel = "Button",
  actionStartIconName,
  actionEndIconName,
  onAction,
  isDismissible = true,
  onClose,
  className,
  role = "status"
}, ref) {
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
      "data-cads-component": "Toast",
      sx: {
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: TOAST_CHROME.width,
        maxWidth: "100%",
        paddingInline: TOAST_CHROME.paddingInline,
        paddingBlock: TOAST_CHROME.paddingBlock,
        gap: TOAST_CHROME.gap,
        borderRadius: TOAST_CHROME.radius,
        border: `1px solid ${chrome.border}`,
        backgroundColor: chrome.background,
        boxShadow: TOAST_CHROME.shadow,
        fontFamily: "var(--font-body)"
      },
      children: [
        /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              flex: "1 1 auto",
              alignItems: "center",
              gap: TOAST_CHROME.contentGap,
              minWidth: 0,
              color: "var(--text-neutral-primary)"
            },
            children: [
              hasIcon ? /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: TOAST_CHROME.iconSlot,
                    color: chrome.icon,
                    lineHeight: 1,
                    "& > *": { display: "block", lineHeight: 1 }
                  },
                  "aria-hidden": true,
                  children: /* @__PURE__ */ jsx(FaIcon, { name: resolvedIcon, fontSize: TOAST_CHROME.iconPx })
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
                    fontSize: TOAST_CHROME.fontSize,
                    lineHeight: TOAST_CHROME.lineHeight,
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
              flexShrink: 0,
              gap: TOAST_CHROME.actionGap
            },
            children: [
              hasAction ? /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outlined",
                  color: "secondary",
                  size: "small",
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
                  color: sentiment === "primary" ? "brand" : sentiment === "neutral" ? "secondary" : sentiment,
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

export { Toast };
//# sourceMappingURL=Toast.js.map
//# sourceMappingURL=Toast.js.map