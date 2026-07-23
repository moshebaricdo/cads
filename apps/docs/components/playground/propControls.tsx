"use client";

import type {
  CadsComponentManifest,
  CadsPropDef,
} from "@codeai/cads-react/manifest";
import { Dropdown, TextInput, Toggle } from "@codeai/cads-react";
import { buildDemoBreadcrumbItems } from "./previews/shared";
import inspectorStyles from "./inspector.module.css";

/** Props that are driven by interaction / too complex for simple controls. */
export const SKIP_PROPS = new Set([
  "onChange",
  "onPressedChange",
  "onClick",
  "onAction",
  "onClose",
  "onPrimaryAction",
  "onSecondaryAction",
  "onOpenChange",
  "sx",
  "className",
  "style",
  "ref",
  "secondToggle",
  "options",
  "items",
  "value",
  "pressed",
  "checked",
  "htmlFor",
  "onItemDismiss",
  "href",
  // Controlled `open` freezes the menu without onOpenChange wiring.
  // `defaultOpen` is allowed and remounted from the playground.
  "open",
  "surfaceOnly",
  "image",
  "customContent",
  // Legacy boolean icon gates — no longer in the public API; skip if present.
  "startIcon",
  "endIcon",
]);

/** Components where `children` is editable label/message text in the playground. */
const CHILDREN_TEXT_COMPONENTS = new Set([
  "Button",
  "Link",
  "Alert",
  "Toast",
]);

/** Dropdown props that only apply to role=input. */
export const DROPDOWN_INPUT_ONLY = new Set([
  "menuType",
  "width",
  "helperText",
  "placeholder",
  "color",
  "labelStyle",
  "readOnly",
  "error",
  "required",
]);

/** Dropdown props that only apply to role=action. */
export const DROPDOWN_ACTION_ONLY = new Set(["buttonVariant", "buttonColor"]);

/* ------------------------------------------------------------------ */
/* Prop grouping / ordering                                            */
/* ------------------------------------------------------------------ */

export type ControlGroup =
  | "appearance"
  | "content"
  | "value"
  | "state"
  | "behavior"
  | "a11y";

export const GROUP_ORDER: ControlGroup[] = [
  "appearance",
  "content",
  "value",
  "state",
  "behavior",
  "a11y",
];

export const GROUP_LABELS: Record<ControlGroup, string> = {
  appearance: "Appearance",
  content: "Content",
  value: "Value",
  state: "State",
  behavior: "Layout & behavior",
  a11y: "Accessibility",
};

/**
 * Priority-ordered membership per group. Earlier entries render first, so the
 * levers designers reach for most (variant / color / size) always lead.
 */
const GROUP_MEMBERS: Record<ControlGroup, string[]> = {
  appearance: [
    "variant",
    "type",
    "color",
    "size",
    "sentiment",
    "status",
    "fillStyle",
    "role",
    "labelStyle",
    "buttonVariant",
    "buttonColor",
    "menuType",
    "menuPlacement",
    "position",
    "align",
    "orientation",
    "labelPlacement",
    "startsFrom",
    "placement",
    "caretPlacement",
    "hasCaret",
    "content",
    "isExternal",
    "hasIcon",
    "hasIcons",
    "hideIcon",
    "arrow",
    "width",
    "iconOnly",
  ],
  content: [
    "children",
    "label",
    "title",
    "description",
    "body",
    "placeholder",
    "iconName",
    "startIconName",
    "endIconName",
    "onIcon",
    "offIcon",
    "topIconName",
    "helperText",
    "helperIconName",
    "showHelper",
    "displayValue",
    "expandText",
    "actionLabel",
    "actionStartIconName",
    "actionEndIconName",
    "primaryActionLabel",
    "secondaryActionLabel",
    "stepperText",
    "count",
  ],
  value: ["defaultValue", "min", "max", "step"],
  state: [
    "defaultChecked",
    "defaultPressed",
    "defaultOpen",
    "selected",
    "exclusive",
    "required",
    "error",
    "readOnly",
    "loading",
    "disabled",
    "indeterminate",
  ],
  behavior: [
    "fullWidth",
    "multiline",
    "rows",
    "showDisplayValue",
    "showLabelRow",
    "showControls",
    "showTicks",
    "hasAction",
    "hasActionRow",
    "hasStepper",
    "hasDescription",
    "hasImage",
    "hasPrimaryAction",
    "hasSecondaryAction",
    "isDismissible",
    "isDismissable",
    "dismissible",
    "showClose",
    "dense",
    "maxItems",
    "itemsBeforeCollapse",
    "itemsAfterCollapse",
    "autoHideDuration",
  ],
  a11y: ["aria-label", "id", "name"],
};

function groupForProp(prop: CadsPropDef): ControlGroup {
  for (const group of GROUP_ORDER) {
    if (GROUP_MEMBERS[group].includes(prop.name)) return group;
  }
  if (prop.name.startsWith("aria")) return "a11y";
  // Icon names / glyphs are content; boolean gates (hasIcons, iconOnly, playground hasIcon) stay elsewhere.
  if (prop.name.toLowerCase().includes("icon")) return "content";
  if (prop.name === "defaultValue") return "value";
  if (prop.name.startsWith("default")) return "state";
  if (prop.name.startsWith("show") || prop.name.startsWith("has")) {
    return "behavior";
  }
  if (prop.type.trim() === "boolean") return "state";
  return "content";
}

/** Hide controls that don't apply given the current playground values. */
export function isPropVisible(
  exportName: string,
  prop: CadsPropDef,
  values: Record<string, unknown>,
): boolean {
  if (exportName === "Button" && Boolean(values.iconOnly)) {
    // Icon-only uses playground `iconName` (not start/end adornments + label).
    if (
      prop.name === "startIconName" ||
      prop.name === "endIconName" ||
      prop.name === "children"
    ) {
      return false;
    }
  }
  // Preview shows a 3-option group with fixed labels.
  if (exportName === "Radio" && prop.name === "label") {
    return false;
  }
  if (exportName === "TextInput" && prop.name === "startIconName") {
    return !Boolean(values.multiline);
  }
  if (exportName === "TextInput" && prop.name === "rows") {
    return Boolean(values.multiline);
  }
  if (exportName === "Toggle" && (prop.name === "onIcon" || prop.name === "offIcon")) {
    return values.hasIcons !== false;
  }
  if (exportName === "Dialog" && prop.name === "topIconName") {
    return String(values.type ?? "default") === "iconTop";
  }
  if (exportName === "Slider") {
    if (prop.name === "width" && Boolean(values.fullWidth)) {
      return false;
    }
    if (
      prop.name === "displayValue" &&
      values.showDisplayValue === false
    ) {
      return false;
    }
    if (
      prop.name === "helperIconName" &&
      (values.showHelper === false ||
        values.helperText == null ||
        values.helperText === "")
    ) {
      return false;
    }
  }
  if (
    (exportName === "Alert" || exportName === "Toast") &&
    (prop.name === "actionLabel" ||
      prop.name === "actionStartIconName" ||
      prop.name === "actionEndIconName") &&
    !Boolean(values.hasAction)
  ) {
    return false;
  }
  if (
    (exportName === "Alert" || exportName === "Toast") &&
    prop.name === "iconName" &&
    values.hasIcon === false
  ) {
    return false;
  }
  return true;
}

/**
 * Playground-only controls that aren't on the public component API.
 * Button icon-only uses `iconName` (pre-seeded smile) instead of start/end adornments.
 */
export function playgroundExtraProps(
  exportName: string,
  values: Record<string, unknown>,
): CadsPropDef[] {
  if (exportName === "Button" && Boolean(values.iconOnly)) {
    return [
      {
        name: "iconName",
        type: "FaIconName",
        description: "Icon for icon-only buttons (maps to startIconName).",
      },
    ];
  }
  // Native HTML input type — field-only (not applicable to multiline areas).
  if (exportName === "TextInput" && !Boolean(values.multiline)) {
    return [
      {
        name: "type",
        type: '"text" | "password"',
        default: '"text"',
        description:
          "Native HTML input type. Use password to conceal field contents.",
      },
    ];
  }
  // Alert/Toast: playground gate for iconName={false} (default-on when omitted).
  if (exportName === "Alert" || exportName === "Toast") {
    return [
      {
        name: "hasIcon",
        type: "boolean",
        default: "true",
        description:
          "Show leading icon. Off maps to iconName={false} (MUI convention).",
      },
    ];
  }
  return [];
}

export function orderedControls(props: CadsPropDef[]): {
  group: ControlGroup;
  props: CadsPropDef[];
}[] {
  const buckets = new Map<ControlGroup, CadsPropDef[]>();
  for (const prop of props) {
    const group = groupForProp(prop);
    const bucket = buckets.get(group) ?? [];
    bucket.push(prop);
    buckets.set(group, bucket);
  }
  const result: { group: ControlGroup; props: CadsPropDef[] }[] = [];
  for (const group of GROUP_ORDER) {
    const bucket = buckets.get(group);
    if (!bucket?.length) continue;
    const priority = GROUP_MEMBERS[group];
    const sorted = [...bucket].sort((a, b) => {
      const ai = priority.indexOf(a.name);
      const bi = priority.indexOf(b.name);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return 0;
    });
    result.push({ group, props: sorted });
  }
  return result;
}

/* ------------------------------------------------------------------ */
/* Type parsing                                                        */
/* ------------------------------------------------------------------ */

export function parseEnumOptions(type: string): string[] | null {
  const parts = type
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;
  const values: string[] = [];
  for (const part of parts) {
    const quoted = part.match(/^["']([^"']+)["']$/);
    if (quoted) {
      values.push(quoted[1]);
      continue;
    }
    // Numeric unions like `3 | 4 | 5 | 6`.
    if (/^-?\d+(\.\d+)?$/.test(part)) {
      values.push(part);
      continue;
    }
    return null;
  }
  return values;
}

/** Trimmed string icon name, or empty when unset. */
export function iconNameValue(value: unknown): string {
  return String(value ?? "").trim();
}

/** True when a playground string icon field should enable the matching boolean. */
export function hasIconName(value: unknown): boolean {
  return iconNameValue(value).length > 0;
}

function parseDefault(raw: string | undefined): unknown {
  if (raw == null) return undefined;
  const t = raw.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    return t.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return t;
}

function isBooleanType(type: string) {
  return type.trim() === "boolean";
}

function isStringyType(type: string) {
  const t = type.trim();
  return (
    t === "string" ||
    t === "ReactNode" ||
    t === "FaIconName" ||
    t.includes("FaIconName") ||
    t.startsWith("ReactNode") ||
    t.includes("CSS length") ||
    /\|\s*string\b/.test(t)
  );
}

function isNumberType(type: string) {
  return type.trim() === "number";
}

export function controlKind(
  prop: CadsPropDef,
  options?: {
    ignoreSkipList?: boolean;
    exportName?: string;
  },
): "enum" | "boolean" | "text" | "number" | "skip" {
  if (!options?.ignoreSkipList && SKIP_PROPS.has(prop.name)) return "skip";
  if (prop.type.includes("=>")) return "skip";
  if (prop.type.includes("ReactElement")) return "skip";
  if (prop.name === "children") {
    if (
      !options?.exportName ||
      !CHILDREN_TEXT_COMPONENTS.has(options.exportName)
    ) {
      return "skip";
    }
  }
  // Allow scalar playground editing for `string | string[]` / `number | number[]`
  // (Dropdown / Slider defaultValue). Pure array-only types stay skipped.
  if (prop.type.includes("[]") && !prop.type.includes("|")) return "skip";
  if (parseEnumOptions(prop.type)) return "enum";
  if (isBooleanType(prop.type)) return "boolean";
  if (isNumberType(prop.type)) return "number";
  if (prop.type.includes("number") && prop.type.includes("|")) return "number";
  if (isStringyType(prop.type)) return "text";
  if (prop.type.includes("string") && prop.type.includes("|")) return "text";
  return "skip";
}

export function initialValues(
  component: CadsComponentManifest,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const prop of component.props) {
    const kind = controlKind(prop, { exportName: component.exportName });
    if (kind === "skip") continue;
    const def = parseDefault(prop.default);
    if (def !== undefined) {
      // Don't prefill optional icon names — empty means "no icon" in the playground.
      if (
        (prop.name.endsWith("IconName") ||
          prop.name === "iconName" ||
          prop.name === "onIcon" ||
          prop.name === "offIcon") &&
        typeof def === "string"
      ) {
        // Toggle track icons keep their Figma defaults when hasIcons is on.
        if (
          component.exportName === "Toggle" &&
          (prop.name === "onIcon" || prop.name === "offIcon")
        ) {
          values[prop.name] = def;
        } else {
          values[prop.name] = "";
        }
        continue;
      }
      values[prop.name] = def;
      continue;
    }
    if (kind === "boolean") values[prop.name] = false;
    else if (kind === "enum") {
      const opts = parseEnumOptions(prop.type);
      values[prop.name] = opts?.[0] ?? "";
    } else if (kind === "number") {
      values[prop.name] = "";
    } else if (kind === "text") {
      if (prop.name === "children") {
        if (component.exportName === "Button") values[prop.name] = "Continue";
        else if (component.exportName === "Link") values[prop.name] = "Link";
        else if (component.exportName === "Alert") {
          values[prop.name] = "This is an alert.";
        } else if (component.exportName === "Toast") {
          values[prop.name] = "This is a toast.";
        } else values[prop.name] = "";
      } else if (prop.name === "label") {
        values[prop.name] =
          component.exportName === "Button" ? "Continue" : "Label";
      } else if (prop.name === "title") {
        values[prop.name] =
          component.exportName === "NotificationBanner"
            ? "This is a title"
            : component.exportName === "Tooltip"
              ? "Tooltip"
              : "Title";
      } else if (prop.name === "description") {
        values[prop.name] = "This is additional descriptive text.";
      } else if (prop.name === "body") {
        values[prop.name] =
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
      } else if (
        prop.name === "actionLabel" ||
        prop.name === "primaryActionLabel" ||
        prop.name === "secondaryActionLabel"
      ) {
        values[prop.name] = "Button";
      } else if (prop.name === "aria-label") {
        values[prop.name] = component.name;
      } else {
        values[prop.name] = "";
      }
    }
  }

  if (component.exportName === "Breadcrumbs") {
    values.maxItems = 4;
    values.itemsBeforeCollapse = 1;
    values.itemsAfterCollapse = 2;
    values.demoIcon = true;
    values.demoIconName = "box-archive";
    values.demoIconItem = "Detail";
    values.demoIconOnly = false;
  }
  if (component.exportName === "SegmentedButton") {
    values.defaultValue = "list";
  }
  if (component.exportName === "IconToggle") {
    // Required prop — needs a concrete default for the preview.
    if (!iconNameValue(values.iconName)) values.iconName = "smile";
    values.dualToggle = false;
    values.secondIconName = "thumbs-down";
    values.secondColor = "error";
    values.secondAriaLabel = "Thumbs down";
    if (values.label == null || values.label === "Label") {
      values.label = "";
    }
  }
  if (component.exportName === "Radio" && values.value == null) {
    values.value = "a";
  }
  if (component.exportName === "FieldWrapper") {
    values.label = "Email";
    values.helperText = "We never share this";
    values.showHelper = true;
  }
  if (component.exportName === "TextInput") {
    values.label = "Email";
    values.placeholder = "you@example.com";
    values.helperText = "Required";
    values.startIconName = "";
    values.helperIconName = "";
    values.type = "text";
  }
  if (component.exportName === "Chip" || component.exportName === "Tag") {
    values.startIconName = "";
    values.endIconName = "";
  }
  if (component.exportName === "Tooltip") {
    values.iconName = "";
  }
  if (component.exportName === "Alert" || component.exportName === "Toast") {
    values.hasIcon = true;
  }
  if (component.exportName === "Dropdown") {
    values.role = values.role || "input";
    values.menuType = values.menuType || "default";
    values.label = values.role === "action" ? "Actions" : "Sort by";
    values.placeholder = "Select…";
    values.helperText = "";
    values.width = values.width || "hug";
    values["aria-label"] = "Dropdown";
    values.demoItemIcons = false;
    values.defaultValue = "recent";
    values.defaultOpen = false;
    values.startIconName = "";
  }
  if (component.exportName === "Button") {
    values.startIconName = "";
    values.endIconName = "";
    // Ready for icon-only mode; control is only shown when iconOnly is on.
    values.iconName = "smile";
  }
  if (component.exportName === "Slider") {
    values.label = values.label || "Field label";
    values.helperText = values.helperText ?? "Helper text";
    values.helperIconName = "";
    values.width = values.width || "300";
    values.fullWidth = values.fullWidth ?? false;
    values.startsFrom = values.startsFrom || "side";
    const center = values.startsFrom === "center";
    // Manifest may document dual-mode defaults as prose ("0 (side) / -100 (center)").
    // Those strings are truthy but not numeric — always coerce to a real range.
    {
      const n = Number(values.min);
      values.min = Number.isFinite(n) ? n : center ? -100 : 0;
    }
    {
      const n = Number(values.max);
      values.max = Number.isFinite(n) ? n : 100;
    }
    {
      const n = Number(values.defaultValue);
      values.defaultValue = Number.isFinite(n) ? n : center ? 0 : 50;
    }
    {
      const n = Number(values.step);
      values.step = Number.isFinite(n) ? n : 1;
    }
  }
  if (
    component.exportName === "Alert" ||
    component.exportName === "Toast"
  ) {
    values.iconName = "";
    values.actionStartIconName = "";
    values.actionEndIconName = "";
  }
  if (component.exportName === "NotificationBanner") {
    values.iconName = "";
  }
  if (component.exportName === "Tabs") {
    values.defaultValue = values.defaultValue || "a";
  }
  if (component.exportName === "Popover") {
    values.title = "Popover title";
    values.body =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.";
    if (!values.stepperText) values.stepperText = "1/3";
  }
  if (component.exportName === "Dialog") {
    values.title = "Dialog Title";
    values.topIconName = "";
  }
  if (component.exportName === "Drawer") {
    values.title = "This is a heading";
    values.description = "This is descriptive text.";
  }
  if (component.exportName === "Modal") {
    values.title = "Title";
    values.body =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
  }
  return values;
}

/* ------------------------------------------------------------------ */
/* Controls (dogfooding CADS inputs)                                   */
/* ------------------------------------------------------------------ */

export function ControlField({
  prop,
  value,
  onChange,
  ignoreSkipList = false,
  exportName,
}: {
  prop: CadsPropDef;
  value: unknown;
  onChange: (next: unknown) => void;
  /** Nested item props may use names skipped at the top level (e.g. `value`). */
  ignoreSkipList?: boolean;
  exportName?: string;
}) {
  const kind = controlKind(prop, { ignoreSkipList, exportName });
  if (kind === "skip") return null;

  const labelText = `${prop.name}${prop.required ? " *" : ""}`;
  const hint = [prop.type, prop.description].filter(Boolean).join(" — ");

  if (kind === "enum") {
    const opts = parseEnumOptions(prop.type) ?? [];
    return (
      <div className={inspectorStyles.field} title={hint || undefined}>
        <Dropdown
          role="input"
          size="extraSmall"
          width="full"
          color="secondary"
          labelStyle="thin"
          label={labelText}
          showHelper={false}
          options={opts.map((opt) => ({ value: opt, label: opt }))}
          value={String(value ?? "")}
          onChange={(next) =>
            onChange(Array.isArray(next) ? next[0] : next)
          }
        />
      </div>
    );
  }

  if (kind === "boolean") {
    return (
      <div
        className={`${inspectorStyles.field} ${inspectorStyles.fieldToggle}`}
        title={hint || undefined}
      >
        <Toggle
          size="extraSmall"
          label={labelText}
          labelPlacement="right"
          checked={Boolean(value)}
          onChange={(_event, next) => onChange(next)}
        />
      </div>
    );
  }

  if (kind === "number") {
    return (
      <div className={inspectorStyles.field} title={hint || undefined}>
        <TextInput
          size="extraSmall"
          color="secondary"
          label={labelText}
          showHelper={false}
          value={value === "" || value == null ? "" : String(value)}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              onChange("");
              return;
            }
            const n = Number(raw);
            onChange(Number.isFinite(n) ? n : raw);
          }}
        />
      </div>
    );
  }

  return (
    <div className={inspectorStyles.field} title={hint || undefined}>
      <TextInput
        size="extraSmall"
        color="secondary"
        label={labelText}
        showHelper={false}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Code generation                                                     */
/* ------------------------------------------------------------------ */

type CodeLiteral = Record<string, string | number | boolean | undefined>;

/** Pretty-print a JSX object literal: `{ value: "a", label: "A" }`. */
function formatCodeObject(obj: CodeLiteral): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    if (typeof val === "boolean") {
      if (val) parts.push(`${key}: true`);
      continue;
    }
    if (typeof val === "number") {
      parts.push(`${key}: ${val}`);
      continue;
    }
    parts.push(`${key}: ${JSON.stringify(val)}`);
  }
  return `{ ${parts.join(", ")} }`;
}

/** Multi-line array prop for option/item sets, e.g.
 * `options={[
 *     { value: "a", label: "A" },
 *   ]}`
 * Leading indent is applied later when joining attrs.
 */
function formatArrayProp(name: string, items: CodeLiteral[]): string {
  if (items.length === 0) return `${name}={[]}`;
  const lines = items.map((item) => `    ${formatCodeObject(item)},`);
  return `${name}={[\n${lines.join("\n")}\n  ]}`;
}

export function propsToCode(
  exportName: string,
  values: Record<string, unknown>,
): string {
  const dropdownRole =
    exportName === "Dropdown" ? String(values.role ?? "input") : null;
  const attrs: string[] = [];
  for (const [key, val] of Object.entries(values)) {
    // Continuous slider: empty step field → step={null} in the snippet.
    if (
      exportName === "Slider" &&
      key === "step" &&
      (val === "" || val === null)
    ) {
      attrs.push("step={null}");
      continue;
    }
    if (val == null || val === "") continue;
    if (key === "children") continue;
    if (
      key === "dualToggle" ||
      key === "secondIconName" ||
      key === "secondColor" ||
      key === "secondAriaLabel" ||
      key === "secondToggle" ||
      key === "demoIcon" ||
      key === "demoIconName" ||
      key === "demoIconItem" ||
      key === "demoIconOnly" ||
      key === "demoItemIcons" ||
      key === "optionEdits" ||
      key === "startIcon" ||
      key === "endIcon" ||
      // Playground-only gate for Alert/Toast → emitted as iconName={false}.
      key === "hasIcon"
    ) {
      continue;
    }
    // Omit default text type; only emit type="password" when concealing.
    if (
      exportName === "TextInput" &&
      key === "type" &&
      (val === "text" || Boolean(values.multiline))
    ) {
      continue;
    }
    // Button icon-only: playground `iconName` → startIconName in output.
    if (exportName === "Button" && key === "iconName") continue;
    if (
      exportName === "Button" &&
      Boolean(values.iconOnly) &&
      (key === "startIconName" || key === "endIconName")
    ) {
      continue;
    }
    if (
      (key === "onIcon" || key === "offIcon") &&
      values.hasIcons === false
    ) {
      continue;
    }
    if (
      (key.endsWith("IconName") || key === "iconName") &&
      !hasIconName(val)
    ) {
      continue;
    }
    // Alert/Toast with hasIcon off: skip custom iconName (emitted as false below).
    if (
      (exportName === "Alert" || exportName === "Toast") &&
      key === "iconName" &&
      values.hasIcon === false
    ) {
      continue;
    }
    if (
      exportName === "Dialog" &&
      key === "topIconName" &&
      String(values.type ?? "default") !== "iconTop"
    ) {
      continue;
    }
    if (dropdownRole === "action" && DROPDOWN_INPUT_ONLY.has(key)) continue;
    if (dropdownRole === "input" && DROPDOWN_ACTION_ONLY.has(key)) continue;
    if (typeof val === "boolean") {
      if (val) attrs.push(key);
      continue;
    }
    if (typeof val === "number") {
      attrs.push(`${key}={${val}}`);
      continue;
    }
    attrs.push(`${key}=${JSON.stringify(String(val))}`);
  }

  if (
    (exportName === "Alert" || exportName === "Toast") &&
    values.hasIcon === false
  ) {
    attrs.push("iconName={false}");
  }

  if (exportName === "Button" && Boolean(values.iconOnly)) {
    const icon = iconNameValue(values.iconName) || "smile";
    attrs.push(`startIconName=${JSON.stringify(icon)}`);
    if (!attrs.some((a) => a.startsWith("aria-label=") || a === "aria-label")) {
      attrs.push(`aria-label=${JSON.stringify(icon)}`);
    }
  }

  if (exportName === "SegmentedButton") {
    attrs.push(
      formatArrayProp(
        "options",
        values.iconOnly
          ? [
              { value: "list", label: "List", iconName: "list" },
              { value: "grid", label: "Grid", iconName: "grid" },
            ]
          : [
              { value: "list", label: "List" },
              { value: "grid", label: "Grid" },
            ],
      ),
    );
  }

  if (exportName === "Dropdown") {
    const role = String(values.role ?? "input");
    if (role === "action") {
      attrs.push(
        formatArrayProp("options", [
          { value: "a", label: "Edit", iconName: "pen" },
          { value: "b", label: "Share", iconName: "share" },
          {
            value: "c",
            label: "Delete",
            iconName: "trash",
            destructive: true,
          },
        ]),
      );
    } else if (values.demoItemIcons) {
      attrs.push(
        formatArrayProp("options", [
          {
            value: "a",
            label: "Option A",
            iconName: "face-smile",
          },
          {
            value: "b",
            label: "Option B",
            iconName: "heart",
          },
        ]),
      );
    } else {
      attrs.push(
        formatArrayProp("options", [
          { value: "recent", label: "Recently updated" },
          { value: "name-asc", label: "Name A–Z" },
          { value: "created", label: "Date created" },
          { type: "separator" },
          { value: "custom", label: "Custom…" },
        ]),
      );
    }
  }

  if (exportName === "Breadcrumbs") {
    const items = buildDemoBreadcrumbItems(values);
    attrs.push(
      formatArrayProp(
        "items",
        items.map((item) => {
          const lit: CodeLiteral = { label: String(item.label) };
          if ("href" in item && item.href != null) lit.href = String(item.href);
          if ("iconName" in item && item.iconName) {
            lit.iconName = String(item.iconName);
          }
          if ("iconOnly" in item && item.iconOnly) lit.iconOnly = true;
          if ("current" in item && item.current) lit.current = true;
          return lit;
        }),
      ),
    );
    if (values.maxItems == null) attrs.push(`maxItems={4}`);
    if (values.itemsBeforeCollapse == null) attrs.push(`itemsBeforeCollapse={1}`);
    if (values.itemsAfterCollapse == null) attrs.push(`itemsAfterCollapse={2}`);
  }

  if (exportName === "Tabs") {
    attrs.push(
      formatArrayProp("items", [
        { value: "a", label: "Tab Label" },
        { value: "b", label: "Tab Label" },
        { value: "c", label: "Tab Label" },
      ]),
    );
    if (values.defaultValue == null) attrs.push(`defaultValue="a"`);
  }

  if (exportName === "Link") {
    if (!attrs.some((a) => a.startsWith("href=") || a === "href")) {
      attrs.push(`href="#link"`);
    }
  }

  if (exportName === "IconToggle" && values.dualToggle) {
    const secondIcon = String(values.secondIconName || "thumbs-down");
    const secondColor = String(values.secondColor || "error");
    const secondAria = String(values.secondAriaLabel || "Thumbs down");
    const label =
      values.label && String(values.label).trim()
        ? String(values.label)
        : "Was this helpful?";
    if (!attrs.some((a) => a.startsWith("label="))) {
      attrs.push(`label=${JSON.stringify(label)}`);
    }
    attrs.push(
      `secondToggle={{ iconName: ${JSON.stringify(secondIcon)}, color: ${JSON.stringify(secondColor)}, "aria-label": ${JSON.stringify(secondAria)} }}`,
    );
  }

  const indentedAttrs =
    attrs.length === 0
      ? ""
      : `\n${attrs.map((a) => `  ${a}`).join("\n")}\n`;

  if (exportName === "Button" && !values.iconOnly) {
    const label = String(values.children ?? "Continue");
    if (!attrs.length) return `<Button>${label}</Button>`;
    return `<Button${indentedAttrs}>
  ${label}
</Button>`;
  }
  if (exportName === "Link") {
    const label = String(values.children ?? "Link");
    if (!attrs.length) return `<Link href="#link">${label}</Link>`;
    return `<Link${indentedAttrs}>
  ${label}
</Link>`;
  }
  if (exportName === "Alert" || exportName === "Toast") {
    const message =
      String(values.children ?? "").trim() ||
      (exportName === "Alert" ? "This is an alert." : "This is a toast.");
    if (!attrs.length) return `<${exportName}>${message}</${exportName}>`;
    return `<${exportName}${indentedAttrs}>
  ${message}
</${exportName}>`;
  }
  if (exportName === "Radio") {
    const edits =
      values.optionEdits && typeof values.optionEdits === "object"
        ? (values.optionEdits as Record<string, Record<string, unknown>>)
        : {};
    const radios = [
      { slot: "a", value: "a", label: "Option A", defaultChecked: true },
      { slot: "b", value: "b", label: "Option B", defaultChecked: false },
      { slot: "c", value: "c", label: "Option C", defaultChecked: false },
    ].map((opt) => {
      const edit = edits[opt.slot] ?? {};
      return {
        value: String(edit.value ?? opt.value),
        label: String(edit.label ?? opt.label),
        disabled: Boolean(edit.disabled),
        defaultChecked: opt.defaultChecked,
      };
    });
    const shared =
      attrs.length === 0
        ? ""
        : `\n${attrs.map((a) => `    ${a}`).join("\n")}`;
    const lines = radios.map((opt) => {
      const extra = [
        opt.disabled ? " disabled" : "",
        opt.defaultChecked ? " defaultChecked" : "",
      ].join("");
      return `  <Radio name="choice" value=${JSON.stringify(opt.value)} label=${JSON.stringify(opt.label)}${extra}${shared} />`;
    });
    return `<>\n${lines.join("\n")}\n</>`;
  }
  if (exportName === "Tooltip") {
    if (!attrs.length) {
      return `<Tooltip>
  <Button>Hover me</Button>
</Tooltip>`;
    }
    return `<Tooltip${indentedAttrs}>
  <Button>Hover me</Button>
</Tooltip>`;
  }
  if (exportName === "Drawer") {
    return `<>
  <Button onClick={() => setOpen(true)}>Open drawer</Button>
  <Drawer
    open={open}
    onClose={() => setOpen(false)}${attrs.length ? `\n${attrs.map((a) => `    ${a}`).join("\n")}` : ""}
  />
</>`;
  }
  if (exportName === "Dialog") {
    return `<>
  <Button onClick={() => setOpen(true)}>Open dialog</Button>
  <Dialog
    open={open}
    onClose={() => setOpen(false)}${attrs.length ? `\n${attrs.map((a) => `    ${a}`).join("\n")}` : ""}
  />
</>`;
  }
  if (exportName === "Modal") {
    return `<>
  <Button onClick={() => setOpen(true)}>Open modal</Button>
  <Modal
    open={open}
    onClose={() => setOpen(false)}${attrs.length ? `\n${attrs.map((a) => `    ${a}`).join("\n")}` : ""}
  />
</>`;
  }
  if (exportName === "FieldWrapper") {
    if (!attrs.length) {
      return `<FieldWrapper>
  <TextInput placeholder="Nested control" />
</FieldWrapper>`;
    }
    return `<FieldWrapper${indentedAttrs}>
  <TextInput placeholder="Nested control" />
</FieldWrapper>`;
  }
  if (attrs.length === 0) return `<${exportName} />`;
  return `<${exportName}${indentedAttrs}/>`;
}

export function applyValueUpdate(
  exportName: string,
  prev: Record<string, unknown>,
  name: string,
  next: unknown,
): Record<string, unknown> {
  const updated: Record<string, unknown> = { ...prev, [name]: next };
  if (exportName === "Slider" && name === "startsFrom") {
    if (next === "center") {
      updated.min = -100;
      updated.max = 100;
      updated.defaultValue = 0;
    } else {
      updated.min = 0;
      updated.max = 100;
      updated.defaultValue = 50;
    }
  }
  // Turning on ticks with the default step=1 would paint ~101 labels — use a
  // coarser grid. Clearing step (empty) keeps continuous endpoint-only ticks.
  if (exportName === "Slider" && name === "showTicks" && next === true) {
    const min = Number(updated.min);
    const max = Number(updated.max);
    const span = max - min;
    const step =
      updated.step === "" || updated.step == null
        ? null
        : Number(updated.step);
    if (
      Number.isFinite(span) &&
      span > 0 &&
      step != null &&
      Number.isFinite(step) &&
      step > 0 &&
      span / step > 7
    ) {
      updated.step = span / 4;
    }
  }
  if (exportName === "Dialog" && name === "topIconName" && String(next ?? "").trim()) {
    updated.type = "iconTop";
  }
  if (
    exportName === "Dialog" &&
    name === "type" &&
    next === "iconTop" &&
    !iconNameValue(updated.topIconName)
  ) {
    updated.topIconName = "smile";
  }
  if (exportName === "Dropdown" && name === "role") {
    updated.label = next === "action" ? "Actions" : "Sort by";
    if (next === "action") {
      updated.menuType = "default";
      updated.demoItemIcons = false;
    }
  }
  if (exportName === "Dropdown" && name === "menuType" && next === "checklist") {
    updated.demoItemIcons = false;
  }
  // Password type is field-only; clear when switching to a multiline area.
  if (exportName === "TextInput" && name === "multiline" && next) {
    updated.type = "text";
  }
  if (exportName === "Button" && name === "iconOnly" && next) {
    if (!iconNameValue(updated.iconName)) updated.iconName = "smile";
  }
  return updated;
}
