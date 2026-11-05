"use client";

import { CardButton } from "@moshebari/cads-react";
import type { FixtureCase } from "./shared";
import { FaIcon } from "@moshebari/cads-react/icons";

/** 48px section-avatar stand-in for the startContent slot. */
function SectionAvatar() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "var(--background-neutral-primary-inverse)",
        color: "var(--text-neutral-primary-inverse)",
      }}
    >
      <FaIcon name="ghost" fontSize="24px" />
    </span>
  );
}

export const cases: FixtureCase[] = [
  {
    id: "cardbutton-h-medium-default-light",
    mode: "light",
    viewport: { width: 440, height: 160 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Card button title" startIconName="smile" endIconName="chevron-right" />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-description-light",
    mode: "light",
    viewport: { width: 440, height: 240 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="AIF Test" description="Lesson 1: Prompting AI" startIconName="fire" endIconName="chevron-right" />
      </div>
    ),
  },
  {
    id: "cardbutton-h-small-default-light",
    mode: "light",
    viewport: { width: 440, height: 160 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="small" title="View progress" startIconName="chart-line" endIconName="arrow-right" />
      </div>
    ),
  },
  {
    id: "cardbutton-v-medium-default-light",
    mode: "light",
    viewport: { width: 280, height: 240 },
    render: () => (
      <div style={{ width: 200 }}>
        <CardButton fullWidth layout="vertical" size="medium" title="Card button title" startIconName="smile" />
      </div>
    ),
  },
  {
    id: "cardbutton-v-small-description-light",
    mode: "light",
    viewport: { width: 280, height: 240 },
    render: () => (
      <div style={{ width: 200 }}>
        <CardButton fullWidth layout="vertical" size="small" title="Card button title" description="Supporting description text" startIconName="smile" />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-hover-light",
    mode: "light",
    state: "hover",
    viewport: { width: 440, height: 160 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Card button title" startIconName="smile" endIconName="chevron-right" />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-press-light",
    mode: "light",
    state: "press",
    viewport: { width: 440, height: 160 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Card button title" startIconName="smile" endIconName="chevron-right" />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-focus-light",
    mode: "light",
    state: "focus",
    viewport: { width: 440, height: 160 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Card button title" startIconName="smile" endIconName="chevron-right" />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-disabled-light",
    mode: "light",
    viewport: { width: 440, height: 160 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Card button title" startIconName="smile" endIconName="chevron-right" disabled />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-selected-light",
    mode: "light",
    viewport: { width: 440, height: 160 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Card button title" startIconName="smile" endIconName="chevron-right" selected />
      </div>
    ),
  },
  {
    id: "cardbutton-v-medium-selected-hover-light",
    mode: "light",
    state: "hover",
    viewport: { width: 280, height: 240 },
    render: () => (
      <div style={{ width: 200 }}>
        <CardButton fullWidth layout="vertical" size="medium" title="Card button title" startIconName="smile" selected />
      </div>
    ),
  },
  {
    id: "cardbutton-v-small-selected-disabled-light",
    mode: "light",
    viewport: { width: 280, height: 240 },
    render: () => (
      <div style={{ width: 200 }}>
        <CardButton fullWidth layout="vertical" size="small" title="Card button title" startIconName="smile" selected disabled />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-default-dark",
    mode: "dark",
    viewport: { width: 440, height: 160 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Card button title" startIconName="smile" endIconName="chevron-right" />
      </div>
    ),
  },
  {
    id: "cardbutton-v-medium-selected-dark",
    mode: "dark",
    viewport: { width: 280, height: 240 },
    render: () => (
      <div style={{ width: 200 }}>
        <CardButton fullWidth layout="vertical" size="medium" title="Text" startIconName="pen" selected />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-long-title-light",
    mode: "light",
    viewport: { width: 440, height: 240 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Help me turn my rough idea into a step-by-step project plan" startIconName="lightbulb" endIconName="chevron-right" />
      </div>
    ),
  },
  {
    id: "cardbutton-h-medium-hug-light",
    mode: "light",
    viewport: { width: 440, height: 160 },
    render: () => (
      <CardButton layout="horizontal" size="medium" title="Help me make a starter project" startIconName="wand-magic-sparkles" />
    ),
  },
  {
    id: "cardbutton-v-medium-hug-light",
    mode: "light",
    viewport: { width: 440, height: 240 },
    render: () => (
      <CardButton layout="vertical" size="medium" title="I want to practice" startIconName="dumbbell" />
    ),
  },
  {
    id: "cardbutton-h-medium-start-content-light",
    mode: "light",
    viewport: { width: 440, height: 200 },
    render: () => (
      <div style={{ width: 360 }}>
        <CardButton fullWidth layout="horizontal" size="medium" title="Test 4-8" description="Lesson 1: Welcome to Web Apps" startContent={<SectionAvatar />} endIconName="chevron-right" />
      </div>
    ),
  },
];
