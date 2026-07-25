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
   * @default true
   */
  isDismissable?: boolean;
  onClose?: () => void;
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
