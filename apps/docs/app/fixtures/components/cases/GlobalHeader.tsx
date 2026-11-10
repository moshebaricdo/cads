"use client";

import {
  GlobalHeader,
  ProgressWidget,
  type GlobalHeaderBreakpoint,
  type GlobalHeaderState,
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

const WIDGET_PROPS = {
  levelLabel: "Lesson 3: Introduction to Online Puzzles",
  levels: LEVELS,
  activeLevelIndex: 5,
  actionLabel: "Continue",
};

/** Figma frame widths per breakpoint symbol. */
const WIDTH: Record<Exclude<GlobalHeaderBreakpoint, "auto" | "tabletMobile">, number> = {
  desktop: 1440,
  tablet: 992,
  smallTablet: 768,
  mobile: 576,
};

const BP_ID: Record<keyof typeof WIDTH, string> = {
  desktop: "gt992",
  tablet: "lt992",
  smallTablet: "lt768",
  mobile: "lt576",
};

const STATE_ID: Record<GlobalHeaderState, string> = {
  template: "template",
  standaloneProject: "standalone",
  nonLabLesson: "non-lab",
  labLevel: "lab",
  teacherDashboard: "teacher",
  studentDashboard: "student",
  tutorPlus: "tutor",
};

const templateSlots = {
  startContent: (
    <span
      style={{
        color: "var(--text-neutral-white-fixed)",
        fontSize: "var(--text-body-xs)",
        fontWeight: 600,
        lineHeight: "18px",
      }}
    >
      Custom start content
    </span>
  ),
  centerContent: (
    <ProgressWidget
      version="template"
      startSlot={<span style={{ width: 111 }} />}
      middleSlot={<span style={{ width: 111 }} />}
      endSlot={<span style={{ width: 111 }} />}
    />
  ),
};

const header = (
  state: GlobalHeaderState,
  breakpoint: keyof typeof WIDTH,
  mode: "light" | "dark" = "light",
): FixtureCase => ({
  id: `global-header-${STATE_ID[state]}-${BP_ID[breakpoint]}-${mode}`,
  mode,
  viewport: { width: WIDTH[breakpoint], height: 80 },
  render: () => (
    <GlobalHeader
      state={state}
      breakpoint={breakpoint}
      progressWidgetProps={WIDGET_PROPS}
      {...(state === "template" ? templateSlots : {})}
    />
  ),
});

const STATES: GlobalHeaderState[] = [
  "template",
  "standaloneProject",
  "nonLabLesson",
  "labLevel",
  "teacherDashboard",
  "studentDashboard",
  "tutorPlus",
];

export const cases: FixtureCase[] = [
  ...(Object.keys(WIDTH) as (keyof typeof WIDTH)[]).flatMap((bp) =>
    STATES.map((state) => header(state, bp)),
  ),
  header("labLevel", "desktop", "dark"),
  header("labLevel", "mobile", "dark"),
];
