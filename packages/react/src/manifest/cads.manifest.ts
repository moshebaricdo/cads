/**
 * Machine-readable CADS component catalog for AI agents and docs.
 * Versioned with the package; Figma node IDs filled as components are mapped.
 */
export interface CadsPropDef {
  name: string;
  type: string;
  default?: string;
  description?: string;
  required?: boolean;
}

export interface CadsComponentManifest {
  name: string;
  exportName: string;
  importFrom: string;
  description: string;
  /** Figma component key / node id when mapped (Code Connect substitute). */
  figma?: {
    fileKey: string;
    /** Node id in Figma URL form (e.g. "1234:5678"). */
    nodeId?: string;
    componentKey?: string;
  };
  props: CadsPropDef[];
  variableDependencies: string[];
  usageRules: string[];
  example: string;
}

export const CADS_FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";

export const cadsManifest: {
  version: string;
  package: string;
  figmaFileKey: string;
  components: CadsComponentManifest[];
} = {
  version: "0.1.0",
  package: "@codeai/cads-react",
  figmaFileKey: CADS_FIGMA_FILE_KEY,
  components: [
    {
      name: "Button",
      exportName: "Button",
      importFrom: "@codeai/cads-react",
      description:
        "Triggers an action with a single tap or click. Contained, outlined, and text styles across primary, secondary, tertiary, and error colors.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "15724:18791",
        componentKey: "2507b18076b4066c6ff738539115b36a798fd707",
      },
      props: [
        {
          name: "variant",
          type: '"contained" | "outlined" | "text"',
          default: '"contained"',
        },
        {
          name: "color",
          type: '"primary" | "secondary" | "tertiary" | "error"',
          default: '"primary"',
        },
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Control heights: 48 / 40 / 32 / 24",
        },
        {
          name: "iconOnly",
          type: "boolean",
          description: "Square icon-only geometry; inferred when no children",
        },
        { name: "startIconName", type: "FaIconName" },
        { name: "endIconName", type: "FaIconName" },
        { name: "disabled", type: "boolean" },
        { name: "fullWidth", type: "boolean" },
        { name: "children", type: "ReactNode" },
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
        "--text-disabled-neutral-inverse",
      ],
      usageRules: [
        "Use variant=contained + color=primary for primary CTAs (brand fill).",
        "Contained secondary uses --background-neutral-primary-inverse; outlined primary uses --border-neutral-solid.",
        "Contained disabled text uses --text-disabled-neutral-inverse (solid fill).",
        "color=tertiary is Figma-valid only for text + iconOnly; other combos warn and fall back to secondary.",
        "Use semantic color CSS vars only — never hard-coded hex. No --ds- prefix.",
      ],
      example: `<Button variant="contained" color="primary" size="medium">Continue</Button>`,
    },
    {
      name: "SegmentedButton",
      exportName: "SegmentedButton",
      importFrom: "@codeai/cads-react",
      description:
        "A group of connected buttons for choosing one option from a small mutually exclusive set. Selected segment uses selected tokens.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "8027:2099",
        componentKey: "bf599e1bc1d1e651be6aab5bf90ac6a7c26dcfd1",
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
        },
        { name: "value", type: "string" },
        { name: "defaultValue", type: "string" },
        { name: "onChange", type: "(value: string) => void" },
        {
          name: "options",
          type: "SegmentedButtonOption[]",
          required: true,
          description:
            "Maps Block label / leftIcon / rightIcon / show*Icon / isActive via value.",
        },
        { name: "iconOnly", type: "boolean", description: "Square icon-only segments" },
        { name: "disabled", type: "boolean" },
        { name: "aria-label", type: "string" },
      ],
      variableDependencies: [
        "--background-selected-primary",
        "--border-selected-primary",
        "--text-selected-primary",
        "--border-neutral-secondary",
        "--control-height-medium",
        "--transition-colors",
      ],
      usageRules: [
        "Use selected tokens (fill + border + text) for the active segment — never brand fills for selected chrome.",
        "Segments are connected with -1px overlap; first/last get --radius-sm on outer corners only.",
        "Labels are always Body Semi Bold — do not invent labelStyle / thick|thin.",
        "Figma Group exposes color=Primary only; unselected border is always --border-neutral-secondary (not a consumer prop).",
        "Figma Block-only: position (first|middle|last), state, isActive — derived in code from options index / value / CSS / disabled.",
        "Prefer the group API; Segmented Button Block (8000:4554) is an internal building block.",
      ],
      example: `<SegmentedButton aria-label="View" options={[{value:"list",label:"List"},{value:"grid",label:"Grid"}]} defaultValue="list" />`,
    },
    {
      name: "IconToggle",
      exportName: "IconToggle",
      importFrom: "@codeai/cads-react",
      description:
        "Icon-only binary on/off control. Optional label + secondToggle covers Figma Icon Toggle + Label (up to 2 toggles).",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "3710:461",
        componentKey: "d08929d02e63b3b286690e87d791199e4545126f",
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
        },
        {
          name: "color",
          type: '"primary" | "secondary" | "brand" | "success" | "error"',
          default: '"brand"',
        },
        { name: "iconName", type: "FaIconName", required: true },
        { name: "pressed", type: "boolean", description: "Controlled on/off (Figma isOn)" },
        { name: "defaultPressed", type: "boolean" },
        { name: "onPressedChange", type: "(pressed: boolean) => void" },
        {
          name: "label",
          type: "ReactNode",
          description: "When set, renders Figma Icon Toggle + Label layout",
        },
        {
          name: "secondToggle",
          type: "{ iconName; color?; pressed?; defaultPressed?; onPressedChange?; aria-label; disabled? }",
          description:
            "Figma hasTwoToggles — second toggle with its own icon/color/aria-label (e.g. thumbs-down + error)",
        },
        {
          name: "exclusive",
          type: "boolean",
          default: "false",
          description:
            "With secondToggle: mutual exclusion (thumbs up/down). Figma does not specify exclusive — default is independent.",
        },
        { name: "disabled", type: "boolean" },
        { name: "aria-label", type: "string" },
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
        "--transition-colors",
      ],
      usageRules: [
        "Off = FA Regular + quaternary text; on = FA Solid + color on-token.",
        "Hover/press surfaces are color-specific (brand-light, error-light, etc.) — never a generic grey for all colors.",
        "Standalone and labeled Figma sets map to one React component (secondToggle for dual).",
        "In dual mode, set color per toggle: parent color = first; secondToggle.color = second (e.g. success + error).",
        "Dual toggles are independent unless exclusive; Figma has no exclusive prop.",
        "Always provide aria-label when there is no visible label.",
      ],
      example: `<IconToggle label="Was this helpful?" iconName="thumbs-up" color="success" exclusive aria-label="Thumbs up" secondToggle={{ iconName: "thumbs-down", color: "error", "aria-label": "Thumbs down" }} />`,
    },
    {
      name: "FieldWrapper",
      exportName: "FieldWrapper",
      importFrom: "@codeai/cads-react",
      description:
        "Generic container that pairs any input with a label and helper text, including validation messaging for errors and warnings.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "15857:99804",
        componentKey: "a76313f790928233bb8afabe35bd6f76f6e9a473",
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
        },
        {
          name: "sentiment",
          type: '"default" | "success" | "warning" | "error"',
          default: '"default"',
        },
        { name: "label", type: "ReactNode" },
        { name: "helperText", type: "ReactNode" },
        { name: "helperIconName", type: "FaIconName" },
        { name: "showHelper", type: "boolean", default: "true" },
        { name: "children", type: "ReactNode", required: true },
        { name: "disabled", type: "boolean" },
        { name: "htmlFor", type: "string" },
      ],
      variableDependencies: [
        "--text-neutral-primary",
        "--text-neutral-tertiary",
        "--text-success-primary-fixed",
        "--text-warning-primary-fixed",
        "--text-error-primary-fixed",
      ],
      usageRules: [
        "Nest any CADS control in children (TextInput, Dropdown, Checkbox, etc.).",
        "Warning helper text stays tertiary; only the icon uses warning color.",
        "Non-default sentiments always show helper when helperText is set.",
      ],
      example: `<FieldWrapper label="Email" helperText="We never share this" sentiment="default"><TextInput placeholder="you@example.com" /></FieldWrapper>`,
    },
    {
      name: "TextInput",
      exportName: "TextInput",
      importFrom: "@codeai/cads-react",
      description:
        "Single-line field or multiline area with Field Wrapper label/helper. Figma name: Text Input.",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "16176:4884",
        componentKey: "ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4",
      },
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
        },
        {
          name: "color",
          type: '"primary" | "secondary"',
          default: '"primary"',
          description: "primary = solid border; secondary = soft border",
        },
        {
          name: "multiline",
          type: "boolean",
          default: "false",
          description: "Figma type=area when true",
        },
        { name: "label", type: "string" },
        { name: "helperText", type: "ReactNode" },
        { name: "helperIconName", type: "FaIconName" },
        {
          name: "sentiment",
          type: '"default" | "success" | "warning" | "error"',
          default: '"default"',
        },
        { name: "error", type: "boolean" },
        { name: "readOnly", type: "boolean" },
        { name: "disabled", type: "boolean" },
        { name: "placeholder", type: "string" },
        { name: "value", type: "string" },
        { name: "defaultValue", type: "string" },
        { name: "rows", type: "number" },
      ],
      variableDependencies: [
        "--border-neutral-solid",
        "--border-neutral-secondary",
        "--border-focused-primary",
        "--border-error-primary",
        "--text-neutral-placeholder",
        "--control-height-medium",
        "--radius-sm",
      ],
      usageRules: [
        "Prefer TextInput over the deprecated TextField alias.",
        "Figma type=field|area maps to multiline={false|true}.",
        "extraSmall field height uses the shared 24px control scale (Figma building block is 22px).",
        "Do not invent floating labels — label is always above via Field Wrapper.",
      ],
      example: `<TextInput label="Email" size="medium" placeholder="you@example.com" helperText="Required" />`,
    },
    {
      name: "Dropdown",
      exportName: "Dropdown",
      importFrom: "@codeai/cads-react",
      description:
        "Reveals options in a collapsible panel. Works as a form select (role=input) or as an action menu (role=action).",
      figma: {
        fileKey: CADS_FIGMA_FILE_KEY,
        nodeId: "15857:100676",
        componentKey: "d3660d988bcb4702c24ce921128e32cadb6618db",
      },
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
        },
        {
          name: "menuType",
          type: '"icon" | "checklist"',
          default: '"icon"',
          description: "checklist is input-only in Figma",
        },
        {
          name: "menuPlacement",
          type: '"bottomLeft" | "bottomRight" | "topLeft" | "topRight"',
          default: '"bottomLeft"',
        },
        {
          name: "width",
          type: "string",
          default: '"hug"',
          description:
            'Input-role only. "hug" (default) = static width from longest option/placeholder; "full" = 100%; or any CSS length (12rem, 240px, 50%). Numbers are px.',
        },
        {
          name: "options",
          type: "DropdownOption[]",
          required: true,
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
        { name: "aria-label", type: "string" },
      ],
      variableDependencies: [
        "--border-neutral-solid",
        "--border-neutral-primary",
        "--background-selected-primary",
        "--text-selected-primary",
        "--shadow-md",
        "--radius-sm",
        "--background-brand-primary",
      ],
      usageRules: [
        "role=input composes Field Wrapper + Dropdown Button; role=action reuses Button.",
        "menuType=checklist is input-only; action menus use icon items (optional destructive).",
        'Input-role width defaults to hug (static width from the longest option/placeholder — selection does not resize the field). Use "full" or a CSS length otherwise.',
        "Selected menu items use selected tokens — never brand fills.",
        "Dropdown Button / Menu List / Menu Item are internal — do not import standalone.",
      ],
      example: `<Dropdown role="input" label="Sort" width="hug" options={[{value:"a",label:"Option A"},{value:"b",label:"Option B"}]} defaultValue="a" />`,
    },
    {
      name: "Checkbox",
      exportName: "Checkbox",
      importFrom: "@codeai/cads-react",
      description: "Checkbox using selected-fill recipe when checked.",
      figma: { fileKey: CADS_FIGMA_FILE_KEY },
      props: [
        { name: "label", type: "ReactNode" },
        { name: "checked", type: "boolean" },
        { name: "size", type: '"medium" | "small"', default: '"medium"' },
      ],
      variableDependencies: ["--background-selected-primary"],
      usageRules: ["Checked fill uses selected tokens, not brand fills."],
      example: `<Checkbox label="Remember me" />`,
    },
    {
      name: "Radio",
      exportName: "Radio",
      importFrom: "@codeai/cads-react",
      description: "Radio control using selected-fill recipe when checked.",
      figma: { fileKey: CADS_FIGMA_FILE_KEY },
      props: [
        { name: "label", type: "ReactNode" },
        { name: "checked", type: "boolean" },
        { name: "value", type: "string" },
        { name: "size", type: '"medium" | "small"', default: '"medium"' },
      ],
      variableDependencies: ["--background-selected-primary"],
      usageRules: ["Group with MUI RadioGroup when needed."],
      example: `<Radio label="Option A" value="a" />`,
    },
    {
      name: "Tag",
      exportName: "Tag",
      importFrom: "@codeai/cads-react",
      description: "Compact badge / chip with semantic tones.",
      figma: { fileKey: CADS_FIGMA_FILE_KEY },
      props: [
        {
          name: "tone",
          type: '"neutral" | "brand" | "success" | "warning" | "error" | "info"',
          default: '"neutral"',
        },
        { name: "size", type: '"medium" | "small"', default: '"medium"' },
        { name: "label", type: "ReactNode", required: true },
        { name: "iconName", type: "FaIconName" },
      ],
      variableDependencies: ["--background-brand-light", "--radius-round"],
      usageRules: ["Use semantic tones — do not invent custom colors."],
      example: `<Tag tone="success" label="Passed" />`,
    },
    {
      name: "Tooltip",
      exportName: "Tooltip",
      importFrom: "@codeai/cads-react",
      description: "Hover/focus tooltip on inverse surface.",
      figma: { fileKey: CADS_FIGMA_FILE_KEY },
      props: [
        { name: "title", type: "ReactNode", required: true },
        { name: "children", type: "ReactElement", required: true },
        { name: "placement", type: "TooltipProps['placement']" },
      ],
      variableDependencies: [
        "--background-neutral-primary-inverse",
        "--text-neutral-primary-inverse",
      ],
      usageRules: ["Child must be able to hold a ref (forwardRef element)."],
      example: `<Tooltip title="Save"><Button>Save</Button></Tooltip>`,
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
          default: '"solid"',
        },
        {
          name: "size",
          type: '"inherit" | "extraSmall" | "small" | "medium" | "large"',
          default: '"medium"',
        },
        { name: "title", type: "string" },
      ],
      variableDependencies: ["--font-fa-pro", "--font-fa-brands"],
      usageRules: [
        "Import @codeai/cads-react/icons/fonts.css once at app root.",
        "Internal FA Pro license — do not publish fonts publicly.",
      ],
      example: `<FaIcon name="arrow-right" size="medium" />`,
    },
  ],
};

export default cadsManifest;
