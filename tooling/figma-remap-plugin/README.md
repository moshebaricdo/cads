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
   Assets → Libraries). Uses the baked text-style catalog. Variables prefer a
   baked catalog when present; otherwise they import in parallel (not one-by-one)
   and cache in `clientStorage` for the next open.
2. **Audit selection** — walks surface layers for typography / shape / modes.
   Non-CADS instances are still one component finding each, but **color paints
   inside instances are audited** (marked “in instance”) so fills can be
   remapped before swapping components. Figma’s default component outline
   (`#9747ff`) is ignored. Clean SoT usage is omitted.
3. **Summary cards** — Colors / Typography / Shape / Modes / Components with
   issue counts. Category pages for colors / typography / shape / components
   use **Prepare fixes** to open a scoped remap panel. Components shows
   DSCO→CADS swap suggestions inline; Wave A/B components (Button, Link, Tag,
   Chip, Close Icon Button, Alert, Toast, Notification Banner, Font Awesome
   Icon / Duotone) can be swapped with prop remapping.
4. **Apply** — remaps selected mappings (or swaps component instances),
   optionally sets/clears modes, then re-audits so the summary updates. Fully
   clean → green pass state.

## Audit policy

Baked from the CADS file (`src/data/cadsCatalog.ts` + `cadsTextStyles.ts`):

- **Colors → semantic only.** Primitives and foreign/unbound colors are
  findings (including paints nested in component instances); primitives are
  never offered as remap targets. `#9747ff` (Figma component outline) is
  always excluded. Deterministic remaps are limited to the curated DSCO
  Variables → CADS alias map (`src/data/dscoColors.ts`) plus the user mapping
  cache. Paint styles, primitives, raw hex, and white/black theme choices stay
  unresolved for contextual AI (or manual pick). Audit still records surface /
  backdrop / manual-dark theme hints for the AI prompt, and may preselect
  “Set frame mode → Dark” when the selection looks hand-built dark. Apply may
  fail on some instance overrides — those usages are labeled “in instance”.
- **Typography → text styles.** Non-CADS styles, unstyled text, and Typography
  collection variables are findings (variables are report-only; remap via
  styles). DSCO style names rewrite deterministically; other styles/raw text
  pick the closest CADS ramp step by size + weight (13px Regular → Body 3
  Regular, 46px → H1, mono/link/overline roles when detectable).
- **Shape → unbound radii** on surface nodes (one usage per node, not per
  corner). DSCO/raw px bands map to `shape/sm|md|lg|xl|round`.
- **Modes → foreign explicit modes** on frames.
- **Components → non-CADS instances.** CADS instances are silent. Suggestions
  prefer published DSCO component keys → CADS names (`src/data/dscoComponents.ts`),
  then DSCO name rewrites, then exact CADS name match. Wave A/B swaps
  (`src/data/componentSwaps.ts`) import the CADS set, `swapComponent`, and
  remap variants/text/booleans (e.g. Destructive Button → Button `color=error`,
  Meaning→sentiment, Size L/M/S/XS → large/medium/small/extraSmall).
- **Spacing/padding** intentionally not surfaced.

## Text-style catalog

Baked in `src/data/cadsTextStyles.ts` (60 styles + font metrics, harvested
2026-08-04). Metrics are baked so startup skips `importStyleByKeyAsync` for
every style (that sequential import was the slow “Loading text styles” phase).
Apply still imports target styles lazily when remapping.

Refresh keys: `node tooling/figma-remap-plugin/scripts/fetch-text-styles.mjs`
(needs `FIGMA_ACCESS_TOKEN`; preserves existing metrics by key). Refresh
metrics from the open CADS file via Figma MCP / in-file capture when the type
ramp changes.

## Optional AI

Footer gear configures Anthropic/OpenAI (BYO key, local storage). With a key
saved, **Prepare fixes** shows a sparkle and runs AI after deterministic
propose — filling unresolved color rows using surface, backdrop, and theme
context. Without a key, Prepare fixes is deterministic only (DSCO Variables
map + cache); other color rows stay “Choose target…”.

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
src/main/components.ts  DSCO → CADS instance swaps + prop remap
src/shared/messages.ts  UI <-> main protocol
src/ui/main.ts          summary cards + fix panel
src/ui/template.html    shell styles
src/data/cadsTextStyles.ts  baked style keys
src/data/cadsCatalog.ts     component keys + collection policy
src/data/dscoComponents.ts  DSCO → CADS component suggestions
src/data/componentSwaps.ts  Wave A/B swap + prop rewrite rules
src/data/dscoColors.ts      DSCO Variables → CADS semantic color rewrites
src/data/dscoStyles.ts      DSCO Styles fills → CADS semantic rewrites
```
