import type { ReactNode } from "react";

/** Figma Modal `type`. */
export type ModalType = "default" | "verticalImage" | "horizontalImage";

export interface ModalProps {
  /**
   * @default "default"
   */
  type?: ModalType;
  /** Figma `titleText`. */
  title?: ReactNode;
  /**
   * Default body copy (pre-seed text). Used when `children` is omitted.
   * Applies to default and image layouts (text slot).
   */
  body?: ReactNode;
  /** Image slot for vertical/horizontal types. */
  image?: ReactNode;
  /**
   * Custom content for the body text slot (Figma `customContent`).
   * Replaces `body` for every `type` — full body on default; text column
   * on image layouts (image slot stays fixed).
   */
  children?: ReactNode;
  /**
   * Left-hand footer slot (Figma `actionGroup` SLOT) — e.g. a tertiary
   * text Button, a "Don't show again" Checkbox, or a step indicator.
   * Hugs its content and is vertically centered; the built-in secondary /
   * primary buttons stay right-aligned whether or not it is set.
   */
  footerStartContent?: ReactNode;
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
   * Figma `isDismissable`.
   * @default true
   */
  isDismissable?: boolean;
  onClose?: () => void;
  /**
   * Max surface width. Number is treated as px; strings accept any CSS length.
   * Surface still fills available width up to this cap.
   * @default 800
   */
  maxWidth?: number | string;
  open?: boolean;
  /**
   * Render surface without portal (fixtures).
   * @default false
   */
  surfaceOnly?: boolean;
  className?: string;
}
