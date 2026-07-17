import * as react from 'react';
import { ReactNode } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { MessagingSentiment } from '../shared/messagingSentiment.js';

type NotificationBannerSentiment = Exclude<MessagingSentiment, "primary" | "orange">;
type NotificationBannerFillStyle = "none" | "color";
interface NotificationBannerProps {
    /**
     * Figma `sentiment`.
     * @default "brand"
     */
    sentiment?: NotificationBannerSentiment;
    /**
     * Figma `fillStyle` — white surface vs tinted.
     * @default "none"
     */
    fillStyle?: NotificationBannerFillStyle;
    /** Figma `titleText` — required. */
    title: ReactNode;
    /** Figma `descriptionText` — required. */
    description: ReactNode;
    /**
     * Figma `iconName`.
     * @default "face-smile"
     */
    iconName?: FaIconName | (string & {});
    /**
     * @default true
     */
    hasPrimaryAction?: boolean;
    /**
     * @default true
     */
    hasSecondaryAction?: boolean;
    primaryActionLabel?: ReactNode;
    secondaryActionLabel?: ReactNode;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    /**
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
 * CADS Notification Banner — persistent page-level messaging.
 * Spec: Figma Notification Banner `10618:632` /
 * key `5f158e59f1188b62d671448be304f22d3a7bde42`.
 */
declare const NotificationBanner: react.ForwardRefExoticComponent<NotificationBannerProps & react.RefAttributes<HTMLDivElement>>;

export { NotificationBanner, type NotificationBannerFillStyle, type NotificationBannerProps, type NotificationBannerSentiment };
