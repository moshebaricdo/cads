/**
 * Shared docs navigation data.
 * Component grouping mirrors the Figma page / section order
 * (file DGekOeToRVifvFAhfqpeC1) and is consumed by the shell sidebar
 * and component detail pages.
 */

export const RESOURCES_NAV = [
  { href: "/", label: "Overview", iconName: "grid" },
  { href: "/ai", label: "For Agents", iconName: "robot" },
] as const;

export const FOUNDATIONS_NAV = [
  { href: "/variables/color", label: "Color", iconName: "palette" },
  { href: "/variables/typography", label: "Typography", iconName: "text-size" },
  { href: "/variables/spacing", label: "Shape", iconName: "draw-square" },
  { href: "/variables/core", label: "Motion", iconName: "play-pause" },
] as const;

export const COMPONENT_SECTIONS = [
  {
    id: "actions",
    label: "Actions",
    iconName: "computer-mouse",
    items: [
      { exportName: "Button", label: "Button" },
      { exportName: "SegmentedButton", label: "Segmented Button" },
      { exportName: "IconToggle", label: "Icon Toggle" },
      { exportName: "CloseIconButton", label: "Close Button" },
    ],
  },
  {
    id: "inputs",
    label: "Inputs",
    iconName: "grid",
    items: [
      { exportName: "FieldWrapper", label: "Field Wrapper" },
      { exportName: "TextInput", label: "Text Input" },
      { exportName: "Dropdown", label: "Dropdown" },
      { exportName: "Checkbox", label: "Checkbox" },
      { exportName: "Radio", label: "Radio Button" },
      { exportName: "Toggle", label: "Toggle" },
      { exportName: "Slider", label: "Slider" },
      { exportName: "Chip", label: "Chips" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    iconName: "compass",
    items: [
      { exportName: "Link", label: "Links" },
      { exportName: "Breadcrumbs", label: "Breadcrumbs" },
      { exportName: "Tabs", label: "Tabs" },
    ],
  },
  {
    id: "messaging",
    label: "Messaging",
    iconName: "message-dots",
    items: [
      { exportName: "Alert", label: "Alert" },
      { exportName: "Toast", label: "Toast" },
      { exportName: "NotificationBanner", label: "Notification Banner" },
      { exportName: "Tag", label: "Tag" },
    ],
  },
  {
    id: "overlays",
    label: "Overlays",
    iconName: "window",
    items: [
      { exportName: "Tooltip", label: "Tooltip" },
      { exportName: "Popover", label: "Popover" },
      { exportName: "Drawer", label: "Drawer" },
      { exportName: "Dialog", label: "Dialog" },
      { exportName: "Modal", label: "Modal" },
    ],
  },
] as const;

export type ComponentSectionId = (typeof COMPONENT_SECTIONS)[number]["id"];

export function componentHref(name: string) {
  return `/components/${name.toLowerCase()}`;
}

/** Category label + display label for a component export name, if grouped. */
export function componentCategory(exportName: string): {
  sectionLabel: string;
  itemLabel: string;
} | null {
  for (const section of COMPONENT_SECTIONS) {
    for (const item of section.items) {
      if (item.exportName === exportName) {
        return { sectionLabel: section.label, itemLabel: item.label };
      }
    }
  }
  return null;
}

export type NavComponent = {
  exportName: string;
  label: string;
  href: string;
};

export type NavFoundation = {
  href: string;
  label: string;
};

/** Flat component list in sidebar / Figma section order. */
export function listNavComponents(): NavComponent[] {
  return COMPONENT_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      exportName: item.exportName,
      label: item.label,
      href: componentHref(item.exportName),
    })),
  );
}

/** Previous / next neighbors for component page footer nav. */
export function adjacentComponents(exportName: string): {
  previous: NavComponent | NavFoundation | null;
  next: NavComponent | null;
} {
  const list = listNavComponents();
  const index = list.findIndex((item) => item.exportName === exportName);
  if (index < 0) return { previous: null, next: null };
  const lastFoundation = FOUNDATIONS_NAV[FOUNDATIONS_NAV.length - 1]!;
  return {
    // First component continues from the last foundation (Motion → Button).
    previous:
      index > 0
        ? list[index - 1]!
        : { href: lastFoundation.href, label: lastFoundation.label },
    next: index < list.length - 1 ? list[index + 1]! : null,
  };
}

/** Previous / next neighbors for foundation page footer nav. */
export function adjacentFoundations(href: string): {
  previous: NavFoundation | null;
  next: NavFoundation | NavComponent | null;
} {
  const list: NavFoundation[] = FOUNDATIONS_NAV.map((item) => ({
    href: item.href,
    label: item.label,
  }));
  const index = list.findIndex((item) => item.href === href);
  if (index < 0) return { previous: null, next: null };
  const firstComponent = listNavComponents()[0] ?? null;
  return {
    previous: index > 0 ? list[index - 1]! : null,
    // Last foundation continues into the first component (Motion → Button).
    next:
      index < list.length - 1
        ? list[index + 1]!
        : firstComponent
          ? { href: firstComponent.href, label: firstComponent.label }
          : null,
  };
}
