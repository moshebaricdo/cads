"use client";

import { Toggle } from "@codeai/cads-react/components/Toggle";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "toggle-large-off-label-left-light",
      mode: "light",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Toggle size="large" label="Label" labelPlacement="left" checked={false} />
      ),
    },
    {
      id: "toggle-large-off-label-right-light",
      mode: "light",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Toggle size="large" label="Label" labelPlacement="right" checked={false} />
      ),
    },
    {
      id: "toggle-medium-off-label-left-light",
      mode: "light",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Toggle size="medium" label="Label" labelPlacement="left" checked={false} />
      ),
    },
    {
      id: "toggle-small-off-label-left-light",
      mode: "light",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Toggle size="small" label="Label" labelPlacement="left" checked={false} />
      ),
    },
    {
      id: "toggle-xs-off-label-left-light",
      mode: "light",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Toggle
          size="extraSmall"
          label="Label"
          labelPlacement="left"
          checked={false}
        />
      ),
    },
    {
      id: "toggle-large-on-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="large" checked aria-label="Toggle" />
      ),
    },
    {
      id: "toggle-large-off-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="large" checked={false} aria-label="Toggle" />
      ),
    },
    {
      id: "toggle-medium-on-hover-light",
      mode: "light",
      state: "hover",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="medium" checked aria-label="Toggle" />
      ),
    },
    {
      id: "toggle-small-off-press-light",
      mode: "light",
      state: "press",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="small" checked={false} aria-label="Toggle" />
      ),
    },
    {
      id: "toggle-large-on-focus-light",
      mode: "light",
      state: "focus",
      viewport: { width: 140, height: 100 },
      render: () => (
        <Toggle size="large" checked aria-label="Toggle" autoFocus />
      ),
    },
    {
      id: "toggle-large-on-disabled-light",
      mode: "light",
      state: "disabled",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="large" checked disabled aria-label="Toggle" />
      ),
    },
    {
      id: "toggle-large-off-disabled-light",
      mode: "light",
      state: "disabled",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="large" checked={false} disabled aria-label="Toggle" />
      ),
    },
    {
      id: "toggle-xs-on-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="extraSmall" checked aria-label="Toggle" />
      ),
    },
    {
      id: "toggle-medium-on-default-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="medium" checked aria-label="Toggle" />
      ),
    },
    {
      id: "toggle-medium-off-default-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 120, height: 80 },
      render: () => (
        <Toggle size="medium" checked={false} aria-label="Toggle" />
      ),
    },
  ];
