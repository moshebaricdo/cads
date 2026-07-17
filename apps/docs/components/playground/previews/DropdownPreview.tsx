"use client";

import { Dropdown } from "@codeai/cads-react/components/Dropdown";
import { DEMO_DROPDOWN_OPTIONS } from "./shared";
import type { FaIconName } from "@codeai/cads-react/icons";

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
