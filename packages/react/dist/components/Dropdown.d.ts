import * as react from 'react';
import { ReactNode, CSSProperties } from 'react';
import { ButtonVariant, ButtonColor } from './Button.js';
import { FieldSentiment } from './FieldWrapper.js';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';
import '@mui/material/Button';

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

export { Dropdown, type DropdownActionProps, type DropdownColor, type DropdownFieldWidth, type DropdownInputProps, type DropdownLabelStyle, type DropdownMenuPlacement, type DropdownMenuType, type DropdownOption, type DropdownProps, type DropdownRole, type DropdownSize };
