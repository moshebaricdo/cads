# Changesets

Write a `.changeset/<kebab-slug>.md` after publishable package changes (prefer that over interactive `pnpm changeset`). Linked packages `@moshebaricdo/cads-variables` and `@moshebaricdo/cads-react` version together.

Merging a **Version packages** PR on `main` runs `pnpm release` (`changeset publish`) to **GitHub Packages** (`https://npm.pkg.github.com`). Pushing `main` without a changeset does not publish.

Agent workflow: [`.cursor/skills/cads-release/SKILL.md`](../.cursor/skills/cads-release/SKILL.md). Prototype consumers pin `@moshebaricdo/cads-*` — see the root README.
