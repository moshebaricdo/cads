import MuiTooltip, {
  type TooltipProps as MuiTooltipProps,
} from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import type { ReactElement, ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";

/**
 * Figma Arrow is 6×4 (w×h). MUI sizes the arrow square via `fontSize`;
 * visible tip height is ~0.71em of that size.
 */
const ARROW_SIZE_PX = 6;
const ARROW_HEIGHT_PX = Math.round(ARROW_SIZE_PX * 0.71);
/** Inset from the bubble edge for *-start / *-end caret alignment. */
const ARROW_EDGE_INSET_PX = 12;

type EdgeAxis = "horizontal" | "vertical";

/** Where to pin the caret on the bubble for *-start / *-end placements. */
function arrowEdgePin(
  placement: NonNullable<MuiTooltipProps["placement"]>,
): { axis: EdgeAxis; side: "start" | "end" } | null {
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

/**
 * Popper’s arrow modifier aims at the trigger center, which puts the caret on
 * the wrong edge for *-start/*-end (e.g. bottom-start → caret on the right).
 * Pin to the bubble’s start/end edge after that runs.
 */
function createArrowEdgeModifier(
  pin: { axis: EdgeAxis; side: "start" | "end" } | null,
) {
  return {
    name: "cadsArrowEdge",
    enabled: Boolean(pin),
    phase: "write" as const,
    requires: ["arrow"],
    fn({ state }: { state: { elements: { arrow?: HTMLElement | null } } }) {
      if (!pin) return;
      const arrowEl = state.elements.arrow;
      if (!arrowEl) return;

      if (pin.axis === "horizontal") {
        arrowEl.style.setProperty("right", "auto", "important");
        arrowEl.style.setProperty("transform", "none", "important");
        if (pin.side === "start") {
          // bottom-start / top-start → caret on the left
          arrowEl.style.setProperty(
            "left",
            `${ARROW_EDGE_INSET_PX}px`,
            "important",
          );
        } else {
          // bottom-end / top-end → caret on the right
          arrowEl.style.setProperty("left", "auto", "important");
          arrowEl.style.setProperty(
            "right",
            `${ARROW_EDGE_INSET_PX}px`,
            "important",
          );
        }
        return;
      }

      arrowEl.style.setProperty("bottom", "auto", "important");
      arrowEl.style.setProperty("transform", "none", "important");
      if (pin.side === "start") {
        // left-start / right-start → caret near the top
        arrowEl.style.setProperty(
          "top",
          `${ARROW_EDGE_INSET_PX}px`,
          "important",
        );
      } else {
        // left-end / right-end → caret near the bottom
        arrowEl.style.setProperty("top", "auto", "important");
        arrowEl.style.setProperty(
          "bottom",
          `${ARROW_EDGE_INSET_PX}px`,
          "important",
        );
      }
    },
  };
}

export interface TooltipProps
  extends Omit<MuiTooltipProps, "title" | "arrow"> {
  /** Tooltip label (Figma `text`). */
  title: ReactNode;
  children: ReactElement;
  /**
   * Show caret (Figma `hasCaret`). Maps to MUI `arrow`.
   * @default true
   */
  hasCaret?: boolean;
  /**
   * Leading icon (Figma `startIcon`).
   * @default false
   */
  startIcon?: boolean;
  /** FA icon name when `startIcon` (Figma `iconName`). */
  iconName?: FaIconName | (string & {});
  /**
   * MUI placement (where the tooltip sits relative to the trigger).
   * `*-start` / `*-end` also pin the caret to that edge of the bubble.
   * @default "bottom"
   */
  placement?: MuiTooltipProps["placement"];
}

/**
 * CADS Tooltip — inverse surface with optional caret and start icon.
 * Spec: Figma Tooltip `1990:7125` / key `8f604de25a1742f20b6e6f1dd3680bdfdbda2234`.
 *
 * Accepts the full MUI Tooltip prop surface (except `title` shape and `arrow`,
 * which are driven by CADS `title` / `hasCaret`). Position with MUI `placement`.
 */
export function Tooltip({
  children,
  title,
  hasCaret = true,
  startIcon = false,
  iconName = "face-smile",
  placement = "bottom",
  slotProps,
  ...rest
}: TooltipProps) {
  // Caret tip 4px from trigger; without caret, bubble gap is 6px.
  const offsetDistance = hasCaret ? 4 + ARROW_HEIGHT_PX : 6;
  const edgePin = arrowEdgePin(placement ?? "bottom");

  const content = (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: "8px",
        maxWidth: 256,
        width: "max-content",
        textAlign: "left",
      }}
    >
      {startIcon ? (
        <Box
          component="span"
          aria-hidden
          sx={{
            // Match body/sm line-box and center the FA glyph (same approach as Alert).
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: 14,
            height: "var(--leading-body-sm)",
            color: "var(--text-neutral-primary-inverse)",
            lineHeight: 0,
          }}
        >
          <FaIcon
            name={(iconName as FaIconName) || "face-smile"}
            fontSize="14px"
            style={{
              width: 14,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Box>
      ) : null}
      <Box
        component="span"
        sx={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-body-sm)",
          fontWeight: 400,
          lineHeight: "var(--leading-body-sm)",
          color: "var(--text-neutral-primary-inverse)",
          textAlign: "left",
        }}
      >
        {title}
      </Box>
    </Box>
  );

  const {
    popper: popperSlot,
    tooltip: tooltipSlot,
    arrow: arrowSlot,
    ...otherSlots
  } = slotProps ?? {};

  const existingPopperOptions =
    popperSlot &&
    typeof popperSlot === "object" &&
    "popperOptions" in popperSlot &&
    popperSlot.popperOptions &&
    typeof popperSlot.popperOptions === "object"
      ? popperSlot.popperOptions
      : null;

  const existingModifiers =
    existingPopperOptions &&
    "modifiers" in existingPopperOptions &&
    Array.isArray(existingPopperOptions.modifiers)
      ? existingPopperOptions.modifiers
      : [];

  return (
    <MuiTooltip
      {...rest}
      title={content}
      arrow={hasCaret}
      placement={placement}
      slotProps={{
        ...otherSlots,
        popper: {
          ...popperSlot,
          popperOptions: {
            ...existingPopperOptions,
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, offsetDistance],
                },
              },
              createArrowEdgeModifier(edgePin),
              ...existingModifiers,
            ],
          },
        },
        tooltip: {
          ...tooltipSlot,
          sx: {
            backgroundColor: "var(--background-neutral-primary-inverse)",
            color: "var(--text-neutral-primary-inverse)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-sm)",
            lineHeight: "var(--leading-body-sm)",
            padding: "4px 12px",
            maxWidth: 256,
            width: "max-content",
            minWidth: 0,
            boxShadow: "var(--shadow-md)",
            // Kill MUI’s placement margins — gap is controlled via offset above.
            margin: "0 !important",
            textAlign: "left",
            ...(tooltipSlot &&
            typeof tooltipSlot === "object" &&
            "sx" in tooltipSlot &&
            tooltipSlot.sx &&
            typeof tooltipSlot.sx === "object"
              ? tooltipSlot.sx
              : null),
          },
        },
        arrow: {
          ...arrowSlot,
          sx: {
            color: "var(--background-neutral-primary-inverse)",
            fontSize: ARROW_SIZE_PX,
            "&::before": {
              backgroundColor: "var(--background-neutral-primary-inverse)",
            },
            ...(arrowSlot &&
            typeof arrowSlot === "object" &&
            "sx" in arrowSlot &&
            arrowSlot.sx &&
            typeof arrowSlot.sx === "object"
              ? arrowSlot.sx
              : null),
          },
        },
      }}
    >
      {children}
    </MuiTooltip>
  );
}
