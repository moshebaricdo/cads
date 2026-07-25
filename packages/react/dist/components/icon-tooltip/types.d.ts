import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { FaIconName } from '../../icons/faProRegularCodepoints';
import { ControlSize } from '../../shared/controlSize';
import { TooltipProps } from '../tooltip';
export type IconTooltipColor = "primary" | "secondary" | "tertiary";
export type IconTooltipSize = ControlSize;
export interface IconTooltipProps extends Omit<TooltipProps, "children" | "surfaceOnly" | "iconName"> {
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
//# sourceMappingURL=types.d.ts.map