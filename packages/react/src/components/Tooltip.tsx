import MuiTooltip, {
  type TooltipProps as MuiTooltipProps,
} from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import type { ReactElement, ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";

/** Figma Tooltip `caretPlacement` — side of the bubble the caret sits on. */
export type TooltipCaretPlacement = "top" | "bottom" | "left" | "right";

/**
 * Figma caret edge → MUI tooltip placement (anchor side).
 * `caretPlacement=top` means caret on the top of the bubble (tooltip below trigger).
 */
const CARET_TO_MUI_PLACEMENT: Record<
  TooltipCaretPlacement,
  NonNullable<MuiTooltipProps["placement"]>
> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/** Arrow box height at 14px font-size (`0.71em` in MUI’s arrow). */
const ARROW_SIZE_PX = 14;
const ARROW_HEIGHT_PX = Math.round(ARROW_SIZE_PX * 0.71);

export interface TooltipProps
  extends Omit<MuiTooltipProps, "title" | "placement" | "arrow"> {
  /** Tooltip label (Figma `text`). */
  title: ReactNode;
  children: ReactElement;
  /**
   * Caret edge on the bubble (Figma `caretPlacement`). Also positions the tooltip.
   * @default "top"
   */
  caretPlacement?: TooltipCaretPlacement;
  /**
   * Show caret (Figma `hasCaret`).
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
}

/**
 * CADS Tooltip — inverse surface with optional caret and start icon.
 * Spec: Figma Tooltip `1990:7125` / key `8f604de25a1742f20b6e6f1dd3680bdfdbda2234`.
 */
export function Tooltip({
  children,
  title,
  caretPlacement = "top",
  hasCaret = true,
  startIcon = false,
  iconName = "face-smile",
  ...rest
}: TooltipProps) {
  const muiPlacement = CARET_TO_MUI_PLACEMENT[caretPlacement];
  // Caret tip 4px from trigger; without caret, bubble gap is 6px.
  const offsetDistance = hasCaret ? 4 + ARROW_HEIGHT_PX : 6;

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

  return (
    <MuiTooltip
      title={content}
      arrow={hasCaret}
      placement={muiPlacement}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, offsetDistance],
              },
            },
          ],
        },
        tooltip: {
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
          },
        },
        arrow: {
          sx: {
            color: "var(--background-neutral-primary-inverse)",
            fontSize: ARROW_SIZE_PX,
            "&::before": {
              backgroundColor: "var(--background-neutral-primary-inverse)",
            },
          },
        },
      }}
      {...rest}
    >
      {children}
    </MuiTooltip>
  );
}
