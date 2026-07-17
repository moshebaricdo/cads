import * as react from 'react';
import { ReactNode, ReactElement } from 'react';

/** Figma Popover `caretPlacement`. */
type PopoverCaretPlacement = "bottomLeft" | "bottomCenter" | "bottomRight" | "topLeft" | "topCenter" | "topRight" | "leftTop" | "leftCenter" | "leftBottom" | "rightTop" | "rightCenter" | "rightBottom";
/** Figma Popover Core `content`. */
type PopoverContent = "textOnly" | "textImage" | "custom";
interface PopoverProps {
    /**
     * Content layout (Figma Popover Core `content`).
     * @default "textOnly"
     */
    content?: PopoverContent;
    /**
     * Caret side/alignment (Figma `caretPlacement`).
     * @default "bottomLeft"
     */
    caretPlacement?: PopoverCaretPlacement;
    /**
     * @default true
     */
    hasCaret?: boolean;
    /** Figma `titleText`. */
    title?: ReactNode;
    /** Figma `bodyText`. */
    body?: ReactNode;
    /** Image slot when `content="textImage"`. */
    image?: ReactNode;
    /** Custom body when `content="custom"` (also accepts `children` as custom). */
    customContent?: ReactNode;
    /**
     * @default true
     */
    hasActionRow?: boolean;
    /**
     * @default true
     */
    hasStepper?: boolean;
    /** Figma `stepperText`. @default "1/3" */
    stepperText?: ReactNode;
    /**
     * @default true
     */
    hasPrimaryAction?: boolean;
    /**
     * @default true
     */
    hasSecondaryAction?: boolean;
    /** @default "Next" */
    primaryActionLabel?: ReactNode;
    /** @default "Back" */
    secondaryActionLabel?: ReactNode;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    /**
     * @default true
     */
    isDismissible?: boolean;
    onClose?: () => void;
    /** Controlled open (anchored mode). */
    open?: boolean;
    /** Uncontrolled default open. */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Optional trigger element (enables anchored Popper mode). */
    children?: ReactElement | ReactNode;
    className?: string;
    /**
     * When true, render only the surface (no Popper). Used by fixtures/docs.
     * @default false when a trigger child is provided; true otherwise.
     */
    surfaceOnly?: boolean;
}
/**
 * CADS Popover — dismissible anchored card with optional caret / stepper.
 * Spec: Figma Popover `16426:681` + Popover Core `16421:393`.
 */
declare const Popover: react.ForwardRefExoticComponent<PopoverProps & react.RefAttributes<HTMLDivElement>>;

export { Popover, type PopoverCaretPlacement, type PopoverContent, type PopoverProps };
