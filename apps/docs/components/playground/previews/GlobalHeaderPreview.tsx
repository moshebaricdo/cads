"use client";

import { GlobalHeader } from "@moshebaricdo/cads-react";
import type {
  GlobalHeaderBreakpoint,
  GlobalHeaderState,
} from "@moshebaricdo/cads-react";
import {
  DEMO_PROGRESS_ACTIVE_INDEX,
  DEMO_PROGRESS_LEVELS,
} from "./shared";

export default function GlobalHeaderPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
    <GlobalHeader
      state={v.state as GlobalHeaderState | undefined}
      breakpoint={v.breakpoint as GlobalHeaderBreakpoint | undefined}
      username={String(v.username ?? "Username")}
      projectTitle={String(v.projectTitle ?? "Untitled Project")}
      projectSaveStatusText={String(
        v.projectSaveStatusText ?? "Saved a few seconds ago",
      )}
      tutorLabel={String(v.tutorLabel ?? "Tutor Challenge")}
      progressWidgetProps={{
        levelLabel: "Lesson 3: Introduction to Online Puzzles",
        levels: DEMO_PROGRESS_LEVELS,
        activeLevelIndex: DEMO_PROGRESS_ACTIVE_INDEX,
      }}
    />
  );
}
