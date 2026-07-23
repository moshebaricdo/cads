---
name: cads-figma-color-sync
description: >-
  Sync CADS color variables from the CADS Figma file into
  @codeai/cads-variables, regenerate CSS/TS, and refresh docs exporters. Use when
  the user asks to sync colors/tokens/variables with Figma, check Figma-vs-code
  color drift, update the palette from design, or refresh color docs/CSS export.
---

# CADS Figma → Color Variables Sync

Bring `packages/variables` (and therefore docs Color page + CSS exporters) in
line with Figma color variables. Tracks four drift classes:

1. **Values** — primitive hexes, per-mode resolved values
2. **Mappings** — semantic → primitive / semantic aliases (Light + Dark)
3. **Naming** — renames via stable Figma variable IDs
4. **Structure** — added/removed families, steps, tokens

**Canonical Figma file:** `DGekOeToRVifvFAhfqpeC1`  
**Code SoT:** `packages/variables/src/data/codeAiColorSystem.json`  
**Rename snapshot:** `packages/variables/src/data/figmaVariablesSnapshot.json`  
**Exporter:** `packages/variables/src/colorCssExport.ts` (`buildPrimitiveColorsCss` / `buildSemanticColorsCss`)  
**Docs:** `apps/docs/app/variables/color/` (imports color-system JSON + exporter at runtime)

Figma is the only design source. Sync live from Figma into this repo — do not
pull color SoT from sibling sandboxes.

## Progress checklist

```
- [ ] 1. Export all color variables (all modes) from live Figma
- [ ] 2. Diff vs snapshot + codeAiColorSystem.json (structure/renames/values)
- [ ] 3. Report differences (renames explicit)
- [ ] 4. Apply value/mapping/structure updates
- [ ] 5. Apply renames end-to-end (JSON ids/roles + CSS consumers)
- [ ] 6. Update exporter if naming/structure rules changed
- [ ] 7. Refresh snapshot + pnpm generate:variables (+ build:variables)
- [ ] 8. Second pass: live mapping audit (all semantics × Light/Dark)
- [ ] 9. LLM-as-judge spot-check on high-risk tokens
- [ ] 10. Verify typecheck/build; summarize (commit only if asked)
```

**Do not stop after step 2.** Diffing only against the committed snapshot can
miss in-place alias remaps (same token id/name, new primitive target) when the
snapshot is stale. Steps 8–9 are mandatory.

## 1. Export from Figma

Prefer a source that returns **all collections, Light + Dark, aliases, and
variable IDs**:

| Priority | Tool | Notes |
|---|---|---|
| 1 | `FIGMA_ACCESS_TOKEN` + `pnpm figma:sync` | REST `/variables/local`; headless |
| 2 | `use_figma` (`plugin-figma-figma`) | Plugin API `getLocalVariablesAsync`; load `figma-use` skill first; `skillNames: "resource:figma-use"` |
| Last | `get_variable_defs` | Spot-check only — single mode, no IDs, no aliases |

If no PAT and `use_figma` fails, ask the user for `FIGMA_ACCESS_TOKEN` (scopes:
File content Read + Variables Read). Do not invent a token.

Confirm Semantic Colors = Light + Dark and Primitive Colors are present. Live
expected ballpark: ~113 primitives, ~148 semantics (re-count each run).

## 2. Diff

Write a small Node script (do not eyeball large JSON). Compare:

- new Figma export
- committed `figmaVariablesSnapshot.json`
- `codeAiColorSystem.json`

Check:

- Primitive hexes (case-insensitive; `#00000000` = unset)
- Primitive structure (families/steps)
- Semantic → primitive `ref` and semantic → semantic `semanticRef` per mode
- Renames: same Figma variable ID, different path
- Added/removed tokens

Name map: Figma `text/accent/pink/secondary` ↔ token id `text/pink/secondary`
↔ CSS `--text-accent-pink-secondary` via `semanticExportVarName()`.

## 3. Report before editing

Summarize for the user: hex changes, remaps per mode, renames (old → new CSS
names), adds/removes. Flag intentional code-side experiments instead of
overwriting silently.

## 4. Apply value / mapping / structure

Edit only `codeAiColorSystem.json`:

- Update step `hex`; add families/steps with existing id conventions
- Update per-mode `ref` / `semanticRef` / `fallbackHex` (Dark from Figma Dark)
- **Preserve `comments`**
- Update `semanticTokenOrders` when roles are added/renamed

Do not hand-edit generated `variables.css` / `generated/cssVars.ts`.

## 5. Apply renames end-to-end

For each confirmed rename:

1. Update token `role` / `id` in JSON; keep stable family ids when only the
   display/role path changed
2. Grep the repo for the old `--…` CSS name; update component/docs references
3. Record high-blast-radius renames before applying if many hits

## 6. Exporter

If Figma introduces new subgroups, families, or role names the exporter cannot
emit, update `packages/variables/src/colorCssExport.ts`
(`semanticExportVarName`, `ROLE_RANK`, `GROUP_RANK`, etc.). Docs
`ColorPageContent` duplicates slug rules for display — keep them aligned.

## 7. Regenerate + snapshot

```bash
# After JSON edits:
pnpm generate:variables
pnpm build:variables
```

Write the new Figma export to `figmaVariablesSnapshot.json` (DTCG or REST —
match existing shape when possible so the next sync can ID-match renames).

Docs Color page and export buttons read the JSON / exporter at runtime — no
separate docs codegen. Still rebuild docs if you need a static `out/` check.

Optional headless path when PAT is set:

```bash
pnpm figma:sync          # report
pnpm figma:sync:apply    # write snapshot + generate:variables
# then still apply ColorSystem JSON updates (script does not rewrite it yet)
```

## 8. Second pass — live mapping audit (mandatory)

After applying changes, re-export **live** Semantic Colors aliases and compare
every token × mode to `codeAiColorSystem.json`.

Why: step 2 often diffs against the committed snapshot. An in-place Figma remap
(e.g. `text/brand/secondary` Light `purple/70` → `purple/90`) leaves counts and
names unchanged, so it does not show up as added/removed/renamed.

### How

1. `use_figma` (or REST): for each semantic COLOR var, resolve Light + Dark
   alias target names (e.g. `brand/purple/90`).
2. Node script: map each code semantic → Figma path (use **subgroup display
   name**, not stable id — `accent-2` displays as `accent`; brand collapses
   `text/brand/purple/secondary` → `text/brand/secondary`).
3. Map each code `ref` step id → Figma primitive path via family **display**
   name (`brand::teal::90` → `brand/purple/90`).
4. Fail the sync if any mismatch, unmatched code token, or unmatched Figma
   token remains. Fix and re-run until **0 / 0 / 0**.

Also confirm `fallbackHex` matches the resolved primitive hex for both modes.

Compact export shape that works well:

```js
// use_figma — one TSV line per semantic: name\tlightAlias\tdarkAlias
```

## 9. LLM-as-judge spot-check (mandatory)

After the audit is clean, re-read live Figma for a **high-risk set** and
sanity-check against code + generated CSS — do not trust the script alone:

| Priority | Tokens |
|---|---|
| Always | `text/brand/primary`, `text/brand/secondary`, `text/brand/primary-fixed` |
| Always | `border/state/focused/*`, `background/state/selected/*`, `text/state/selected/*` |
| Always | Accent text secondaries (`text/accent/{pink,orange}/secondary`) |
| If user mentioned a change | That exact token + its surface siblings (bg/border/text) |
| Rotate | 3–5 random neutrals / sentiment secondaries |

For each: Figma Light alias + hex, Figma Dark alias + hex, code `ref` +
`fallbackHex`, and `--{cssName}` in `variables.css`. Call out any doubt.

Known footgun: trusting a stale `figmaVariablesSnapshot.json` — structure can
look identical while a mapping is wrong.

## 10. Verify

```bash
pnpm typecheck
pnpm build:variables
# optional: pnpm build && pnpm build:docs
```

Confirm new/renamed CSS vars appear in `packages/variables/src/variables.css`
and that `buildSemanticColorsCss(system)` emits the same names.

Commit only if the user asks. Suggested message shape:

```
Sync color variables with CADS Figma

Update <n> primitive hexes and <m> semantic mappings; rename <k> tokens
(<old> → <new>); refresh figmaVariablesSnapshot.
```

## Quick smoke (counts only)

```js
// use_figma — collections + color counts
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const colors = await figma.variables.getLocalVariablesAsync("COLOR");
return {
  colorVariableCount: colors.length,
  collections: collections.map((c) => ({
    name: c.name,
    modes: c.modes.map((m) => m.name),
    variableIds: c.variableIds.length,
  })),
};
```
