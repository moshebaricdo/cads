import * as react from 'react';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';
import { TooltipProps } from './Tooltip.js';
import '@mui/material/Tooltip';

type IconTooltipColor = "primary" | "secondary" | "tertiary";
type IconTooltipSize = ControlSize;
interface IconTooltipProps extends Omit<TooltipProps, "children" | "surfaceOnly" | "iconName"> {
    /**
     * FA Pro icon rendered as the tooltip trigger affordance.
     * @default "circle-info"
     */
    iconName?: FaIconName | (string & {});
    /**
     * Icon color role — brand, neutral-primary, or muted quaternary.
     * @default "tertiary"
     */
    color?: IconTooltipColor;
    /**
     * Glyph size on the shared control size scale.
     * @default "medium"
     */
    size?: IconTooltipSize;
    /**
     * Accessible name for the trigger. Falls back to `title` when it is a
     * plain string; required when `title` is rich content.
     */
    "aria-label"?: string;
    /** Escape hatch for the underlying trigger (ButtonBase) props. */
    triggerProps?: Omit<ButtonBaseProps, "children" | "color">;
}
/**
 * CADS Icon Tooltip — an info-style icon that is purely a tooltip affordance.
 * No button chrome (fill/border/press scale); only a required focus ring on
 * keyboard focus. Composes `Tooltip` for positioning/caret — this component
 * only owns the trigger glyph.
 *
 * Spec: Figma Info Tooltip `17051:27346` (size × color × state), authored from
 * this implementation. `placement` / `hasCaret` come from the `Tooltip` set
 * (`1990:7125`); Figma only models the default top placement.
 */
declare const IconTooltip: react.ForwardRefExoticComponent<Omit<IconTooltipProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

export { IconTooltip, type IconTooltipColor, type IconTooltipProps, type IconTooltipSize };
