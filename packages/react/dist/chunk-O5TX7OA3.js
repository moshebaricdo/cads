// src/manifest/cads.manifest.ts
var CADS_FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";
var cadsManifest = {
  version: "0.1.0",
  package: "@codeai/cads-react",
  figmaFileKey: CADS_FIGMA_FILE_KEY,
  components: [
    {
      name: "Button",
      exportName: "Button",
      importFrom: "@codeai/cads-react",
      description: "Primary interactive button with CADS variants, tones, and L\u2013XS size scale.",
      figma: { fileKey: CADS_FIGMA_FILE_KEY },
      props: [
        {
          name: "variant",
          type: '"primary" | "secondary" | "tertiary"',
          default: '"secondary"'
        },
        {
          name: "tone",
          type: '"brand" | "neutral" | "white" | "destructive"',
          default: '"neutral"'
        },
        {
          name: "size",
          type: '"l" | "m" | "s" | "xs"',
          default: '"m"',
          description: "Control heights: 48 / 40 / 32 / 24"
        },
        { name: "iconName", type: "FaIconName", description: "Optional FA Pro icon" },
        { name: "iconPosition", type: '"start" | "end"', default: '"start"' },
        { name: "disabled", type: "boolean" },
        { name: "fullWidth", type: "boolean" },
        { name: "children", type: "ReactNode" }
      ],
      variableDependencies: [
        "--ds-background-brand-primary",
        "--ds-background-selected-primary",
        "--ds-border-focused-primary",
        "--control-height-m",
        "--radius-sm"
      ],
      usageRules: [
        "Use tone=brand + variant=primary for primary CTAs.",
        "Do not invent variants outside the prop types.",
        "Use --ds-* variables only \u2014 never hard-coded hex."
      ],
      example: `<Button variant="primary" tone="brand" size="m">Continue</Button>`
    },
    {
      name: "TextField",
      exportName: "TextField",
      importFrom: "@codeai/cads-react",
      description: "Outlined text input with shared control heights.",
      figma: { fileKey: CADS_FIGMA_FILE_KEY },
      props: [
        { name: "size", type: '"l" | "m" | "s" | "xs"', default: '"m"' },
        { name: "label", type: "string" },
        { name: "helperText", type: "ReactNode" },
        { name: "error", type: "boolean" },
        { name: "disabled", type: "boolean" }
      ],
      variableDependencies: [
        "--ds-border-focused-primary",
        "--ds-border-neutral-primary",
        "--control-height-m"
      ],
      usageRules: ["Prefer size prop over custom height styles."],
      example: `<TextField label="Email" size="m" />`
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
        { name: "size", type: '"m" | "s"', default: '"m"' }
      ],
      variableDependencies: ["--ds-background-selected-primary"],
      usageRules: [
        "Checked fill uses selected tokens, not brand fills."
      ],
      example: `<Checkbox label="Remember me" />`
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
        { name: "size", type: '"m" | "s"', default: '"m"' }
      ],
      variableDependencies: ["--ds-background-selected-primary"],
      usageRules: ["Group with MUI RadioGroup when needed."],
      example: `<Radio label="Option A" value="a" />`
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
          default: '"neutral"'
        },
        { name: "size", type: '"m" | "s"', default: '"m"' },
        { name: "label", type: "ReactNode", required: true },
        { name: "iconName", type: "FaIconName" }
      ],
      variableDependencies: ["--ds-background-brand-light", "--radius-round"],
      usageRules: ["Use semantic tones \u2014 do not invent custom colors."],
      example: `<Tag tone="success" label="Passed" />`
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
        { name: "placement", type: "TooltipProps['placement']" }
      ],
      variableDependencies: [
        "--ds-background-neutral-primary-inverse",
        "--ds-text-neutral-primary-inverse"
      ],
      usageRules: ["Child must be able to hold a ref (forwardRef element)."],
      example: `<Tooltip title="Save"><Button>Save</Button></Tooltip>`
    },
    {
      name: "FaIcon",
      exportName: "FaIcon",
      importFrom: "@codeai/cads-react/icons",
      description: "Font Awesome 7 Pro / Brands webfont glyph.",
      props: [
        { name: "name", type: "FaIconName | FaBrandIconName", required: true },
        { name: "family", type: '"solid" | "brands"', default: '"solid"' },
        { name: "size", type: '"inherit" | "xs" | "s" | "m" | "l"', default: '"m"' },
        { name: "title", type: "string" }
      ],
      variableDependencies: ["--font-fa-pro", "--font-fa-brands"],
      usageRules: [
        "Import @codeai/cads-react/icons/fonts.css once at app root.",
        "Internal FA Pro license \u2014 do not publish fonts publicly."
      ],
      example: `<FaIcon name="arrow-right" size="m" />`
    }
  ]
};
var cads_manifest_default = cadsManifest;

export {
  CADS_FIGMA_FILE_KEY,
  cadsManifest,
  cads_manifest_default
};
//# sourceMappingURL=chunk-O5TX7OA3.js.map