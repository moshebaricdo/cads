"use client";

import type { FaIconName } from "@moshebaricdo/cads-react/icons";

/** Shared props for lazy playground preview chunks. */
export type PreviewProps = {
  values: Record<string, unknown>;
  /**
   * When true (playground Inspect mode), triggered overlays render their
   * surface inline — centered, no trigger — so they can be measured.
   * Dropdown instead forces the menu open in-tree (`disablePortal`).
   */
  inspect?: boolean;
};

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

/** Action-role demo: leading icons + destructive. */
export const DEMO_DROPDOWN_ACTION_OPTIONS = [
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
  {
    value: "danger",
    label: "Delete",
    iconName: "trash" as FaIconName,
    destructive: true,
  },
];

/** Demo lesson rail for ProgressWidget / GlobalHeader previews. */
export const DEMO_PROGRESS_LEVELS = [
  { status: "completed" as const },
  { levelType: "panelLevel" as const, status: "completed" as const },
  { status: "completed" as const },
  { status: "completed" as const, isAssessment: true },
  { status: "completed" as const },
  { status: "inProgress" as const },
  { status: "notStarted" as const },
  { status: "notStarted" as const, isAssessment: true },
  { levelType: "lessonExtras" as const },
];

/** Index of the in-progress level above (the widget's active bubble). */
export const DEMO_PROGRESS_ACTIVE_INDEX = 5;

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
