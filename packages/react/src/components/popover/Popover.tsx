import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  experimentalMotionHostAttrs,
  surfaceMotionStateAttrs,
  useExperimentalMotion,
  useSurfacePresence,
} from "../../theme/experimentalMotion";
import { Button } from "../button/index";
import { CloseIconButton } from "../close-icon-button";
import styles from "./popover.module.scss";
import type { PopoverCaretPlacement, PopoverProps } from "./types";

export type { PopoverCaretPlacement, PopoverContent, PopoverProps } from "./types";

type CaretSide = "top" | "bottom" | "left" | "right";
type CaretAlign = "start" | "center" | "end";

/** Tip clearance from trigger (matches Tooltip); no-caret gap is a hair larger. */
const POPOVER_OFFSET_WITH_CARET_PX = 4 + 6;
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
 * caret on the card's bottom, toward the start). Invert that into MUI Popper
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

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function Caret({ side, align }: { side: CaretSide; align: CaretAlign }) {
  const horizontal = side === "top" || side === "bottom";
  const justify =
    align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";
  const alignItems =
    align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";

  return (
    <div
      aria-hidden
      className={cx(
        styles.caretWrap,
        horizontal ? styles.horizontal : styles.vertical,
        styles[side],
      )}
      style={
        horizontal
          ? { justifyContent: justify }
          : { alignItems }
      }
    >
      <div className={cx(styles.caretDiamond, styles[side])} />
    </div>
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
    const experimentalMotion = useExperimentalMotion();
    const {
      mounted: surfaceMounted,
      exiting: surfaceExiting,
      entering: surfaceEntering,
    } = useSurfacePresence(open);

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
      <div
        ref={ref}
        className={cx(styles.card, styles[content], className)}
        data-cads-component="Popover"
        role="dialog"
        aria-labelledby={content !== "custom" ? labelId : undefined}
      >
        {content === "textImage" ? (
          <div className={styles.imageSlot}>{image}</div>
        ) : null}

        {content === "custom" ? (
          <div className={styles.customSlot}>
            {resolvedCustom ?? (
              <div className={styles.customFallback}>
                Popover with custom content
              </div>
            )}
          </div>
        ) : null}

        {content !== "custom" ? (
          <div className={styles.copy}>
            <div id={labelId} className={styles.title}>
              {title}
            </div>
            <div className={styles.body}>{body}</div>
          </div>
        ) : null}

        {showActions ? (
          <div className={styles.actionRow}>
            {hasStepper ? (
              <div className={styles.stepper}>{stepperText}</div>
            ) : null}
            <div className={styles.actionButtons}>
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
            </div>
          </div>
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
      </div>
    );

    const horizontal = side === "top" || side === "bottom";
    const withCaret = (
      <div
        data-cads-surface=""
        {...experimentalMotionHostAttrs(experimentalMotion)}
        {...surfaceMotionStateAttrs(surfaceEntering, surfaceExiting)}
        className={cx(
          styles.surfaceWrap,
          horizontal ? styles.horizontal : styles.vertical,
        )}
        style={{
          "--cads-surface-origin": caretPlacementToSurfaceOrigin(caretPlacement),
        } as CSSProperties}
      >
        {(side === "bottom" || side === "right") && card}
        {hasCaret ? <Caret side={side} align={align} /> : null}
        {(side === "top" || side === "left") && card}
      </div>
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

    /* Popper z-index via inline style — required to beat stacking contexts. */
    return (
      <>
        {triggerEl}
        <Popper
          open={surfaceMounted}
          anchorEl={anchorEl}
          placement={caretPlacementToPopper(caretPlacement)}
          style={{ zIndex: "var(--z-popover)" }}
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
            onClickAway={(event) => {
              const target = event.target;
              if (
                target instanceof Element &&
                (target.closest("[data-cads-dropdown-menu]") ||
                  target.closest("[data-cads-breadcrumb-overflow-menu]"))
              ) {
                return;
              }
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
