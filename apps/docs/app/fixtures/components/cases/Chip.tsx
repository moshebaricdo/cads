"use client";

import { Chip } from "@codeai/cads-react/components/Chip";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "chip-large-primary-unselected-light",
      mode: "light",
      state: "default",
      viewport: { width: 160, height: 80 },
      render: () => (
        <Chip size="large" color="primary" labelStyle="thick" label="Chips" />
      ),
    },
    {
      id: "chip-large-primary-selected-light",
      mode: "light",
      state: "default",
      viewport: { width: 160, height: 80 },
      render: () => (
        <Chip
          size="large"
          color="primary"
          labelStyle="thick"
          label="Chips"
          selected
        />
      ),
    },
    {
      id: "chip-medium-secondary-unselected-light",
      mode: "light",
      state: "default",
      viewport: { width: 160, height: 80 },
      render: () => (
        <Chip
          size="medium"
          color="secondary"
          labelStyle="thin"
          label="Chips"
        />
      ),
    },
    {
      id: "chip-small-primary-selected-light",
      mode: "light",
      state: "default",
      viewport: { width: 140, height: 64 },
      render: () => (
        <Chip size="small" label="Chips" selected labelStyle="thick" />
      ),
    },
    {
      id: "chip-xs-primary-unselected-light",
      mode: "light",
      state: "default",
      viewport: { width: 120, height: 56 },
      render: () => <Chip size="extraSmall" label="Chips" />,
    },
    {
      id: "chip-large-primary-disabled-light",
      mode: "light",
      state: "default",
      viewport: { width: 160, height: 80 },
      render: () => <Chip size="large" label="Chips" disabled />,
    },
    {
      id: "chip-large-selected-focus-light",
      mode: "light",
      state: "focus",
      viewport: { width: 160, height: 80 },
      render: () => <Chip size="large" label="Chips" selected />,
    },
    {
      id: "chip-medium-selected-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 160, height: 80 },
      render: () => <Chip size="medium" label="Chips" selected />,
    },
  ];
