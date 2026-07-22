"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { CadsComponentManifest } from "@codeai/cads-react/manifest";
import { Button, Tabs, Toggle } from "@codeai/cads-react";
import { ComponentPreview } from "./playground/ComponentPreview";
import { PlaygroundInspectOverlay } from "./playground/PlaygroundInspectOverlay";
import { highlightJsx } from "./playground/highlightJsx";
import {
  ControlField,
  DROPDOWN_ACTION_ONLY,
  DROPDOWN_INPUT_ONLY,
  GROUP_LABELS,
  applyValueUpdate,
  controlKind,
  initialValues,
  isPropVisible,
  orderedControls,
  playgroundExtraProps,
  propsToCode,
} from "./playground/propControls";
import { CopyCodeIconButton } from "./CopyControls";
import { NESTED_PLAYGROUND_TARGETS } from "@/lib/propSheets";
import styles from "./TemplatePlayground.module.css";

type Tab = "preview" | "code";

type NestedSelection = {
  targetId: string;
  itemValue: string;
  values: Record<string, unknown>;
} | null;

function readOptionEdits(
  values: Record<string, unknown>,
): Record<string, Record<string, unknown>> {
  const raw = values.optionEdits;
  if (raw && typeof raw === "object") {
    return raw as Record<string, Record<string, unknown>>;
  }
  return {};
}

/** Nested playground hit-targets (Dropdown menu items + preview wrappers). */
const NESTED_ITEM_SELECTOR =
  "[data-cads-nested-item], [data-cads-dropdown-item]";

function nestedTargetId(el: HTMLElement): string | null {
  const explicit = el.getAttribute("data-nested-target");
  if (explicit) return explicit;
  if (el.hasAttribute("data-cads-dropdown-item")) return "menuItem";
  return null;
}

/** ⌥/Alt-click — avoids macOS ⌘-hover link/tool previews. */
function isNestedEditModifier(event: {
  altKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
}): boolean {
  return event.altKey && !event.metaKey && !event.ctrlKey;
}

export function TemplatePlayground({
  component,
}: {
  component: CadsComponentManifest;
}) {
  const [values, setValues] = useState(() => initialValues(component));
  const [tab, setTab] = useState<Tab>("preview");
  const [inspect, setInspect] = useState(false);
  const [selection, setSelection] = useState<NestedSelection>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const nestedTargets = NESTED_PLAYGROUND_TARGETS[component.exportName] ?? [];

  const groups = useMemo(() => {
    const role = String(values.role ?? "input");
    const extras = playgroundExtraProps(component.exportName, values);
    const props = [
      ...component.props.filter((p) => {
        if (controlKind(p, { exportName: component.exportName }) === "skip") {
          return false;
        }
        if (!isPropVisible(component.exportName, p, values)) return false;
        if (component.exportName !== "Dropdown") return true;
        if (role === "action" && DROPDOWN_INPUT_ONLY.has(p.name)) return false;
        if (role === "input" && DROPDOWN_ACTION_ONLY.has(p.name)) return false;
        return true;
      }),
      ...extras,
    ];
    return orderedControls(props);
  }, [component, values]);

  const code = propsToCode(component.exportName, values);
  const highlighted = useMemo(() => highlightJsx(code), [code]);
  const showPropsPanel = tab === "preview";

  const setValue = (name: string, next: unknown) =>
    setValues((prev) =>
      applyValueUpdate(component.exportName, prev, name, next),
    );

  const clearSelection = useCallback(() => setSelection(null), []);

  useEffect(() => {
    if (!selection) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") clearSelection();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selection, clearSelection]);

  useEffect(() => {
    if (inspect) clearSelection();
  }, [inspect, clearSelection]);

  const onStageClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (inspect || tab !== "preview") return;
    if (!isNestedEditModifier(event)) return;

    const item = (event.target as HTMLElement | null)?.closest(
      NESTED_ITEM_SELECTOR,
    ) as HTMLElement | null;
    if (!item) {
      if (selection) {
        event.preventDefault();
        event.stopPropagation();
        clearSelection();
      }
      return;
    }

    const targetId = nestedTargetId(item);
    if (!targetId || !nestedTargets.some((t) => t.id === targetId)) return;

    event.preventDefault();
    event.stopPropagation();
    // Option-click can leave MUI focus-visible stuck; drop it.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const itemValue =
      item.getAttribute("data-value") ||
      item.textContent?.trim() ||
      "item";
    const edits = readOptionEdits(values)[itemValue] ?? {};

    if (targetId === "menuItem") {
      const label = String(edits.label ?? item.textContent?.trim() ?? "");
      const iconName = String(edits.iconName ?? "").trim();
      setSelection({
        targetId,
        itemValue,
        values: {
          label,
          value: String(edits.value ?? itemValue),
          disabled: Boolean(
            edits.disabled ?? item.getAttribute("aria-disabled"),
          ),
          iconName,
          startIcon: Boolean(edits.startIcon ?? iconName),
        },
      });
      return;
    }

    if (targetId === "radioItem") {
      const labelEl = item.querySelector(".MuiFormControlLabel-label");
      const label = String(
        edits.label ?? labelEl?.textContent?.trim() ?? itemValue,
      );
      setSelection({
        targetId,
        itemValue,
        values: {
          label,
          value: String(edits.value ?? itemValue),
          disabled: Boolean(edits.disabled),
        },
      });
    }
  };

  const setNestedValue = (name: string, next: unknown) => {
    if (!selection) return;
    const patch: Record<string, unknown> = { [name]: next };
    if (name === "iconName") {
      patch.startIcon = Boolean(String(next ?? "").trim());
    }
    setSelection((prev) =>
      prev ? { ...prev, values: { ...prev.values, ...patch } } : prev,
    );
    setValues((prev) => {
      const edits = { ...readOptionEdits(prev) };
      edits[selection.itemValue] = {
        ...(edits[selection.itemValue] ?? {}),
        ...patch,
      };
      // Dropdown menu items use value as identity; radio slots stay stable (a/b/c).
      if (
        selection.targetId === "menuItem" &&
        name === "value" &&
        typeof next === "string" &&
        next
      ) {
        const old = edits[selection.itemValue];
        delete edits[selection.itemValue];
        edits[next] = { ...old, value: next };
        setSelection((sel) =>
          sel ? { ...sel, itemValue: next } : sel,
        );
      }
      return { ...prev, optionEdits: edits };
    });
  };

  const activeNested = selection
    ? nestedTargets.find((t) => t.id === selection.targetId)
    : null;

  const nestedGroups = useMemo(() => {
    if (!activeNested) return [];
    return orderedControls(
      activeNested.props.filter(
        (p) => controlKind(p, { ignoreSkipList: true }) !== "skip",
      ),
    );
  }, [activeNested]);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Tabs
          type="primary"
          size="small"
          className={styles.tabs}
          aria-label="Playground view"
          value={tab}
          onChange={(next) => {
            setTab(next as Tab);
            if (next === "code") setInspect(false);
          }}
          items={[
            { value: "preview", label: "Preview" },
            { value: "code", label: "Code" },
          ]}
        />
        <div className={styles.toolbarActions}>
          {tab === "preview" ? (
            <Toggle
              size="extraSmall"
              label="Inspect"
              labelPlacement="right"
              checked={inspect}
              onChange={(_e, next) => setInspect(next)}
            />
          ) : (
            <CopyCodeIconButton text={code} />
          )}
        </div>
      </div>

      <div className={styles.body}>
        {tab === "code" ? (
          <div className={styles.codePane}>
            <pre>
              <code>{highlighted}</code>
            </pre>
          </div>
        ) : (
          <div className={styles.grid}>
            <div
              ref={stageRef}
              className={styles.stage}
              onClickCapture={onStageClickCapture}
              style={
                values.fullWidth ? { justifyContent: "stretch" } : undefined
              }
            >
              <div
                key={`defaultChecked:${String(values.defaultChecked)}:defaultOpen:${String(values.defaultOpen)}:opts:${JSON.stringify(values.optionEdits ?? {})}`}
                style={
                  values.fullWidth
                    ? { width: "100%", minWidth: 0 }
                    : undefined
                }
                className={[
                  styles.preview,
                  inspect ? styles.previewInspect : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-docs-playground-preview=""
                data-selected-item={selection?.itemValue || undefined}
                inert={inspect || undefined}
              >
                <ComponentPreview
                  exportName={component.exportName}
                  values={values}
                />
              </div>
              <PlaygroundInspectOverlay stageRef={stageRef} enabled={inspect} />
              {!inspect &&
              (selection || nestedTargets.length > 0) ? (
                <p className={styles.hint} data-docs-playground-hint="">
                  {selection
                    ? `Editing nested: ${activeNested?.label ?? "element"} · Esc to return`
                    : "⌥-click (Option/Alt) nested elements to edit their props"}
                </p>
              ) : null}
            </div>

            {showPropsPanel ? (
              <div className={styles.panel}>
                {selection && activeNested ? (
                  <>
                    <section className={styles.panelBack}>
                      <Button
                        variant="text"
                        color="secondary"
                        size="extraSmall"
                        startIconName="chevron-left"
                        onClick={clearSelection}
                      >
                        Props
                      </Button>
                    </section>
                    {nestedGroups.map(({ group, props }) => (
                      <section key={group} className={styles.panelSection}>
                        <h4 className={styles.panelTitle}>
                          {GROUP_LABELS[group]}
                        </h4>
                        {props.map((prop) => (
                          <ControlField
                            key={prop.name}
                            prop={prop}
                            value={selection.values[prop.name]}
                            onChange={(next) => setNestedValue(prop.name, next)}
                            ignoreSkipList
                          />
                        ))}
                      </section>
                    ))}
                  </>
                ) : (
                  <div>
                    {groups.map(({ group, props }) => (
                      <section key={group} className={styles.panelSection}>
                        <h4 className={styles.panelTitle}>
                          {GROUP_LABELS[group]}
                        </h4>
                        {props.map((prop) => (
                          <ControlField
                            key={prop.name}
                            prop={prop}
                            value={values[prop.name]}
                            onChange={(next) => setValue(prop.name, next)}
                            exportName={component.exportName}
                          />
                        ))}
                      </section>
                    ))}
                    {component.exportName === "Dropdown" &&
                    values.role !== "action" &&
                    values.menuType !== "checklist" ? (
                      <section className={styles.panelSection}>
                        <h4 className={styles.panelTitle}>
                          Menu items (playground)
                        </h4>
                        <ControlField
                          prop={{
                            name: "demoItemIcons",
                            type: "boolean",
                            description:
                              "Preview options with iconName (otherwise text-only + group + separator)",
                          }}
                          value={values.demoItemIcons}
                          onChange={(next) =>
                            setValues((prev) => ({
                              ...prev,
                              demoItemIcons: next,
                            }))
                          }
                        />
                      </section>
                    ) : null}
                    {component.exportName === "Breadcrumbs" ? (
                      <section className={styles.panelSection}>
                        <h4 className={styles.panelTitle}>
                          Item icon (playground)
                        </h4>
                        <ControlField
                          prop={{
                            name: "demoIcon",
                            type: "boolean",
                            description:
                              "Optional leading iconName on any crumb",
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
                                setValues((prev) => ({
                                  ...prev,
                                  demoIconItem: next,
                                }))
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
                                setValues((prev) => ({
                                  ...prev,
                                  demoIconName: next,
                                }))
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
                                setValues((prev) => ({
                                  ...prev,
                                  demoIconOnly: next,
                                }))
                              }
                            />
                          </>
                        ) : null}
                      </section>
                    ) : null}
                    {component.exportName === "IconToggle" ? (
                      <section className={styles.panelSection}>
                        <h4 className={styles.panelTitle}>
                          Dual toggle (playground)
                        </h4>
                        <ControlField
                          prop={{
                            name: "dualToggle",
                            type: "boolean",
                            description:
                              "Preview Icon Toggle + Label with two toggles",
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
                              iconName: next
                                ? "thumbs-up"
                                : prev.iconName || "smile",
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
                                description: "secondToggle.color",
                              }}
                              value={values.secondColor}
                              onChange={(next) =>
                                setValues((prev) => ({
                                  ...prev,
                                  secondColor: next,
                                }))
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
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
