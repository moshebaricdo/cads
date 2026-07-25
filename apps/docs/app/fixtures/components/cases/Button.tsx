"use client";

import {
  Button,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "@codeai/cads-react/components/Button";
import type { FixtureCase } from "./shared";

const fixture = (
  id: string,
  props: {
    size?: ButtonSize;
    variant?: ButtonVariant;
    color?: ButtonColor;
    iconOnly?: boolean;
  },
  state: "default" | "hover" | "focus" | "press",
  mode: "light" | "dark" = "light",
): FixtureCase => ({
  id,
  mode,
  state,
  viewport: { width: 160, height: 96 },
  render: () => (
    <Button
      size={props.size ?? "medium"}
      variant={props.variant ?? "contained"}
      color={props.color ?? "primary"}
      iconOnly={props.iconOnly}
      startIconName={props.iconOnly ? "face-smile" : undefined}
    >
      {props.iconOnly ? undefined : "Button"}
    </Button>
  ),
});

export const cases: FixtureCase[] = [
  fixture(
    "button-medium-contained-primary-default-light",
    { size: "medium", variant: "contained", color: "primary" },
    "default",
  ),
  fixture(
    "button-medium-contained-primary-pressed-light",
    { size: "medium", variant: "contained", color: "primary" },
    "press",
  ),
  fixture(
    "button-medium-contained-secondary-pressed-light",
    { size: "medium", variant: "contained", color: "secondary" },
    "press",
  ),
  fixture(
    "button-medium-outlined-primary-pressed-light",
    { size: "medium", variant: "outlined", color: "primary" },
    "press",
  ),
  fixture(
    "button-medium-text-primary-pressed-light",
    { size: "medium", variant: "text", color: "primary" },
    "press",
  ),
  fixture(
    "button-medium-contained-error-pressed-light",
    { size: "medium", variant: "contained", color: "error" },
    "press",
  ),
  fixture(
    "button-medium-contained-orange-pressed-light",
    { size: "medium", variant: "contained", color: "orange" },
    "press",
  ),
];
