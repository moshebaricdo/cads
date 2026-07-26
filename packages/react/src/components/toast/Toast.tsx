import MuiSnackbar from "@mui/material/Snackbar";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { FaIcon } from "../../icons/FaIcon";
import { TOAST_CHROME } from "../../shared/controlSize";
import {
  defaultStatusIcon,
  messagingChrome,
  resolveMessagingIconName,
} from "../../shared/messagingSentiment";
import {
  experimentalMotionHostAttrs,
  surfaceMotionStateAttrs,
  useExperimentalMotion,
  useSurfacePresence,
} from "../../theme/experimentalMotion";
import { Button } from "../button/index";
import { CloseIconButton } from "../close-icon-button";
import styles from "./toast.module.scss";
import type { ToastPlacement, ToastProps } from "./types";

export type { ToastPlacement, ToastProps, ToastSentiment } from "./types";

const DEFAULT_OFFSET_PX = 64;

function resolveActionLabel(label: ReactNode | undefined): ReactNode {
  if (label == null) return "Button";
  if (typeof label === "string" && label.trim() === "") return "Button";
  return label;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
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
 * Inline styles beat MUI Snackbar's breakpoint rules (sm+ pins top/bottom/left/right
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

type ToastSurfaceProps = Omit<
  ToastProps,
  "open" | "placement" | "offset" | "surfaceOnly"
> & {
  surfaceEntering?: boolean;
  surfaceExiting?: boolean;
  surfaceOrigin?: string;
  experimentalMotion?: boolean;
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
      surfaceEntering = false,
      surfaceExiting = false,
      surfaceOrigin = "bottom center",
      experimentalMotion = false,
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

    const chromeVars = {
      "--toast-border": chrome.border,
      "--toast-bg": chrome.background,
      "--toast-icon-color": chrome.icon,
      "--toast-surface-origin": surfaceOrigin,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        role={role}
        className={cx(styles.surface, className)}
        style={chromeVars}
        data-cads-component="Toast"
        data-cads-surface=""
        {...experimentalMotionHostAttrs(experimentalMotion)}
        {...surfaceMotionStateAttrs(surfaceEntering, surfaceExiting)}
      >
        <div className={styles.content}>
          {showIcon && resolvedIcon ? (
            <div className={styles.iconWrap} aria-hidden>
              <FaIcon name={resolvedIcon} fontSize={TOAST_CHROME.iconPx} />
            </div>
          ) : null}
          <p className={styles.text}>{children}</p>
        </div>
        {hasAction || isDismissible ? (
          <div className={styles.trailing}>
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
          </div>
        ) : null}
      </div>
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
  const {
    mounted: surfaceMounted,
    exiting: surfaceExiting,
    entering: surfaceEntering,
  } = useSurfacePresence(open);
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
      surfaceEntering={!isSurfaceOnly && surfaceEntering}
      surfaceExiting={!isSurfaceOnly && surfaceExiting}
      surfaceOrigin={surfaceOrigin}
      experimentalMotion={experimentalMotion}
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
      onClose={(_event, reason) => {
        if (reason === "clickaway") return;
        onClose?.();
      }}
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
