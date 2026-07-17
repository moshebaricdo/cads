# Manual Claude organization-sharing test

## Prerequisites

- Team/Enterprise Claude with **Code execution and file creation** enabled
- Ability to upload custom skills (or an Owner who can provision them)
- Built skill ZIP from `pnpm artifact:build`

## Steps

1. **Upload** `tooling/cads-artifact/dist/cads-prototyping.zip`  
   Claude → Customize → Skills → Upload a skill → enable **cads-prototyping**.

2. **Create** in a new chat:  
   > Create a CADS teacher onboarding form as a shareable artifact. Use school name, role dropdown, and a primary Continue button.

3. **Confirm** the artifact:
   - Renders CADS TextInput / Dropdown / Button (not raw HTML controls)
   - Uses brand purple/primary CTA styling
   - Icons from FA Pro appear (graduation-cap / arrow-right)

4. **Publish organization-only** (not public).

5. **Open as another org member**:
   - Artifact loads without npm/GitHub access
   - Controls remain interactive

6. **Customize + edit**:
   - Click Customize
   - Ask: `Switch to dark theme and add a secondary Cancel text button`
   - Claude should regenerate from updated JSON, not rewrite the runtime bundle

## Pass / fail signals

| Signal | Pass | Fail |
|---|---|---|
| Claude loads the skill | Mentions CADS / uses skill files | Invents Tailwind/MUI raw UI |
| Artifact opens for teammate | Renders immediately | Blank / missing fonts / import errors |
| Edit loop | Regenerates HTML from JSON | Hand-patches minified runtime |
| Size | Opens despite multi-MB payload | Host rejects or truncates artifact |

Record measured artifact size from `dist/SIZE.json` and the generated HTML file size in STATUS when done.
