import * as react from 'react';
import { ReactNode, CSSProperties, InputHTMLAttributes, ChangeEvent, ReactElement } from 'react';
import { ButtonProps as ButtonProps$1 } from '@mui/material/Button';
import { F as FaIconName } from './faProRegularCodepoints-DVbgUpNH.js';
import { IconButtonProps } from '@mui/material/IconButton';
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

/**
 * Shared control size scale (Figma: large / medium / small / extraSmall).
 * Heights map to CSS variables; paddings/gaps use rem (root) or em (font-relative).
 */
type ControlSize = "large" | "medium" | "small" | "extraSmall";

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

type SegmentedButtonSize = ControlSize;
interface SegmentedButtonOption {
    value: string;
    label: ReactNode;
    iconName?: FaIconName;
    endIconName?: FaIconName;
    disabled?: boolean;
}
interface SegmentedButtonProps {
    /**
     * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
     * @default "medium"
     */
    size?: SegmentedButtonSize;
    /** Currently selected value (exclusive). */
    value?: string;
    /** Uncontrolled default. */
    defaultValue?: string;
    onChange?: (value: string) => void;
    options: SegmentedButtonOption[];
    disabled?: boolean;
    /** Square icon-only segments (Figma `iconOnly`). */
    iconOnly?: boolean;
    "aria-label"?: string;
    className?: string;
}
/**
 * CADS Segmented Button Group — mutually exclusive connected segments.
 * Building blocks map to Figma Segmented Button Block; consumers use this group.
 *
 * Spec: page `587:1268`, Group set `8027:2099` (key `bf599e1bc1d1e651be6aab5bf90ac6a7c26dcfd1`),
 * Block set `8000:4554` (key `d8dbdc672ccdc6755ae409e31e5517571424384e`).
 */
declare const SegmentedButton: react.ForwardRefExoticComponent<SegmentedButtonProps & react.RefAttributes<HTMLDivElement>>;

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

type FieldWrapperSize = ControlSize;
type FieldSentiment = "default" | "success" | "warning" | "error";
interface FieldContextValue {
    size: FieldWrapperSize;
    sentiment: FieldSentiment;
    disabled: boolean;
    labelId: string;
    helperId: string;
    controlId: string;
    describedBy?: string;
    error: boolean;
}
declare function useFieldContext(): FieldContextValue | null;
interface FieldWrapperProps {
    /**
     * Control height scale for label/helper typography.
     * @default "medium"
     */
    size?: FieldWrapperSize;
    /**
     * Validation / messaging tone (Figma `sentiment`).
     * @default "default"
     */
    sentiment?: FieldSentiment;
    /** Visible field label. */
    label?: ReactNode;
    /** Helper / validation text below the control slot. */
    helperText?: ReactNode;
    /**
     * Icon for default sentiment helper. Sentiment overrides use fixed icons.
     * Figma shortcode `smile` is accepted.
     */
    helperIconName?: FaIconName | (string & {});
    /**
     * When false, helper row is hidden even if helperText is set.
     * Non-default sentiments always show helper when helperText is present.
     * @default true
     */
    showHelper?: boolean;
    /** Associates the label with a control id when children are not auto-wired. */
    htmlFor?: string;
    disabled?: boolean;
    /** Nested input / control (Figma `inputType` slot). */
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}
/**
 * CADS Field Wrapper — label + control slot + helper/validation messaging.
 * Spec: Figma Field Wrapper `15857:99804` / key `a76313f790928233bb8afabe35bd6f76f6e9a473`.
 */
declare const FieldWrapper: react.ForwardRefExoticComponent<FieldWrapperProps & react.RefAttributes<HTMLDivElement>>;

type TextInputSize = ControlSize;
type TextInputColor = "primary" | "secondary";
type SharedNativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "value" | "defaultValue" | "onChange" | "children">;
interface TextInputProps extends SharedNativeProps {
    /**
     * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
     * @default "medium"
     */
    size?: TextInputSize;
    /**
     * Border emphasis (Figma building-block `color`).
     * primary = solid border; secondary = soft border.
     * @default "primary"
     */
    color?: TextInputColor;
    /**
     * When true, renders a multiline area (Figma `type=area`).
     * @default false
     */
    multiline?: boolean;
    /** Visible field label via Field Wrapper. */
    label?: ReactNode;
    /** Helper / validation text via Field Wrapper. */
    helperText?: ReactNode;
    helperIconName?: FaIconName | (string & {});
    showHelper?: boolean;
    /**
     * Field Wrapper sentiment. `error` also drives building-block error chrome.
     * @default "default"
     */
    sentiment?: FieldSentiment;
    /** Convenience alias that sets sentiment=error. */
    error?: boolean;
    value?: string;
    defaultValue?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    rows?: number;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    style?: CSSProperties;
    /** Optional override for the native control id. */
    id?: string;
}
/**
 * CADS Text Input — Field Wrapper + Text Input Building Block chrome.
 * Spec: public set `16176:4884` / key `ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4`,
 * building block `16146:3517`.
 *
 * Figma `type=field|area` maps to `multiline={false|true}`.
 * Figma `isFilled` / interaction `state` are derived (value / CSS / props).
 */
declare const TextInput: react.ForwardRefExoticComponent<TextInputProps & react.RefAttributes<HTMLDivElement>>;

/**
 * @deprecated Prefer `TextInput`. Kept as a compatibility alias for early pilots.
 */
type TextFieldSize = TextInputSize;
/**
 * @deprecated Prefer `TextInput`. Kept as a compatibility alias for early pilots.
 */
type TextFieldProps = TextInputProps;
/**
 * @deprecated Prefer `TextInput`. Compatibility alias that forwards to TextInput.
 * Spec source: CADS Figma Text Input (`16176:4884`).
 */
declare const TextField: react.ForwardRefExoticComponent<TextInputProps & react.RefAttributes<HTMLDivElement>>;

type DropdownSize = ControlSize;
type DropdownRole = "input" | "action";
type DropdownMenuType = "icon" | "checklist";
type DropdownMenuPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
type DropdownLabelStyle = "thick" | "thin";
type DropdownColor = "primary" | "secondary";
/**
 * Input-role field width.
 * - `"hug"` (default): static width from the longest option / placeholder
 *   (selection changes do not resize the field; longer text ellipsizes)
 * - `"full"`: fill the parent
 * - CSS length: e.g. `"12rem"`, `"240px"`, `"50%"`, `"min(100%, 20rem)"`
 * - number: treated as pixels
 */
type DropdownFieldWidth = "hug" | "full" | number | (string & {});
interface DropdownOption {
    value: string;
    label: ReactNode;
    iconName?: FaIconName | (string & {});
    /** Destructive styling (Figma itemType=iconError). Action role only. */
    destructive?: boolean;
    disabled?: boolean;
}
interface DropdownBaseProps {
    size?: DropdownSize;
    menuType?: DropdownMenuType;
    menuPlacement?: DropdownMenuPlacement;
    options: DropdownOption[];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    "aria-label"?: string;
}
interface DropdownInputProps extends DropdownBaseProps {
    role: "input";
    label?: ReactNode;
    helperText?: ReactNode;
    helperIconName?: FaIconName | (string & {});
    showHelper?: boolean;
    sentiment?: FieldSentiment;
    error?: boolean;
    readOnly?: boolean;
    color?: DropdownColor;
    labelStyle?: DropdownLabelStyle;
    startIconName?: FaIconName | (string & {});
    placeholder?: string;
    /**
     * Field width for the input role.
     * @default "hug"
     */
    width?: DropdownFieldWidth;
    /** Single select (icon) or multi (checklist). */
    value?: string | string[];
    defaultValue?: string | string[];
    onChange?: (value: string | string[]) => void;
}
interface DropdownActionProps extends DropdownBaseProps {
    role: "action";
    /** Button label. */
    label?: ReactNode;
    startIconName?: FaIconName | (string & {});
    buttonVariant?: ButtonVariant;
    buttonColor?: ButtonColor;
    onAction?: (value: string) => void;
    /** Action menus are icon lists only in Figma. */
    menuType?: "icon";
}
type DropdownProps = DropdownInputProps | DropdownActionProps;
/**
 * CADS Dropdown — form select (input) or action menu.
 * Spec: `15857:100676` / key `d3660d988bcb4702c24ce921128e32cadb6618db`.
 * Internal: Dropdown Button `964:10677`, Menu List `971:4280`, Menu Item `896:3791`.
 */
declare const Dropdown: react.ForwardRefExoticComponent<DropdownProps & react.RefAttributes<HTMLDivElement>>;

interface CheckboxProps extends Omit<CheckboxProps$1, "size"> {
    /** Optional label rendered via FormControlLabel. */
    label?: ReactNode;
    size?: "medium" | "small";
}
/**
 * CADS Checkbox — uses selected-fill recipe for checked state.
 * Spec source: CADS Figma Checkbox component set.
 */
declare const Checkbox: react.ForwardRefExoticComponent<Omit<CheckboxProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

interface RadioProps extends Omit<RadioProps$1, "size"> {
    label?: ReactNode;
    size?: "medium" | "small";
}
/**
 * CADS Radio — uses selected-fill recipe when checked.
 * Spec source: CADS Figma Radio component set.
 */
declare const Radio: react.ForwardRefExoticComponent<Omit<RadioProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

type TagTone = "neutral" | "brand" | "success" | "warning" | "error" | "info";
type TagSize = "medium" | "small";
interface TagProps extends Omit<ChipProps, "color" | "size" | "icon"> {
    /**
     * Semantic tone.
     * @default "neutral"
     */
    tone?: TagTone;
    /**
     * @default "medium"
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

export { Button, type ButtonColor, type ButtonProps, type ButtonSize, type ButtonVariant, CadsProvider, type CadsProviderProps, Checkbox, type CheckboxProps, type ControlSize, Dropdown, type DropdownActionProps, type DropdownColor, type DropdownFieldWidth, type DropdownInputProps, type DropdownLabelStyle, type DropdownMenuPlacement, type DropdownMenuType, type DropdownOption, type DropdownProps, type DropdownRole, type DropdownSize, type FieldContextValue, type FieldSentiment, FieldWrapper, type FieldWrapperProps, type FieldWrapperSize, IconToggle, type IconToggleColor, type IconToggleProps, type IconToggleSecondProps, type IconToggleSize, Radio, type RadioProps, SegmentedButton, type SegmentedButtonOption, type SegmentedButtonProps, type SegmentedButtonSize, Tag, type TagProps, type TagSize, type TagTone, TextField, type TextFieldProps, type TextFieldSize, TextInput, type TextInputColor, type TextInputProps, type TextInputSize, Tooltip, type TooltipProps, useFieldContext };
