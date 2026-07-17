"use client";

import {
  CloseIconButton,
  type CloseIconButtonColor,
  type CloseIconButtonSize,
} from "@codeai/cads-react/components/CloseIconButton";
import type { FixtureCase } from "./shared";

const fixture = (
  id: string,
  size: CloseIconButtonSize,
  color: CloseIconButtonColor,
  state: "default" | "hover" | "focus" | "press",
  mode: "light" | "dark" = "light",
): FixtureCase => ({
  id,
  mode,
  state,
  viewport: { width: 96, height: 96 },
  render: () => (
    <CloseIconButton size={size} color={color} aria-label="Close" />
  ),
});

export const cases: FixtureCase[] = [
  fixture(
    "close-large-primary-default-light",
    "large",
    "primary",
    "default",
  ),
  fixture(
    "close-medium-secondary-hover-light",
    "medium",
    "secondary",
    "hover",
  ),
  fixture(
    "close-small-brand-focus-light",
    "small",
    "brand",
    "focus",
  ),
  fixture(
    "close-xs-pink-press-light",
    "extraSmall",
    "pink",
    "press",
  ),
  fixture(
    "close-large-success-default-light",
    "large",
    "success",
    "default",
  ),
  fixture(
    "close-medium-error-hover-light",
    "medium",
    "error",
    "hover",
  ),
  fixture(
    "close-small-warning-default-dark",
    "small",
    "warning",
    "default",
    "dark",
  ),
  fixture(
    "close-xs-info-focus-dark",
    "extraSmall",
    "info",
    "focus",
    "dark",
  ),
  fixture(
    "close-medium-orange-hover-light",
    "medium",
    "orange",
    "hover",
  ),
  fixture(
    "close-medium-warning-hover-light",
    "medium",
    "warning",
    "hover",
  ),
];
