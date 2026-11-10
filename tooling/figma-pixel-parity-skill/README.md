# Figma pixel parity

Portable Cursor skill extracted from the CADS Figma↔code parity workflow. It is the closed loop that stops an agent from calling a component done after reading code or glancing at a screenshot.

Copy this folder into the production repo:

```text
.cursor/skills/figma-pixel-parity/
```

Then copy `repo.template.md` to `repo.md` in that same folder and fill in the library’s Figma file, source paths, fixture URL, and verify commands. Commit `repo.md` with the skill so every agent uses the same bindings.

Leave this copy out of the CADS repo’s `.cursor/skills/`. CADS already runs the stricter `cads-parity-qa` skill.
