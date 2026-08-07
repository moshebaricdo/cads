/**
 * Pass 1 DSCO → CADS component swap rules (Waves A–E).
 *
 * Spec: docs/DSCO_TO_CADS_COMPONENT_MAP.md
 * Harvested via Figma import-by-key against `(OLD) DSCO Components`
 * and `CodeAI Design System (CADS)`.
 */

import { cadsComponents } from "./cadsCatalog";

/** Apply remapped props to a nested instance matched by name after swap. */
export interface NestedApplyRule {
  /** Match INSTANCE name or parent component-set name (case-insensitive includes). */
  matchNames: string[];
  propNames?: Record<string, string>;
  variantValues?: Record<string, Record<string, string>>;
  forceVariants?: Record<string, string>;
  forceContent?: Record<string, string | boolean>;
  /**
   * Named post-processors that read source capture and write nested axes
   * (status merge, startsFrom from Type, etc.).
   */
  special?: "checkboxStatus" | "radioSelected" | "toggleOn" | "sliderStartsFrom";
}

/** Best-effort TEXT write inside a SLOT / named frame after swap. */
export interface SlotTextRule {
  /** Node name to find (case-insensitive includes), e.g. customContent / Field label. */
  matchName: string;
  /** Source TEXT prop base-name (before `#…`). */
  fromProp?: string;
  /** Use pre-swap captured free-text instead of a prop. */
  useCapturedText?: boolean;
}

export interface ComponentSwapRule {
  /** Published DSCO component-set key. */
  dscoKey: string;
  dscoName: string;
  /** Published CADS component-set name (resolved to key via catalog). */
  cadsName: string;
  /**
   * Forced variant overrides applied after name/value remaps
   * (e.g. Destructive Button → color=error).
   */
  forceVariants?: Record<string, string>;
  /** Forced TEXT/BOOLEAN props after swap. */
  forceContent?: Record<string, string | boolean>;
  /**
   * Source prop base-name (before `#…`) → target prop base-name.
   * Variant axes use the axis name as both source and target unless remapped.
   */
  propNames?: Record<string, string>;
  /** Per-axis value remaps (source value → target value). Case-sensitive on source. */
  variantValues?: Record<string, Record<string, string>>;
  /**
   * When true, read the first TEXT descendant's characters before swap and
   * write them to `textCaptureTarget` after swap (for components whose label
   * isn't a shared TEXT property key).
   */
  captureText?: boolean;
  textCaptureTarget?: string;
  /**
   * When source boolean/Yes-No prop is false, swap to this alternate CADS set
   * (Checkbox/Radio/Toggle Show* → bare control).
   */
  retargetWhenFalse?: {
    sourceProp: string;
    cadsName: string;
  };
  nestedApply?: NestedApplyRule[];
  slotText?: SlotTextRule[];
  /**
   * Named multi-axis remaps that don't fit propNames tables.
   */
  special?:
    | "chipColorSelected"
    | "segmentedBlockActive"
    | "iconToggleIsOn"
    | "menuItemType"
    | "menuListType"
    | "actionDropdown"
    | "tooltipType"
    | "popoverCaret"
    | "drawerType"
    | "dialogType"
    | "modalType"
    | "breadcrumbLink"
    | "tabCurrent"
    | "sliderControls"
    | "checkboxStatus"
    | "dropdownFieldColor";
}

// ── Shared value tables ──────────────────────────────────────────────

const SIZE_LMXS: Record<string, string> = {
  L: "large",
  M: "medium",
  S: "small",
  XS: "extraSmall",
  large: "large",
  medium: "medium",
  small: "small",
  extraSmall: "extraSmall",
};

const STATE_DEFAULT: Record<string, string> = {
  Default: "default",
  default: "default",
  Hover: "hover",
  hover: "hover",
  Focus: "focus",
  focus: "focus",
  Focused: "focus",
  focused: "focus",
  Pressed: "press",
  pressed: "press",
  Press: "press",
  press: "press",
  Disabled: "disabled",
  disabled: "disabled",
  Visited: "visited",
  visited: "visited",
  Error: "error",
  error: "error",
  "Read Only": "readOnly",
  "Read-only": "readOnly",
  ReadOnly: "readOnly",
  readOnly: "readOnly",
  Activated: "press",
  activated: "press",
};

/** Checkbox Blocks uses focused/pressed spelling. */
const STATE_CHECKBOX_BLOCK: Record<string, string> = {
  ...STATE_DEFAULT,
  Focused: "focused",
  focused: "focused",
  Pressed: "pressed",
  pressed: "pressed",
};

const YES_NO: Record<string, string> = {
  Yes: "yes",
  No: "no",
  yes: "yes",
  no: "no",
  true: "yes",
  false: "no",
};

const YES_NO_CAP: Record<string, string> = {
  Yes: "Yes",
  No: "No",
  yes: "Yes",
  no: "No",
  true: "Yes",
  false: "No",
};

const THICK_THIN: Record<string, string> = {
  Thick: "thick",
  Thin: "thin",
  thick: "thick",
  thin: "thin",
};

const MEANING_TO_SENTIMENT: Record<string, string> = {
  Primary: "brand",
  Brand: "brand",
  Success: "success",
  Danger: "error",
  Error: "error",
  Warning: "warning",
  Info: "info",
  Gray: "neutral",
  Aqua: "brand",
};

const FIELD_COLOR: Record<string, string> = {
  Black: "primary",
  White: "primary",
  Gray: "secondary",
  Grey: "secondary",
  primary: "primary",
  secondary: "secondary",
};

const DROPDOWN_BTN_COLOR: Record<string, string> = {
  Black: "primary",
  White: "secondary",
  Grey: "secondary",
  Gray: "secondary",
  primary: "primary",
  secondary: "secondary",
};

const ICON_TOGGLE_COLOR: Record<string, string> = {
  Gray: "primary",
  Black: "secondary",
  White: "secondary",
  Teal: "brand",
  Negative: "error",
  Affirmative: "success",
  primary: "primary",
  secondary: "secondary",
  brand: "brand",
  error: "error",
  success: "success",
};

const POSITION: Record<string, string> = {
  First: "first",
  Middle: "middle",
  Last: "last",
  first: "first",
  middle: "middle",
  last: "last",
};

const SIZE_TABLE = { size: SIZE_LMXS, Size: SIZE_LMXS };
const STATE_TABLE = { state: STATE_DEFAULT, State: STATE_DEFAULT };

function sizeStateTables(
  extra?: Record<string, Record<string, string>>,
): Record<string, Record<string, string>> {
  return { ...SIZE_TABLE, ...STATE_TABLE, ...extra };
}

// ── Rules ────────────────────────────────────────────────────────────

/** Published DSCO keys that support one-click swap with prop remapping. */
export const componentSwapRules: ComponentSwapRule[] = [
  // ═══ Wave A/B (shipped + fix) ═══
  {
    dscoKey: "cbc707599ceb83eaa1cee51d698831793e0ebde6",
    dscoName: "Button",
    cadsName: "Button",
    propNames: {
      "startIcon Name": "startIconName",
      "endIcon Name": "endIconName",
      Size: "size",
      State: "state",
      Color: "color",
      Variant: "variant",
      "Icon Only": "iconOnly",
      IconOnly: "iconOnly",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
      color: {
        primary: "primary",
        secondary: "secondary",
        tertiary: "tertiary",
        "white (deprecated)": "secondary",
        white: "secondary",
        error: "error",
        Primary: "primary",
        Secondary: "secondary",
        Tertiary: "tertiary",
        Error: "error",
      },
      Color: {
        primary: "primary",
        secondary: "secondary",
        tertiary: "tertiary",
        "white (deprecated)": "secondary",
        white: "secondary",
        Primary: "primary",
        Secondary: "secondary",
        Tertiary: "tertiary",
      },
      variant: {
        contained: "contained",
        outlined: "outlined",
        text: "text",
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
        filled: "contained",
        Filled: "contained",
      },
      Variant: {
        contained: "contained",
        outlined: "outlined",
        text: "text",
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
        filled: "contained",
        Filled: "contained",
      },
      iconOnly: YES_NO_CAP,
      "Icon Only": YES_NO_CAP,
    },
  },
  {
    dscoKey: "0478bc835a0e7e1593fc0e6f3044f54730b66861",
    dscoName: "Destructive Button",
    cadsName: "Button",
    forceVariants: { color: "error" },
    propNames: {
      "startIcon Name": "startIconName",
      "endIcon Name": "endIconName",
      Size: "size",
      State: "state",
      Color: "color",
      Variant: "variant",
      "Icon Only": "iconOnly",
      IconOnly: "iconOnly",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
      variant: {
        contained: "contained",
        outlined: "outlined",
        text: "text",
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
        filled: "contained",
        Filled: "contained",
      },
      Variant: {
        contained: "contained",
        outlined: "outlined",
        text: "text",
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
        filled: "contained",
        Filled: "contained",
      },
      iconOnly: YES_NO_CAP,
    },
  },
  {
    dscoKey: "385632d619eb1dffc825a323a3f596b2011f8bb7",
    dscoName: "Close Icon Button",
    cadsName: "Close Icon Button",
    propNames: {
      Size: "size",
      State: "state",
      Color: "color",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
      color: {
        Default: "primary",
        Strong: "secondary",
        "Solid Black": "primary",
        "Solid White": "primary",
        primary: "primary",
        secondary: "secondary",
      },
      Color: {
        Default: "primary",
        Strong: "secondary",
        "Solid Black": "primary",
        "Solid White": "primary",
      },
    },
  },
  {
    dscoKey: "341373d642bfd3c0e0cbb35c1130b146945a2321",
    dscoName: "Chip",
    cadsName: "Chip",
    special: "chipColorSelected",
    propNames: {
      Text: "label",
      Size: "size",
      Selected: "selected",
      Color: "color",
      State: "state",
      Type: "labelStyle",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      selected: YES_NO,
      Selected: YES_NO,
      color: {
        Black: "primary",
        Gray: "secondary",
        Selected: "selected (n/a)",
        primary: "primary",
        secondary: "secondary",
        "selected (n/a)": "selected (n/a)",
      },
      Color: {
        Black: "primary",
        Gray: "secondary",
        Selected: "selected (n/a)",
      },
      labelStyle: THICK_THIN,
      Type: THICK_THIN,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
    },
  },
  {
    dscoKey: "8314a929103d75e027acd08445eb326299d24b74",
    dscoName: "Link",
    cadsName: "Link",
    captureText: true,
    textCaptureTarget: "linkText",
    propNames: {
      Size: "size",
      State: "state",
      Type: "type",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      type: {
        Primary: "primary",
        Secondary: "secondary",
        primary: "primary",
        secondary: "secondary",
      },
      Type: { Primary: "primary", Secondary: "secondary" },
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
    },
  },
  {
    dscoKey: "6da8599310350b4a87b2a2f8e08d34ae3376a1d1",
    dscoName: "Tag",
    cadsName: "Tag",
    propNames: {
      Label: "labelText",
      "Icon Name": "startIconName",
      Size: "size",
      Color: "color",
      "Is Removable": "isDismissible",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      color: {
        Teal: "brand",
        Purple: "pink",
        Aqua: "info",
        Error: "error",
        Warning: "warning",
        Success: "success",
        Gray: "neutral",
        Disabled: "neutral",
        brand: "brand",
        neutral: "neutral",
        pink: "pink",
        orange: "orange",
        success: "success",
        error: "error",
        warning: "warning",
        info: "info",
      },
      Color: {
        Teal: "brand",
        Purple: "pink",
        Aqua: "info",
        Error: "error",
        Warning: "warning",
        Success: "success",
        Gray: "neutral",
        Disabled: "neutral",
      },
    },
  },
  {
    dscoKey: "3133f83a3f98b68c1f3081132b2e90bb5d1dc59a",
    dscoName: "Alert",
    cadsName: "Alert",
    propNames: {
      Size: "size",
      Meaning: "sentiment",
      hasLink: "hasAction",
      hasIcon: "hasIcon",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      sentiment: MEANING_TO_SENTIMENT,
      Meaning: MEANING_TO_SENTIMENT,
      hasIcon: { Yes: "true", No: "false", yes: "true", no: "false" },
    },
  },
  {
    dscoKey: "949e2949033f60df26231b2f73985b488f9f78fe",
    dscoName: "Toast",
    cadsName: "Toast",
    propNames: {
      alertText: "toastText",
      alertIcon: "toastIcon",
      Meaning: "sentiment",
      hasLink: "hasAction",
      hasIcon: "hasIcon",
    },
    variantValues: {
      sentiment: MEANING_TO_SENTIMENT,
      Meaning: MEANING_TO_SENTIMENT,
      hasIcon: { Yes: "true", No: "false", yes: "true", no: "false" },
    },
  },
  {
    dscoKey: "64993adac217e2c6daab4eb131f94531d02e65a9",
    dscoName: "Notification Banner",
    cadsName: "Notification Banner",
    propNames: {
      Title: "titleText",
      Description: "descriptionText",
      Icon: "iconName",
      "Secondary Action": "hasSecondaryAction",
      "Primary Action": "hasPrimaryAction",
      "Dismissible   ": "isDismissible",
      Dismissible: "isDismissible",
      Meaning: "sentiment",
      Style: "fillStyle",
    },
    variantValues: {
      sentiment: MEANING_TO_SENTIMENT,
      Meaning: MEANING_TO_SENTIMENT,
      fillStyle: { Default: "none", Color: "color", none: "none", color: "color" },
      Style: { Default: "none", Color: "color" },
    },
  },
  {
    dscoKey: "051a05d840dcf0a8220c056833c040fc581dff41",
    dscoName: "Font Awesome Icon",
    cadsName: "Font Awesome Icon v7",
  },
  {
    dscoKey: "2073beaaf6394b66220e04a5588a35e08d66daf2",
    dscoName: "Font Awesome Duotone Icon",
    cadsName: "Font Awesome Duotone Icon v7",
  },
  {
    dscoKey: "6315f244285e23cac76df5c8e3c807276fdc0da4",
    dscoName: "Font Awesome Icon",
    cadsName: "Font Awesome Icon v7",
  },

  // ═══ Wave C — flat High remaps ═══
  {
    dscoKey: "148a82188be79992d7015f52492071c21a21f705",
    dscoName: "Segmented Button Group",
    cadsName: "Segmented Button Group",
    propNames: {
      Size: "size",
      "Icon Only": "iconOnly",
      IconOnly: "iconOnly",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      iconOnly: YES_NO,
      "Icon Only": YES_NO,
    },
  },
  {
    dscoKey: "25783a815c161998fb765a4242de17ddfcef2e81",
    dscoName: "Segmented Button Block",
    cadsName: "Segmented Button Block",
    special: "segmentedBlockActive",
    propNames: {
      Label: "label",
      "Left Icon": "startIconName",
      "Right Icon": "endIconName",
      "Show Left Icon": "startIcon",
      "Show Right Icon": "endIcon",
      Size: "size",
      Position: "position",
      "Icon Only": "iconOnly",
      IconOnly: "iconOnly",
      State: "state",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      position: POSITION,
      Position: POSITION,
      iconOnly: YES_NO,
      "Icon Only": YES_NO,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
    },
  },
  {
    dscoKey: "1ba27ea5b212558f4281b0278785db09d2b65262",
    dscoName: "Icon Toggle Button",
    cadsName: "Icon Toggle",
    special: "iconToggleIsOn",
    propNames: {
      Icon: "iconName",
      Size: "size",
      Color: "color",
      Type: "isOn",
      State: "state",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      color: ICON_TOGGLE_COLOR,
      Color: ICON_TOGGLE_COLOR,
      isOn: {
        "Off to On": "off",
        "On to Off": "on",
        Off: "off",
        On: "on",
        off: "off",
        on: "on",
      },
      Type: {
        "Off to On": "off",
        "On to Off": "on",
        Off: "off",
        On: "on",
      },
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
    },
  },
  {
    dscoKey: "c134c8ce1f97a8067852366746163bf5a49cfa07",
    dscoName: "Icon Toggle Group",
    cadsName: "Icon Toggle + Label",
    propNames: {
      Label: "labelText",
      "Show Label": "hasLabel",
      "2nd Button": "hasTwoToggles",
      Size: "size",
    },
    variantValues: sizeStateTables(),
  },
  {
    dscoKey: "12a72e8b7d28b78b26d6d85e0884146524eb3001",
    dscoName: "Input Dropdown",
    cadsName: "Dropdown Button",
    propNames: {
      Size: "size",
      Color: "color",
      State: "state",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      color: DROPDOWN_BTN_COLOR,
      Color: DROPDOWN_BTN_COLOR,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
    },
  },
  {
    dscoKey: "ab47ef51db67847667cab7b99707f8e777d64551",
    dscoName: "Action Dropdown",
    cadsName: "Dropdown",
    special: "actionDropdown",
    forceVariants: { role: "action", menuType: "default" },
    propNames: {
      Size: "size",
      Alignment: "menuPlacement",
      Open: "open",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      menuPlacement: {
        Left: "bottomLeft",
        Right: "bottomRight",
        bottomLeft: "bottomLeft",
        bottomRight: "bottomRight",
      },
      Alignment: { Left: "bottomLeft", Right: "bottomRight" },
    },
  },
  {
    dscoKey: "b976343862b4c66015dec46d68395f42739ea9a5",
    dscoName: "Dropdown Menu Button",
    cadsName: "Dropdown Button",
    propNames: {
      Label: "label",
      "Icon Name": "iconName",
      "Show Icon": "startIcon",
      Size: "size",
      Thickness: "labelStyle",
      Color: "color",
      State: "state",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      labelStyle: THICK_THIN,
      Thickness: THICK_THIN,
      color: DROPDOWN_BTN_COLOR,
      Color: DROPDOWN_BTN_COLOR,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
    },
  },
  {
    dscoKey: "e2274d238ee69542f85d9e9476e11e88c0bde612",
    dscoName: "Dropdown Menu List",
    cadsName: "Dropdown Menu List",
    special: "menuListType",
    propNames: {
      "Show Action Items": "showActionRow",
      Size: "size",
      Type: "menuType",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      menuType: {
        "Icon List": "default",
        "Checkbox List": "checklist",
        default: "default",
        checklist: "checklist",
      },
      Type: {
        "Icon List": "default",
        "Checkbox List": "checklist",
      },
    },
  },
  {
    dscoKey: "0cdd5bf757831059deb7ae24d9b7cf39f86f21d2",
    dscoName: "Dropdown Menu Items",
    cadsName: "Dropdown Menu Item",
    special: "menuItemType",
    forceContent: { hasStartIcon: true },
    propNames: {
      Icon: "iconName",
      "List Item Text": "label",
      Size: "size",
      Type: "itemType",
      State: "selected",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      selected: {
        Selected: "yes",
        Unselected: "no",
        Default: "no",
        yes: "yes",
        no: "no",
      },
      State: {
        Selected: "yes",
        Unselected: "no",
        Default: "no",
      },
    },
  },
  {
    dscoKey: "d1962e3d41cdec427b9b37396990ce826fe5a377",
    dscoName: "Checkbox",
    cadsName: "Checkbox + Label",
    retargetWhenFalse: { sourceProp: "Show Text", cadsName: "Checkbox" },
    propNames: {
      Text: "Text",
      Size: "size",
      "Label Weight": "labelStyle",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      labelStyle: THICK_THIN,
      "Label Weight": THICK_THIN,
    },
    nestedApply: [
      {
        matchNames: ["Checkbox"],
        special: "checkboxStatus",
        propNames: { Size: "size", State: "state" },
        variantValues: {
          size: SIZE_LMXS,
          Size: SIZE_LMXS,
          state: STATE_CHECKBOX_BLOCK,
          State: STATE_CHECKBOX_BLOCK,
        },
      },
    ],
  },
  {
    dscoKey: "bc82043dae67f96dfbbe8f1e20d02ea7ebe1d458",
    dscoName: "Checkbox Blocks",
    cadsName: "Checkbox",
    special: "checkboxStatus",
    propNames: {
      Size: "size",
      State: "state",
      Selected: "status",
      Indeterminate: "status",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      state: STATE_CHECKBOX_BLOCK,
      State: STATE_CHECKBOX_BLOCK,
    },
  },
  {
    dscoKey: "2d0d2e869049a5a77b70dcf6813aa48737c1a911",
    dscoName: "Radio Button",
    cadsName: "Radio Button + Label",
    retargetWhenFalse: {
      sourceProp: "Show Text",
      cadsName: "Radio Buttons Block",
    },
    propNames: {
      Text: "Text",
      Size: "size",
      "Label Weight": "labelStyle",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      labelStyle: THICK_THIN,
      "Label Weight": THICK_THIN,
    },
    nestedApply: [
      {
        matchNames: ["Radio Buttons Block", "Radio Button"],
        special: "radioSelected",
        propNames: { Size: "size", State: "state", Type: "selected" },
        variantValues: {
          size: SIZE_LMXS,
          Size: SIZE_LMXS,
          state: STATE_DEFAULT,
          State: STATE_DEFAULT,
          selected: {
            Selected: "yes",
            Unselected: "no",
            Yes: "yes",
            No: "no",
            yes: "yes",
            no: "no",
          },
          Type: {
            Selected: "yes",
            Unselected: "no",
          },
        },
      },
    ],
  },
  {
    dscoKey: "dc3161c47faf5241fa98a42e7c5ada717119f365",
    dscoName: "Radio Buttons Blocks",
    cadsName: "Radio Buttons Block",
    propNames: {
      Size: "size",
      Selected: "selected",
      State: "state",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      selected: YES_NO,
      Selected: YES_NO,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
    },
  },
  {
    dscoKey: "cb3807d24d76a019695d82bf799811edf15ff5f6",
    dscoName: "Toggle",
    cadsName: "Toggle + Label",
    retargetWhenFalse: { sourceProp: "Show Label", cadsName: "Toggle" },
    propNames: {
      Text: "labelText",
      Size: "size",
      "Label Position": "labelPlacement",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      labelPlacement: {
        Left: "left",
        Right: "right",
        left: "left",
        right: "right",
      },
      "Label Position": { Left: "left", Right: "right" },
    },
    nestedApply: [
      {
        matchNames: ["Toggle"],
        special: "toggleOn",
        forceContent: {
          hasIcons: true,
          onIcon: "check",
          offIcon: "xmark",
        },
        propNames: { Size: "size", "On/Off": "isOn", Status: "isOn" },
        variantValues: {
          size: SIZE_LMXS,
          Size: SIZE_LMXS,
          isOn: { On: "on", Off: "off", on: "on", off: "off" },
          "On/Off": { On: "on", Off: "off" },
          Status: { On: "on", Off: "off", on: "on", off: "off" },
        },
      },
    ],
  },
  {
    dscoKey: "125d017876c50813f0359990eaaf45d1982ef739",
    dscoName: "Toggle Building Block",
    cadsName: "Toggle",
    forceContent: { hasIcons: true, onIcon: "check", offIcon: "xmark" },
    propNames: {
      Size: "size",
      Status: "isOn",
      State: "state",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      isOn: { On: "on", Off: "off", on: "on", off: "off" },
      Status: { On: "on", Off: "off", on: "on", off: "off" },
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
    },
  },
  {
    dscoKey: "e425e8b498f0675603eaca40dcf39343fedcb62e",
    dscoName: "Slider Bar",
    cadsName: "Slider Bar",
    propNames: {
      "% Filled": "percentFilled",
      "Starts From": "startsFrom",
      State: "state",
    },
    variantValues: {
      percentFilled: {
        "100": "100% (side)",
        "75": "75% (side)",
        "50": "50% (side)",
        "25": "25% (side)",
        "0": "0% (both)",
        "100%": "100% (side)",
        "75%": "75% (side)",
        "50%": "50% (side)",
        "25%": "25% (side)",
        "0%": "0% (both)",
        "100% (side)": "100% (side)",
        "75% (side)": "75% (side)",
        "50% (side)": "50% (side)",
        "25% (side)": "25% (side)",
        "0% (both)": "0% (both)",
        "-50% (center)": "-50% (center)",
        "-100% (center)": "-100% (center)",
        "+50% (center)": "+50% (center)",
        "+100% (center)": "+100% (center)",
      },
      "% Filled": {
        "100": "100% (side)",
        "75": "75% (side)",
        "50": "50% (side)",
        "25": "25% (side)",
        "0": "0% (both)",
        "100%": "100% (side)",
        "75%": "75% (side)",
        "50%": "50% (side)",
        "25%": "25% (side)",
        "0%": "0% (both)",
      },
      startsFrom: {
        Side: "side",
        Middle: "center",
        Center: "center",
        side: "side",
        center: "center",
      },
      "Starts From": { Side: "side", Middle: "center", Center: "center" },
      state: {
        Default: "default",
        Error: "error",
        Disabled: "disabled",
        default: "default",
        error: "error",
        disabled: "disabled",
      },
      State: {
        Default: "default",
        Error: "error",
        Disabled: "disabled",
      },
    },
  },
  {
    dscoKey: "64b2b6fca4e117da33d3d88304783c529687df7e",
    dscoName: "Slider Stepper",
    cadsName: "Slider Stepper",
    propNames: { Count: "stepCount" },
    variantValues: {
      stepCount: { "3": "3", "4": "4", "5": "5", "6": "6" },
      Count: { "3": "3", "4": "4", "5": "5", "6": "6" },
    },
  },
  {
    dscoKey: "1f49b8bd60a1d0351739d42dff1644522002ea00",
    dscoName: "Breadcrumb Link",
    cadsName: "Breadcrumb Links",
    special: "breadcrumbLink",
    captureText: true,
    textCaptureTarget: "pageName",
    propNames: {
      Size: "size",
      Type: "iconOnly",
      State: "isCurrent",
      "Icon Name": "iconName",
      Icon: "iconName",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      iconOnly: {
        Icon: "yes",
        Text: "no",
        yes: "yes",
        no: "no",
      },
      Type: { Icon: "yes", Text: "no" },
      isCurrent: {
        Active: "Yes",
        Default: "No",
        Visited: "No",
        Yes: "Yes",
        No: "No",
        yes: "Yes",
        no: "No",
      },
      State: {
        Active: "Yes",
        Default: "No",
        Visited: "No",
      },
    },
  },
  {
    dscoKey: "d8b09d58c31343f8ad588e1edda6e650de6c423f",
    dscoName: "Breadcrumbs Blocks",
    cadsName: "Breadcrumb Separators",
    propNames: { Size: "size" },
    variantValues: SIZE_TABLE,
  },
  {
    dscoKey: "3046d24d897ea7a8fef82b9df239e2d2b7b45f7c",
    dscoName: "Tab",
    cadsName: "Tab Item",
    special: "tabCurrent",
    propNames: {
      Label: "labelText",
      "Left Icon": "startIconName",
      "Right Icon": "endIconName",
      "Show Left Icon": "startIcon",
      "Show Right Icon": "endIcon",
      Closeable: "isDismissible",
      Size: "size",
      Type: "type",
      "ONLY Icon": "iconOnly",
      "Icon Only": "iconOnly",
      State: "isCurrent",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      type: {
        Primary: "primary",
        Secondary: "secondary",
        primary: "primary",
        secondary: "secondary",
      },
      Type: { Primary: "primary", Secondary: "secondary" },
      iconOnly: YES_NO_CAP,
      "ONLY Icon": YES_NO_CAP,
      "Icon Only": YES_NO_CAP,
      isCurrent: {
        Active: "yes",
        Default: "no",
        yes: "yes",
        no: "no",
      },
      State: { Active: "yes", Default: "no" },
    },
  },
  {
    dscoKey: "046a167c72e8ce57d1fb39e003531928d0309feb",
    dscoName: "Tab Group",
    cadsName: "Tab Group",
    propNames: { Size: "size", Type: "type" },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      type: {
        Primary: "primary",
        Secondary: "secondary",
        primary: "primary",
        secondary: "secondary",
      },
      Type: { Primary: "primary", Secondary: "secondary" },
    },
  },
  {
    dscoKey: "d9e848e2167cade785a34c19aff53552645fa03d",
    dscoName: "Tooltip",
    cadsName: "Tooltip",
    special: "tooltipType",
    propNames: {
      "Tooltip Text": "text",
      "Has Tail": "hasCaret",
      Type: "startIcon",
      Direction: "caretPlacement",
    },
    variantValues: {
      // DSCO Direction = tooltip relative to anchor (OnBottom = below target →
      // caret on top of bubble). CADS caretPlacement = caret side on bubble.
      caretPlacement: {
        OnBottom: "top",
        OnTop: "bottom",
        OnLeft: "right",
        OnRight: "left",
        bottom: "bottom",
        top: "top",
        left: "left",
        right: "right",
      },
      Direction: {
        OnBottom: "top",
        OnTop: "bottom",
        OnLeft: "right",
        OnRight: "left",
      },
    },
  },
  {
    dscoKey: "402577f53a413426e8fbdb59d73a7750b64ddd79",
    dscoName: "Drawer",
    cadsName: "Drawer",
    special: "drawerType",
    propNames: {
      Title: "titleText",
      Description: "descriptionText",
      "Show Description": "hasDescription",
      "Show Action Row": "hasActionRow",
      "Has Custom Content": "type",
    },
    variantValues: {
      type: {
        Yes: "customContent",
        No: "textOnly",
        yes: "customContent",
        no: "textOnly",
        customContent: "customContent",
        textOnly: "textOnly",
      },
      "Has Custom Content": {
        Yes: "customContent",
        No: "textOnly",
      },
    },
  },
  {
    dscoKey: "6fd36a39efde8f927febe94b2d20a77cca842844",
    dscoName: "Dialog",
    cadsName: "Dialog",
    special: "dialogType",
    propNames: {
      Title: "titleText",
      Text: "descriptionText",
      "Show Secondary": "hasSecondaryAction",
      "Top Icon": "topIconName",
      "Show Image": "hasImage",
      Closeable: "isDismissable",
      Type: "type",
    },
    variantValues: {
      type: {
        Default: "default",
        "Icon Top": "iconTop",
        default: "default",
        iconTop: "iconTop",
      },
      Type: { Default: "default", "Icon Top": "iconTop" },
    },
  },

  // ═══ Wave E — composed / nested ═══
  {
    dscoKey: "57fb424c2504d5c1f7c18f185a1c36e8bf872508",
    dscoName: "Text Field",
    cadsName: "Text Input",
    forceVariants: { type: "field" },
    propNames: { Size: "size" },
    variantValues: SIZE_TABLE,
    nestedApply: [
      {
        matchNames: ["Field Wrapper"],
        propNames: {
          "Label Text": "labelText",
          "Help Message": "helperText",
          "Show Help Text": "showHelper",
          "Show Icon": "showHelper",
          "Icon Name": "helperIcon",
          Size: "size",
        },
        variantValues: SIZE_TABLE,
      },
      {
        matchNames: ["Text Input Building Block"],
        propNames: {
          FieldText: "placeholderText",
          "Field Text": "placeholderText",
          "Show field text": "hasPlaceholder",
          Color: "color",
          State: "state",
          Size: "size",
        },
        variantValues: {
          size: SIZE_LMXS,
          Size: SIZE_LMXS,
          color: FIELD_COLOR,
          Color: FIELD_COLOR,
          state: STATE_DEFAULT,
          State: STATE_DEFAULT,
        },
        forceVariants: { type: "field" },
      },
    ],
  },
  {
    dscoKey: "84db09de35208651719ba49035c8eb3e2383fc68",
    dscoName: "Text Area",
    cadsName: "Text Input",
    forceVariants: { type: "area" },
    propNames: { Size: "size" },
    variantValues: SIZE_TABLE,
    nestedApply: [
      {
        matchNames: ["Field Wrapper"],
        propNames: {
          "Label Text": "labelText",
          "Help Message": "helperText",
          "Show Help Text": "showHelper",
          "Show Icon": "showHelper",
          "Icon Name": "helperIcon",
          Size: "size",
        },
        variantValues: SIZE_TABLE,
      },
      {
        matchNames: ["Text Input Building Block"],
        propNames: {
          FieldText: "placeholderText",
          "Field Text": "placeholderText",
          "Show field text": "hasPlaceholder",
          Color: "color",
          State: "state",
          Size: "size",
        },
        variantValues: {
          size: SIZE_LMXS,
          Size: SIZE_LMXS,
          color: FIELD_COLOR,
          Color: FIELD_COLOR,
          state: STATE_DEFAULT,
          State: STATE_DEFAULT,
        },
        forceVariants: { type: "area" },
      },
    ],
  },
  {
    dscoKey: "80f93b64131f10c8f805fd5ce3bd3833436bd24a",
    dscoName: "Dropdown Field",
    cadsName: "Dropdown",
    forceVariants: { role: "input" },
    propNames: { Size: "size" },
    variantValues: SIZE_TABLE,
    nestedApply: [
      {
        matchNames: ["Field Wrapper"],
        propNames: {
          "Label Text": "labelText",
          Label: "labelText",
          "Help Message": "helperText",
          "Show Help Text": "showHelper",
          "Icon Name": "helperIcon",
          Size: "size",
        },
        variantValues: SIZE_TABLE,
      },
      {
        matchNames: ["Dropdown Button"],
        propNames: {
          Color: "color",
          State: "state",
          Size: "size",
        },
        variantValues: {
          size: SIZE_LMXS,
          Size: SIZE_LMXS,
          color: FIELD_COLOR,
          Color: FIELD_COLOR,
          state: STATE_DEFAULT,
          State: STATE_DEFAULT,
        },
      },
    ],
  },
  {
    dscoKey: "7aa7d44bba4b5dc76d69cc1d81c167cc03608832",
    dscoName: "Chip Group",
    cadsName: "Chip Group",
    propNames: {
      Size: "size",
      Type: "labelStyle",
      Color: "color",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      labelStyle: THICK_THIN,
      Type: THICK_THIN,
      color: {
        Black: "primary",
        Gray: "secondary",
        primary: "primary",
        secondary: "secondary",
      },
      Color: { Black: "primary", Gray: "secondary" },
    },
    nestedApply: [
      {
        matchNames: ["Field Wrapper"],
        propNames: {
          "Group Label": "labelText",
          Label: "labelText",
          Size: "size",
        },
        variantValues: SIZE_TABLE,
      },
    ],
  },
  {
    dscoKey: "1d12e71986a41db4dcc4e567b6923d7ed043abdd",
    dscoName: "Breadcrumbs",
    cadsName: "Breadcrumbs",
    propNames: { Size: "size" },
    variantValues: SIZE_TABLE,
    // Nested Breadcrumb Link/Blocks remapped best-effort via nestedApply
    nestedApply: [
      {
        matchNames: ["Breadcrumb Link", "Breadcrumb Links"],
        propNames: { Size: "size" },
        variantValues: SIZE_TABLE,
      },
      {
        matchNames: ["Breadcrumb Separator", "Breadcrumb Separators"],
        propNames: { Size: "size" },
        variantValues: SIZE_TABLE,
      },
    ],
  },
  {
    dscoKey: "2c50539a1e47e54eb7ab1474e6eeb085cca393c0",
    dscoName: "Slider",
    cadsName: "Slider",
    special: "sliderControls",
    propNames: {
      "Slider Label": "labelText",
      "Show Label": "showLabelRow",
      "Show Stepper": "showStepper",
      "Input Value": "displayValue",
      "Show Tooltip Icon": "showHelper",
    },
    nestedApply: [
      {
        matchNames: ["Slider Bar"],
        special: "sliderStartsFrom",
        propNames: {
          "% Filled": "percentFilled",
          "Starts From": "startsFrom",
          Type: "startsFrom",
          State: "state",
        },
        variantValues: {
          startsFrom: {
            Range: "side",
            Centered: "center",
            Side: "side",
            Middle: "center",
            side: "side",
            center: "center",
          },
          Type: { Range: "side", Centered: "center" },
          "Starts From": { Side: "side", Middle: "center" },
          state: {
            Default: "default",
            Error: "error",
            Disabled: "disabled",
            default: "default",
            error: "error",
            disabled: "disabled",
          },
          State: {
            Default: "default",
            Error: "error",
            Disabled: "disabled",
          },
        },
      },
    ],
  },
  {
    dscoKey: "354d944bb976f7104bbcd34cf8a733aff3124964",
    dscoName: "Popover",
    cadsName: "Popover",
    special: "popoverCaret",
    propNames: {
      Direction: "caretPlacement",
    },
    variantValues: {
      // Same invert as Tooltip: DSCO Direction = vs anchor; CADS = caret side.
      caretPlacement: {
        None: "bottomLeft",
        OnBottom: "topCenter",
        OnTop: "bottomCenter",
        OnLeft: "rightCenter",
        OnRight: "leftCenter",
        Bottom: "topCenter",
        Top: "bottomCenter",
        Left: "rightCenter",
        Right: "leftCenter",
      },
      Direction: {
        None: "bottomLeft",
        OnBottom: "topCenter",
        OnTop: "bottomCenter",
        OnLeft: "rightCenter",
        OnRight: "leftCenter",
      },
    },
    nestedApply: [
      {
        matchNames: ["Popover Core"],
        propNames: {
          Text: "bodyText",
          Title: "titleText",
          "Show Actions": "hasActionRow",
          "Show Action Row": "hasActionRow",
          "Show Primary": "hasPrimaryAction",
          "Show Secondary": "hasSecondaryAction",
          Closeable: "isDismissible",
          "Show Stepper": "hasStepper",
        },
      },
    ],
  },
  {
    dscoKey: "5978e70b44d30d937b300a136fd1e5c46a8a70c1",
    dscoName: "Modal",
    cadsName: "Modal",
    special: "modalType",
    propNames: {
      Title: "titleText",
      Closeable: "isDismissable",
      "Show Secondary": "hasSecondaryAction",
      "Show 2ary": "hasSecondaryAction",
      Type: "type",
    },
    variantValues: {
      type: {
        Default: "default",
        "Image Top": "verticalImage",
        "Image Inline": "horizontalImage",
        default: "default",
        verticalImage: "verticalImage",
        horizontalImage: "horizontalImage",
      },
      Type: {
        Default: "default",
        "Image Top": "verticalImage",
        "Image Inline": "horizontalImage",
      },
    },
    slotText: [
      { matchName: "customContent", fromProp: "Content" },
    ],
  },
];

const ruleByDscoKey = new Map(
  componentSwapRules.map((rule) => [rule.dscoKey, rule]),
);

const cadsKeyByName = new Map(
  cadsComponents.map((component) => [component.name, component.key]),
);

export function propBaseName(key: string): string {
  return key.split("#")[0] ?? key;
}

/** Parse a component-set variant child name (`size=small, variant=contained, …`). */
export function parseVariantName(name: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!name.includes("=")) return result;
  for (const part of name.split(",")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

/** Normalize common size shorthand used across DSCO sets. */
export function normalizeSizeValue(value: string): string {
  return SIZE_LMXS[value] ?? SIZE_LMXS[value.trim()] ?? value;
}

export function getComponentSwapRule(
  dscoKey: string,
): ComponentSwapRule | null {
  return ruleByDscoKey.get(dscoKey) ?? null;
}

export function isSwappableComponentKey(dscoKey: string): boolean {
  return ruleByDscoKey.has(dscoKey);
}

export function resolveCadsComponentKey(cadsName: string): string | null {
  return cadsKeyByName.get(cadsName) ?? null;
}

/**
 * Resolve the CADS component-set key for a non-CADS finding, when swap is
 * supported for that DSCO key (Pass 1 Waves A–E).
 */
export function resolveSwapTargetKey(source: {
  key: string;
}): string | null {
  const rule = getComponentSwapRule(source.key);
  if (rule) return resolveCadsComponentKey(rule.cadsName);
  return null;
}

export interface CapturedComponentProps {
  /** Raw componentProperties snapshot (key → value). */
  properties: Record<string, string | boolean>;
  /** Variant axis snapshot when available. */
  variants: Record<string, string>;
  /** Optional captured free-text from a TEXT descendant. */
  capturedText: string | null;
  /** Tag-specific: DSCO Icon axis (Left/Right/None). */
  tagIconPlacement: "Left" | "Right" | "None" | null;
  /** Nested Tooltip Icon glyph (shortcode), when present. */
  nestedIconName: string | null;
}

function normalizePropBase(name: string): string {
  return name.replace(/\s+/g, "").toLocaleLowerCase();
}

function findTargetPropKey(
  targetProps: Record<string, { type: string }>,
  baseName: string,
): string | null {
  if (targetProps[baseName]) return baseName;
  const lower = baseName.toLocaleLowerCase();
  const compacted = normalizePropBase(baseName);
  for (const key of Object.keys(targetProps)) {
    const base = propBaseName(key);
    if (base.toLocaleLowerCase() === lower) return key;
    if (normalizePropBase(base) === compacted) return key;
  }
  return null;
}

function remapVariantValue(
  rule: Pick<ComponentSwapRule, "variantValues">,
  axis: string,
  value: string,
): string {
  const table = rule.variantValues?.[axis];
  if (table && table[value] !== undefined) return table[value];
  if (table) {
    const hit = Object.entries(table).find(
      ([from]) => from.toLocaleLowerCase() === value.toLocaleLowerCase(),
    );
    if (hit) return hit[1];
  }
  if (axis.toLocaleLowerCase() === "size") {
    return normalizeSizeValue(value);
  }
  return value;
}

/**
 * CADS Button has restricted variant combinations (from Figma / parity notes):
 * - color=tertiary only for variant=text + iconOnly=Yes → else secondary
 * - color=orange only for variant=contained → else primary
 * - outlined + iconOnly only supports primary/secondary/error
 */
function applyButtonRestrictedCombos(
  variants: Record<string, string>,
): Record<string, string> {
  const out = { ...variants };
  const variant = out.variant;
  const color = out.color;
  const iconOnly = out.iconOnly;

  if (color === "tertiary") {
    const tertiaryOk = variant === "text" && iconOnly === "Yes";
    if (!tertiaryOk) out.color = "secondary";
  }

  if (out.color === "orange" && variant !== "contained") {
    out.color = "primary";
  }

  if (variant === "outlined" && iconOnly === "Yes") {
    if (out.color === "tertiary" || out.color === "orange") {
      out.color = out.color === "orange" ? "primary" : "secondary";
    }
  }

  return out;
}

function mergeCheckboxStatus(
  captured: CapturedComponentProps,
): string {
  const indeterminate =
    captured.variants.Indeterminate ?? captured.variants.indeterminate;
  const selected = captured.variants.Selected ?? captured.variants.selected;
  if (
    indeterminate === "Yes" ||
    indeterminate === "yes" ||
    indeterminate === "true"
  ) {
    return "indeterminate";
  }
  if (selected === "Yes" || selected === "yes" || selected === "true") {
    return "selected";
  }
  return "unselected";
}

function applySpecialVariants(
  rule: ComponentSwapRule,
  captured: CapturedComponentProps,
  out: Record<string, string>,
): Record<string, string> {
  const result = { ...out };
  switch (rule.special) {
    case "chipColorSelected": {
      const selectedRaw =
        captured.variants.Selected ?? captured.variants.selected;
      const colorRaw = captured.variants.Color ?? captured.variants.color;
      const isSelected =
        selectedRaw === "Yes" ||
        selectedRaw === "yes" ||
        colorRaw === "Selected";
      if (isSelected) {
        result.selected = "yes";
        result.color = "selected (n/a)";
      } else {
        result.selected = "no";
        if (colorRaw === "Black") result.color = "primary";
        else if (colorRaw === "Gray" || colorRaw === "Grey")
          result.color = "secondary";
      }
      break;
    }
    case "segmentedBlockActive": {
      const state = captured.variants.State ?? captured.variants.state;
      result.isActive = state === "Pressed" || state === "pressed" ? "yes" : "no";
      result.state = "default";
      break;
    }
    case "iconToggleIsOn": {
      const type = captured.variants.Type ?? captured.variants.type;
      if (type === "Off to On" || type === "Off") result.isOn = "off";
      else if (type === "On to Off" || type === "On") result.isOn = "on";
      delete result.Type;
      delete result.type;
      break;
    }
    case "menuItemType": {
      const type = captured.variants.Type ?? captured.variants.type ?? "";
      if (type.includes("Checkbox")) {
        result.role = "input";
        result.itemType = "checkbox";
      } else if (type.includes("Destructive")) {
        result.role = "action";
        result.itemType = "defaultError";
      } else if (type.includes("Action")) {
        result.role = "action";
        result.itemType = "default";
      } else {
        result.role = "input";
        result.itemType = "default";
      }
      const state = captured.variants.State ?? captured.variants.state;
      if (state === "Selected") result.selected = "yes";
      else if (state && state !== "Selected") result.selected = "no";
      delete result.Type;
      delete result.type;
      break;
    }
    case "menuListType": {
      const type = captured.variants.Type ?? captured.variants.type ?? "";
      if (type.includes("Checkbox")) {
        result.menuType = "checklist";
        result.role = "input";
      } else {
        result.menuType = "default";
        result.role = "action";
      }
      delete result.Type;
      delete result.type;
      break;
    }
    case "actionDropdown": {
      result.role = "action";
      if (!result.menuType) result.menuType = "default";
      break;
    }
    case "tooltipType": {
      const type = captured.variants.Type ?? captured.variants.type ?? "";
      if (type === "Label" || type.toLowerCase() === "label") {
        // startIcon handled as boolean content
      }
      break;
    }
    case "popoverCaret": {
      const dir = captured.variants.Direction ?? captured.variants.direction;
      // hasCaret is BOOLEAN — handled in buildContentProperties via special
      if (dir === "None" || dir === "none") {
        delete result.caretPlacement;
      }
      break;
    }
    case "breadcrumbLink": {
      const state = captured.variants.State ?? captured.variants.state;
      if (state === "Active") result.isCurrent = "Yes";
      else result.isCurrent = "No";
      delete result.state;
      delete result.State;
      break;
    }
    case "tabCurrent": {
      const state = captured.variants.State ?? captured.variants.state;
      if (state === "Active") result.isCurrent = "yes";
      else result.isCurrent = "no";
      delete result.state;
      delete result.State;
      break;
    }
    case "drawerType": {
      const custom =
        captured.variants["Has Custom Content"] ??
        captured.variants.hasCustomContent;
      if (custom === "Yes" || custom === "yes" || custom === "true") {
        result.type = "customContent";
      } else if (custom === "No" || custom === "no" || custom === "false") {
        result.type = "textOnly";
      }
      break;
    }
    case "dialogType": {
      const type = captured.variants.Type ?? captured.variants.type;
      if (type === "Icon Top") result.type = "iconTop";
      else if (type === "Default") result.type = "default";
      break;
    }
    case "modalType": {
      const type = captured.variants.Type ?? captured.variants.type;
      if (type === "Image Top") result.type = "verticalImage";
      else if (type === "Image Inline") result.type = "horizontalImage";
      else if (type === "Default") result.type = "default";
      break;
    }
    case "sliderControls": {
      // showControls derived in buildContentProperties
      break;
    }
    default:
      break;
  }

  if (rule.special === "checkboxStatus" || rule.dscoName === "Checkbox Blocks") {
    result.status = mergeCheckboxStatus(captured);
    delete result.Selected;
    delete result.selected;
    delete result.Indeterminate;
    delete result.indeterminate;
  }

  return result;
}

/**
 * Remapped target variant axes (axis name → value) for exact variant matching.
 * Always forces interactive `state` to `default` when that axis exists on source,
 * except when selection semantics are carried by a different axis (isActive, etc.).
 */
export function remapVariants(
  rule: ComponentSwapRule,
  captured: CapturedComponentProps,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [axis, value] of Object.entries(captured.variants)) {
    const targetAxis = rule.propNames?.[axis] ?? axis;
    const remapped = remapVariantValue(rule, axis, value);
    const alsoByTarget = remapVariantValue(rule, targetAxis, remapped);
    if (
      alsoByTarget === "true" ||
      alsoByTarget === "false" ||
      alsoByTarget === "Yes" ||
      alsoByTarget === "No" ||
      alsoByTarget === "yes" ||
      alsoByTarget === "no"
    ) {
      // Skip VARIANT→BOOLEAN axes (applied in buildContentProperties).
      // iconOnly / selected / isActive stay as variants when target is VARIANT.
      const lower = targetAxis.toLocaleLowerCase();
      if (
        lower === "hasicon" ||
        lower === "hasaction" ||
        lower === "haslabel" ||
        lower === "hastwotoggles" ||
        lower === "showhelper" ||
        lower === "showlabelrow" ||
        lower === "showstepper" ||
        lower === "showcontrols" ||
        lower === "hasplaceholder" ||
        lower === "starticon" ||
        lower === "endicon" ||
        lower === "open" ||
        lower === "showactionrow" ||
        lower === "hascaret" ||
        lower === "isdismissible" ||
        lower === "isdismissable" ||
        lower === "hasdescription" ||
        lower === "hasactionrow" ||
        lower === "hassecondaryaction" ||
        lower === "hasprimaryaction" ||
        lower === "hasimage" ||
        lower === "hasstarticon"
      ) {
        continue;
      }
    }
    // Selection-semantic specials consume State — skip putting it on `state`.
    if (
      targetAxis.toLocaleLowerCase() === "state" &&
      (rule.special === "segmentedBlockActive" ||
        rule.special === "breadcrumbLink" ||
        rule.special === "tabCurrent" ||
        rule.special === "menuItemType")
    ) {
      continue;
    }
    if (targetAxis.toLocaleLowerCase() === "state") {
      out[targetAxis] = "default";
      continue;
    }
    // Drop Color on Segmented / Icon Toggle Group (no CADS axis).
    if (
      (axis === "Color" || axis === "color") &&
      (rule.dscoName === "Segmented Button Group" ||
        rule.dscoName === "Segmented Button Block" ||
        rule.dscoName === "Icon Toggle Group" ||
        rule.dscoName === "Slider")
    ) {
      continue;
    }
    out[targetAxis] = alsoByTarget;
  }
  if (rule.forceVariants) {
    for (const [axis, value] of Object.entries(rule.forceVariants)) {
      out[axis] = value;
    }
  }
  const specialized = applySpecialVariants(rule, captured, out);
  if (rule.cadsName === "Button") {
    return applyButtonRestrictedCombos(specialized);
  }
  return specialized;
}

/** Remap variants for a nested-apply sub-rule. */
export function remapNestedVariants(
  nested: NestedApplyRule,
  captured: CapturedComponentProps,
): Record<string, string> {
  const mini: ComponentSwapRule = {
    dscoKey: "",
    dscoName: "",
    cadsName: "",
    propNames: nested.propNames,
    variantValues: nested.variantValues,
    forceVariants: nested.forceVariants,
  };
  const out = remapVariants(mini, captured);
  if (nested.special === "checkboxStatus") {
    out.status = mergeCheckboxStatus(captured);
  }
  if (nested.special === "radioSelected") {
    const type = captured.variants.Type ?? captured.variants.selected;
    if (type === "Selected" || type === "Yes" || type === "yes") {
      out.selected = "yes";
    } else if (type === "Unselected" || type === "No" || type === "no") {
      out.selected = "no";
    }
  }
  if (nested.special === "toggleOn") {
    const onOff =
      captured.variants["On/Off"] ??
      captured.variants.Status ??
      captured.variants.isOn;
    if (onOff === "On" || onOff === "on") out.isOn = "on";
    else if (onOff === "Off" || onOff === "off") out.isOn = "off";
  }
  if (nested.special === "sliderStartsFrom") {
    const type = captured.variants.Type ?? captured.variants.type;
    if (type === "Range") out.startsFrom = "side";
    else if (type === "Centered") out.startsFrom = "center";
  }
  if (nested.forceVariants) {
    for (const [axis, value] of Object.entries(nested.forceVariants)) {
      out[axis] = value;
    }
  }
  return out;
}

/**
 * TEXT/BOOLEAN (and VARIANT→BOOLEAN) payload for setProperties after swap.
 * Variant axes are applied by swapping to an exact matching component child.
 */
export function buildContentProperties(
  rule: ComponentSwapRule,
  captured: CapturedComponentProps,
  targetProps: Record<string, { type: string }>,
): Record<string, string | boolean> {
  const targetMeta: Record<string, { type: string }> = { ...targetProps };
  const out: Record<string, string | boolean> = {};

  for (const [sourceKey, value] of Object.entries(captured.properties)) {
    const sourceBase = propBaseName(sourceKey);
    const targetBase = rule.propNames?.[sourceBase] ?? sourceBase;
    const targetKey = findTargetPropKey(targetMeta, targetBase);
    if (!targetKey) continue;
    const targetType = targetMeta[targetKey].type;
    if (targetType === "VARIANT") continue;
    if (targetType === "BOOLEAN") {
      if (typeof value === "boolean") out[targetKey] = value;
      else if (value === "true" || value === "Yes" || value === "yes")
        out[targetKey] = true;
      else if (value === "false" || value === "No" || value === "no")
        out[targetKey] = false;
      continue;
    }
    if (
      targetType === "TEXT" &&
      (typeof value === "string" || typeof value === "boolean")
    ) {
      out[targetKey] = String(value);
    }
  }

  // VARIANT → BOOLEAN
  for (const [axis, value] of Object.entries(captured.variants)) {
    const targetAxis = rule.propNames?.[axis] ?? axis;
    const targetKey = findTargetPropKey(targetMeta, targetAxis);
    if (!targetKey || targetMeta[targetKey].type !== "BOOLEAN") continue;
    const remapped = remapVariantValue(rule, axis, value);
    if (remapped === "true" || remapped === "Yes" || remapped === "yes") {
      out[targetKey] = true;
    } else if (
      remapped === "false" ||
      remapped === "No" ||
      remapped === "no"
    ) {
      out[targetKey] = false;
    }
  }

  if (captured.tagIconPlacement) {
    const startKey = findTargetPropKey(targetMeta, "startIcon");
    const endKey = findTargetPropKey(targetMeta, "endIcon");
    if (startKey && targetMeta[startKey].type === "BOOLEAN") {
      out[startKey] = captured.tagIconPlacement === "Left";
    }
    if (endKey && targetMeta[endKey].type === "BOOLEAN") {
      out[endKey] = captured.tagIconPlacement === "Right";
    }
  }

  if (rule.captureText && rule.textCaptureTarget && captured.capturedText) {
    const targetKey = findTargetPropKey(targetMeta, rule.textCaptureTarget);
    if (targetKey) out[targetKey] = captured.capturedText;
  }

  const removable =
    captured.variants["Is Removable"] ?? captured.variants.isDismissible;
  if (removable !== undefined) {
    const targetKey = findTargetPropKey(targetMeta, "isDismissible");
    if (targetKey && targetMeta[targetKey].type === "BOOLEAN") {
      out[targetKey] =
        removable === "Yes" || removable === "yes" || removable === "true";
    }
  }

  // Tooltip Type → startIcon boolean + nested glyph
  if (rule.special === "tooltipType") {
    const type = captured.variants.Type ?? captured.variants.type ?? "";
    const startKey = findTargetPropKey(targetMeta, "startIcon");
    if (startKey && targetMeta[startKey].type === "BOOLEAN") {
      out[startKey] =
        type === "IconLeft" ||
        type === "IconRight" ||
        type.toLowerCase().includes("icon");
    }
    if (captured.nestedIconName) {
      const iconKey = findTargetPropKey(targetMeta, "iconName");
      if (iconKey) out[iconKey] = captured.nestedIconName;
    }
    let hasTail: string | boolean | undefined =
      captured.variants["Has Tail"] ?? captured.variants.hasCaret;
    if (hasTail === undefined) {
      for (const [key, value] of Object.entries(captured.properties)) {
        if (propBaseName(key) === "Has Tail") {
          hasTail = value;
          break;
        }
      }
    }
    const caretKey = findTargetPropKey(targetMeta, "hasCaret");
    if (
      caretKey &&
      hasTail !== undefined &&
      targetMeta[caretKey].type === "BOOLEAN"
    ) {
      out[caretKey] =
        hasTail === true ||
        hasTail === "Yes" ||
        hasTail === "yes" ||
        hasTail === "true";
    }
  }

  // Popover Direction=None → hasCaret=false
  if (rule.special === "popoverCaret") {
    const dir = captured.variants.Direction ?? captured.variants.direction;
    const caretKey = findTargetPropKey(targetMeta, "hasCaret");
    if (caretKey && targetMeta[caretKey].type === "BOOLEAN") {
      out[caretKey] = !(dir === "None" || dir === "none");
    }
  }

  // Slider Show Left/Right Button → showControls
  if (rule.special === "sliderControls") {
    const truthy = (v: string | boolean | undefined): boolean =>
      v === true || v === "Yes" || v === "yes" || v === "true";
    const left =
      captured.variants["Show Left Button"] ??
      captured.properties["Show Left Button"];
    const right =
      captured.variants["Show Right Button"] ??
      captured.properties["Show Right Button"];
    const key = findTargetPropKey(targetMeta, "showControls");
    if (key && targetMeta[key].type === "BOOLEAN") {
      out[key] = truthy(left) || truthy(right);
    }
  }

  if (rule.forceContent) {
    for (const [base, value] of Object.entries(rule.forceContent)) {
      const key = findTargetPropKey(targetMeta, base);
      if (!key) continue;
      if (targetMeta[key].type === "BOOLEAN") {
        out[key] = Boolean(value);
      } else if (targetMeta[key].type === "TEXT") {
        out[key] = String(value);
      }
    }
  }

  return out;
}

/** Content props for a nested-apply sub-rule. */
export function buildNestedContentProperties(
  nested: NestedApplyRule,
  captured: CapturedComponentProps,
  targetProps: Record<string, { type: string }>,
): Record<string, string | boolean> {
  const mini: ComponentSwapRule = {
    dscoKey: "",
    dscoName: "",
    cadsName: "",
    propNames: nested.propNames,
    variantValues: nested.variantValues,
    forceContent: nested.forceContent,
  };
  return buildContentProperties(mini, captured, targetProps);
}

/**
 * Full setProperties payload (variants + content). Used as fallback when an
 * exact variant child can't be found in the imported CADS set, and for nested apply.
 */
export function buildSwapProperties(
  rule: ComponentSwapRule,
  captured: CapturedComponentProps,
  targetProps: Record<string, { type: string }>,
): Record<string, string | boolean> {
  const targetMeta: Record<string, { type: string }> = { ...targetProps };
  const out = buildContentProperties(rule, captured, targetMeta);
  const variants = remapVariants(rule, captured);
  for (const [axis, value] of Object.entries(variants)) {
    const targetKey = findTargetPropKey(targetMeta, axis);
    if (!targetKey || targetMeta[targetKey].type !== "VARIANT") continue;
    out[targetKey] = value;
  }
  return out;
}

export function buildNestedSwapProperties(
  nested: NestedApplyRule,
  captured: CapturedComponentProps,
  targetProps: Record<string, { type: string }>,
): Record<string, string | boolean> {
  const targetMeta: Record<string, { type: string }> = { ...targetProps };
  const out = buildNestedContentProperties(nested, captured, targetMeta);
  const variants = remapNestedVariants(nested, captured);
  for (const [axis, value] of Object.entries(variants)) {
    const targetKey = findTargetPropKey(targetMeta, axis);
    if (!targetKey || targetMeta[targetKey].type !== "VARIANT") continue;
    out[targetKey] = value;
  }
  return out;
}

/** Read a source boolean-ish prop/variant for retargetWhenFalse. */
export function isSourcePropFalsy(
  captured: CapturedComponentProps,
  sourceProp: string,
): boolean {
  for (const [key, value] of Object.entries(captured.properties)) {
    if (propBaseName(key) === sourceProp || key === sourceProp) {
      if (value === false || value === "false" || value === "No" || value === "no")
        return true;
      if (value === true || value === "true" || value === "Yes" || value === "yes")
        return false;
    }
  }
  const v = captured.variants[sourceProp];
  if (v === "No" || v === "no" || v === "false") return true;
  if (v === "Yes" || v === "yes" || v === "true") return false;
  return false;
}
