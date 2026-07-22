# Portable skill host smoke tests

Internal-only — the ZIP embeds Font Awesome Pro fonts.

## Prerequisites

- Built skill ZIP from `pnpm artifact:build`
- Host with Agent Skills / code-execution support

## Shared prompt

> Create a CADS teacher onboarding form as a self-contained HTML prototype. Use school name, role dropdown, and a primary Continue button.

## Pass signals (all hosts)

| Signal | Pass | Fail |
|---|---|---|
| Skill loads | Mentions CADS / uses skill files | Invents Tailwind / raw HTML controls |
| Output | Self-contained HTML with inlined runtime | Asks to `npm install @codeai/cads-react` |
| Components | TextInput / Dropdown / Button + FA icons | Placeholder lookalikes |
| Edit loop | Updates JSON and regenerates HTML | Hand-patches minified runtime |

## Host-specific checks

### Claude

1. Customize → Skills → Upload `dist/cads-prototyping.zip` → enable.
2. Run the shared prompt.
3. Confirm an artifact (or downloadable HTML) renders interactive CADS controls.
4. Publish **organization-only** and open as another org member if available.
5. Ask for a dark-mode + Cancel button edit; expect full HTML regeneration.

### ChatGPT (Skills / Work mode)

1. Upload the same ZIP as an Agent Skill (or attach in Work mode if that is the available surface).
2. Run the shared prompt.
3. Accept either an inline preview or a downloadable `.html` file.

### Gemini Spark

1. Spark → Skills → Upload the ZIP (or `SKILL.md` + folder).
2. Run the shared prompt in a Spark task that can use the skill.
3. Note: Spark is subscription / region limited; if Skills are unavailable, stop and record the blocker — do not fall back to package imports.

### Cursor

1. Drop the ZIP into an Agent chat and ask Cursor to install the skill.
2. Ask Agent for the shared prompt.
3. Confirm it writes a self-contained HTML file using the bundled runtime, not npm packages.

## Record

Note host, plan tier, artifact/file size, and pass/fail in `docs/STATUS.md` when a full E2E pass lands.
