import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { ReactNode } from 'react';
import { FaIconName } from '../../icons/faProRegularCodepoints';
import { ControlSize } from '../../shared/controlSize';
export type ChipSize = ControlSize;
export type ChipColor = "primary" | "secondary";
export type ChipLabelStyle = "thick" | "thin";
export interface ChipProps extends Omit<ButtonBaseProps, "color" | "children"> {
    /**
     * @default "medium"
     */
    size?: ChipSize;
    /**
     * Unselected border treatment. Selected chrome ignores this (uses selected tokens).
     * @default "primary"
     */
    color?: ChipColor;
    /**
     * @default "thick"
     */
    labelStyle?: ChipLabelStyle;
    /** Selected fill chrome (Figma `selected=yes`). */
    selected?: boolean;
    label?: ReactNode;
    /**
     * Leading FA icon. Omit for no start icon (Figma's boolean `startIcon` is
     * collapsed into presence of this prop).
     */
    startIconName?: FaIconName | (string & {});
    /**
     * Trailing FA icon. Omit for no end icon (Figma's boolean `endIcon` is
     * collapsed into presence of this prop).
     */
    endIconName?: FaIconName | (string & {});
}
//# sourceMappingURL=types.d.ts.map