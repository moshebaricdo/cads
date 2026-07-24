import type { NestedPlaygroundTarget, PropSheet } from "./types";

/** Prop sheets for Actions section components. */
export const ACTIONS_PROP_SHEETS: Record<string, PropSheet[]> = {
  Button: [
    {
      title: "Props — Button",
      props: [
        {
          name: "variant",
          type: '"contained" | "outlined" | "text"',
          default: '"contained"',
          description: "Visual style: filled, outline, or text-only.",
        },
        {
          name: "color",
          type: '"primary" | "secondary" | "tertiary" | "orange" | "error"',
          default: '"primary"',
          description:
            "Color role for the button surface and text. Tertiary is only for text + icon-only; orange is only for the run button (contained). Other combos fall back (tertiary→secondary, orange→primary).",
        },
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Control height. Default medium (40).",
        },
        {
          name: "iconOnly",
          type: "boolean",
          description: "Square icon-only geometry; inferred when no children.",
        },
        {
          name: "startIconName",
          type: "FaIconName",
          description: "Leading Font Awesome icon.",
        },
        {
          name: "endIconName",
          type: "FaIconName",
          description: "Trailing Font Awesome icon.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables interaction.",
        },
        {
          name: "fullWidth",
          type: "boolean",
          description: "Stretches to the container width.",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Button label content.",
        },
      ],
    },
  ],
  SegmentedButton: [
    {
      title: "Props — SegmentedButton",
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Segment height. Default medium (40).",
        },
        {
          name: "value",
          type: "string",
          description: "Controlled selected segment value.",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "Initial selected value (uncontrolled).",
        },
        {
          name: "onChange",
          type: "(value: string) => void",
          description: "Called when the selected segment changes.",
        },
        {
          name: "options",
          type: "SegmentedButtonOption[]",
          required: true,
          description:
            "Segment labels, icons, and values. Active segment derived from value.",
        },
        {
          name: "iconOnly",
          type: "boolean",
          description: "Square icon-only segments.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables the entire group.",
        },
        {
          name: "aria-label",
          type: "string",
          description: "Accessible name for the segment group.",
        },
      ],
    },
  ],
  IconToggle: [
    {
      title: "Props — IconToggle",
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Toggle height. Default medium (40).",
        },
        {
          name: "color",
          type: '"primary" | "secondary" | "brand" | "success" | "error"',
          default: '"brand"',
          description: "Icon color when pressed.",
        },
        {
          name: "iconName",
          type: "FaIconName",
          required: true,
          description: "Font Awesome icon for the toggle.",
        },
        {
          name: "pressed",
          type: "boolean",
          description: "Controlled on/off state (Figma isOn).",
        },
        {
          name: "defaultPressed",
          type: "boolean",
          description: "Initial pressed state (uncontrolled).",
        },
        {
          name: "onPressedChange",
          type: "(pressed: boolean) => void",
          description: "Called when pressed state changes.",
        },
        {
          name: "label",
          type: "ReactNode",
          description: "Optional label beside the toggle (Icon Toggle + Label).",
        },
        {
          name: "secondToggle",
          type: "{ iconName; color?; pressed?; defaultPressed?; onPressedChange?; aria-label; disabled? }",
          description:
            "Second toggle for dual layouts (e.g. thumbs up/down).",
        },
        {
          name: "exclusive",
          type: "boolean",
          default: "false",
          description:
            "With secondToggle: only one toggle can be pressed at a time.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables interaction.",
        },
        {
          name: "aria-label",
          type: "string",
          description: "Accessible name when there is no visible label.",
        },
      ],
    },
  ],
  CloseIconButton: [
    {
      title: "Props — CloseIconButton",
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"large"',
          description: "Close-control geometry: 24 / 18 / 18 / 13px.",
        },
        {
          name: "color",
          type: '"primary" | "secondary" | "brand" | "pink" | "orange" | "success" | "error" | "warning" | "info"',
          default: '"primary"',
          description: "Icon color matching the host surface sentiment.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables interaction.",
        },
        {
          name: "onClick",
          type: "(event) => void",
          description: "Dismiss or close action handler.",
        },
        {
          name: "aria-label",
          type: "string",
          default: '"Close"',
          description: "Accessible name for the icon-only action.",
        },
      ],
    },
  ],
};

export const ACTIONS_NESTED_TARGETS: Record<string, NestedPlaygroundTarget[]> =
  {};
