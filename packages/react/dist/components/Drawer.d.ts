import * as react from 'react';
import { ReactNode } from 'react';

/** Figma Drawer `type`. */
type DrawerType = "textOnly" | "customContent";
interface DrawerProps {
    /**
     * @default "textOnly"
     */
    type?: DrawerType;
    /** Figma `titleText`. */
    title?: ReactNode;
    /** Figma `descriptionText`. */
    description?: ReactNode;
    /**
     * @default true
     */
    hasDescription?: boolean;
    /**
     * @default true
     */
    hasActionRow?: boolean;
    /** @default "Button" */
    primaryActionLabel?: ReactNode;
    /** @default "Button" */
    secondaryActionLabel?: ReactNode;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    /** Custom slot when `type="customContent"`. */
    children?: ReactNode;
    /**
     * Always dismissible in Figma (close control present).
     * @default true
     */
    isDismissible?: boolean;
    onClose?: () => void;
    /** Controlled open. */
    open?: boolean;
    /**
     * When true, render the panel surface without MUI Drawer portal (fixtures).
     * @default false
     */
    surfaceOnly?: boolean;
    className?: string;
}
/**
 * CADS Drawer — bottom sheet over content without dimming.
 * Spec: Figma Drawer `10708:17779` / key `b2cd3a35f20d344f38d677d0dfd992d64f503b87`.
 */
declare const Drawer: react.ForwardRefExoticComponent<DrawerProps & react.RefAttributes<HTMLDivElement>>;

export { Drawer, type DrawerProps, type DrawerType };
