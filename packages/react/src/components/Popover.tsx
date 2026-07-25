import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { useSurfacePresence } from "../theme/experimentalMotion";
import { Button } from "./Button";
import { CloseIconButton } from "./CloseIconButton";

/** Figma Popover `caretPlacement`. */
export type PopoverCaretPlacement =
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight"
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "leftTop"
  | "leftCenter"
  | "leftBottom"
  | "rightTop"
  | "rightCenter"
  | "rightBottom";

/** Figma Popover Core `content`. */
export type PopoverContent = "textOnly" | "textImage" | "custom";

export interface PopoverProps {
  /**
   * Content layout (Figma Popover Core `content`).
   * @default "textOnly"
   */
  content?: PopoverContent;
  /**
   * Caret side/alignment (Figma `caretPlacement`).
   * @default "bottomLeft"
   */
  caretPlacement?: PopoverCaretPlacement;
  /**
   * @default true
   */
  hasCaret?: boolean;
  /** Figma `titleText`. */
  title?: ReactNode;
  /** Figma `bodyText`. */
  body?: ReactNode;
  /** Image slot when `content="textImage"`. */
  image?: ReactNode;
  /** Custom body when `content="custom"` (also accepts `children` as custom). */
  customContent?: ReactNode;
  /**
   * @default true
   */
  hasActionRow?: boolean;
  /**
   * @default true
   */
  hasStepper?: boolean;
  /** Figma `stepperText`. @default "1/3" */
  stepperText?: ReactNode;
  /**
   * @default true
   */
  hasPrimaryAction?: boolean;
  /**
   * @default true
   */
  hasSecondaryAction?: boolean;
  /** @default "Next" */
  primaryActionLabel?: ReactNode;
  /** @default "Back" */
  secondaryActionLabel?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /**
   * @default true
   */
  isDismissible?: boolean;
  onClose?: () => void;
  /** Controlled open (anchored mode). */
  open?: boolean;
  /** Uncontrolled default open. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional trigger element (enables anchored Popper mode). */
  children?: ReactElement | ReactNode;
  className?: string;
  /**
   * When true, render only the surface (no Popper). Used by fixtures/docs.
   * @default false when a trigger child is provided; true otherwise.
   */
  surfaceOnly?: boolean;
}

type CaretSide = "top" | "bottom" | "left" | "right";
type CaretAlign = "start" | "center" | "end";

/** Diamond edge length; -6px seam overlap leaves ~6px tip past the card. */
const CARET_SIZE_PX = 12;
const CARET_TIP_PX = 6;
/** Tip clearance from trigger (matches Tooltip); no-caret gap is a hair larger. */
const POPOVER_OFFSET_WITH_CARET_PX = 4 + CARET_TIP_PX;
const POPOVER_OFFSET_NO_CARET_PX = 8;

function parseCaret(placement: PopoverCaretPlacement): {
  side: CaretSide;
  align: CaretAlign;
} {
  if (placement.startsWith("bottom")) {
    const align =
      placement === "bottomLeft"
        ? "start"
        : placement === "bottomRight"
          ? "end"
          : "center";
    return { side: "bottom", align };
  }
  if (placement.startsWith("top")) {
    const align =
      placement === "topLeft"
        ? "start"
        : placement === "topRight"
          ? "end"
          : "center";
    return { side: "top", align };
  }
  if (placement.startsWith("left")) {
    const align =
      placement === "leftTop"
        ? "start"
        : placement === "leftBottom"
          ? "end"
          : "center";
    return { side: "left", align };
  }
  const align =
    placement === "rightTop"
      ? "start"
      : placement === "rightBottom"
        ? "end"
        : "center";
  return { side: "right", align };
}

/**
 * Figma `caretPlacement` names the caret edge on the card (e.g. bottomLeft =
 * caret on the card’s bottom, toward the start). Invert that into MUI Popper
 * placement so the caret stays pointed at the trigger.
 */
function caretPlacementToPopper(
  placement: PopoverCaretPlacement,
):
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end" {
  const { side, align } = parseCaret(placement);
  // Caret on the card’s bottom → card sits above the trigger → Popper "top".
  const popperSide =
    side === "bottom"
      ? "top"
      : side === "top"
        ? "bottom"
        : side === "left"
          ? "right"
          : "left";
  if (align === "center") return popperSide;
  return `${popperSide}-${align}` as
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
}

/** Surface enter grows from the edge/corner nearest the trigger. */
function caretPlacementToSurfaceOrigin(placement: PopoverCaretPlacement): string {
  const { side, align } = parseCaret(placement);
  const edge =
    side === "bottom"
      ? "bottom"
      : side === "top"
        ? "top"
        : side === "left"
          ? "left"
          : "right";
  if (align === "center") {
    return side === "left" || side === "right"
      ? `center ${edge}`
      : `${edge} center`;
  }
  if (side === "bottom" || side === "top") {
    return `${edge} ${align === "start" ? "left" : "right"}`;
  }
  return `${align === "start" ? "top" : "bottom"} ${edge}`;
}

function Caret({
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
              px: "20px",
              ...(side === "bottom" ? { mt: "-1px" } : { mb: "-1px" }),
            }
          : {
              alignSelf: "stretch",
              alignItems,
              py: "20px",
              ...(side === "right" ? { ml: "-1px" } : { mr: "-1px" }),
            }),
      }}
    >
      <Box
        sx={{
          width: CARET_SIZE_PX,
          height: CARET_SIZE_PX,
          backgroundColor: "var(--background-neutral-primary)",
          borderRight: "1px solid var(--border-neutral-primary)",
          borderBottom: "1px solid var(--border-neutral-primary)",
          transform:
            side === "bottom"
              ? "rotate(45deg)"
              : side === "top"
                ? "rotate(225deg)"
                : side === "left"
                  ? "rotate(135deg)"
                  : "rotate(-45deg)",
          margin:
            side === "bottom"
              ? `-${CARET_TIP_PX}px 0 0`
              : side === "top"
                ? `0 0 -${CARET_TIP_PX}px`
                : side === "left"
                  ? `0 -${CARET_TIP_PX}px 0 0`
                  : `0 0 0 -${CARET_TIP_PX}px`,
        }}
      />
    </Box>
  );
}

/**
 * CADS Popover — dismissible anchored card with optional caret / stepper.
 * Spec: Figma Popover `16426:681` + Popover Core `16421:393`.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
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
      surfaceOnly,
    },
    ref,
  ) {
    const labelId = useId();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const controlled = openProp !== undefined;
    const open = controlled ? Boolean(openProp) : uncontrolledOpen;
    const { mounted: surfaceMounted, exiting: surfaceExiting } =
      useSurfacePresence(open);

    const trigger =
      isValidElement(children) && children.type !== undefined
        ? (children as ReactElement)
        : null;
    const customFromChildren =
      !trigger && children != null ? (children as ReactNode) : null;
    const resolvedCustom = customContent ?? customFromChildren;
    const isSurfaceOnly =
      surfaceOnly ?? (trigger == null && openProp == null && !defaultOpen);

    const setOpen = (next: boolean) => {
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
      if (!next) onClose?.();
    };

    const { side, align } = parseCaret(caretPlacement);
    const showActions =
      content !== "custom" &&
      hasActionRow &&
      (hasPrimaryAction || hasSecondaryAction || hasStepper);

    const card = (
      <Box
        ref={ref}
        className={className}
        data-cads-component="Popover"
        role="dialog"
        aria-labelledby={content !== "custom" ? labelId : undefined}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          width: 300,
          minWidth: 300,
          maxWidth: 500,
          padding:
            content === "textImage" ? "24px 20px 20px" : "20px",
          gap: content === "textImage" ? "12px" : "16px",
          backgroundColor: "var(--background-neutral-primary)",
          border: "1px solid var(--border-neutral-primary)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden",
        }}
      >
        {content === "textImage" ? (
          <Box
            sx={{
              width: "100%",
              height: 140,
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--background-neutral-secondary)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {image}
          </Box>
        ) : null}

        {content === "custom" ? (
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            {resolvedCustom ?? (
              <Box
                sx={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body-sm)",
                  lineHeight: "var(--leading-body-sm)",
                  color: "var(--text-neutral-primary)",
                }}
              >
                Popover with custom content
              </Box>
            )}
          </Box>
        ) : null}

        {content !== "custom" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              width: "100%",
              color: "var(--text-neutral-primary)",
            }}
          >
            <Box
              id={labelId}
              sx={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "var(--text-body-lg)",
                lineHeight: "var(--leading-body-lg)",
              }}
            >
              {title}
            </Box>
            <Box
              sx={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
              }}
            >
              {body}
            </Box>
          </Box>
        ) : null}

        {showActions ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "100%",
            }}
          >
            {hasStepper ? (
              <Box
                sx={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-body-sm)",
                  lineHeight: "var(--leading-body-sm)",
                  color: "var(--text-neutral-tertiary)",
                  whiteSpace: "nowrap",
                }}
              >
                {stepperText}
              </Box>
            ) : null}
            <Box
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "flex-end",
                gap: "6px",
                minWidth: 0,
              }}
            >
              {hasSecondaryAction ? (
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={onSecondaryAction}
                >
                  {secondaryActionLabel}
                </Button>
              ) : null}
              {hasPrimaryAction ? (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={onPrimaryAction}
                >
                  {primaryActionLabel}
                </Button>
              ) : null}
            </Box>
          </Box>
        ) : null}

        {isDismissible ? (
          <CloseIconButton
            onClick={() => setOpen(false)}
            size="small"
            color="secondary"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
            }}
          />
        ) : null}
      </Box>
    );

    // Surface on the card+caret unit so enter/exit scales and fades together
    // (caret used to sit outside data-cads-surface and pop off after the card).
    const withCaret = (
      <Box
        data-cads-surface=""
        {...(surfaceExiting
          ? { "data-cads-surface-state": "exit" }
          : {})}
        sx={{
          display: "inline-flex",
          flexDirection:
            side === "top" || side === "bottom" ? "column" : "row",
          alignItems: "center",
          maxWidth: 500,
          minWidth: 300,
          /* Grow from the trigger-aligned edge/corner. */
          "--cads-surface-origin":
            caretPlacementToSurfaceOrigin(caretPlacement),
        }}
      >
        {(side === "bottom" || side === "right") && card}
        {hasCaret ? <Caret side={side} align={align} /> : null}
        {(side === "top" || side === "left") && card}
      </Box>
    );

    if (isSurfaceOnly || !trigger) {
      return withCaret;
    }

    const triggerEl = cloneElement(trigger, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(trigger.props as any),
      onClick: (event: MouseEvent<HTMLElement>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (trigger.props as any).onClick?.(event);
        setAnchorEl(event.currentTarget);
        setOpen(!open);
      },
      "aria-expanded": open,
    } as Partial<typeof trigger.props>);

    return (
      <>
        {triggerEl}
        <Popper
          open={surfaceMounted}
          anchorEl={anchorEl}
          placement={caretPlacementToPopper(caretPlacement)}
          style={{ zIndex: 1400 }}
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [
                  0,
                  hasCaret
                    ? POPOVER_OFFSET_WITH_CARET_PX
                    : POPOVER_OFFSET_NO_CARET_PX,
                ],
              },
            },
          ]}
        >
          <ClickAwayListener
            onClickAway={() => {
              if (!surfaceExiting) setOpen(false);
            }}
          >
            <Box>{withCaret}</Box>
          </ClickAwayListener>
        </Popper>
      </>
    );
  },
);
