import * as react from 'react';
import { ReactNode } from 'react';
import { RadioProps as RadioProps$1 } from '@mui/material/Radio';
import { ControlSize } from '../shared/controlSize.js';

type RadioSize = ControlSize;
type RadioLabelStyle = "thin" | "thick";
interface RadioProps extends Omit<RadioProps$1, "size" | "icon" | "checkedIcon"> {
    /** Optional label (Figma Radio Button + Label). */
    label?: ReactNode;
    /** Control size — Figma `size` axis. */
    size?: RadioSize;
    /** Label weight — Figma `labelStyle` (`thin` = regular, `thick` = semibold). */
    labelStyle?: RadioLabelStyle;
}
/**
 * CADS Radio — circular radio with selected ring + inner dot (not a filled square).
 * Spec: Figma Radio Button + Label `4675:6352` / Radio Buttons Block `13257:411`.
 * Interaction states via CSS pseudo-classes — no `state` React prop.
 * Group with MUI `RadioGroup` when needed.
 */
declare const Radio: react.ForwardRefExoticComponent<Omit<RadioProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

export { Radio, type RadioLabelStyle, type RadioProps, type RadioSize };
