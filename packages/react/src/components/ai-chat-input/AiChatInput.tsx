import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "../button";
import styles from "./aiChatInput.module.scss";
import type { AiChatInputProps } from "./types";

export type { AiChatInputProps } from "./types";

/**
 * Purpose-built AI chat composer (textarea + attach + send).
 * Spec: Figma AI Chat Input `17228:10734`.
 */
export const AiChatInput = forwardRef<HTMLDivElement, AiChatInputProps>(
  function AiChatInput(
    {
      value,
      defaultValue = "",
      onChange,
      placeholder = "Type something",
      leftActions,
      addFileLabel = "Add file",
      onAddFile,
      onSubmit,
      disabled = false,
      attachments,
      textareaProps,
      className,
      ...rest
    },
    ref,
  ) {
    const fieldId = useId();
    const controlled = value !== undefined;
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const current = controlled ? value : uncontrolled;
    const filled = current.trim().length > 0;
    const canSend = filled && !disabled;

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!controlled) setUncontrolled(event.target.value);
      onChange?.(event);
    };

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      if (!canSend) return;
      onSubmit?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      textareaProps?.onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (canSend) {
          onSubmit?.(event as unknown as FormEvent);
        }
      }
    };

    const rootClass = [styles.root, className ?? ""].filter(Boolean).join(" ");
    const sendClass = [
      styles.send,
      !filled || disabled ? styles.sendDisabled : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        data-cads-component="AiChatInput"
        data-filled={filled ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        className={rootClass}
        {...rest}
      >
        {attachments != null ? (
          <div className={styles.attachments}>{attachments}</div>
        ) : null}

        <textarea
          id={fieldId}
          className={styles.field}
          rows={1}
          placeholder={placeholder}
          disabled={disabled}
          value={current}
          {...textareaProps}
          aria-label={textareaProps?.["aria-label"] ?? "Message"}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <div className={styles.actions}>
          <div className={styles.leftActions}>
            {leftActions ?? (
              <Button
                variant="outlined"
                color="secondary"
                size="extraSmall"
                startIconName="plus"
                disabled={disabled}
                onClick={onAddFile}
              >
                {addFileLabel}
              </Button>
            )}
          </div>
          <div className={styles.rightActions}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              size="extraSmall"
              iconOnly
              startIconName="arrow-up"
              aria-label="Send"
              disabled={!canSend}
              className={sendClass}
              onClick={(event) => {
                handleSubmit(event as unknown as FormEvent);
              }}
            />
          </div>
        </div>
      </div>
    );
  },
);
