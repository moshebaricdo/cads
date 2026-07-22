"use client";

import type { FaIconName } from "@codeai/cads-react/icons";

/** Input-role demo: common sort menu (docs playground default). */
export const DEMO_DROPDOWN_OPTIONS = [
  { value: "recent", label: "Recently updated" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "created", label: "Date created" },
  { type: "separator" as const },
  { value: "custom", label: "Custom…" },
];

/** Input-role demo when playground “item icons” is on. */
export const DEMO_DROPDOWN_ICON_OPTIONS = [
  {
    value: "a",
    label: "Option A",
    startIcon: true,
    iconName: "face-smile" as FaIconName,
  },
  {
    value: "b",
    label: "Option B",
    startIcon: true,
    iconName: "heart" as FaIconName,
  },
  {
    value: "c",
    label: "Option C",
    startIcon: true,
    iconName: "star" as FaIconName,
  },
];

/** Action-role demo: leading icons + destructive. */
export const DEMO_DROPDOWN_ACTION_OPTIONS = [
  {
    value: "a",
    label: "Option A",
    startIcon: true,
    iconName: "face-smile" as FaIconName,
  },
  {
    value: "b",
    label: "Option B",
    startIcon: true,
    iconName: "heart" as FaIconName,
  },
  {
    value: "c",
    label: "Option C",
    startIcon: true,
    iconName: "star" as FaIconName,
  },
  {
    value: "danger",
    label: "Delete",
    startIcon: true,
    iconName: "trash" as FaIconName,
    destructive: true,
  },
];

const DEMO_BREADCRUMB_TRAIL = [
  { label: "Home", href: "#" },
  { label: "Products", href: "#" },
  { label: "Category", href: "#" },
  { label: "Subsection", href: "#" },
  { label: "Detail", href: "#" },
  { label: "Current", current: true as const },
] as const;

export function buildDemoBreadcrumbItems(values: Record<string, unknown>) {
  const showIcon = Boolean(values.demoIcon);
  const iconName = String(values.demoIconName || "box-archive");
  const targetLabel = String(values.demoIconItem || "Detail");
  const iconOnly = Boolean(values.demoIconOnly);

  return DEMO_BREADCRUMB_TRAIL.map((item) => {
    const base = { ...item };
    if (!showIcon || item.label !== targetLabel) return base;
    return {
      ...base,
      iconName,
      ...(iconOnly ? { iconOnly: true } : null),
    };
  });
}
