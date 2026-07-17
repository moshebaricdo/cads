# CADS Claude artifact kit

Lowest-lift path for **organization-only** Claude prototypes that embed the real
`@codeai/cads-react` runtime — no CADS hosting, MCP connector, or npm install in
the viewer.

## What you get

| Output | Path |
|---|---|
| Browser IIFE runtime | `dist/cads-runtime.js` + `.css` (FA fonts inlined) |
| Sample HTML artifact | `dist/artifacts/teacher-onboarding.html` |
| Uploadable Claude skill ZIP | `dist/cads-prototyping.zip` |

## Build

```bash
pnpm --filter @codeai/cads-artifact build:all
# or from repo root:
pnpm artifact:build
```

## Manual Claude test

1. Upload `tooling/cads-artifact/dist/cads-prototyping.zip` via **Customize → Skills**.
2. Enable **cads-prototyping**.
3. Prompt: `Create a CADS teacher onboarding form as an artifact.`
4. Publish **organization-only**.
5. Open as another org member → Customize → ask for an edit (e.g. dark mode).

## Size notes

FA Pro fonts are embedded as data URLs for shareability. Expect multi‑MB
artifacts — that is an intentional experiment outcome to measure against Claude
artifact limits.

## Formats

- **Reliable:** self-contained HTML (generator default).
- **Experimental:** `cads-runtime.module.js` for multi-file React artifacts if
  the host supports local imports.
