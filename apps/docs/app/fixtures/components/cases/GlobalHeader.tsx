"use client";

import {
  GlobalHeader,
  type GlobalHeaderState,
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

const WIDGET_PROPS = {
  levelLabel: "Lesson 3: Introduction to Online Puzzles",
  levels: LEVELS,
  activeLevelIndex: 5,
};

const header = (
  id: string,
  state: GlobalHeaderState,
  breakpoint: "desktop" | "tabletMobile",
  mode: "light" | "dark" = "light",
): FixtureCase => ({
  id,
  mode,
  viewport: {
    width: breakpoint === "desktop" ? 1440 : 960,
    height: 80,
  },
  render: () => (
    <GlobalHeader
      state={state}
      breakpoint={breakpoint}
      progressWidgetProps={WIDGET_PROPS}
    />
  ),
});

export const cases: FixtureCase[] = [
  header("global-header-lab-desktop-light", "labLevel", "desktop"),
  header("global-header-lab-mobile-light", "labLevel", "tabletMobile"),
  header("global-header-non-lab-desktop-light", "nonLabLesson", "desktop"),
  header("global-header-non-lab-mobile-light", "nonLabLesson", "tabletMobile"),
  header(
    "global-header-standalone-desktop-light",
    "standaloneProject",
    "desktop",
  ),
  header(
    "global-header-standalone-mobile-light",
    "standaloneProject",
    "tabletMobile",
  ),
  header("global-header-teacher-desktop-light", "teacherDashboard", "desktop"),
  header(
    "global-header-teacher-mobile-light",
    "teacherDashboard",
    "tabletMobile",
  ),
  header("global-header-student-desktop-light", "studentDashboard", "desktop"),
  header("global-header-tutor-desktop-light", "tutorPlus", "desktop"),
  header("global-header-tutor-mobile-light", "tutorPlus", "tabletMobile"),
  header("global-header-lab-desktop-dark", "labLevel", "desktop", "dark"),
];
