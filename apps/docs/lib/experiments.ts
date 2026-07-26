/**
 * Docs experiment catalog — mirrors [`docs/experiments.json`](../../../docs/experiments.json).
 * Controllable rows wire to session/URL flags; others link to docs pages.
 */

export type DocsExperiment = {
  id: string;
  name: string;
  /** Compact control-center subline (≈3–4 words). */
  description: string;
  /** Longer blurb for README / catalog. */
  summary: string;
  docs?: string;
  path?: string;
  /** When true, show a runtime Toggle in the Experiments control center. */
  controllable?: boolean;
};

export const DOCS_EXPERIMENTS: DocsExperiment[] = [
  {
    id: "motion",
    name: "Motion",
    description: "Micro-interaction recipes",
    docs: "/variables/core",
    summary:
      "Micro-interaction recipes (Press, Surface, Indicator) built from a shared duration, easing, and spring ladder. Off by default across docs.",
    controllable: true,
  },
  {
    id: "portable-skill",
    name: "Portable skill",
    description: "Agent Skills ZIP",
    docs: "/ai",
    summary:
      "Self-contained Agent Skills ZIP with the real CADS runtime — prototype without a monorepo checkout.",
  },
];
