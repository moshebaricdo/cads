# CADS — Agent Playbook

Read this **before writing code** in this repo. For the full product plan, see [`docs/PLATFORM_PLAN.md`](docs/PLATFORM_PLAN.md). For current priorities, see [`docs/STATUS.md`](docs/STATUS.md).

---

## What this repo is

Standalone **CodeAI Design System (CADS)** platform:

| Path | Package | Role |
|---|---|---|
| `packages/variables` | `@codeai/cads-variables` | Design variables (color, type, spacing/shape, elevation) → CSS + TS + MUI theme |
| `packages/react` | `@codeai/cads-react` | MUI-wrapped CADS components + icons (`@codeai/cads-react/icons`) |
| `apps/docs` | `@codeai/cads-docs` | Designer-grade docs mini-site (Next.js) |
| `tooling/figma-sync` | `@codeai/cads-figma-sync` | Figma → variables sync |
| `tooling/cads-artifact` | `@codeai/cads-artifact` | Claude skill + self-contained HTML artifact runtime |
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
| Architecture / roadmap | [`docs/PLATFORM_PLAN.md`](docs/PLATFORM_PLAN.md) |
| Prototyping / AI fidelity | [`.cursor/skills/cads-prototyping/SKILL.md`](.cursor/skills/cads-prototyping/SKILL.md) |
| Build/update a component (before coding through “done”) | [`.cursor/skills/cads-parity-qa/SKILL.md`](.cursor/skills/cads-parity-qa/SKILL.md) |
| Styling rules | [`.cursor/rules/design-system.mdc`](.cursor/rules/design-system.mdc) |
| Figma variables sync | [`tooling/figma-sync/README.md`](tooling/figma-sync/README.md) |
| Component catalog for agents | `cadsManifest` in `@codeai/cads-react` / docs `/llms.txt` |

---

## Environment & Figma tooling

Copy `.env.example` → `.env` locally (never commit secrets).

| Need | How |
|---|---|
| Headless variable sync | Set `FIGMA_ACCESS_TOKEN` (Figma PAT with File content Read + Variables Read). Run `pnpm figma:sync` or `pnpm figma:sync:apply`. |
| Interactive Figma MCP (screenshots, execute, bridge tools) | Open **Figma Desktop Bridge** plugin in Figma Desktop (`Plugins → Development → Figma Desktop Bridge`). Bridge connects to `ws://localhost:9225`. |
| Official Figma MCP / local Code Connect maps | Use `add_code_connect_map` / committed [`figma.code-connect.json`](figma.code-connect.json). Fill real `nodeId` / `componentKey` values as you map components. |

Agents should **not** invent a PAT; ask the user if sync requires one and it is missing.

---

## Commands

```bash
pnpm install
pnpm generate:variables
pnpm build
pnpm typecheck
pnpm dev:docs          # http://localhost:3100 (Turbopack)
pnpm build:docs        # static export → apps/docs/out (GITHUB_PAGES=true → basePath=/cads)
pnpm figma:sync        # needs FIGMA_ACCESS_TOKEN for live fetch
pnpm figma:audit-props # cadsManifest ↔ Figma prop snapshot (Actions pilot)
pnpm artifact:build    # Claude skill ZIP → tooling/cads-artifact/dist/cads-prototyping.zip
```

Docs are deployed to GitHub Pages from `main` via `.github/workflows/deploy-docs.yml` → `https://moshebaricdo.github.io/cads/`.

After changing `codeAiColorSystem.json` or non-color variable definitions, always regenerate and rebuild consumers.

When iterating on `@codeai/cads-react` under a live docs server: rebuild the package, then **restart** `pnpm dev:docs` (do not delete `dist/` out from under Next — that can peg CPU and hang requests). For a local static preview, prefer `pnpm build:docs` then serve `apps/docs/out`.

---

## Styling & component rules (summary)

- Use semantic color vars (e.g. `--background-brand-primary`) and non-color vars (`--radius-sm`, `--space-m`) — **no hard-coded hex**, no `--ds-*` prefix.
- Brand tokens for CTAs/links; **selected** tokens for filled selected chrome; never paint selected surfaces with brand fills.
- Control heights via `size`: large 48 / medium 40 / small 32 / extraSmall 24.
- Only props/variants listed in `cadsManifest` — do not invent APIs.
- Keep docs props / variable pages generated from source (manifest or TS), not hand-written duplicates that can drift.

---

## Verification

Before considering work complete:

```bash
pnpm typecheck
pnpm build
```

If docs changed meaningfully, also `pnpm build:docs`.

Update [`docs/STATUS.md`](docs/STATUS.md) when you finish a milestone or change “what’s next.”
