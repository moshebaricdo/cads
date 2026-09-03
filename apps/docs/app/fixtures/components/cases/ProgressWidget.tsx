"use client";

import {
  ProgressWidget,
  type ProgressWidgetLevel,
} from "@moshebaricdo/cads-react";
import type { FixtureCase } from "./shared";

const LEVELS: ProgressWidgetLevel[] = [
  { status: "completed" },
  { levelType: "panelLevel", status: "completed" },
  { status: "completed" },
  { status: "completed", isAssessment: true },
  { status: "completed" },
  { status: "inProgress" },
  { status: "notStarted" },
  { status: "notStarted", isAssessment: true },
  { levelType: "lessonExtras" },
];

const LABEL = "Lesson 3: Introduction to Online Puzzles";

export const cases: FixtureCase[] = [
  {
    id: "progress-widget-desktop-saved-light",
    mode: "light",
    viewport: { width: 620, height: 80 },
    render: () => (
      <ProgressWidget
        levelLabel={LABEL}
        levels={LEVELS}
        activeLevelIndex={5}
        breakpoint="desktop"
      />
    ),
  },
  {
    id: "progress-widget-desktop-offline-light",
    mode: "light",
    viewport: { width: 620, height: 80 },
    render: () => (
      <ProgressWidget
        levelLabel={LABEL}
        levels={LEVELS}
        activeLevelIndex={5}
        breakpoint="desktop"
        saveStatus="offline"
      />
    ),
  },
  {
    id: "progress-widget-desktop-truncate-light",
    mode: "light",
    viewport: { width: 480, height: 80 },
    render: () => (
      <div style={{ width: 416 }}>
        <ProgressWidget
          levelLabel={LABEL}
          levels={LEVELS}
          activeLevelIndex={5}
          breakpoint="desktop"
          style={{ width: "100%" }}
        />
      </div>
    ),
  },
  {
    id: "progress-widget-tablet-mobile-light",
    mode: "light",
    viewport: { width: 400, height: 80 },
    render: () => (
      <ProgressWidget
        levelLabel={LABEL}
        levels={LEVELS}
        activeLevelIndex={5}
        breakpoint="tabletMobile"
        style={{ width: 328 }}
      />
    ),
  },
  {
    id: "progress-widget-no-action-light",
    mode: "light",
    viewport: { width: 620, height: 80 },
    render: () => (
      <ProgressWidget
        levelLabel={LABEL}
        levels={LEVELS}
        activeLevelIndex={5}
        breakpoint="desktop"
        hasAction={false}
      />
    ),
  },
  {
    id: "progress-widget-desktop-saved-dark",
    mode: "dark",
    viewport: { width: 620, height: 80 },
    render: () => (
      <ProgressWidget
        levelLabel={LABEL}
        levels={LEVELS}
        activeLevelIndex={5}
        breakpoint="desktop"
      />
    ),
  },
];
