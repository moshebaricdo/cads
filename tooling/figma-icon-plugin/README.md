# FontAwesome Glyphs

Figma plugin that gives you Font Awesome’s searchable, visual icon browser — but inserts **shortcodes as text**, not vectors. That keeps parity with code (font + shortcode), never detaches component instances, and keeps text-scoped color variables working.

**Community tagline:** Insert FontAwesome icons as glyphs, not vectors.

## For designers

1. Install your FA desktop fonts (and kit) locally — see [`../fa-fonts`](../fa-fonts) for a simple replace installer (prefer this over Font Book when updating a kit).
2. Run **FontAwesome Glyphs** from Plugins.
3. On first run, prefer **Sync via API** (paste account token → pick a kit → choose styles, with Select all) or **Add local font files**. Settings can add/remove styles instantly from a checklist dropdown.
4. Search → pick a version (or All) and a style (Solid, Regular, … — styles stay available even when version is All) → click. The footer shows whether you’ll fill a prop, replace a text layer (or all multi-selected / multi-edit text layers), or create a new one. Manage fonts and your preferred default style under Settings.

### Custom kit updates (two paths)

The picker catalog and the OS font are separate. New kit icons need **both** an updated desktop font (for canvas ligatures) and an updated catalog (for search).

| Path | Catalog | When to use |
|---|---|---|
| **Local files** (default) | Settings → **Add files** and re-select the new kit `.otf` (same family replaces in place) | No FA account API token; works offline |
| **Kit API sync** (optional) | Settings → paste account API token (`kits_read`) → Load kits → **Refresh kit icons** | Kit changes often; avoid re-picking the OTF for the catalog |

**Every kit desktop update still needs:**

1. Download the kit package from fontawesome.com and unzip.
2. Run **Install FA Fonts** (`../fa-fonts`) on the `otfs` folder — do not fight Font Book duplicates.
3. Refresh the catalog (re-add OTF **or** Refresh kit icons).
4. **Fully quit Figma** (Cmd+Q / Exit) and reopen so the new font binary is loaded.

API sync does **not** install fonts and does **not** skip the Figma relaunch.

## Develop

```bash
pnpm plugin:icons:build        # Community-safe (no FA fonts inlined)
pnpm plugin:icons:build:dev    # Local only — inlines FA Pro for previews without installing fonts
pnpm plugin:icons:watch
```

Then in **Figma Desktop**: `Plugins → Development → Import plugin from manifest…` → `tooling/figma-icon-plugin/manifest.json`.

## Architecture

```text
src/code.ts            Main thread: selection, fonts report, settings, insertion
src/ui/main.ts         Setup, search, pickers, grid, settings + font parsing
src/ui/faKitApi.ts     Optional FA GraphQL kit sync (token → iconUploads)
src/ui/template.html   UI shell
src/ui/icons/          SVG assets inlined at build (`<!--__ICON:file.svg__-->`)
src/shared/messages.ts UI ↔ main protocol
src/data/icons.ts      IconEntry type + optional stock maps (not used for picker)
scripts/build.mjs      esbuild; public by default; --with-fonts for internal only
icon.png               128×128 plugin icon
publish-assets/        Community cover art
```

`networkAccess` allows `https://api.fontawesome.com` for optional kit sync only. Local file import never calls the network.

## Publish

See [PUBLISH.md](./PUBLISH.md).
