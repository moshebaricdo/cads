# CADS — Agent Playbook

Read this **before writing code** in this repo. For the full product plan, see [`docs/PLATFORM_PLAN.md`](docs/PLATFORM_PLAN.md). For current priorities, see [`docs/STATUS.md`](docs/STATUS.md).

---

## What this repo is

Standalone **CodeAI Design System (CADS)** platform:

| Path | Package | Role |
|---|---|---|
| `packages/variables` | `@codeai/cads-variables` | Design variables (color, type, spacing/shape, elevation, motion) → prod-shaped split CSS + barrel `variables.css` + TS + MUI theme |
| `packages/react` | `@codeai/cads-react` | MUI-wrapped CADS components + icons (`@codeai/cads-react/icons`) |
| `apps/docs` | `@codeai/cads-docs` | Designer-grade docs mini-site (Next.js) |
| `tooling/figma-sync` | `@codeai/cads-figma-sync` | Figma → variables sync |
| `tooling/cads-artifact` | `@codeai/cads-artifact` | Portable Agent Skills ZIP + self-contained HTML prototype runtime (internal) |
| `tooling/cads-mcp` | `@codeai/cads-mcp` | Experimental local MCP (stdio) for CADS prototypes |

This is **not** the Lab2 sandbox and **not** the production `code-dot-org` component library. It is the forward-looking CADS reference implementation.

---

## Confirmed decisions (do not re-litigate without the user)

1. **Figma is the design source of truth** — file `DGekOeToRVifvFAhfqpeC1` ([CADS Figma](https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-)). Code syncs from Figma; do not hand-fork a parallel palette or component API.
2. **MUI under the hood, CADS API on top** — consumers import `Button` from `@codeai/cads-react`, never raw MUI. MUI is a regular dependency (caret-pinned major), not a peer dep.
3. **“Variables,” not “tokens”** — package name and docs language match Figma. Color CSS custom properties use semantic names without a `ds-` prefix (e.g. `--background-brand-primary`).
4. **Icons live in `@codeai/cads-react`** — subpath `@codeai/cads-react/icons`. FA Pro fonts ship in-package (internal license only — never public npm).
5. **Distribution** — Git-URL / `file:` installs with committed `dist/`. GitHub Packages later if needed. No public npmjs.org org required.
6. **No Figma Enterprise Code Connect publish** — use `cadsManifest` + `figma.code-connect.json` + session MCP maps instead.
7. **Docs site is custom Next.js**, not Storybook.

---

## Sibling Lab2 sandbox (consumer only)

Path (typical local checkout): `../web-lab-prototype`

| Fact | Detail |
|---|---|
| Role | Consumer of `@codeai/cads-*` via `file:../cads/packages/*` |
| Parity route | `#/design-system/cads` (`CadsParityPage`) |
| Local `App*` atoms | Stay as Lab2 prototype primitives — **not** the CADS component SoT |
| Color sandbox | Stays in Lab2 for exploration; promoting colors means updating `packages/variables/src/data/codeAiColorSystem.json` here and running `pnpm generate:variables` |

**Do not** copy Lab2 `App*` implementations into this repo as the design source. Lab2 may be a behavioral reference (focus rings, keyboard) only. Spec from Figma.

---

## Required reading by task

| Task | Read |
|---|---|
| Any change | This file + [`docs/STATUS.md`](docs/STATUS.md) |
| Human-facing repo intro | Root [`README.md`](README.md) (generated — see below) |
| Architecture / roadmap | [`docs/PLATFORM_PLAN.md`](docs/PLATFORM_PLAN.md) |
| Prototyping / AI fidelity | [`.cursor/skills/cads-prototyping/SKILL.md`](.cursor/skills/cads-prototyping/SKILL.md) |
| Build/update a component (before coding through “done”) | [`.cursor/skills/cads-parity-qa/SKILL.md`](.cursor/skills/cads-parity-qa/SKILL.md) |
| Styling rules | [`.cursor/rules/design-system.mdc`](.cursor/rules/design-system.mdc) |
| Figma color variables sync | [`.cursor/skills/cads-figma-color-sync/SKILL.md`](.cursor/skills/cads-figma-color-sync/SKILL.md) + [`tooling/figma-sync/README.md`](tooling/figma-sync/README.md) |
| Component catalog for agents | `cadsManifest` in `@codeai/cads-react` / docs `/llms.txt` |

---

## Environment & Figma tooling

Copy `.env.example` → `.env` locally (never commit secrets).

| Need | How |
|---|---|
| Color variables sync (agent workflow) | Follow [`.cursor/skills/cads-figma-color-sync/SKILL.md`](.cursor/skills/cads-figma-color-sync/SKILL.md). Prefer `use_figma` or `FIGMA_ACCESS_TOKEN` + `pnpm figma:sync`. |
| Headless variable sync | Set `FIGMA_ACCESS_TOKEN` (Figma PAT with File content Read + Variables Read). Run `pnpm figma:sync` or `pnpm figma:sync:apply`. |
| Interactive Figma MCP (screenshots, execute, bridge tools) | Open **Figma Desktop Bridge** plugin in Figma Desktop (`Plugins → Development → Figma Desktop Bridge`). Bridge connects to `ws://localhost:9225`. |
| Official Figma MCP / local Code Connect maps | Use `add_code_connect_map` / committed [`figma.code-connect.json`](figma.code-connect.json). Fill real `nodeId` / `componentKey` values as you map components. |

Agents should **not** invent a PAT; ask the user if sync requires one and it is missing.

---

## Commands

```bash
pnpm install
pnpm generate:variables
pnpm generate:readme   # refresh root README (nav / Storybook status / docs/experiments.json)
pnpm build
pnpm typecheck
pnpm dev:docs          # http://localhost:3100 (Turbopack)
pnpm build:docs        # regenerates README + static export → apps/docs/out (GITHUB_PAGES=true → basePath=/cads)
pnpm figma:sync        # needs FIGMA_ACCESS_TOKEN for live fetch
pnpm figma:audit-props # cadsManifest ↔ Figma prop snapshot (Actions pilot)
pnpm artifact:build    # Full artifact rebuild + skill ZIP (FA7 Pro inlined)
pnpm artifact:package  # Runtime + skill ZIP only (packages already built; used by Pages deploy)
```

Docs are deployed to GitHub Pages from `main` via `.github/workflows/deploy-docs.yml` → `https://moshebaricdo.github.io/cads/`.

After changing `codeAiColorSystem.json` or non-color variable definitions, always regenerate and rebuild consumers (`pnpm generate:variables` / `pnpm build`). Generated CSS is split for prod ingest — `primitiveColors.css`, `colors.css`, `fontVariables.css`, `shapeAndSpacingVariables.css`, `motionVariables.css` — plus CADS runtime `typographyVariables.css` and exportable `typography.module.scss` (depends on prod’s existing `font.scss`). `variables.css` is an `@import` barrel. Foundation docs pages Export each collection.

Docs `next dev` resolves `@codeai/cads-react` / `@codeai/cads-variables` from **source** (Turbopack/webpack aliases in `apps/docs/next.config.mjs`), so component edits hot-reload without rebuilding `dist/`. Still run `pnpm build:react` before commit/publish (committed `dist/`). Production `pnpm build:docs` uses `dist/` via package `exports`. Avoid wiping `packages/*/dist` under a stale server that was started before source aliases — if `.next` corrupts, delete `apps/docs/.next` and restart. For a local static preview, prefer `pnpm build:docs` then serve `apps/docs/out`.

---

## Styling & component rules (summary)

- Use semantic color vars (e.g. `--background-brand-primary`) and non-color vars (`--shape-sm`, `--spacing-p-m`) — **no hard-coded hex**, no `--ds-*` prefix.
- Brand tokens for CTAs/links; **selected** tokens for filled selected chrome; never paint selected surfaces with brand fills.
- Control heights via `size`: large 48 / medium 40 / small 32 / extraSmall 24.
- Only props/variants listed in `cadsManifest` — do not invent APIs.
- Keep docs props / variable pages generated from source (manifest or TS), not hand-written duplicates that can drift.
- After changing docs nav, Storybook links in `componentExternalLinks`, or [`docs/experiments.json`](docs/experiments.json), run `pnpm generate:readme` (also runs on `pnpm build:docs`).

### Component folder recipe (`@codeai/cads-react`)

Co-locate each component (source organization — public API is the barrel only):

```text
packages/react/src/components/notification-banner/
  NotificationBanner.tsx
  notificationBanner.module.scss
  types.ts
  index.ts
```

- MUI for structure; **styles in SCSS modules** via `className` (not large `sx` blobs). Dynamic chrome may use CSS custom properties set inline.
- Public API is the package barrel only (`import { X } from "@codeai/cads-react"`). Do not add `./components/*` export maps or PascalCase deep-import shims.
- Build: Vite library mode (`pnpm build:react`) with CSS modules; do not use tsup.

#### CSS modules vs MUI Emotion specificity

MUI injects Emotion styles at runtime with compound class selectors (e.g. `.MuiButton-root.MuiButton-contained`), reaching specificity 0,2,0 or higher. A plain CSS module class (0,1,0) **will lose**. To guarantee CADS styles win:

- **Double `:global()` specificity bump** — write the root selector as:

  ```scss
  .root:global(.MuiButton-root):global(.MuiButton-root) { ... }
  ```

  This yields specificity **0,3,0** and beats any MUI compound selector without resorting to `!important`. Substitute the appropriate MUI class for each component:
  - `MuiButton-root` → Button
  - `MuiButtonBase-root` → SegmentedButton, Tabs, Toggle
  - `MuiIconButton-root` → IconToggle, CloseIconButton

- **Never put interactive colors in React `style={{ backgroundColor }}`** — MUI's own hover/active Emotion styles override inline `backgroundColor`. Instead, set CSS custom properties on `style` and consume them in SCSS where pseudo-classes (`:hover`, `:active`) can override per state.

  ```tsx
  // Good: set vars, let SCSS handle states
  style={{ '--btn-bg': bg, '--btn-bg-hover': bgHover } as CSSProperties}
  ```

  ```scss
  // SCSS consumes them
  background-color: var(--btn-bg);
  &:hover { background-color: var(--btn-bg-hover); }
  ```

  See `Button` (`button.module.scss`) and `Toggle` (`toggle.module.scss`) as reference implementations.

---

## Verification

Before considering work complete:

```bash
pnpm typecheck
pnpm build
```

If docs changed meaningfully, also `pnpm build:docs`.

Update [`docs/STATUS.md`](docs/STATUS.md) when you finish a milestone or change “what’s next.” Commit an updated [`README.md`](README.md) when the catalog, status, or experiments list changed.
