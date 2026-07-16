import * as react from 'react';
import { ReactNode, ReactElement } from 'react';
import { ButtonProps as ButtonProps$1 } from '@mui/material/Button';
import { F as FaIconName } from './faProRegularCodepoints-Bm2_kbhk.js';
import { TextFieldProps as TextFieldProps$1 } from '@mui/material/TextField';
import { CheckboxProps as CheckboxProps$1 } from '@mui/material/Checkbox';
import { RadioProps as RadioProps$1 } from '@mui/material/Radio';
import { ChipProps } from '@mui/material/Chip';
import { TooltipProps as TooltipProps$1 } from '@mui/material/Tooltip';
export { CADS_FIGMA_FILE_KEY, CadsComponentManifest, CadsPropDef, cadsManifest } from './manifest/cads.manifest.js';

interface CadsProviderProps {
    children: ReactNode;
    /** When true, injects MUI CssBaseline. Default true. */
    baseline?: boolean;
}
/**
 * Provides the CADS MUI theme. Pair with `@codeai/cads-variables/variables.css`
 * and toggle `.dark` on an ancestor for dark mode.
 */
declare function CadsProvider({ children, baseline }: CadsProviderProps): react.JSX.Element;

/** CADS button visual variants (Figma component set). */
type ButtonVariant = "primary" | "secondary" | "tertiary";
/** Brand / chrome tones. */
type ButtonTone = "brand" | "neutral" | "white" | "destructive";
/** Shared control height scale L–XS. */
type ButtonSize = "l" | "m" | "s" | "xs";
interface ButtonProps extends Omit<ButtonProps$1, "variant" | "color" | "size"> {
    /**
     * Visual style.
     * @default "secondary"
     */
    variant?: ButtonVariant;
    /**
     * Color tone.
     * @default "neutral"
     */
    tone?: ButtonTone;
    /**
     * Control height: L 48 / M 40 / S 32 / XS 24.
     * @default "m"
     */
    size?: ButtonSize;
    /** Font Awesome Pro icon name (solid). */
    iconName?: FaIconName;
    iconPosition?: "start" | "end";
    fullWidth?: boolean;
    children?: ReactNode;
}
/**
 * CADS Button — MUI Button wrapped with CADS variants, tones, and size scale.
 * Spec source: CADS Figma Button component set.
 */
declare const Button: react.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

type TextFieldSize = "l" | "m" | "s" | "xs";
interface TextFieldProps extends Omit<TextFieldProps$1, "size" | "variant"> {
    /**
     * Control height: L 48 / M 40 / S 32 / XS 24.
     * @default "m"
     */
    size?: TextFieldSize;
    /** Helper / error text below the field. */
    helperText?: ReactNode;
}
/**
 * CADS TextField — single-line input with shared control heights.
 * Spec source: CADS Figma Text Field component set.
 */
declare const TextField: react.ForwardRefExoticComponent<Omit<TextFieldProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

interface CheckboxProps extends Omit<CheckboxProps$1, "size"> {
    /** Optional label rendered via FormControlLabel. */
    label?: ReactNode;
    size?: "m" | "s";
}
/**
 * CADS Checkbox — uses selected-fill recipe for checked state.
 * Spec source: CADS Figma Checkbox component set.
 */
declare const Checkbox: react.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

interface RadioProps extends Omit<RadioProps$1, "size"> {
    /** Optional label rendered via FormControlLabel. */
    label?: ReactNode;
    size?: "m" | "s";
}
/**
 * CADS Radio — uses selected-fill recipe for checked state.
 * Spec source: CADS Figma Radio component set.
 */
declare const Radio: react.ForwardRefExoticComponent<Omit<RadioProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

type TagTone = "neutral" | "brand" | "success" | "warning" | "error" | "info";
type TagSize = "m" | "s";
interface TagProps extends Omit<ChipProps, "color" | "size" | "icon"> {
    /**
     * Semantic tone.
     * @default "neutral"
     */
    tone?: TagTone;
    /**
     * @default "m"
     */
    size?: TagSize;
    iconName?: FaIconName;
}
/**
 * CADS Tag (Chip) — compact labeled badge with optional icon.
 * Spec source: CADS Figma Tag / Chip component set.
 */
declare const Tag: react.ForwardRefExoticComponent<Omit<TagProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

interface TooltipProps extends Omit<TooltipProps$1, "title"> {
    /** Tooltip content. */
    title: TooltipProps$1["title"];
    children: ReactElement;
}
/**
 * CADS Tooltip — dark inverse surface over the trigger.
 * Spec source: CADS Figma Tooltip component set.
 */
declare function Tooltip({ children, title, ...rest }: TooltipProps): react.JSX.Element;

export { Button, type ButtonProps, type ButtonSize, type ButtonTone, type ButtonVariant, CadsProvider, type CadsProviderProps, Checkbox, type CheckboxProps, Radio, type RadioProps, Tag, type TagProps, type TagSize, type TagTone, TextField, type TextFieldProps, type TextFieldSize, Tooltip, type TooltipProps };
