# Changesets

Write a `.changeset/<kebab-slug>.md` after publishable package changes (prefer that over interactive `pnpm changeset`). Linked packages `@moshebari/cads-variables` and `@moshebari/cads-react` version together.

Merging a **Version packages** PR on `main` runs `pnpm release` (`changeset publish`) to **npmjs.org**. Pushing `main` without a changeset does not publish.

Agent workflow: [`.cursor/skills/cads-release/SKILL.md`](../.cursor/skills/cads-release/SKILL.md). Prototype consumers `npm i @moshebari/cads-react @moshebari/cads-variables` — see the root README.
