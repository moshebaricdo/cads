"use client";

import type { FaIconName } from "@codeai/cads-react/icons";

export const DEMO_DROPDOWN_OPTIONS = [
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
