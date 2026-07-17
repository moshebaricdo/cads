"use client";

import { Breadcrumbs } from "@codeai/cads-react/components/Breadcrumbs";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "breadcrumbs-large-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 480, height: 80 },
      render: () => (
        <Breadcrumbs
          size="large"
          items={[
            { label: "Breadcrumb", href: "#", iconName: "home" },
            { label: "Breadcrumb", href: "#" },
            { label: "Breadcrumb", current: true },
          ]}
        />
      ),
    },
    {
      id: "breadcrumbs-medium-overflow-light",
      mode: "light",
      state: "default",
      viewport: { width: 480, height: 80 },
      render: () => (
        <Breadcrumbs
          size="medium"
          maxItems={3}
          itemsBeforeCollapse={1}
          itemsAfterCollapse={2}
          items={[
            { label: "Breadcrumb", href: "#", iconName: "home" },
            { label: "Hidden A", href: "#" },
            { label: "Hidden B", href: "#" },
            { label: "Breadcrumb", href: "#" },
            { label: "Breadcrumb", current: true },
          ]}
        />
      ),
    },
    {
      id: "breadcrumbs-small-icon-home-light",
      mode: "light",
      state: "default",
      viewport: { width: 400, height: 80 },
      render: () => (
        <Breadcrumbs
          size="small"
          items={[
            { label: "Breadcrumb", href: "#", iconName: "home" },
            { label: "Breadcrumb", href: "#" },
            { label: "Breadcrumb", current: true },
          ]}
        />
      ),
    },
    {
      id: "breadcrumbs-xs-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 400, height: 80 },
      render: () => (
        <Breadcrumbs
          size="extraSmall"
          items={[
            { label: "Breadcrumb", href: "#", iconName: "home" },
            { label: "Breadcrumb", href: "#" },
            { label: "Breadcrumb", current: true },
          ]}
        />
      ),
    },
    {
      id: "breadcrumbs-large-default-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 480, height: 80 },
      render: () => (
        <Breadcrumbs
          size="large"
          items={[
            { label: "Breadcrumb", href: "#", iconName: "home" },
            { label: "Breadcrumb", href: "#" },
            { label: "Breadcrumb", current: true },
          ]}
        />
      ),
    },
  ];
