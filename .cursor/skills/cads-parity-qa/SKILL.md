---
name: cads-parity-qa
description: >-
  Mandatory Figma↔CADS component implementation and parity workflow. Use before
  building or updating any CADS component from Figma, when finishing a component
  batch, or when asked for parity QA, screenshot comparison, or invented-prop
  checks.
---

# CADS Component Parity Workflow

Use this skill from the first spec pull through the final correction pass. It is
not an end-only checklist. Goal: human review only for genuine ambiguity or API
decisions—not for styling already specified in Figma.

Also load:

- `figma-design-to-code` before calling Figma `get_design_context`
- `cads-prototyping` for package, variable, and consumer rules

Do not write component code until phases 0–2 below are complete.

## Sources of truth

| Layer | Source |
|---|---|
| Design | Figma file `DGekOeToRVifvFAhfqpeC1` |
| Prop snapshot | `packages/react/src/manifest/figmaComponentPropsSnapshot.json` |
| Visual recipe | `packages/react/src/manifest/visual-recipes/<Component>.json`, based on `visual-recipe-template.json` beside this skill |
| Code catalog | `cadsManifest` in `@codeai/cads-react` |
| Visual | Figma MCP design context/screenshots vs deterministic docs fixture |
| Build | `pnpm typecheck` + `pnpm build` (+ `pnpm build:docs` if docs changed) |

Related: `cads-prototyping` (how to build), `tooling/figma-sync` (variables).

## Non-negotiable completion rule

Do not report a component as complete based on code inspection or checked boxes
alone. Completion requires evidence:

1. Fresh design context from the exact public component-set node and all
   styling-relevant internal/related sets.
2. A committed prop snapshot entry and visual recipe.
3. A passing strict API audit.
4. Deterministic browser captures compared with matching Figma references.
5. At least one fix-and-recapture iteration whenever a mismatch is found.
6. A final evidence summary listing node IDs, cases, commands, and remaining
   accepted differences.

## When to escalate to a human

Escalate **only** when:

1. Figma property is design-tool-only vs needs a code-idiomatic API (e.g. Block `position` / `isActive` vs group `value`).
2. Token or interaction recipe is ambiguous across variants (conflicting variables, missing hover for one color).
3. Figma contains contradictory component definitions or an inaccessible source
   prevents inspecting a required state.
4. Snapshot `escalate` notes or audit `[escalate]` findings remain unresolved.

Do **not** ask the human to re-confirm sizes, variant enums, or states that are already in the Figma component set / snapshot.

Every accepted divergence must record the Figma behavior, code behavior, reason,
owner/decision source, and affected cases. “Looks close” is not an accepted
difference.

## Phase 0 — classify the task

Choose exactly one path and record it in the evidence summary:

- **New component:** no mapped implementation exists. Create the snapshot and
  visual recipe before implementation.
- **Figma update:** refresh both artifacts, diff against the committed versions,
  enumerate changed axes/values/variables/geometry, and test changed cases plus
  regression sentinels.
- **Code-only fix:** still refresh design evidence for the affected cases so the
  fix does not encode an assumption that contradicts Figma.

## Phase 1 — pull the complete design spec

1. Resolve the exact public node from `cadsManifest` /
   `figma.code-connect.json`. Do not use a page or nearby frame as a substitute.
2. Call Figma `get_design_context` on that node **before writing code**. This is
   the primary spec pull. Use `get_metadata` only to enumerate the full component
   set; it is not a styling specification.
3. Inspect every related set that affects rendering or composition (for example,
   Segmented Button Block or Icon Toggle + Label).
4. Capture:
   - axes, values, defaults, booleans, valid/invalid combinations
   - width/height, padding, gaps, overlap, borders, radii
   - typography family/size/weight/line-height and icon family/size
   - semantic variable bindings for every visible property
   - default, hover, focus, press/active, disabled, selected/on/off recipes
   - light/dark mode differences and component annotations
5. Take Figma reference screenshots for each case selected in phase 2.
6. Update the prop snapshot and visual recipe. Never fill missing values from
   memory, MUI defaults, Lab2, or the existing implementation.

If design context times out, retry a smaller exact node. Do not silently fall
back to screenshot-only implementation.

## Phase 2 — define coverage before coding

Populate `coverage.cases` in the visual recipe before implementation. Use a
minimal pairwise matrix rather than every permutation, but it must include:

- every size, color/tone, and visual variant at least once
- every interaction state
- light and dark modes
- selected/on/off and disabled behavior where applicable
- icon-only, start/end icon, long label, and composite layouts where applicable
- all combinations called out as restricted or exceptional in Figma/manifest
- one default regression sentinel per major variant family

Each case needs a stable ID, Figma node/variant reference, mode, props, state,
expected geometry, and expected semantic variables. Do not use vague case names
such as `test1`.

## Phase 3 — implement from the recipe

1. Reuse CADS variables and shared primitives. Do not reproduce Figma output as
   pasted Tailwind or raw absolute positioning.
2. Implement every recipe cell by `variant × color/tone × state × mode`.
3. Use CSS pseudo-classes for interaction states; do not expose Figma `state` as
   a React prop.
4. Keep selected chrome on selected variables and CTA/link treatments on brand
   variables.
5. Preserve exact component geometry instead of accepting MUI defaults.
6. Update TS types, manifest, docs fixture/playground, and Code Connect map in
   the same change.

## Phase 4 — deterministic correction loop

Use a dedicated docs fixture or stable playground URL for every coverage case.
The fixture must:

- render only the case under test in a fixed-size capture region
- load CADS variables and exact fonts before capture
- disable motion/transitions during capture
- expose stable selectors for the component and capture region
- support light/dark mode and controlled selected/on/off/disabled states

For each coverage case:

1. Capture the browser fixture at the recipe viewport and device scale.
2. Exercise states with real browser input: hover, keyboard `focus-visible`,
   pointer down for press, and disabled interaction. Do not fake state styling
   with an undocumented public prop.
3. Compare against the matching Figma reference, preferably with an overlay or
   pixel diff. Ignore only documented anti-aliasing noise.
4. Classify every mismatch as geometry, typography, variable/color, state,
   icon, content, or rendering noise.
5. Fix all non-noise mismatches and recapture the failed cases.
6. Repeat until all cases pass or only recorded escalation items remain.

A single visual pass is insufficient when it finds a mismatch. “Side-by-side
checked” without case IDs and results is not evidence.

## Phase 5 — API, behavior, and accessibility gates

- Run `pnpm figma:audit-props -- --strict`.
- Every Figma axis must map via `axisToCodeProp` or appear in
  `designOnlyAxes`.
- Every code-only prop needs a structured category and rationale in the
  snapshot. Public props may not be silently allowlisted.
- Resolve enum gaps/extras; strict mode treats warnings as failures.
- Verify manifest, TS types, playground controls, and examples agree.
- Verify keyboard operation, `focus-visible`, accessible naming, disabled
  behavior, and controlled/uncontrolled behavior.
- Verify composite layouts and content stress cases.

## Phase 6 — ship gate and evidence summary

Run:

```bash
pnpm typecheck
pnpm build
pnpm build:docs # when docs/fixtures changed
```

Update `docs/STATUS.md` when a milestone or next priority changes.

The final summary must include:

```text
Task path: new | Figma update | code-only fix
Components:
Figma evidence: public/related node IDs and retrieval date
Spec artifacts: snapshot entry + visual recipe path
Coverage: passed/total case IDs; light/dark; states exercised
Correction loop: mismatches found, fixes made, cases recaptured
API audit: error/warn/escalate/info counts
Verification: exact commands and results
Accepted differences/escalations: none | structured list
```

Do not paste a ceremonial A–G checklist. Report concrete evidence and results.

## Automation: now vs later

| Now (agents / local) | Later |
|---|---|
| Figma `get_design_context` + metadata → update spec artifacts | REST refresh/change fingerprint with `FIGMA_ACCESS_TOKEN` |
| `pnpm figma:audit-props -- --strict` | Required CI job on PRs |
| Deterministic fixture captures + overlay/diff correction loop | Playwright pixel baselines with browser/Figma normalization |
| Visual recipe coverage matrix | Generated pairwise fixtures + contrast checks |
| Code Connect maps in `figma.code-connect.json` | Enterprise Code Connect (out of scope) |

`get_context_for_code_connect` needs Org/Enterprise Dev seat — **do not block** on it; use `get_metadata` symbol names (`size=…, variant=…`).

## Refreshing the snapshot

1. Call Figma `get_design_context` with `fileKey` + exact `nodeId`.
2. Call `get_metadata` to enumerate all component symbols.
3. Parse `<symbol name="axis=value, …">` into `variantProperties`.
4. Update `packages/react/src/manifest/figmaComponentPropsSnapshot.json`.
5. Use structured `codeOnlyProps` entries with `name`, `category`, and `reason`.
6. Adjust `axisToCodeProp` / `designOnlyAxes` / `escalate` only for intentional
   differences.
7. Refresh the component visual recipe and coverage cases.
8. Re-run `pnpm figma:audit-props -- --strict`.

When adding a new component, create both spec artifacts **first**, then
implement, then run the correction loop and audits.

## Invocation

At the start of every new or updated CADS component:

```text
Load cads-parity-qa, cads-prototyping, and figma-design-to-code.
Classify this as a new component or Figma update. Pull design context from exact
node X, refresh the prop snapshot and visual recipe, define coverage cases, then
implement. Before done, run the deterministic correction loop, strict API audit,
typecheck, build, and report the required evidence summary. Escalate only genuine
ambiguity.
```
