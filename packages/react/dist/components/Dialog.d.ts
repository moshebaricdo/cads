import * as react from 'react';
import { ReactNode } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';

/** Figma Dialog `type`. */
type DialogType = "default" | "iconTop" | "customContent";
interface DialogProps {
    /**
     * @default "default"
     */
    type?: DialogType;
    /** Figma `titleText`. */
    title?: ReactNode;
    /** Figma `descriptionText`. */
    description?: ReactNode;
    /**
     * Optional illustration above title when `type="default"`.
     * @default false
     */
    hasImage?: boolean;
    image?: ReactNode;
    /** FA name for the floating brand badge when `type="iconTop"`. */
    topIconName?: FaIconName | (string & {});
    /**
     * @default true
     */
    hasSecondaryAction?: boolean;
    /** @default "Button" */
    primaryActionLabel?: ReactNode;
    /** @default "Button" */
    secondaryActionLabel?: ReactNode;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    /**
     * @default true
     */
    isDismissable?: boolean;
    onClose?: () => void;
    /** Custom slot when `type="customContent"`. */
    children?: ReactNode;
    open?: boolean;
    /**
     * Render surface without MUI Dialog portal (fixtures).
     * @default false
     */
    surfaceOnly?: boolean;
    className?: string;
}
/**
 * CADS Dialog — blocking confirmation overlay.
 * Spec: Figma Dialog `3453:3938` / key `75feff93418c9804cbd3075e8a7f85bce1a5ff1e`.
 */
declare const Dialog: react.ForwardRefExoticComponent<DialogProps & react.RefAttributes<HTMLDivElement>>;

export { Dialog, type DialogProps, type DialogType };
