"use client";

import { Popover } from "@codeai/cads-react/components/Popover";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "popover-text-bottom-left-light",
      mode: "light",
      viewport: { width: 360, height: 280 },
      render: () => (
        <Popover content="textOnly" caretPlacement="bottomLeft" surfaceOnly />
      ),
    },
    {
      id: "popover-text-image-light",
      mode: "light",
      viewport: { width: 360, height: 400 },
      render: () => (
        <Popover
          content="textImage"
          caretPlacement="bottomCenter"
          hasCaret={false}
          surfaceOnly
        />
      ),
    },
    {
      id: "popover-custom-light",
      mode: "light",
      viewport: { width: 360, height: 120 },
      render: () => (
        <Popover content="custom" hasCaret={false} surfaceOnly>
          Popover with custom content
        </Popover>
      ),
    },
    {
      id: "popover-top-center-dark",
      mode: "dark",
      viewport: { width: 360, height: 280 },
      render: () => (
        <Popover content="textOnly" caretPlacement="topCenter" surfaceOnly />
      ),
    },
    {
      id: "popover-no-stepper-light",
      mode: "light",
      viewport: { width: 360, height: 260 },
      render: () => (
        <Popover
          content="textOnly"
          caretPlacement="bottomCenter"
          hasStepper={false}
          surfaceOnly
        />
      ),
    },
  ];
