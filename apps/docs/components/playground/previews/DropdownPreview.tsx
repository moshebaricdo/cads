"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Dropdown,
  type DropdownOption,
} from "@codeai/cads-react";
import type { FaIconName } from "@codeai/cads-react/icons";
import {
  DEMO_DROPDOWN_ACTION_OPTIONS,
  DEMO_DROPDOWN_ICON_OPTIONS,
  DEMO_DROPDOWN_OPTIONS,
  type PreviewProps,
} from "./shared";

type OptionEdit = {
  label?: string;
  value?: string;
  disabled?: boolean;
  iconName?: string;
};

function applyOptionEdits(
  options: DropdownOption[],
  edits: Record<string, OptionEdit>,
): DropdownOption[] {
  return options.map((opt) => {
    if (opt.type === "separator" || opt.type === "group") return opt;
    const edit = edits[opt.value];
    if (!edit) return opt;
    const iconName =
      edit.iconName != null
        ? String(edit.iconName).trim() || undefined
        : opt.iconName;
    return {
      ...opt,
      ...edit,
      iconName: iconName as FaIconName | undefined,
    };
  });
}

/**
 * Reserve layout padding for the absolute menu so the stage’s flex centering
 * centers trigger+menu as one unit. Padding (not transform) keeps inspect
 * rulers / ResizeObserver in sync with the painted chrome.
 */
function InspectCompositeCenter({
  children,
  syncKey,
}: {
  children: ReactNode;
  syncKey: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [pad, setPad] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const sync = () => {
      const dropdown = host.querySelector("[data-cads-dropdown]");
      const menu = host.querySelector("[data-cads-dropdown-menu]");
      if (!(dropdown instanceof HTMLElement)) {
        setPad({ top: 0, right: 0, bottom: 0, left: 0 });
        return;
      }
      if (!(menu instanceof HTMLElement)) {
        setPad({ top: 0, right: 0, bottom: 0, left: 0 });
        return;
      }

      const root = dropdown.getBoundingClientRect();
      const floating = menu.getBoundingClientRect();
      if (floating.width <= 0 && floating.height <= 0) {
        setPad({ top: 0, right: 0, bottom: 0, left: 0 });
        return;
      }

      setPad({
        top: Math.max(0, root.top - floating.top),
        right: Math.max(0, floating.right - root.right),
        bottom: Math.max(0, floating.bottom - root.bottom),
        left: Math.max(0, root.left - floating.left),
      });
    };

    const raf = requestAnimationFrame(() => {
      sync();
      requestAnimationFrame(sync);
    });

    const ro = new ResizeObserver(sync);
    ro.observe(host);
    const menu = host.querySelector("[data-cads-dropdown-menu]");
    if (menu instanceof HTMLElement) ro.observe(menu);
    const dropdown = host.querySelector("[data-cads-dropdown]");
    if (dropdown instanceof HTMLElement) ro.observe(dropdown);

    const mo = new MutationObserver(() => {
      const nextMenu = host.querySelector("[data-cads-dropdown-menu]");
      if (nextMenu instanceof HTMLElement) ro.observe(nextMenu);
      sync();
    });
    mo.observe(host, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [syncKey]);

  return (
    <div
      ref={hostRef}
      data-docs-inspect-composite=""
      style={{
        paddingTop: pad.top,
        paddingRight: pad.right,
        paddingBottom: pad.bottom,
        paddingLeft: pad.left,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Inspect keeps the menu open and in-tree (`disablePortal`) so hit-testing
 * can measure menu items inside the playground stage.
 */
export default function DropdownPreview({
  values,
  inspect = false,
}: PreviewProps) {
  const v = values;
  const role = (v.role as "input" | "action" | undefined) ?? "input";
  const size = v.size as
    | "large"
    | "medium"
    | "small"
    | "extraSmall"
    | undefined;
  const menuType =
    (v.menuType as "default" | "checklist" | undefined) ?? "default";
  const menuPlacement = v.menuPlacement as
    | "bottomLeft"
    | "bottomRight"
    | "topLeft"
    | "topRight"
    | undefined;
  const edits =
    v.optionEdits && typeof v.optionEdits === "object"
      ? (v.optionEdits as Record<string, OptionEdit>)
      : {};

  const inspectOpen = inspect
    ? ({ open: true as const, disablePortal: true as const } as const)
    : ({ defaultOpen: Boolean(v.defaultOpen) } as const);

  let dropdown: ReactNode;
  if (role === "action") {
    dropdown = (
      <Dropdown
        role="action"
        size={size}
        menuType="default"
        menuPlacement={menuPlacement}
        label={String(v.label ?? "Actions")}
        startIconName={
          (String(v.startIconName ?? "").trim() || undefined) as
            | FaIconName
            | undefined
        }
        buttonVariant={
          v.buttonVariant as "contained" | "outlined" | "text" | undefined
        }
        buttonColor={
          v.buttonColor as
            | "primary"
            | "secondary"
            | "tertiary"
            | "orange"
            | "error"
            | undefined
        }
        disabled={Boolean(v.disabled)}
        {...inspectOpen}
        options={applyOptionEdits(DEMO_DROPDOWN_ACTION_OPTIONS, edits)}
        aria-label={String(v["aria-label"] || "Actions")}
      />
    );
  } else {
    const widthRaw = String(v.width ?? "hug").trim() || "hug";
    const width =
      widthRaw === "hug" || widthRaw === "full"
        ? widthRaw
        : /^\d+(\.\d+)?$/.test(widthRaw)
          ? Number(widthRaw)
          : widthRaw;
    const baseOptions: DropdownOption[] =
      menuType === "default" && v.demoItemIcons
        ? DEMO_DROPDOWN_ICON_OPTIONS
        : DEMO_DROPDOWN_OPTIONS;
    const options = applyOptionEdits(baseOptions, edits);
    dropdown = (
      <Dropdown
        role="input"
        size={size}
        menuType={menuType}
        menuPlacement={menuPlacement}
        width={width}
        label={String(v.label ?? "Sort by")}
        helperText={v.helperText ? String(v.helperText) : undefined}
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
        required={Boolean(v.required)}
        {...inspectOpen}
        defaultValue={
          v.defaultValue != null ? String(v.defaultValue) : undefined
        }
        options={options}
        aria-label={String(v["aria-label"] || "Sort by")}
      />
    );
  }

  if (!inspect) return dropdown;
  return (
    <InspectCompositeCenter
      syncKey={`${role}:${size}:${menuType}:${menuPlacement}:${menuType === "default" && v.demoItemIcons ? "icons" : "text"}:${optionsKey(edits)}`}
    >
      {dropdown}
    </InspectCompositeCenter>
  );
}

function optionsKey(edits: Record<string, OptionEdit>): string {
  return Object.keys(edits).length ? JSON.stringify(edits) : "";
}
