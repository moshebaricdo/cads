# CADS — CodeAI Design System

Standalone design-system platform for CodeAI: Figma-anchored **variables**, MUI-wrapped **React components** (with icons), a designer-grade **docs mini-site**, and **AI/Figma parity** tooling.

| Package | Name | Purpose |
|---|---|---|
| `packages/variables` | `@codeai/cads-variables` | Color + typography + spacing/shape + effects; CSS vars, TS object, generated MUI theme |
| `packages/react` | `@codeai/cads-react` | CADS components wrapping MUI; icons at `@codeai/cads-react/icons` |
| `apps/docs` | `@codeai/cads-docs` | Next.js docs mini-site |
| `tooling/figma-sync` | `@codeai/cads-figma-sync` | Figma → variables sync (values, mappings, naming, structure) |

**Design source of truth:** [CADS Figma file](https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-) (`fileKey: DGekOeToRVifvFAhfqpeC1`).

## Quick start

```bash
pnpm install
pnpm generate:variables
pnpm build
pnpm dev:docs
```

## Install into a consumer (Git-URL)

Packages ship committed `dist/` folders so consumers can install from Git without a registry:

```bash
# From a tag or branch that includes built dist/
npm install github:<owner>/cads#packages/variables&path:packages/variables
# or, for local development against a sibling checkout:
npm install ../cads/packages/variables ../cads/packages/react
```

Simpler local path (recommended while iterating with the Lab2 sandbox):

```bash
# In the consumer package.json
"@codeai/cads-variables": "file:../cads/packages/variables",
"@codeai/cads-react": "file:../cads/packages/react"
```

Then import:

```tsx
import "@codeai/cads-variables/variables.css";
import { CadsProvider, Button, TextField } from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";
```

## Scripts

| Script | Description |
|---|---|
| `pnpm generate:variables` | Regenerate `variables.css`, TS exports, MUI theme from the variables document |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | Typecheck packages |
| `pnpm figma:sync` | Diff Figma variables vs snapshot and report/apply (needs `FIGMA_ACCESS_TOKEN`) |
| `pnpm dev:docs` | Run the docs site |

## License

Internal Code.org / CodeAI use. Font Awesome Pro fonts are licensed for internal distribution only — do not publish packages to public npm.
