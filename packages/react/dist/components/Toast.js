import { jsxs, jsx } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import MuiSnackbar from '@mui/material/Snackbar';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { TOAST_CHROME } from '../shared/controlSize.js';
import { messagingChrome, defaultStatusIcon, resolveMessagingIconName } from '../shared/messagingSentiment.js';
import { useExperimentalMotion, useSurfacePresence } from '../theme/experimentalMotion.js';
import { Button } from './Button.js';
import { CloseIconButton } from './CloseIconButton.js';

const DEFAULT_OFFSET_PX = 64;
function resolveActionLabel(label) {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}
function placementToAnchor(placement) {
  switch (placement) {
    case "topLeft":
      return { vertical: "top", horizontal: "left" };
    case "topCenter":
      return { vertical: "top", horizontal: "center" };
    case "topRight":
      return { vertical: "top", horizontal: "right" };
    case "bottomLeft":
      return { vertical: "bottom", horizontal: "left" };
    case "bottomRight":
      return { vertical: "bottom", horizontal: "right" };
    case "bottomCenter":
    default:
      return { vertical: "bottom", horizontal: "center" };
  }
}
function placementToSurfaceOrigin(placement) {
  switch (placement) {
    case "topLeft":
      return "top left";
    case "topCenter":
      return "top center";
    case "topRight":
      return "top right";
    case "bottomLeft":
      return "bottom left";
    case "bottomRight":
      return "bottom right";
    case "bottomCenter":
    default:
      return "bottom center";
  }
}
function snackbarHostStyle(placement, offset) {
  const { vertical, horizontal } = placementToAnchor(placement);
  return {
    width: "auto",
    maxWidth: `calc(100% - ${offset * (horizontal === "center" ? 2 : 1)}px)`,
    ...vertical === "top" ? { top: offset } : { bottom: offset },
    ...horizontal === "left" ? { left: offset, right: "auto", transform: "none" } : null,
    ...horizontal === "right" ? { right: offset, left: "auto", transform: "none" } : null,
    ...horizontal === "center" ? {
      left: "50%",
      right: "auto",
      transform: "translateX(-50%)"
    } : null
  };
}
const ToastSurface = forwardRef(
  function ToastSurface2({
    sentiment = "primary",
    children = "This is a toast.",
    iconName,
    hasAction = false,
    actionLabel = "Button",
    actionStartIconName,
    actionEndIconName,
    onAction,
    isDismissible = true,
    onClose,
    className,
    role = "status",
    surfaceExiting = false,
    surfaceOrigin = "bottom center"
  }, ref) {
    const chrome = messagingChrome(sentiment);
    const statusDefault = defaultStatusIcon(sentiment);
    const showIcon = iconName !== false;
    const resolvedIcon = showIcon ? resolveMessagingIconName(
      typeof iconName === "string" ? iconName : void 0,
      statusDefault ?? "face-smile"
    ) : null;
    const label = resolveActionLabel(actionLabel);
    return /* @__PURE__ */ jsxs(
      Box,
      {
        ref,
        role,
        className,
        "data-cads-component": "Toast",
        "data-cads-surface": "",
        ...surfaceExiting ? { "data-cads-surface-state": "exit" } : {},
        sx: {
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          /* Hug copy + actions (Figma’s 300px is the default-string size, not a cap). */
          width: "fit-content",
          maxWidth: "100%",
          flexShrink: 0,
          paddingInline: TOAST_CHROME.paddingInline,
          paddingBlock: TOAST_CHROME.paddingBlock,
          gap: TOAST_CHROME.gap,
          borderRadius: TOAST_CHROME.radius,
          border: `1px solid ${chrome.border}`,
          backgroundColor: chrome.background,
          boxShadow: TOAST_CHROME.shadow,
          fontFamily: "var(--font-body)",
          /* Surface recipe: grow from the pinned viewport edge. */
          "--cads-surface-origin": surfaceOrigin
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
                showIcon && resolvedIcon ? /* @__PURE__ */ jsx(
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
                      /* Prefer one-line hug; wrap only when maxWidth constrains. */
                      flex: "0 1 auto",
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
  }
);
const Toast = forwardRef(function Toast2({
  sentiment = "primary",
  children = "This is a toast.",
  iconName,
  hasAction = false,
  actionLabel = "Button",
  actionStartIconName,
  actionEndIconName,
  onAction,
  isDismissible = true,
  onClose,
  open: openProp,
  placement = "bottomCenter",
  offset = DEFAULT_OFFSET_PX,
  surfaceOnly,
  className,
  role = "status"
}, ref) {
  const experimentalMotion = useExperimentalMotion();
  const isSurfaceOnly = surfaceOnly ?? openProp === void 0;
  const open = Boolean(openProp);
  const { mounted: surfaceMounted, exiting: surfaceExiting } = useSurfacePresence(open);
  const surfaceOrigin = placementToSurfaceOrigin(placement);
  const anchorOrigin = placementToAnchor(placement);
  const surface = /* @__PURE__ */ jsx(
    ToastSurface,
    {
      ref,
      sentiment,
      iconName,
      hasAction,
      actionLabel,
      actionStartIconName,
      actionEndIconName,
      onAction,
      isDismissible,
      onClose,
      className,
      role,
      surfaceExiting: !isSurfaceOnly && surfaceExiting,
      surfaceOrigin,
      children
    }
  );
  if (isSurfaceOnly) {
    return surface;
  }
  return /* @__PURE__ */ jsx(
    MuiSnackbar,
    {
      open: surfaceMounted,
      anchorOrigin,
      onClose: (_event, reason) => {
        if (reason === "clickaway") return;
        onClose?.();
      },
      transitionDuration: experimentalMotion ? 0 : void 0,
      slotProps: {
        root: {
          style: snackbarHostStyle(placement, offset)
        }
      },
      children: surface
    }
  );
});

export { Toast };
//# sourceMappingURL=Toast.js.map
//# sourceMappingURL=Toast.js.map