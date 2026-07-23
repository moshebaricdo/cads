import type { NestedPlaygroundTarget, PropSheet } from "./types";
import { DROPDOWN_NESTED_TARGETS, DROPDOWN_PROP_SHEETS } from "./dropdown";

const FIELD_WRAPPER_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — FieldWrapper",
    props: [
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Label and helper type scale.",
      },
      {
        name: "sentiment",
        type: '"default" | "success" | "warning" | "error"',
        default: '"default"',
        description: "Validation tone for label and helper.",
      },
      {
        name: "label",
        type: "ReactNode",
        description: "Field label above the control.",
      },
      {
        name: "helperText",
        type: "ReactNode",
        description: "Helper or validation message below.",
      },
      {
        name: "helperIconName",
        type: "FaIconName",
        description: "Optional icon beside helper text.",
      },
      {
        name: "showHelper",
        type: "boolean",
        default: "true",
        description: "Show helper row when helperText is set.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: "The input control to wrap.",
      },
      {
        name: "required",
        type: "boolean",
        default: "false",
        description: "Appends * after the label (same type style, no gap).",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Mutes label, helper, and icon.",
      },
      {
        name: "htmlFor",
        type: "string",
        description: "Associates label with control id.",
      },
    ],
  },
];

const TEXT_INPUT_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — TextInput",
    props: [
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Control height. Default medium (40).",
      },
      {
        name: "color",
        type: '"primary" | "secondary"',
        default: '"primary"',
        description: "primary = solid border; secondary = soft border.",
      },
      {
        name: "multiline",
        type: "boolean",
        default: "false",
        description: "Renders a textarea when true.",
      },
      {
        name: "type",
        type: '"text" | "password" | string',
        default: '"text"',
        description:
          "Native HTML input type. Use password to conceal field contents. Field-only; ignored when multiline.",
      },
      {
        name: "startIconName",
        type: "FaIconName",
        description:
          "Leading FA icon. Field-only; omitted when unset or multiline.",
      },
      {
        name: "label",
        type: "string",
        description: "Field label above the control.",
      },
      {
        name: "helperText",
        type: "ReactNode",
        description: "Helper or validation message below.",
      },
      {
        name: "helperIconName",
        type: "FaIconName",
        description: "Optional icon beside helper text.",
      },
      {
        name: "showHelper",
        type: "boolean",
        default: "true",
        description: "Show helper row when helperText is set.",
      },
      {
        name: "sentiment",
        type: '"default" | "success" | "warning" | "error"',
        default: '"default"',
        description: "Validation tone for label and helper.",
      },
      {
        name: "error",
        type: "boolean",
        description: "Error field styling.",
      },
      {
        name: "readOnly",
        type: "boolean",
        description: "Read-only; not editable.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables interaction.",
      },
      {
        name: "required",
        type: "boolean",
        default: "false",
        description:
          "Native required on the control + * after the Field Wrapper label.",
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text.",
      },
      {
        name: "value",
        type: "string",
        description: "Controlled value.",
      },
      {
        name: "defaultValue",
        type: "string",
        description: "Uncontrolled initial value.",
      },
      {
        name: "rows",
        type: "number",
        description: "Textarea row count when multiline.",
      },
    ],
  },
];

const CHECKBOX_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Checkbox",
    props: [
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Box and label scale.",
      },
      {
        name: "labelStyle",
        type: '"thin" | "thick"',
        default: '"thin"',
        description: "thin = regular; thick = semibold.",
      },
      {
        name: "label",
        type: "ReactNode",
        description: "Label beside the checkbox.",
      },
      {
        name: "checked",
        type: "boolean",
        description: "Controlled checked state.",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        description: "Uncontrolled initial checked state.",
      },
      {
        name: "indeterminate",
        type: "boolean",
        description: "Partially checked (mixed) state.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables interaction.",
      },
      {
        name: "onChange",
        type: "(event, checked) => void",
        description: "Called when checked state changes.",
      },
    ],
  },
];

const RADIO_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Radio",
    props: [
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Circle and label scale.",
      },
      {
        name: "labelStyle",
        type: '"thin" | "thick"',
        default: '"thin"',
        description: "thin = regular; thick = semibold.",
      },
      {
        name: "label",
        type: "ReactNode",
        description: "Label beside the radio.",
      },
      {
        name: "checked",
        type: "boolean",
        description: "Controlled selected state.",
      },
      {
        name: "value",
        type: "string",
        description: "Option value in a radio group.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables interaction.",
      },
      {
        name: "onChange",
        type: "(event) => void",
        description: "Called when selection changes.",
      },
    ],
  },
];

const TOGGLE_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Toggle",
    props: [
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Track and label scale.",
      },
      {
        name: "labelPlacement",
        type: '"left" | "right"',
        default: '"left"',
        description: "Label on the left or right of the switch.",
      },
      {
        name: "label",
        type: "ReactNode",
        description: "Label beside the switch.",
      },
      {
        name: "checked",
        type: "boolean",
        description: "Controlled on/off state.",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        description: "Uncontrolled initial on/off state.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables interaction.",
      },
      {
        name: "onChange",
        type: "(event, checked) => void",
        description: "Called when toggled.",
      },
      {
        name: "hasIcons",
        type: "boolean",
        default: "true",
        description: "Show check/xmark icons on the track.",
      },
      {
        name: "onIcon",
        type: "FaIconName",
        default: '"check"',
        description: "Track icon when on. Ignored when hasIcons is false.",
      },
      {
        name: "offIcon",
        type: "FaIconName",
        default: '"xmark"',
        description: "Track icon when off. Ignored when hasIcons is false.",
      },
      {
        name: "aria-label",
        type: "string",
        description: "Required when unlabeled.",
      },
    ],
  },
];

const SLIDER_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Slider",
    props: [
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Label and helper type scale.",
      },
      {
        name: "sentiment",
        type: '"default" | "error"',
        default: '"default"',
        description: "Field-level error styling.",
      },
      {
        name: "label",
        type: "ReactNode",
        description: "Field label above the control.",
      },
      {
        name: "displayValue",
        type: "ReactNode",
        description: "Custom value shown in the label row.",
      },
      {
        name: "showDisplayValue",
        type: "boolean",
        default: "true",
        description: "Show current value beside the label.",
      },
      {
        name: "showLabelRow",
        type: "boolean",
        default: "true",
        description: "Show the label and value row.",
      },
      {
        name: "helperText",
        type: "ReactNode",
        description: "Helper or validation message below.",
      },
      {
        name: "helperIconName",
        type: "FaIconName",
        description: "Optional icon beside helper text.",
      },
      {
        name: "showHelper",
        type: "boolean",
        default: "true",
        description: "Show helper row when helperText is set.",
      },
      {
        name: "showControls",
        type: "boolean",
        default: "false",
        description: "Show ± buttons beside the track (nudge by step).",
      },
      {
        name: "showTicks",
        type: "boolean",
        default: "false",
        description:
          "Show value labels under the track. Follows step; continuous (step=null) shows only min and max.",
      },
      {
        name: "startsFrom",
        type: '"side" | "center"',
        default: '"side"',
        description:
          'Track fill origin. "side" fills min→value (0…100); "center" is bipolar around 0 (−100…100).',
      },
      {
        name: "min",
        type: "number",
        default: "0",
        description:
          "Range minimum. Defaults to 0 (side) or -100 (center).",
      },
      {
        name: "max",
        type: "number",
        default: "100",
        description: "Range maximum. Default 100 for side and center.",
      },
      {
        name: "width",
        type: "number | string",
        default: "300",
        description: "Control width. Numbers are px. Ignored when fullWidth.",
      },
      {
        name: "fullWidth",
        type: "boolean",
        default: "false",
        description: "Stretch to 100% of the parent.",
      },
      {
        name: "value",
        type: "number | number[]",
        description: "Controlled value.",
      },
      {
        name: "defaultValue",
        type: "number | number[]",
        default: "50",
        description:
          "Uncontrolled initial value. Defaults to 50 (side) or 0 (center).",
      },
      {
        name: "step",
        type: "number | null",
        default: "1",
        description:
          "Value increment for drag, ±, and tick labels. null = continuous (endpoint ticks only).",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables interaction.",
      },
      {
        name: "onChange",
        type: "(event, value, activeThumb) => void",
        description: "Called when the value changes.",
      },
      {
        name: "aria-label",
        type: "string",
        description: "Accessible name for the slider.",
      },
    ],
  },
];

const CHIP_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Chip",
    props: [
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Pill height and type scale.",
      },
      {
        name: "color",
        type: '"primary" | "secondary"',
        default: '"primary"',
        description: "Unselected border treatment.",
      },
      {
        name: "labelStyle",
        type: '"thick" | "thin"',
        default: '"thick"',
        description: "Label weight.",
      },
      {
        name: "selected",
        type: "boolean",
        default: "false",
        description: "Selected (filled) state.",
      },
      {
        name: "label",
        type: "ReactNode",
        description: "Chip label text.",
      },
      {
        name: "startIconName",
        type: "FaIconName",
        description: "Leading FA icon. Omit when unset.",
      },
      {
        name: "endIconName",
        type: "FaIconName",
        description: "Trailing FA icon. Omit when unset.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables interaction.",
      },
      {
        name: "onClick",
        type: "(event) => void",
        description: "Called when the chip is clicked.",
      },
      {
        name: "aria-label",
        type: "string",
        description: "Accessible name when label is insufficient.",
      },
    ],
  },
];

/** Prop sheets for Inputs section (Dropdown already curated). */
export const INPUTS_PROP_SHEETS: Record<string, PropSheet[]> = {
  Dropdown: DROPDOWN_PROP_SHEETS,
  FieldWrapper: FIELD_WRAPPER_PROP_SHEETS,
  TextInput: TEXT_INPUT_PROP_SHEETS,
  Checkbox: CHECKBOX_PROP_SHEETS,
  Radio: RADIO_PROP_SHEETS,
  Toggle: TOGGLE_PROP_SHEETS,
  Slider: SLIDER_PROP_SHEETS,
  Chip: CHIP_PROP_SHEETS,
};

const RADIO_NESTED_TARGETS: NestedPlaygroundTarget[] = [
  {
    id: "radioItem",
    label: "Radio",
    props: [
      {
        name: "label",
        type: "string",
        description: "Label beside this radio.",
      },
      {
        name: "value",
        type: "string",
        description: "Option value in the group.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Disables this option only.",
      },
    ],
  },
];

export const INPUTS_NESTED_TARGETS: Record<string, NestedPlaygroundTarget[]> = {
  Dropdown: DROPDOWN_NESTED_TARGETS,
  Radio: RADIO_NESTED_TARGETS,
};
