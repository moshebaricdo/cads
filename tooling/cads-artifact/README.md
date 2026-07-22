# CADS portable prototyping skill

Lowest-lift path for **internal / organization-only** CADS prototypes that
embed the real design-system runtime — no npm install, package registry,
hosting, or monorepo checkout required in the viewer.

The same ZIP follows the [Agent Skills](https://agentskills.io) layout and can
be installed in Claude, ChatGPT (Skills / Work mode), Gemini Spark, and Cursor.

## What you get

| Output | Path |
|---|---|
| Browser IIFE runtime | `dist/cads-runtime.js` + `.css` (FA fonts inlined) |
| Sample HTML (local) | `dist/artifacts/teacher-onboarding.html` |
| Uploadable skill ZIP | `dist/cads-prototyping.zip` |
| Package report | `dist/package-report.json` |

## Build

```bash
pnpm --filter @codeai/cads-artifact build:all
# or from repo root:
pnpm artifact:build
```

## ZIP contract

```
cads-prototyping.zip
└── cads-prototyping/
    ├── SKILL.md
    ├── references/          # schema, manifest summary, UI patterns, components.json
    ├── runtime/             # cads-runtime.js + .css + VERSION.json
    ├── scripts/generate_artifact.py
    └── examples/*.json
```

Preflight checks before zip:

- Exactly one `SKILL.md` (no lowercase alias)
- Description ≤ 200 characters (Claude.ai limit)
- Required references + Python generator present
- No sample HTML, `.gitkeep`, or packaging noise
- File count / size within Claude / OpenAI / Gemini documented caps

## Install (internal)

1. Build the ZIP with `pnpm artifact:build`.
2. Install per host:
   - **Claude:** Customize → Skills → Upload the ZIP → enable `cads-prototyping`
   - **ChatGPT:** Skills / Work mode → upload the Agent Skills ZIP
   - **Gemini:** Spark → Skills → Upload (`SKILL.md` ZIP)
   - **Cursor:** drop the ZIP into an Agent chat and ask it to install the skill
3. Prompt: `Create a CADS teacher onboarding form as a self-contained HTML prototype.`

## License

The runtime inlines Font Awesome Pro fonts under CodeAI’s **internal** license.
Keep the skill and any prototypes it produces organization-only — never publish
them publicly or to npm. The docs site does **not** ship this ZIP on public
GitHub Pages for that reason.

## Formats

- **Reliable:** self-contained HTML (Python generator default).
- **Local monorepo helper:** `node scripts/generate-artifact.mjs` (uses `cads-mcp` validation).
- **Experimental:** `cads-runtime.module.js` for multi-file React hosts if local imports work.
