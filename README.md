# CodeAI Design System

The CodeAI Design System (CADS) is a collection of design primitives and components that power our signed-in product experience.

Design lives in [Figma](https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-). This repo is the implementation that stays with it — variables, React components, and the docs site.

**Docs:** [https://moshebaricdo.github.io/cads/](https://moshebaricdo.github.io/cads/)

## Docs

### Getting started

- **Overview** — What CADS is and where to go next.
- **For Agents** — Portable skill and how to prototype with CADS from an LLM.

### Foundations

- **Color** — Primitives for core brand colors, semantics for how they apply in product.
- **Typography** — Space Grotesk for display, Geist for body, Google Sans Code for mono.
- **Shape** — Radius, elevation, spacing, and stacking.
- **Motion** _(experimental)_ — Micro-interaction recipes on a shared duration and easing ladder.

### Components

Reusable UI building blocks, grouped the same way as Figma (Actions, Inputs, Navigation, Messaging, Overlays). Each page has a playground, props, and usage notes.

## Components

Status reflects whether a matching component has shipped in the [production Storybook](https://code-dot-org.github.io/code-dot-org/component-library-storybook/). “Not in production” means it’s available here (and usually in Figma) but hasn’t landed in that library yet.

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

Work in this repo that isn’t a settled production standard yet — safe to explore, expect change.

### Motion

Micro-interaction recipes (Press, Surface, Indicator) built from a shared duration, easing, and spring ladder. Opt in with `CadsProvider experimentalMotion` — off by default.

Docs: [`/variables/core`](https://moshebaricdo.github.io/cads/variables/core)

### Portable prototyping skill

A self-contained Agent Skills ZIP with the real CADS runtime and FA fonts inlined. Install it in Claude, ChatGPT, Gemini Spark, or Cursor to prototype without a monorepo checkout.

Docs: [`/ai`](https://moshebaricdo.github.io/cads/ai)

### Local MCP

Stdio MCP proof of concept: catalog search, constrained prototype schema, and validation against `cadsManifest`. Renders through the docs `/prototype` route.

In repo: [`tooling/cads-mcp`](tooling/cads-mcp)

## Working in this repo

For contributors and agents, start with [`AGENTS.md`](AGENTS.md). Current priorities live in [`docs/STATUS.md`](docs/STATUS.md).

This README’s component table and experiments list are generated — run `pnpm generate:readme` after changing docs nav, component Storybook links, or [`docs/experiments.json`](docs/experiments.json). Docs builds regenerate it automatically.
