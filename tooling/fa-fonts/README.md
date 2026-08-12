# Install FA Fonts

For designers: install or **replace** Font Awesome desktop fonts (including kit updates) without fighting Font Book / Windows Fonts UI.

Works on **Mac** and **Windows**. No coding required.

## How to use

1. Download your kit / desktop package from [fontawesome.com](https://fontawesome.com) and **unzip** it.
2. Open the unzipped folder and find the **`otfs`** folder (the one with the `.otf` files).
3. **Either:**
   - **Drag** that `otfs` folder onto:
     - Mac: `Install FA Fonts.command`
     - Windows: `Install FA Fonts.bat`
   - **Or** double-click that file and select the `otfs` folder when asked.
4. Read the summary in the window that opens.
5. **Quit and reopen Figma** (so it picks up the new files).

That’s it. Matching filenames overwrite the old install, so kit updates with the same name just replace.

### After a kit update — FontAwesome Glyphs catalog

This installer only updates the **OS font**. The Glyphs plugin keeps its own icon catalog:

1. Run this installer (steps above).
2. In **FontAwesome Glyphs → Settings**, either:
   - **Refresh kit icons** (if you use optional API sync), or
   - **Add files** and re-select the new kit `.otf` (same family replaces in place).
3. Fully quit Figma and reopen (step 5 above) before expecting new shortcodes to render as glyphs on the canvas.

With API sync, Custom Kit **picker previews** use SVG path data from Font Awesome (not the OTF), so the grid should not show tofu from a stale Windows font cache.

## What it does

- Installs every `.otf` / `.ttf` in the folder you select
- Copies them into your user fonts folder (no admin password)
- If you install a **Kit** font, older Kit fonts with a *different* id are removed so you don’t keep stale custom icons around
- Prints what was added, replaced, or removed

## Sharing with the team

Zip this whole `fa-fonts` folder and share it (Drive, Slack, etc.). Designers do **not** need the CADS repo or any developer tools.

## Troubleshooting

- **Mac says the file can’t be opened:** Right-click → Open (first time only), or System Settings → Privacy & Security → Open Anyway.
- **Icons look unchanged in Figma:** Fully quit Figma (not just the file tab) and reopen. Also refresh the Glyphs plugin catalog (see above).
- **Windows SmartScreen warning:** More info → Run anyway (unsigned local script).
