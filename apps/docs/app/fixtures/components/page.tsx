"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  FieldWrapper,
  TextInput,
  Dropdown,
  type DropdownOption,
} from "@codeai/cads-react";
import type { FaIconName } from "@codeai/cads-react/icons";

interface FixtureCase {
  id: string;
  mode: "light" | "dark";
  state?: string;
  viewport: { width: number; height: number };
  render: () => React.ReactNode;
}

const ICON_OPTIONS: DropdownOption[] = [
  { value: "a", label: "Option A", iconName: "face-smile" as FaIconName },
  { value: "b", label: "Option B", iconName: "heart" as FaIconName },
  { value: "c", label: "Option C", iconName: "star" as FaIconName },
];

const ACTION_OPTIONS: DropdownOption[] = [
  { value: "edit", label: "Edit", iconName: "pen" as FaIconName },
  { value: "share", label: "Share", iconName: "share" as FaIconName },
  {
    value: "delete",
    label: "Delete",
    iconName: "trash" as FaIconName,
    destructive: true,
  },
];

const CASES: Record<string, FixtureCase[]> = {
  FieldWrapper: [
    {
      id: "field-wrapper-large-default-light",
      mode: "light",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="large"
          sentiment="default"
          label="Field label"
          helperText="Helper text"
          showHelper
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
    {
      id: "field-wrapper-medium-success-light",
      mode: "light",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="medium"
          sentiment="success"
          label="Field label"
          helperText="Helper text"
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
    {
      id: "field-wrapper-small-warning-light",
      mode: "light",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="small"
          sentiment="warning"
          label="Field label"
          helperText="Helper text"
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
    {
      id: "field-wrapper-xs-error-light",
      mode: "light",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="extraSmall"
          sentiment="error"
          label="Field label"
          helperText="Helper text"
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
    {
      id: "field-wrapper-large-default-dark",
      mode: "dark",
      viewport: { width: 320, height: 120 },
      render: () => (
        <FieldWrapper
          size="large"
          sentiment="default"
          label="Field label"
          helperText="Helper text"
          showHelper
        >
          <TextInput placeholder="Placeholder" />
        </FieldWrapper>
      ),
    },
  ],
  TextInput: [
    {
      id: "text-input-large-field-primary-default-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 160 },
      render: () => (
        <TextInput
          size="large"
          color="primary"
          label="Field label"
          helperText="Helper text"
          placeholder="Placeholder"
        />
      ),
    },
    {
      id: "text-input-medium-area-secondary-filled-light",
      mode: "light",
      state: "default",
      viewport: { width: 360, height: 200 },
      render: () => (
        <TextInput
          size="medium"
          multiline
          color="secondary"
          label="Field label"
          defaultValue="Filled text"
          rows={3}
        />
      ),
    },
    {
      id: "text-input-small-field-primary-focus-light",
      mode: "light",
      state: "focus",
      viewport: { width: 360, height: 140 },
      render: () => (
        <TextInput
          size="small"
          color="primary"
          label="Field label"
          placeholder="Placeholder"
          autoFocus
        />
      ),
    },
    {
      id: "text-input-large-field-error-light",
      mode: "light",
      state: "error",
      viewport: { width: 360, height: 160 },
      render: () => (
        <TextInput
          size="large"
          color="primary"
          label="Field label"
          defaultValue="Filled text"
          error
          sentiment="error"
          helperText="Helper text"
        />
      ),
    },
    {
      id: "text-input-medium-field-readonly-light",
      mode: "light",
      state: "readOnly",
      viewport: { width: 360, height: 140 },
      render: () => (
        <TextInput
          size="medium"
          color="primary"
          label="Field label"
          defaultValue="Filled text"
          readOnly
        />
      ),
    },
    {
      id: "text-input-xs-field-disabled-light",
      mode: "light",
      state: "disabled",
      viewport: { width: 360, height: 120 },
      render: () => (
        <TextInput
          size="extraSmall"
          color="primary"
          label="Field label"
          placeholder="Placeholder"
          disabled
        />
      ),
    },
    {
      id: "text-input-large-field-primary-default-dark",
      mode: "dark",
      state: "default",
      viewport: { width: 360, height: 160 },
      render: () => (
        <TextInput
          size="large"
          color="primary"
          label="Field label"
          helperText="Helper text"
          placeholder="Placeholder"
        />
      ),
    },
  ],
  Dropdown: [
    {
      id: "dropdown-large-input-icon-bottomleft-light",
      mode: "light",
      viewport: { width: 420, height: 360 },
      render: () => (
        <Dropdown
          role="input"
          size="large"
          menuType="icon"
          menuPlacement="bottomLeft"
          label="Field label"
          helperText="Helper text"
          defaultOpen
          options={ICON_OPTIONS}
          defaultValue="a"
        />
      ),
    },
    {
      id: "dropdown-medium-input-checklist-bottomright-light",
      mode: "light",
      viewport: { width: 420, height: 360 },
      render: () => (
        <Dropdown
          role="input"
          size="medium"
          menuType="checklist"
          menuPlacement="bottomRight"
          label="Field label"
          defaultOpen
          options={ICON_OPTIONS}
          defaultValue={["a", "b"]}
        />
      ),
    },
    {
      id: "dropdown-large-action-icon-bottomleft-light",
      mode: "light",
      viewport: { width: 360, height: 360 },
      render: () => (
        <Dropdown
          role="action"
          size="large"
          menuType="icon"
          menuPlacement="bottomLeft"
          label="Button"
          defaultOpen
          options={ACTION_OPTIONS}
        />
      ),
    },
    {
      id: "dropdown-small-input-icon-topleft-light",
      mode: "light",
      viewport: { width: 420, height: 360 },
      render: () => (
        <div style={{ paddingTop: 180 }}>
          <Dropdown
            role="input"
            size="small"
            menuType="icon"
            menuPlacement="topLeft"
            label="Field label"
            defaultOpen
            options={ICON_OPTIONS}
            defaultValue="b"
          />
        </div>
      ),
    },
    {
      id: "dropdown-xs-action-icon-topright-light",
      mode: "light",
      viewport: { width: 360, height: 320 },
      render: () => (
        <div
          style={{
            paddingTop: 180,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Dropdown
            role="action"
            size="extraSmall"
            menuType="icon"
            menuPlacement="topRight"
            label="Button"
            defaultOpen
            options={ACTION_OPTIONS}
          />
        </div>
      ),
    },
    {
      id: "dropdown-large-input-icon-bottomleft-dark",
      mode: "dark",
      viewport: { width: 420, height: 360 },
      render: () => (
        <Dropdown
          role="input"
          size="large"
          menuType="icon"
          menuPlacement="bottomLeft"
          label="Field label"
          defaultOpen
          options={ICON_OPTIONS}
          defaultValue="a"
        />
      ),
    },
  ],
};

function FixtureBody() {
  const params = useSearchParams();
  const component = params.get("component") ?? "TextInput";
  const caseId = params.get("case");
  const modeParam = params.get("mode") as "light" | "dark" | null;
  const subjectRef = useRef<HTMLDivElement>(null);

  const cases = CASES[component] ?? [];
  const selected = useMemo(() => {
    if (caseId) return cases.find((c) => c.id === caseId) ?? cases[0];
    return cases[0];
  }, [cases, caseId]);

  const mode = modeParam ?? selected?.mode ?? "light";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    document.documentElement.dataset.cadsFixture = "true";
    return () => {
      document.documentElement.classList.remove("dark");
      delete document.documentElement.dataset.cadsFixture;
    };
  }, [mode]);

  useEffect(() => {
    if (selected?.state !== "focus") return;
    const el = subjectRef.current?.querySelector<HTMLElement>(
      "input, textarea, button",
    );
    el?.focus();
  }, [selected]);

  if (!selected) {
    return (
      <main data-cads-fixture-root="" style={{ padding: 24 }}>
        <p>
          Unknown fixture component: <code>{component}</code>
        </p>
      </main>
    );
  }

  const { width, height } = selected.viewport;

  return (
    <main
      data-cads-fixture-root=""
      data-cads-fixture-component={component}
      data-cads-fixture-case={selected.id}
      data-cads-fixture-mode={mode}
      style={{
        margin: 0,
        minHeight: "100vh",
        background: "var(--background-neutral-primary)",
        color: "var(--text-neutral-primary)",
        fontFamily: "var(--font-body)",
        padding: 24,
      }}
    >
      <style>{`
        [data-cads-fixture-root] *,
        [data-cads-fixture-root] *::before,
        [data-cads-fixture-root] *::after {
          transition: none !important;
          animation: none !important;
        }
      `}</style>
      <div
        data-cads-capture-region=""
        data-testid="cads-capture-region"
        style={{
          width,
          height,
          boxSizing: "border-box",
          padding: 16,
          background: "var(--background-neutral-primary)",
          overflow: "visible",
          position: "relative",
        }}
      >
        <div
          ref={subjectRef}
          data-cads-fixture-subject=""
          data-testid="cads-fixture-subject"
          style={{ width: "100%" }}
        >
          {selected.render()}
        </div>
      </div>
    </main>
  );
}

export default function ComponentFixturesPage() {
  return (
    <Suspense
      fallback={
        <main data-cads-fixture-root="" style={{ padding: 24 }}>
          Loading fixture…
        </main>
      }
    >
      <FixtureBody />
    </Suspense>
  );
}
