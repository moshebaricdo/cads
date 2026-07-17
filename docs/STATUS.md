# CADS — Status & next priorities

Last updated: 2026-07-16

## Done (scaffold complete)

- [x] Monorepo scaffold (pnpm, changesets, CI, Git-URL / committed `dist/`)
- [x] `@codeai/cads-variables` — ColorSystem port, non-color variables, `variables.css`, TS exports, MUI theme generator
- [x] Color CSS vars use semantic names **without** `--ds-` prefix (e.g. `--background-brand-primary`)
- [x] `@codeai/cads-react` — Figma-parity Actions: Button, SegmentedButton, IconToggle (+ labeled); FieldWrapper, TextInput (+ deprecated TextField alias), Dropdown (input/action); plus Checkbox, Radio, Tag, Tooltip + FaIcon (solid/regular/brands)
- [x] Shared control size scale: `large` | `medium` | `small` | `extraSmall`
- [x] `cadsManifest` + docs `/llms.txt` + `figma.code-connect.json` maps for Actions + Field/TextInput/Dropdown
- [x] Docs mini-site (`apps/docs`) — interactive Storybook-style prop playgrounds, props from manifest, variables pages, prototype gallery placeholder, deterministic `/fixtures/components` capture route
- [x] Motion variables (`--duration-*`, `--easing-*`, `--transition-colors`) applied to Button / SegmentedButton / IconToggle
- [x] `tooling/figma-sync` — offline report + REST fetch/rename detection when token present
- [x] Cursor skill + design-system rule
- [x] Lab2 sandbox bridge — `file:` deps + `#/design-system/cads` parity route (sibling `web-lab-prototype`)
- [x] **Parity QA workflow (scaffold)** — mandatory new/update lifecycle in `.cursor/skills/cads-parity-qa`, visual-recipe schema/template, committed Figma prop snapshot for Button / SegmentedButton / IconToggle / FieldWrapper / TextInput / Dropdown, strict `pnpm figma:audit-props`
- [x] **Field / Text Input / Dropdown batch (2026-07-16)** — see evidence summary below

## Field / Text Input / Dropdown — evidence summary

```text
Task path: new
Components: FieldWrapper, TextInput (TextField deprecated alias), Dropdown
Figma evidence (retrieved 2026-07-16):
  - Field Wrapper public 15857:99804 / key a76313f790928233bb8afabe35bd6f76f6e9a473
  - Text Input public 16176:4884 / key ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4
    related building block 16146:3517
  - Dropdown public 15857:100676 / key d3660d988bcb4702c24ce921128e32cadb6618db
    related Dropdown Button 964:10677, Menu List 971:4280, Menu Item 896:3791
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json
  - packages/react/src/manifest/visual-recipes/{FieldWrapper,TextInput,Dropdown}.json
  - captures under packages/react/src/manifest/visual-recipes/captures/
Coverage: 5 + 7 + 6 = 18/18 recipe cases marked pass (light + dark sentinels; field/area; input checklist + action; focus/error/readonly/disabled)
Correction loop:
  - Dropdown: Grow + portal broke fixture captures → instant Popper + disablePortal; anchorEl callback state for defaultOpen
  - Recaptured checklist + action menus; measured TextInput large=48px / XS=24px
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm figma:audit-props -- --strict; pnpm typecheck; pnpm build; pnpm build:docs — all pass
Accepted differences:
  - TextInput extraSmall field height: Figma building block 22px → CADS shared 24px
    (user-approved 2026-07-16; case text-input-xs-field-disabled-light)
```

## Not done yet (pick up here)

Priority order for the next agent sessions:

1. **Adopt closed-loop parity workflow on Actions** — pull fresh `get_design_context`; create Button / SegmentedButton / IconToggle visual recipes and deterministic coverage fixtures; run light + dark state captures, fix and recapture mismatches, then a11y. SegmentedButton Group `8027:2099` / Block `8000:4554`.
2. **Figma-map remaining pilots** — fill `figma.nodeId` / `componentKey` on Checkbox, Radio, Tag, Tooltip; add them to the prop snapshot + audit.
3. **Harden docs honesty** — generate props tables from TS types (`react-docgen-typescript` or equivalent) instead of only the hand-maintained manifest; keep manifest as the AI substrate but wire descriptions from TSDoc.
4. **End-to-end designer → agent prototype** — small Figma screen built from CADS library components → implement via skill + manifest → measure fidelity gaps → tighten skill/manifest.
5. **Expand catalog** — next wave: dialog/modal, chips, slider, alert, tabs. **Each batch:** snapshot axes → implement → `pnpm figma:audit-props` → rubric in `cads-parity-qa` before “done.”
6. **Variables completeness** — pull typography / spacing-shape / effects from Figma into the variables document (non-color values are currently ported from Lab2 globals, not live-synced).
7. **Publish / hosting** — push to GitHub when ready; decide org (`code-dot-org` vs other); optionally deploy docs (Vercel / GH Pages).
8. **Prototype gallery** — replace the placeholder with real inspectable prototypes.
9. **Harness automation (later)** — REST snapshot refresh/change fingerprint with PAT; CI strict audit; Playwright pairwise fixture generation and normalized pixel baselines.

## Explicit non-goals (for now)

- Replacing Lab2 `App*` atoms wholesale
- Publishing to public npm
- Published Figma Enterprise Code Connect
- Matching production `code-dot-org` Storybook APIs 1:1 (prod may later converge on MUI + this CADS API)
