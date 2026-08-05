# CADS Audit — internal Figma dev plugin

Findings-only audit of a selected frame against the **CADS** library. Fully
CADS frames pass silently. Issues (foreign/primitive colors, bad typography,
unbound radii, foreign modes, non-CADS components) show as summary cards with
optional category-scoped remaps.

**Internal development plugin — not published to Community.** Designers add it
locally in Figma Desktop: `Plugins → Development → Import plugin from
manifest…` → `tooling/figma-remap-plugin/manifest.json`.

## How it works

1. **Auto-load CADS** on open (requires the CADS library enabled in the file via
   Assets → Libraries). Uses the baked text-style catalog.
2. **Audit selection** — walks *surface* layers only. Does **not** descend into
   component instances (CADS or legacy). A non-CADS Button is one component
   finding, not dozens of internal tokens. Clean SoT usage is omitted.
3. **Summary cards** — Colors / Typography / Shape / Modes / Components with
   issue counts. Expand a card for details; **Review fixes** opens a panel
   scoped to that category (or **Review fixes** from the footer).
4. **Apply** — remaps selected mappings, optionally sets/clears modes, then
   re-audits so the summary updates. Fully clean → green pass state.

## Audit policy

Baked from the CADS file (`src/data/cadsCatalog.ts` + `cadsTextStyles.ts`):

- **Colors → semantic only.** Primitives and foreign/unbound colors are
  findings; primitives are never offered as remap targets.
- **Typography → text styles.** Non-CADS styles, unstyled text, and Typography
  collection variables are findings (variables are report-only; remap via
  styles).
- **Shape → unbound radii** on surface nodes (one usage per node, not per
  corner), value-matched to Spacing & Shape.
- **Modes → foreign explicit modes** on frames.
- **Components → non-CADS instances** (report-only). CADS instances are silent.
- **Spacing/padding** intentionally not surfaced.

## Text-style catalog

Baked in `src/data/cadsTextStyles.ts` (61 styles harvested 2026-08-04).

Refresh baked styles: `node tooling/figma-remap-plugin/scripts/fetch-text-styles.mjs`
(needs `FIGMA_ACCESS_TOKEN`).

## Optional AI

✦ configures Anthropic/OpenAI (BYO key, local storage). AI suggest fills
unresolved rows in the fix panel.

## Develop

```bash
pnpm plugin:remap:build
pnpm plugin:remap:watch
pnpm --filter @codeai/cads-figma-remap-plugin run typecheck
```

## Source layout

```text
src/code.ts             main-thread orchestrator (CADS auto-load)
src/main/audit.ts       findings-only selection walk
src/main/catalog.ts     teamLibrary variable import
src/main/styles.ts      baked text-style catalog import
src/main/matcher.ts     deterministic proposals
src/main/apply.ts       rebind + styles + modes
src/shared/messages.ts  UI <-> main protocol
src/ui/main.ts          summary cards + fix panel
src/ui/template.html    shell styles
src/data/cadsTextStyles.ts  baked style keys
src/data/cadsCatalog.ts     component keys + collection policy
```
