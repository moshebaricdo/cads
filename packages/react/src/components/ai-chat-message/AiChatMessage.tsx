import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Button } from "../button";
import { IconToggle } from "../icon-toggle";
import { Tooltip } from "../tooltip";
import styles from "./aiChatMessage.module.scss";
import type {
  AiChatMessageHelpfulValue,
  AiChatMessageProps,
} from "./types";

export type {
  AiChatMessageAuthor,
  AiChatMessageContext,
  AiChatMessageHelpfulValue,
  AiChatMessageProps,
} from "./types";

const COPY_FEEDBACK_MS = 1200;

/**
 * AI chat message bubble with optional AI action row.
 * Spec: Figma AI Chat Message `17228:10789`.
 */
export const AiChatMessage = forwardRef<HTMLDivElement, AiChatMessageProps>(
  function AiChatMessage(
    {
      context = "TA",
      author = "Human",
      children,
      fileUploads,
      hasActionRow = true,
      hasLeftActions = true,
      hasDownload = true,
      hasRightActions = true,
      hasFlagging = true,
      feedbackLabel = "Was this helpful?",
      onCopy,
      onDownload,
      helpfulValue,
      defaultHelpfulValue = null,
      onHelpfulChange,
      flagged,
      defaultFlagged = false,
      onFlagChange,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const isAi = author === "AI";
    const isTa = context === "TA";
    const bodyRef = useRef<HTMLDivElement>(null);
    const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(
      () => () => {
        if (copyTimer.current) clearTimeout(copyTimer.current);
      },
      [],
    );

    const helpfulControlled = helpfulValue !== undefined;
    const [uncontrolledHelpful, setUncontrolledHelpful] =
      useState<AiChatMessageHelpfulValue>(defaultHelpfulValue);
    const helpful = helpfulControlled ? helpfulValue : uncontrolledHelpful;

    const setHelpful = (next: AiChatMessageHelpfulValue) => {
      if (!helpfulControlled) setUncontrolledHelpful(next);
      onHelpfulChange?.(next);
    };

    const handleCopy = () => {
      const text = bodyRef.current?.innerText?.trim() ?? "";
      if (text) void navigator.clipboard?.writeText(text);
      onCopy?.();
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    };

    const bubbleClass = isAi
      ? styles.bubbleAi
      : isTa
        ? styles.bubbleHumanTa
        : styles.bubbleHumanTutor;

    const rootClass = [
      styles.root,
      isAi ? styles.rootAi : styles.rootHuman,
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        data-cads-component="AiChatMessage"
        data-context={context}
        data-author={author}
        className={rootClass}
        style={style as CSSProperties}
        {...rest}
      >
        {isAi && fileUploads != null ? (
          <div className={styles.fileRow}>{fileUploads}</div>
        ) : null}

        <div className={`${styles.bubble} ${bubbleClass}`}>
          <div className={styles.body} ref={bodyRef}>
            {children}
          </div>
        </div>

        {isAi && hasActionRow ? (
          <div className={styles.actions}>
            {hasLeftActions ? (
              <div className={styles.leftActions}>
                <Tooltip
                  title={copied ? "Copied" : "Copy"}
                  iconName={copied ? "check" : "copy"}
                  hasCaret={false}
                  placement="bottom"
                >
                  <span className={styles.tooltipHost}>
                    <Button
                      variant="text"
                      color="tertiary"
                      size="extraSmall"
                      iconOnly
                      startIconName={copied ? "check" : "copy"}
                      aria-label="Copy"
                      onClick={handleCopy}
                    />
                  </span>
                </Tooltip>
                {hasDownload ? (
                  <Tooltip title="Download" placement="bottom">
                    <span className={styles.tooltipHost}>
                      <Button
                        variant="text"
                        color="tertiary"
                        size="extraSmall"
                        iconOnly
                        startIconName="download"
                        aria-label="Download"
                        onClick={onDownload}
                      />
                    </span>
                  </Tooltip>
                ) : null}
              </div>
            ) : null}
            {hasRightActions ? (
              <div className={styles.rightActions}>
                <IconToggle
                  size="extraSmall"
                  color="brand"
                  label={feedbackLabel}
                  exclusive
                  iconName="thumbs-up"
                  aria-label="Helpful"
                  pressed={helpful === "up"}
                  onPressedChange={(pressed) => {
                    setHelpful(pressed ? "up" : null);
                  }}
                  secondToggle={{
                    iconName: "thumbs-down",
                    color: "secondary",
                    "aria-label": "Not helpful",
                    pressed: helpful === "down",
                    onPressedChange: (pressed) => {
                      setHelpful(pressed ? "down" : null);
                    },
                  }}
                />
                {hasFlagging ? (
                  <Tooltip title="Flag this message?" placement="bottom">
                    <span className={styles.tooltipHost}>
                      <IconToggle
                        size="extraSmall"
                        color="error"
                        iconName="flag-pennant"
                        aria-label="Flag"
                        pressed={flagged}
                        defaultPressed={defaultFlagged}
                        onPressedChange={onFlagChange}
                      />
                    </span>
                  </Tooltip>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);
