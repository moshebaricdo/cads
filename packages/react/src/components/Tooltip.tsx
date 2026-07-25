import MuiTooltip, {
  type TooltipProps as MuiTooltipProps,
} from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import type { ReactElement, ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  readSurfaceDurationMs,
  useExperimentalMotion,
} from "../theme/experimentalMotion";

/**
 * Figma Arrow is 6×4 (w×h). MUI sizes the arrow square via `fontSize`;
 * visible tip height is ~0.71em of that size.
 */
const ARROW_SIZE_PX = 6;
const ARROW_HEIGHT_PX = Math.round(ARROW_SIZE_PX * 0.71);
/** Inset from the bubble edge for *-start / *-end caret alignment. */
const ARROW_EDGE_INSET_PX = 12;

type EdgeAxis = "horizontal" | "vertical";
type CaretSide = "top" | "bottom" | "left" | "right";
type CaretAlign = "start" | "center" | "end";

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

/** Edge of the bubble that faces the trigger (where the caret sits). */
function placementToCaretSide(
  placement: NonNullable<MuiTooltipProps["placement"]>,
): CaretSide {
  const value = String(placement);
  if (value.startsWith("top")) return "bottom";
  if (value.startsWith("left")) return "right";
  if (value.startsWith("right")) return "left";
  return "top";
}

function placementToCaretAlign(
  placement: NonNullable<MuiTooltipProps["placement"]>,
): CaretAlign {
  const value = String(placement);
  if (value.endsWith("-start")) return "start";
  if (value.endsWith("-end")) return "end";
  return "center";
}

function placementToSurfaceOrigin(
  placement: NonNullable<MuiTooltipProps["placement"]>,
): string {
  const value = String(placement);
  if (value.startsWith("top")) return "bottom center";
  if (value.startsWith("bottom")) return "top center";
  if (value.startsWith("left")) return "center right";
  if (value.startsWith("right")) return "center left";
  return "center";
}

function TooltipLabel({
  title,
  iconName,
}: {
  title: ReactNode;
  iconName: FaIconName | null;
}) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: "8px",
        // Constrain to the bubble; hug width is owned by the tooltip slot.
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      {iconName ? (
        <Box
          component="span"
          aria-hidden
          sx={{
            // Match body/sm line-box and center the FA glyph (same approach as Alert).
            // Parent is items-start so the icon stays on the first text line when wrapping.
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
            name={iconName}
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
          wordBreak: "break-word",
        }}
      >
        {title}
      </Box>
    </Box>
  );
}

/** Static caret for surfaceOnly — mirrors MUI’s 6×6 diamond tip. */
function TooltipCaret({
  side,
  align,
}: {
  side: CaretSide;
  align: CaretAlign;
}) {
  const horizontal = side === "top" || side === "bottom";
  const justify =
    align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";
  const alignItems =
    align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";

  return (
    <Box
      aria-hidden
      sx={{
        display: "flex",
        flexShrink: 0,
        zIndex: 1,
        ...(horizontal
          ? {
              width: "100%",
              justifyContent: justify,
              ...(align === "start"
                ? { pl: `${ARROW_EDGE_INSET_PX}px` }
                : align === "end"
                  ? { pr: `${ARROW_EDGE_INSET_PX}px` }
                  : null),
              ...(side === "top"
                ? { mb: `-${ARROW_HEIGHT_PX}px` }
                : { mt: `-${ARROW_HEIGHT_PX}px` }),
            }
          : {
              alignSelf: "stretch",
              alignItems,
              ...(align === "start"
                ? { pt: `${ARROW_EDGE_INSET_PX}px` }
                : align === "end"
                  ? { pb: `${ARROW_EDGE_INSET_PX}px` }
                  : null),
              ...(side === "left"
                ? { mr: `-${ARROW_HEIGHT_PX}px` }
                : { ml: `-${ARROW_HEIGHT_PX}px` }),
            }),
      }}
    >
      <Box
        sx={{
          width: ARROW_SIZE_PX,
          height: ARROW_SIZE_PX,
          backgroundColor: "var(--background-neutral-primary-inverse)",
          transform: "rotate(45deg)",
          flexShrink: 0,
        }}
      />
    </Box>
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
  boxSizing: "border-box" as const,
  boxShadow: "var(--shadow-md)",
  textAlign: "left" as const,
  whiteSpace: "normal" as const,
};

/**
 * Inline tooltip chrome (bubble + optional caret) for fixtures / Inspect.
 * No Popper, trigger, or portal — the surface is the measurable root.
 */
function TooltipSurface({
  title,
  hasCaret,
  iconName,
  placement,
}: {
  title: ReactNode;
  hasCaret: boolean;
  iconName: FaIconName | null;
  placement: NonNullable<MuiTooltipProps["placement"]>;
}) {
  const side = placementToCaretSide(placement);
  const align = placementToCaretAlign(placement);
  const horizontal = side === "top" || side === "bottom";

  const bubble = (
    <Box
      component="span"
      className="cads-tooltip-surface"
      sx={{
        ...bubbleSx,
        display: "inline-block",
        position: "relative",
        zIndex: 0,
        /* Grow from the edge nearest the trigger. */
        "--cads-surface-origin": placementToSurfaceOrigin(placement),
      }}
    >
      <TooltipLabel title={title} iconName={iconName} />
    </Box>
  );

  return (
    <Box
      data-cads-component="Tooltip"
      role="tooltip"
      sx={{
        display: "inline-flex",
        flexDirection: horizontal ? "column" : "row",
        alignItems: "center",
        maxWidth: 256,
      }}
    >
      {(side === "top" || side === "left") && hasCaret ? (
        <TooltipCaret side={side} align={align} />
      ) : null}
      {bubble}
      {(side === "bottom" || side === "right") && hasCaret ? (
        <TooltipCaret side={side} align={align} />
      ) : null}
    </Box>
  );
}

export interface TooltipProps
  extends Omit<MuiTooltipProps, "title" | "arrow" | "children"> {
  /** Tooltip label (Figma `text`). */
  title: ReactNode;
  /**
   * Trigger element. Required for anchored mode; omit with `surfaceOnly`.
   */
  children?: ReactElement;
  /**
   * Show caret (Figma `hasCaret`). Maps to MUI `arrow`.
   * @default true
   */
  hasCaret?: boolean;
  /**
   * Leading FA icon. Omit for no icon (Figma’s boolean `startIcon` is
   * collapsed into presence of this prop).
   */
  iconName?: FaIconName | (string & {});
  /**
   * MUI placement (where the tooltip sits relative to the trigger).
   * `*-start` / `*-end` also pin the caret to that edge of the bubble.
   * @default "bottom"
   */
  placement?: MuiTooltipProps["placement"];
  /**
   * Render bubble (+ caret) inline without Popper / trigger.
   * Used by docs Inspect and static fixtures.
   */
  surfaceOnly?: boolean;
}

/**
 * CADS Tooltip — inverse surface with optional caret and start icon.
 * Spec: Figma Tooltip `1990:7125` / key `8f604de25a1742f20b6e6f1dd3680bdfdbda2234`.
 *
 * Accepts the full MUI Tooltip prop surface (except `title` shape and `arrow`,
 * which are driven by CADS `title` / `hasCaret`). Position with MUI `placement`.
 * Pass `surfaceOnly` for static previews (no trigger / portal).
 */
export function Tooltip({
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
}: TooltipProps) {
  // Caret tip 4px from trigger; without caret, bubble gap is 6px.
  const offsetDistance = hasCaret ? 4 + ARROW_HEIGHT_PX : 6;
  const edgePin = arrowEdgePin(placement ?? "bottom");
  const resolvedIcon = iconName
    ? ((iconName as FaIconName) || "face-smile")
    : null;
  const experimentalMotion = useExperimentalMotion();
  const surfaceMs = readSurfaceDurationMs();

  if (surfaceOnly) {
    return (
      <TooltipSurface
        title={title}
        hasCaret={hasCaret}
        iconName={resolvedIcon}
        placement={placement ?? "bottom"}
      />
    );
  }

  const content = <TooltipLabel title={title} iconName={resolvedIcon} />;

  const {
    popper: popperSlot,
    tooltip: tooltipSlot,
    arrow: arrowSlot,
    transition: transitionSlot,
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
      /* Symmetric Surface-paced enter/exit; no sticky leave delay. */
      enterDelay={enterDelay ?? (experimentalMotion ? 300 : undefined)}
      leaveDelay={leaveDelay ?? (experimentalMotion ? 0 : undefined)}
      slotProps={{
        ...otherSlots,
        transition: {
          ...transitionSlot,
          ...(experimentalMotion
            ? { timeout: { enter: surfaceMs, exit: surfaceMs } }
            : null),
        },
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
          // MUI Tooltip slot typings omit data-* attrs; class drives Surface recipe.
          className: [
            "cads-tooltip-surface",
            tooltipSlot &&
            typeof tooltipSlot === "object" &&
            "className" in tooltipSlot &&
            tooltipSlot.className
              ? String(tooltipSlot.className)
              : "",
          ]
            .filter(Boolean)
            .join(" "),
          sx: {
            ...bubbleSx,
            // Kill MUI’s placement margins — gap is controlled via offset above.
            margin: "0 !important",
            /* Grow from the edge nearest the trigger. */
            "--cads-surface-origin": placementToSurfaceOrigin(
              placement ?? "bottom",
            ),
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
      {children as ReactElement}
    </MuiTooltip>
  );
}
