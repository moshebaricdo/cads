# Changesets

Run `pnpm changeset` after package changes to record a version bump. Linked packages `@moshebaricdo/cads-variables` and `@moshebaricdo/cads-react` version together.

Merging a Version PR on `main` runs `pnpm release` (`changeset publish`) to **GitHub Packages** (`https://npm.pkg.github.com`). Prototype consumers pin `@moshebaricdo/cads-*` — see the root README.
