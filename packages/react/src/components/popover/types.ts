import type { ReactElement, ReactNode } from "react";

/** Figma Popover `caretPlacement`. */
export type PopoverCaretPlacement =
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight"
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "leftTop"
  | "leftCenter"
  | "leftBottom"
  | "rightTop"
  | "rightCenter"
  | "rightBottom";

/** Figma Popover Core `content`. */
export type PopoverContent = "textOnly" | "textImage" | "custom";

export interface PopoverProps {
  /**
   * Content layout (Figma Popover Core `content`).
   * @default "textOnly"
   */
  content?: PopoverContent;
  /**
   * Caret side/alignment (Figma `caretPlacement`).
   * @default "bottomLeft"
   */
  caretPlacement?: PopoverCaretPlacement;
  /**
   * @default true
   */
  hasCaret?: boolean;
  /** Figma `titleText`. */
  title?: ReactNode;
  /** Figma `bodyText`. */
  body?: ReactNode;
  /** Image slot when `content="textImage"`. */
  image?: ReactNode;
  /**
   * Custom body when `content="custom"` (also accepts `children` as custom).
   * Unpadded blank canvas — own padding and density in the slot.
   */
  customContent?: ReactNode;
  /**
   * @default true
   */
  hasActionRow?: boolean;
  /**
   * @default true
   */
  hasStepper?: boolean;
  /** Figma `stepperText`. @default "1/3" */
  stepperText?: ReactNode;
  /**
   * @default true
   */
  hasPrimaryAction?: boolean;
  /**
   * @default true
   */
  hasSecondaryAction?: boolean;
  /** @default "Next" */
  primaryActionLabel?: ReactNode;
  /** @default "Back" */
  secondaryActionLabel?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /**
   * @default true
   */
  isDismissible?: boolean;
  onClose?: () => void;
  /** Controlled open (anchored mode). */
  open?: boolean;
  /** Uncontrolled default open. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional trigger element (enables anchored Popper mode). */
  children?: ReactElement | ReactNode;
  className?: string;
  /**
   * When true, render only the surface (no Popper). Used by fixtures/docs.
   * @default false when a trigger child is provided; true otherwise.
   */
  surfaceOnly?: boolean;
}
