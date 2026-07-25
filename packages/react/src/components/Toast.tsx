import Box from "@mui/material/Box";
import MuiSnackbar from "@mui/material/Snackbar";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import { TOAST_CHROME } from "../shared/controlSize";
import {
  defaultStatusIcon,
  messagingChrome,
  resolveMessagingIconName,
  type MessagingSentiment,
} from "../shared/messagingSentiment";
import {
  useExperimentalMotion,
  useSurfacePresence,
} from "../theme/experimentalMotion";
import { Button } from "./Button";
import { CloseIconButton } from "./CloseIconButton";

/** Figma Toast `sentiment` (uses `primary` for brand chrome). */
export type ToastSentiment = Exclude<MessagingSentiment, "brand" | "orange">;

/**
 * Viewport corner / edge for the snackbar host (MUI `anchorOrigin`).
 * @default "bottomCenter"
 */
export type ToastPlacement =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

const DEFAULT_OFFSET_PX = 64;

function resolveActionLabel(label: ReactNode | undefined): ReactNode {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}

function placementToAnchor(placement: ToastPlacement): {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
} {
  switch (placement) {
    case "topLeft":
      return { vertical: "top", horizontal: "left" };
    case "topCenter":
      return { vertical: "top", horizontal: "center" };
    case "topRight":
      return { vertical: "top", horizontal: "right" };
    case "bottomLeft":
      return { vertical: "bottom", horizontal: "left" };
    case "bottomRight":
      return { vertical: "bottom", horizontal: "right" };
    case "bottomCenter":
    default:
      return { vertical: "bottom", horizontal: "center" };
  }
}

/** Surface recipe origin — grow from the viewport edge the toast is pinned to. */
function placementToSurfaceOrigin(placement: ToastPlacement): string {
  switch (placement) {
    case "topLeft":
      return "top left";
    case "topCenter":
      return "top center";
    case "topRight":
      return "top right";
    case "bottomLeft":
      return "bottom left";
    case "bottomRight":
      return "bottom right";
    case "bottomCenter":
    default:
      return "bottom center";
  }
}

/**
 * Inline styles beat MUI Snackbar’s breakpoint rules (sm+ pins top/bottom/left/right
 * to 24px, and left+right:8 stretches the root full-bleed). We size the root to
 * the toast and pin all relevant edges so offset + hug width both stick.
 */
function snackbarHostStyle(
  placement: ToastPlacement,
  offset: number,
): CSSProperties {
  const { vertical, horizontal } = placementToAnchor(placement);
  return {
    width: "auto",
    maxWidth: `calc(100% - ${offset * (horizontal === "center" ? 2 : 1)}px)`,
    ...(vertical === "top" ? { top: offset } : { bottom: offset }),
    ...(horizontal === "left"
      ? { left: offset, right: "auto", transform: "none" }
      : null),
    ...(horizontal === "right"
      ? { right: offset, left: "auto", transform: "none" }
      : null),
    ...(horizontal === "center"
      ? {
          left: "50%",
          right: "auto",
          transform: "translateX(-50%)",
        }
      : null),
  };
}

export interface ToastProps {
  /**
   * Figma `sentiment`.
   * @default "primary"
   */
  sentiment?: ToastSentiment;
  /** Toast body copy (Figma `toastText`). */
  children?: ReactNode;
  /**
   * Leading status/custom icon (Figma `hasIcon` + icon name).
   * - `undefined` — show the sentiment default (or face-smile)
   * - `false` — hide the icon (MUI Alert `icon={false}` convention)
   * - string — custom FA icon name
   */
  iconName?: FaIconName | false | (string & {});
  /**
   * Show trailing outlined secondary action button (variant/color/size locked).
   * @default false
   */
  hasAction?: boolean;
  /**
   * Action button label. Always required when `hasAction` — empty falls back to "Button".
   * @default "Button"
   */
  actionLabel?: ReactNode;
  /** Optional start icon on the locked secondary outlined action Button. */
  actionStartIconName?: FaIconName | (string & {});
  /** Optional end icon on the locked secondary outlined action Button. */
  actionEndIconName?: FaIconName | (string & {});
  onAction?: () => void;
  /**
   * @default true
   */
  isDismissible?: boolean;
  onClose?: () => void;
  /**
   * Controlled visibility for the snackbar host.
   * When omitted, Toast renders as an inline surface (fixtures / static previews).
   */
  open?: boolean;
  /**
   * Viewport placement when hosted in the snackbar portal.
   * @default "bottomCenter"
   */
  placement?: ToastPlacement;
  /**
   * Distance in px from the viewport edge(s) the toast is pinned to.
   * @default 64
   */
  offset?: number;
  /**
   * Render only the elevated surface (no snackbar portal). Fixtures use this;
   * also the default when `open` is omitted.
   */
  surfaceOnly?: boolean;
  className?: string;
  role?: string;
}

type ToastSurfaceProps = Omit<
  ToastProps,
  "open" | "placement" | "offset" | "surfaceOnly"
> & {
  surfaceExiting?: boolean;
  surfaceOrigin?: string;
};

const ToastSurface = forwardRef<HTMLDivElement, ToastSurfaceProps>(
  function ToastSurface(
    {
      sentiment = "primary",
      children = "This is a toast.",
      iconName,
      hasAction = false,
      actionLabel = "Button",
      actionStartIconName,
      actionEndIconName,
      onAction,
      isDismissible = true,
      onClose,
      className,
      role = "status",
      surfaceExiting = false,
      surfaceOrigin = "bottom center",
    },
    ref,
  ) {
    const chrome = messagingChrome(sentiment);
    const statusDefault = defaultStatusIcon(sentiment);
    const showIcon = iconName !== false;
    const resolvedIcon = showIcon
      ? resolveMessagingIconName(
          typeof iconName === "string" ? iconName : undefined,
          statusDefault ?? "face-smile",
        )
      : null;
    const label = resolveActionLabel(actionLabel);

    return (
      <Box
        ref={ref}
        role={role}
        className={className}
        data-cads-component="Toast"
        data-cads-surface=""
        {...(surfaceExiting ? { "data-cads-surface-state": "exit" } : {})}
        sx={{
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          /* Hug copy + actions (Figma’s 300px is the default-string size, not a cap). */
          width: "fit-content",
          maxWidth: "100%",
          flexShrink: 0,
          paddingInline: TOAST_CHROME.paddingInline,
          paddingBlock: TOAST_CHROME.paddingBlock,
          gap: TOAST_CHROME.gap,
          borderRadius: TOAST_CHROME.radius,
          border: `1px solid ${chrome.border}`,
          backgroundColor: chrome.background,
          boxShadow: TOAST_CHROME.shadow,
          fontFamily: "var(--font-body)",
          /* Surface recipe: grow from the pinned viewport edge. */
          "--cads-surface-origin": surfaceOrigin,
        }}
      >
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          alignItems: "center",
          gap: TOAST_CHROME.contentGap,
          minWidth: 0,
          color: "var(--text-neutral-primary)",
        }}
      >
        {showIcon && resolvedIcon ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: TOAST_CHROME.iconSlot,
              color: chrome.icon,
              lineHeight: 1,
              "& > *": { display: "block", lineHeight: 1 },
            }}
            aria-hidden
          >
            <FaIcon name={resolvedIcon} fontSize={TOAST_CHROME.iconPx} />
          </Box>
        ) : null}
        <Box
          component="p"
          sx={{
            m: 0,
            /* Prefer one-line hug; wrap only when maxWidth constrains. */
            flex: "0 1 auto",
            minWidth: 0,
            fontSize: TOAST_CHROME.fontSize,
            lineHeight: TOAST_CHROME.lineHeight,
            fontWeight: "var(--font-weight-normal)",
          }}
        >
          {children}
        </Box>
      </Box>
      {hasAction || isDismissible ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            gap: TOAST_CHROME.actionGap,
          }}
        >
          {hasAction ? (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIconName={actionStartIconName}
              endIconName={actionEndIconName}
              onClick={onAction}
            >
              {label}
            </Button>
          ) : null}
          {isDismissible ? (
            <CloseIconButton
              size="medium"
              color={
                sentiment === "primary"
                  ? "brand"
                  : sentiment === "neutral"
                    ? "secondary"
                    : sentiment
              }
              onClick={onClose}
            />
          ) : null}
        </Box>
      ) : null}
      </Box>
    );
  },
);

/**
 * CADS Toast — temporary elevated feedback notification.
 * Spec: Figma Toast `10587:14942` / key `29c36f3d7ec051b81e7dc42a724d9097a680f2ee`.
 *
 * Presentational when `open` is omitted (fixtures). Pass `open` to host via
 * MUI Snackbar with viewport `placement` + `offset`.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    sentiment = "primary",
    children = "This is a toast.",
    iconName,
    hasAction = false,
    actionLabel = "Button",
    actionStartIconName,
    actionEndIconName,
    onAction,
    isDismissible = true,
    onClose,
    open: openProp,
    placement = "bottomCenter",
    offset = DEFAULT_OFFSET_PX,
    surfaceOnly,
    className,
    role = "status",
  },
  ref,
) {
  const experimentalMotion = useExperimentalMotion();
  const isSurfaceOnly = surfaceOnly ?? openProp === undefined;
  const open = Boolean(openProp);
  const { mounted: surfaceMounted, exiting: surfaceExiting } =
    useSurfacePresence(open);
  const surfaceOrigin = placementToSurfaceOrigin(placement);
  const anchorOrigin = placementToAnchor(placement);

  const surface = (
    <ToastSurface
      ref={ref}
      sentiment={sentiment}
      iconName={iconName}
      hasAction={hasAction}
      actionLabel={actionLabel}
      actionStartIconName={actionStartIconName}
      actionEndIconName={actionEndIconName}
      onAction={onAction}
      isDismissible={isDismissible}
      onClose={onClose}
      className={className}
      role={role}
      surfaceExiting={!isSurfaceOnly && surfaceExiting}
      surfaceOrigin={surfaceOrigin}
    >
      {children}
    </ToastSurface>
  );

  if (isSurfaceOnly) {
    return surface;
  }

  return (
    <MuiSnackbar
      open={surfaceMounted}
      anchorOrigin={anchorOrigin}
      /* Host apps own auto-dismiss; ignore clickaway so the surface stays until dismissed. */
      onClose={(_event, reason) => {
        if (reason === "clickaway") return;
        onClose?.();
      }}
      /* When experimental Surface is on, neutralize MUI Grow so CSS owns enter/exit. */
      transitionDuration={experimentalMotion ? 0 : undefined}
      slotProps={{
        root: {
          style: snackbarHostStyle(placement, offset),
        },
      }}
    >
      {surface}
    </MuiSnackbar>
  );
});
