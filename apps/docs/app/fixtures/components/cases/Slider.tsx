"use client";

import { Slider } from "@codeai/cads-react/components/Slider";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "slider-large-default-controls-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 140 },
      render: () => (
        <Slider
          size="large"
          label="Field label"
          helperText="Helper text"
          showHelper
          showControls
          defaultValue={50}
          aria-label="Slider"
        />
      ),
    },
    {
      id: "slider-medium-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 120 },
      render: () => (
        <Slider
          size="medium"
          label="Field label"
          helperText="Helper text"
          defaultValue={50}
        />
      ),
    },
    {
      id: "slider-small-error-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 120 },
      render: () => (
        <Slider
          size="small"
          sentiment="error"
          label="Field label"
          helperText="Helper text"
          defaultValue={50}
        />
      ),
    },
    {
      id: "slider-xs-disabled-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 120 },
      render: () => (
        <Slider
          size="extraSmall"
          label="Field label"
          helperText="Helper text"
          defaultValue={50}
          disabled
        />
      ),
    },
    {
      id: "slider-medium-stepper-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 140 },
      render: () => (
        <Slider
          size="medium"
          label="Field label"
          showHelper={false}
          showControls
          showStepper
          stepCount={5}
          defaultValue={50}
        />
      ),
    },
    {
      id: "slider-medium-center-positive-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 120 },
      render: () => (
        <Slider
          size="medium"
          label="Field label"
          helperText="Helper text"
          startsFrom="center"
          defaultValue={50}
        />
      ),
    },
    {
      id: "slider-medium-center-negative-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 120 },
      render: () => (
        <Slider
          size="medium"
          label="Field label"
          showHelper={false}
          startsFrom="center"
          defaultValue={-50}
        />
      ),
    },
    {
      id: "slider-medium-default-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 360, height: 120 },
      render: () => (
        <Slider
          size="medium"
          label="Field label"
          helperText="Helper text"
          defaultValue={50}
        />
      ),
    },
  ];
