# CADS — Status & next priorities

Last updated: 2026-07-16

## Done (scaffold complete)

- [x] Monorepo scaffold (pnpm, changesets, CI, Git-URL / committed `dist/`)
- [x] `@codeai/cads-variables` — ColorSystem port, non-color variables, `variables.css`, TS exports, MUI theme generator
- [x] `@codeai/cads-react` — pilot wrappers: Button, TextField, Checkbox, Radio, Tag, Tooltip + FaIcon / FA Pro fonts
- [x] `cadsManifest` + docs `/llms.txt` + `figma.code-connect.json` stubs
- [x] Docs mini-site (`apps/docs`) — playgrounds, props from manifest, variables pages, prototype gallery placeholder
- [x] `tooling/figma-sync` — offline report + REST fetch/rename detection when token present
- [x] Cursor skill + design-system rule
- [x] Lab2 sandbox bridge — `file:` deps + `#/design-system/cads` parity route (sibling `web-lab-prototype`)

## Not done yet (pick up here)

Priority order for the next agent sessions:

1. **Figma-map the pilot set** — fill `figma.nodeId` / `componentKey` on each `cadsManifest` entry and in `figma.code-connect.json` from the CADS file (Desktop Bridge or official MCP).
2. **Parity-verify pilot components** against Figma (screenshot side-by-side, light + dark, a11y: focus-visible, ARIA, contrast). Fix wrapper styles until they match CADS, not Lab2 `App*`.
3. **Harden docs honesty** — generate props tables from TS types (`react-docgen-typescript` or equivalent) instead of only the hand-maintained manifest; keep manifest as the AI substrate but wire descriptions from TSDoc.
4. **End-to-end designer → agent prototype** — small Figma screen built from CADS library components → implement via skill + manifest → measure fidelity gaps → tighten skill/manifest.
5. **Expand catalog** — next wave by prototyping value: dropdown/select, dialog/modal, segmented control, slider, alert, tabs.
6. **Variables completeness** — pull typography / spacing-shape / effects from Figma into the variables document (non-color values are currently ported from Lab2 globals, not live-synced).
7. **Publish / hosting** — push to GitHub when ready; decide org (`code-dot-org` vs other); optionally deploy docs (Vercel / GH Pages).
8. **Prototype gallery** — replace the placeholder with real inspectable prototypes.

## Explicit non-goals (for now)

- Replacing Lab2 `App*` atoms wholesale
- Publishing to public npm
- Published Figma Enterprise Code Connect
- Matching production `code-dot-org` Storybook APIs 1:1 (prod may later converge on MUI + this CADS API)
