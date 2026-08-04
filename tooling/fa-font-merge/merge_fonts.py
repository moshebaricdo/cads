#!/usr/bin/env python3
"""
Merge Font Awesome kit custom glyphs (+ shortcode ligatures) into stock FA 7
faces and rename them to a frozen CodeAI family.

Why: component text props can only render glyphs from the font face the
component was built with. Baking kit icons into that family means custom
shortcodes work without detaching or switching fonts.

Usage:
  python3 tooling/fa-font-merge/merge_fonts.py \\
    --kit-dir "/path/to/kit-…/otfs" \\
    --out-dir tooling/fa-font-merge/out

Requires: fonttools (pip/brew). Output is FA Pro–derived — internal only.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables import otTables

FAMILY_SUFFIX = "CodeAI"

# (base_filename, kit_filename | None, preferred_family_out, preferred_style)
JOBS = [
    (
        "Font Awesome 7 Pro-Solid-900.otf",
        "Font Awesome Kit ea2d9d4413-Regular-400.otf",
        f"Font Awesome 7 Pro {FAMILY_SUFFIX}",
        "Solid",
    ),
    (
        "Font Awesome 7 Pro-Regular-400.otf",
        "Font Awesome Kit ea2d9d4413-Regular-400.otf",
        f"Font Awesome 7 Pro {FAMILY_SUFFIX}",
        "Regular",
    ),
    (
        "Font Awesome 7 Duotone-Solid-900.otf",
        "Font Awesome Kit Duotone ea2d9d4413-Regular-400.otf",
        f"Font Awesome 7 Duotone {FAMILY_SUFFIX}",
        "Solid",
    ),
    (
        "Font Awesome 7 Duotone-Regular-400.otf",
        "Font Awesome Kit Duotone ea2d9d4413-Regular-400.otf",
        f"Font Awesome 7 Duotone {FAMILY_SUFFIX}",
        "Regular",
    ),
    (
        "Font Awesome 7 Brands-Regular-400.otf",
        None,  # rename only — no kit brands
        f"Font Awesome 7 Brands {FAMILY_SUFFIX}",
        "Regular",
    ),
]


def name_get(font: TTFont, name_id: int) -> str | None:
    for rec in font["name"].names:
        if rec.nameID == name_id and rec.platformID == 3 and rec.langID == 0x409:
            return rec.toUnicode()
    for rec in font["name"].names:
        if rec.nameID == name_id:
            return rec.toUnicode()
    return None


def set_family_names(font: TTFont, family: str, style: str) -> None:
    """Rewrite name table to a frozen CodeAI identity (Figma binds family+style).

    Mirrors FA's pattern: ID 16/17 are the typographic family/style Figma uses
    ("Font Awesome 7 Pro CodeAI" + "Solid"); ID 1 may include the style for
    non-Regular faces.
    """
    full = f"{family} {style}"
    ps = family.replace(" ", "") + "-" + style.replace(" ", "")
    replacements = {
        1: family if style == "Regular" else f"{family} {style}",
        2: "Regular",
        3: f"{full}; CodeAI merged",
        4: full,
        6: ps,
        16: family,
        17: style,
    }
    name = font["name"]
    for name_id, value in replacements.items():
        name.setName(value, name_id, 3, 1, 0x409)  # Windows Unicode
        name.setName(value, name_id, 1, 0, 0)  # Mac Roman


def kit_component_map(kit: TTFont, base: TTFont) -> dict[str, str]:
    """Map kit ligature component glyph names (.u65) → base names (a)."""
    kit_cmap = kit.getBestCmap() or {}
    base_cmap = base.getBestCmap() or {}
    mapping: dict[str, str] = {}
    for cp, kit_name in kit_cmap.items():
        if cp in base_cmap:
            mapping[kit_name] = base_cmap[cp]
    return mapping


def icon_glyph_names(kit: TTFont) -> list[str]:
    """Kit glyphs that are real icons (not `.uXX` ligature scaffolding)."""
    return [
        name
        for name in kit.getGlyphOrder()
        if name != ".notdef" and not name.startswith(".u")
    ]


def copy_glyph(kit: TTFont, base: TTFont, glyph_name: str) -> None:
    """Copy a CFF glyph + hmtx advance into the base font under the same name."""
    if glyph_name in base.getGlyphOrder():
        return

    kit_gs = kit.getGlyphSet()
    width, lsb = kit["hmtx"][glyph_name]
    pen = T2CharStringPen(width, None)
    kit_gs[glyph_name].draw(pen)

    cff = base["CFF "].cff
    top = cff.topDictIndex[0]
    charstring = pen.getCharString(private=top.Private, globalSubrs=cff.GlobalSubrs)

    order = base.getGlyphOrder()
    order.append(glyph_name)
    base.setGlyphOrder(order)

    top.CharStrings.charStringsIndex.append(charstring)
    top.CharStrings.charStrings[glyph_name] = (
        len(top.CharStrings.charStringsIndex) - 1
    )
    if glyph_name not in top.charset:
        top.charset.append(glyph_name)

    base["hmtx"][glyph_name] = (width, lsb)


def extract_kit_ligatures(
    kit: TTFont, component_map: dict[str, str], copied: set[str]
) -> list[tuple[list[str], str]]:
    """Return (components, ligGlyph) using base font component names."""
    if "GSUB" not in kit:
        return []
    gsub = kit["GSUB"].table
    results: list[tuple[list[str], str]] = []
    for fr in gsub.FeatureList.FeatureRecord:
        if fr.FeatureTag != "liga":
            continue
        for li in fr.Feature.LookupListIndex:
            lookup = gsub.LookupList.Lookup[li]
            for st in lookup.SubTable:
                inner = st.ExtSubTable if hasattr(st, "ExtSubTable") else st
                lig_map = getattr(inner, "ligatures", None) or {}
                for first, ligs in lig_map.items():
                    for lig in ligs:
                        out = lig.LigGlyph
                        if out not in copied:
                            continue
                        comps = [first, *lig.Component]
                        mapped: list[str] = []
                        ok = True
                        for comp in comps:
                            if comp not in component_map:
                                ok = False
                                break
                            mapped.append(component_map[comp])
                        if ok:
                            results.append((mapped, out))
    return results


def ensure_liga_lookup(font: TTFont):
    """Return the (lookup, ligatures_dict) for the font's liga feature."""
    gsub = font["GSUB"].table
    liga_lookup_index = None
    for fr in gsub.FeatureList.FeatureRecord:
        if fr.FeatureTag == "liga" and fr.Feature.LookupListIndex:
            liga_lookup_index = fr.Feature.LookupListIndex[0]
            break
    if liga_lookup_index is None:
        raise RuntimeError("Base font has no liga feature to extend")

    lookup = gsub.LookupList.Lookup[liga_lookup_index]
    # Prefer the first LigatureSubst subtable (may be wrapped in Extension).
    for st in lookup.SubTable:
        inner = st.ExtSubTable if hasattr(st, "ExtSubTable") else st
        if hasattr(inner, "ligatures"):
            return lookup, inner.ligatures
    raise RuntimeError("Could not find LigatureSubst table in liga lookup")


def add_ligatures(font: TTFont, new_ligs: list[tuple[list[str], str]]) -> int:
    """Append kit ligatures into the base font's existing liga table."""
    _, ligatures = ensure_liga_lookup(font)
    added = 0
    existing = set()
    for first, ligs in ligatures.items():
        for lig in ligs:
            key = (first, tuple(lig.Component), lig.LigGlyph)
            existing.add(key)

    for comps, out in new_ligs:
        first, *rest = comps
        key = (first, tuple(rest), out)
        if key in existing:
            continue
        lig = otTables.Ligature()
        lig.Component = rest
        lig.LigGlyph = out
        ligatures.setdefault(first, []).append(lig)
        # Longest-first matching is typical; keep longer sequences earlier.
        ligatures[first].sort(key=lambda l: len(l.Component), reverse=True)
        existing.add(key)
        added += 1
    return added


def merge_kit_into_base(base_path: Path, kit_path: Path | None, family: str, style: str, out_path: Path) -> None:
    font = TTFont(base_path)
    copied: set[str] = set()
    added_ligs = 0

    if kit_path is not None:
        kit = TTFont(kit_path)
        component_map = kit_component_map(kit, font)
        icons = icon_glyph_names(kit)
        base_names = set(font.getGlyphOrder())
        for name in icons:
            if name in base_names:
                print(f"    skip existing glyph: {name}")
                continue
            copy_glyph(kit, font, name)
            copied.add(name)
            base_names.add(name)

        new_ligs = extract_kit_ligatures(kit, component_map, copied)
        added_ligs = add_ligatures(font, new_ligs)
        kit.close()

    set_family_names(font, family, style)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    font.save(out_path)
    font.close()

    # Verify
    check = TTFont(out_path)
    got_family = name_get(check, 16)
    got_style = name_get(check, 17)
    print(
        f"  → {out_path.name}: family={got_family!r} style={got_style!r} "
        f"+{len(copied)} glyphs +{added_ligs} ligatures"
    )
    check.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--kit-dir",
        type=Path,
        required=True,
        help="Folder containing the kit + stock OTFs (FA desktop kit download)",
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=Path(__file__).resolve().parent / "out",
        help="Output directory for merged CodeAI fonts (default: ./out)",
    )
    args = parser.parse_args()
    kit_dir: Path = args.kit_dir.expanduser().resolve()
    out_dir: Path = args.out_dir.expanduser().resolve()

    if not kit_dir.is_dir():
        print(f"kit-dir not found: {kit_dir}", file=sys.stderr)
        return 1

    print(f"Source: {kit_dir}")
    print(f"Output: {out_dir}")
    out_dir.mkdir(parents=True, exist_ok=True)

    for base_name, kit_name, family, style in JOBS:
        base_path = kit_dir / base_name
        if not base_path.exists():
            print(f"MISSING base font: {base_name}", file=sys.stderr)
            return 1
        kit_path = (kit_dir / kit_name) if kit_name else None
        if kit_path and not kit_path.exists():
            print(f"MISSING kit font: {kit_name}", file=sys.stderr)
            return 1

        out_name = f"{family}-{style}.otf".replace(" ", "-")
        # Cleaner filenames
        slug = {
            ("Pro", "Solid"): "Font-Awesome-7-Pro-CodeAI-Solid-900.otf",
            ("Pro", "Regular"): "Font-Awesome-7-Pro-CodeAI-Regular-400.otf",
            ("Duotone", "Solid"): "Font-Awesome-7-Duotone-CodeAI-Solid-900.otf",
            ("Duotone", "Regular"): "Font-Awesome-7-Duotone-CodeAI-Regular-400.otf",
            ("Brands", "Regular"): "Font-Awesome-7-Brands-CodeAI-Regular-400.otf",
        }
        kind = "Brands" if "Brands" in family else ("Duotone" if "Duotone" in family else "Pro")
        out_name = slug[(kind, style)]
        print(f"\nMerging {base_name}" + (f" + {kit_name}" if kit_name else " (rename only)"))
        merge_kit_into_base(base_path, kit_path, family, style, out_dir / out_name)

    # Convenience: also write a tiny install note
    note = out_dir / "INSTALL.txt"
    note.write_text(
        "CodeAI merged Font Awesome fonts (internal / FA Pro license — do not redistribute).\n\n"
        "Install: double-click each .otf (or copy into ~/Library/Fonts).\n"
        "In the CADS Icons / Glyphtype plugin Settings → Add files… and select these.\n"
        "Families:\n"
        "  Font Awesome 7 Pro CodeAI     (Solid / Regular)  — stock Pro + kit icons\n"
        "  Font Awesome 7 Duotone CodeAI (Solid / Regular)  — stock Duotone + kit duotone\n"
        "  Font Awesome 7 Brands CodeAI  (Regular)          — stock Brands (rename only)\n",
        encoding="utf-8",
    )
    print(f"\nDone. Install fonts from {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
