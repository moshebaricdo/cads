import { jsx, jsxs } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import { forwardRef } from 'react';
import { Button } from './Button.js';
import { CloseIconButton } from './CloseIconButton.js';

const SCRIM = "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";
function ModalSurface({
  type,
  title,
  body,
  image,
  children,
  hasSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  isDismissable,
  onClose,
  className,
  surfaceRef
}) {
  const defaultBody = body ?? "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";
  return /* @__PURE__ */ jsxs(
    Box,
    {
      ref: surfaceRef,
      className,
      "data-cads-component": "Modal",
      role: "dialog",
      "aria-modal": true,
      sx: {
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 800,
        overflow: "hidden",
        backgroundColor: "var(--background-neutral-primary)",
        border: "1px solid var(--border-neutral-primary)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-lg)"
      },
      children: [
        /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              boxSizing: "border-box",
              pl: "24px",
              pr: "20px",
              py: "18px",
              borderBottom: "1px solid var(--border-neutral-primary)"
            },
            children: [
              /* @__PURE__ */ jsx(
                Box,
                {
                  component: "h2",
                  sx: {
                    m: 0,
                    flex: 1,
                    minWidth: 0,
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "var(--text-heading-lg)",
                    lineHeight: "var(--leading-heading-lg)",
                    color: "var(--text-neutral-primary)"
                  },
                  children: title
                }
              ),
              isDismissable ? /* @__PURE__ */ jsx(
                CloseIconButton,
                {
                  onClick: onClose,
                  size: "large",
                  color: "secondary"
                }
              ) : null
            ]
          }
        ),
        type === "default" ? /* @__PURE__ */ jsx(Box, { sx: { p: "24px", width: "100%", boxSizing: "border-box" }, children: children ?? /* @__PURE__ */ jsx(
          Box,
          {
            sx: {
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-md)",
              lineHeight: "var(--leading-body-md)",
              color: "var(--text-neutral-primary)"
            },
            children: defaultBody
          }
        ) }) : null,
        type === "verticalImage" ? /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              p: "24px",
              width: "100%",
              boxSizing: "border-box"
            },
            children: [
              /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    width: "100%",
                    height: 200,
                    minHeight: 200,
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--background-neutral-tertiary)",
                    overflow: "hidden"
                  },
                  children: image
                }
              ),
              /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body-md)",
                    lineHeight: "var(--leading-body-md)",
                    color: "var(--text-neutral-primary)"
                  },
                  children: defaultBody
                }
              )
            ]
          }
        ) : null,
        type === "horizontalImage" ? /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              gap: "18px",
              p: "24px",
              width: "100%",
              boxSizing: "border-box"
            },
            children: [
              /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    flex: "1 0 0",
                    minWidth: 200,
                    height: 200,
                    minHeight: 200,
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--background-neutral-tertiary)",
                    overflow: "hidden"
                  },
                  children: image
                }
              ),
              /* @__PURE__ */ jsx(
                Box,
                {
                  sx: {
                    flex: "1 0 0",
                    minWidth: 200,
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body-md)",
                    lineHeight: "var(--leading-body-md)",
                    color: "var(--text-neutral-primary)"
                  },
                  children: defaultBody
                }
              )
            ]
          }
        ) : null,
        /* @__PURE__ */ jsxs(
          Box,
          {
            sx: {
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              width: "100%",
              boxSizing: "border-box",
              pl: "24px",
              pr: "20px",
              py: "18px",
              borderTop: "1px solid var(--border-neutral-primary)"
            },
            children: [
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
            ]
          }
        )
      ]
    }
  );
}
const Modal = forwardRef(function Modal2({
  type = "default",
  title = "Title",
  body,
  image,
  children,
  hasSecondaryAction = true,
  primaryActionLabel = "Button",
  secondaryActionLabel = "Button",
  onPrimaryAction,
  onSecondaryAction,
  isDismissable = true,
  onClose,
  open = false,
  surfaceOnly = false,
  className
}, ref) {
  const surface = /* @__PURE__ */ jsx(
    ModalSurface,
    {
      surfaceRef: ref,
      type,
      title,
      body,
      image,
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
          minHeight: 400,
          width: "100%",
          maxWidth: 800
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
      fullWidth: true,
      slotProps: {
        backdrop: {
          sx: { backgroundColor: SCRIM }
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
            maxWidth: 800,
            width: "100%",
            m: "24px"
          }
        }
      },
      children: surface
    }
  );
});

export { Modal };
//# sourceMappingURL=Modal.js.map
//# sourceMappingURL=Modal.js.map