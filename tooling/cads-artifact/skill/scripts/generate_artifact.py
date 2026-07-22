#!/usr/bin/env python3
"""
Skill-local CADS prototype generator (stdlib only).

Reads runtime/ + a JSON spec and writes a self-contained HTML prototype.

  python3 scripts/generate_artifact.py --spec examples/teacher-onboarding.json
  python3 scripts/generate_artifact.py --spec ./my.json --out /tmp/out.html
  python3 scripts/generate_artifact.py --stdin < my.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent.parent
RUNTIME_DIR = SKILL_ROOT / "runtime"
COMPONENTS_PATH = SKILL_ROOT / "references" / "components.json"

LAYOUTS = {"stack", "inline", "surface"}
THEMES = {"light", "dark"}
HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")


def main() -> int:
    args = parse_args()
    js_path = RUNTIME_DIR / "cads-runtime.js"
    css_path = RUNTIME_DIR / "cads-runtime.css"
    version_path = RUNTIME_DIR / "VERSION.json"

    if not js_path.is_file():
        print("Missing runtime/cads-runtime.js", file=sys.stderr)
        return 1

    if args.stdin:
        spec = json.load(sys.stdin)
    else:
        spec = json.loads(Path(args.spec).read_text(encoding="utf-8"))

    catalog = load_components()
    validation = validate_spec(spec, catalog)
    if not validation["valid"]:
        print("Invalid prototype:", file=sys.stderr)
        for error in validation["errors"]:
            print(f"  - {error}", file=sys.stderr)
        return 1

    version = json.loads(version_path.read_text(encoding="utf-8"))
    js = js_path.read_text(encoding="utf-8")
    css = css_path.read_text(encoding="utf-8") if css_path.is_file() else ""

    stamped = {
        **spec,
        "_cads": {
            "manifestVersion": version.get("manifestVersion"),
            "builtAt": version.get("builtAt"),
            "format": "html-self-contained",
            "warnings": validation["warnings"],
        },
    }

    out = Path(args.out) if args.out else SKILL_ROOT / "output" / f"{slug(spec.get('title', 'prototype'))}.html"
    out.parent.mkdir(parents=True, exist_ok=True)

    title = escape_html(spec.get("title") or "CADS prototype")
    payload = json.dumps(stamped, ensure_ascii=False).replace("<", "\\u003c")
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <style>
    html, body {{ margin: 0; padding: 0; }}
    {css}
  </style>
</head>
<body>
  <div id="cads-root"></div>
  <script id="cads-prototype-spec" type="application/json">{payload}</script>
  <script>
{js}
  </script>
  <script>
    CADS.mountFromScriptTag("cads-prototype-spec");
  </script>
</body>
</html>
"""
    out.write_text(html, encoding="utf-8")
    size_kb = len(html.encode("utf-8")) / 1024
    print(f"Wrote {out} ({size_kb:.1f} KB)")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a self-contained CADS HTML prototype")
    parser.add_argument("--spec", help="Path to prototype JSON")
    parser.add_argument("--out", help="Output HTML path")
    parser.add_argument("--stdin", action="store_true", help="Read JSON from stdin")
    args = parser.parse_args()
    if not args.stdin and not args.spec:
        parser.error("Pass --spec path.json or --stdin")
    return args


def load_components():
    if not COMPONENTS_PATH.is_file():
        return None
    return json.loads(COMPONENTS_PATH.read_text(encoding="utf-8"))


def validate_spec(spec, catalog):
    errors = []
    warnings = []
    if not isinstance(spec, dict):
        return {"valid": False, "errors": ["spec must be an object"], "warnings": warnings}
    title = spec.get("title")
    if not isinstance(title, str) or not title.strip():
        errors.append("title is required")
    theme = spec.get("theme")
    if theme is not None and theme not in THEMES:
        errors.append("theme must be light or dark")
    walk(spec.get("root"), "root", errors, warnings, catalog)
    detect_forbidden(spec, "spec", errors)
    return {"valid": len(errors) == 0, "errors": errors, "warnings": warnings}


def walk(node, path, errors, warnings, catalog):
    if not isinstance(node, dict):
        errors.append(f"{path}: expected node")
        return
    node_type = node.get("type")
    if node_type == "layout":
        if node.get("layout") not in LAYOUTS:
            errors.append(f"{path}.layout invalid")
    elif node_type == "text":
        if not node.get("text"):
            errors.append(f"{path}.text required")
    elif node_type == "component":
        component = node.get("component")
        if catalog is not None and component not in catalog:
            errors.append(f"{path}.component {component} not in CADS")
        elif catalog is not None:
            allowed = {prop["name"] for prop in catalog[component].get("props", [])}
            for key in (node.get("props") or {}):
                if key not in allowed:
                    errors.append(f"{path}.props.{key} not declared")
    else:
        errors.append(f"{path}.type invalid")

    children = node.get("children")
    if isinstance(children, list):
        for i, child in enumerate(children):
            walk(child, f"{path}.children[{i}]", errors, warnings, catalog)


def detect_forbidden(value, path, errors):
    if isinstance(value, str):
        if HEX_RE.search(value):
            errors.append(f"{path}: hard-coded colors are not allowed")
        if "--ds-" in value:
            errors.append(f"{path}: --ds-* variables are not allowed")
        return
    if isinstance(value, list):
        for i, item in enumerate(value):
            detect_forbidden(item, f"{path}[{i}]", errors)
        return
    if isinstance(value, dict):
        for key, item in value.items():
            detect_forbidden(item, f"{path}.{key}", errors)


def slug(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", str(value).lower()).strip("-")
    return (cleaned[:64] or "prototype")


def escape_html(value: str) -> str:
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


if __name__ == "__main__":
    raise SystemExit(main())
