"use client";

import dynamic from "next/dynamic";
import {
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import type { CadsComponentManifest, CadsPropDef } from "@codeai/cads-react/manifest";
import {
  ComponentPreview,
  hasComponentPreview,
} from "./playground/ComponentPreview";
import { buildDemoBreadcrumbItems } from "./playground/previews/shared";

const LivePlayground = dynamic(
  () => import("./LivePlayground").then((m) => m.LivePlayground),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: 80 }} aria-hidden />,
  },
);

/** Props that are driven by interaction / too complex for simple controls. */
const SKIP_PROPS = new Set([
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
  "children",
  "value",
  "pressed",
  "checked",
  "htmlFor",
  "onItemDismiss",
  "href",
  // Open state is driven by clicking the trigger; controlled `open` in the
  // panel would freeze the menu (no onOpenChange wiring).
  "open",
  "defaultOpen",
  "surfaceOnly",
  "image",
  "customContent",
]);

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

function isNumberType(type: string) {
  return type.trim() === "number";
}

function controlKind(
  prop: CadsPropDef,
): "enum" | "boolean" | "text" | "number" | "skip" {
  if (SKIP_PROPS.has(prop.name)) return "skip";
  if (prop.type.includes("=>") || prop.type.includes("[]")) return "skip";
  if (prop.type.includes("ReactElement")) return "skip";
  if (parseEnumOptions(prop.type)) return "enum";
  if (isBooleanType(prop.type)) return "boolean";
  if (isNumberType(prop.type)) return "number";
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
    }     else if (kind === "number") {
      values[prop.name] = "";
    } else if (kind === "text") {
      if (prop.name === "children" || prop.name === "label") {
        values[prop.name] =
          component.exportName === "Button" ? "Continue" : "Label";
      } else if (prop.name === "iconName" || prop.name === "startIconName") {
        // Figma placeholder shortcode (`smile` → face-smile via FaIcon alias).
        values[prop.name] = "smile";
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

  // Component-specific seeds
  if (component.exportName === "Breadcrumbs") {
    // Demo the Figma overflow pattern: Home > … > Detail > Current
    values.maxItems = 4;
    values.itemsBeforeCollapse = 1;
    values.itemsAfterCollapse = 2;
    // Playground-only: optional leading icon on any crumb (Detail stays
    // visible with the default overflow collapse so the icon is obvious).
    values.demoIcon = true;
    values.demoIconName = "box-archive";
    values.demoIconItem = "Detail";
    values.demoIconOnly = false;
  }
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
  if (component.exportName === "Slider") {
    values.label = values.label || "Field label";
    values.helperText = values.helperText ?? "Helper text";
    values.width = values.width || "300";
    values.fullWidth = values.fullWidth ?? false;
    values.startsFrom = values.startsFrom || "side";
    const center = values.startsFrom === "center";
    values.min = values.min ?? (center ? -100 : 0);
    values.max = values.max ?? 100;
    values.defaultValue = values.defaultValue ?? 0;
    values.step = values.step ?? 1;
  }
  // Alert/Toast: leave iconName empty so status-sentiment defaults apply
  // (playground "smile" seed would force face-smile on every sentiment).
  if (
    component.exportName === "Alert" ||
    component.exportName === "Toast"
  ) {
    values.iconName = "";
  }
  if (component.exportName === "Popover") {
    values.title = "Popover title";
    values.body =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.";
    if (!values.stepperText) values.stepperText = "1/3";
  }
  if (component.exportName === "Dialog") {
    values.title = "Dialog Title";
    if (!values.topIconName) values.topIconName = "smile";
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

  if (kind === "number") {
    return (
      <div style={{ marginBottom: 14 }}>
        {label}
        <input
          id={`ctrl-${prop.name}`}
          type="number"
          min={0}
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
          style={fieldStyle}
        />
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
      key === "secondToggle" ||
      key === "demoIcon" ||
      key === "demoIconName" ||
      key === "demoIconItem" ||
      key === "demoIconOnly"
    ) {
      continue;
    }
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

  if (exportName === "Breadcrumbs") {
    const items = buildDemoBreadcrumbItems(values);
    const itemLiterals = items.map((item) => {
      const parts = [`label:${JSON.stringify(item.label)}`];
      if ("href" in item && item.href != null) {
        parts.push(`href:${JSON.stringify(item.href)}`);
      }
      if ("iconName" in item && item.iconName) {
        parts.push(`iconName:${JSON.stringify(String(item.iconName))}`);
      }
      if ("iconOnly" in item && item.iconOnly) parts.push("iconOnly:true");
      if ("current" in item && item.current) parts.push("current:true");
      return `{${parts.join(",")}}`;
    });
    attrs.push(`items={[${itemLiterals.join(",")}]}`);
    if (values.maxItems == null) attrs.push(`maxItems={4}`);
    if (values.itemsBeforeCollapse == null) attrs.push(`itemsBeforeCollapse={1}`);
    if (values.itemsAfterCollapse == null) attrs.push(`itemsAfterCollapse={2}`);
  }

  if (exportName === "Tabs") {
    attrs.push(
      `items={[{value:"a",label:"Tab Label"},{value:"b",label:"Tab Label"},{value:"c",label:"Tab Label"}]}`,
    );
    if (values.defaultValue == null) attrs.push(`defaultValue="a"`);
  }

  if (exportName === "Link") {
    attrs.push(`href="#link"`);
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
  if (exportName === "Drawer") {
    return `<>
  <Button onClick={() => setOpen(true)}>Open drawer</Button>
  <Drawer open={open} onClose={() => setOpen(false)}${attrStr} />
</>`;
  }
  if (exportName === "Dialog") {
    return `<>
  <Button onClick={() => setOpen(true)}>Open dialog</Button>
  <Dialog open={open} onClose={() => setOpen(false)}${attrStr} />
</>`;
  }
  if (exportName === "Modal") {
    return `<>
  <Button onClick={() => setOpen(true)}>Open modal</Button>
  <Modal open={open} onClose={() => setOpen(false)}${attrStr} />
</>`;
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
  const code = propsToCode(component.exportName, values);
  const canPreview = hasComponentPreview(component.exportName);

  if (!canPreview) {
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
            justifyContent: values.fullWidth ? "stretch" : "center",
            gap: 12,
            flexWrap: "wrap",
            borderRight: "1px solid var(--border-neutral-primary)",
          }}
        >
          {/* Remount when defaultChecked changes — uncontrolled defaults only apply on mount.
              Stretch wrapper so fullWidth components can fill the preview stage. */}
          <div
            key={`defaultChecked:${String(values.defaultChecked)}`}
            style={
              values.fullWidth
                ? { width: "100%", minWidth: 0 }
                : undefined
            }
          >
            <ComponentPreview
              exportName={component.exportName}
              values={values}
            />
          </div>
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
                setValues((prev) => {
                  const updated: Record<string, unknown> = {
                    ...prev,
                    [prop.name]: next,
                  };
                  // Bipolar vs side ranges when toggling Slider startsFrom.
                  if (
                    component.exportName === "Slider" &&
                    prop.name === "startsFrom"
                  ) {
                    if (next === "center") {
                      updated.min = -100;
                      updated.max = 100;
                      updated.defaultValue = 0;
                    } else {
                      updated.min = 0;
                      updated.max = 100;
                      updated.defaultValue = 0;
                    }
                  }
                  // topIconName only renders for iconTop — switch type so the
                  // playground control is never a no-op.
                  if (
                    component.exportName === "Dialog" &&
                    prop.name === "topIconName" &&
                    String(next ?? "").trim()
                  ) {
                    updated.type = "iconTop";
                  }
                  if (
                    component.exportName === "Dialog" &&
                    prop.name === "type" &&
                    next === "iconTop" &&
                    !updated.topIconName
                  ) {
                    updated.topIconName = "smile";
                  }
                  return updated;
                })
              }
            />
          ))}
          {component.exportName === "Breadcrumbs" ? (
            <>
              <div
                style={{
                  fontSize: "var(--text-body-xxs)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--text-neutral-secondary)",
                  margin: "8px 0 10px",
                }}
              >
                Item icon (playground)
              </div>
              <ControlField
                prop={{
                  name: "demoIcon",
                  type: "boolean",
                  description:
                    "Optional leading iconName on any crumb (items[].iconName)",
                }}
                value={values.demoIcon}
                onChange={(next) =>
                  setValues((prev) => ({ ...prev, demoIcon: next }))
                }
              />
              {values.demoIcon ? (
                <>
                  <ControlField
                    prop={{
                      name: "demoIconItem",
                      type: '"Home" | "Products" | "Category" | "Subsection" | "Detail" | "Current"',
                      description: "Which trail item receives the icon",
                    }}
                    value={values.demoIconItem}
                    onChange={(next) =>
                      setValues((prev) => ({ ...prev, demoIconItem: next }))
                    }
                  />
                  <ControlField
                    prop={{
                      name: "demoIconName",
                      type: "FaIconName",
                      description: "items[].iconName",
                    }}
                    value={values.demoIconName}
                    onChange={(next) =>
                      setValues((prev) => ({ ...prev, demoIconName: next }))
                    }
                  />
                  <ControlField
                    prop={{
                      name: "demoIconOnly",
                      type: "boolean",
                      description: "items[].iconOnly — hide label, keep a11y name",
                    }}
                    value={values.demoIconOnly}
                    onChange={(next) =>
                      setValues((prev) => ({ ...prev, demoIconOnly: next }))
                    }
                  />
                </>
              ) : null}
            </>
          ) : null}
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
