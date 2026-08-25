---
name: cads-release
description: >-
  Cut and publish @moshebaricdo/cads-react and @moshebaricdo/cads-variables
  via Changesets to GitHub Packages. Use when the user asks to release,
  publish, bump versions, cut a Version PR, or when publishable packages
  changed without a changeset.
---

# CADS package release

Pushing `main` does **not** publish. Registry versions move only when a
**Version packages** PR is merged.

```text
changeset on main → Release workflow opens/updates Version PR
                 → merge that PR → pnpm release → GitHub Packages
```

Published packages (linked; always version together):

- `@moshebaricdo/cads-react`
- `@moshebaricdo/cads-variables`

Ignored (never a changeset): docs, sandbox, Figma plugins, figma-sync, MCP,
artifact. See `.changeset/config.json`.

Do not run interactive `pnpm changeset`. Do not run `pnpm release` locally
unless CI cannot publish and the user explicitly asks.

## Diagnose first

In parallel:

1. Current versions: `packages/react/package.json` and `packages/variables/package.json`
2. Git tags: `@moshebaricdo/cads-react@*`
3. Commits since the last version commit (`chore: version packages`)
4. Pending `.changeset/*.md` (not README / config)
5. Open **Version packages** PR (`changeset-release/main`)

Typical “lots of main commits, no new package”:

| Cause | What to do |
|---|---|
| No changeset on `main` | Add `.changeset/<slug>.md` and merge to `main` |
| Version PR open, unmerged | Changelog review, then merge it (that **is** the release) |
| Feature landed after Version PR last updated | Add a changeset for it; Release workflow refreshes the PR |
| Release workflow failed before `changesets/action` | Fix `pnpm build` / generate on `main` |

Last successful registry cut: **0.1.1** (`cads-react`; `cads-variables` stayed **0.1.0** until the next linked bump).

## Write a changeset

`.changeset/<kebab-slug>.md` — no random hash:

```markdown
---
"@moshebaricdo/cads-react": patch
---

One sentence of user-facing change.
```

List only the package that changed. Linked partners bump together on the
Version PR.

| Bump | When |
|---|---|
| **patch** | Fixes and additive API (default in this repo) |
| **minor** | New published component |
| **major** | Breaking public API |

Skip for docs-only / tooling-only / ignored packages.

Commit with the feature, or as `chore: add changeset for …`.

## Cut a release (agent)

1. Fast-forward `main`. Confirm unpublished `cads-react` / `cads-variables` work.
2. Add missing changesets so the Version PR changelog matches what will ship.
3. Push those changesets to `main` (user must allow push). CI updates or
   opens [Version packages](https://github.com/moshebaricdo/cads/pulls?q=is%3Apr+head%3Achangeset-release%2Fmain).
4. Read the PR body. Expected next versions and notes should match the
   changesets.
5. Merge the Version PR (not squash if the repo prefers merge commits —
   either is fine). CI runs `pnpm release` (`changeset publish`) with
   `NODE_AUTH_TOKEN` = `GITHUB_TOKEN`.
6. Confirm tags `@moshebaricdo/cads-react@x.y.z` and
   `@moshebaricdo/cads-variables@x.y.z`, and that package.json on `main`
   matches.
7. Tell consumers: GitHub Packages `@moshebaricdo:registry=https://npm.pkg.github.com`
   + `NODE_AUTH_TOKEN` (`read:packages`). Local CADS iteration can stay on
   `file:../cads/packages/*`.

If `gh` is not authenticated, stop after preparing changesets. Give the
Version PR URL and ask the user to merge it (or run `gh auth login`).

## Workflow

`.github/workflows/release.yml` on push to `main`: install →
`pnpm generate:variables` → `pnpm build` → `changesets/action@v1`
(`version: pnpm version-packages`, `publish: pnpm release`).

Needs `contents: write`, `packages: write`, `pull-requests: write`.
)
