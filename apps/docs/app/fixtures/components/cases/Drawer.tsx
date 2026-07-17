"use client";

import { Drawer } from "@codeai/cads-react/components/Drawer";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "drawer-text-light",
      mode: "light",
      viewport: { width: 900, height: 320 },
      render: () => <Drawer type="textOnly" surfaceOnly />,
    },
    {
      id: "drawer-custom-light",
      mode: "light",
      viewport: { width: 900, height: 360 },
      render: () => (
        <Drawer type="customContent" surfaceOnly>
          <div style={{ height: 72 }} />
        </Drawer>
      ),
    },
    {
      id: "drawer-text-dark",
      mode: "dark",
      viewport: { width: 900, height: 320 },
      render: () => <Drawer type="textOnly" surfaceOnly />,
    },
    {
      id: "drawer-no-desc-light",
      mode: "light",
      viewport: { width: 900, height: 280 },
      render: () => (
        <Drawer type="textOnly" hasDescription={false} surfaceOnly />
      ),
    },
  ];
