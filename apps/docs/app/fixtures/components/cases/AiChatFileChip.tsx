"use client";

import { AiChatFileChip } from "@codeai/cads-react";
import type { FixtureCase } from "./shared";

const thumb =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="8" fill="#4C42CF"/><text x="32" y="38" text-anchor="middle" fill="white" font-size="14" font-family="sans-serif">img</text></svg>`,
  );

export const cases: FixtureCase[] = [
  {
    id: "acfc-file-stream-light",
    mode: "light",
    state: "default",
    viewport: { width: 180, height: 64 },
    render: () => (
      <AiChatFileChip type="file" useCase="chatStream" fileName="filename.ext" />
    ),
  },
  {
    id: "acfc-file-input-light",
    mode: "light",
    state: "default",
    viewport: { width: 180, height: 64 },
    render: () => (
      <AiChatFileChip type="file" useCase="inputField" fileName="filename.ext" />
    ),
  },
  {
    id: "acfc-code-stream-light",
    mode: "light",
    state: "default",
    viewport: { width: 220, height: 64 },
    render: () => (
      <AiChatFileChip
        type="codeSnippet"
        useCase="chatStream"
        fileName="filename.ext"
        metadata="12:56PM"
      />
    ),
  },
  {
    id: "acfc-image-stream-light",
    mode: "light",
    state: "default",
    viewport: { width: 64, height: 64 },
    render: () => (
      <AiChatFileChip type="image" useCase="chatStream" imageSrc={thumb} />
    ),
  },
  {
    id: "acfc-image-input-light",
    mode: "light",
    state: "default",
    viewport: { width: 64, height: 64 },
    render: () => (
      <AiChatFileChip type="image" useCase="inputField" imageSrc={thumb} />
    ),
  },
  {
    id: "acfc-file-stream-dark",
    mode: "dark",
    state: "default",
    viewport: { width: 180, height: 64 },
    render: () => (
      <AiChatFileChip type="file" useCase="chatStream" fileName="filename.ext" />
    ),
  },
];
