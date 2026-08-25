import type { DialogProps as MuiDialogProps } from "@mui/material/Dialog";

/** Default max width for Dialog and Modal surfaces (Figma 800px). */
export const DEFAULT_OVERLAY_MAX_WIDTH = 800;

export function resolveOverlayMaxWidth(
  maxWidth?: number | string,
): number | string {
  if (maxWidth == null) return DEFAULT_OVERLAY_MAX_WIDTH;
  if (typeof maxWidth === "number") return maxWidth;
  const trimmed = maxWidth.trim();
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

export function overlayDismissHandler(
  isDismissable: boolean,
  onClose?: () => void,
): MuiDialogProps["onClose"] {
  return (_event, reason) => {
    if (
      !isDismissable &&
      (reason === "backdropClick" || reason === "escapeKeyDown")
    ) {
      return;
    }
    onClose?.();
  };
}
