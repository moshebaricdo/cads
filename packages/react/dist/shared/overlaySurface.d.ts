import { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
/** Default max width for Dialog and Modal surfaces (Figma 800px). */
export declare const DEFAULT_OVERLAY_MAX_WIDTH = 800;
export declare function resolveOverlayMaxWidth(maxWidth?: number | string): number | string;
export declare function overlayDismissHandler(isDismissable: boolean, onClose?: () => void): MuiDialogProps["onClose"];
//# sourceMappingURL=overlaySurface.d.ts.map