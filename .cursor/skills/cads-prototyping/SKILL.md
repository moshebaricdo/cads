---
name: cads-prototyping
description: Prototype UI or build/update CADS components with @codeai/cads-react and @codeai/cads-variables at Figma fidelity. Use for CADS Figma mocks, designer prototypes, and every new or updated CodeAI design-system component.
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
- Style with semantic color vars (e.g. `--background-brand-primary`) and non-color vars (`--radius-sm`, `--space-m`). **No hex literals. No `--ds-` prefix.**
- Brand = CTAs / links / primary actions. Selected = filled selected chrome. Never paint selected surfaces with brand fills.
- Control heights via `size`: `large` 48 / `medium` 40 / `small` 32 / `extraSmall` 24.
- Icons: `FaIcon` from `@codeai/cads-react/icons` with FA Pro names.

## Figma → code mapping (no Enterprise Code Connect)

When implementing a Figma frame:

1. Load `figma-design-to-code` and call `get_design_context` on the exact target node before writing code. Metadata and screenshots supplement design context; they do not replace it.
2. Identify CADS library component instances (names often match Button, Text Field, etc.).
3. Look up the matching entry in `cadsManifest` (by name; fill `figma.nodeId` / `componentKey` when known).
4. Map Figma variant properties → CADS props (`variant`, `color`, `size`, …).
5. Optional: maintain a local Code Connect map via the official Figma MCP (`add_code_connect_map`) or a committed `figma.code-connect.json` in the consumer repo.
6. Run the `cads-parity-qa` deterministic correction loop before completion.

When building or updating the CADS library component itself, load
`cads-parity-qa` **before implementation**. Create or refresh its prop snapshot
and machine-readable visual recipe, define coverage cases, then implement and
recapture failed cases until they pass. Do not treat parity QA as an end-only
review.

## Failure modes to avoid

- Inventing props (`color="purple"`, `intent="danger"`) — use documented enums from the manifest.
- Hard-coded colors or Tailwind palette classes.
- Using sandbox `App*` components when the task asks for CADS packages.
- Skipping `CadsProvider` or forgetting `variables.css`.
