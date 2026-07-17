import * as react from 'react';
import { ReactNode, ReactElement } from 'react';
import { TooltipProps as TooltipProps$1 } from '@mui/material/Tooltip';
import { FaIconName } from '../icons/faProRegularCodepoints.js';

/** Figma Tooltip `caretPlacement` — side of the bubble the caret sits on. */
type TooltipCaretPlacement = "top" | "bottom" | "left" | "right";
interface TooltipProps extends Omit<TooltipProps$1, "title" | "placement" | "arrow"> {
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
declare function Tooltip({ children, title, caretPlacement, hasCaret, startIcon, iconName, ...rest }: TooltipProps): react.JSX.Element;

export { Tooltip, type TooltipCaretPlacement, type TooltipProps };
