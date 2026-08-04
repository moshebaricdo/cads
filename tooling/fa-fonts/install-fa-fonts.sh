#!/usr/bin/env bash
# Install / replace Font Awesome desktop fonts (Mac).
# Usage: drag the otfs folder onto "Install FA Fonts.command", or double-click and pick it.

set -euo pipefail

DEST="${HOME}/Library/Fonts"

pick_source() {
  if [[ $# -ge 1 && -e "$1" ]]; then
    echo "$1"
    return
  fi
  osascript <<'APPLESCRIPT'
try
  return POSIX path of (choose folder with prompt "Select the otfs folder from your unzipped Font Awesome download:")
on error
  return ""
end try
APPLESCRIPT
}

resolve_font_dir() {
  local src="$1"

  # Prefer …/otfs if they selected the kit root by mistake
  local otfs
  otfs="$(find "$src" -type d -name otfs 2>/dev/null | head -n 1 || true)"
  if [[ -n "$otfs" ]]; then
    echo "$otfs"
    return
  fi

  # Or they selected otfs / a folder of font files directly
  if find "$src" -maxdepth 2 -type f \( -iname '*.otf' -o -iname '*.ttf' \) | grep -q .; then
    echo "$src"
    return
  fi

  echo ""
}

echo ""
echo "══════════════════════════════════════"
echo "  Install FA Fonts"
echo "══════════════════════════════════════"
echo ""

SRC_RAW="$(pick_source "${1:-}")"
SRC_RAW="${SRC_RAW%$'\r'}"
SRC_RAW="${SRC_RAW%/}"

if [[ -z "$SRC_RAW" || ! -e "$SRC_RAW" ]]; then
  echo "No folder selected. Nothing to do."
  echo ""
  read -r -p "Press Return to close…" _
  exit 0
fi

FONT_DIR="$(resolve_font_dir "$SRC_RAW")"
if [[ -z "$FONT_DIR" ]]; then
  echo "Couldn't find any .otf / .ttf fonts in:"
  echo "  $SRC_RAW"
  echo ""
  echo "Tip: unzip the Font Awesome download, then select the otfs folder inside it."
  echo ""
  read -r -p "Press Return to close…" _
  exit 1
fi

mkdir -p "$DEST"

added=0
replaced=0
removed=0

# Collect incoming filenames
incoming_names=()
while IFS= read -r -d '' f; do
  incoming_names+=("$(basename "$f")")
done < <(find "$FONT_DIR" -maxdepth 3 -type f \( -iname '*.otf' -o -iname '*.ttf' \) -print0)

if [[ ${#incoming_names[@]} -eq 0 ]]; then
  echo "No font files found in: $FONT_DIR"
  echo ""
  read -r -p "Press Return to close…" _
  exit 1
fi

installing_kit=false
for name in "${incoming_names[@]}"; do
  # Must match FA's "Font Awesome Kit …" prefix — NOT substring "kit" (e.g. BlackItalic)
  if [[ "$name" == Font\ Awesome\ Kit* ]]; then
    installing_kit=true
    break
  fi
done

# When installing a kit, remove other FA Kit fonts not in this package (stale ids)
if $installing_kit; then
  while IFS= read -r -d '' old; do
    base="$(basename "$old")"
    keep=false
    for name in "${incoming_names[@]}"; do
      if [[ "$base" == "$name" ]]; then keep=true; break; fi
    done
    if ! $keep; then
      # Prefer Trash over permanent delete (recoverable if something goes wrong)
      if command -v trash >/dev/null 2>&1; then
        trash "$old" 2>/dev/null || mv "$old" "${HOME}/.Trash/$base"
      else
        mv "$old" "${HOME}/.Trash/$base" 2>/dev/null || rm -f "$old"
      fi
      echo "  Removed old kit font: $base"
      removed=$((removed + 1))
    fi
  done < <(find "$DEST" -maxdepth 1 -type f \( -name 'Font Awesome Kit*.otf' -o -name 'Font Awesome Kit*.ttf' \) -print0 2>/dev/null || true)
fi

echo "Installing from:"
echo "  $FONT_DIR"
echo "Into:"
echo "  $DEST"
echo ""

while IFS= read -r -d '' f; do
  name="$(basename "$f")"
  target="$DEST/$name"
  if [[ -f "$target" ]]; then
    cp -f "$f" "$target"
    echo "  Replaced  $name"
    replaced=$((replaced + 1))
  else
    cp -f "$f" "$target"
    echo "  Added     $name"
    added=$((added + 1))
  fi
done < <(find "$FONT_DIR" -maxdepth 3 -type f \( -iname '*.otf' -o -iname '*.ttf' \) -print0)

echo ""
echo "Done. Added: $added  ·  Replaced: $replaced  ·  Removed old kits: $removed"
echo ""
echo "Next: fully quit Figma (Cmd+Q) and reopen it."
echo ""
read -r -p "Press Return to close…" _
