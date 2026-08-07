import { forwardRef } from "react";
import { FaIcon } from "../../icons/FaIcon";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import { ChatFileRemoveButton } from "../chat-file-remove-button";
import styles from "./aiChatFileChip.module.scss";
import type { AiChatFileChipProps } from "./types";

export type {
  AiChatFileChipProps,
  AiChatFileChipType,
  AiChatFileChipUseCase,
} from "./types";

/**
 * Attachment chip for AI chat streams and the composer.
 * Spec: Figma AI Chat File Chip `17228:10810`.
 */
export const AiChatFileChip = forwardRef<HTMLDivElement, AiChatFileChipProps>(
  function AiChatFileChip(
    {
      type = "file",
      useCase = "chatStream",
      fileName = "filename.ext",
      metadata = "12:56PM",
      imageSrc,
      imageAlt = "Attachment",
      iconName = "file-code",
      onRemove,
      className,
      ...rest
    },
    ref,
  ) {
    const showRemove = useCase === "inputField";
    const isImage = type === "image";
    const isCode = type === "codeSnippet";

    const rootClass = [
      styles.root,
      isCode ? styles.rootCode : "",
      isImage ? styles.rootImage : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        data-cads-component="AiChatFileChip"
        data-type={type}
        data-use-case={useCase}
        className={rootClass}
        {...rest}
      >
        {isImage ? (
          imageSrc ? (
            <img className={styles.thumb} src={imageSrc} alt={imageAlt} />
          ) : (
            <span className={styles.iconTile} aria-hidden>
              <FaIcon
                name="image"
                family="solid"
                fontSize="0.875rem"
                aria-hidden
              />
            </span>
          )
        ) : (
          <>
            <span className={styles.iconTile} aria-hidden>
              <FaIcon
                name={iconName as FaIconName}
                family="solid"
                fontSize="0.875rem"
                aria-hidden
              />
            </span>
            <span className={styles.content}>
              <span className={styles.fileName}>{fileName}</span>
              {isCode ? (
                <span className={styles.metadata}>{metadata}</span>
              ) : null}
            </span>
          </>
        )}
        {showRemove ? (
          <span className={styles.remove}>
            <ChatFileRemoveButton
              onClick={onRemove}
              aria-label="Remove attachment"
            />
          </span>
        ) : null}
      </div>
    );
  },
);
