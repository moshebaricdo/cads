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
    /**
     * Default body copy (pre-seed text). Used when `children` is omitted.
     * Applies to default and image layouts (text slot).
     */
    body?: ReactNode;
    /** Image slot for vertical/horizontal types. */
    image?: ReactNode;
    /**
     * Custom content for the body text slot (Figma `customContent`).
     * Replaces `body` for every `type` — full body on default; text column
     * on image layouts (image slot stays fixed).
     */
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