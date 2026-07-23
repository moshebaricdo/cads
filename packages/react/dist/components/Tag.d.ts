import * as react from 'react';
import { ReactNode } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { MessagingSentiment } from '../shared/messagingSentiment.js';

/** Figma Tag `color` axis. */
type TagColor = Exclude<MessagingSentiment, "primary">;
type TagSize = "large" | "medium" | "small";
interface TagProps {
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
     * Leading FA icon. Omit for no start icon (Figma’s boolean `startIcon` is
     * collapsed into presence of this prop).
     */
    startIconName?: FaIconName | (string & {});
    /**
     * Trailing FA icon. Omit for no end icon (Figma’s boolean `endIcon` is
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
/**
 * CADS Tag — compact status / category label (not selectable Chip).
 * Spec: Figma Tag `16433:2625` / key `e4a964357b1eaedfab777db89058ccb4d528ec1c`.
 */
declare const Tag: react.ForwardRefExoticComponent<TagProps & react.RefAttributes<HTMLDivElement>>;
/** @deprecated Use `TagColor`. Kept for transitional imports from the stub API. */
type TagTone = TagColor;

export { Tag, type TagColor, type TagProps, type TagSize, type TagTone };
