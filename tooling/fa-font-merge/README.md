# FA → CodeAI font merge

Bakes your Font Awesome **kit** custom icons (and their shortcode ligatures) into stock FA 7 faces, then renames them to a frozen **CodeAI** family. Internal only — output is derived from FA Pro and must not be redistributed publicly.

## Why

Component text props can only render glyphs from the font face the component was built with. Merging kit icons into that family means custom shortcodes work through props with no detaching and no font switching.

## Families produced

| Family | Styles | Contents |
|---|---|---|
| `Font Awesome 7 Pro CodeAI` | Solid, Regular | FA 7 Pro + kit icons |
| `Font Awesome 7 Duotone CodeAI` | Solid, Regular | FA 7 Duotone + kit duotone icons |
| `Font Awesome 7 Brands CodeAI` | Regular | FA 7 Brands (rename only) |

## Run

Point `--kit-dir` at the `otfs/` folder from an FA kit desktop download (the one with both stock faces and `Font Awesome Kit …` files):

```bash
pnpm fonts:merge -- --kit-dir "/path/to/kit-…/otfs"
# or:
python3 tooling/fa-font-merge/merge_fonts.py --kit-dir "/path/to/kit-…/otfs"
```

Requires [`fonttools`](https://github.com/fonttools/fonttools) (`brew install fonttools` / `pip install fonttools`).

Output lands in `tooling/fa-font-merge/out/` (gitignored).

## Install & use with the plugin

1. Double-click each `.otf` in `out/` (or copy into `~/Library/Fonts`).
2. Restart Figma (or wait for font refresh).
3. In the icon plugin → **Settings → Add files…** and select the merged OTFs.  
   Adding the files (not just installing them) is what lets the plugin parse custom glyphs into a `· Custom` style source.
4. Prefer these CodeAI families in the version picker going forward. Library components should use `Font Awesome 7 Pro CodeAI` for icon text layers when you migrate.

Re-run the merge whenever the kit changes, replace the installed files, and re-add them in plugin settings.
