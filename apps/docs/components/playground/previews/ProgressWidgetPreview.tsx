"use client";

import { ProgressWidget } from "@moshebaricdo/cads-react";
import type {
  ProgressWidgetBreakpoint,
  ProgressWidgetSaveStatus,
} from "@moshebaricdo/cads-react";
import {
  DEMO_PROGRESS_ACTIVE_INDEX,
  DEMO_PROGRESS_LEVELS,
} from "./shared";

export default function ProgressWidgetPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const breakpoint = (v.breakpoint ?? "auto") as ProgressWidgetBreakpoint;
  return (
    <ProgressWidget
      levelLabel={String(
        v.levelLabel ?? "Lesson 3: Introduction to Online Puzzles",
      )}
      levels={DEMO_PROGRESS_LEVELS}
      activeLevelIndex={
        typeof v.activeLevelIndex === "number"
          ? v.activeLevelIndex
          : DEMO_PROGRESS_ACTIVE_INDEX
      }
      breakpoint={breakpoint}
      saveStatus={v.saveStatus as ProgressWidgetSaveStatus | undefined}
      saveStatusLabel={
        typeof v.saveStatusLabel === "string" && v.saveStatusLabel
          ? v.saveStatusLabel
          : undefined
      }
      hasAction={v.hasAction === undefined ? true : Boolean(v.hasAction)}
      actionLabel={String(v.actionLabel ?? "I finished")}
      hasLeftAction={
        v.hasLeftAction === undefined ? true : Boolean(v.hasLeftAction)
      }
      style={
        breakpoint === "tabletMobile" ? { width: 360 } : undefined
      }
    />
  );
}
