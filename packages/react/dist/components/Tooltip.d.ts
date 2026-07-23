import * as react from 'react';
import { ReactNode, ReactElement } from 'react';
import { TooltipProps as TooltipProps$1 } from '@mui/material/Tooltip';
import { FaIconName } from '../icons/faProRegularCodepoints.js';

interface TooltipProps extends Omit<TooltipProps$1, "title" | "arrow"> {
    /** Tooltip label (Figma `text`). */
    title: ReactNode;
    children: ReactElement;
    /**
     * Show caret (Figma `hasCaret`). Maps to MUI `arrow`.
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
    /**
     * MUI placement (where the tooltip sits relative to the trigger).
     * `*-start` / `*-end` also pin the caret to that edge of the bubble.
     * @default "bottom"
     */
    placement?: TooltipProps$1["placement"];
}
/**
 * CADS Tooltip — inverse surface with optional caret and start icon.
 * Spec: Figma Tooltip `1990:7125` / key `8f604de25a1742f20b6e6f1dd3680bdfdbda2234`.
 *
 * Accepts the full MUI Tooltip prop surface (except `title` shape and `arrow`,
 * which are driven by CADS `title` / `hasCaret`). Position with MUI `placement`.
 */
declare function Tooltip({ children, title, hasCaret, startIcon, iconName, placement, slotProps, ...rest }: TooltipProps): react.JSX.Element;

export { Tooltip, type TooltipProps };
