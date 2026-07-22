import type { NestedPlaygroundTarget, PropSheet } from "./types";

export const DROPDOWN_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Dropdown",
    props: [
      {
        name: "role",
        type: '"input" | "action"',
        required: true,
        description: "input = form select; action = button menu",
      },
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Control height. Default medium (40).",
      },
      {
        name: "menuType",
        type: '"default" | "checklist"',
        default: '"default"',
        description:
          "default = single-select; checklist = multi-select (input-only)",
      },
      {
        name: "options",
        type: "DropdownOption[]",
        required: true,
        description: "Items, separators, and group headers.",
      },
      {
        name: "label",
        type: "ReactNode",
        description: "Field label above the control.",
      },
      {
        name: "required",
        type: "boolean",
        default: "false",
        description:
          "Input-role only. Appends * after the Field Wrapper label.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables interaction.",
      },
      {
        name: "menuPlacement",
        type: '"bottomLeft" | "bottomRight" | "topLeft" | "topRight"',
        default: '"bottomLeft"',
        description: "Preferred side for the menu panel.",
      },
      {
        name: "width",
        type: "string",
        default: '"hug"',
        description: 'Input-role only. "hug", "full", or a CSS length.',
      },
    ],
  },
  {
    title: "Props — Menu Item",
    props: [
      {
        name: "label",
        type: "string",
        description: "Text shown in the menu row.",
      },
      {
        name: "value",
        type: "string",
        description: "Unique option value.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables this option.",
      },
      {
        name: "iconName",
        type: "FaIconName",
        description: "Leading FA icon. Omit for text-only.",
      },
    ],
  },
];

export const DROPDOWN_NESTED_TARGETS: NestedPlaygroundTarget[] = [
  {
    id: "menuItem",
    label: "Menu Item",
    props: [
      {
        name: "label",
        type: "string",
        description: "Text shown in the menu row.",
      },
      {
        name: "value",
        type: "string",
        description: "Unique option value.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables this option.",
      },
      {
        name: "iconName",
        type: "FaIconName",
        description: "Leading FA icon. Omit for text-only.",
      },
    ],
  },
];
