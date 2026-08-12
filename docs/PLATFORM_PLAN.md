# Standalone CADS Platform — Plan (in-repo)

Canonical copy of the platform plan for agents working in this repo. Status of execution: see [`STATUS.md`](STATUS.md). Agent entrypoint: [`../AGENTS.md`](../AGENTS.md).

---

## Confirmed decisions

- **New standalone repo** (`cads`), consumed as packages; not in `code-dot-org`, not anchored to Lab2 `App*` components.
- **MUI under the hood, CADS API on top**: consumers import from `@moshebaricdo/cads-react` (never raw MUI). Personal/prototype GitHub Packages publish — not an official CodeAI org package.
- **Figma CADS file is the design source of truth** (`DGekOeToRVifvFAhfqpeC1`); code artifacts are generated/synced from it, never hand-forked.
- **Custom Next.js docs mini-site** (MUI/Spectrum-style), not Storybook.
- **Sequencing:** foundation first, docs second, AI workflows third — but AI-facing artifacts (manifest, Code Connect substitutes) are designed in from day one.

## Target architecture

```mermaid
flowchart TD
    figma[CADS Figma File] -->|variables export + snapshot diff| varsPkg["@moshebaricdo/cads-variables"]
    figma -->|component mapping| ccMap[Local Code Connect map]
    varsPkg -->|CSS vars + MUI theme| reactPkg["@moshebaricdo/cads-react (MUI-wrapped, incl. icons)"]
    reactPkg --> manifest["cads.manifest + llms.txt"]
    reactPkg --> docsSite[Docs mini-site Next.js]
    varsPkg --> docsSite
    manifest --> aiLayer[AI workflows: skills, MCP context, Cursor rules]
    ccMap --> aiLayer
    reactPkg -->|GitHub Packages @moshebaricdo| sandbox[Lab2 sandbox + other prototypes]
    aiLayer --> sandbox
    docsSite -->|designer prototypes gallery| engineers[Engineers reference props/specs]
```

## Phase 0 — Repo scaffold

- `packages/variables` → `@moshebaricdo/cads-variables`
- `packages/react` → `@moshebaricdo/cads-react` (components **and** icons under `/icons`)
- `apps/docs` → docs mini-site
- `tooling/figma-sync` → sync scripts + committed Figma snapshots
- Distribution: GitHub Packages `@moshebaricdo/cads-*` from `moshebaricdo/cads`. Sibling `file:` for local CADS iteration. No public npm.
- FA Pro fonts: licensed, internal-only — ship in `@moshebaricdo/cads-react`

## Phase 1 — Variables package

- ColorSystem JSON + generators + Figma snapshot live under `packages/variables`
- `tooling/figma-sync`: four drift classes (values, mappings, naming, structure) + ID-matched renames
- Non-color: typography, spacing/shape, radii, elevation (eventually live-synced from Figma; initially ported)
- Outputs: `variables.css` (semantic color vars like `--background-brand-primary`, `:root` / `.dark`), typed TS object, generated MUI theme

## Phase 2 — Component package pilot

- Wrap MUI behind CADS-named exports; style with semantic CSS vars (no `--ds-` prefix); no hardcoded hex
- Pilot: Button, TextField, Checkbox, Radio, Tag, Tooltip
- Spec from Figma component sets; Lab2 `App*` is behavioral reference only
- Definition of done: variant/state parity with Figma, light + dark, a11y, TSDoc, manifest entry

## Phase 3 — Docs mini-site

- Next.js App Router; live playgrounds; props tables; variables pages; Figma deep links
- Designer prototype gallery for inspectable prototypes
- Long-term: props auto-gen from TS types (avoid hand-drift)

## Phase 4 — AI / Figma-parity layer

- `cadsManifest` in `@moshebaricdo/cads-react`
- Docs `/llms.txt`
- Local Code Connect map (`figma.code-connect.json` + MCP session maps) — no Enterprise publish
- Distributable Cursor skill: `.cursor/skills/cads-prototyping`
- Parity QA harness: `.cursor/skills/cads-parity-qa` + `figmaComponentPropsSnapshot.json` + `pnpm figma:audit-props`
- End-to-end designer → agent → consumer prototype loop (still to run for real)

## Phase 5 — Lab2 consumption bridge

- Sibling `web-lab-prototype` installs via GitHub Packages `@moshebaricdo/cads-*` in CI; `file:` remains valid for local CADS iteration
- Route `/design-system/cads` for parity
- Do **not** big-bang replace `App*`
- Color sandbox stays exploratory in Lab2; export target for platform SoT is this repo’s variables document

## Resolved decisions (2026-07-16)

- FA Pro fonts: ship privately in `@moshebaricdo/cads-react`
- Naming: “variables” package; icons not a separate package
- npm: no official npm org; prototype installs are GitHub Packages `@moshebaricdo/cads-*`
- Code Connect: manifest + local map (no Enterprise)
- MUI: latest stable major, caret range, **regular dependency** of `@moshebaricdo/cads-react`
- Distribution: committed `dist/` for docs/artifact builds; GitHub Packages for external prototypes

## Open items

- Docs props generation from TS (honesty / anti-drift)
- Real Figma node IDs on every manifest entry
- Pixel parity verification of the pilot set against Figma
