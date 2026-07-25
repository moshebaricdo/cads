import * as react from 'react';
import { ReactNode, ReactElement } from 'react';
import { TooltipProps as TooltipProps$1 } from '@mui/material/Tooltip';
import { FaIconName } from '../icons/faProRegularCodepoints.js';

interface TooltipProps extends Omit<TooltipProps$1, "title" | "arrow" | "children"> {
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
    placement?: TooltipProps$1["placement"];
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
declare function Tooltip({ children, title, hasCaret, iconName, placement, surfaceOnly, slotProps, enterDelay, leaveDelay, ...rest }: TooltipProps): react.JSX.Element;

export { Tooltip, type TooltipProps };
