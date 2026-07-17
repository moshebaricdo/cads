import * as react from 'react';
import { ReactNode } from 'react';
import { ButtonProps as ButtonProps$1 } from '@mui/material/Button';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

/** Figma Button `variant` — contained / outlined / text. */
type ButtonVariant = "contained" | "outlined" | "text";
/** Figma Button `color`. */
type ButtonColor = "primary" | "secondary" | "tertiary" | "error";
/** Figma size scale. */
type ButtonSize = ControlSize;
interface ButtonProps extends Omit<ButtonProps$1, "variant" | "color" | "size" | "startIcon" | "endIcon"> {
    /**
     * Visual style (Figma: contained | outlined | text).
     * @default "contained"
     */
    variant?: ButtonVariant;
    /**
     * Color intent (Figma: primary | secondary | tertiary | error).
     * Tertiary is only valid for `variant="text"` + icon-only; other combos
     * fall back to secondary with a development warning.
     * @default "primary"
     */
    color?: ButtonColor;
    /**
     * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
     * @default "medium"
     */
    size?: ButtonSize;
    /** Force icon-only square geometry (also inferred when no children). */
    iconOnly?: boolean;
    /**
     * Font Awesome Pro icon at the start (kebab-case).
     * Figma shortcode `smile` is accepted (alias of `face-smile`).
     */
    startIconName?: FaIconName | (string & {});
    /**
     * Font Awesome Pro icon at the end (kebab-case).
     * Figma shortcode `smile` is accepted (alias of `face-smile`).
     */
    endIconName?: FaIconName | (string & {});
    fullWidth?: boolean;
    children?: ReactNode;
}
/**
 * CADS Button — MUI Button wrapped with Figma-parity variants, colors, and sizes.
 * Spec: CADS Figma Button `15724:18791` / key `2507b18076b4066c6ff738539115b36a798fd707`.
 */
declare const Button: react.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

export { Button, type ButtonColor, type ButtonProps, type ButtonSize, type ButtonVariant };
