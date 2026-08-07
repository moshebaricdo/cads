import type { NestedPlaygroundTarget, PropSheet } from "./types";

export const AI_PROP_SHEETS: Record<string, PropSheet[]> = {
  ChatFileRemoveButton: [
    {
      title: "Props — Chat File Remove Button",
      props: [
        {
          name: "disabled",
          type: "boolean",
          description: "Disables the remove action.",
        },
        {
          name: "onClick",
          type: "(event) => void",
          description: "Remove handler.",
        },
        {
          name: "aria-label",
          type: "string",
          default: '"Remove"',
          description: "Accessible name for the icon-only control.",
        },
      ],
    },
  ],
  AiChatFileChip: [
    {
      title: "Props — AI Chat File Chip",
      props: [
        {
          name: "type",
          type: '"file" | "image" | "codeSnippet"',
          default: '"file"',
        },
        {
          name: "useCase",
          type: '"chatStream" | "inputField"',
          default: '"chatStream"',
          description: "inputField composes Chat File Remove Button.",
        },
        {
          name: "fileName",
          type: "ReactNode",
          default: '"filename.ext"',
        },
        {
          name: "metadata",
          type: "ReactNode",
          default: '"12:56PM"',
          description: "Shown for type=codeSnippet.",
        },
        {
          name: "imageSrc",
          type: "string",
          description: "Thumbnail for type=image.",
        },
        {
          name: "imageAlt",
          type: "string",
          default: '"Attachment"',
        },
        {
          name: "iconName",
          type: "FaIconName",
          default: '"file-code"',
        },
        {
          name: "onRemove",
          type: "() => void",
          description: "Fired by the remove control in inputField.",
        },
      ],
    },
  ],
  AiChatMessage: [
    {
      title: "Props — AI Chat Message",
      props: [
        {
          name: "context",
          type: '"TA" | "Tutor"',
          default: '"TA"',
        },
        {
          name: "author",
          type: '"Human" | "AI"',
          default: '"Human"',
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Message body.",
        },
        {
          name: "fileUploads",
          type: "ReactNode",
          description: "Optional file chip row above an AI bubble.",
        },
        {
          name: "hasActionRow",
          type: "boolean",
          default: "true",
        },
        {
          name: "hasLeftActions",
          type: "boolean",
          default: "true",
        },
        {
          name: "hasDownload",
          type: "boolean",
          default: "true",
          description: "Download control in the left action group.",
        },
        {
          name: "hasRightActions",
          type: "boolean",
          default: "true",
        },
        {
          name: "hasFlagging",
          type: "boolean",
          default: "true",
        },
        {
          name: "feedbackLabel",
          type: "ReactNode",
          default: '"Was this helpful?"',
        },
        { name: "onCopy", type: "() => void" },
        { name: "onDownload", type: "() => void" },
        {
          name: "helpfulValue",
          type: '"up" | "down" | null',
        },
        {
          name: "onHelpfulChange",
          type: '(value: "up" | "down" | null) => void',
        },
        { name: "flagged", type: "boolean" },
        { name: "onFlagChange", type: "(flagged: boolean) => void" },
      ],
    },
  ],
  AiChatInput: [
    {
      title: "Props — AI Chat Input",
      props: [
        { name: "value", type: "string" },
        { name: "defaultValue", type: "string" },
        {
          name: "onChange",
          type: "(event: ChangeEvent<HTMLTextAreaElement>) => void",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Type something"',
        },
        {
          name: "leftActions",
          type: "ReactNode",
          description: "Overrides the default Add file Button.",
        },
        {
          name: "addFileLabel",
          type: "ReactNode",
          default: '"Add file"',
        },
        { name: "onAddFile", type: "() => void" },
        { name: "onSubmit", type: "(event: FormEvent) => void" },
        { name: "disabled", type: "boolean" },
        {
          name: "attachments",
          type: "ReactNode",
          description: "AiChatFileChip row above the textarea.",
        },
      ],
    },
  ],
};

export const AI_NESTED_TARGETS: Record<string, NestedPlaygroundTarget[]> = {};
