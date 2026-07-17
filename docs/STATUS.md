# CADS — Status & next priorities

Last updated: 2026-07-17

## Done (scaffold complete)

- [x] Monorepo scaffold (pnpm, changesets, CI, Git-URL / committed `dist/`)
- [x] `@codeai/cads-variables` — ColorSystem port, non-color variables, `variables.css`, TS exports, MUI theme generator
- [x] Color CSS vars use semantic names **without** `--ds-` prefix (e.g. `--background-brand-primary`)
- [x] `@codeai/cads-react` — Figma-parity Actions: Button, SegmentedButton, IconToggle (+ labeled); FieldWrapper, TextInput (+ deprecated TextField alias), Dropdown (input/action); Checkbox, Radio, Toggle; Slider, Chip, ChipGroup; Alert, Toast, NotificationBanner, Tag; Link, Breadcrumbs, Tabs; **Tooltip**, **Popover**, **Drawer**, **Dialog**, **Modal**; plus FaIcon (solid/regular/brands)
- [x] Shared control size scale: `large` | `medium` | `small` | `extraSmall` (Link also `extraExtraSmall`)
- [x] `cadsManifest` + docs `/llms.txt` + `figma.code-connect.json` maps through Messaging + Navigation + Overlays (Tooltip/Popover/Drawer/Dialog/Modal)
- [x] Docs mini-site (`apps/docs`) — interactive Storybook-style prop playgrounds, props from manifest, variables pages, prototype gallery placeholder, deterministic `/fixtures/components` capture route
- [x] **GitHub Pages** — static export (`output: 'export'`) + `.github/workflows/deploy-docs.yml`; site at `https://moshebaricdo.github.io/cads/` (`GITHUB_PAGES=true` sets `basePath=/cads`)
- [x] Motion variables (`--duration-*`, `--easing-*`, `--transition-colors`) applied to Button / SegmentedButton / IconToggle
- [x] `tooling/figma-sync` — offline report + REST fetch/rename detection when token present
- [x] Cursor skill + design-system rule
- [x] Lab2 sandbox bridge — `file:` deps + `#/design-system/cads` parity route (sibling `web-lab-prototype`)
- [x] **Parity QA workflow (scaffold)** — mandatory new/update lifecycle in `.cursor/skills/cads-parity-qa`, visual-recipe schema/template, committed Figma prop snapshot + strict `pnpm figma:audit-props`
- [x] **Field / Text Input / Dropdown batch (2026-07-16)** — see prior evidence summary
- [x] **Checkbox / Radio / Toggle batch (2026-07-17)** — see prior evidence summary
- [x] **Slider / Chip / ChipGroup batch (2026-07-17)** — see prior evidence summary
- [x] **Alert / Toast / NotificationBanner / Tag batch (2026-07-17)** — see evidence summary below
- [x] **Link / Breadcrumbs / Tabs batch (2026-07-17)** — see evidence summary below
- [x] **Tooltip / Popover / Drawer / Dialog / Modal batch (2026-07-17)** — see evidence summary below
- [x] **Docs performance pass (2026-07-17)** — tree-shakeable `@codeai/cads-react` (`tsup` preserve modules + ESM `.js` fix), deep MUI imports in `CadsProvider`, lazy per-component playground/fixture chunks, deferred `react-live`, FA `font-display: swap`, Turbopack docs dev. Prod First Load for `/components/[name]` **333KB → 110KB** (route JS **88KB → 6KB**). Avoid wiping `packages/react/dist` while `next dev` is running (HMR can wedge the server).
- [x] **Cross-client prototyping proof of concept (2026-07-17)** — local stdio MCP exposes manifest search, constrained prototype schema, strict validation, and URL-encoded `/prototype` rendering through the real CADS package. Six validator/protocol tests pass; interactive TextInput/Dropdown/Button smoke-tested. Production gaps intentionally left visible: remote HTTP transport, auth, persistence, and multi-screen actions.
- [x] **Claude artifact kit (2026-07-17)** — `@codeai/cads-artifact` bundles real CADS + FA fonts into a self-contained HTML runtime for organization-only Claude artifacts (no hosting). Runtime **3.74 MB** (JS 662 KB / CSS+fonts 3.10 MB); sample teacher-onboarding HTML **3.84 MB**; skill ZIP **3.20 MB** at `tooling/cads-artifact/dist/cads-prototyping.zip`. Local browser smoke: TextInput/Dropdown/Alert/Button + FA icons interactive. Upload via Customize → Skills; see `tooling/cads-artifact/MANUAL_TEST.md`.
- [x] **Close Icon Button (2026-07-17)** — promoted the shared close action to a public Figma-mapped component and refactored Alert, Toast, NotificationBanner, Tag, Tabs, Popover, Drawer, Dialog, and Modal to compose it.

## Close Icon Button — evidence summary

```text
Task path: new public component (promoted existing internal primitive)
Components: CloseIconButton; consumers Alert, Toast, NotificationBanner, Tag, Tabs, Popover, Drawer, Dialog, Modal
Figma evidence (retrieved 2026-07-17, file DGekOeToRVifvFAhfqpeC1):
  - Close Icon Button public 6368:7269 / key c492ad784f39078a3067dde33f2be223d6e30903
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json
  - packages/react/src/manifest/visual-recipes/CloseIconButton.json
Coverage: 10/10 recipe cases pass
  (sizes L–XS; all 9 colors including orange; default/hover/focus/press; light + dark)
Correction loop:
  - Exact Figma-node references checked for large default, medium hover, small focus, and XS press
  - 2026-07-17 Figma updates added orange, swapped default/hover variables, and corrected warning hover to warning-primary; browser sweep reconfirmed geometry, semantic state colors, and focus rings
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm typecheck; pnpm build:react; pnpm figma:audit-props -- --strict; pnpm build:docs
Accepted differences: disabled is code-only because Figma has no disabled variant
```

## Alert / Toast / NotificationBanner / Tag — evidence summary

```text
Task path: new (Alert, Toast, NotificationBanner) + Figma update (shape/md surfaces) + Figma-mapped rebuild (Tag stub → color API)
Components: Alert, Toast, NotificationBanner, Tag
Figma evidence (retrieved 2026-07-17, file DGekOeToRVifvFAhfqpeC1):
  - Alert public 2133:4160 / key dbe516b76486882d3508633715c5e4e999c183db
  - Toast public 10587:14942 / key 29c36f3d7ec051b81e7dc42a724d9097a680f2ee
  - Notification Banner public 10618:632 / key 5f158e59f1188b62d671448be304f22d3a7bde42
  - Tag public 16433:2625 / key e4a964357b1eaedfab777db89058ccb4d528ec1c
  - related Close Icon Button 6368:7269 / key c492ad784f39078a3067dde33f2be223d6e30903
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json
  - packages/react/src/manifest/visual-recipes/{Alert,Toast,NotificationBanner,Tag}.json
  - captures under packages/react/src/manifest/visual-recipes/captures/ (32 browser + 4 Figma set refs)
Coverage: 8 + 8 + 8 + 8 = 32/32 recipe cases marked pass
  (Alert sizes L–XS × sentiments; Toast sentiments incl. primary; Banner fillStyle none/color; Tag sizes + pink/orange; light + dark)
Correction loop:
  - Playwright fixture captures for all coverage IDs; geometry within ~2px of Figma (font metrics)
  - Shared messagingSentiment chrome map for brand/pink/orange/success/error/warning/info/neutral
  - 2026-07-17 Figma update: Alert, Toast, and NotificationBanner surfaces changed to shape/md; exact-node references and browser computed styles confirm 8px
API notes:
  - Toast Figma sentiment=primary → brand chrome tokens (kept as primary in public API)
  - Tag stub `tone` replaced by Figma `color` (includes pink/orange); TagTone deprecated alias retained
  - Public CloseIconButton composed internally for dismiss actions
  - Follow-up (2026-07-17): Alert/Toast action locked to outlined secondary + size map; actionLabel required (empty→"Button") + actionStart/EndIconName; Alert iconPadTop; NotificationBanner title+description required; fullWidth on Alert + NotificationBanner
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm figma:audit-props -- --strict; pnpm typecheck; pnpm build; pnpm build:docs
Accepted differences: none (≤2px width/height from font metrics vs Figma symbols)
```

## Link / Breadcrumbs / Tabs — evidence summary

```text
Task path: new component (all three)
Components: Link, Breadcrumbs, Tabs (Tab Item internal only)
Figma evidence (retrieved 2026-07-17, file DGekOeToRVifvFAhfqpeC1):
  - Link public 3480:5546 / key 87b099a460c3dad155731d3983e7ccfecefc5975
  - Breadcrumbs public 16381:3339 / key 43afede0abfd158d2c740e2801b46d13e570a8d0
    related Links 6862:5619, Separators 2434:9333, Overflow 16398:927
  - Tabs (Tab Group) public 16496:3371 / key b49fe2d463645f88551c83bd8bff0ab56fcde35e
    related Tab Item 6240:7203 / key 6bdc7c7da3d1d1193ec90ba2bf1d52c03cf01e39
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json
  - packages/react/src/manifest/visual-recipes/{Link,Breadcrumbs,Tabs}.json
  - captures under packages/react/src/manifest/visual-recipes/captures/
    (18 browser + figma-link-set / figma-breadcrumbs-set / figma-tabs-group refs)
Coverage: 7 + 5 + 6 = 18/18 recipe cases marked pass
  (Link sizes incl. xxs, hover/focus/disabled, secondary, dark;
   Breadcrumbs sizes + overflow maxItems + home icon + dark;
   Tabs primary/secondary, icons, hover, dark)
Correction loop:
  - FaIcon alias home→house (Figma shortcode)
  - Link focus ring honors .Mui-focusVisible for fixture captures
  - Docs fixture/global a:hover underline neutralized for Link chrome
API notes:
  - Breadcrumbs: Figma slot composition → items[] + maxItems overflow menu
  - Tabs: Figma Tab Item isCurrent → group value/defaultValue/onChange
  - Link isExternal default true (FA up-right-from-square)
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm figma:audit-props -- --strict; pnpm typecheck; pnpm build; pnpm build:docs
Accepted differences: none
```

## Tooltip / Popover / Drawer / Dialog / Modal — evidence summary

```text
Task path: Figma update (Tooltip stub) + new (Popover, Drawer, Dialog, Modal)
Components: Tooltip, Popover, Drawer, Dialog, Modal
Figma evidence (retrieved 2026-07-17, file DGekOeToRVifvFAhfqpeC1):
  - Tooltip public 1990:7125 / key 8f604de25a1742f20b6e6f1dd3680bdfdbda2234
  - Popover public 16426:681 / key b524d42ecd329068d1cfa45de2b79e874f9f6cf0
    related Popover Core 16421:393 / key fd92669ea0ca99032fb0015773546ec204c201ff
  - Drawer public 10708:17779 / key b2cd3a35f20d344f38d677d0dfd992d64f503b87
  - Dialog public 3453:3938 / key 75feff93418c9804cbd3075e8a7f85bce1a5ff1e
  - Modal public 2190:8284 / key 0fe4d86d9d16ed81da4f995fc1e8fae90f7cf0e5
  - related Close Icon Button 6368:7269
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json
  - packages/react/src/manifest/visual-recipes/{Tooltip,Popover,Drawer,Dialog,Modal}.json
  - captures under packages/react/src/manifest/visual-recipes/captures/
    (24 browser + figma-*-set refs)
Coverage: 5 + 5 + 4 + 5 + 5 = 24/24 recipe cases marked pass
  (Tooltip caretPlacement + icon/no-caret + dark;
   Popover content textOnly/textImage/custom + caret + dark;
   Drawer textOnly/customContent + dark;
   Dialog default/iconTop/customContent + dark;
   Modal default/verticalImage/horizontalImage + dark)
Correction loop:
  - Tooltip caretPlacement maps inverted to MUI placement (Figma caret edge ≠ anchor side)
  - Tooltip fixtures use disablePortal for capture; Dialog data-cads-component on paper
  - Added --radius-xl (12px) for Dialog/Modal Figma shape/xl
  - Scrim uses fixed black 80% (not theme-flipping --background-neutral-alpha-80)
API notes:
  - Popover merges Figma Popover + Popover Core (Core not public)
  - Dialog/Modal spelling isDismissable matches Figma
  - Drawer/Dialog/Modal support surfaceOnly for fixtures + open for runtime
  - Tooltip startIcon defaults false in code (Figma default true) — documented in snapshot
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm figma:audit-props -- --strict; pnpm typecheck; pnpm build; pnpm build:docs
Accepted differences:
  - Dialog default width may hug ~680px vs Figma sample 630px for long body copy (minWidth 630 / maxWidth 800)
  - Popover caret is CSS diamond vs Figma vector asset (geometry ±2px)
```

## Not done yet (pick up here)

Priority order for the next agent sessions:

1. **Adopt closed-loop parity workflow on Actions** — pull fresh `get_design_context`; create Button / SegmentedButton / IconToggle visual recipes and deterministic coverage fixtures; run light + dark state captures, fix and recapture mismatches, then a11y. SegmentedButton Group `8027:2099` / Block `8000:4554`.
2. **Harden docs honesty** — generate props tables from TS types (`react-docgen-typescript` or equivalent) instead of only the hand-maintained manifest; keep manifest as the AI substrate but wire descriptions from TSDoc.
3. **End-to-end designer → Claude artifact** — upload `tooling/cads-artifact/dist/cads-prototyping.zip`, run the org-sharing checklist in `MANUAL_TEST.md` (create → publish org-only → teammate open → customize/edit). Decide whether multi-MB inlined FA fonts are acceptable in Claude artifacts; only then consider remote MCP/hosting as a secondary path.
4. **Expand catalog** — next wave from Content and Media (Divider, Video, Carousel, Action Block) once design status is green. **Each batch:** snapshot axes → implement → `pnpm figma:audit-props` → rubric in `cads-parity-qa` before “done.”
5. **Variables completeness** — pull typography / spacing-shape / effects from Figma into the variables document (non-color values are currently ported from Lab2 globals, not live-synced).
6. **Publish / hosting** — push to GitHub when ready; decide org (`code-dot-org` vs other); optionally deploy docs (Vercel / GH Pages).
7. **Prototype gallery** — replace the placeholder with real inspectable prototypes.
8. **Harness automation (later)** — REST snapshot refresh/change fingerprint with PAT; CI strict audit; Playwright pairwise fixture generation and normalized pixel baselines.

## Explicit non-goals (for now)

- Replacing Lab2 `App*` atoms wholesale
- Publishing to public npm
- Published Figma Enterprise Code Connect
- Matching production `code-dot-org` Storybook APIs 1:1 (prod may later converge on MUI + this CADS API)
