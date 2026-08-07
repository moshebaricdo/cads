"use client";

import {
  Suspense,
  lazy,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import type { PreviewProps } from "./previews/shared";

type PreviewComp = ComponentType<PreviewProps>;

const PREVIEWS: Record<string, LazyExoticComponent<PreviewComp>> = {
  Button: lazy(() => import("./previews/ButtonPreview")),
  CloseIconButton: lazy(
    () => import("./previews/CloseIconButtonPreview"),
  ),
  SegmentedButton: lazy(() => import("./previews/SegmentedButtonPreview")),
  IconToggle: lazy(() => import("./previews/IconTogglePreview")),
  FieldWrapper: lazy(() => import("./previews/FieldWrapperPreview")),
  TextInput: lazy(() => import("./previews/TextInputPreview")),
  Dropdown: lazy(() => import("./previews/DropdownPreview")),
  Checkbox: lazy(() => import("./previews/CheckboxPreview")),
  Radio: lazy(() => import("./previews/RadioPreview")),
  Toggle: lazy(() => import("./previews/TogglePreview")),
  Slider: lazy(() => import("./previews/SliderPreview")),
  Chip: lazy(() => import("./previews/ChipPreview")),
  ChipGroup: lazy(() => import("./previews/ChipGroupPreview")),
  Link: lazy(() => import("./previews/LinkPreview")),
  Breadcrumbs: lazy(() => import("./previews/BreadcrumbsPreview")),
  Tabs: lazy(() => import("./previews/TabsPreview")),
  Pagination: lazy(() => import("./previews/PaginationPreview")),
  Alert: lazy(() => import("./previews/AlertPreview")),
  Toast: lazy(() => import("./previews/ToastPreview")),
  NotificationBanner: lazy(() => import("./previews/NotificationBannerPreview")),
  Tag: lazy(() => import("./previews/TagPreview")),
  Tooltip: lazy(() => import("./previews/TooltipPreview")),
  IconTooltip: lazy(() => import("./previews/IconTooltipPreview")),
  Popover: lazy(() => import("./previews/PopoverPreview")),
  Drawer: lazy(() => import("./previews/DrawerPreview")),
  Dialog: lazy(() => import("./previews/DialogPreview")),
  Modal: lazy(() => import("./previews/ModalPreview")),
  ChatFileRemoveButton: lazy(
    () => import("./previews/ChatFileRemoveButtonPreview"),
  ),
  AiChatFileChip: lazy(() => import("./previews/AiChatFileChipPreview")),
  AiChatMessage: lazy(() => import("./previews/AiChatMessagePreview")),
  AiChatInput: lazy(() => import("./previews/AiChatInputPreview")),
};

export function ComponentPreview({
  exportName,
  values,
  inspect = false,
}: {
  exportName: string;
  values: Record<string, unknown>;
  inspect?: boolean;
}) {
  const Preview = PREVIEWS[exportName];
  if (!Preview) return null;
  return (
    <Suspense fallback={<div style={{ minHeight: 80 }} aria-hidden />}>
      <Preview values={values} inspect={inspect} />
    </Suspense>
  );
}

export function hasComponentPreview(exportName: string): boolean {
  return exportName in PREVIEWS;
}
