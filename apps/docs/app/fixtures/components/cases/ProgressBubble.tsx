"use client";

import {
  ProgressBubble,
  type ProgressBubbleLevelType,
  type ProgressBubbleStatus,
} from "@moshebaricdo/cads-react";
import type { FixtureCase } from "./shared";

const bubble = (
  id: string,
  props: {
    levelType?: ProgressBubbleLevelType;
    status?: ProgressBubbleStatus;
    isActive?: boolean;
    isAssessment?: boolean;
    levelNumber?: string;
    disabled?: boolean;
  },
  mode: "light" | "dark" = "light",
  state?: string,
): FixtureCase => ({
  id,
  mode,
  state,
  viewport: { width: 96, height: 96 },
  render: () => (
    <ProgressBubble
      levelType={props.levelType}
      status={props.status}
      isActive={props.isActive}
      isAssessment={props.isAssessment}
      levelNumber={props.levelNumber}
      disabled={props.disabled}
      aria-label="Level"
    />
  ),
});

export const cases: FixtureCase[] = [
  bubble("progress-bubble-not-started-light", { status: "notStarted" }),
  bubble("progress-bubble-in-progress-light", { status: "inProgress" }),
  bubble("progress-bubble-passed-light", { status: "passed" }),
  bubble("progress-bubble-completed-light", { status: "completed" }),
  bubble("progress-bubble-error-light", { status: "error" }),
  bubble("progress-bubble-active-in-progress-light", {
    status: "inProgress",
    isActive: true,
    levelNumber: "6",
  }),
  bubble("progress-bubble-active-assessment-light", {
    status: "inProgress",
    isActive: true,
    isAssessment: true,
    levelNumber: "6",
  }),
  bubble("progress-bubble-completed-assessment-light", {
    status: "completed",
    isAssessment: true,
  }),
  bubble("progress-bubble-panel-completed-light", {
    levelType: "panelLevel",
    status: "completed",
  }),
  bubble("progress-bubble-panel-active-light", {
    levelType: "panelLevel",
    status: "inProgress",
    isActive: true,
    levelNumber: "4",
  }),
  bubble("progress-bubble-lesson-extras-light", { levelType: "lessonExtras" }),
  bubble("progress-bubble-tutor-plus-light", { levelType: "tutorPlus" }),
  bubble(
    "progress-bubble-disabled-light",
    { status: "completed", disabled: true },
    "light",
    "disabled",
  ),
  bubble("progress-bubble-completed-hover-light", { status: "completed" }, "light", "hover"),
  bubble("progress-bubble-in-progress-hover-light", { status: "inProgress" }, "light", "hover"),
  bubble("progress-bubble-not-started-hover-light", { status: "notStarted" }, "light", "hover"),
  bubble("progress-bubble-passed-hover-light", { status: "passed" }, "light", "hover"),
  bubble("progress-bubble-lesson-extras-hover-light", { levelType: "lessonExtras" }, "light", "hover"),
  bubble("progress-bubble-completed-press-light", { status: "completed" }, "light", "press"),
  bubble("progress-bubble-completed-dark", { status: "completed" }, "dark"),
];
