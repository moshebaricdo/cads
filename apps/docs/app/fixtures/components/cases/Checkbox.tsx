"use client";

import { Checkbox } from "@codeai/cads-react/components/Checkbox";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "checkbox-large-unselected-thin-light",
      mode: "light",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Checkbox size="large" label="Checkbox" labelStyle="thin" />
      ),
    },
    {
      id: "checkbox-medium-selected-thin-light",
      mode: "light",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Checkbox
          size="medium"
          label="Checkbox"
          labelStyle="thin"
          checked
        />
      ),
    },
    {
      id: "checkbox-small-indeterminate-thick-light",
      mode: "light",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Checkbox
          size="small"
          label="Checkbox"
          labelStyle="thick"
          indeterminate
        />
      ),
    },
    {
      id: "checkbox-xs-selected-disabled-light",
      mode: "light",
      state: "disabled",
      viewport: { width: 180, height: 80 },
      render: () => (
        <Checkbox
          size="extraSmall"
          label="Checkbox"
          checked
          disabled
        />
      ),
    },
    {
      id: "checkbox-large-unselected-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Checkbox size="large" label="Checkbox" labelStyle="thin" />
      ),
    },
  ];
