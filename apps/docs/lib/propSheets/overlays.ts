import type { NestedPlaygroundTarget, PropSheet } from "./types";

/** Prop sheets for Overlays section components. */
export const OVERLAYS_PROP_SHEETS: Record<string, PropSheet[]> = {
  Tooltip: [
    {
      title: "Props — Tooltip",
      props: [
        {
          name: "title",
          type: "ReactNode",
          required: true,
          description: "Brief contextual text shown in the bubble.",
        },
        {
          name: "children",
          type: "ReactElement",
          required: true,
          description: "Trigger element; must accept a ref.",
        },
        {
          name: "placement",
          type: '"bottom-start" | "bottom" | "bottom-end" | "top-start" | "top" | "top-end" | "left-start" | "left" | "left-end" | "right-start" | "right" | "right-end"',
          default: '"bottom"',
          description:
            "MUI placement — where the tooltip sits relative to the trigger. *-start / *-end pin the caret near that edge.",
        },
        {
          name: "hasCaret",
          type: "boolean",
          default: "true",
          description: "Show the pointing caret.",
        },
        {
          name: "iconName",
          type: "FaIconName | string",
          description:
            "Leading FA icon. Omit when unset. (API also accepts startIcon boolean.)",
        },
      ],
    },
  ],
  Popover: [
    {
      title: "Props — Popover",
      props: [
        {
          name: "content",
          type: '"textOnly" | "textImage" | "custom"',
          default: '"textOnly"',
          description: "Layout variant for body content.",
        },
        {
          name: "caretPlacement",
          type: '"bottomLeft" | "bottomCenter" | "bottomRight" | "topLeft" | "topCenter" | "topRight" | "leftTop" | "leftCenter" | "leftBottom" | "rightTop" | "rightCenter" | "rightBottom"',
          default: '"bottomLeft"',
          description: "Anchor position relative to the trigger.",
        },
        {
          name: "hasCaret",
          type: "boolean",
          default: "true",
          description: "Show the pointing caret.",
        },
        {
          name: "title",
          type: "ReactNode",
          description: "Card heading.",
        },
        {
          name: "body",
          type: "ReactNode",
          description: "Main text content.",
        },
        {
          name: "image",
          type: "ReactNode",
          description: "Image slot for textImage layout.",
        },
        {
          name: "customContent",
          type: "ReactNode",
          description: "Custom body when content is custom.",
        },
        {
          name: "hasActionRow",
          type: "boolean",
          default: "true",
          description: "Show the footer action row.",
        },
        {
          name: "hasStepper",
          type: "boolean",
          default: "true",
          description: "Show step indicator (e.g. tour steps).",
        },
        {
          name: "stepperText",
          type: "ReactNode",
          default: '"1/3"',
          description: "Step counter label.",
        },
        {
          name: "hasPrimaryAction",
          type: "boolean",
          default: "true",
          description: "Show the primary footer button.",
        },
        {
          name: "hasSecondaryAction",
          type: "boolean",
          default: "true",
          description: "Show the secondary footer button.",
        },
        {
          name: "primaryActionLabel",
          type: "ReactNode",
          default: '"Next"',
          description: "Primary button label.",
        },
        {
          name: "secondaryActionLabel",
          type: "ReactNode",
          default: '"Back"',
          description: "Secondary button label.",
        },
        {
          name: "isDismissible",
          type: "boolean",
          default: "true",
          description: "Show close control.",
        },
        {
          name: "onClose",
          type: "() => void",
          description: "Called when the popover is dismissed.",
        },
        {
          name: "children",
          type: "ReactElement | ReactNode",
          description: "Trigger element for anchored mode.",
        },
        {
          name: "surfaceOnly",
          type: "boolean",
          description: "Render the card surface without a trigger anchor.",
        },
      ],
    },
  ],
  Drawer: [
    {
      title: "Props — Drawer",
      props: [
        {
          name: "type",
          type: '"textOnly" | "customContent"',
          default: '"textOnly"',
          description: "Layout variant for drawer body.",
        },
        {
          name: "title",
          type: "ReactNode",
          description: "Sheet heading.",
        },
        {
          name: "description",
          type: "ReactNode",
          description: "Supporting text below the title.",
        },
        {
          name: "hasDescription",
          type: "boolean",
          default: "true",
          description: "Show the description block.",
        },
        {
          name: "hasActionRow",
          type: "boolean",
          default: "true",
          description: "Show the footer action row.",
        },
        {
          name: "primaryActionLabel",
          type: "ReactNode",
          default: '"Button"',
          description: "Primary button label.",
        },
        {
          name: "secondaryActionLabel",
          type: "ReactNode",
          default: '"Button"',
          description: "Secondary button label.",
        },
        {
          name: "isDismissible",
          type: "boolean",
          default: "true",
          description: "Show close control.",
        },
        {
          name: "onClose",
          type: "() => void",
          description: "Called when the drawer is dismissed.",
        },
        {
          name: "open",
          type: "boolean",
          default: "false",
          description: "Controls sheet visibility.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Custom body content when type is customContent.",
        },
        {
          name: "surfaceOnly",
          type: "boolean",
          description: "Render the sheet surface without open/close behavior.",
        },
      ],
    },
  ],
  Dialog: [
    {
      title: "Props — Dialog",
      props: [
        {
          name: "type",
          type: '"default" | "iconTop" | "customContent"',
          default: '"default"',
          description: "Layout variant for the confirmation overlay.",
        },
        {
          name: "title",
          type: "ReactNode",
          description: "Dialog heading.",
        },
        {
          name: "description",
          type: "ReactNode",
          description: "Short confirmation message.",
        },
        {
          name: "hasImage",
          type: "boolean",
          default: "false",
          description: "Show an image slot in the body.",
        },
        {
          name: "image",
          type: "ReactNode",
          description: "Image content when hasImage is set.",
        },
        {
          name: "topIconName",
          type: "FaIconName | string",
          default: '"smile"',
          description:
            "Floating badge icon when type is iconTop (Figma shortcode).",
        },
        {
          name: "hasSecondaryAction",
          type: "boolean",
          default: "true",
          description: "Show the secondary footer button.",
        },
        {
          name: "primaryActionLabel",
          type: "ReactNode",
          default: '"Button"',
          description: "Primary button label.",
        },
        {
          name: "secondaryActionLabel",
          type: "ReactNode",
          default: '"Button"',
          description: "Secondary button label.",
        },
        {
          name: "isDismissable",
          type: "boolean",
          default: "true",
          description: "Allow dismiss via close control or backdrop.",
        },
        {
          name: "onClose",
          type: "() => void",
          description: "Called when the dialog is dismissed.",
        },
        {
          name: "open",
          type: "boolean",
          default: "false",
          description: "Controls dialog visibility.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Custom body when type is customContent.",
        },
        {
          name: "surfaceOnly",
          type: "boolean",
          description: "Render the dialog surface without open/close behavior.",
        },
      ],
    },
  ],
  Modal: [
    {
      title: "Props — Modal",
      props: [
        {
          name: "type",
          type: '"default" | "verticalImage" | "horizontalImage"',
          default: '"default"',
          description: "Layout variant for rich modal content.",
        },
        {
          name: "title",
          type: "ReactNode",
          description: "Header title.",
        },
        {
          name: "body",
          type: "ReactNode",
          description: "Main content area.",
        },
        {
          name: "image",
          type: "ReactNode",
          description: "Image slot for image layout variants.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Additional custom content in the body.",
        },
        {
          name: "hasSecondaryAction",
          type: "boolean",
          default: "true",
          description: "Show the secondary footer button.",
        },
        {
          name: "primaryActionLabel",
          type: "ReactNode",
          default: '"Button"',
          description: "Primary button label.",
        },
        {
          name: "secondaryActionLabel",
          type: "ReactNode",
          default: '"Button"',
          description: "Secondary button label.",
        },
        {
          name: "isDismissable",
          type: "boolean",
          default: "true",
          description: "Allow dismiss via close control or backdrop.",
        },
        {
          name: "onClose",
          type: "() => void",
          description: "Called when the modal is dismissed.",
        },
        {
          name: "open",
          type: "boolean",
          default: "false",
          description: "Controls modal visibility.",
        },
        {
          name: "surfaceOnly",
          type: "boolean",
          description: "Render the modal surface without open/close behavior.",
        },
      ],
    },
  ],
};

export const OVERLAYS_NESTED_TARGETS: Record<string, NestedPlaygroundTarget[]> =
  {};
