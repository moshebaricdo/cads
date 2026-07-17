import * as react from 'react';
import { ReactNode } from 'react';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

type ChipSize = ControlSize;
type ChipColor = "primary" | "secondary";
type ChipLabelStyle = "thick" | "thin";
interface ChipProps extends Omit<ButtonBaseProps, "color" | "children"> {
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
    startIcon?: boolean;
    endIcon?: boolean;
    startIconName?: FaIconName | (string & {});
    endIconName?: FaIconName | (string & {});
}
/**
 * CADS Chip — selectable pill for use in ChipGroup (or alone).
 * Spec: Figma Chip `5881:2187` / key `388cba2ed6150b2a9b448f1895ed2f04ca90edb2`.
 */
declare const Chip: react.ForwardRefExoticComponent<Omit<ChipProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

export { Chip, type ChipColor, type ChipLabelStyle, type ChipProps, type ChipSize };
