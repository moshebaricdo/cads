---
name: cads-prototyping
description: Build CodeAI Design System (CADS) prototypes as shareable Claude artifacts. Use for internal design prototypes, Figma-aligned UI mocks, and when the user asks for CADS, CodeAI UI, or design-system components.
---

# CADS prototyping (Claude artifacts)

Create **native Claude artifacts** that embed the real CADS runtime. No hosting, npm install, or prototype URL required. Intended for **organization-only** sharing.

## Workflow

1. Translate the user's request into a constrained CADS prototype JSON (see [references/schema.md](references/schema.md)).
2. Use only components and props listed in [references/manifest-summary.md](references/manifest-summary.md).
3. Generate a **self-contained HTML artifact** by inlining:
   - `runtime/cads-runtime.css`
   - `runtime/cads-runtime.js`
   - the prototype JSON in `<script id="cads-prototype-spec" type="application/json">`
   - a boot call: `CADS.mountFromScriptTag("cads-prototype-spec")`
4. Prefer regenerating the full HTML after edits. Do **not** rewrite or hand-edit `cads-runtime.js`.
5. Stamp `_cads.manifestVersion` from `runtime/VERSION.json`.

Optional helper (when code execution can read skill files):

```bash
node scripts/generate-artifact.mjs --spec /path/to/spec.json --out /tmp/prototype.html
```

If the helper is unavailable, assemble the HTML template below in the artifact.

## HTML artifact template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>PROTOTYPE_TITLE</title>
  <style>
    html, body { margin: 0; padding: 0; }
    /* paste entire contents of runtime/cads-runtime.css here */
  </style>
</head>
<body>
  <div id="cads-root"></div>
  <script id="cads-prototype-spec" type="application/json">
  /* paste validated prototype JSON (include _cads stamp) */
  </script>
  <script>
  /* paste entire contents of runtime/cads-runtime.js here */
  </script>
  <script>
    CADS.mountFromScriptTag("cads-prototype-spec");
  </script>
</body>
</html>
```

## Rules

- Only CADS components from the manifest. Never invent props, colors, or APIs.
- No hard-coded hex colors. No `--ds-*` variables.
- Brand tokens for CTAs/links; selected tokens for selected chrome.
- Control heights via `size`: large / medium / small / extraSmall.
- Layout only via `layout` nodes: `stack`, `inline`, `surface`.
- Typography only via `text` nodes with approved variants.
- Do not emit callbacks (`onClick`, etc.) in the JSON — they are not serializable.
- After the user asks for changes, update the JSON and regenerate the artifact.

## Preferred vs fallback formats

- **Reliable (use this):** self-contained HTML with inlined runtime (above).
- **Experimental:** multi-file React artifact importing `./cads-runtime.module.js` — only if the host preserves local modules. If imports fail, fall back to HTML.

## Sharing

Publish **organization-only**. This embeds FA Pro fonts under the internal license for internal prototyping — not for public/commercial redistribution.

## Example

See [examples/teacher-onboarding.json](examples/teacher-onboarding.json). Prompt:

> Create a CADS teacher onboarding form with school name, role, and Continue.
