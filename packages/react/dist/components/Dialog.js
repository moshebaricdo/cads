import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import { forwardRef } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { Button } from './Button.js';
import { CloseIconButton } from './CloseIconButton.js';

const SCRIM = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";
function DialogSurface({
  type,
  title,
  description,
  hasImage,
  image,
  topIconName,
  hasSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  isDismissable,
  onClose,
  children,
  className,
  surfaceRef
}) {
  const isIconTop = type === "iconTop";
  const isCustom = type === "customContent";
  return /* @__PURE__ */ jsxs(
    Box,
    {
      className,
      sx: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        isolation: "isolate"
      },
      children: [
        isIconTop ? /* @__PURE__ */ jsx(
          Box,
          {
            sx: {
              zIndex: 2,
              mb: "-30px",
              width: 64,
              height: 64,
              borderRadius: "var(--radius-round)",
              backgroundColor: "var(--background-brand-primary)",
              boxShadow: "0px 3px 3px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-neutral-white-fixed)"
            },
            children: /* @__PURE__ */ jsx(
              FaIcon,
              {
                name: topIconName || "smile",
                fontSize: "32px",
                style: { color: "var(--text-neutral-white-fixed)" }
              }
            )
          }
        ) : null,
        /* @__PURE__ */ jsxs(
          Box,
          {
            ref: surfaceRef,
            role: "dialog",
            "aria-modal": true,
            "data-cads-component": "Dialog",
            sx: {
              zIndex: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
              boxSizing: "border-box",
              width: "100%",
              minWidth: 630,
              maxWidth: 800,
              padding: isCustom ? "30px" : isIconTop ? "56px 56px 40px" : "40px 56px",
              backgroundColor: "var(--background-neutral-primary)",
              border: "1px solid var(--border-neutral-primary)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-lg)"
            },
            children: [
              isCustom ? /* @__PURE__ */ jsx(Box, { sx: { width: "100%", minHeight: 130 }, children }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(
                  Box,
                  {
                    sx: {
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "28px",
                      width: "100%"
                    },
                    children: [
                      type === "default" && hasImage ? /* @__PURE__ */ jsx(
                        Box,
                        {
                          sx: {
                            width: 260,
                            height: 138,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            borderRadius: "var(--radius-sm)",
                            backgroundColor: "var(--background-neutral-tertiary)",
                            flexShrink: 0
                          },
                          children: image
                        }
                      ) : null,
                      /* @__PURE__ */ jsxs(
                        Box,
                        {
                          sx: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "18px",
                            width: "100%",
                            textAlign: "center"
                          },
                          children: [
                            /* @__PURE__ */ jsx(
                              Box,
                              {
                                component: "h2",
                                sx: {
                                  m: 0,
                                  fontFamily: "var(--font-heading)",
                                  fontWeight: 600,
                                  fontSize: "var(--text-heading-xl)",
                                  lineHeight: "var(--leading-heading-xl)",
                                  letterSpacing: "var(--tracking-heading-display, -0.38px)",
                                  color: "var(--text-neutral-primary)"
                                },
                                children: title
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              Box,
                              {
                                sx: {
                                  fontFamily: "var(--font-body)",
                                  fontWeight: 400,
                                  fontSize: "var(--text-body-md)",
                                  lineHeight: "var(--leading-body-md)",
                                  color: "var(--text-neutral-tertiary)"
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
                /* @__PURE__ */ jsxs(Box, { sx: { display: "flex", gap: "8px", alignItems: "flex-start" }, children: [
                  hasSecondaryAction ? /* @__PURE__ */ jsx(
                    Button,
                    {
                      size: "medium",
                      variant: "outlined",
                      color: "secondary",
                      onClick: onSecondaryAction,
                      children: secondaryActionLabel
                    }
                  ) : null,
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
                ] })
              ] }),
              isDismissable ? /* @__PURE__ */ jsx(
                CloseIconButton,
                {
                  onClick: onClose,
                  size: "large",
                  color: "secondary",
                  sx: {
                    position: "absolute",
                    top: 7,
                    right: 7
                  }
                }
              ) : null
            ]
          }
        )
      ]
    }
  );
}
const Dialog = forwardRef(function Dialog2({
  type = "default",
  title = "Dialog Title",
  description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
  hasImage = false,
  image,
  topIconName = "smile",
  hasSecondaryAction = true,
  primaryActionLabel = "Button",
  secondaryActionLabel = "Button",
  onPrimaryAction,
  onSecondaryAction,
  isDismissable = true,
  onClose,
  children,
  open = false,
  surfaceOnly = false,
  className
}, ref) {
  const surface = /* @__PURE__ */ jsx(
    DialogSurface,
    {
      surfaceRef: ref,
      type,
      title,
      description,
      hasImage,
      image,
      topIconName,
      hasSecondaryAction,
      primaryActionLabel,
      secondaryActionLabel,
      onPrimaryAction,
      onSecondaryAction,
      isDismissable,
      onClose,
      className,
      children
    }
  );
  if (surfaceOnly) {
    return /* @__PURE__ */ jsx(
      Box,
      {
        sx: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: "56px 24px",
          backgroundColor: SCRIM,
          minHeight: 360
        },
        children: surface
      }
    );
  }
  return /* @__PURE__ */ jsx(
    MuiDialog,
    {
      open,
      onClose: (_e, _reason) => onClose?.(),
      maxWidth: false,
      slotProps: {
        backdrop: {
          sx: { backgroundColor: SCRIM }
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
            maxWidth: "none",
            m: 0
          }
        }
      },
      children: surface
    }
  );
});

export { Dialog };
//# sourceMappingURL=Dialog.js.map
//# sourceMappingURL=Dialog.js.map