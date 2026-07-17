"use client";

import { Radio } from "@codeai/cads-react/components/Radio";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "radio-large-unselected-thin-light",
      mode: "light",
      state: "default",
      viewport: { width: 220, height: 80 },
      render: () => (
        <Radio
          size="large"
          label="Radio button"
          labelStyle="thin"
          value="a"
        />
      ),
    },
    {
      id: "radio-medium-selected-thin-light",
      mode: "light",
      state: "default",
      viewport: { width: 220, height: 80 },
      render: () => (
        <Radio
          size="medium"
          label="Radio button"
          labelStyle="thin"
          value="a"
          checked
        />
      ),
    },
    {
      id: "radio-small-selected-thick-light",
      mode: "light",
      state: "default",
      viewport: { width: 220, height: 80 },
      render: () => (
        <Radio
          size="small"
          label="Radio button"
          labelStyle="thick"
          value="a"
          checked
        />
      ),
    },
    {
      id: "radio-xs-unselected-disabled-light",
      mode: "light",
      state: "disabled",
      viewport: { width: 200, height: 80 },
      render: () => (
        <Radio
          size="extraSmall"
          label="Radio button"
          value="a"
          disabled
        />
      ),
    },
    {
      id: "radio-large-selected-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 220, height: 80 },
      render: () => (
        <Radio
          size="large"
          label="Radio button"
          value="a"
          checked
        />
      ),
    },
  ];
