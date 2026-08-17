# CADS — Status & next priorities

Last updated: 2026-08-13

## Done (scaffold complete)

- [x] **Dropdown `menuType=custom` (2026-08-13)** — Blank menu canvas (border, shadow, `--shape-sm` only; no padding/gaps/items). `customContent` slot for consumer UI (e.g. swatch grids). Figma Menu List has no custom axis — code-only enum extra. Works on input and action. Docs playground + fixtures cover a flush color-swatch grid.
- [x] **GitHub Packages `@moshebaricdo/cads-*` (2026-08-12)** — Publishable packages renamed off `@codeai` scaffold names. `@moshebaricdo/cads-react` + `@moshebaricdo/cads-variables` publish to GitHub Packages via changesets/action (`pnpm release`). Lab2 / other prototypes install with `@moshebaricdo:registry=https://npm.pkg.github.com` + `NODE_AUTH_TOKEN`. Sibling `file:` still works for local CADS iteration. First registry version is **0.1.0**.

- [x] **AiChatMessage inline + customContent (2026-08-12)** — AI bubbles accept inline rich `children` (Link, `code`, emphasis, paragraphs) and an optional `customContent` slot below the body (Figma `hasCustomContent`, presence-gated, hugs content). Shared in-chat cards (file-change lists, snippets) still to come. Snapshot + recipe + docs assembled chat / fixture updated.

- [x] **Dropdown action `iconOnly` trigger (2026-08-12)** — `role=action` supports full Button-style square icon triggers (`iconOnly` + `startIconName` + `aria-label`; chevron/label hidden). Manifest + docs playground/prop sheet/fixture cover overflow menus; `buttonVariant` / `buttonColor` unchanged.
- [x] **Symbol fill DialKit sandbox (2026-08-11)** — `apps/sandbox` parametric preview assembles the CodeAI mark as a **modular grid** of live CADS components (cells only where they fall inside symbol bounds — no mask-over-scatter). Swatches ~20% accent pops. DialKit: columns / gap / inset / mix / motion. `pnpm dev:sandbox` → http://localhost:3200.
- [x] **FontAwesome Glyphs SVG custom-kit previews (2026-08-10)** — API-synced Custom Kit / Kit Duotone picker tiles render from FA `iconUploads` `pathData` (+ width/height) instead of unicode × OS OTF. Avoids Windows font-cache tofu when insert still works via ligatures. Existing synced faces auto-backfill pathData on plugin open; stock styles still use font preview. `pnpm plugin:icons:build`.
- [x] **AI Chat components + docs page (2026-08-06)** — New `@moshebaricdo/cads-react` atoms from Figma AI Chat page `17246:23801`: `AiChatMessage` (`17228:10789`), `AiChatFileChip` (`17228:10810`), `ChatFileRemoveButton` (`17228:10910`), `AiChatInput` (`17228:10734`). Docs: **AI Components → AI Chat** (`/components/ai-chat`) with assembled mini-chat + per-atom tabs (playground + prop sheets). Snapshot + visual recipes committed; Suggested Prompt Chip out of scope. See evidence summary below.
- [x] **DSCO→CADS Pass 1 swap rules wired (2026-08-06)** — Audit now remaps Pass 1 DSCO keys (#1–46 + FA #77–78) via `componentSwaps.ts` (Waves A–E): value fixes (Chip/Toast/Alert/Banner/Close), flat High remaps, retarget-by-boolean (Checkbox/Radio/Toggle), nested-apply (FW/`labelText` + BB, Dropdown Button, Popover Core, Slider Bar), slot-TEXT (Modal). Doc: `tooling/figma-remap-plugin/docs/DSCO_TO_CADS_COMPONENT_MAP.md`. Pass 2 (#47–76) deferred. `pnpm plugin:remap:build`. Validate on a fixture frame next.

## AI Chat components — evidence summary

```text
Task path: new component
Components: ChatFileRemoveButton, AiChatFileChip, AiChatMessage, AiChatInput
Figma evidence (2026-08-06, file DGekOeToRVifvFAhfqpeC1):
  - page ↪ ✈️ AI Chat 17246:23801
  - AI Chat Message 17228:10789 key 2e5573fb… (context × author)
  - AI Chat File Chip 17228:10810 key 5bfa5b80… (type × useCase)
  - Chat File Remove Button 17228:10910 key 964982bd… (state)
  - AI Chat Input 17228:10734 key 21631db1… (state × isFilled)
  - get_design_context on all four public sets
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json (4 entries)
  - packages/react/src/manifest/visual-recipes/{ChatFileRemoveButton,AiChatFileChip,AiChatMessage,AiChatInput}.json
  - figma.code-connect.json + cadsManifest + fixtures + previews + propSheets/ai.ts
Coverage: recipe cases defined (remove 6 / file chip 6 / message 6 / input 5); browser
  capture correction loop still pending (fixtures registered under /fixtures/components)
API audit: 0 error / 0 warn / 0 escalate (pnpm figma:audit-props -- --strict)
Verification: pnpm typecheck; pnpm build; pnpm build:docs (route /components/ai-chat);
  pnpm generate:readme; pnpm plugin:remap:build (catalog names refreshed)
Accepted differences:
  - Figma isFilled design-only → derived from value content
  - Show 2nd Paragraph design-matrix → multi-paragraph via children
  - showFileUploads → optional fileUploads ReactNode slot
  - hasCustomContent → optional customContent ReactNode slot (AI; hugs vs 100px Figma placeholder)
  - Suggested Prompt Chip intentionally out of scope (archived in Figma)
```

- [x] **CADS Audit cut/paste component keys (2026-08-05)** — ⌘X from DSCO → CADS mints new publish keys; catalog refreshed (Sidebar / Panel Header / File / AI) + historical aliases + name-match fallback (excludes known DSCO keys) so Figma’s “CodeAI Design System (CADS)” instances aren’t flagged Non-CADS. `pnpm plugin:remap:build`.
- [x] **FontAwesome Glyphs multi-edit insert (2026-08-05)** — selecting multiple text layers (Figma multi-edit) inserts the shortcode into every selected layer, not only `selection[0]`. Footer shows “Replaces text in N layers”. `pnpm plugin:icons:build`.
- [x] **FontAwesome Glyphs missing-kit font swap (2026-08-05)** — insert swaps to the picked face before writing characters (no longer loads the layer’s current font first), so outdated/uninstalled kit fonts still get upgraded on plain text and instance-bound icon props. `pnpm plugin:icons:build`.
- [x] **CADS Audit kit fonts not “outdated FA” (2026-08-05)** — `Font Awesome Kit {id}` / Kit Duotone are unversioned by design; audit no longer flags them or invents `Font Awesome 7 Kit …` rewrites (apply was failing to load). Stock FA6→FA7 upgrades unchanged. `pnpm plugin:remap:build`.
- [x] **CADS Audit in-source-file load (2026-08-05)** — running the plugin inside the CADS Figma file (`DGekOeToRVifvFAhfqpeC1`) builds the catalog from local variables/styles (library can’t self-import); apply/component swaps fall back to local keys. `pnpm plugin:remap:build`.
- [x] **CADS Audit `focus-alpha` silence (2026-08-05)** — `Z: Special Alpha` (`focus-alpha` focus-ring fill) is treated as compliant CADS color, not “Non-CADS variables” (teamLibrary often can’t attribute that collection). `pnpm plugin:remap:build`.
- [x] **CADS Audit selection UX (2026-08-05)** — top-bar rerun always re-audits the active roots (ignores canvas selection); selecting a frame outside those roots prompts “Run audit” vs “Keep current”; locate-into-audit stays silent. `pnpm plugin:remap:build`.
- [x] **CADS Audit fix-flow hardening (2026-08-05)** — surface-split color remaps (text/fill/stroke); FA6→FA7 font upgrades in typography fixes; include-hidden-layers toggle on fix panel + AI; sparkle/AI only for Colors + Components; AI batched + catalog-validated; component findings ignore local this-file components except inside `(OLD) DSCO Components` (`ahYTsb3I7rsJNW0n2vnXm6`); name/AI component swaps (simple default-variant); optional team AI key via `CADS_AUDIT_AI_*` at build. `pnpm plugin:remap:build`.
- [x] **CADS Audit Figma plugin (2026-08-04)** — `tooling/figma-remap-plugin` (“CADS Audit (Internal)”): findings-only audit workspace (no step wizard). Surface layers only — does not descend into component instances (CADS or legacy); non-CADS components are one finding each. Clean SoT is silent → green pass. Summary cards for Colors / Typography / Shape / Modes / Components; category-scoped Review fixes panel + apply + auto re-audit. Policy: semantic colors only (primitives never targets), typography via text styles, unbound radii (one usage per node) → Spacing & Shape, foreign modes, non-CADS components report-only. Baked catalogs from live CADS harvest (`cadsCatalog.ts`, 61 `cadsTextStyles`). Optional BYO-key AI. `pnpm plugin:remap:build`.
- [x] **FontAwesome Glyphs Figma plugin (2026-08-03)** — `tooling/figma-icon-plugin`: inserts FA *shortcodes as text* (never vectors). Community name **FontAwesome Glyphs**; public build omits inlined FA Pro fonts (`pnpm plugin:icons:build`); `--with-fonts` / `build:dev` is internal-only. First-run setup adds local OTFs (no auto-detect catalog); All + version/style pickers; kits labeled Custom Kit (id in settings). Assets: `icon.png`, `publish-assets/cover.*`. See `PUBLISH.md`.
- [x] **FA font installer (2026-08-03)** — `tooling/fa-fonts`: Mac `.command` / Windows `.bat` to replace fonts from an unzipped `otfs` folder (designer-friendly).
- [x] **CADS 4.1 Figma sync (2026-07-28)** — Mirrored release geometry (skipped FA6→FA7; already on FA7): IconToggle L icon 19→18; Chip M/S/XS padding +2px; Link icon=body textSize + 2px optical iconWrapper + playground `isExternal` coercion fix; Dropdown menu item gaps/padding/icon slots + fixed heights; Button M padding 16→14 (action trigger hug). Recipes updated; `pnpm typecheck` + `pnpm build:react` green.
- [x] Monorepo scaffold (pnpm, changesets, CI, Git-URL / committed `dist/`)
- [x] `@moshebaricdo/cads-variables` — ColorSystem port, non-color variables, `variables.css`, TS exports, MUI theme generator
- [x] Color CSS vars use semantic names **without** `--ds-` prefix (e.g. `--background-brand-primary`)
- [x] `@moshebaricdo/cads-react` — Figma-parity Actions: Button, SegmentedButton, IconToggle (+ labeled); FieldWrapper, TextInput (+ deprecated TextField alias), Dropdown (input/action); Checkbox, Radio, Toggle; Slider, Chip, ChipGroup; Alert, Toast, NotificationBanner, Tag; Link, Breadcrumbs, Tabs; **Pagination** + **TablePagination**; **Tooltip**, **Popover**, **Drawer**, **Dialog**, **Modal**; plus FaIcon (solid/regular/brands)
- [x] **Pagination + TablePagination (2026-07-24)** — Figma set `17007:19104` type=page|table; one docs page + playground type switch + two props tables; see evidence summary below
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
- [x] Lab2 sandbox bridge — `#/design-system/cads` parity route; local `file:` deps; CI/other clones use GitHub Packages `@moshebaricdo/cads-*` (see 2026-08-12)
- [x] **Parity QA workflow (scaffold)** — mandatory new/update lifecycle in `.cursor/skills/cads-parity-qa`, visual-recipe schema/template, committed Figma prop snapshot + strict `pnpm figma:audit-props`
- [x] **Field / Text Input / Dropdown batch (2026-07-16)** — see prior evidence summary
- [x] **Checkbox / Radio / Toggle batch (2026-07-17)** — see prior evidence summary
- [x] **Slider / Chip / ChipGroup batch (2026-07-17)** — see prior evidence summary
- [x] **Alert / Toast / NotificationBanner / Tag batch (2026-07-17)** — see evidence summary below
- [x] **Link / Breadcrumbs / Tabs batch (2026-07-17)** — see evidence summary below
- [x] **Tooltip / Popover / Drawer / Dialog / Modal batch (2026-07-17)** — see evidence summary below
- [x] **Docs performance pass (2026-07-17)** — tree-shakeable `@moshebaricdo/cads-react` (`tsup` preserve modules + ESM `.js` fix), deep MUI imports in `CadsProvider`, lazy per-component playground/fixture chunks, deferred `react-live`, FA `font-display: swap`, Turbopack docs dev. Prod First Load for `/components/[name]` **333KB → 110KB** (route JS **88KB → 6KB**).
- [x] **Docs dev source aliases (2026-07-21)** — `apps/docs/next.config.mjs` maps `@moshebaricdo/cads-react` / `@moshebaricdo/cads-variables` to `packages/*/src` under `next dev` (Turbopack + webpack). Verified: routes stay `200` while `dist/` is wiped and during `pnpm build:react`; no Module-not-found storm. Production `build:docs` still uses committed `dist/` via package `exports`.
- [x] **Cross-client prototyping proof of concept (2026-07-17)** — local stdio MCP exposes manifest search, constrained prototype schema, strict validation, and URL-encoded `/prototype` rendering through the real CADS package. Six validator/protocol tests pass; interactive TextInput/Dropdown/Button smoke-tested. Production gaps intentionally left visible: remote HTTP transport, auth, persistence, and multi-screen actions.
- [x] **Claude artifact kit (2026-07-17)** — `@codeai/cads-artifact` bundles real CADS + FA fonts into a self-contained HTML runtime for organization-only Claude artifacts (no hosting). Runtime **3.74 MB** (JS 662 KB / CSS+fonts 3.10 MB); sample teacher-onboarding HTML **3.84 MB**; skill ZIP **3.20 MB** at `tooling/cads-artifact/dist/cads-prototyping.zip`. Local browser smoke: TextInput/Dropdown/Alert/Button + FA icons interactive. Upload via Customize → Skills; see `tooling/cads-artifact/MANUAL_TEST.md`.
- [x] **Portable Agent Skills pack (2026-07-21)** — same ZIP retargeted as an open-standard `cads-prototyping` skill (platform-neutral `SKILL.md`, stdlib Python generator, preflight package validation, no duplicate `skill.md` / sample HTML). Installable in Claude, ChatGPT Skills/Work, Gemini Spark, and Cursor skill folders. Docs `/ai` rewritten around one download + per-host install notes. CI runs `pnpm test:artifact`.
- [x] **Skill ZIP on GitHub Pages (2026-07-22)** — deploy workflow runs `pnpm artifact:package` before `build:docs`; `/ai` Download skill uses `withBasePath` (`/cads/downloads/…`). FA7 stays inlined for now (Figma/CADS on 7; prod `dsco` still on FA6.6). Accepted: Pages URL is effectively internal-team-facing until prod FA7 CDN can replace inlined fonts.
- [x] **Close Icon Button (2026-07-17)** — promoted the shared close action to a public Figma-mapped component and refactored Alert, Toast, NotificationBanner, Tag, Tabs, Popover, Drawer, Dialog, and Modal to compose it.
- [x] **Docs design sweep (2026-07-19)** — docs UI kit (`apps/docs/components/docs-ui.tsx` + CSS classes in `globals.css`), redesigned shell with grouped nav (Getting started / Foundations / Components / Resources) and persisted dark mode; playground rework: props grouped Appearance → Content → State → Layout → A11y with CADS `Dropdown`/`Toggle`/`TextInput` as panel controls, dot-grid stage, reset + copyable synced snippet; component pages restructured (category eyebrow, copyable import, usage-rule cards, copyable variable chips, manifest example); variables pages rebuilt (color grouped by layer × role with light+dark swatches, full typography scale, spacing/shape) plus new **Core styles** page (elevation, motion, control heights); new **AI setup** page (`/ai`) documenting llms.txt / manifest / Claude skill with a skill-ZIP download (prebuild copies `tooling/cads-artifact/dist/cads-prototyping.zip` → gitignored `public/downloads/`; page falls back to build instructions when absent — FA Pro license note included).
- [x] **CodeAI UI-patterns pass (2026-07-19)** — docs chrome aligned to CADS Figma shell (`16778:3578`): 200px sidebar + logo cell, white top bar with search / icon-only Figma button / theme Toggle, `DocsNavItem` (active = brand text+icon, hover = neutral-secondary fill), Overline section labels, playground props panel restyled as a Sketch-Lab-style grouped inspector (gray overline header strip, hairline-separated sections, dense label-left/control-right rows), cards/tables/playground on `--shape-md`. New skill reference `tooling/cads-artifact/skill/references/ui-patterns.md` (territories, shell scaffolds, composition/density, color language, do/don't) wired into `package-skill.mjs` (existence-checked, ships in ZIP), referenced from both SKILL.md files; `/ai` page gained a "UI patterns" section and `generate-llms-txt.mjs` now emits a compact patterns block.
- [x] **Playground props sweep (2026-07-21)** — sidebar grouping expanded (Appearance → Content → State → Layout & behavior → A11y); icon UX unified to string `*IconName` / `iconName` (boolean gates derived; empty = no icon); conditional controls (e.g. TextInput start icon when not multiline, Toggle on/off icons when `hasIcons`, Alert action icons when `hasAction`); wired missing preview props (Slider helper/display/stepCount, Tabs defaultValue, children for Button/Link/Alert/Toast, a11y labels); TemplatePlayground gained Dropdown/Breadcrumbs/IconToggle demo sections.
- [x] **Docs overview + component page template (2026-07-21)** — component pages use narrow centered column on `--background-neutral-secondary` (`DocsTemplatePage`); overview redesigned as short path: CADS intro → Core styles / Components destination cards → For Agents callout → Resources (Storybook, Figma, Brand guidelines).
- [x] **Docs foundations pass (2026-07-21)** — Color condensed into one-line primitive and current-theme semantic ramps; Shape now owns radii, elevation, and spacing; Motion is a focused, explicitly experimental duration/easing standard.
- [x] **Color CSS exporter (2026-07-21)** — Lab2 prod-shaped export (`primitiveColors.css` + `colors.css` with `data-theme`) ported into `@moshebaricdo/cads-variables` (`buildPrimitiveColorsCss` / `buildSemanticColorsCss`); Color page exports each file from its section (no zip). Header links to CADS Figma Color + production `component-library-styles`.
- [x] **Typography foundation cleanup (2026-07-21)** — Matches Color page template: `FoundationHeader` → sections → foundation pagination. Text styles tabbed to match Figma Typography page (Heading / Body / Overline / Label / Link / Mono — all published styles), divider list with no card surfaces, families table last. Shared `.dividedList` in `FoundationPage.module.css`. Motion foundation page now matches (2026-07-25); Shape still uses sample tiles (appropriate for radius/elevation).
- [x] **Color variables sync with Figma (2026-07-23)** — Live Figma Semantic Colors = 148 (matches Lab2 Jul 21 sync). Promoted `codeAiColorSystem.json` + `figmaVariablesSnapshot.json`; renamed `text/accent/{pink,orange}/strong` → `secondary` (`--text-accent-*-secondary`); added `--border-neutral-black-fixed` / `--border-neutral-white-fixed`. Follow-up: remapped `text/brand/secondary` Light `purple/70` → `purple/90` (`#1D1590`) after live mapping audit (missed by snapshot/Lab2 promotion). Skill now requires second-pass live alias audit + LLM-as-judge spot-check. Exporter already supported roles; docs Color page + CSS export buttons read regenerated JSON. New agent skill: `.cursor/skills/cads-figma-color-sync`.
- [x] **Neutral gray hex refresh (2026-07-23)** — Live `use_figma` audit: `neutral/gray/10` `#DBDDE2` → `#E1E3E6`, `gray/20` `#CCD1D7` → `#D3D6DA`; updated 9 semantic `fallbackHex` consumers + theme divider fallback; second-pass mapping audit **0 / 0 / 0**; high-risk spot-check clean.
- [x] **Color variables sync with Figma (2026-07-29)** — Live `use_figma`: 113 primitives / 148 semantics. Updated 4 sentiment light-step hexes (`error/5`, `warning/5`, `success/5`, `success/10`); remapped Light `border/brand/light` `purple/5`→`10` and `border/brand/mid` `purple/20`→`30`; refreshed 25 cascading `fallbackHex` values + snapshot. Second-pass mapping audit **0 / 0 / 0**; LLM-as-judge high-risk set clean. No renames/adds/removes.
- [x] **CADS Motion experiment (2026-07-24)** — Named recipes Press / Surface / Indicator (+ Highlight chase vars, deferred) in `@moshebaricdo/cads-variables`; foundation docs on `/variables/core` with Experimental status Tag; `CadsProvider experimentalMotion` flag (default off).
- [x] **Motion duration ladder (2026-07-25)** — Consolidated to four primitives: instant `0` / fast `100` / short `150` / medium `200`. Recipes (Press/Surface/Indicator/Fade/Chase) pick from that ladder; Duration docs no longer list recipe-owned ms as peer tokens.
- [x] **Motion foundation page (2026-07-25)** — `/variables/core` matches Color/Shape template (recipes + durations + easing with copyable vars); DialKit playground removed; contained mini-UI card demos Press / Surface / Indicator together.
- [x] **Experiments control center (2026-07-25)** — Topbar flask Popover (`content="custom"`) lists docs experiments with Motion docs-wide Toggle (`?motion=` + session); Motion In Action preview has its own local Motion on/off Toggle for A/B comparison. Motion page keeps a simple end-of-page “Enable experiment” toggle as an alternate entry (same docs-wide flag).
- [x] **Motion library rollout (2026-07-24)** — Recipe-by-need across the catalog: Press on discrete pressables (skip flush groups), Surface on every overlay enter, Indicator on Toggle + Tabs sliding chrome. See evidence summary below.
- [x] **Dropdown Menu Item state sync (2026-07-24)** — Figma `896:3791` default/defaultError recipes: destructive press stays `error-light` + `text-error-secondary`; selected press returns to `selected-primary` (hover still `selected-strong`); disabled uses `--text-disabled-*` / `--background-disabled-neutral` (no opacity fade). Checklist itemType left unchanged.
- [x] **Pressed-state consistency (2026-07-24)** — Button / TextInput / Dropdown Button aligned to Figma after Motions-era state cleanup. Contained press keeps `*-strong` (secondary returns to inverse); outlined + Dropdown trigger press keep tertiary; TextInput press keeps secondary (no white flash). See evidence summary below.
- [x] **Icon Tooltip (2026-07-25)** — new component: bare info-style icon affordance that composes `Tooltip` for the bubble/caret, with no button chrome — only a required focus ring. Catalogued under Messaging. `color` primary (brand) / secondary (neutral-primary) / tertiary (neutral-quaternary, default), shared control `size` scale, `iconName` default `circle-info`. Implemented docs-driven, then **published back to Figma** as `Info Tooltip` `17051:27346`. See evidence summary below.
- [x] **Info Tooltip Figma set — code → design (2026-07-25)** — first component authored *into* the CADS Figma file from code via MCP (`use_figma`): 48 variants (4 sizes × 3 colors × 4 states) on page `17044:8135`, bound to semantic variables and the shared focus-ring effect style; hover/focus variants pin a nested `Tooltip` instance above the glyph. Snapshot / visual recipe / `figma.code-connect.json` / `cadsManifest` now carry the node + component key. See evidence summary below.
- [x] **Motion springs (2026-07-25)** — `motion.spring.fast|moderate|slow` (Apple duration+bounce) in `@moshebaricdo/cads-variables`; Indicator on Toggle/Tabs uses `spring.moderate` via Motion when `experimentalMotion` is on (CSS easing remains the fallback). Docs sidebar floating highlight snaps instantly (no spring chase). See evidence summary below.
- [x] **Overlay portal + z-index layers (2026-07-25)** — Dropdown menus portal by default (fixes playground/overflow clipping); fixture `disablePortal` escape hatch; code-owned `--z-*` ladder (drawer 1200 / modal·dropdown·popover 1300 / toast 1400 / tooltip 1500) wired through theme + Poppers; Popover click-away ignores nested menus; Dialog/Modal/Drawer `disableEnforceFocus` for nested focus; Shape page Stacking table.
- [x] **SCSS modules organization (2026-07-25)** — Docs + react style cleanup:
  - **Docs:** `globals.css` trimmed to ~84 lines (imports/reset/base only); shell/nav/playground/docs-ui extracted to SCSS modules; all prior `.module.css` → `.module.scss`; foundation styles split (`FoundationPage` shared + color/spacing/typography/core locals); dead selectors pruned.
  - **React:** `@moshebaricdo/cads-react` build **tsup → Vite 6** (CSS modules + `libInjectCss`); every catalog component in a kebab folder (`Component.tsx` + `componentName.module.scss` + `types.ts` + `index.ts`); public API is the barrel. Recipe in `AGENTS.md`.
  - Verify: `pnpm typecheck` + `pnpm build:react` + `pnpm build:docs` green.
  - **Fix (2026-07-25):** Tabs hover regression — the SCSS module fed the `--tab-border-bottom` *shorthand* custom property to the `border-bottom-color` longhand, which is invalid at computed-value time, so every hover state fell back to `currentcolor`: inactive tabs grew a text-colored underline and the dark-mode selected tab lost its `--border-selected-strong` hover. Hover now uses the `border-bottom` shorthand like `:active`. When adding state rules, keep shorthand vars in shorthand properties.
- [x] **Barrel-only imports (2026-07-25)** — docs/fixtures/playground + artifact `CadsProvider` now import from `@moshebaricdo/cads-react`; removed `./components/*` + `./theme/*` export maps and PascalCase deep-import shims (kept deprecated `TextField` alias). Optional follow-up: per-component READMEs/tests.
- [x] **Prod-aligned variable files (2026-07-25)** — `@moshebaricdo/cads-variables` now emits split CSS matching `component-library-styles` (`primitiveColors.css`, `colors.css`, `fontVariables.css`, `shapeAndSpacingVariables.css`, `motionVariables.css`) with `variables.css` as an `@import` barrel + CADS runtime `typographyVariables.css`. Typography export is `fontVariables.css` + `typography.module.scss` (leaves prod `font.scss` alone); no brand mono (system stack). Runtime CSS var renames: `--radius-*` → `--shape-*`, `--space-*` → `--spacing-p-*` (rem), `--font-heading/body/mono` → `--font-family-heading/main/mono`, weight `normal/semibold` → `regular/semi-bold`. Docs Export on every foundation page. Sibling Lab2 will need a rebuild/rename pass when it next syncs.

## Info Tooltip Figma set (code → design) — evidence summary

```text
Task path: code → design (reverse parity build)
Components: IconTooltip → Figma "Info Tooltip"
Figma output (authored 2026-07-25 via Figma MCP use_figma):
  - page 17044:8135, component set 17051:27346,
    key 2136f83f6a3b9e32d1687b074eda81b74c13b186
  - 48 variants: size (large 18 / medium 16 / small 14 / extraSmall 12)
    × color (primary / secondary / tertiary) × state (default / hover / focus / disabled)
  - text property iconName#17051:0 (default "circle-info") bound to the glyph;
    glyph is a FA 7 Pro Solid ligature text node, matching the file's icon convention
  - variables: text/brand/primary, text/neutral/primary, text/neutral/quaternary,
    text/state/disabled/neutral, shape/sm (6 = --shape-sm); focus uses the shared
    Button focus-ring effect style (4px border/state/focused/primary + 2px background)
  - hover/focus variants nest the Tooltip variant caretPlacement=bottom (16416:1189)
    as an exposed instance inside a 256px bottom-aligned "tooltipAnchor" frame, so the
    caret tip sits 4px above the glyph and re-centers when the copy is edited
  - grid follows the CADS page convention (Close Icon Button 6368:7269): color runs
    left→right as columns, size × state stacks top→bottom as rows; Size badges label
    each size block on the left rail, state labels per row, color labels above the
    columns, guideline dividers between columns and size blocks
Correction loop (5 passes, each re-screenshotted in Figma):
  1. component roots kept createComponent's default 100px height → hug both axes
  2. focus ring did not render on a fill-less frame → Button's Z: Special Alpha fill
     + clipsContent on the trigger
  3. tooltip copy edits shifted the bubble off-center (absolute x is not overridable
     in an instance) → centering anchor frame
  4. outer-column tooltips crossed the set border → inset the grid 45px / 25px
  5. design review: grid axes were size-as-columns → transposed to the page convention
     (color as columns, size × state as rows); children reordered row-major, default
     variant unchanged, page frame / section / info panel re-proportioned
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json (IconTooltip entry:
    nodeId, componentKey, size/color/state axes, state as designOnly)
  - packages/react/src/manifest/visual-recipes/IconTooltip.json (publicNodeId set,
    hover + disabled recipes, per-case figmaVariant references)
  - figma.code-connect.json + cadsManifest figma block
Open: hover and disabled coverage cases are `pending` — they need a browser capture
  pass (no browser automation available in this session; component code unchanged).
Accepted differences: Figma models only the default top placement (placement/hasCaret
  stay code-only); no pressed variant (code has no press chrome); Figma default variant
  is large/primary vs code medium/tertiary (same divergence as Button).
```

## Icon Tooltip — evidence summary

```text
Task path: new component (docs-driven; Figma set added later the same day — see above)
Components: IconTooltip
Figma evidence (checked 2026-07-25, file DGekOeToRVifvFAhfqpeC1):
  - search_design_system("icon tooltip"/"info icon") returned only unrelated
    external libraries (old DSCO Tooltip component set, a standalone
    "InformationCircle2" icon from a deprecated icon kit) — no match in this file
  - get_metadata on the Tooltip public node (1990:7125) shows only caretPlacement
    variants (top/bottom/left/right) — no sibling Icon Tooltip / info-icon variant
  - Conclusion at the time: no Icon Tooltip component set existed in CADS Figma.
    Implemented from the task's suggested API + existing Tooltip spec + shared
    icon size/color conventions (CloseIconButton icon sizing, IconToggle focus
    ring). Superseded by the code → design build above.
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json (IconTooltip entry)
  - packages/react/src/manifest/visual-recipes/IconTooltip.json
API: title (required), iconName (default "circle-info"), color
  primary|secondary|tertiary (default tertiary → quaternary), size
  large|medium|small|extraSmall (default medium), placement (passthrough to
  Tooltip, default "top"), hasCaret (passthrough, default true), aria-label
  (falls back to title when it's a plain string)
Coverage: 8 fixture cases (apps/docs/app/fixtures/components/cases/IconTooltip.tsx)
  — size × color sentinels (large/primary, medium/secondary, medium/tertiary,
  small/primary dark, extraSmall/tertiary), keyboard focus ring, and two
  open-tooltip placements (top/light, bottom/dark) reusing Tooltip's bubble.
Wiring: cadsManifest (Messaging, after Tag), packages/react/src/index.ts export,
  apps/docs/lib/nav.ts (Messaging "Icon Tooltip"), ComponentPreview + IconTooltipPreview,
  componentExternalLinks (MUI Tooltip API link, no Storybook id → notInProduction status)
API audit: pnpm figma:audit-props (non-strict; no strict run — pre-existing
  Tooltip.surfaceOnly gap in the snapshot predates this change and is unrelated)
Verification: pnpm typecheck; pnpm build:react; pnpm build:docs
Accepted differences:
  - No Figma component set to diff against at implementation time — geometry and
    color roles were docs-driven; the Figma set was later generated from them
```

## Pressed-state consistency — evidence summary

```text
Task path: Figma update
Components: Button, TextInput, Dropdown (input trigger)
Figma evidence (retrieved 2026-07-24, file DGekOeToRVifvFAhfqpeC1):
  - Button 15724:18791 (pressed recipes across contained/outlined/text)
  - Text Input Building Block 16146:3517 (state=press → --background-neutral-secondary)
  - Dropdown Button 964:10677 (state=press → --background-neutral-tertiary)
Spec artifacts:
  - packages/react/src/manifest/visual-recipes/Button.json (new)
  - TextInput.json + Dropdown.json press recipes + coverage cases
Coverage: 6 Playwright press fixtures pass (computed CSS vars)
  - contained primary/secondary/error/orange; outlined primary; text primary
  - TextInput medium primary press; Dropdown medium primary press
Correction loop: code was resetting contained/outlined press to default fills; TextInput :active was white
API audit: pnpm figma:audit-props -- --strict
Verification: pnpm typecheck; pnpm build
Accepted differences: none
```

## CADS Motion experiment / library rollout — evidence summary

```text
Recipes (CSS vars + TS):
  Duration ladder: --duration-instant|fast|short|medium (0 / 100 / 150 / 200)
  Spring ladder (JS-only): motion.spring.fast|moderate|slow
    fast 0.12s b0 · moderate 0.2s b0.05 · slow 0.32s b0.08
  Recipes pick from ladder: Press=short, Surface=medium, Fade/Chase=fast
  Indicator → spring.moderate when experimentalMotion (CSS medium+emphasized fallback)
  --motion-press-* / --motion-surface-* / --motion-indicator-* / --motion-highlight-chase-*
  --transition-press|surface|indicator|highlight-chase; --easing-out
  --transition-indicator includes width (Tabs sliding chrome)
Flag: CadsProvider experimentalMotion (default false) + data-cads-experimental-motion
Dep: motion (^12) on @moshebaricdo/cads-react for Indicator springs; springTransition() helper
Press (data-cads-press):
  Button, CloseIconButton, IconToggle, Chip, Checkbox, Radio, Link,
  Dropdown menu-item content (inner wrapper), Breadcrumb links/buttons + overflow trigger
  Dropdown triggers skip Press scale (action keeps attr; Surface owns open motion)
  Skip: SegmentedButton, Pagination segmented items, Tabs tabs, TextInput, Slider
Surface (data-cads-surface):
  Popover, Dropdown menu, Drawer (origin bottom), Dialog, Modal,
  Tooltip (origin toward placement), Breadcrumbs overflow menu,
  Toast (origin toward viewport placement; snackbar host)
Indicator (data-cads-indicator + data-cads-indicator-spring):
  Toggle handle (x transform + nested face for press scale);
  Tabs primary underline (left/width); secondary Tabs skip Indicator
Surface exit: useSurfacePresence + cads-surface-out on Popover / Dropdown / Toast
Tooltip: MUI Grow timed to --motion-surface-duration; leaveDelay 0 (no CSS keyframe fight)
Toast: open + placement + offset (default 64) via MUI Snackbar; transitionDuration 0 when Surface on
Slider thumb: no Press (MUI position transform fights scale)
TextInput: hover/press suppressed while :focus-within (stays white)
Highlight chase → deferred in catalog (no dropdown row chase — keyboard noise)
Docs site-only: DocsNavScroller floating highlight snaps instantly (not a DS menu pattern)
Docs: /variables/core — Spring primitives tab + mini-UI card
Verification: pnpm typecheck; pnpm build
```

## Pagination + TablePagination — evidence summary

```text
Task path: new component
Components: Pagination, TablePagination
Figma evidence (retrieved 2026-07-24, file DGekOeToRVifvFAhfqpeC1):
  - Pagination set 17007:19104 / key 9f27562cc11f74ff5019ad281149a183c1510ecf
  - Page: ↪ ✈️ Paginator 17007:18077
  - Related: Segmented Button Block 8000:4554; Dropdown Button; Button outlined secondary iconOnly
  - Axes: size L–XS × type page|table; boolean hasFirstLast (default true)
Spec artifacts:
  - packages/react/src/manifest/figmaComponentPropsSnapshot.json (both exports)
  - packages/react/src/manifest/visual-recipes/Pagination.json
  - packages/react/src/manifest/visual-recipes/TablePagination.json
Coverage: page 6 cases + table 5 cases (sizes, light/dark, no-first-last)
Correction loop:
  - Page type: SegmentedButton geometry + nav chrome tweak
    (secondary fill + quaternary icons on first/prev/next/last)
  - Selected page: selected primary fill/border + selected text (mint)
  - Ellipsis: FA ellipsis on primary fill (not MUI "…")
  - Custom ButtonBase items (avoid MUI PaginationItem selected/ellipsis overrides)
  - Fixed FA codepoints chevron-left/right (were Unicode 〈〉 2329/232a → f053/f054)
  - Table type: desktop horizontal + divider; at ≤760px stacked; rows-per-page Dropdown role=input (selected value); mobile gap L16/M12/S8/XS6
  - Page type: layout=auto swaps to compact prev + Page X of Y + next when narrow; playground preview provides a real constrained container
  - Browser captures vs Figma 17015:1624 / 17019:4213
API notes:
  - Figma type axis is design-only → two exports (MUI Pagination vs TablePagination)
  - hasFirstLast → showFirstButton + showLastButton (default true)
  - Docs: one Navigation page, playground demoType switch, two props tables + MUI links
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm figma:audit-props -- --strict; pnpm typecheck; pnpm build
Accepted differences:
  - Page trail content follows MUI sibling/boundary algorithm; Figma mocks a fixed decorative trail
  - Page layout=auto compact swap (Figma shows segmented trail only)
  - Table stacks clusters vertically with no divider only at ≤760px (desktop matches Figma)
```

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
  - Added --shape-xl (12px) for Dialog/Modal Figma shape/xl
  - Scrim uses fixed black 80% (not theme-flipping --background-neutral-alpha-80)
API notes:
  - Popover merges Figma Popover + Popover Core (Core not public)
  - Dialog/Modal spelling isDismissable matches Figma
  - Drawer/Dialog/Modal support surfaceOnly for fixtures + open for runtime
  - Tooltip startIcon defaults false in code (Figma default true) — documented in snapshot
API audit: 0 error / 0 warn / 0 escalate (strict)
Verification: pnpm figma:audit-props -- --strict; pnpm typecheck; pnpm build; pnpm build:docs
Accepted differences:
  - Dialog width matches Modal: fill (`width: 100%`) up to maxWidth 800; no minWidth (responsive as viewport shrinks)
  - Popover caret is CSS diamond vs Figma vector asset (geometry ±2px)
```

## Not done yet (pick up here)

Priority order for the next agent sessions:

1. **FontAwesome Glyphs — submit to Community** — follow `tooling/figma-icon-plugin/PUBLISH.md` (public build, listing copy, icon/cover). Smoke-test in Figma web after approval.
2. **CADS Audit — in-file smoke test** — import `tooling/figma-remap-plugin/manifest.json` in Figma Desktop: fully-CADS frame → pass; messy DSCO frame → summary cards (no instance-internal noise); category Review fixes + apply + re-audit; surface-split colors; FA6→FA7; include-hidden; AI with team key from `.env`. Re-harvest baked catalogs after publishing new styles/components. Follow-ups: canvas select-from-finding; mixed text segments.
2. **Adopt closed-loop parity workflow on Actions** — pull fresh `get_design_context`; create Button / SegmentedButton / IconToggle visual recipes and deterministic coverage fixtures; run light + dark state captures, fix and recapture mismatches, then a11y. SegmentedButton Group `8027:2099` / Block `8000:4554`.
2. **Motion follow-ups** — Catalog Highlight-chase still deferred (docs sidebar is the only chase); optional SegmentedButton sliding Indicator; feel-check spring.moderate bounce on rapid Toggle/Tabs.
3. **Harden docs honesty** — generate props tables from TS types (`react-docgen-typescript` or equivalent) instead of only the hand-maintained manifest; keep manifest as the AI substrate but wire descriptions from TSDoc.
4. **End-to-end portable skill hosts** — download from Pages `/ai` (or local ZIP) and run the host matrix in `tooling/cads-artifact/MANUAL_TEST.md` (Claude org-share, ChatGPT Skills/Work, Gemini Spark, Cursor skill folder). Later: when prod publishes FA7 on `dsco.code.org`, switch runtime/`@font-face` to those CDN assets and stop inlining OTFs.
5. **Expand catalog** — next wave from Content and Media (Divider, Video, Carousel, Action Block) once design status is green. **Each batch:** snapshot axes → implement → `pnpm figma:audit-props` → rubric in `cads-parity-qa` before “done.”
6. **Variables completeness** — pull typography / spacing-shape / effects from Figma into the variables document (non-color values are currently ported from Lab2 globals, not live-synced).
7. **Lab2 off `file:` in CI** — after the first GitHub Packages version exists, pin `@moshebaricdo/cads-*` in `web-lab-prototype` (and other prototypes), add `.npmrc` + `NODE_AUTH_TOKEN`; keep `file:` only for local CADS iteration.
8. **Prototype gallery** — replace the placeholder with real inspectable prototypes.
9. **Harness automation (later)** — REST snapshot refresh/change fingerprint with PAT; CI strict audit; Playwright pairwise fixture generation and normalized pixel baselines.

## Explicit non-goals (for now)

- Replacing Lab2 `App*` atoms wholesale
- Publishing to public npm
- Published Figma Enterprise Code Connect
- Matching production `code-dot-org` Storybook APIs 1:1 (prod may later converge on MUI + this CADS API)
