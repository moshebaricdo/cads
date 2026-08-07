"use client";

import { ChatFileRemoveButton } from "@codeai/cads-react";
import type { FixtureCase } from "./shared";

export const cases: FixtureCase[] = [
  {
    id: "cfrb-default-light",
    mode: "light",
    state: "default",
    viewport: { width: 64, height: 64 },
    render: () => <ChatFileRemoveButton aria-label="Remove" />,
  },
  {
    id: "cfrb-hover-light",
    mode: "light",
    state: "hover",
    viewport: { width: 64, height: 64 },
    render: () => <ChatFileRemoveButton aria-label="Remove" />,
  },
  {
    id: "cfrb-press-light",
    mode: "light",
    state: "press",
    viewport: { width: 64, height: 64 },
    render: () => <ChatFileRemoveButton aria-label="Remove" />,
  },
  {
    id: "cfrb-focus-light",
    mode: "light",
    state: "focus",
    viewport: { width: 64, height: 64 },
    render: () => <ChatFileRemoveButton aria-label="Remove" />,
  },
  {
    id: "cfrb-disabled-light",
    mode: "light",
    state: "disabled",
    viewport: { width: 64, height: 64 },
    render: () => <ChatFileRemoveButton disabled aria-label="Remove" />,
  },
  {
    id: "cfrb-default-dark",
    mode: "dark",
    state: "default",
    viewport: { width: 64, height: 64 },
    render: () => <ChatFileRemoveButton aria-label="Remove" />,
  },
];
