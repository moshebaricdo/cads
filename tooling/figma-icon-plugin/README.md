# FontAwesome Glyphs

Figma plugin that gives you Font Awesome’s searchable, visual icon browser — but inserts **shortcodes as text**, not vectors. That keeps parity with code (font + shortcode), never detaches component instances, and keeps text-scoped color variables working.

**Community tagline:** Insert FontAwesome icons as glyphs, not vectors.

## For designers

1. Install your FA desktop fonts (and kit) locally — see `../fa-fonts` for a simple replace installer.
2. Run **FontAwesome Glyphs** from Plugins.
3. On first run, **Add font files…** and select only the `.otf` faces you use (Pro, Brands, Kit, …). The picker never auto-detects every FA font on the machine.
4. Search → click. The footer shows whether you’ll fill a prop, replace a text layer (or all multi-selected / multi-edit text layers), or create a new one. Manage fonts and your preferred default style (Solid, Regular, All, …) under Settings.

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
src/ui/template.html   UI shell
src/shared/messages.ts UI ↔ main protocol
src/data/icons.ts      IconEntry type + optional stock maps (not used for picker)
scripts/build.mjs      esbuild; public by default; --with-fonts for internal only
icon.png               128×128 plugin icon
publish-assets/        Community cover art
```

`networkAccess: none` — nothing leaves Figma.

## Publish

See [PUBLISH.md](./PUBLISH.md).
