import type { ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";

/** Figma Dialog `type`. */
export type DialogType = "default" | "iconTop" | "customContent";

export interface DialogProps {
  /**
   * @default "default"
   */
  type?: DialogType;
  /** Figma `titleText`. */
  title?: ReactNode;
  /** Figma `descriptionText`. */
  description?: ReactNode;
  /**
   * Optional illustration above title when `type="default"`.
   * @default false
   */
  hasImage?: boolean;
  image?: ReactNode;
  /** FA name for the floating brand badge when `type="iconTop"`. */
  topIconName?: FaIconName | (string & {});
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
   * When false, backdrop click, Escape, and the close control do not dismiss.
   * @default false
   */
  isDismissable?: boolean;
  onClose?: () => void;
  /**
   * Max surface width. Number is treated as px; strings accept any CSS length.
   * Surface still fills available width up to this cap.
   * @default 800
   */
  maxWidth?: number | string;
  /** Custom slot when `type="customContent"`. */
  children?: ReactNode;
  open?: boolean;
  /**
   * Render surface without MUI Dialog portal (fixtures).
   * @default false
   */
  surfaceOnly?: boolean;
  className?: string;
}
