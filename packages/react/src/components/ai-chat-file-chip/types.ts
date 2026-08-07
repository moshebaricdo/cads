import type { HTMLAttributes, ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";

export type AiChatFileChipType = "file" | "image" | "codeSnippet";
export type AiChatFileChipUseCase = "chatStream" | "inputField";

export interface AiChatFileChipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /**
   * @default "file"
   */
  type?: AiChatFileChipType;
  /**
   * `inputField` composes Chat File Remove Button.
   * @default "chatStream"
   */
  useCase?: AiChatFileChipUseCase;
  /**
   * @default "filename.ext"
   */
  fileName?: ReactNode;
  /**
   * Shown for `type="codeSnippet"`.
   * @default "12:56PM"
   */
  metadata?: ReactNode;
  /** Thumbnail URL when `type="image"`. */
  imageSrc?: string;
  /**
   * @default "Attachment"
   */
  imageAlt?: string;
  /**
   * FA icon in the brand tile. Defaults to `file-code`.
   */
  iconName?: FaIconName | (string & {});
  /** Remove handler when `useCase="inputField"`. */
  onRemove?: () => void;
}
