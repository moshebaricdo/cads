import { FaIconName } from '../icons/faProRegularCodepoints';
/** Shared sentiment chrome for Alert / Toast / Notification Banner / Tag. */
export type MessagingSentiment = "brand" | "primary" | "pink" | "orange" | "success" | "error" | "warning" | "info" | "neutral";
export type MessagingChrome = {
    background: string;
    border: string;
    /** Stronger border used by Notification Banner fillStyle=color. */
    borderPrimary: string;
    icon: string;
    /** Tag / compact label foreground. */
    label: string;
};
/** Toast uses Figma `primary` for brand chrome. */
export declare function messagingChrome(sentiment: MessagingSentiment): MessagingChrome;
/** Default status icons for Alert/Toast when consumer does not override. */
export declare function defaultStatusIcon(sentiment: MessagingSentiment): FaIconName | null;
/** Figma shortcode → FA Pro name. */
export declare function resolveMessagingIconName(name: FaIconName | (string & {}) | undefined, fallback?: FaIconName): FaIconName;
//# sourceMappingURL=messagingSentiment.d.ts.map