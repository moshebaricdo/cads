import { jsx, jsxs } from 'react/jsx-runtime';
import MuiTooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { FaIcon } from '../icons/FaIcon.js';
import { useExperimentalMotion, readSurfaceDurationMs } from '../theme/experimentalMotion.js';

const ARROW_SIZE_PX = 6;
const ARROW_HEIGHT_PX = Math.round(ARROW_SIZE_PX * 0.71);
const ARROW_EDGE_INSET_PX = 12;
function arrowEdgePin(placement) {
  const value = String(placement);
  if (value === "bottom-start" || value === "top-start") {
    return { axis: "horizontal", side: "start" };
  }
  if (value === "bottom-end" || value === "top-end") {
    return { axis: "horizontal", side: "end" };
  }
  if (value === "left-start" || value === "right-start") {
    return { axis: "vertical", side: "start" };
  }
  if (value === "left-end" || value === "right-end") {
    return { axis: "vertical", side: "end" };
  }
  return null;
}
function createArrowEdgeModifier(pin) {
  return {
    name: "cadsArrowEdge",
    enabled: Boolean(pin),
    phase: "write",
    requires: ["arrow"],
    fn({ state }) {
      if (!pin) return;
      const arrowEl = state.elements.arrow;
      if (!arrowEl) return;
      if (pin.axis === "horizontal") {
        arrowEl.style.setProperty("right", "auto", "important");
        arrowEl.style.setProperty("transform", "none", "important");
        if (pin.side === "start") {
          arrowEl.style.setProperty(
            "left",
            `${ARROW_EDGE_INSET_PX}px`,
            "important"
          );
        } else {
          arrowEl.style.setProperty("left", "auto", "important");
          arrowEl.style.setProperty(
            "right",
            `${ARROW_EDGE_INSET_PX}px`,
            "important"
          );
        }
        return;
      }
      arrowEl.style.setProperty("bottom", "auto", "important");
      arrowEl.style.setProperty("transform", "none", "important");
      if (pin.side === "start") {
        arrowEl.style.setProperty(
          "top",
          `${ARROW_EDGE_INSET_PX}px`,
          "important"
        );
      } else {
        arrowEl.style.setProperty("top", "auto", "important");
        arrowEl.style.setProperty(
          "bottom",
          `${ARROW_EDGE_INSET_PX}px`,
          "important"
        );
      }
    }
  };
}
function placementToCaretSide(placement) {
  const value = String(placement);
  if (value.startsWith("top")) return "bottom";
  if (value.startsWith("left")) return "right";
  if (value.startsWith("right")) return "left";
  return "top";
}
function placementToCaretAlign(placement) {
  const value = String(placement);
  if (value.endsWith("-start")) return "start";
  if (value.endsWith("-end")) return "end";
  return "center";
}
function placementToSurfaceOrigin(placement) {
  const value = String(placement);
  if (value.startsWith("top")) return "bottom center";
  if (value.startsWith("bottom")) return "top center";
  if (value.startsWith("left")) return "center right";
  if (value.startsWith("right")) return "center left";
  return "center";
}
function TooltipLabel({
  title,
  iconName
}) {
  return /* @__PURE__ */ jsxs(
    Box,
    {
      component: "span",
      sx: {
        display: "inline-flex",
        alignItems: "flex-start",
        gap: "8px",
        // Constrain to the bubble; hug width is owned by the tooltip slot.
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        textAlign: "left"
      },
      children: [
        iconName ? /* @__PURE__ */ jsx(
          Box,
          {
            component: "span",
            "aria-hidden": true,
            sx: {
              // Match body/sm line-box and center the FA glyph (same approach as Alert).
              // Parent is items-start so the icon stays on the first text line when wrapping.
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: 14,
              height: "var(--leading-body-sm)",
              color: "var(--text-neutral-primary-inverse)",
              lineHeight: 0
            },
            children: /* @__PURE__ */ jsx(
              FaIcon,
              {
                name: iconName,
                fontSize: "14px",
                style: {
                  width: 14,
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
            component: "span",
            sx: {
              // Allow the flex item to shrink so copy wraps inside max-width 256.
              // (Default min-width:auto keeps a single long line from wrapping.)
              flex: "1 1 auto",
              minWidth: 0,
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-sm)",
              fontWeight: 400,
              lineHeight: "var(--leading-body-sm)",
              color: "var(--text-neutral-primary-inverse)",
              textAlign: "left",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              wordBreak: "break-word"
            },
            children: title
          }
        )
      ]
    }
  );
}
function TooltipCaret({
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
          ...align === "start" ? { pl: `${ARROW_EDGE_INSET_PX}px` } : align === "end" ? { pr: `${ARROW_EDGE_INSET_PX}px` } : null,
          ...side === "top" ? { mb: `-${ARROW_HEIGHT_PX}px` } : { mt: `-${ARROW_HEIGHT_PX}px` }
        } : {
          alignSelf: "stretch",
          alignItems,
          ...align === "start" ? { pt: `${ARROW_EDGE_INSET_PX}px` } : align === "end" ? { pb: `${ARROW_EDGE_INSET_PX}px` } : null,
          ...side === "left" ? { mr: `-${ARROW_HEIGHT_PX}px` } : { ml: `-${ARROW_HEIGHT_PX}px` }
        }
      },
      children: /* @__PURE__ */ jsx(
        Box,
        {
          sx: {
            width: ARROW_SIZE_PX,
            height: ARROW_SIZE_PX,
            backgroundColor: "var(--background-neutral-primary-inverse)",
            transform: "rotate(45deg)",
            flexShrink: 0
          }
        }
      )
    }
  );
}
const bubbleSx = {
  backgroundColor: "var(--background-neutral-primary-inverse)",
  color: "var(--text-neutral-primary-inverse)",
  borderRadius: "var(--radius-sm)",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-body-sm)",
  lineHeight: "var(--leading-body-sm)",
  padding: "4px 12px",
  // Figma: max-w 256; hug short labels, wrap long ones.
  maxWidth: 256,
  width: "max-content",
  boxSizing: "border-box",
  boxShadow: "var(--shadow-md)",
  textAlign: "left",
  whiteSpace: "normal"
};
function TooltipSurface({
  title,
  hasCaret,
  iconName,
  placement
}) {
  const side = placementToCaretSide(placement);
  const align = placementToCaretAlign(placement);
  const horizontal = side === "top" || side === "bottom";
  const bubble = /* @__PURE__ */ jsx(
    Box,
    {
      component: "span",
      className: "cads-tooltip-surface",
      sx: {
        ...bubbleSx,
        display: "inline-block",
        position: "relative",
        zIndex: 0,
        /* Grow from the edge nearest the trigger. */
        "--cads-surface-origin": placementToSurfaceOrigin(placement)
      },
      children: /* @__PURE__ */ jsx(TooltipLabel, { title, iconName })
    }
  );
  return /* @__PURE__ */ jsxs(
    Box,
    {
      "data-cads-component": "Tooltip",
      role: "tooltip",
      sx: {
        display: "inline-flex",
        flexDirection: horizontal ? "column" : "row",
        alignItems: "center",
        maxWidth: 256
      },
      children: [
        (side === "top" || side === "left") && hasCaret ? /* @__PURE__ */ jsx(TooltipCaret, { side, align }) : null,
        bubble,
        (side === "bottom" || side === "right") && hasCaret ? /* @__PURE__ */ jsx(TooltipCaret, { side, align }) : null
      ]
    }
  );
}
function Tooltip({
  children,
  title,
  hasCaret = true,
  iconName,
  placement = "bottom",
  surfaceOnly = false,
  slotProps,
  enterDelay,
  leaveDelay,
  ...rest
}) {
  const offsetDistance = hasCaret ? 4 + ARROW_HEIGHT_PX : 6;
  const edgePin = arrowEdgePin(placement ?? "bottom");
  const resolvedIcon = iconName ? iconName || "face-smile" : null;
  const experimentalMotion = useExperimentalMotion();
  const surfaceMs = readSurfaceDurationMs();
  if (surfaceOnly) {
    return /* @__PURE__ */ jsx(
      TooltipSurface,
      {
        title,
        hasCaret,
        iconName: resolvedIcon,
        placement: placement ?? "bottom"
      }
    );
  }
  const content = /* @__PURE__ */ jsx(TooltipLabel, { title, iconName: resolvedIcon });
  const {
    popper: popperSlot,
    tooltip: tooltipSlot,
    arrow: arrowSlot,
    transition: transitionSlot,
    ...otherSlots
  } = slotProps ?? {};
  const existingPopperOptions = popperSlot && typeof popperSlot === "object" && "popperOptions" in popperSlot && popperSlot.popperOptions && typeof popperSlot.popperOptions === "object" ? popperSlot.popperOptions : null;
  const existingModifiers = existingPopperOptions && "modifiers" in existingPopperOptions && Array.isArray(existingPopperOptions.modifiers) ? existingPopperOptions.modifiers : [];
  return /* @__PURE__ */ jsx(
    MuiTooltip,
    {
      ...rest,
      title: content,
      arrow: hasCaret,
      placement,
      enterDelay: enterDelay ?? (experimentalMotion ? 300 : void 0),
      leaveDelay: leaveDelay ?? (experimentalMotion ? 0 : void 0),
      slotProps: {
        ...otherSlots,
        transition: {
          ...transitionSlot,
          ...experimentalMotion ? { timeout: { enter: surfaceMs, exit: surfaceMs } } : null
        },
        popper: {
          ...popperSlot,
          popperOptions: {
            ...existingPopperOptions,
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, offsetDistance]
                }
              },
              createArrowEdgeModifier(edgePin),
              ...existingModifiers
            ]
          }
        },
        tooltip: {
          ...tooltipSlot,
          // MUI Tooltip slot typings omit data-* attrs; class drives Surface recipe.
          className: [
            "cads-tooltip-surface",
            tooltipSlot && typeof tooltipSlot === "object" && "className" in tooltipSlot && tooltipSlot.className ? String(tooltipSlot.className) : ""
          ].filter(Boolean).join(" "),
          sx: {
            ...bubbleSx,
            // Kill MUI’s placement margins — gap is controlled via offset above.
            margin: "0 !important",
            /* Grow from the edge nearest the trigger. */
            "--cads-surface-origin": placementToSurfaceOrigin(
              placement ?? "bottom"
            ),
            ...tooltipSlot && typeof tooltipSlot === "object" && "sx" in tooltipSlot && tooltipSlot.sx && typeof tooltipSlot.sx === "object" ? tooltipSlot.sx : null
          }
        },
        arrow: {
          ...arrowSlot,
          sx: {
            color: "var(--background-neutral-primary-inverse)",
            fontSize: ARROW_SIZE_PX,
            "&::before": {
              backgroundColor: "var(--background-neutral-primary-inverse)"
            },
            ...arrowSlot && typeof arrowSlot === "object" && "sx" in arrowSlot && arrowSlot.sx && typeof arrowSlot.sx === "object" ? arrowSlot.sx : null
          }
        }
      },
      children
    }
  );
}

export { Tooltip };
//# sourceMappingURL=Tooltip.js.map
//# sourceMappingURL=Tooltip.js.map