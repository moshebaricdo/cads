import * as react from 'react';
import { ReactNode } from 'react';
import { IconButtonProps } from '@mui/material/IconButton';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

type IconToggleSize = ControlSize;
/** Figma Icon Toggle `color`: primary / secondary / brand / error / success. */
type IconToggleColor = "primary" | "secondary" | "brand" | "success" | "error";
type IconToggleSecondProps = {
    /** FA Pro icon (kebab-case); Figma `smile` alias accepted. */
    iconName: FaIconName | (string & {});
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    "aria-label": string;
    disabled?: boolean;
    /** Color recipe for this toggle only (independent of parent `color`). */
    color?: IconToggleColor;
};
interface IconToggleProps extends Omit<IconButtonProps, "color" | "size" | "children"> {
    /**
     * @default "medium"
     */
    size?: IconToggleSize;
    /**
     * Active (on) + hover/press surface recipe.
     * @default "brand"
     */
    color?: IconToggleColor;
    /** Controlled on/off (Figma `isOn`). */
    pressed?: boolean;
    /** Uncontrolled default. */
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    /** FA Pro icon name (kebab-case); Figma `smile` alias accepted. */
    iconName: FaIconName | (string & {});
    /**
     * Optional group label (Figma Icon Toggle + Label).
     */
    label?: ReactNode;
    /**
     * Optional second toggle for labeled groups (Figma `hasTwoToggles`, up to 2).
     * Toggles are independent unless `exclusive` is set.
     */
    secondToggle?: IconToggleSecondProps;
    /**
     * When `secondToggle` is set, turning one on turns the other off.
     * Figma does not encode exclusive pairing — defaults to independent binary
     * toggles. Use `exclusive` for thumbs-up/down-style mutual exclusion
     * (both may still be off).
     * @default false
     */
    exclusive?: boolean;
}
/**
 * CADS Icon Toggle — icon-only binary control.
 * Covers Figma Icon Toggle + Icon Toggle + Label in one API.
 * Spec: `3710:461` / `3514:2239`.
 */
declare const IconToggle: react.ForwardRefExoticComponent<Omit<IconToggleProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

export { IconToggle, type IconToggleColor, type IconToggleProps, type IconToggleSecondProps, type IconToggleSize };
