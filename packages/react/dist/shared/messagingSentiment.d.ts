import { FaIconName } from '../icons/faProRegularCodepoints.js';

/** Shared sentiment chrome for Alert / Toast / Notification Banner / Tag. */
type MessagingSentiment = "brand" | "primary" | "pink" | "orange" | "success" | "error" | "warning" | "info" | "neutral";
type MessagingChrome = {
    background: string;
    border: string;
    /** Stronger border used by Notification Banner fillStyle=color. */
    borderPrimary: string;
    icon: string;
    /** Tag / compact label foreground. */
    label: string;
};
/** Toast uses Figma `primary` for brand chrome. */
declare function messagingChrome(sentiment: MessagingSentiment): MessagingChrome;
/** Default status icons for Alert/Toast when consumer does not override. */
declare function defaultStatusIcon(sentiment: MessagingSentiment): FaIconName | null;
/** Figma shortcode → FA Pro name. */
declare function resolveMessagingIconName(name: FaIconName | (string & {}) | undefined, fallback?: FaIconName): FaIconName;

export { type MessagingChrome, type MessagingSentiment, defaultStatusIcon, messagingChrome, resolveMessagingIconName };
