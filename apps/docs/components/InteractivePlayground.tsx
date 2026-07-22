"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { CadsComponentManifest } from "@codeai/cads-react/manifest";
import {
  ComponentPreview,
  hasComponentPreview,
} from "./playground/ComponentPreview";
import {
  ControlField,
  DROPDOWN_ACTION_ONLY,
  DROPDOWN_INPUT_ONLY,
  GROUP_LABELS,
  applyValueUpdate,
  controlKind,
  initialValues,
  orderedControls,
  propsToCode,
} from "./playground/propControls";
import { CopyButton } from "./CopyControls";

const LivePlayground = dynamic(
  () => import("./LivePlayground").then((m) => m.LivePlayground),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: 80 }} aria-hidden />,
  },
);

export function InteractivePlayground({
  component,
}: {
  component: CadsComponentManifest;
}) {
  const [values, setValues] = useState(() => initialValues(component));
  const groups = useMemo(() => {
    const role = String(values.role ?? "input");
    return orderedControls(
      component.props.filter((p) => {
        if (controlKind(p) === "skip") return false;
        if (component.exportName !== "Dropdown") return true;
        if (role === "action" && DROPDOWN_INPUT_ONLY.has(p.name)) return false;
        if (role === "input" && DROPDOWN_ACTION_ONLY.has(p.name)) return false;
        return true;
      }),
    );
  }, [component, values.role]);
  const code = propsToCode(component.exportName, values);
  const canPreview = hasComponentPreview(component.exportName);

  if (!canPreview) {
    return <LivePlayground code={component.example} />;
  }

  const setValue = (name: string, next: unknown) =>
    setValues((prev) =>
      applyValueUpdate(component.exportName, prev, name, next),
    );

  return (
    <div className="docs-playground">
      <div className="docs-playground-grid">
        <div
          className="docs-playground-stage"
          style={
            values.fullWidth ? { justifyContent: "stretch" } : undefined
          }
        >
          <div
            key={`defaultChecked:${String(values.defaultChecked)}:defaultOpen:${String(values.defaultOpen)}`}
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
        <div className="docs-playground-panel">
          <div className="docs-playground-panel-header">
            <span className="docs-overline">Props</span>
            <button
              type="button"
              className="docs-copy-btn"
              style={{ position: "static" }}
              onClick={() => setValues(initialValues(component))}
            >
              Reset
            </button>
          </div>
          <div>
            {groups.map(({ group, props }) => (
              <section key={group} className="docs-inspector-section">
                {groups.length > 1 ? (
                  <h4 className="docs-inspector-title">
                    {GROUP_LABELS[group]}
                  </h4>
                ) : null}
                {props.map((prop) => (
                  <ControlField
                    key={prop.name}
                    prop={prop}
                    value={values[prop.name]}
                    onChange={(next) => setValue(prop.name, next)}
                  />
                ))}
              </section>
            ))}
            {component.exportName === "Dropdown" &&
            values.role !== "action" &&
            values.menuType !== "checklist" ? (
              <section className="docs-inspector-section">
                <h4 className="docs-inspector-title">
                  Menu items (playground)
                </h4>
                <ControlField
                  prop={{
                    name: "demoItemIcons",
                    type: "boolean",
                    description:
                      "Preview options with startIcon + iconName (otherwise text-only + group + separator)",
                  }}
                  value={values.demoItemIcons}
                  onChange={(next) =>
                    setValues((prev) => ({ ...prev, demoItemIcons: next }))
                  }
                />
              </section>
            ) : null}
            {component.exportName === "Breadcrumbs" ? (
              <section className="docs-inspector-section">
                <h4 className="docs-inspector-title">
                  Item icon (playground)
                </h4>
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
                        description:
                          "items[].iconOnly — hide label, keep a11y name",
                      }}
                      value={values.demoIconOnly}
                      onChange={(next) =>
                        setValues((prev) => ({ ...prev, demoIconOnly: next }))
                      }
                    />
                  </>
                ) : null}
              </section>
            ) : null}
            {component.exportName === "IconToggle" ? (
              <section className="docs-inspector-section">
                <h4 className="docs-inspector-title">
                  Dual toggle (playground)
                </h4>
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
                    <p className="docs-inspector-note">
                      First toggle — use color / iconName / aria-label above
                    </p>
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
              </section>
            ) : null}
          </div>
        </div>
      </div>
      <div className="docs-playground-code">
        <div style={{ position: "relative", padding: "12px 16px" }}>
          <pre
            style={{
              margin: 0,
              padding: 0,
              border: "none",
              background: "transparent",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              whiteSpace: "pre-wrap",
              color: "var(--text-neutral-primary)",
            }}
          >
            {code}
          </pre>
          <CopyButton text={code} />
        </div>
      </div>
    </div>
  );
}
