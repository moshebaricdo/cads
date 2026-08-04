# Publishing FontAwesome Glyphs to the Figma Community

You are on the **Pro** plan, so this publishes **publicly** to Community (not org-private). That is intentional — the plugin does not ship FA Pro font files.

## Before you start

```bash
pnpm plugin:icons:build    # must say "[public / Community-safe]", ~hundreds of KB not ~3 MB
pnpm --filter @codeai/cads-figma-icon-plugin run typecheck
```

Confirm `tooling/figma-icon-plugin/dist/ui.html` does **not** contain `data:font/otf;base64` (no inlined Pro fonts).

Import the built plugin in Figma Desktop once more and smoke-test:

- [ ] First launch shows **Set up your fonts** (empty clientStorage) → Add files → picker
- [ ] Settings → add/remove fonts; clearing all returns to setup
- [ ] Search + insert into a text prop (no detach)
- [ ] Insert into a plain text layer
- [ ] Insert with nothing selected (creates a layer)
- [ ] “All” + “Custom Kit” labels look right
- [ ] Works in **Figma web** after you publish (dev plugins are desktop-only)

## Assets

| Asset | Path | Size |
|---|---|---|
| Plugin icon | `icon.png` | 256×256 (Figma recommends ≥128×128) |
| Community cover | `publish-assets/cover.png` | 1024×576 (16:9; Figma recommends 1920×1080) |

Upload these in the Publish modal. Optional: a short playground file showing a button with an icon text prop.

## Suggested Community listing copy

**Name:** FontAwesome Glyphs

**Tagline:** Insert FontAwesome icons as glyphs, not vectors.

**Description (draft):**

> This plugin addresses a need our team had to enable easier usage of FA Icons (including custom kit icons) as glyphs inserted via shortcode instead of vector assets which is currently how the official FA (and several unofficial ones) work. This plugin requires no API token, just locally installed FA Font files.
>
> **How to use**
> 1. Download and install your FontAwesome desktop fonts (and custom kit, if any) on your machine.
> 2. Open FontAwesome Glyphs — on first run, use **Add font files…** and select only the FA `.otf` faces you plan to use (nothing is auto-detected).
> 3. Search, pick a style (or All), click an icon. Change the set anytime under Settings.
>
> **Inserts into**
> - Component text properties (sidebar props — no detaching)
> - Selected text layers
> - A new text layer if nothing is selected
>
> Custom kit fonts appear as “Custom Kit”. This plugin is not affiliated with Font Awesome.

**Category:** Design tools / Icons

**Network access:** None (shows as “No access to network” — good).

## Publish steps (Figma Desktop)

1. `Plugins → Development → FontAwesome Glyphs` (ensure latest build is loaded).
2. Click the resources / plugin menu → **Publish…** (or Community → publish from the plugin’s development entry).
3. When prompted for a plugin **id**, paste the generated id into `manifest.json` as `"id": "…"`, run `pnpm plugin:icons:build` again, then continue.
4. Add icon + cover, paste description, set **Publish to → Community**.
5. Submit for review.

## After approval

- Share the Community link with the team (web + desktop).
- Designers still install FA fonts locally; the plugin only inserts shortcodes.
- For kit updates, use `tooling/fa-fonts` (`Install FA Fonts.command` / `.bat`).

## Do not publish

- Output of `pnpm plugin:icons:build:dev` / `--with-fonts` (contains FA Pro binaries).
- Anything from `tooling/fa-font-merge/out/`.
