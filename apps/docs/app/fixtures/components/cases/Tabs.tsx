"use client";

import { SegmentedButton, Tabs } from "@codeai/cads-react";
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
    {
      id: "tabs-large-primary-selected-hover-dark",
      mode: "dark",
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
    {
      id: "tabs-medium-secondary-hover-light",
      mode: "light",
      state: "hover",
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
      id: "tabs-overflow-primary-light",
      mode: "light",
      state: "overflow-start",
      viewport: { width: 280, height: 96 },
      render: () => (
        <Tabs
          type="primary"
          size="medium"
          aria-label="Overflowing primary tabs"
          defaultValue="overview"
          items={[
            { value: "overview", label: "Overview" },
            { value: "curriculum", label: "Curriculum" },
            { value: "standards", label: "Standards alignment" },
            { value: "resources", label: "Teacher resources" },
            { value: "settings", label: "Settings" },
          ]}
        />
      ),
    },
    {
      id: "tabs-overflow-secondary-dark",
      mode: "dark",
      state: "overflow-start",
      viewport: { width: 280, height: 80 },
      render: () => (
        <Tabs
          type="secondary"
          size="medium"
          aria-label="Overflowing secondary tabs"
          defaultValue="overview"
          items={[
            { value: "overview", label: "Overview" },
            { value: "curriculum", label: "Curriculum" },
            { value: "standards", label: "Standards alignment" },
            { value: "resources", label: "Teacher resources" },
            { value: "settings", label: "Settings" },
          ]}
        />
      ),
    },
    {
      id: "tabs-intrinsic-width-with-sibling-light",
      mode: "light",
      state: "layout",
      viewport: { width: 1040, height: 120 },
      render: () => (
        <>
          <style>{`
            .tabs-shared-baseline {
              --tabs-baseline-color: transparent;
              box-shadow: none !important;
              position: relative;
              z-index: 1;
            }
            .tabs-shared-baseline-row {
              position: relative;
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              gap: var(--spacing-p-m);
              width: 100%;
            }
            .tabs-shared-baseline-row::after {
              content: "";
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              height: 1px;
              background: var(--border-neutral-primary);
              pointer-events: none;
              z-index: 0;
            }
          `}</style>
          <div className="tabs-shared-baseline-row">
            <Tabs
              type="primary"
              size="small"
              className="tabs-shared-baseline"
              aria-label="Typography style groups"
              defaultValue="heading"
              items={[
                { value: "heading", label: "Heading" },
                { value: "body", label: "Body" },
                { value: "overline", label: "Overline" },
                { value: "label", label: "Label" },
                { value: "link", label: "Link" },
                { value: "mono", label: "Mono" },
              ]}
            />
            <SegmentedButton
              size="extraSmall"
              aria-label="Heading weight"
              defaultValue="semi-bold"
              options={[
                { value: "regular", label: "Regular" },
                { value: "semi-bold", label: "Semi Bold" },
                { value: "bold", label: "Bold" },
              ]}
            />
          </div>
        </>
      ),
    },
  ];
