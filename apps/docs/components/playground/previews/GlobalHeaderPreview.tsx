"use client";

import { GlobalHeader, ProgressWidget } from "@moshebari/cads-react";
import type {
  GlobalHeaderBreakpoint,
  GlobalHeaderState,
} from "@moshebari/cads-react";
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
  const isTemplate = v.state === "template";
  return (
    <GlobalHeader
      startContent={
        isTemplate ? (
          <span
            style={{
              color: "var(--text-neutral-white-fixed)",
              fontSize: "var(--text-body-xs)",
              fontWeight: 600,
            }}
          >
            Custom start content
          </span>
        ) : undefined
      }
      centerContent={
        isTemplate ? (
          <ProgressWidget
            version="template"
            startSlot={<span style={{ width: 80 }} />}
            middleSlot={<span style={{ width: 80 }} />}
            endSlot={<span style={{ width: 80 }} />}
          />
        ) : undefined
      }
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
        actionLabel: "Continue",
        levels: DEMO_PROGRESS_LEVELS,
        activeLevelIndex: DEMO_PROGRESS_ACTIVE_INDEX,
      }}
    />
  );
}
