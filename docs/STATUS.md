# CADS — Status & next priorities

Last updated: 2026-07-23

## Done (scaffold complete)

- [x] Monorepo scaffold (pnpm, changesets, CI, Git-URL / committed `dist/`)
- [x] `@codeai/cads-variables` — ColorSystem port, non-color variables, `variables.css`, TS exports, MUI theme generator
- [x] Color CSS vars use semantic names **without** `--ds-` prefix (e.g. `--background-brand-primary`)
- [x] `@codeai/cads-react` — Figma-parity Actions: Button, SegmentedButton, IconToggle (+ labeled); FieldWrapper, TextInput (+ deprecated TextField alias), Dropdown (input/action); Checkbox, Radio, Toggle; Slider, Chip, ChipGroup; Alert, Toast, NotificationBanner, Tag; Link, Breadcrumbs, Tabs; **Tooltip**, **Popover**, **Drawer**, **Dialog**, **Modal**; plus FaIcon (solid/regular/brands)
- [x] **Button color=orange (2026-07-23)** — contained-only run-button accent; outlined/text fall back to primary (mirrors tertiary→secondary). Props table notes for orange + tertiary restrictions.
- [x] **Icon boolean → presence API (2026-07-23)** — collapsed Figma show/hide booleans into optional `*IconName` / `iconName` on TextInput, Chip/ChipGroup, Tooltip, Dropdown items (same pattern as Button/Tag). Alert/Toast use MUI-style `iconName={false}` to hide (omit = sentiment default). Toggle `hasIcons` kept (dual track icon defaults).
- [x] **TextInput start icon (2026-07-21)** — Figma building-block `startIcon` + `startIconName` (field-only); see evidence summary below
- [x] **Toggle compact + hasIcons (2026-07-21)** — track heights match Checkbox/Radio (22/20/18/16); new `hasIcons` boolean; see evidence summary below
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
- [x] **Docs performance pass (2026-07-17)** — tree-shakeable `@codeai/cads-react` (`tsup` preserve modules + ESM `.js` fix), deep MUI imports in `CadsProvider`, lazy per-component playground/fixture chunks, deferred `react-live`, FA `font-display: swap`, Turbopack docs dev. Prod First Load for `/components/[name]` **333KB → 110KB** (route JS **88KB → 6KB**).
- [x] **Docs dev source aliases (2026-07-21)** — `apps/docs/next.config.mjs` maps `@codeai/cads-react` / `@codeai/cads-variables` to `packages/*/src` under `next dev` (Turbopack + webpack). Verified: routes stay `200` while `dist/` is wiped and during `pnpm build:react`; no Module-not-found storm. Production `build:docs` still uses committed `dist/` via package `exports`.
- [x] **Cross-client prototyping proof of concept (2026-07-17)** — local stdio MCP exposes manifest search, constrained prototype schema, strict validation, and URL-encoded `/prototype` rendering through the real CADS package. Six validator/protocol tests pass; interactive TextInput/Dropdown/Button smoke-tested. Production gaps intentionally left visible: remote HTTP transport, auth, persistence, and multi-screen actions.
- [x] **Claude artifact kit (2026-07-17)** — `@codeai/cads-artifact` bundles real CADS + FA fonts into a self-contained HTML runtime for organization-only Claude artifacts (no hosting). Runtime **3.74 MB** (JS 662 KB / CSS+fonts 3.10 MB); sample teacher-onboarding HTML **3.84 MB**; skill ZIP **3.20 MB** at `tooling/cads-artifact/dist/cads-prototyping.zip`. Local browser smoke: TextInput/Dropdown/Alert/Button + FA icons interactive. Upload via Customize → Skills; see `tooling/cads-artifact/MANUAL_TEST.md`.
- [x] **Portable Agent Skills pack (2026-07-21)** — same ZIP retargeted as an open-standard `cads-prototyping` skill (platform-neutral `SKILL.md`, stdlib Python generator, preflight package validation, no duplicate `skill.md` / sample HTML). Installable in Claude, ChatGPT Skills/Work, Gemini Spark, and Cursor skill folders. Docs `/ai` rewritten around one download + per-host install notes. CI runs `pnpm test:artifact`.
- [x] **Skill ZIP on GitHub Pages (2026-07-22)** — deploy workflow runs `pnpm artifact:package` before `build:docs`; `/ai` Download skill uses `withBasePath` (`/cads/downloads/…`). FA7 stays inlined for now (Figma/CADS on 7; prod `dsco` still on FA6.6). Accepted: Pages URL is effectively internal-team-facing until prod FA7 CDN can replace inlined fonts.
- [x] **Close Icon Button (2026-07-17)** — promoted the shared close action to a public Figma-mapped component and refactored Alert, Toast, NotificationBanner, Tag, Tabs, Popover, Drawer, Dialog, and Modal to compose it.
- [x] **Docs design sweep (2026-07-19)** — docs UI kit (`apps/docs/components/docs-ui.tsx` + CSS classes in `globals.css`), redesigned shell with grouped nav (Getting started / Foundations / Components / Resources) and persisted dark mode; playground rework: props grouped Appearance → Content → State → Layout → A11y with CADS `Dropdown`/`Toggle`/`TextInput` as panel controls, dot-grid stage, reset + copyable synced snippet; component pages restructured (category eyebrow, copyable import, usage-rule cards, copyable variable chips, manifest example); variables pages rebuilt (color grouped by layer × role with light+dark swatches, full typography scale, spacing/shape) plus new **Core styles** page (elevation, motion, control heights); new **AI setup** page (`/ai`) documenting llms.txt / manifest / Claude skill with a skill-ZIP download (prebuild copies `tooling/cads-artifact/dist/cads-prototyping.zip` → gitignored `public/downloads/`; page falls back to build instructions when absent — FA Pro license note included).
- [x] **CodeAI UI-patterns pass (2026-07-19)** — docs chrome aligned to CADS Figma shell (`16778:3578`): 200px sidebar + logo cell, white top bar with search / icon-only Figma button / theme Toggle, `DocsNavItem` (active = brand text+icon, hover = neutral-secondary fill), Overline section labels, playground props panel restyled as a Sketch-Lab-style grouped inspector (gray overline header strip, hairline-separated sections, dense label-left/control-right rows), cards/tables/playground on `--radius-md`. New skill reference `tooling/cads-artifact/skill/references/ui-patterns.md` (territories, shell scaffolds, composition/density, color language, do/don't) wired into `package-skill.mjs` (existence-checked, ships in ZIP), referenced from both SKILL.md files; `/ai` page gained a "UI patterns" section and `generate-llms-txt.mjs` now emits a compact patterns block.
- [x] **Playground props sweep (2026-07-21)** — sidebar grouping expanded (Appearance → Content → State → Layout & behavior → A11y); icon UX unified to string `*IconName` / `iconName` (boolean gates derived; empty = no icon); conditional controls (e.g. TextInput start icon when not multiline, Toggle on/off icons when `hasIcons`, Alert action icons when `hasAction`); wired missing preview props (Slider helper/display/stepCount, Tabs defaultValue, children for Button/Link/Alert/Toast, a11y labels); TemplatePlayground gained Dropdown/Breadcrumbs/IconToggle demo sections.
- [x] **Docs overview + component page template (2026-07-21)** — component pages use narrow centered column on `--background-neutral-secondary` (`DocsTemplatePage`); overview redesigned as short path: CADS intro → Core styles / Components destination cards → For Agents callout → Resources (Storybook, Figma, Brand guidelines).
- [x] **Docs foundations pass (2026-07-21)** — Color condensed into one-line primitive and current-theme semantic ramps; Shape now owns radii, elevation, and spacing; Motion is a focused, explicitly experimental duration/easing standard.
- [x] **Color CSS exporter (2026-07-21)** — Lab2 prod-shaped export (`primitiveColors.css` + `colors.css` with `data-theme`) ported into `@codeai/cads-variables` (`buildPrimitiveColorsCss` / `buildSemanticColorsCss`); Color page exports each file from its section (no zip). Header links to CADS Figma Color + production `component-library-styles`.
- [x] **Typography foundation cleanup (2026-07-21)** — Matches Color page template: `FoundationHeader` → sections → foundation pagination. Text styles tabbed to match Figma Typography page (Heading / Body / Overline / Label / Link / Mono — all published styles), divider list with no card surfaces, families table last. Shared `.dividedList` in `FoundationPage.module.css`. Shape + Motion still on card surfaces — same template pass next.
- [x] **Color variables sync with Figma (2026-07-23)** — Live Figma Semantic Colors = 148 (matches Lab2 Jul 21 sync). Promoted `codeAiColorSystem.json` + `figmaVariablesSnapshot.json`; renamed `text/accent/{pink,orange}/strong` → `secondary` (`--text-accent-*-secondary`); added `--border-neutral-black-fixed` / `--border-neutral-white-fixed`. Follow-up: remapped `text/brand/secondary` Light `purple/70` → `purple/90` (`#1D1590`) after live mapping audit (missed by snapshot/Lab2 promotion). Skill now requires second-pass live alias audit + LLM-as-judge spot-check. Exporter already supported roles; docs Color page + CSS export buttons read regenerated JSON. New agent skill: `.cursor/skills/cads-figma-color-sync`.
- [x] **Neutral gray hex refresh (2026-07-23)** — Live `use_figma` audit: `neutral/gray/10` `#DBDDE2` → `#E1E3E6`, `gray/20` `#CCD1D7` → `#D3D6DA`; updated 9 semantic `fallbackHex` consumers + theme divider fallback; second-pass mapping audit **0 / 0 / 0**; high-risk spot-check clean.

## Toggle compact + hasIcons — evidence summary

```text
Task path: Figma update
Components: Toggle
Figma evidence (retrieved 2026-07-21, file DGekOeToRVifvFAhfqpeC1):
  - Toggle + Label public 327:2151 / key 13f4f08ad10787f9c7c557c0139b200f4d8864a8
  - Toggle block 8841:5569 / key 9e957e7fd931d5d068ffecb6f68531d9ebd5ce7c
  - Exact refs: large on 8841:5564 (42×22), XS on 8859:1814 (30×16)
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json
  - packages/react/src/manifest/visual-recipes/Toggle.json
Coverage: 18/18 recipe cases
  (sizes L–XS; label left/right; on/off; hover/press/focus/disabled;
   light/dark; custom icons; hasIcons=false)
Correction loop:
  - Track: 42×22 / 38×20 / 34×18 / 30×16 (was 52×26 / 48×24 / 44×22 / 40×20)
  - Handle: 18 / 16 / 14 / 12; pad 2px; icons 12 / 11 / 10 / 9
  - Icon insets: L left 8 / right 9; M–XS 6
  - hasIcons=false omits track icons; geometry unchanged
  - Playwright fixture measures match Figma; screenshots vs 8841:5564 / 8859:1814
API notes:
  - hasIcons maps Figma boolean (default true)
  - onIcon / offIcon ignored when hasIcons is false
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm figma:audit-props -- --strict; pnpm typecheck; pnpm build:react
Accepted differences:
  - press border via inset box-shadow (prior; avoids layout shift)
```

## TextInput start icon — evidence summary

```text
Task path: Figma update
Components: TextInput (TextField deprecated alias inherits)
Figma evidence (retrieved 2026-07-21, file DGekOeToRVifvFAhfqpeC1):
  - Text Input public 16176:4884 / key ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4
  - Text Input Building Block 16146:3517 / key adac7e7bcbeece4cd3ed6f7cd77d7664ea3c9f9e
  - Exact field refs: large default 16146:3516, large readOnly 16178:76, large disabled 16146:3526
  - Area variants have no startIcon (confirmed 16146:4314)
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json
  - packages/react/src/manifest/visual-recipes/TextInput.json
Coverage: 10/10 recipe cases (7 regression + 3 startIcon)
  (large startIcon default; medium startIcon readOnly; XS startIcon disabled;
   prior size/color/state/mode sentinels unchanged)
Correction loop:
  - Field shell flex layout: icon + borderless control; hover/focus/active on :focus-within shell
  - Icon geometry L18/M16/S14/XS12; gaps 10/10/8/6
  - Start icon color: primary → --text-neutral-primary; secondary → --text-neutral-placeholder (Figma 16146:3857/3859/16178:84)
  - readOnly value text quaternary; primary readOnly icon stays primary; secondary readOnly icon stays placeholder
  - disabled icon + placeholder use --text-disabled-neutral
  - Browser fixtures vs Figma 16146:3516 screenshot: start icon + placeholder alignment match
API notes:
  - startIcon / startIconName field-only (ignored when multiline)
  - Figma startIcon defaults true; code defaults false (opt-in, same pattern as Tooltip)
  - smile → face-smile via resolveFaIconName
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm figma:audit-props -- --strict; pnpm typecheck; pnpm build:react
Accepted differences:
  - extraSmall field height 22px Figma vs 24px shared control scale (prior)
  - startIcon default false vs Figma true (opt-in adornment)
```

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
  - Tooltip uses MUI `placement` only (Figma caretPlacement maps inverted: Figma top → placement bottom)
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
3. **End-to-end portable skill hosts** — download from Pages `/ai` (or local ZIP) and run the host matrix in `tooling/cads-artifact/MANUAL_TEST.md` (Claude org-share, ChatGPT Skills/Work, Gemini Spark, Cursor skill folder). Later: when prod publishes FA7 on `dsco.code.org`, switch runtime/`@font-face` to those CDN assets and stop inlining OTFs.
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
