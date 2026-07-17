import * as react from 'react';
import { ReactNode } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

type TabsSize = ControlSize;
type TabsType = "primary" | "secondary";
interface TabsItem {
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
interface TabsProps {
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
    /** Fires when a dismissible tab’s close control is activated. */
    onItemDismiss?: (value: string) => void;
    "aria-label"?: string;
    className?: string;
}
/**
 * CADS Tabs — Figma Tab Group. Tab Item is an internal building block only.
 *
 * Spec: page `296:1662`, Group set `16496:3371`
 * (key `b49fe2d463645f88551c83bd8bff0ab56fcde35e`),
 * Item set `6240:7203` (key `6bdc7c7da3d1d1193ec90ba2bf1d52c03cf01e39`).
 */
declare const Tabs: react.ForwardRefExoticComponent<TabsProps & react.RefAttributes<HTMLDivElement>>;

export { Tabs, type TabsItem, type TabsProps, type TabsSize, type TabsType };
