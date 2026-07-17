import * as react from 'react';
import { ReactNode, MouseEvent } from 'react';
import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { ControlSize } from '../shared/controlSize.js';

type ToggleSize = ControlSize;
/**
 * Label placement relative to the switch:
 * - `left` — label on the left, switch on the right
 * - `right` — switch on the left, label on the right
 *
 * (Corrects inverted Figma `labelPlacement` naming.)
 */
type ToggleLabelPlacement = "left" | "right";
interface ToggleProps extends Omit<ButtonBaseProps, "onChange" | "children" | "color"> {
    /**
     * @default "medium"
     */
    size?: ToggleSize;
    /** Optional adjacent label (Figma Toggle + Label). */
    label?: ReactNode;
    /**
     * Where the label sits relative to the switch.
     * @default "left"
     */
    labelPlacement?: ToggleLabelPlacement;
    /** Controlled on/off (Figma `isOn`). */
    checked?: boolean;
    /** Uncontrolled default. */
    defaultChecked?: boolean;
    onChange?: (event: MouseEvent<HTMLButtonElement>, checked: boolean) => void;
}
/**
 * CADS Toggle — switch with check / xmark icons and a sliding handle.
 * Spec: Figma Toggle + Label `327:2151`, block `8841:5569`.
 */
declare const Toggle: react.ForwardRefExoticComponent<Omit<ToggleProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

export { Toggle, type ToggleLabelPlacement, type ToggleProps, type ToggleSize };
