import type { HTMLAttributes, ReactNode } from "react";

export type AiChatMessageContext = "TA" | "Tutor";
export type AiChatMessageAuthor = "Human" | "AI";
export type AiChatMessageHelpfulValue = "up" | "down" | null;

export interface AiChatMessageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /**
   * Teacher Assistant vs student Tutor product context.
   * @default "TA"
   */
  context?: AiChatMessageContext;
  /**
   * @default "Human"
   */
  author?: AiChatMessageAuthor;
  /**
   * Message body. Accepts inline rich content (text, CADS `Link`, `code`,
   * emphasis, multiple paragraphs) — not only a string.
   */
  children?: ReactNode;
  /**
   * Optional in-bubble slot below the body (AI messages). Presence replaces
   * Figma `hasCustomContent`. Use for extra in-chat content; shared cards
   * (file-change lists, snippets) will compose here later.
   */
  customContent?: ReactNode;
  /**
   * Optional file chip row (AI messages). Presence replaces Figma `showFileUploads`.
   */
  fileUploads?: ReactNode;
  /**
   * @default true
   */
  hasActionRow?: boolean;
  /**
   * @default true
   */
  hasLeftActions?: boolean;
  /**
   * Show the download control in the left action group.
   * @default true
   */
  hasDownload?: boolean;
  /**
   * @default true
   */
  hasRightActions?: boolean;
  /**
   * @default true
   */
  hasFlagging?: boolean;
  /**
   * @default "Was this helpful?"
   */
  feedbackLabel?: ReactNode;
  onCopy?: () => void;
  onDownload?: () => void;
  helpfulValue?: AiChatMessageHelpfulValue;
  defaultHelpfulValue?: AiChatMessageHelpfulValue;
  onHelpfulChange?: (value: AiChatMessageHelpfulValue) => void;
  flagged?: boolean;
  defaultFlagged?: boolean;
  onFlagChange?: (flagged: boolean) => void;
}
