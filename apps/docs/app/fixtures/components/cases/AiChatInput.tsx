"use client";

import { AiChatInput } from "@moshebaricdo/cads-react";
import type { FixtureCase } from "./shared";

export const cases: FixtureCase[] = [
  {
    id: "aci-empty-default-light",
    mode: "light",
    state: "default",
    viewport: { width: 340, height: 120 },
    render: () => <AiChatInput defaultValue="" placeholder="Type something" />,
  },
  {
    id: "aci-filled-default-light",
    mode: "light",
    state: "default",
    viewport: { width: 340, height: 120 },
    render: () => <AiChatInput defaultValue="This is filled text" />,
  },
  {
    id: "aci-empty-focus-light",
    mode: "light",
    state: "focus",
    viewport: { width: 340, height: 120 },
    render: () => <AiChatInput defaultValue="" placeholder="Type something" />,
  },
  {
    id: "aci-empty-disabled-light",
    mode: "light",
    state: "disabled",
    viewport: { width: 340, height: 120 },
    render: () => <AiChatInput disabled defaultValue="" placeholder="Type something" />,
  },
  {
    id: "aci-filled-default-dark",
    mode: "dark",
    state: "default",
    viewport: { width: 340, height: 120 },
    render: () => <AiChatInput defaultValue="This is filled text" />,
  },
];
