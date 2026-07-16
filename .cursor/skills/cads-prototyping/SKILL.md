---
name: cads-prototyping
description: Prototype UI with CADS (@codeai/cads-react + @codeai/cads-variables) matching Figma fidelity. Use when building screens from CADS Figma mocks, implementing designer prototypes, or when the user asks for CodeAI design-system components.
---

# CADS Prototyping

Build UI with the CodeAI Design System packages — never invent components, props, or colors.

## Sources of truth

1. **Figma:** `https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-` (`fileKey: DGekOeToRVifvFAhfqpeC1`)
2. **Manifest:** `import { cadsManifest } from "@codeai/cads-react"` (or `@codeai/cads-react/manifest`)
3. **Docs / llms.txt:** docs site `/llms.txt` for a text catalog of every component

## Setup (once per app)

```tsx
import "@codeai/cads-variables/variables.css";
import "@codeai/cads-react/icons/fonts.css";
import { CadsProvider, Button } from "@codeai/cads-react";
```

Toggle dark mode by adding/removing `.dark` on an ancestor.

## Rules

- Only use components listed in `cadsManifest.components`.
- Only use props/variants declared on each manifest entry.
- Style with `--ds-*` variables (and non-color vars like `--radius-sm`, `--space-m`). **No hex literals.**
- Brand = CTAs / links / primary actions. Selected = filled selected chrome. Never paint selected surfaces with brand fills.
- Control heights via `size`: `l` 48 / `m` 40 / `s` 32 / `xs` 24.
- Icons: `FaIcon` from `@codeai/cads-react/icons` with FA Pro names.

## Figma → code mapping (no Enterprise Code Connect)

When implementing a Figma frame:

1. Identify CADS library component instances (names often match Button, Text Field, etc.).
2. Look up the matching entry in `cadsManifest` (by name; fill `figma.nodeId` / `componentKey` when known).
3. Map Figma variant properties → CADS props (`variant`, `tone`, `size`, …).
4. Optional: maintain a local Code Connect map via the official Figma MCP (`add_code_connect_map`) or a committed `figma.code-connect.json` in the consumer repo.
5. After implementing, screenshot-compare against Figma (`figma_take_screenshot` / official MCP) and fix token/spacing drift.

## Failure modes to avoid

- Inventing props (`color="purple"`, `intent="danger"`) — use `tone` / documented enums.
- Hard-coded colors or Tailwind palette classes.
- Using sandbox `App*` components when the task asks for CADS packages.
- Skipping `CadsProvider` or forgetting `variables.css`.
