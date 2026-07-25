import { ReactNode } from 'react';
import { FaIconName } from '../../icons/faProRegularCodepoints';
import { MessagingSentiment } from '../../shared/messagingSentiment';
export type NotificationBannerSentiment = Exclude<MessagingSentiment, "primary" | "orange">;
export type NotificationBannerFillStyle = "none" | "color";
export interface NotificationBannerProps {
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
//# sourceMappingURL=types.d.ts.map