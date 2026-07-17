import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import { forwardRef, useId, useState, isValidElement, cloneElement } from 'react';
import { Button } from './Button.js';
import { CloseIconButton } from './CloseIconButton.js';

function parseCaret(placement) {
  if (placement.startsWith("bottom")) {
    const align2 = placement === "bottomLeft" ? "start" : placement === "bottomRight" ? "end" : "center";
    return { side: "bottom", align: align2 };
  }
  if (placement.startsWith("top")) {
    const align2 = placement === "topLeft" ? "start" : placement === "topRight" ? "end" : "center";
    return { side: "top", align: align2 };
  }
  if (placement.startsWith("left")) {
    const align2 = placement === "leftTop" ? "start" : placement === "leftBottom" ? "end" : "center";
    return { side: "left", align: align2 };
  }
  const align = placement === "rightTop" ? "start" : placement === "rightBottom" ? "end" : "center";
  return { side: "right", align };
}
function Caret({
  side,
  align
}) {
  const horizontal = side === "top" || side === "bottom";
  const justify = align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";
  const alignItems = align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";
  return /* @__PURE__ */ jsx(
    Box,
    {
      "aria-hidden": true,
      sx: {
        display: "flex",
        flexShrink: 0,
        zIndex: 1,
        ...horizontal ? {
          width: "100%",
          justifyContent: justify,
          px: "20px",
          ...side === "bottom" ? { mt: "-1px" } : { mb: "-1px" }
        } : {
          alignSelf: "stretch",
          alignItems,
          py: "20px",
          ...side === "right" ? { ml: "-1px" } : { mr: "-1px" }
        }
      },
      children: /* @__PURE__ */ jsx(
        Box,
        {
          sx: {
            width: 12,
            height: 12,
            backgroundColor: "var(--background-neutral-primary)",
            borderRight: "1px solid var(--border-neutral-primary)",
            borderBottom: "1px solid var(--border-neutral-primary)",
            transform: side === "bottom" ? "rotate(45deg)" : side === "top" ? "rotate(225deg)" : side === "left" ? "rotate(135deg)" : "rotate(-45deg)",
            margin: side === "bottom" ? "-6px 0 0" : side === "top" ? "0 0 -6px" : side === "left" ? "0 -6px 0 0" : "0 0 0 -6px"
          }
        }
      )
    }
  );
}
const Popover = forwardRef(
  function Popover2({
    content = "textOnly",
    caretPlacement = "bottomLeft",
    hasCaret = true,
    title = "This is a really long title",
    body = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    image,
    customContent,
    hasActionRow = true,
    hasStepper = true,
    stepperText = "1/3",
    hasPrimaryAction = true,
    hasSecondaryAction = true,
    primaryActionLabel = "Next",
    secondaryActionLabel = "Back",
    onPrimaryAction,
    onSecondaryAction,
    isDismissible = true,
    onClose,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    children,
    className,
    surfaceOnly
  }, ref) {
    const labelId = useId();
    const [anchorEl, setAnchorEl] = useState(null);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const controlled = openProp !== void 0;
    const open = controlled ? Boolean(openProp) : uncontrolledOpen;
    const trigger = isValidElement(children) && children.type !== void 0 ? children : null;
    const customFromChildren = !trigger && children != null ? children : null;
    const resolvedCustom = customContent ?? customFromChildren;
    const isSurfaceOnly = surfaceOnly ?? (trigger == null && openProp == null && !defaultOpen);
    const setOpen = (next) => {
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) onClose?.();
    };
    const { side, align } = parseCaret(caretPlacement);
    const showActions = content !== "custom" && hasActionRow && (hasPrimaryAction || hasSecondaryAction || hasStepper);
    const card = /* @__PURE__ */ jsxs(
      Box,
      {
        ref,
        className,
        "data-cads-component": "Popover",
        role: "dialog",
        "aria-labelledby": content !== "custom" ? labelId : void 0,
        sx: {
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          width: 300,
          minWidth: 300,
          maxWidth: 500,
          padding: content === "textImage" ? "24px 20px 20px" : "20px",
          gap: content === "textImage" ? "12px" : "16px",
          backgroundColor: "var(--background-neutral-primary)",
          border: "1px solid var(--border-neutral-primary)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden"
        },
        children: [
          content === "textImage" ? /* @__PURE__ */ jsx(
            Box,
            {
              sx: {
                width: "100%",
                height: 140,
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--background-neutral-secondary)",
                overflow: "hidden",
                flexShrink: 0
              },
              children: image
            }
          ) : null,
          content === "custom" ? /* @__PURE__ */ jsx(Box, { sx: { width: "100%", overflow: "hidden" }, children: resolvedCustom ?? /* @__PURE__ */ jsx(
            Box,
            {
              sx: {
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
                color: "var(--text-neutral-primary)"
              },
              children: "Popover with custom content"
            }
          ) }) : null,
          content !== "custom" ? /* @__PURE__ */ jsxs(
            Box,
            {
              sx: {
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                width: "100%",
                color: "var(--text-neutral-primary)"
              },
              children: [
                /* @__PURE__ */ jsx(
                  Box,
                  {
                    id: labelId,
                    sx: {
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "var(--text-body-lg)",
                      lineHeight: "var(--leading-body-lg)"
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
                      fontSize: "var(--text-body-sm)",
                      lineHeight: "var(--leading-body-sm)"
                    },
                    children: body
                  }
                )
              ]
            }
          ) : null,
          showActions ? /* @__PURE__ */ jsxs(
            Box,
            {
              sx: {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                width: "100%"
              },
              children: [
                hasStepper ? /* @__PURE__ */ jsx(
                  Box,
                  {
                    sx: {
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-body-sm)",
                      lineHeight: "var(--leading-body-sm)",
                      color: "var(--text-neutral-tertiary)",
                      whiteSpace: "nowrap"
                    },
                    children: stepperText
                  }
                ) : null,
                /* @__PURE__ */ jsxs(
                  Box,
                  {
                    sx: {
                      display: "flex",
                      flex: 1,
                      justifyContent: "flex-end",
                      gap: "6px",
                      minWidth: 0
                    },
                    children: [
                      hasSecondaryAction ? /* @__PURE__ */ jsx(
                        Button,
                        {
                          size: "small",
                          variant: "outlined",
                          color: "secondary",
                          onClick: onSecondaryAction,
                          children: secondaryActionLabel
                        }
                      ) : null,
                      hasPrimaryAction ? /* @__PURE__ */ jsx(
                        Button,
                        {
                          size: "small",
                          variant: "contained",
                          color: "primary",
                          onClick: onPrimaryAction,
                          children: primaryActionLabel
                        }
                      ) : null
                    ]
                  }
                )
              ]
            }
          ) : null,
          isDismissible ? /* @__PURE__ */ jsx(
            CloseIconButton,
            {
              onClick: () => setOpen(false),
              size: "small",
              color: "secondary",
              sx: {
                position: "absolute",
                top: 5,
                right: 5
              }
            }
          ) : null
        ]
      }
    );
    const withCaret = /* @__PURE__ */ jsxs(
      Box,
      {
        sx: {
          display: "inline-flex",
          flexDirection: side === "top" || side === "bottom" ? "column" : "row",
          alignItems: "center",
          maxWidth: 500,
          minWidth: 300
        },
        children: [
          (side === "bottom" || side === "right") && card,
          hasCaret ? /* @__PURE__ */ jsx(Caret, { side, align }) : null,
          (side === "top" || side === "left") && card
        ]
      }
    );
    if (isSurfaceOnly || !trigger) {
      return withCaret;
    }
    const triggerEl = cloneElement(trigger, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...trigger.props,
      onClick: (event) => {
        trigger.props.onClick?.(event);
        setAnchorEl(event.currentTarget);
        setOpen(!open);
      },
      "aria-expanded": open
    });
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      triggerEl,
      /* @__PURE__ */ jsx(
        Popper,
        {
          open,
          anchorEl,
          placement: side === "bottom" ? "top" : side === "top" ? "bottom" : side === "left" ? "right" : "left",
          style: { zIndex: 1400 },
          children: /* @__PURE__ */ jsx(ClickAwayListener, { onClickAway: () => setOpen(false), children: /* @__PURE__ */ jsx(Box, { children: withCaret }) })
        }
      )
    ] });
  }
);

export { Popover };
//# sourceMappingURL=Popover.js.map
//# sourceMappingURL=Popover.js.map