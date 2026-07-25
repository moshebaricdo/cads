import { ReactNode } from 'react';
import { FaIconName } from '../../icons/faProRegularCodepoints';
import { MessagingSentiment } from '../../shared/messagingSentiment';
/** Figma Tag `color` axis. */
export type TagColor = Exclude<MessagingSentiment, "primary">;
export type TagSize = "large" | "medium" | "small";
export interface TagProps {
    /**
     * Figma `color`.
     * @default "neutral"
     */
    color?: TagColor;
    /**
     * @default "large"
     */
    size?: TagSize;
    /** Figma `labelText`. */
    label?: ReactNode;
    /**
     * Leading FA icon. Omit for no start icon (Figma's boolean `startIcon` is
     * collapsed into presence of this prop).
     */
    startIconName?: FaIconName | (string & {});
    /**
     * Trailing FA icon. Omit for no end icon (Figma's boolean `endIcon` is
     * collapsed into presence of this prop).
     */
    endIconName?: FaIconName | (string & {});
    /**
     * Figma `isDismissible`.
     * @default false
     */
    isDismissible?: boolean;
    onClose?: () => void;
    className?: string;
}
/** @deprecated Use `TagColor`. Kept for transitional imports from the stub API. */
export type TagTone = TagColor;
//# sourceMappingURL=types.d.ts.map