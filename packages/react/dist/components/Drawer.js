import { jsx, jsxs } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import { forwardRef } from 'react';
import { Button } from './Button.js';
import { CloseIconButton } from './CloseIconButton.js';

function DrawerSurface({
  type,
  title,
  description,
  hasDescription,
  hasActionRow,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  children,
  isDismissible,
  onClose,
  className,
  surfaceRef
}) {
  return /* @__PURE__ */ jsxs(
    Box,
    {
      ref: surfaceRef,
      className,
      "data-cads-component": "Drawer",
      role: "dialog",
      "aria-modal": false,
      sx: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        width: "100%",
        gap: "10px",
        pt: "40px",
        pb: "48px",
        px: "10px",
        backgroundColor: "var(--background-neutral-secondary)",
        borderTop: "1px solid var(--border-neutral-primary)",
        // Medium elevation cast upward (drawer sits at the bottom edge).
        boxShadow: "0 -10px 15px -3px rgb(0 0 0 / 10%), 0 -4px 6px -4px rgb(0 0 0 / 10%)"
      },
      children: [
        /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              flex: 1,
              minWidth: 0,
              maxWidth: 1160,
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsxs(
                Box,
                {
                  sx: {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    width: "100%",
                    maxWidth: 700,
                    textAlign: "center",
                    color: "var(--text-neutral-primary)"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      Box,
                      {
                        component: "h2",
                        sx: {
                          m: 0,
                          width: "100%",
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          fontSize: "var(--text-heading-lg)",
                          lineHeight: "var(--leading-heading-lg)"
                        },
                        children: title
                      }
                    ),
                    hasDescription ? /* @__PURE__ */ jsx(
                      Box,
                      {
                        sx: {
                          width: "100%",
                          fontFamily: "var(--font-body)",
                          fontWeight: 400,
                          fontSize: "var(--text-body-md)",
                          lineHeight: "var(--leading-body-md)"
                        },
                        children: description
                      }
                    ) : null
                  ]
                }
              ),
              type === "customContent" ? /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    width: "100%",
                    maxWidth: 1160,
                    minWidth: 500,
                    minHeight: 72,
                    boxSizing: "border-box",
                    backgroundColor: "var(--background-neutral-primary)",
                    border: "1px solid var(--border-neutral-primary)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden"
                  },
                  children
                }
              ) : null,
              hasActionRow ? /* @__PURE__ */ jsxs(
                Box,
                {
                  sx: {
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    width: "100%"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        size: "medium",
                        variant: "outlined",
                        color: "secondary",
                        onClick: onSecondaryAction,
                        children: secondaryActionLabel
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        size: "medium",
                        variant: "contained",
                        color: "primary",
                        onClick: onPrimaryAction,
                        children: primaryActionLabel
                      }
                    )
                  ]
                }
              ) : null
            ]
          }
        ),
        isDismissible ? /* @__PURE__ */ jsx(
          CloseIconButton,
          {
            onClick: onClose,
            size: "large",
            color: "secondary",
            sx: {
              position: "absolute",
              top: 11,
              right: 11
            }
          }
        ) : null
      ]
    }
  );
}
const Drawer = forwardRef(function Drawer2({
  type = "textOnly",
  title = "This is a heading",
  description = "This is descriptive text.",
  hasDescription = true,
  hasActionRow = true,
  primaryActionLabel = "Button",
  secondaryActionLabel = "Button",
  onPrimaryAction,
  onSecondaryAction,
  children,
  isDismissible = true,
  onClose,
  open = false,
  surfaceOnly = false,
  className
}, ref) {
  const surface = /* @__PURE__ */ jsx(
    DrawerSurface,
    {
      surfaceRef: ref,
      type,
      title,
      description,
      hasDescription,
      hasActionRow,
      primaryActionLabel,
      secondaryActionLabel,
      onPrimaryAction,
      onSecondaryAction,
      isDismissible,
      onClose,
      className,
      children
    }
  );
  if (surfaceOnly) return surface;
  return /* @__PURE__ */ jsx(
    MuiDrawer,
    {
      anchor: "bottom",
      open,
      onClose: (_e, _reason) => onClose?.(),
      hideBackdrop: true,
      disableScrollLock: true,
      slotProps: {
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible"
          }
        }
      },
      children: surface
    }
  );
});

export { Drawer };
//# sourceMappingURL=Drawer.js.map
//# sourceMappingURL=Drawer.js.map