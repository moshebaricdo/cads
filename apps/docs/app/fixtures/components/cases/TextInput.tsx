"use client";

import { TextInput } from "@codeai/cads-react/components/TextInput";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "text-input-large-field-primary-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 160 },
      render: () => (
        <TextInput
          size="large"
          color="primary"
          label="Field label"
          helperText="Helper text"
          placeholder="Placeholder"
        />
      ),
    },
    {
      id: "text-input-medium-area-secondary-filled-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 200 },
      render: () => (
        <TextInput
          size="medium"
          multiline
          color="secondary"
          label="Field label"
          defaultValue="Filled text"
          rows={3}
        />
      ),
    },
    {
      id: "text-input-small-field-primary-focus-light",
      mode: "light",
      state: "focus",
      viewport: { width: 360, height: 140 },
      render: () => (
        <TextInput
          size="small"
          color="primary"
          label="Field label"
          placeholder="Placeholder"
          autoFocus
        />
      ),
    },
    {
      id: "text-input-large-field-error-light",
      mode: "light",
      state: "error",
      viewport: { width: 360, height: 160 },
      render: () => (
        <TextInput
          size="large"
          color="primary"
          label="Field label"
          defaultValue="Filled text"
          error
          sentiment="error"
          helperText="Helper text"
        />
      ),
    },
    {
      id: "text-input-medium-field-readonly-light",
      mode: "light",
      state: "readOnly",
      viewport: { width: 360, height: 140 },
      render: () => (
        <TextInput
          size="medium"
          color="primary"
          label="Field label"
          defaultValue="Filled text"
          readOnly
        />
      ),
    },
    {
      id: "text-input-xs-field-disabled-light",
      mode: "light",
      state: "disabled",
      viewport: { width: 360, height: 120 },
      render: () => (
        <TextInput
          size="extraSmall"
          color="primary"
          label="Field label"
          placeholder="Placeholder"
          disabled
        />
      ),
    },
    {
      id: "text-input-large-field-primary-default-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 360, height: 160 },
      render: () => (
        <TextInput
          size="large"
          color="primary"
          label="Field label"
          helperText="Helper text"
          placeholder="Placeholder"
        />
      ),
    },
  ];
