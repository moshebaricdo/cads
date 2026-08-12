import { CSSProperties, ReactNode } from 'react';
import { FaIconName } from '../../icons/faProRegularCodepoints';
import { ButtonColor, ButtonVariant } from '../button/types';
import { FieldSentiment } from '../field-wrapper';
import { ControlSize } from '../../shared/controlSize';
export type DropdownSize = ControlSize;
export type DropdownRole = "input" | "action";
export type DropdownMenuType = "default" | "checklist";
export type DropdownMenuPlacement = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
export type DropdownLabelStyle = "thick" | "thin";
export type DropdownColor = "primary" | "secondary";
/**
 * Input-role field width.
 * - `"hug"` (default): static width from the longest option (and an explicit
 *   `placeholder` when set). Selection changes do not resize the field;
 *   longer text ellipsizes.
 * - `"full"`: fill the parent
 * - CSS length: e.g. `"12rem"`, `"240px"`, `"50%"`, `"min(100%, 20rem)"`
 * - number: treated as pixels
 */
export type DropdownFieldWidth = "hug" | "full" | number | (string & {});
/**
 * Menu panel horizontal sizing (both roles).
 * - `"hug"` (default): fit content; never narrower than the trigger
 * - `"trigger"`: lock to the trigger width (long labels ellipsize)
 * - number: minimum width in px; still grows with longer content
 * - percentage string: exact width relative to the trigger (e.g. `"70%"`)
 */
export type DropdownMenuWidth = "hug" | "trigger" | number | `${number}%`;
/** Selectable menu row (Figma Dropdown Menu Item `896:3791`). */
export interface DropdownItemOption {
    type?: "item";
    value: string;
    label: ReactNode;
    /**
     * Leading FA icon (Figma `iconName`). Omit for text-only items (Figma's
     * boolean `hasStartIcon` / `startIcon` is collapsed into presence of this
     * prop).
     */
    iconName?: FaIconName | (string & {});
    /** Destructive styling (Figma itemType=defaultError). Action role only. */
    destructive?: boolean;
    disabled?: boolean;
}
/** Hairline row (Figma menuSeparator `16847:69841`). */
export interface DropdownSeparatorOption {
    type: "separator";
}
/** Non-interactive section label (Figma menuOptGroup `16847:69853`). */
export interface DropdownGroupOption {
    type: "group";
    label: ReactNode;
}
export type DropdownOption = DropdownItemOption | DropdownSeparatorOption | DropdownGroupOption;
interface DropdownBaseProps {
    size?: DropdownSize;
    menuType?: DropdownMenuType;
    menuPlacement?: DropdownMenuPlacement;
    /**
     * Menu panel width behavior.
     * @default "hug"
     */
    menuWidth?: DropdownMenuWidth;
    options: DropdownOption[];
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    /**
     * Keep the menu in-tree (no body portal). Fixtures / capture regions only.
     * @default false
     */
    disablePortal?: boolean;
    className?: string;
    style?: CSSProperties;
    "aria-label"?: string;
}
export interface DropdownInputProps extends DropdownBaseProps {
    role: "input";
    label?: ReactNode;
    /**
     * Required field marker on the Field Wrapper label (`*`).
     * @default false
     */
    required?: boolean;
    helperText?: ReactNode;
    /**
     * Optional Field Wrapper helper icon for default sentiment. Omit for no
     * icon; non-default sentiments use fixed icons.
     */
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
export interface DropdownActionProps extends DropdownBaseProps {
    role: "action";
    /** Button label. Ignored when `iconOnly` is true. */
    label?: ReactNode;
    startIconName?: FaIconName | (string & {});
    /**
     * Square icon-only trigger (e.g. kebab overflow). Hides label + chevron.
     * Provide `aria-label` and `startIconName` when true.
     */
    iconOnly?: boolean;
    buttonVariant?: ButtonVariant;
    buttonColor?: ButtonColor;
    onAction?: (value: string) => void;
    /** Action menus are non-checklist (`menuType=default`) in Figma. */
    menuType?: "default";
}
export type DropdownProps = DropdownInputProps | DropdownActionProps;
export {};
//# sourceMappingURL=types.d.ts.map