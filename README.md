# CodeAI Design System

The CodeAI Design System (CADS) is a collection of design primitives and components that power our signed-in product experience.

Design lives in [Figma](https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-). This repo is an interactive documentation and prototyping resource for the design system. It aims to maintain 1:1 parity with Figma as the source of truth. These components are built entirely on top of MUI React components. This is **not** the production component library used on the CodeAI platform and is not available for import as such.

**Docs:** [https://moshebaricdo.github.io/cads/](https://moshebaricdo.github.io/cads/)

## Docs

### Getting started

- **Overview** — What CADS is and where to get started.
- **For Agents** _(experimental)_ — Info and download option for the portable skill that packages the CADS Docs runtime for fully standalone prototyping in any major AI tool.

### Foundations

- **Color** — Primitives for core brand colors, semantics for how they apply in product.
- **Typography** — Space Grotesk for display, Geist for body, Google Sans Code for mono.
- **Shape** — Radius, elevation, spacing, and z-index/stacking.
- **Motion** _(experimental)_ — Micro-interaction recipes built on shared duration, easing, spring, and scale ladders.

### Components

Reusable UI building blocks, grouped by type (Actions, Inputs, Navigation, Messaging, Overlays), with a playground/inspector, props sheets, and usage notes.

## Components

Status reflects whether a matching component has shipped in the [production Storybook](https://code-dot-org.github.io/code-dot-org/component-library-storybook/). “Not in production” means it’s available here and in Figma but hasn’t landed in the production library yet. With the transition from DSCO to CADS, nearly every component here and in Figma differs in some way from what is currently in production.

| Component | Group | Status |
| --- | --- | --- |
| Button | Actions | In production |
| Segmented Button | Actions | In production |
| Icon Toggle | Actions | Not in production |
| Close Button | Actions | In production |
| Field Wrapper | Inputs | In production |
| Text Input | Inputs | In production |
| Dropdown | Inputs | In production |
| Checkbox | Inputs | In production |
| Radio Button | Inputs | In production |
| Toggle | Inputs | In production |
| Slider | Inputs | In production |
| Chips | Inputs | In production |
| Links | Navigation | In production |
| Breadcrumbs | Navigation | In production |
| Tabs | Navigation | In production |
| Pagination | Navigation | Not in production |
| Alert | Messaging | In production |
| Toast | Messaging | In production |
| Notification Banner | Messaging | In production |
| Tag | Messaging | In production |
| Icon Tooltip | Messaging | Not in production |
| Tooltip | Overlays | In production |
| Popover | Overlays | In production |
| Drawer | Overlays | Not in production |
| Dialog | Overlays | In production |
| Modal | Overlays | In production |

## Experiments

### Motion

Micro-interaction recipes (Press, Surface, Indicator) built from a shared duration, easing, and spring ladder. Off by default across docs.

Docs: [`/variables/core`](https://moshebaricdo.github.io/cads/variables/core)

### Portable skill

Self-contained Agent Skills ZIP with the real CADS runtime — prototype without a monorepo checkout.

Docs: [`/ai`](https://moshebaricdo.github.io/cads/ai)

## Working in this repo

For contributors and agents, start with [`AGENTS.md`](AGENTS.md). Current priorities live in [`docs/STATUS.md`](docs/STATUS.md).

This README’s component table and experiments list are generated — run `pnpm generate:readme` after changing docs nav, component Storybook links, or [`docs/experiments.json`](docs/experiments.json). Docs builds regenerate it automatically.
