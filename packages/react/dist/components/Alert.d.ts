import * as react from 'react';
import { ReactNode } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';
import { MessagingSentiment } from '../shared/messagingSentiment.js';

type AlertSize = ControlSize;
type AlertSentiment = Exclude<MessagingSentiment, "primary" | "orange">;
interface AlertProps {
    /**
     * @default "large"
     */
    size?: AlertSize;
    /**
     * Figma `sentiment`.
     * @default "brand"
     */
    sentiment?: AlertSentiment;
    /** Alert body copy (Figma `alertText`). */
    children?: ReactNode;
    /**
     * Leading status/custom icon (Figma `hasIcon` + `alertIcon`).
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
     * Show dismiss control (Figma `isDismissible`).
     * @default false
     */
    isDismissible?: boolean;
    onClose?: () => void;
    /**
     * Stretch to the parent width (default). Set false for hug content.
     * @default true
     */
    fullWidth?: boolean;
    className?: string;
    role?: string;
}
/**
 * CADS Alert — inline contextual status banner.
 * Spec: Figma Alert `2133:4160` / key `dbe516b76486882d3508633715c5e4e999c183db`.
 */
declare const Alert: react.ForwardRefExoticComponent<AlertProps & react.RefAttributes<HTMLDivElement>>;

export { Alert, type AlertProps, type AlertSentiment, type AlertSize };
