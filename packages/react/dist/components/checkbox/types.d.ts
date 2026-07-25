import { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import { ReactNode } from 'react';
import { ControlSize } from '../../shared/controlSize';
export type CheckboxSize = ControlSize;
export type CheckboxLabelStyle = "thin" | "thick";
export interface CheckboxProps extends Omit<MuiCheckboxProps, "size" | "color"> {
    /**
     * @default "medium"
     */
    size?: CheckboxSize;
    /** Optional label (Figma Checkbox + Label `Text#252:0`). */
    label?: ReactNode;
    /**
     * Label weight from Figma `labelStyle`.
     * @default "thin"
     */
    labelStyle?: CheckboxLabelStyle;
}
//# sourceMappingURL=types.d.ts.map