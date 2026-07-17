"use client";

import { Tabs } from "@codeai/cads-react/components/Tabs";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "tabs-large-primary-light",
      mode: "light",
      state: "default",
      viewport: { width: 480, height: 100 },
      render: () => (
        <Tabs
          type="primary"
          size="large"
          aria-label="Tabs"
          defaultValue="a"
          items={[
            { value: "a", label: "Tab Label" },
            { value: "b", label: "Tab Label" },
            { value: "c", label: "Tab Label" },
            { value: "d", label: "Tab Label" },
          ]}
        />
      ),
    },
    {
      id: "tabs-medium-secondary-light",
      mode: "light",
      state: "default",
      viewport: { width: 480, height: 80 },
      render: () => (
        <Tabs
          type="secondary"
          size="medium"
          aria-label="Tabs"
          defaultValue="a"
          items={[
            { value: "a", label: "Tab Label" },
            { value: "b", label: "Tab Label" },
            { value: "c", label: "Tab Label" },
            { value: "d", label: "Tab Label" },
          ]}
        />
      ),
    },
    {
      id: "tabs-small-primary-icons-light",
      mode: "light",
      state: "default",
      viewport: { width: 480, height: 80 },
      render: () => (
        <Tabs
          type="primary"
          size="small"
          aria-label="Tabs"
          defaultValue="a"
          items={[
            { value: "a", label: "Tab Label", startIconName: "face-smile" },
            { value: "b", label: "Tab Label", startIconName: "face-smile" },
            { value: "c", label: "Tab Label", startIconName: "face-smile" },
          ]}
        />
      ),
    },
    {
      id: "tabs-xs-secondary-light",
      mode: "light",
      state: "default",
      viewport: { width: 400, height: 64 },
      render: () => (
        <Tabs
          type="secondary"
          size="extraSmall"
          aria-label="Tabs"
          defaultValue="a"
          items={[
            { value: "a", label: "Tab Label" },
            { value: "b", label: "Tab Label" },
            { value: "c", label: "Tab Label" },
          ]}
        />
      ),
    },
    {
      id: "tabs-large-primary-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 480, height: 100 },
      render: () => (
        <Tabs
          type="primary"
          size="large"
          aria-label="Tabs"
          defaultValue="a"
          items={[
            { value: "a", label: "Tab Label" },
            { value: "b", label: "Tab Label" },
            { value: "c", label: "Tab Label" },
            { value: "d", label: "Tab Label" },
          ]}
        />
      ),
    },
    {
      id: "tabs-large-primary-hover-light",
      mode: "light",
      state: "hover",
      viewport: { width: 480, height: 100 },
      render: () => (
        <Tabs
          type="primary"
          size="large"
          aria-label="Tabs"
          defaultValue="a"
          items={[
            { value: "a", label: "Tab Label" },
            { value: "b", label: "Tab Label" },
            { value: "c", label: "Tab Label" },
            { value: "d", label: "Tab Label" },
          ]}
        />
      ),
    },
  ];
