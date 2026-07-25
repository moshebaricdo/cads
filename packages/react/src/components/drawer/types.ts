import type { ReactNode } from "react";

/** Figma Drawer `type`. */
export type DrawerType = "textOnly" | "customContent";

export interface DrawerProps {
  /**
   * @default "textOnly"
   */
  type?: DrawerType;
  /** Figma `titleText`. */
  title?: ReactNode;
  /** Figma `descriptionText`. */
  description?: ReactNode;
  /**
   * @default true
   */
  hasDescription?: boolean;
  /**
   * @default true
   */
  hasActionRow?: boolean;
  /** @default "Button" */
  primaryActionLabel?: ReactNode;
  /** @default "Button" */
  secondaryActionLabel?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /** Custom slot when `type="customContent"`. */
  children?: ReactNode;
  /**
   * Always dismissible in Figma (close control present).
   * @default true
   */
  isDismissible?: boolean;
  onClose?: () => void;
  /** Controlled open. */
  open?: boolean;
  /**
   * When true, render the panel surface without MUI Drawer portal (fixtures).
   * @default false
   */
  surfaceOnly?: boolean;
  className?: string;
}
