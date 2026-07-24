"use client";

import {
  Dropdown,
  type DropdownOption,
} from "@codeai/cads-react/components/Dropdown";
import type { FaIconName } from "@codeai/cads-react/icons";
import {
  DEMO_DROPDOWN_ACTION_OPTIONS,
  DEMO_DROPDOWN_ICON_OPTIONS,
  DEMO_DROPDOWN_OPTIONS,
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

export default function DropdownPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
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

  if (role === "action") {
    return (
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
        defaultOpen={Boolean(v.defaultOpen)}
        options={applyOptionEdits(DEMO_DROPDOWN_ACTION_OPTIONS, edits)}
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
  const baseOptions: DropdownOption[] =
    menuType === "default" && v.demoItemIcons
      ? DEMO_DROPDOWN_ICON_OPTIONS
      : DEMO_DROPDOWN_OPTIONS;
  const options = applyOptionEdits(baseOptions, edits);
  return (
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
      defaultOpen={Boolean(v.defaultOpen)}
      defaultValue={
        v.defaultValue != null ? String(v.defaultValue) : undefined
      }
      options={options}
      aria-label={String(v["aria-label"] || "Sort by")}
    />
  );
}
