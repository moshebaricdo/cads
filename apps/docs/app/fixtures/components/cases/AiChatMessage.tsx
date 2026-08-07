"use client";

import { AiChatMessage } from "@codeai/cads-react";
import type { FixtureCase } from "./shared";

export const cases: FixtureCase[] = [
  {
    id: "acm-ta-human-light",
    mode: "light",
    state: "default",
    viewport: { width: 340, height: 120 },
    render: () => (
      <AiChatMessage context="TA" author="Human">
        Can you suggest a warm-up activity for my Unit 3 loops lesson?
      </AiChatMessage>
    ),
  },
  {
    id: "acm-tutor-human-light",
    mode: "light",
    state: "default",
    viewport: { width: 340, height: 120 },
    render: () => (
      <AiChatMessage context="Tutor" author="Human">
        Why does my sprite keep disappearing when I click run?
      </AiChatMessage>
    ),
  },
  {
    id: "acm-ta-ai-light",
    mode: "light",
    state: "default",
    viewport: { width: 340, height: 200 },
    render: () => (
      <AiChatMessage context="TA" author="AI">
        Sure! Have students write a loop that prints their name 10 times, then
        challenge them to add a counter.
      </AiChatMessage>
    ),
  },
  {
    id: "acm-tutor-ai-light",
    mode: "light",
    state: "default",
    viewport: { width: 340, height: 200 },
    render: () => (
      <AiChatMessage context="Tutor" author="AI">
        Good question! Take a look at line 4 — what do you think happens when
        your loop sets the sprite&apos;s size to 0?
      </AiChatMessage>
    ),
  },
  {
    id: "acm-ta-ai-dark",
    mode: "dark",
    state: "default",
    viewport: { width: 340, height: 200 },
    render: () => (
      <AiChatMessage context="TA" author="AI">
        Sure! Have students write a loop that prints their name 10 times, then
        challenge them to add a counter.
      </AiChatMessage>
    ),
  },
];
