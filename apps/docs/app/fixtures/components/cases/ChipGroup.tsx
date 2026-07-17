"use client";

import { ChipGroup } from "@codeai/cads-react/components/ChipGroup";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "chip-group-medium-primary-thick-light",
      mode: "light",
      state: "default",
      viewport: { width: 400, height: 140 },
      render: () => (
        <ChipGroup
          size="medium"
          color="primary"
          labelStyle="thick"
          label="Field label"
          helperText="Helper text"
          options={[
            { value: "a", label: "Chips" },
            { value: "b", label: "Chips" },
            { value: "c", label: "Chips" },
            { value: "d", label: "Chips" },
          ]}
        />
      ),
    },
    {
      id: "chip-group-medium-primary-selected-light",
      mode: "light",
      state: "default",
      viewport: { width: 400, height: 140 },
      render: () => (
        <ChipGroup
          size="medium"
          color="primary"
          labelStyle="thick"
          label="Field label"
          helperText="Helper text"
          options={[
            { value: "a", label: "Chips" },
            { value: "b", label: "Chips" },
            { value: "c", label: "Chips" },
            { value: "d", label: "Chips" },
          ]}
          defaultValue={["a"]}
        />
      ),
    },
    {
      id: "chip-group-large-secondary-thin-light",
      mode: "light",
      state: "default",
      viewport: { width: 420, height: 160 },
      render: () => (
        <ChipGroup
          size="large"
          color="secondary"
          labelStyle="thin"
          label="Field label"
          helperText="Helper text"
          options={[
            { value: "a", label: "Chips" },
            { value: "b", label: "Chips" },
            { value: "c", label: "Chips" },
            { value: "d", label: "Chips" },
          ]}
        />
      ),
    },
    {
      id: "chip-group-small-primary-thick-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 120 },
      render: () => (
        <ChipGroup
          size="small"
          label="Field label"
          showHelper={false}
          options={[
            { value: "a", label: "Chips" },
            { value: "b", label: "Chips" },
          ]}
          defaultValue={["a"]}
        />
      ),
    },
    {
      id: "chip-group-medium-primary-thick-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 400, height: 140 },
      render: () => (
        <ChipGroup
          size="medium"
          color="primary"
          labelStyle="thick"
          label="Field label"
          helperText="Helper text"
          options={[
            { value: "a", label: "Chips" },
            { value: "b", label: "Chips" },
            { value: "c", label: "Chips" },
            { value: "d", label: "Chips" },
          ]}
          defaultValue={["a"]}
        />
      ),
    },
  ];
