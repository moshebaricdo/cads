# `@codeai/cads-figma-sync`

Repeatable Figma → variables sync for CADS.

## Drift classes

1. **Values** — primitive hexes, per-mode resolved values  
2. **Mappings** — semantic → primitive / semantic aliases (Light + Dark)  
3. **Naming** — renames detected via stable Figma variable IDs  
4. **Structure** — added/removed collections, families, steps, tokens  

## Usage

```bash
# Offline sanity report (no network)
pnpm figma:sync

# Live fetch + report
FIGMA_ACCESS_TOKEN=figd_… pnpm figma:sync

# Write new snapshot + regenerate CSS
FIGMA_ACCESS_TOKEN=figd_… pnpm figma:sync:apply
```

Canonical Figma file: `DGekOeToRVifvFAhfqpeC1`.

Snapshot path: `packages/variables/src/data/figmaVariablesSnapshot.json`.

Applying REST diffs into `codeAiColorSystem.json` (full ColorSystem rewrite) is intentionally staged — use this tool for fetch/rename detection, then update the ColorSystem document before regenerating.

## Component prop audit (Actions pilot)

Compares `cadsManifest` to the committed Figma variant-axis snapshot:

```bash
pnpm figma:audit-props
pnpm figma:audit-props -- --strict   # fail on error/escalate
```

Snapshot: `packages/react/src/manifest/figmaComponentPropsSnapshot.json`
Agent workflows:
- Color variables: [`.cursor/skills/cads-figma-color-sync/SKILL.md`](../../.cursor/skills/cads-figma-color-sync/SKILL.md)
- Component props: [`.cursor/skills/cads-parity-qa/SKILL.md`](../../.cursor/skills/cads-parity-qa/SKILL.md)
