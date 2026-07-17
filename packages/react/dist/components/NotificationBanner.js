import { jsxs, jsx } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { NOTIFICATION_BANNER_CHROME } from '../shared/controlSize.js';
import { messagingChrome, resolveMessagingIconName } from '../shared/messagingSentiment.js';
import { Button } from './Button.js';
import { CloseIconButton } from './CloseIconButton.js';

function resolveActionLabel(label) {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}
const NotificationBanner = forwardRef(function NotificationBanner2({
  sentiment = "brand",
  fillStyle = "none",
  title,
  description,
  iconName = "face-smile",
  hasPrimaryAction = true,
  hasSecondaryAction = true,
  primaryActionLabel = "Button",
  secondaryActionLabel = "Button",
  onPrimaryAction,
  onSecondaryAction,
  isDismissible = false,
  onClose,
  fullWidth = true,
  className,
  role = "region"
}, ref) {
  const chrome = messagingChrome(sentiment);
  const tinted = fillStyle === "color";
  const resolvedIcon = resolveMessagingIconName(iconName);
  const surfaceBg = tinted ? sentiment === "neutral" ? "var(--background-neutral-secondary)" : chrome.background : "var(--background-neutral-primary)";
  const surfaceBorder = tinted ? chrome.borderPrimary : "var(--border-neutral-primary)";
  const iconRing = sentiment === "neutral" ? "var(--border-neutral-secondary)" : chrome.borderPrimary;
  const iconColor = sentiment === "neutral" ? "var(--text-neutral-tertiary)" : chrome.icon;
  const primaryButtonColor = tinted ? "secondary" : "primary";
  const secondaryBorderColor = tinted ? "var(--border-neutral-solid)" : void 0;
  const primaryLabel = resolveActionLabel(primaryActionLabel);
  const secondaryLabel = resolveActionLabel(secondaryActionLabel);
  return /* @__PURE__ */ jsxs(
    Box,
    {
      ref,
      role,
      className,
      "data-cads-component": "NotificationBanner",
      sx: {
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        width: fullWidth ? "100%" : "fit-content",
        maxWidth: "100%",
        padding: NOTIFICATION_BANNER_CHROME.padding,
        gap: NOTIFICATION_BANNER_CHROME.gap,
        borderRadius: NOTIFICATION_BANNER_CHROME.radius,
        border: `1px solid ${surfaceBorder}`,
        backgroundColor: surfaceBg,
        overflow: "hidden",
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
              gap: NOTIFICATION_BANNER_CHROME.contentGap,
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    width: NOTIFICATION_BANNER_CHROME.iconSize,
                    height: NOTIFICATION_BANNER_CHROME.iconSize,
                    borderRadius: "var(--radius-round)",
                    border: `${NOTIFICATION_BANNER_CHROME.iconBorder} solid ${iconRing}`,
                    backgroundColor: "var(--background-neutral-primary)",
                    color: iconColor,
                    lineHeight: 1,
                    "& > *": { display: "block", lineHeight: 1 }
                  },
                  "aria-hidden": true,
                  children: /* @__PURE__ */ jsx(
                    FaIcon,
                    {
                      name: resolvedIcon,
                      fontSize: NOTIFICATION_BANNER_CHROME.iconPx
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs(
                Box,
                {
                  sx: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: "1 1 auto",
                    minWidth: 0,
                    gap: "0.125rem"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      Box,
                      {
                        component: "p",
                        sx: {
                          m: 0,
                          color: "var(--text-neutral-primary)",
                          fontSize: NOTIFICATION_BANNER_CHROME.titleSize,
                          lineHeight: NOTIFICATION_BANNER_CHROME.titleLineHeight,
                          fontWeight: "var(--font-weight-semibold)"
                        },
                        children: title
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Box,
                      {
                        component: "p",
                        sx: {
                          m: 0,
                          color: "var(--text-neutral-secondary)",
                          fontSize: NOTIFICATION_BANNER_CHROME.descriptionSize,
                          lineHeight: NOTIFICATION_BANNER_CHROME.descriptionLineHeight,
                          fontWeight: "var(--font-weight-normal)"
                        },
                        children: description
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        hasPrimaryAction || hasSecondaryAction || isDismissible ? /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              gap: NOTIFICATION_BANNER_CHROME.actionGap
            },
            children: [
              hasPrimaryAction || hasSecondaryAction ? /* @__PURE__ */ jsxs(
                Box,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: NOTIFICATION_BANNER_CHROME.buttonGap
                  },
                  children: [
                    hasSecondaryAction ? /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outlined",
                        color: "secondary",
                        size: "small",
                        onClick: onSecondaryAction,
                        sx: secondaryBorderColor ? {
                          borderColor: secondaryBorderColor,
                          "&:hover": { borderColor: secondaryBorderColor }
                        } : void 0,
                        children: secondaryLabel
                      }
                    ) : null,
                    hasPrimaryAction ? /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "contained",
                        color: primaryButtonColor,
                        size: "small",
                        onClick: onPrimaryAction,
                        children: primaryLabel
                      }
                    ) : null
                  ]
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

export { NotificationBanner };
//# sourceMappingURL=NotificationBanner.js.map
//# sourceMappingURL=NotificationBanner.js.map