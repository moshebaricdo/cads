"use client";

import {
  IconTooltip,
  type IconTooltipColor,
  type IconTooltipSize,
} from "@moshebaricdo/cads-react";
import type { FixtureCase } from "./shared";

const staticFixture = (
  id: string,
  size: IconTooltipSize,
  color: IconTooltipColor,
  state: "default" | "focus",
  mode: "light" | "dark" = "light",
): FixtureCase => ({
  id,
  mode,
  state,
  viewport: { width: 96, height: 96 },
  render: () => (
    <IconTooltip
      size={size}
      color={color}
      title="Help text"
      aria-label="More info"
    />
  ),
});

export const cases: FixtureCase[] = [
  staticFixture("icon-tooltip-large-primary-default-light", "large", "primary", "default"),
  staticFixture(
    "icon-tooltip-medium-secondary-default-light",
    "medium",
    "secondary",
    "default",
  ),
  staticFixture(
    "icon-tooltip-medium-tertiary-default-light",
    "medium",
    "tertiary",
    "default",
  ),
  staticFixture("icon-tooltip-small-primary-default-dark", "small", "primary", "default", "dark"),
  staticFixture(
    "icon-tooltip-xs-tertiary-default-light",
    "extraSmall",
    "tertiary",
    "default",
  ),
  staticFixture(
    "icon-tooltip-medium-tertiary-focus-light",
    "medium",
    "tertiary",
    "focus",
  ),
  {
    id: "icon-tooltip-open-top-primary-light",
    mode: "light",
    viewport: { width: 240, height: 140 },
    render: () => (
      <div style={{ paddingTop: 48, textAlign: "center" }}>
        <IconTooltip
          title="Help text"
          color="primary"
          placement="top"
          open
          disableInteractive
          slotProps={{ popper: { disablePortal: true } }}
        />
      </div>
    ),
  },
  {
    id: "icon-tooltip-open-bottom-tertiary-dark",
    mode: "dark",
    viewport: { width: 240, height: 140 },
    render: () => (
      <div style={{ paddingBottom: 48, textAlign: "center" }}>
        <IconTooltip
          title="Help text"
          color="tertiary"
          placement="bottom"
          open
          disableInteractive
          slotProps={{ popper: { disablePortal: true } }}
        />
      </div>
    ),
  },
];
