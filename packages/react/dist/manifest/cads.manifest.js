const CADS_FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";
const cadsManifest = {
  version: "0.1.0",
  package: "@codeai/cads-react",
  figmaFileKey: CADS_FIGMA_FILE_KEY,
  components: [
    {
      name: "Button",
      exportName: "Button",
      importFrom: "@codeai/cads-react",
      description: "Triggers an action with a single tap or click. Contained, outlined, and text styles across primary, secondary, tertiary, and error colors.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "15724:18791",
        componentKey: "2507b18076b4066c6ff738539115b36a798fd707"
      },
      props: [
        {
          name: "variant",
          type: '"contained" | "outlined" | "text"',
          default: '"contained"'
        },
        {
          name: "color",
          type: '"primary" | "secondary" | "tertiary" | "error"',
          default: '"primary"'
        },
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Control heights: 48 / 40 / 32 / 24"
        },
        {
          name: "iconOnly",
          type: "boolean",
          description: "Square icon-only geometry; inferred when no children"
        },
        { name: "startIconName", type: "FaIconName" },
        { name: "endIconName", type: "FaIconName" },
        { name: "disabled", type: "boolean" },
        { name: "fullWidth", type: "boolean" },
        { name: "children", type: "ReactNode" }
      ],
      variableDependencies: [
        "--background-brand-primary",
        "--background-brand-strong",
        "--background-brand-light",
        "--background-neutral-primary-inverse",
        "--background-neutral-octonary",
        "--border-focused-primary",
        "--border-neutral-solid",
        "--control-height-medium",
        "--radius-sm",
        "--transition-colors",
        "--text-disabled-neutral-inverse"
      ],
      usageRules: [
        "Use variant=contained + color=primary for primary CTAs (brand fill).",
        "Contained secondary uses --background-neutral-primary-inverse; outlined primary uses --border-neutral-solid.",
        "Contained disabled text uses --text-disabled-neutral-inverse (solid fill).",
        "color=tertiary is Figma-valid only for text + iconOnly; other combos warn and fall back to secondary.",
        "Use semantic color CSS vars only \u2014 never hard-coded hex. No --ds- prefix."
      ],
      example: `<Button variant="contained" color="primary" size="medium">Continue</Button>`
    },
    {
      name: "CloseIconButton",
      exportName: "CloseIconButton",
      importFrom: "@codeai/cads-react",
      description: "Icon-only close action for dismissible components such as alerts, popovers, dialogs, drawers, and tabs.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "6368:7269",
        componentKey: "c492ad784f39078a3067dde33f2be223d6e30903"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"large"',
          description: "Figma close-control geometry: 24 / 18 / 18 / 13px."
        },
        {
          name: "color",
          type: '"primary" | "secondary" | "brand" | "pink" | "orange" | "success" | "error" | "warning" | "info"',
          default: '"primary"'
        },
        { name: "disabled", type: "boolean" },
        { name: "onClick", type: "(event) => void" },
        {
          name: "aria-label",
          type: "string",
          default: '"Close"',
          description: "Accessible name for the icon-only action."
        }
      ],
      variableDependencies: [
        "--text-neutral-primary",
        "--text-neutral-quaternary",
        "--text-brand-primary",
        "--text-brand-secondary",
        "--text-accent-pink-primary",
        "--text-accent-pink-strong",
        "--text-accent-orange-primary",
        "--text-accent-orange-strong",
        "--text-success-primary",
        "--text-success-secondary",
        "--text-error-primary",
        "--text-error-secondary",
        "--text-warning-primary",
        "--text-warning-secondary",
        "--text-info-primary",
        "--text-info-secondary",
        "--text-disabled-neutral",
        "--border-focused-primary"
      ],
      usageRules: [
        "Use only for close or dismiss actions.",
        "Choose the color that matches the host component's sentiment; use secondary on neutral surfaces.",
        "Interaction states are CSS recipes \u2014 do not expose state as a React prop.",
        "Override aria-label when context such as Dismiss tab is clearer than Close."
      ],
      example: `<CloseIconButton size="medium" color="secondary" onClick={onClose} />`
    },
    {
      name: "SegmentedButton",
      exportName: "SegmentedButton",
      importFrom: "@codeai/cads-react",
      description: "A group of connected buttons for choosing one option from a small mutually exclusive set. Selected segment uses selected tokens.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "8027:2099",
        componentKey: "bf599e1bc1d1e651be6aab5bf90ac6a7c26dcfd1"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        { name: "value", type: "string" },
        { name: "defaultValue", type: "string" },
        { name: "onChange", type: "(value: string) => void" },
        {
          name: "options",
          type: "SegmentedButtonOption[]",
          required: true,
          description: "Maps Block label / leftIcon / rightIcon / show*Icon / isActive via value."
        },
        { name: "iconOnly", type: "boolean", description: "Square icon-only segments" },
        { name: "disabled", type: "boolean" },
        { name: "aria-label", type: "string" }
      ],
      variableDependencies: [
        "--background-selected-primary",
        "--border-selected-primary",
        "--text-selected-primary",
        "--border-neutral-secondary",
        "--control-height-medium",
        "--transition-colors"
      ],
      usageRules: [
        "Use selected tokens (fill + border + text) for the active segment \u2014 never brand fills for selected chrome.",
        "Segments are connected with -1px overlap; first/last get --radius-sm on outer corners only.",
        "Labels are always Body Semi Bold \u2014 do not invent labelStyle / thick|thin.",
        "Figma Group exposes color=Primary only; unselected border is always --border-neutral-secondary (not a consumer prop).",
        "Figma Block-only: position (first|middle|last), state, isActive \u2014 derived in code from options index / value / CSS / disabled.",
        "Prefer the group API; Segmented Button Block (8000:4554) is an internal building block."
      ],
      example: `<SegmentedButton aria-label="View" options={[{value:"list",label:"List"},{value:"grid",label:"Grid"}]} defaultValue="list" />`
    },
    {
      name: "IconToggle",
      exportName: "IconToggle",
      importFrom: "@codeai/cads-react",
      description: "Icon-only binary on/off control. Optional label + secondToggle covers Figma Icon Toggle + Label (up to 2 toggles).",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "3710:461",
        componentKey: "d08929d02e63b3b286690e87d791199e4545126f"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "color",
          type: '"primary" | "secondary" | "brand" | "success" | "error"',
          default: '"brand"'
        },
        { name: "iconName", type: "FaIconName", required: true },
        { name: "pressed", type: "boolean", description: "Controlled on/off (Figma isOn)" },
        { name: "defaultPressed", type: "boolean" },
        { name: "onPressedChange", type: "(pressed: boolean) => void" },
        {
          name: "label",
          type: "ReactNode",
          description: "When set, renders Figma Icon Toggle + Label layout"
        },
        {
          name: "secondToggle",
          type: "{ iconName; color?; pressed?; defaultPressed?; onPressedChange?; aria-label; disabled? }",
          description: "Figma hasTwoToggles \u2014 second toggle with its own icon/color/aria-label (e.g. thumbs-down + error)"
        },
        {
          name: "exclusive",
          type: "boolean",
          default: "false",
          description: "With secondToggle: mutual exclusion (thumbs up/down). Figma does not specify exclusive \u2014 default is independent."
        },
        { name: "disabled", type: "boolean" },
        { name: "aria-label", type: "string" }
      ],
      variableDependencies: [
        "--text-brand-primary-fixed",
        "--text-brand-secondary",
        "--background-brand-light",
        "--background-error-light",
        "--background-success-light",
        "--background-neutral-tertiary",
        "--text-neutral-quaternary",
        "--text-disabled-neutral",
        "--control-height-medium",
        "--radius-sm",
        "--transition-colors"
      ],
      usageRules: [
        "Off = FA Regular + quaternary text; on = FA Solid + color on-token.",
        "Hover/press surfaces are color-specific (brand-light, error-light, etc.) \u2014 never a generic grey for all colors.",
        "Standalone and labeled Figma sets map to one React component (secondToggle for dual).",
        "In dual mode, set color per toggle: parent color = first; secondToggle.color = second (e.g. success + error).",
        "Dual toggles are independent unless exclusive; Figma has no exclusive prop.",
        "Always provide aria-label when there is no visible label."
      ],
      example: `<IconToggle label="Was this helpful?" iconName="thumbs-up" color="success" exclusive aria-label="Thumbs up" secondToggle={{ iconName: "thumbs-down", color: "error", "aria-label": "Thumbs down" }} />`
    },
    {
      name: "FieldWrapper",
      exportName: "FieldWrapper",
      importFrom: "@codeai/cads-react",
      description: "Generic container that pairs any input with a label and helper text, including validation messaging for errors and warnings.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "15857:99804",
        componentKey: "a76313f790928233bb8afabe35bd6f76f6e9a473"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "sentiment",
          type: '"default" | "success" | "warning" | "error"',
          default: '"default"'
        },
        { name: "label", type: "ReactNode" },
        { name: "helperText", type: "ReactNode" },
        { name: "helperIconName", type: "FaIconName" },
        { name: "showHelper", type: "boolean", default: "true" },
        { name: "children", type: "ReactNode", required: true },
        { name: "disabled", type: "boolean" },
        { name: "htmlFor", type: "string" }
      ],
      variableDependencies: [
        "--text-neutral-primary",
        "--text-neutral-tertiary",
        "--text-success-primary-fixed",
        "--text-warning-primary-fixed",
        "--text-error-primary-fixed"
      ],
      usageRules: [
        "Nest any CADS control in children (TextInput, Dropdown, Checkbox, etc.).",
        "Warning helper text stays tertiary; only the icon uses warning color.",
        "Non-default sentiments always show helper when helperText is set."
      ],
      example: `<FieldWrapper label="Email" helperText="We never share this" sentiment="default"><TextInput placeholder="you@example.com" /></FieldWrapper>`
    },
    {
      name: "TextInput",
      exportName: "TextInput",
      importFrom: "@codeai/cads-react",
      description: "Single-line field or multiline area with Field Wrapper label/helper. Figma name: Text Input.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "16176:4884",
        componentKey: "ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "color",
          type: '"primary" | "secondary"',
          default: '"primary"',
          description: "primary = solid border; secondary = soft border"
        },
        {
          name: "multiline",
          type: "boolean",
          default: "false",
          description: "Figma type=area when true"
        },
        { name: "label", type: "string" },
        { name: "helperText", type: "ReactNode" },
        { name: "helperIconName", type: "FaIconName" },
        {
          name: "sentiment",
          type: '"default" | "success" | "warning" | "error"',
          default: '"default"'
        },
        { name: "error", type: "boolean" },
        { name: "readOnly", type: "boolean" },
        { name: "disabled", type: "boolean" },
        { name: "placeholder", type: "string" },
        { name: "value", type: "string" },
        { name: "defaultValue", type: "string" },
        { name: "rows", type: "number" }
      ],
      variableDependencies: [
        "--border-neutral-solid",
        "--border-neutral-secondary",
        "--border-focused-primary",
        "--border-error-primary",
        "--text-neutral-placeholder",
        "--control-height-medium",
        "--radius-sm"
      ],
      usageRules: [
        "Prefer TextInput over the deprecated TextField alias.",
        "Figma type=field|area maps to multiline={false|true}.",
        "extraSmall field height uses the shared 24px control scale (Figma building block is 22px).",
        "Do not invent floating labels \u2014 label is always above via Field Wrapper."
      ],
      example: `<TextInput label="Email" size="medium" placeholder="you@example.com" helperText="Required" />`
    },
    {
      name: "Dropdown",
      exportName: "Dropdown",
      importFrom: "@codeai/cads-react",
      description: "Reveals options in a collapsible panel. Works as a form select (role=input) or as an action menu (role=action).",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "15857:100676",
        componentKey: "d3660d988bcb4702c24ce921128e32cadb6618db"
      },
      props: [
        {
          name: "role",
          type: '"input" | "action"',
          required: true,
          description: "input = form select; action = button menu"
        },
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "menuType",
          type: '"icon" | "checklist"',
          default: '"icon"',
          description: "checklist is input-only in Figma"
        },
        {
          name: "menuPlacement",
          type: '"bottomLeft" | "bottomRight" | "topLeft" | "topRight"',
          default: '"bottomLeft"'
        },
        {
          name: "width",
          type: "string",
          default: '"hug"',
          description: 'Input-role only. "hug" (default) = static width from longest option/placeholder; "full" = 100%; or any CSS length (12rem, 240px, 50%). Numbers are px.'
        },
        {
          name: "options",
          type: "DropdownOption[]",
          required: true
        },
        { name: "label", type: "ReactNode" },
        { name: "helperText", type: "ReactNode" },
        { name: "placeholder", type: "string" },
        { name: "value", type: "string | string[]" },
        { name: "defaultValue", type: "string | string[]" },
        { name: "onChange", type: "(value: string | string[]) => void" },
        { name: "onAction", type: "(value: string) => void" },
        { name: "open", type: "boolean" },
        { name: "defaultOpen", type: "boolean" },
        { name: "disabled", type: "boolean" },
        { name: "readOnly", type: "boolean" },
        { name: "error", type: "boolean" },
        { name: "color", type: '"primary" | "secondary"' },
        { name: "labelStyle", type: '"thick" | "thin"' },
        { name: "startIconName", type: "FaIconName" },
        { name: "buttonVariant", type: '"contained" | "outlined" | "text"' },
        { name: "buttonColor", type: '"primary" | "secondary" | "tertiary" | "error"' },
        { name: "aria-label", type: "string" }
      ],
      variableDependencies: [
        "--border-neutral-solid",
        "--border-neutral-primary",
        "--background-selected-primary",
        "--text-selected-primary",
        "--shadow-md",
        "--radius-sm",
        "--background-brand-primary"
      ],
      usageRules: [
        "role=input composes Field Wrapper + Dropdown Button; role=action reuses Button.",
        "menuType=checklist is input-only; action menus use icon items (optional destructive).",
        'Input-role width defaults to hug (static width from the longest option/placeholder \u2014 selection does not resize the field). Use "full" or a CSS length otherwise.',
        "Selected menu items use selected tokens \u2014 never brand fills.",
        "Dropdown Button / Menu List / Menu Item are internal \u2014 do not import standalone."
      ],
      example: `<Dropdown role="input" label="Sort" width="hug" options={[{value:"a",label:"Option A"},{value:"b",label:"Option B"}]} defaultValue="a" />`
    },
    {
      name: "Checkbox",
      exportName: "Checkbox",
      importFrom: "@codeai/cads-react",
      description: "Binary or indeterminate checkbox. Public API maps Figma Checkbox + Label; box chrome from the Checkbox building block.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "252:2038",
        componentKey: "503f333f3195d96aa1659225c533b00567e90863"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "labelStyle",
          type: '"thin" | "thick"',
          default: '"thin"',
          description: "Figma labelStyle \u2014 thin=regular, thick=semibold"
        },
        { name: "label", type: "ReactNode" },
        { name: "checked", type: "boolean" },
        { name: "defaultChecked", type: "boolean" },
        {
          name: "indeterminate",
          type: "boolean",
          description: "Maps Figma block status=indeterminate"
        },
        { name: "disabled", type: "boolean" },
        { name: "onChange", type: "(event, checked) => void" }
      ],
      variableDependencies: [
        "--background-selected-primary",
        "--background-selected-strong",
        "--background-brand-light",
        "--border-neutral-solid",
        "--border-selected-primary",
        "--border-focused-primary",
        "--text-selected-primary",
        "--radius-sm"
      ],
      usageRules: [
        "Checked / indeterminate fills use selected tokens \u2014 never brand fills.",
        "Prefer labeled usage; standalone box only when + Label does not suffice.",
        "Interaction states (hover/focus/press) are CSS recipes \u2014 not React props."
      ],
      example: `<Checkbox label="Remember me" size="medium" labelStyle="thin" />`
    },
    {
      name: "Radio",
      exportName: "Radio",
      importFrom: "@codeai/cads-react",
      description: "Single-select radio. Public API maps Figma Radio Button + Label; circle chrome from Radio Buttons Block.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "4675:6352",
        componentKey: "dae7e8825645a8ec83b8593ab666788be4593ab8"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "labelStyle",
          type: '"thin" | "thick"',
          default: '"thin"',
          description: "Figma labelStyle \u2014 thin=regular, thick=semibold"
        },
        { name: "label", type: "ReactNode" },
        { name: "checked", type: "boolean" },
        { name: "value", type: "string" },
        { name: "disabled", type: "boolean" },
        { name: "onChange", type: "(event) => void" }
      ],
      variableDependencies: [
        "--background-selected-primary",
        "--background-selected-strong",
        "--background-brand-light",
        "--border-neutral-solid",
        "--border-selected-primary",
        "--border-focused-primary"
      ],
      usageRules: [
        "Selected state is ring + inner dot on neutral fill \u2014 not a filled selected square.",
        "Group with MUI RadioGroup when needed.",
        "Interaction states are CSS recipes \u2014 not React props."
      ],
      example: `<Radio label="Option A" value="a" size="medium" />`
    },
    {
      name: "Toggle",
      exportName: "Toggle",
      importFrom: "@codeai/cads-react",
      description: "On/off switch with check/xmark icons. Public API maps Figma Toggle + Label; track chrome from Toggle building block. Distinct from IconToggle.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "327:2151",
        componentKey: "13f4f08ad10787f9c7c557c0139b200f4d8864a8"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "labelPlacement",
          type: '"left" | "right"',
          default: '"left"',
          description: "Label on the left (switch right) or label on the right (switch left). Corrects inverted Figma axis naming."
        },
        { name: "label", type: "ReactNode" },
        { name: "checked", type: "boolean" },
        { name: "defaultChecked", type: "boolean" },
        { name: "disabled", type: "boolean" },
        { name: "onChange", type: "(event, checked) => void" },
        {
          name: "aria-label",
          type: "string",
          description: "Required when unlabeled"
        }
      ],
      variableDependencies: [
        "--background-selected-primary",
        "--background-selected-primary-inverse",
        "--background-selected-strong",
        "--background-neutral-septenary",
        "--background-neutral-octonary",
        "--background-disabled-neutral",
        "--border-focused-primary",
        "--text-selected-primary"
      ],
      usageRules: [
        "On track uses selected tokens; off track uses neutral septenary/octonary.",
        "Not the same as IconToggle (icon-only binary button).",
        "Interaction states are CSS recipes \u2014 not React props."
      ],
      example: `<Toggle label="Notifications" labelPlacement="left" defaultChecked />`
    },
    {
      name: "Slider",
      exportName: "Slider",
      importFrom: "@codeai/cads-react",
      description: "Continuous or stepped value control with optional \xB1 buttons, display value, and stepper ticks. Track fill uses selected tokens.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "16344:15611",
        componentKey: "7659dd566886ab8e61de1cf5c73ff039928b6553"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Maps Figma labelSize for label/helper type."
        },
        {
          name: "sentiment",
          type: '"default" | "error"',
          default: '"default"',
          description: "Maps field-level Figma state=error."
        },
        { name: "label", type: "ReactNode" },
        { name: "displayValue", type: "ReactNode" },
        { name: "showDisplayValue", type: "boolean", default: "true" },
        { name: "showLabelRow", type: "boolean", default: "true" },
        { name: "helperText", type: "ReactNode" },
        { name: "helperIconName", type: "FaIconName" },
        { name: "showHelper", type: "boolean", default: "true" },
        { name: "showControls", type: "boolean", default: "false" },
        { name: "showStepper", type: "boolean", default: "false" },
        {
          name: "stepCount",
          type: "3 | 4 | 5 | 6",
          default: "5",
          description: "Stepper ticks when showStepper is true."
        },
        {
          name: "startsFrom",
          type: '"side" | "center"',
          default: '"side"',
          description: 'Fill origin. "side" fills min\u2192value; "center" is bipolar \u2014 fill from 0 toward the value (negatives left, positives right).'
        },
        {
          name: "min",
          type: "number",
          default: "0 (side) / -100 (center)",
          description: "Range minimum. Side default 0; center default -100 (bipolar)."
        },
        {
          name: "max",
          type: "number",
          default: "100",
          description: "Range maximum. Default 100 for both side and center."
        },
        {
          name: "width",
          type: "number | string",
          default: "300",
          description: 'Control width. Numbers are px; strings are CSS lengths (e.g. "16rem"). Ignored when fullWidth is true. Default matches Figma (300px).'
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          description: "Stretch to 100% of the parent. Takes precedence over width."
        },
        { name: "value", type: "number | number[]" },
        {
          name: "defaultValue",
          type: "number | number[]",
          default: "50 (side) / 0 (center)",
          description: "Uncontrolled initial value. Side default 50; center default 0 (origin)."
        },
        { name: "step", type: "number", default: "1" },
        { name: "disabled", type: "boolean" },
        { name: "onChange", type: "(event, value, activeThumb) => void" },
        { name: "aria-label", type: "string" }
      ],
      variableDependencies: [
        "--background-selected-primary",
        "--border-neutral-solid",
        "--border-neutral-secondary",
        "--border-focused-primary",
        "--border-error-primary",
        "--background-disabled-neutral"
      ],
      usageRules: [
        "Filled track uses selected tokens \u2014 never brand fills for the active range.",
        "Knob hover/focus/press are CSS recipes from Slider Knob \u2014 not React props.",
        "Set min/max for the value domain \u2014 side defaults 0\u2026100; center defaults -100\u2026100 with 0 at the origin.",
        'startsFrom="center" is bipolar: negative values fill left of 0, positive fill right.',
        "Default width is 300px (Figma symbol). Use fullWidth in fluid layouts, or width for a fixed size."
      ],
      example: `<Slider label="Volume" defaultValue={50} showControls showHelper helperText="Helper text" />`
    },
    {
      name: "Chip",
      exportName: "Chip",
      importFrom: "@codeai/cads-react",
      description: "Selectable pill for options or quick actions. Prefer ChipGroup for labeled multi-select sets. Distinct from Tag (status/category label).",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "5881:2187",
        componentKey: "388cba2ed6150b2a9b448f1895ed2f04ca90edb2"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "color",
          type: '"primary" | "secondary"',
          default: '"primary"',
          description: "Unselected border treatment."
        },
        {
          name: "labelStyle",
          type: '"thick" | "thin"',
          default: '"thick"'
        },
        { name: "selected", type: "boolean", default: "false" },
        { name: "label", type: "ReactNode" },
        { name: "startIcon", type: "boolean", default: "false" },
        { name: "endIcon", type: "boolean", default: "false" },
        { name: "startIconName", type: "FaIconName" },
        { name: "endIconName", type: "FaIconName" },
        { name: "disabled", type: "boolean" },
        { name: "onClick", type: "(event) => void" },
        { name: "aria-label", type: "string" }
      ],
      variableDependencies: [
        "--background-selected-primary",
        "--background-selected-strong",
        "--text-selected-primary",
        "--border-neutral-solid",
        "--border-neutral-secondary",
        "--radius-round"
      ],
      usageRules: [
        "Selected chrome uses selected tokens \u2014 never brand fills.",
        "Not the same as Tag (status/category badge).",
        "Interaction states are CSS recipes \u2014 not React props."
      ],
      example: `<Chip label="Option" selected color="primary" size="medium" />`
    },
    {
      name: "ChipGroup",
      exportName: "ChipGroup",
      importFrom: "@codeai/cads-react",
      description: "Labeled multi-select group of Chips with Field Wrapper chrome. Preferred over composing Chip alone.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "15953:3568",
        componentKey: "65c61f6f006c06e27b293ca8f5e573d650c69c06"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "color",
          type: '"primary" | "secondary"',
          default: '"primary"'
        },
        {
          name: "labelStyle",
          type: '"thick" | "thin"',
          default: '"thick"'
        },
        { name: "label", type: "ReactNode" },
        { name: "helperText", type: "ReactNode" },
        { name: "helperIconName", type: "FaIconName" },
        { name: "showHelper", type: "boolean", default: "true" },
        {
          name: "options",
          type: "ChipGroupOption[]",
          required: true
        },
        { name: "value", type: "string[]" },
        { name: "defaultValue", type: "string[]" },
        { name: "onChange", type: "(value: string[]) => void" },
        { name: "disabled", type: "boolean" },
        { name: "aria-label", type: "string" }
      ],
      variableDependencies: [
        "--background-selected-primary",
        "--border-neutral-solid",
        "--radius-round"
      ],
      usageRules: [
        "Multi-select: value is string[]. Selected chips use selected tokens.",
        "Prefer ChipGroup over ad-hoc Chip rows when a field label is needed."
      ],
      example: `<ChipGroup label="Interests" options={[{value:"a",label:"Art"},{value:"b",label:"Music"}]} defaultValue={["a"]} />`
    },
    {
      name: "Link",
      exportName: "Link",
      importFrom: "@codeai/cads-react",
      description: "Navigates to another page or resource. Primary (brand) and secondary (neutral) types with optional external icon.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "3480:5546",
        componentKey: "87b099a460c3dad155731d3983e7ccfecefc5975"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall" | "extraExtraSmall"',
          default: '"medium"',
          description: "extraExtraSmall is Link-only (body/xxs)."
        },
        {
          name: "type",
          type: '"primary" | "secondary"',
          default: '"primary"',
          description: "Figma type axis \u2014 primary uses brand text; secondary uses neutral."
        },
        {
          name: "isExternal",
          type: "boolean",
          default: "true",
          description: "Shows up-right-from-square end icon."
        },
        { name: "href", type: "string" },
        { name: "disabled", type: "boolean" },
        { name: "children", type: "ReactNode", required: true }
      ],
      variableDependencies: [
        "--text-brand-primary",
        "--text-brand-secondary",
        "--text-neutral-primary",
        "--text-neutral-secondary",
        "--text-neutral-tertiary",
        "--text-disabled-neutral",
        "--border-focused-primary"
      ],
      usageRules: [
        "Use type=primary for brand CTAs/links; secondary for neutral inline navigation.",
        "Visited/hover/press are CSS recipes \u2014 not React props.",
        "Brand tokens for primary links \u2014 never selected fills."
      ],
      example: `<Link href="/docs" type="primary" size="medium" isExternal>Link</Link>`
    },
    {
      name: "Breadcrumbs",
      exportName: "Breadcrumbs",
      importFrom: "@codeai/cads-react",
      description: "Trail of breadcrumb links with chevron separators. When maxItems is exceeded, middle crumbs collapse into Breadcrumb Overflow (ellipsis \u2192 dropdown of truncated pages). Composes Figma Links / Separators / Overflow.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "16381:3339",
        componentKey: "43afede0abfd158d2c740e2801b46d13e570a8d0"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "items",
          type: "BreadcrumbItem[]",
          required: true,
          description: "Trail items. Optional per-item iconName (leading icon on any crumb), iconOnly, current (Figma isCurrent), href/onClick."
        },
        {
          name: "maxItems",
          type: "number",
          default: "8",
          description: "MUI-compatible. Collapse middle into Overflow ellipsis when exceeded."
        },
        {
          name: "itemsBeforeCollapse",
          type: "number",
          default: "1",
          description: "MUI-compatible. Crumbs kept before the overflow ellipsis."
        },
        {
          name: "itemsAfterCollapse",
          type: "number",
          default: "1",
          description: "MUI-compatible. Crumbs kept after the overflow ellipsis (Figma default composition uses 2)."
        },
        {
          name: "expandText",
          type: "string",
          default: '"Show path"',
          description: "Accessible name for the overflow trigger."
        },
        { name: "aria-label", type: "string", default: '"Breadcrumb"' }
      ],
      variableDependencies: [
        "--text-neutral-quaternary",
        "--text-neutral-secondary",
        "--text-selected-primary-inverse",
        "--text-disabled-neutral",
        "--border-focused-primary",
        "--background-neutral-primary",
        "--background-neutral-secondary",
        "--border-neutral-primary",
        "--shadow-md"
      ],
      usageRules: [
        "Mark the current page with items[].current \u2014 rendered as text, not a link.",
        "Optional leading icon via items[].iconName on any crumb (not first-only); iconOnly hides the label.",
        "Prefer items[] composition; do not use Breadcrumb Links standalone.",
        "Overflow ellipsis opens a dropdown of truncated pages (Figma Breadcrumb Overflow + Dropdown).",
        "Interaction states are CSS recipes \u2014 not React props. No underline on hover."
      ],
      example: `<Breadcrumbs size="medium" maxItems={4} itemsBeforeCollapse={1} itemsAfterCollapse={2} items={[{label:"Home",href:"/"},{label:"Library",href:"#",iconName:"box-archive"},{label:"A",href:"#"},{label:"B",href:"#"},{label:"Page",current:true}]} />`
    },
    {
      name: "Tabs",
      exportName: "Tabs",
      importFrom: "@codeai/cads-react",
      description: "Tab Group \u2014 primary (underline) or secondary (contained) tablist. Tab Item is an internal building block.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "16496:3371",
        componentKey: "b49fe2d463645f88551c83bd8bff0ab56fcde35e"
      },
      props: [
        {
          name: "type",
          type: '"primary" | "secondary"',
          default: '"primary"',
          description: "primary = underline; secondary = contained."
        },
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"'
        },
        {
          name: "items",
          type: "TabsItem[]",
          required: true
        },
        { name: "value", type: "string" },
        { name: "defaultValue", type: "string" },
        { name: "onChange", type: "(value: string) => void" },
        { name: "onItemDismiss", type: "(value: string) => void" },
        { name: "aria-label", type: "string" }
      ],
      variableDependencies: [
        "--border-neutral-primary",
        "--border-selected-primary",
        "--border-selected-strong",
        "--text-selected-primary-inverse",
        "--text-neutral-quaternary",
        "--background-neutral-primary",
        "--background-neutral-secondary",
        "--background-neutral-tertiary"
      ],
      usageRules: [
        "Selection is owned by the group via value/defaultValue \u2014 do not expose isCurrent.",
        "Selected chrome uses selected tokens; never brand fills for the active tab.",
        "Tabs may not be used as standalone Tab Items \u2014 always via Tabs."
      ],
      example: `<Tabs type="primary" size="medium" defaultValue="a" items={[{value:"a",label:"Tab Label"},{value:"b",label:"Tab Label"}]} />`
    },
    {
      name: "Alert",
      exportName: "Alert",
      importFrom: "@codeai/cads-react",
      description: "Inline banner for contextual status within a page. Supports sentiment variants, icons, optional action and dismiss.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "2133:4160",
        componentKey: "dbe516b76486882d3508633715c5e4e999c183db"
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"large"'
        },
        {
          name: "sentiment",
          type: '"brand" | "pink" | "success" | "error" | "warning" | "info" | "neutral"',
          default: '"brand"'
        },
        { name: "children", type: "ReactNode" },
        { name: "hasIcon", type: "boolean", default: "true" },
        { name: "iconName", type: "FaIconName" },
        { name: "hasAction", type: "boolean", default: "false" },
        {
          name: "actionLabel",
          type: "ReactNode",
          default: '"Button"'
        },
        { name: "actionStartIconName", type: "FaIconName" },
        { name: "actionEndIconName", type: "FaIconName" },
        { name: "onAction", type: "() => void" },
        { name: "isDismissible", type: "boolean", default: "false" },
        { name: "onClose", type: "() => void" },
        { name: "fullWidth", type: "boolean", default: "true" }
      ],
      variableDependencies: [
        "--background-brand-light",
        "--border-brand-mid",
        "--radius-md",
        "--text-brand-primary-fixed"
      ],
      usageRules: [
        "Use for in-page contextual messaging \u2014 not temporary overlays (Toast) or page-level banners (NotificationBanner).",
        "Action is locked to outlined secondary; size follows Alert size. Always pass actionLabel (empty falls back to Button).",
        "Status sentiments supply default icons; override with iconName when needed."
      ],
      example: `<Alert sentiment="success" size="medium" isDismissible actionLabel="Undo" hasAction>Saved successfully.</Alert>`
    },
    {
      name: "Toast",
      exportName: "Toast",
      importFrom: "@codeai/cads-react",
      description: "Brief elevated notification for lightweight feedback. Dismisses automatically in product UIs; chrome matches Figma Toast.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "10587:14942",
        componentKey: "29c36f3d7ec051b81e7dc42a724d9097a680f2ee"
      },
      props: [
        {
          name: "sentiment",
          type: '"primary" | "pink" | "success" | "error" | "warning" | "info" | "neutral"',
          default: '"primary"'
        },
        { name: "children", type: "ReactNode" },
        { name: "hasIcon", type: "boolean", default: "true" },
        { name: "iconName", type: "FaIconName" },
        { name: "hasAction", type: "boolean", default: "false" },
        {
          name: "actionLabel",
          type: "ReactNode",
          default: '"Button"'
        },
        { name: "actionStartIconName", type: "FaIconName" },
        { name: "actionEndIconName", type: "FaIconName" },
        { name: "onAction", type: "() => void" },
        { name: "isDismissible", type: "boolean", default: "true" },
        { name: "onClose", type: "() => void" }
      ],
      variableDependencies: [
        "--background-brand-light",
        "--border-brand-mid",
        "--radius-md",
        "--shadow-lg"
      ],
      usageRules: [
        "Figma uses sentiment=primary for brand chrome (not brand).",
        "Action is locked to outlined secondary at small size. Always pass actionLabel.",
        "Toast is a presentational surface \u2014 host apps own queueing / auto-dismiss timing."
      ],
      example: `<Toast sentiment="success" hasAction actionLabel="View">This is a toast.</Toast>`
    },
    {
      name: "NotificationBanner",
      exportName: "NotificationBanner",
      importFrom: "@codeai/cads-react",
      description: "Persistent page-level banner with title, description, icon, and optional actions. Expanded cousin of Alert.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "10618:632",
        componentKey: "5f158e59f1188b62d671448be304f22d3a7bde42"
      },
      props: [
        {
          name: "sentiment",
          type: '"brand" | "pink" | "success" | "error" | "warning" | "info" | "neutral"',
          default: '"brand"'
        },
        {
          name: "fillStyle",
          type: '"none" | "color"',
          default: '"none"'
        },
        { name: "title", type: "ReactNode", required: true },
        { name: "description", type: "ReactNode", required: true },
        { name: "iconName", type: "FaIconName" },
        { name: "hasPrimaryAction", type: "boolean", default: "true" },
        { name: "hasSecondaryAction", type: "boolean", default: "true" },
        {
          name: "primaryActionLabel",
          type: "ReactNode",
          default: '"Button"'
        },
        {
          name: "secondaryActionLabel",
          type: "ReactNode",
          default: '"Button"'
        },
        { name: "onPrimaryAction", type: "() => void" },
        { name: "onSecondaryAction", type: "() => void" },
        { name: "isDismissible", type: "boolean", default: "false" },
        { name: "onClose", type: "() => void" },
        { name: "fullWidth", type: "boolean", default: "true" }
      ],
      variableDependencies: [
        "--background-neutral-primary",
        "--border-brand-primary",
        "--background-brand-light",
        "--radius-md"
      ],
      usageRules: [
        "title and description are required.",
        "fillStyle=none is the white surface; fillStyle=color tints the banner and switches primary action to inverse/secondary.",
        "Prefer NotificationBanner for persistent page messaging; Alert for compact inline status."
      ],
      example: `<NotificationBanner sentiment="error" fillStyle="color" title="Action required" description="Review the settings before continuing." />`
    },
    {
      name: "Tag",
      exportName: "Tag",
      importFrom: "@codeai/cads-react",
      description: "Compact badge / status label (distinct from selectable Chip). Optionally dismissible for removable filters.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "16433:2625",
        componentKey: "e4a964357b1eaedfab777db89058ccb4d528ec1c"
      },
      props: [
        {
          name: "color",
          type: '"neutral" | "brand" | "pink" | "orange" | "success" | "error" | "warning" | "info"',
          default: '"neutral"'
        },
        {
          name: "size",
          type: '"large" | "medium" | "small"',
          default: '"large"'
        },
        { name: "label", type: "ReactNode" },
        { name: "startIcon", type: "boolean", default: "true" },
        { name: "endIcon", type: "boolean", default: "false" },
        { name: "startIconName", type: "FaIconName" },
        { name: "endIconName", type: "FaIconName" },
        { name: "isDismissible", type: "boolean", default: "false" },
        { name: "onClose", type: "() => void" }
      ],
      variableDependencies: [
        "--background-neutral-tertiary",
        "--border-neutral-secondary",
        "--radius-sm"
      ],
      usageRules: [
        "Not the same as Chip (selectable). Use Tag for status/category labels.",
        "Use semantic colors \u2014 do not invent custom hues."
      ],
      example: `<Tag color="success" size="medium" label="Passed" />`
    },
    {
      name: "Tooltip",
      exportName: "Tooltip",
      importFrom: "@codeai/cads-react",
      description: "Small hover/focus overlay with brief contextual text on an inverse surface.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "1990:7125",
        componentKey: "8f604de25a1742f20b6e6f1dd3680bdfdbda2234"
      },
      props: [
        { name: "title", type: "ReactNode", required: true },
        { name: "children", type: "ReactElement", required: true },
        {
          name: "caretPlacement",
          type: '"top" | "bottom" | "left" | "right"',
          default: '"top"',
          description: "Caret edge on the bubble; also positions the tooltip relative to the trigger."
        },
        { name: "hasCaret", type: "boolean", default: "true" },
        { name: "startIcon", type: "boolean", default: "false" },
        { name: "iconName", type: "FaIconName | string" }
      ],
      variableDependencies: [
        "--background-neutral-primary-inverse",
        "--text-neutral-primary-inverse",
        "--radius-sm",
        "--shadow-md",
        "--text-body-sm"
      ],
      usageRules: [
        "Child must be able to hold a ref (forwardRef element).",
        "Prefer supplementary hints \u2014 avoid sole source of critical info.",
        "Use caretPlacement only \u2014 it both places the caret and positions the tooltip."
      ],
      example: `<Tooltip title="Save" caretPlacement="top"><Button>Save</Button></Tooltip>`
    },
    {
      name: "Popover",
      exportName: "Popover",
      importFrom: "@codeai/cads-react",
      description: "Dismissible anchored card with title, body, optional image/custom content, stepper, and actions.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "16426:681",
        componentKey: "b524d42ecd329068d1cfa45de2b79e874f9f6cf0"
      },
      props: [
        {
          name: "content",
          type: '"textOnly" | "textImage" | "custom"',
          default: '"textOnly"'
        },
        {
          name: "caretPlacement",
          type: '"bottomLeft" | "bottomCenter" | "bottomRight" | "topLeft" | "topCenter" | "topRight" | "leftTop" | "leftCenter" | "leftBottom" | "rightTop" | "rightCenter" | "rightBottom"',
          default: '"bottomLeft"'
        },
        { name: "hasCaret", type: "boolean", default: "true" },
        { name: "title", type: "ReactNode" },
        { name: "body", type: "ReactNode" },
        { name: "image", type: "ReactNode" },
        { name: "customContent", type: "ReactNode" },
        { name: "hasActionRow", type: "boolean", default: "true" },
        { name: "hasStepper", type: "boolean", default: "true" },
        { name: "stepperText", type: "ReactNode", default: '"1/3"' },
        { name: "hasPrimaryAction", type: "boolean", default: "true" },
        { name: "hasSecondaryAction", type: "boolean", default: "true" },
        { name: "primaryActionLabel", type: "ReactNode", default: '"Next"' },
        { name: "secondaryActionLabel", type: "ReactNode", default: '"Back"' },
        { name: "isDismissible", type: "boolean", default: "true" },
        { name: "onClose", type: "() => void" },
        { name: "children", type: "ReactElement | ReactNode" },
        { name: "surfaceOnly", type: "boolean" }
      ],
      variableDependencies: [
        "--background-neutral-primary",
        "--border-neutral-primary",
        "--radius-lg",
        "--shadow-md"
      ],
      usageRules: [
        "Well suited to guided walkthroughs (stepper + Back/Next).",
        "Pass a trigger child for anchored mode, or use surfaceOnly for static previews."
      ],
      example: `<Popover content="textOnly" title="Tour step" body="Learn about this control." stepperText="1/3" surfaceOnly />`
    },
    {
      name: "Drawer",
      exportName: "Drawer",
      importFrom: "@codeai/cads-react",
      description: "Bottom sheet that slides over page content without dimming or blocking it.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "10708:17779",
        componentKey: "b2cd3a35f20d344f38d677d0dfd992d64f503b87"
      },
      props: [
        {
          name: "type",
          type: '"textOnly" | "customContent"',
          default: '"textOnly"'
        },
        { name: "title", type: "ReactNode" },
        { name: "description", type: "ReactNode" },
        { name: "hasDescription", type: "boolean", default: "true" },
        { name: "hasActionRow", type: "boolean", default: "true" },
        { name: "primaryActionLabel", type: "ReactNode", default: '"Button"' },
        {
          name: "secondaryActionLabel",
          type: "ReactNode",
          default: '"Button"'
        },
        { name: "isDismissible", type: "boolean", default: "true" },
        { name: "onClose", type: "() => void" },
        { name: "open", type: "boolean", default: "false" },
        { name: "children", type: "ReactNode" },
        { name: "surfaceOnly", type: "boolean" }
      ],
      variableDependencies: [
        "--background-neutral-secondary",
        "--border-neutral-primary",
        "--shadow-md",
        "--text-heading-lg"
      ],
      usageRules: [
        "More prominent than inline content, less disruptive than a modal \u2014 use sparingly.",
        "Does not dim the page (no backdrop)."
      ],
      example: `<>
  <Button onClick={() => setOpen(true)}>Open drawer</Button>
  <Drawer open={open} onClose={() => setOpen(false)} type="textOnly" title="This is a heading" description="This is descriptive text." />
</>`
    },
    {
      name: "Dialog",
      exportName: "Dialog",
      importFrom: "@codeai/cads-react",
      description: "Blocking confirmation overlay with short title, message, and usually two actions.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "3453:3938",
        componentKey: "75feff93418c9804cbd3075e8a7f85bce1a5ff1e"
      },
      props: [
        {
          name: "type",
          type: '"default" | "iconTop" | "customContent"',
          default: '"default"'
        },
        { name: "title", type: "ReactNode" },
        { name: "description", type: "ReactNode" },
        { name: "hasImage", type: "boolean", default: "false" },
        { name: "image", type: "ReactNode" },
        {
          name: "topIconName",
          type: "FaIconName | string",
          default: '"smile"',
          description: "Icon for the floating badge when type is iconTop (Figma shortcode; smile \u2192 face-smile)."
        },
        { name: "hasSecondaryAction", type: "boolean", default: "true" },
        { name: "primaryActionLabel", type: "ReactNode", default: '"Button"' },
        {
          name: "secondaryActionLabel",
          type: "ReactNode",
          default: '"Button"'
        },
        { name: "isDismissable", type: "boolean", default: "true" },
        { name: "onClose", type: "() => void" },
        { name: "open", type: "boolean", default: "false" },
        { name: "children", type: "ReactNode" },
        { name: "surfaceOnly", type: "boolean" }
      ],
      variableDependencies: [
        "--background-neutral-primary",
        "--background-brand-primary",
        "--radius-xl",
        "--shadow-lg",
        "--font-heading",
        "--text-heading-xl"
      ],
      usageRules: [
        "Use for short decisions \u2014 prefer Modal for rich interactive content.",
        "Spelling isDismissable matches Figma."
      ],
      example: `<>
  <Button onClick={() => setOpen(true)}>Open dialog</Button>
  <Dialog open={open} onClose={() => setOpen(false)} type="default" title="Dialog Title" description="Confirm this action." />
</>`
    },
    {
      name: "Modal",
      exportName: "Modal",
      importFrom: "@codeai/cads-react",
      description: "Blocking overlay for rich interactive content (forms, media, multi-step flows).",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "2190:8284",
        componentKey: "0fe4d86d9d16ed81da4f995fc1e8fae90f7cf0e5"
      },
      props: [
        {
          name: "type",
          type: '"default" | "verticalImage" | "horizontalImage"',
          default: '"default"'
        },
        { name: "title", type: "ReactNode" },
        { name: "body", type: "ReactNode" },
        { name: "image", type: "ReactNode" },
        { name: "children", type: "ReactNode" },
        { name: "hasSecondaryAction", type: "boolean", default: "true" },
        { name: "primaryActionLabel", type: "ReactNode", default: '"Button"' },
        {
          name: "secondaryActionLabel",
          type: "ReactNode",
          default: '"Button"'
        },
        { name: "isDismissable", type: "boolean", default: "true" },
        { name: "onClose", type: "() => void" },
        { name: "open", type: "boolean", default: "false" },
        { name: "surfaceOnly", type: "boolean" }
      ],
      variableDependencies: [
        "--background-neutral-primary",
        "--background-neutral-tertiary",
        "--radius-xl",
        "--shadow-lg",
        "--text-heading-lg"
      ],
      usageRules: [
        "Unlike Dialog, Modal holds richer layouts with a header bar and footer actions.",
        "Spelling isDismissable matches Figma."
      ],
      example: `<>
  <Button onClick={() => setOpen(true)}>Open modal</Button>
  <Modal open={open} onClose={() => setOpen(false)} type="default" title="Title" body="Modal body" />
</>`
    },
    {
      name: "FaIcon",
      exportName: "FaIcon",
      importFrom: "@codeai/cads-react/icons",
      description: "Font Awesome 7 Pro (solid/regular) / Brands webfont glyph.",
      props: [
        { name: "name", type: "FaIconName | FaBrandIconName", required: true },
        {
          name: "family",
          type: '"solid" | "regular" | "brands"',
          default: '"solid"'
        },
        {
          name: "size",
          type: '"inherit" | "extraSmall" | "small" | "medium" | "large"',
          default: '"medium"'
        },
        { name: "title", type: "string" }
      ],
      variableDependencies: ["--font-fa-pro", "--font-fa-brands"],
      usageRules: [
        "Import @codeai/cads-react/icons/fonts.css once at app root.",
        "Internal FA Pro license \u2014 do not publish fonts publicly."
      ],
      example: `<FaIcon name="arrow-right" size="medium" />`
    }
  ]
};
var cads_manifest_default = cadsManifest;

export { CADS_FIGMA_FILE_KEY, cadsManifest, cads_manifest_default as default };
//# sourceMappingURL=cads.manifest.js.map
//# sourceMappingURL=cads.manifest.js.map