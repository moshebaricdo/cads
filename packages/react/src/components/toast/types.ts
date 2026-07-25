import type { ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { MessagingSentiment } from "../../shared/messagingSentiment";

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
