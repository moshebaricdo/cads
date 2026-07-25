import { ReactNode } from 'react';
/** Figma Modal `type`. */
export type ModalType = "default" | "verticalImage" | "horizontalImage";
export interface ModalProps {
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
//# sourceMappingURL=types.d.ts.map