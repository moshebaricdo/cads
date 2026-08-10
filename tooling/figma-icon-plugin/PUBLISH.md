# Publishing FontAwesome Glyphs to the Figma Community

You are on the **Pro** plan, so this publishes **publicly** to Community (not org-private). That is intentional — the plugin does not ship FA Pro font files.

## Before you start

```bash
pnpm plugin:icons:build    # must say "[public / Community-safe]", ~hundreds of KB not ~3 MB
pnpm --filter @codeai/cads-figma-icon-plugin run typecheck
```

Confirm `tooling/figma-icon-plugin/dist/ui.html` does **not** contain `data:font/otf;base64` (no inlined Pro fonts).

Import the built plugin in Figma Desktop once more and smoke-test:

- [ ] First launch shows setup with **Add font files** *or* **Sync Custom Kit (API)** → either path reaches the picker
- [ ] Setup API path: token → Load my kits → multi-select → Load selected kits
- [ ] Settings → add/remove fonts; clearing all returns to setup
- [ ] Settings → Default style (e.g. Solid) — reopen plugin lands on that style
- [ ] Search + insert into a text prop (no detach); font face swaps (kit → kit font)
- [ ] Insert into a plain text layer
- [ ] Multi-select / multi-edit several text layers → icon lands in all of them
- [ ] Layers on an outdated/missing kit face → insert upgrades shortcode *and* font to the picked kit
- [ ] Insert with nothing selected (creates a layer)
- [ ] “All” + “Custom Kit” labels look right
- [ ] Settings → Custom Kit: invalid token errors cleanly; Load kits + Refresh populates Custom Kit (· API)
- [ ] File-only path still works with no token (network unused)
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

> This plugin addresses a need our team had to enable easier usage of FA Icons (including custom kit icons) as glyphs inserted via shortcode instead of vector assets which is currently how the official FA (and several unofficial ones) work. The default setup uses locally installed FA font files (no token required). Optionally, paste a Font Awesome account API token with Read Kits Data to refresh custom kit icons from the API without re-importing the kit `.otf`.
>
> **How to use**
> 1. Download and install your FontAwesome desktop fonts (and custom kit, if any) on your machine.
> 2. Open FontAwesome Glyphs — on first run, use **Add font files…** and select only the FA `.otf` faces you plan to use (nothing is auto-detected).
> 3. Search, pick a version (or All) and a style (Solid, Regular, All, … — styles stay available under All), click an icon. Under Settings you can change the font set and choose a preferred default style.
> 4. (Optional) Settings → Custom Kit: paste an account API token, Load kits, Refresh kit icons.
>
> **Updating a custom kit**
> 1. Replace the desktop kit font (a simple installer is easier than Font Book).
> 2. Refresh the catalog (re-add the `.otf`, or Refresh kit icons if you use API sync).
> 3. Fully quit Figma and reopen so new ligatures load.
>
> **Inserts into**
> - Component text properties (sidebar props — no detaching)
> - Selected text layers
> - A new text layer if nothing is selected
>
> Custom kit fonts appear as “Custom Kit”. This plugin is not affiliated with Font Awesome.

**Category:** Design tools / Icons

**Network access:** `https://api.fontawesome.com` — optional Custom Kit catalog sync only (account API token → kit `iconUploads`). Local font import does not use the network. Figma will show that this plugin can access the network.

**Token guidance (teams):** A shared account API token scoped to **Read Kits Data** (`kits_read`), stored in a password manager, is enough. Each designer may also use their own token from [fontawesome.com/account](https://fontawesome.com/account). The plugin stores the token in Figma `clientStorage` (per user), not in the file.

## Publish steps (Figma Desktop)

1. `Plugins → Development → FontAwesome Glyphs` (ensure latest build is loaded).
2. Click the resources / plugin menu → **Publish…** (or Community → publish from the plugin’s development entry).
3. When prompted for a plugin **id**, paste the generated id into `manifest.json` as `"id": "…"`, run `pnpm plugin:icons:build` again, then continue.
4. Add icon + cover, paste description, set **Publish to → Community**.
5. Submit for review.

## After approval

- Share the Community link with the team (web + desktop).
- Designers still install FA fonts locally; the plugin only inserts shortcodes.
- For kit desktop updates, use `tooling/fa-fonts` (`Install FA Fonts.command` / `.bat`), then Refresh kit icons (or re-add the OTF), then quit Figma.

## Do not publish

- Output of `pnpm plugin:icons:build:dev` / `--with-fonts` (contains FA Pro binaries).
- Anything from `tooling/fa-font-merge/out/`.
