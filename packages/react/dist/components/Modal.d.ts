import * as react from 'react';
import { ReactNode } from 'react';

/** Figma Modal `type`. */
type ModalType = "default" | "verticalImage" | "horizontalImage";
interface ModalProps {
    /**
     * @default "default"
     */
    type?: ModalType;
    /** Figma `titleText`. */
    title?: ReactNode;
    /** Body copy for image layouts; default type uses `children` / `customContent`. */
    body?: ReactNode;
    /** Image slot for vertical/horizontal types. */
    image?: ReactNode;
    /** Custom body when `type="default"`. */
    children?: ReactNode;
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
     * Figma `isDismissable`.
     * @default true
     */
    isDismissable?: boolean;
    onClose?: () => void;
    open?: boolean;
    /**
     * Render surface without portal (fixtures).
     * @default false
     */
    surfaceOnly?: boolean;
    className?: string;
}
/**
 * CADS Modal — blocking overlay for rich interactive content.
 * Spec: Figma Modal `2190:8284` / key `0fe4d86d9d16ed81da4f995fc1e8fae90f7cf0e5`.
 */
declare const Modal: react.ForwardRefExoticComponent<ModalProps & react.RefAttributes<HTMLDivElement>>;

export { Modal, type ModalProps, type ModalType };
