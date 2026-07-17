import * as react from 'react';
import { ReactNode } from 'react';
import { CheckboxProps as CheckboxProps$1 } from '@mui/material/Checkbox';
import { ControlSize } from '../shared/controlSize.js';

type CheckboxSize = ControlSize;
type CheckboxLabelStyle = "thin" | "thick";
interface CheckboxProps extends Omit<CheckboxProps$1, "size" | "color"> {
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
/**
 * CADS Checkbox — Figma Checkbox + Label / Checkbox block parity.
 * Selected chrome uses selected tokens (never brand fills for selected).
 * Interaction states via CSS (:hover / :focus-visible / :active); no `state` prop.
 */
declare const Checkbox: react.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

export { Checkbox, type CheckboxLabelStyle, type CheckboxProps, type CheckboxSize };
