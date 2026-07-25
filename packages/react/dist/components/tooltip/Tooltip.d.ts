import { TooltipProps } from './types';
export type { TooltipProps } from './types';
/**
 * CADS Tooltip — inverse surface with optional caret and start icon.
 * Spec: Figma Tooltip `1990:7125` / key `8f604de25a1742f20b6e6f1dd3680bdfdbda2234`.
 *
 * Accepts the full MUI Tooltip prop surface (except `title` shape and `arrow`,
 * which are driven by CADS `title` / `hasCaret`). Position with MUI `placement`.
 * Pass `surfaceOnly` for static previews (no trigger / portal).
 */
export declare function Tooltip({ children, title, hasCaret, iconName, placement, surfaceOnly, slotProps, enterDelay, leaveDelay, ...rest }: TooltipProps): import("react").JSX.Element;
//# sourceMappingURL=Tooltip.d.ts.map