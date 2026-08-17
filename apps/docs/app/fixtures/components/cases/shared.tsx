"use client";

import type { DropdownOption } from "@moshebaricdo/cads-react";
import type { FaIconName } from "@moshebaricdo/cads-react/icons";
import type { ReactNode } from "react";

export interface FixtureCase {
  id: string;
  mode: "light" | "dark";
  state?: string;
  viewport: { width: number; height: number };
  render: () => ReactNode;
}

export const ICON_OPTIONS: DropdownOption[] = [
  {
    value: "a",
    label: "Option A",
    iconName: "face-smile" as FaIconName,
  },
  {
    value: "b",
    label: "Option B",
    iconName: "heart" as FaIconName,
  },
  {
    value: "c",
    label: "Option C",
    iconName: "star" as FaIconName,
  },
];

export const ACTION_OPTIONS: DropdownOption[] = [
  {
    value: "edit",
    label: "Edit",
    iconName: "pen" as FaIconName,
  },
  {
    value: "share",
    label: "Share",
    iconName: "share" as FaIconName,
  },
  {
    value: "delete",
    label: "Delete",
    iconName: "trash" as FaIconName,
    destructive: true,
  },
];

/** Text-only items + optgroup + separator (native select parity). */
export const TEXT_GROUPED_OPTIONS: DropdownOption[] = [
  { type: "group", label: "Recent" },
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { type: "separator" },
  { type: "group", label: "All" },
  { value: "c", label: "Option C" },
  { value: "d", label: "Option D" },
];

/** Trigger labels for menuType=custom color-swatch demos. */
export const SWATCH_OPTIONS: DropdownOption[] = [
  { value: "brand", label: "Brand" },
  { value: "error", label: "Error" },
  { value: "warning", label: "Warning" },
  { value: "success", label: "Success" },
  { value: "info", label: "Info" },
  { value: "pink", label: "Pink" },
  { value: "orange", label: "Orange" },
  { value: "neutral", label: "Neutral" },
];

const SWATCH_FILLS: Record<string, string> = {
  brand: "var(--background-brand-primary)",
  error: "var(--background-error-primary)",
  warning: "var(--background-warning-primary)",
  success: "var(--background-success-primary)",
  info: "var(--background-info-primary)",
  pink: "var(--background-accent-pink-primary)",
  orange: "var(--background-accent-orange-primary)",
  neutral: "var(--background-neutral-primary-inverse)",
};

/** Flush swatch grid for custom menus — no outer padding or gaps. */
export function DemoSwatchMenu({
  value = "brand",
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div
      role="listbox"
      aria-label="Color"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 32px)",
        padding: 0,
        gap: 0,
      }}
    >
      {SWATCH_OPTIONS.map((opt) => {
        if (opt.type === "separator" || opt.type === "group") return null;
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={selected}
            aria-label={String(opt.label)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onChange?.(opt.value)}
            style={{
              width: 32,
              height: 32,
              padding: 0,
              margin: 0,
              border: selected
                ? "2px solid var(--border-selected-primary-inverse)"
                : "2px solid transparent",
              background: SWATCH_FILLS[opt.value],
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          />
        );
      })}
    </div>
  );
}
