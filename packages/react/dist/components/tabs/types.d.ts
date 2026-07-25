import { ReactNode } from 'react';
import { FaIconName } from '../../icons/faProRegularCodepoints';
import { ControlSize } from '../../shared/controlSize';
export type TabsSize = ControlSize;
export type TabsType = "primary" | "secondary";
export interface TabsItem {
    value: string;
    label: ReactNode;
    startIconName?: FaIconName | string;
    endIconName?: FaIconName | string;
    iconOnly?: boolean;
    /** Maps Figma Tab Item `isDismissible`. */
    dismissible?: boolean;
    disabled?: boolean;
    /** Required when `iconOnly` is true. */
    "aria-label"?: string;
}
export interface TabsProps {
    /**
     * Figma `type`: primary = underline, secondary = contained.
     * @default "primary"
     */
    type?: TabsType;
    /**
     * Control size: large / medium / small / extraSmall.
     * @default "medium"
     */
    size?: TabsSize;
    items: TabsItem[];
    /** Currently selected tab value (exclusive). */
    value?: string;
    /** Uncontrolled default. */
    defaultValue?: string;
    onChange?: (value: string) => void;
    /** Fires when a dismissible tab's close control is activated. */
    onItemDismiss?: (value: string) => void;
    "aria-label"?: string;
    className?: string;
}
//# sourceMappingURL=types.d.ts.map