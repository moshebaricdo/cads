"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { CadsComponentManifest, CadsPropDef } from "@codeai/cads-react/manifest";
import {
  Button,
  SegmentedButton,
  IconToggle,
  FieldWrapper,
  TextInput,
  Dropdown,
  Checkbox,
  Radio,
  Tag,
  Tooltip,
} from "@codeai/cads-react";
import type { FaIconName } from "@codeai/cads-react/icons";
import { LivePlayground } from "./LivePlayground";

/** Props that are driven by interaction / too complex for simple controls. */
const SKIP_PROPS = new Set([
  "onChange",
  "onPressedChange",
  "onClick",
  "onAction",
  "onOpenChange",
  "sx",
  "className",
  "style",
  "ref",
  "secondToggle",
  "options",
  "children",
  "value",
  "pressed",
  "checked",
  "htmlFor",
  // Open state is driven by clicking the trigger; controlled `open` in the
  // panel would freeze the menu (no onOpenChange wiring).
  "open",
  "defaultOpen",
]);

const DEMO_DROPDOWN_OPTIONS = [
  { value: "a", label: "Option A", iconName: "face-smile" as FaIconName },
  { value: "b", label: "Option B", iconName: "heart" as FaIconName },
  { value: "c", label: "Option C", iconName: "star" as FaIconName },
  {
    value: "danger",
    label: "Delete",
    iconName: "trash" as FaIconName,
    destructive: true,
  },
];

function parseEnumOptions(type: string): string[] | null {
  const parts = type
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;
  const values: string[] = [];
  for (const part of parts) {
    const m = part.match(/^["']([^"']+)["']$/);
    if (!m) return null;
    values.push(m[1]);
  }
  return values;
}

function parseDefault(raw: string | undefined): unknown {
  if (raw == null) return undefined;
  const t = raw.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
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
    t.startsWith("ReactNode") ||
    // Manifest prose unions that should still get a text control
    t.includes("CSS length") ||
    /\|\s*string\b/.test(t)
  );
}

function controlKind(
  prop: CadsPropDef,
): "enum" | "boolean" | "text" | "skip" {
  if (SKIP_PROPS.has(prop.name)) return "skip";
  if (prop.type.includes("=>") || prop.type.includes("[]")) return "skip";
  if (prop.type.includes("ReactElement")) return "skip";
  if (parseEnumOptions(prop.type)) return "enum";
  if (isBooleanType(prop.type)) return "boolean";
  if (isStringyType(prop.type)) return "text";
  return "skip";
}

function initialValues(component: CadsComponentManifest): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const prop of component.props) {
    const kind = controlKind(prop);
    if (kind === "skip") continue;
    const def = parseDefault(prop.default);
    if (def !== undefined) {
      values[prop.name] = def;
      continue;
    }
    if (kind === "boolean") values[prop.name] = false;
    else if (kind === "enum") {
      const opts = parseEnumOptions(prop.type);
      values[prop.name] = opts?.[0] ?? "";
    } else if (kind === "text") {
      if (prop.name === "children" || prop.name === "label") {
        values[prop.name] =
          component.exportName === "Button" ? "Continue" : "Label";
      } else if (prop.name === "iconName" || prop.name === "startIconName") {
        // Figma placeholder shortcode (`smile` → face-smile via FaIcon alias).
        values[prop.name] = "smile";
      } else if (prop.name === "title") {
        values[prop.name] = "Tooltip";
      } else if (prop.name === "aria-label") {
        values[prop.name] = component.name;
      } else {
        values[prop.name] = "";
      }
    }
  }

  // Component-specific seeds
  if (component.exportName === "SegmentedButton") {
    values.defaultValue = "list";
  }
  if (component.exportName === "IconToggle") {
    if (values.iconName == null) values.iconName = "smile";
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
  }
  if (component.exportName === "Dropdown") {
    values.role = values.role || "input";
    values.label = values.role === "action" ? "Actions" : "Sort";
    values.placeholder = "Select…";
    values.helperText = "";
    values.width = values.width || "hug";
    values["aria-label"] = "Dropdown";
  }
  return values;
}

function ControlField({
  prop,
  value,
  onChange,
}: {
  prop: CadsPropDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const kind = controlKind(prop);
  if (kind === "skip") return null;

  const label = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 6,
        gap: 8,
      }}
    >
      <label
        htmlFor={`ctrl-${prop.name}`}
        style={{
          fontSize: "var(--text-body-sm)",
          fontWeight: 600,
          color: "var(--text-neutral-primary)",
        }}
      >
        {prop.name}
        {prop.required ? " *" : ""}
      </label>
      <code
        style={{
          fontSize: "var(--text-body-xxs)",
          color: "var(--text-neutral-tertiary)",
        }}
      >
        {prop.type.length > 40 ? `${prop.type.slice(0, 37)}…` : prop.type}
      </code>
    </div>
  );

  const fieldStyle: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body-sm)",
    padding: "8px 10px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-neutral-secondary)",
    background: "var(--background-neutral-primary)",
    color: "var(--text-neutral-primary)",
  };

  if (kind === "enum") {
    const opts = parseEnumOptions(prop.type) ?? [];
    return (
      <div style={{ marginBottom: 14 }}>
        {label}
        <select
          id={`ctrl-${prop.name}`}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          style={fieldStyle}
        >
          {opts.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (kind === "boolean") {
    return (
      <div
        style={{
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <label
          htmlFor={`ctrl-${prop.name}`}
          style={{
            fontSize: "var(--text-body-sm)",
            fontWeight: 600,
          }}
        >
          {prop.name}
        </label>
        <button
          id={`ctrl-${prop.name}`}
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          style={{
            width: 44,
            height: 26,
            borderRadius: "var(--radius-round)",
            border: "1px solid var(--border-neutral-secondary)",
            background: value
              ? "var(--background-selected-primary)"
              : "var(--background-neutral-tertiary)",
            padding: 2,
            cursor: "pointer",
            transition: "var(--transition-colors)",
            position: "relative",
          }}
        >
          <span
            style={{
              display: "block",
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "var(--background-neutral-primary)",
              transform: value ? "translateX(18px)" : "translateX(0)",
              transition: "transform var(--duration-short) var(--easing-standard)",
              boxShadow: "var(--shadow-sm)",
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 14 }}>
      {label}
      <input
        id={`ctrl-${prop.name}`}
        type="text"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        style={fieldStyle}
      />
    </div>
  );
}

function renderComponent(
  exportName: string,
  values: Record<string, unknown>,
): ReactNode {
  const v = values;

  switch (exportName) {
    case "Button": {
      const startIcon = String(v.startIconName ?? "").trim();
      const endIcon = String(v.endIconName ?? "").trim();
      return (
        <Button
          variant={v.variant as "contained" | "outlined" | "text" | undefined}
          color={
            v.color as "primary" | "secondary" | "tertiary" | "error" | undefined
          }
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          iconOnly={Boolean(v.iconOnly)}
          startIconName={(startIcon || undefined) as FaIconName | undefined}
          endIconName={(endIcon || undefined) as FaIconName | undefined}
          disabled={Boolean(v.disabled)}
          fullWidth={Boolean(v.fullWidth)}
        >
          {v.iconOnly ? null : String(v.children ?? "Continue")}
        </Button>
      );
    }
    case "SegmentedButton":
      return (
        <SegmentedButton
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          disabled={Boolean(v.disabled)}
          iconOnly={Boolean(v.iconOnly)}
          aria-label={String(v["aria-label"] || "Options")}
          defaultValue={String(v.defaultValue || "list")}
          options={
            v.iconOnly
              ? [
                  { value: "list", label: "List", iconName: "list" as FaIconName },
                  { value: "grid", label: "Grid", iconName: "grid" as FaIconName },
                  { value: "table", label: "Table", iconName: "table" as FaIconName },
                ]
              : [
                  { value: "list", label: "List", iconName: "list" as FaIconName },
                  { value: "grid", label: "Grid", iconName: "grid" as FaIconName },
                  { value: "table", label: "Table" },
                ]
          }
        />
      );
    case "IconToggle": {
      const dual = Boolean(v.dualToggle);
      const firstIcon = String(v.iconName ?? "").trim() || "smile";
      const secondIcon = String(v.secondIconName ?? "").trim() || "thumbs-down";
      const firstColor =
        (v.color as
          | "primary"
          | "secondary"
          | "brand"
          | "success"
          | "error"
          | undefined) ?? (dual ? "success" : "brand");
      const secondColor =
        (v.secondColor as
          | "primary"
          | "secondary"
          | "brand"
          | "success"
          | "error"
          | undefined) ?? "error";
      const labelText = v.label ? String(v.label) : undefined;
      return (
        <IconToggle
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          color={firstColor}
          iconName={firstIcon as FaIconName}
          defaultPressed={Boolean(v.defaultPressed)}
          disabled={Boolean(v.disabled)}
          label={dual ? labelText || "Was this helpful?" : labelText}
          exclusive={Boolean(v.exclusive)}
          aria-label={String(
            v["aria-label"] || (dual ? "Thumbs up" : "Toggle"),
          )}
          secondToggle={
            dual
              ? {
                  iconName: secondIcon as FaIconName,
                  color: secondColor,
                  "aria-label": String(
                    v.secondAriaLabel || "Thumbs down",
                  ),
                }
              : undefined
          }
        />
      );
    }
    case "FieldWrapper":
      return (
        <FieldWrapper
          label={String(v.label ?? "Email")}
          helperText={
            v.helperText ? String(v.helperText) : undefined
          }
          helperIconName={
            (String(v.helperIconName ?? "").trim() || undefined) as
              | FaIconName
              | undefined
          }
          showHelper={v.showHelper !== false}
          sentiment={
            v.sentiment as
              | "default"
              | "success"
              | "warning"
              | "error"
              | undefined
          }
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          disabled={Boolean(v.disabled)}
        >
          <TextInput placeholder="Nested control" />
        </FieldWrapper>
      );
    case "TextInput":
      return (
        <TextInput
          label={String(v.label ?? "Email")}
          size={
            v.size as "large" | "medium" | "small" | "extraSmall" | undefined
          }
          color={v.color as "primary" | "secondary" | undefined}
          multiline={Boolean(v.multiline)}
          disabled={Boolean(v.disabled)}
          error={Boolean(v.error)}
          readOnly={Boolean(v.readOnly)}
          sentiment={
            v.sentiment as
              | "default"
              | "success"
              | "warning"
              | "error"
              | undefined
          }
          helperText={
            v.helperText ? String(v.helperText) : undefined
          }
          helperIconName={
            (String(v.helperIconName ?? "").trim() || undefined) as
              | FaIconName
              | undefined
          }
          placeholder={
            v.placeholder ? String(v.placeholder) : "you@example.com"
          }
          defaultValue={
            v.defaultValue ? String(v.defaultValue) : undefined
          }
          rows={typeof v.rows === "number" ? v.rows : undefined}
        />
      );
    case "Dropdown": {
      const role = (v.role as "input" | "action" | undefined) ?? "input";
      const size = v.size as
        | "large"
        | "medium"
        | "small"
        | "extraSmall"
        | undefined;
      const menuType = (v.menuType as "icon" | "checklist" | undefined) ?? "icon";
      const menuPlacement = v.menuPlacement as
        | "bottomLeft"
        | "bottomRight"
        | "topLeft"
        | "topRight"
        | undefined;
      if (role === "action") {
        return (
          <Dropdown
            role="action"
            size={size}
            menuType="icon"
            menuPlacement={menuPlacement}
            label={String(v.label ?? "Actions")}
            startIconName={
              (String(v.startIconName ?? "").trim() || undefined) as
                | FaIconName
                | undefined
            }
            buttonVariant={
              v.buttonVariant as
                | "contained"
                | "outlined"
                | "text"
                | undefined
            }
            buttonColor={
              v.buttonColor as
                | "primary"
                | "secondary"
                | "tertiary"
                | "error"
                | undefined
            }
            disabled={Boolean(v.disabled)}
            defaultOpen={Boolean(v.defaultOpen)}
            options={DEMO_DROPDOWN_OPTIONS}
            aria-label={String(v["aria-label"] || "Actions")}
          />
        );
      }
      const widthRaw = String(v.width ?? "hug").trim() || "hug";
      const width =
        widthRaw === "hug" || widthRaw === "full"
          ? widthRaw
          : /^\d+(\.\d+)?$/.test(widthRaw)
            ? Number(widthRaw)
            : widthRaw;
      return (
        <Dropdown
          role="input"
          size={size}
          menuType={menuType}
          menuPlacement={menuPlacement}
          width={width}
          label={String(v.label ?? "Sort")}
          helperText={
            v.helperText ? String(v.helperText) : undefined
          }
          placeholder={String(v.placeholder ?? "Select…")}
          color={v.color as "primary" | "secondary" | undefined}
          labelStyle={v.labelStyle as "thick" | "thin" | undefined}
          startIconName={
            (String(v.startIconName ?? "").trim() || undefined) as
              | FaIconName
              | undefined
          }
          disabled={Boolean(v.disabled)}
          readOnly={Boolean(v.readOnly)}
          error={Boolean(v.error)}
          defaultOpen={Boolean(v.defaultOpen)}
          options={DEMO_DROPDOWN_OPTIONS.filter((o) => !o.destructive)}
          aria-label={String(v["aria-label"] || "Sort")}
        />
      );
    }
    case "Checkbox":
      return (
        <Checkbox
          label={String(v.label ?? "Remember me")}
          size={v.size as "medium" | "small" | undefined}
          disabled={Boolean(v.disabled)}
        />
      );
    case "Radio":
      return (
        <Radio
          label={String(v.label ?? "Option A")}
          value="a"
          size={v.size as "medium" | "small" | undefined}
          disabled={Boolean(v.disabled)}
        />
      );
    case "Tag":
      return (
        <Tag
          tone={
            v.tone as
              | "neutral"
              | "brand"
              | "success"
              | "warning"
              | "error"
              | "info"
              | undefined
          }
          size={v.size as "medium" | "small" | undefined}
          label={String(v.label ?? "Tag")}
          iconName={(v.iconName as FaIconName) || undefined}
        />
      );
    case "Tooltip":
      return (
        <Tooltip title={String(v.title ?? "Tooltip")}>
          <Button size="medium">Hover me</Button>
        </Tooltip>
      );
    default:
      return null;
  }
}

function propsToCode(
  exportName: string,
  values: Record<string, unknown>,
): string {
  const attrs: string[] = [];
  for (const [key, val] of Object.entries(values)) {
    if (val == null || val === "") continue;
    if (key === "children") continue;
    // Playground-only / object props rendered specially below
    if (
      key === "dualToggle" ||
      key === "secondIconName" ||
      key === "secondColor" ||
      key === "secondAriaLabel" ||
      key === "secondToggle"
    ) {
      continue;
    }
    if (typeof val === "boolean") {
      if (val) attrs.push(key);
      continue;
    }
    attrs.push(`${key}=${JSON.stringify(String(val))}`);
  }

  if (exportName === "SegmentedButton") {
    const opts = values.iconOnly
      ? `[{value:"list",label:"List",iconName:"list"},{value:"grid",label:"Grid",iconName:"grid"}]`
      : `[{value:"list",label:"List"},{value:"grid",label:"Grid"}]`;
    attrs.push(`options={${opts}}`);
  }

  if (exportName === "Dropdown") {
    attrs.push(
      `options={[{value:"a",label:"Option A"},{value:"b",label:"Option B"}]}`,
    );
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

  const attrStr = attrs.length ? ` ${attrs.join(" ")}` : "";
  if (exportName === "Button" && !values.iconOnly) {
    return `<Button${attrStr}>${String(values.children ?? "Continue")}</Button>`;
  }
  if (exportName === "Tooltip") {
    return `<Tooltip${attrStr}><Button>Hover me</Button></Tooltip>`;
  }
  if (exportName === "FieldWrapper") {
    return `<FieldWrapper${attrStr}><TextInput placeholder="Nested control" /></FieldWrapper>`;
  }
  return `<${exportName}${attrStr} />`;
}

export function InteractivePlayground({
  component,
}: {
  component: CadsComponentManifest;
}) {
  const controllable = useMemo(
    () => component.props.filter((p) => controlKind(p) !== "skip"),
    [component],
  );
  const [values, setValues] = useState(() => initialValues(component));
  const preview = renderComponent(component.exportName, values);
  const code = propsToCode(component.exportName, values);

  if (preview == null) {
    return <LivePlayground code={component.example} />;
  }

  return (
    <div
      style={{
        border: "1px solid var(--border-neutral-primary)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(240px, 300px)",
        }}
        className="cads-playground-grid"
      >
        <div
          style={{
            padding: 28,
            background: "var(--background-neutral-primary)",
            minHeight: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            borderRight: "1px solid var(--border-neutral-primary)",
          }}
        >
          {preview}
        </div>
        <div
          style={{
            padding: 16,
            background: "var(--background-neutral-secondary)",
            maxHeight: 420,
            overflow: "auto",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-body-xs)",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--text-neutral-secondary)",
              marginBottom: 12,
            }}
          >
            Props
          </div>
          {controllable.map((prop) => (
            <ControlField
              key={prop.name}
              prop={prop}
              value={values[prop.name]}
              onChange={(next) =>
                setValues((prev) => ({ ...prev, [prop.name]: next }))
              }
            />
          ))}
          {component.exportName === "IconToggle" ? (
            <>
              <ControlField
                prop={{
                  name: "dualToggle",
                  type: "boolean",
                  description:
                    "Preview Figma Icon Toggle + Label with two toggles",
                }}
                value={values.dualToggle}
                onChange={(next) =>
                  setValues((prev) => ({
                    ...prev,
                    dualToggle: next,
                    label:
                      next && !String(prev.label || "").trim()
                        ? "Was this helpful?"
                        : prev.label,
                    // Thumbs up/down seed: per-toggle colors + exclusive.
                    iconName: next ? "thumbs-up" : prev.iconName || "smile",
                    color: next ? "success" : prev.color,
                    secondIconName: "thumbs-down",
                    secondColor: "error",
                    secondAriaLabel: "Thumbs down",
                    exclusive: next ? true : prev.exclusive,
                    "aria-label": next
                      ? "Thumbs up"
                      : prev["aria-label"] || component.name,
                  }))
                }
              />
              {values.dualToggle ? (
                <>
                  <div
                    style={{
                      fontSize: "var(--text-body-xxs)",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--text-neutral-secondary)",
                      margin: "4px 0 10px",
                    }}
                  >
                    First toggle — use color / iconName / aria-label above
                  </div>
                  <ControlField
                    prop={{
                      name: "secondIconName",
                      type: "FaIconName",
                      description: "secondToggle.iconName",
                    }}
                    value={values.secondIconName}
                    onChange={(next) =>
                      setValues((prev) => ({
                        ...prev,
                        secondIconName: next,
                      }))
                    }
                  />
                  <ControlField
                    prop={{
                      name: "secondColor",
                      type: '"primary" | "secondary" | "brand" | "success" | "error"',
                      description: "secondToggle.color (independent)",
                    }}
                    value={values.secondColor}
                    onChange={(next) =>
                      setValues((prev) => ({ ...prev, secondColor: next }))
                    }
                  />
                  <ControlField
                    prop={{
                      name: "secondAriaLabel",
                      type: "string",
                      description: "secondToggle aria-label",
                    }}
                    value={values.secondAriaLabel}
                    onChange={(next) =>
                      setValues((prev) => ({
                        ...prev,
                        secondAriaLabel: next,
                      }))
                    }
                  />
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid var(--border-neutral-primary)",
          background: "var(--background-neutral-secondary)",
          padding: "12px 16px",
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            whiteSpace: "pre-wrap",
            color: "var(--text-neutral-primary)",
          }}
        >
          {code}
        </pre>
      </div>
      <style>{`
        @media (max-width: 720px) {
          .cads-playground-grid {
            grid-template-columns: 1fr !important;
          }
          .cads-playground-grid > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid var(--border-neutral-primary);
          }
        }
      `}</style>
    </div>
  );
}
