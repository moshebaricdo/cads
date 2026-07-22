import * as react from 'react';
import { ReactNode, CSSProperties } from 'react';
import { ButtonVariant, ButtonColor } from './Button.js';
import { FieldSentiment } from './FieldWrapper.js';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';
import '@mui/material/Button';

type DropdownSize = ControlSize;
type DropdownRole = "input" | "action";
type DropdownMenuType = "default" | "checklist";
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
/** Selectable menu row (Figma Dropdown Menu Item `896:3791`). */
interface DropdownItemOption {
    type?: "item";
    value: string;
    label: ReactNode;
    /**
     * Show leading icon (Figma `hasStartIcon`).
     * Defaults to `true` when `iconName` is set, otherwise `false` (text-only).
     */
    startIcon?: boolean;
    /** FA icon when `startIcon` (Figma `iconName`). */
    iconName?: FaIconName | (string & {});
    /** Destructive styling (Figma itemType=defaultError). Action role only. */
    destructive?: boolean;
    disabled?: boolean;
}
/** Hairline row (Figma menuSeparator `16847:69841`). */
interface DropdownSeparatorOption {
    type: "separator";
}
/** Non-interactive section label (Figma menuOptGroup `16847:69853`). */
interface DropdownGroupOption {
    type: "group";
    label: ReactNode;
}
type DropdownOption = DropdownItemOption | DropdownSeparatorOption | DropdownGroupOption;
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
    /**
     * Required field marker on the Field Wrapper label (`*`).
     * @default false
     */
    required?: boolean;
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
    /** Action menus are non-checklist (`menuType=default`) in Figma. */
    menuType?: "default";
}
type DropdownProps = DropdownInputProps | DropdownActionProps;
/**
 * CADS Dropdown — form select (input) or action menu.
 * Spec: `15857:100676` / key `d3660d988bcb4702c24ce921128e32cadb6618db`.
 * Internal: Dropdown Button `964:10677`, Menu List `971:4280`, Menu Item `896:3791`,
 * menuSeparator `16847:69841`, menuOptGroup `16847:69853`.
 */
declare const Dropdown: react.ForwardRefExoticComponent<DropdownProps & react.RefAttributes<HTMLDivElement>>;

export { Dropdown, type DropdownActionProps, type DropdownColor, type DropdownFieldWidth, type DropdownGroupOption, type DropdownInputProps, type DropdownItemOption, type DropdownLabelStyle, type DropdownMenuPlacement, type DropdownMenuType, type DropdownOption, type DropdownProps, type DropdownRole, type DropdownSeparatorOption, type DropdownSize };
