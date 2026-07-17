import * as react from 'react';
import { ReactNode } from 'react';
import { ChipSize, ChipColor, ChipLabelStyle } from './Chip.js';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import '@mui/material/ButtonBase';
import '../shared/controlSize.js';

type ChipGroupSize = ChipSize;
type ChipGroupColor = ChipColor;
type ChipGroupLabelStyle = ChipLabelStyle;
interface ChipGroupOption {
    value: string;
    label: ReactNode;
    startIcon?: boolean;
    endIcon?: boolean;
    startIconName?: FaIconName | (string & {});
    endIconName?: FaIconName | (string & {});
    disabled?: boolean;
}
interface ChipGroupProps {
    /**
     * @default "medium"
     */
    size?: ChipGroupSize;
    /**
     * Unselected chip border treatment.
     * @default "primary"
     */
    color?: ChipGroupColor;
    /**
     * @default "thick"
     */
    labelStyle?: ChipGroupLabelStyle;
    label?: ReactNode;
    helperText?: ReactNode;
    helperIconName?: FaIconName | (string & {});
    /**
     * @default true
     */
    showHelper?: boolean;
    options: ChipGroupOption[];
    /** Multi-select selected values. */
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    disabled?: boolean;
    "aria-label"?: string;
    className?: string;
}
/**
 * CADS Chip Group — labeled multi-select chips with Field Wrapper chrome.
 * Spec: Figma Chip Group `15953:3568` / key `65c61f6f006c06e27b293ca8f5e573d650c69c06`.
 */
declare const ChipGroup: react.ForwardRefExoticComponent<ChipGroupProps & react.RefAttributes<HTMLDivElement>>;

export { ChipGroup, type ChipGroupColor, type ChipGroupLabelStyle, type ChipGroupOption, type ChipGroupProps, type ChipGroupSize };
