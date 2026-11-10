"use client";

import {
  ProgressWidget,
  type ProgressWidgetLevel,
} from "@moshebari/cads-react";
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

const base = {
  levelLabel: LABEL,
  levels: LEVELS,
  activeLevelIndex: 5,
  actionLabel: "Continue",
};

export const cases: FixtureCase[] = [
  {
    id: "progress-widget-gt992-saved-light",
    mode: "light",
    viewport: { width: 620, height: 80 },
    render: () => <ProgressWidget {...base} breakpoint="desktop" />,
  },
  {
    id: "progress-widget-gt992-unsaved-light",
    mode: "light",
    viewport: { width: 620, height: 80 },
    render: () => (
      <ProgressWidget {...base} breakpoint="desktop" saveStatus="unsaved" />
    ),
  },
  {
    id: "progress-widget-gt992-truncate-light",
    mode: "light",
    viewport: { width: 480, height: 80 },
    render: () => (
      <div style={{ width: 416 }}>
        <ProgressWidget
          {...base}
          breakpoint="desktop"
          style={{ width: "100%" }}
        />
      </div>
    ),
  },
  {
    id: "progress-widget-lt992-saved-light",
    mode: "light",
    viewport: { width: 400, height: 80 },
    render: () => (
      <ProgressWidget {...base} breakpoint="tablet" style={{ width: 303 }} />
    ),
  },
  {
    id: "progress-widget-lt992-unsaved-light",
    mode: "light",
    viewport: { width: 400, height: 80 },
    render: () => (
      <ProgressWidget
        {...base}
        breakpoint="tablet"
        saveStatus="unsaved"
        style={{ width: 303 }}
      />
    ),
  },
  {
    id: "progress-widget-lt992-no-left-action-light",
    mode: "light",
    viewport: { width: 400, height: 80 },
    render: () => (
      <ProgressWidget
        {...base}
        breakpoint="tablet"
        hasLeftAction={false}
        style={{ width: 303 }}
      />
    ),
  },
  {
    id: "progress-widget-lt768-light",
    mode: "light",
    viewport: { width: 260, height: 80 },
    render: () => <ProgressWidget {...base} breakpoint="mobile" />,
  },
  {
    id: "progress-widget-template-light",
    mode: "light",
    viewport: { width: 400, height: 80 },
    render: () => (
      <ProgressWidget
        version="template"
        startSlot={<span style={{ width: 111 }} />}
        middleSlot={<span style={{ width: 111 }} />}
        endSlot={<span style={{ width: 111 }} />}
      />
    ),
  },
  {
    id: "progress-widget-no-action-light",
    mode: "light",
    viewport: { width: 620, height: 80 },
    render: () => (
      <ProgressWidget {...base} breakpoint="desktop" hasAction={false} />
    ),
  },
  {
    id: "progress-widget-gt992-saved-dark",
    mode: "dark",
    viewport: { width: 620, height: 80 },
    render: () => <ProgressWidget {...base} breakpoint="desktop" />,
  },
  {
    id: "progress-widget-lt768-dark",
    mode: "dark",
    viewport: { width: 260, height: 80 },
    render: () => <ProgressWidget {...base} breakpoint="mobile" />,
  },
];
