import { ChangeEvent, FormEvent, HTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
export interface AiChatInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit" | "color"> {
    /** Controlled composer value. Non-empty maps Figma `isFilled=yes`. */
    value?: string;
    /** Uncontrolled default value. */
    defaultValue?: string;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    /**
     * @default "Type something"
     */
    placeholder?: string;
    /**
     * Figma `leftActions` slot. When omitted, renders default Add file Button.
     */
    leftActions?: ReactNode;
    /**
     * @default "Add file"
     */
    addFileLabel?: ReactNode;
    onAddFile?: () => void;
    /** Fired when send is activated (button or Enter without Shift). */
    onSubmit?: (event: FormEvent) => void;
    disabled?: boolean;
    /** Optional attachment chips above the text field. */
    attachments?: ReactNode;
    /** Extra props for the underlying textarea. */
    textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "defaultValue" | "onChange" | "placeholder" | "disabled">;
}
//# sourceMappingURL=types.d.ts.map