"use client";

import { Dropdown } from "@codeai/cads-react/components/Dropdown";
import {
  type FixtureCase,
  ICON_OPTIONS,
  ACTION_OPTIONS,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "dropdown-large-input-icon-bottomleft-light",
      mode: "light",
      viewport: { width: 420, height: 360 },
      render: () => (
        <Dropdown
          role="input"
          size="large"
          menuType="icon"
          menuPlacement="bottomLeft"
          label="Field label"
          helperText="Helper text"
          defaultOpen
          options={ICON_OPTIONS}
          defaultValue="a"
        />
      ),
    },
    {
      id: "dropdown-medium-input-checklist-bottomright-light",
      mode: "light",
      viewport: { width: 420, height: 360 },
      render: () => (
        <Dropdown
          role="input"
          size="medium"
          menuType="checklist"
          menuPlacement="bottomRight"
          label="Field label"
          defaultOpen
          options={ICON_OPTIONS}
          defaultValue={["a", "b"]}
        />
      ),
    },
    {
      id: "dropdown-large-action-icon-bottomleft-light",
      mode: "light",
      viewport: { width: 360, height: 360 },
      render: () => (
        <Dropdown
          role="action"
          size="large"
          menuType="icon"
          menuPlacement="bottomLeft"
          label="Button"
          defaultOpen
          options={ACTION_OPTIONS}
        />
      ),
    },
    {
      id: "dropdown-small-input-icon-topleft-light",
      mode: "light",
      viewport: { width: 420, height: 360 },
      render: () => (
        <div style={{ paddingTop: 180 }}>
          <Dropdown
            role="input"
            size="small"
            menuType="icon"
            menuPlacement="topLeft"
            label="Field label"
            defaultOpen
            options={ICON_OPTIONS}
            defaultValue="b"
          />
        </div>
      ),
    },
    {
      id: "dropdown-xs-action-icon-topright-light",
      mode: "light",
      viewport: { width: 360, height: 320 },
      render: () => (
        <div
          style={{
            paddingTop: 180,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Dropdown
            role="action"
            size="extraSmall"
            menuType="icon"
            menuPlacement="topRight"
            label="Button"
            defaultOpen
            options={ACTION_OPTIONS}
          />
        </div>
      ),
    },
    {
      id: "dropdown-large-input-icon-bottomleft-dark",
      mode: "dark",
      viewport: { width: 420, height: 360 },
      render: () => (
        <Dropdown
          role="input"
          size="large"
          menuType="icon"
          menuPlacement="bottomLeft"
          label="Field label"
          defaultOpen
          options={ICON_OPTIONS}
          defaultValue="a"
        />
      ),
    },
  ];
