"use client";

import type { DropdownOption } from "@codeai/cads-react/components/Dropdown";
import type { FaIconName } from "@codeai/cads-react/icons";
import type { ReactNode } from "react";

export interface FixtureCase {
  id: string;
  mode: "light" | "dark";
  state?: string;
  viewport: { width: number; height: number };
  render: () => ReactNode;
}

export const ICON_OPTIONS: DropdownOption[] = [
  { value: "a", label: "Option A", iconName: "face-smile" as FaIconName },
  { value: "b", label: "Option B", iconName: "heart" as FaIconName },
  { value: "c", label: "Option C", iconName: "star" as FaIconName },
];

export const ACTION_OPTIONS: DropdownOption[] = [
  { value: "edit", label: "Edit", iconName: "pen" as FaIconName },
  { value: "share", label: "Share", iconName: "share" as FaIconName },
  {
    value: "delete",
    label: "Delete",
    iconName: "trash" as FaIconName,
    destructive: true,
  },
];
