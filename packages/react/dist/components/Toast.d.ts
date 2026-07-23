import * as react from 'react';
import { ReactNode } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { MessagingSentiment } from '../shared/messagingSentiment.js';

/** Figma Toast `sentiment` (uses `primary` for brand chrome). */
type ToastSentiment = Exclude<MessagingSentiment, "brand" | "orange">;
interface ToastProps {
    /**
     * Figma `sentiment`.
     * @default "primary"
     */
    sentiment?: ToastSentiment;
    /** Toast body copy (Figma `toastText`). */
    children?: ReactNode;
    /**
     * Leading status/custom icon (Figma `hasIcon` + icon name).
     * - `undefined` — show the sentiment default (or face-smile)
     * - `false` — hide the icon (MUI Alert `icon={false}` convention)
     * - string — custom FA icon name
     */
    iconName?: FaIconName | false | (string & {});
    /**
     * Show trailing outlined secondary action button (variant/color/size locked).
     * @default false
     */
    hasAction?: boolean;
    /**
     * Action button label. Always required when `hasAction` — empty falls back to "Button".
     * @default "Button"
     */
    actionLabel?: ReactNode;
    /** Optional start icon on the locked secondary outlined action Button. */
    actionStartIconName?: FaIconName | (string & {});
    /** Optional end icon on the locked secondary outlined action Button. */
    actionEndIconName?: FaIconName | (string & {});
    onAction?: () => void;
    /**
     * @default true
     */
    isDismissible?: boolean;
    onClose?: () => void;
    className?: string;
    role?: string;
}
/**
 * CADS Toast — temporary elevated feedback notification.
 * Spec: Figma Toast `10587:14942` / key `29c36f3d7ec051b81e7dc42a724d9097a680f2ee`.
 */
declare const Toast: react.ForwardRefExoticComponent<ToastProps & react.RefAttributes<HTMLDivElement>>;

export { Toast, type ToastProps, type ToastSentiment };
