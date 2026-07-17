"use client";

import { Tooltip } from "@codeai/cads-react/components/Tooltip";
import { Button } from "@codeai/cads-react/components/Button";
import {
  type FixtureCase,
} from "./shared";

export const cases: FixtureCase[] = [
    {
      id: "tooltip-top-icon-light",
      mode: "light",
      viewport: { width: 240, height: 140 },
      render: () => (
        <div style={{ paddingBottom: 48, textAlign: "center" }}>
          <Tooltip
            title="Tooltip"
            caretPlacement="top"
            startIcon
            open
            disableInteractive
            slotProps={{ popper: { disablePortal: true } }}
          >
            <Button size="small">Target</Button>
          </Tooltip>
        </div>
      ),
    },
    {
      id: "tooltip-bottom-light",
      mode: "light",
      viewport: { width: 240, height: 140 },
      render: () => (
        <div style={{ paddingTop: 48, textAlign: "center" }}>
          <Tooltip
            title="Tooltip"
            caretPlacement="bottom"
            open
            slotProps={{ popper: { disablePortal: true } }}
          >
            <Button size="small">Target</Button>
          </Tooltip>
        </div>
      ),
    },
    {
      id: "tooltip-left-light",
      mode: "light",
      viewport: { width: 280, height: 120 },
      render: () => (
        <div style={{ paddingRight: 120, textAlign: "center" }}>
          <Tooltip
            title="Tooltip"
            caretPlacement="left"
            startIcon
            open
            slotProps={{ popper: { disablePortal: true } }}
          >
            <Button size="small">Target</Button>
          </Tooltip>
        </div>
      ),
    },
    {
      id: "tooltip-right-dark",
      mode: "dark",
      viewport: { width: 280, height: 120 },
      render: () => (
        <div style={{ paddingLeft: 120, textAlign: "center" }}>
          <Tooltip
            title="Tooltip"
            caretPlacement="right"
            startIcon
            open
            slotProps={{ popper: { disablePortal: true } }}
          >
            <Button size="small">Target</Button>
          </Tooltip>
        </div>
      ),
    },
    {
      id: "tooltip-no-caret-light",
      mode: "light",
      viewport: { width: 240, height: 140 },
      render: () => (
        <div style={{ paddingBottom: 48, textAlign: "center" }}>
          <Tooltip
            title="Tooltip"
            caretPlacement="top"
            hasCaret={false}
            open
            slotProps={{ popper: { disablePortal: true } }}
          >
            <Button size="small">Target</Button>
          </Tooltip>
        </div>
      ),
    },
  ];
