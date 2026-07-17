"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FixtureCase } from "./cases/shared";

const CASE_LOADERS: Record<string, () => Promise<{ cases: FixtureCase[] }>> = {
  CloseIconButton: () => import("./cases/CloseIconButton"),
  FieldWrapper: () => import("./cases/FieldWrapper"),
  TextInput: () => import("./cases/TextInput"),
  Dropdown: () => import("./cases/Dropdown"),
  Checkbox: () => import("./cases/Checkbox"),
  Radio: () => import("./cases/Radio"),
  Toggle: () => import("./cases/Toggle"),
  Slider: () => import("./cases/Slider"),
  Chip: () => import("./cases/Chip"),
  ChipGroup: () => import("./cases/ChipGroup"),
  Link: () => import("./cases/Link"),
  Breadcrumbs: () => import("./cases/Breadcrumbs"),
  Tabs: () => import("./cases/Tabs"),
  Alert: () => import("./cases/Alert"),
  Toast: () => import("./cases/Toast"),
  NotificationBanner: () => import("./cases/NotificationBanner"),
  Tag: () => import("./cases/Tag"),
  Tooltip: () => import("./cases/Tooltip"),
  Popover: () => import("./cases/Popover"),
  Drawer: () => import("./cases/Drawer"),
  Dialog: () => import("./cases/Dialog"),
  Modal: () => import("./cases/Modal"),
};

function FixtureBody() {
  const params = useSearchParams();
  const component = params.get("component") ?? "FieldWrapper";
  const caseId = params.get("case");
  const modeParam = params.get("mode") as "light" | "dark" | null;
  const subjectRef = useRef<HTMLDivElement>(null);
  const [cases, setCases] = useState<FixtureCase[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let alive = true;
    setCases(null);
    setLoadError(false);
    const loader = CASE_LOADERS[component];
    if (!loader) {
      setLoadError(true);
      return;
    }
    loader()
      .then((mod) => {
        if (alive) setCases(mod.cases);
      })
      .catch(() => {
        if (alive) setLoadError(true);
      });
    return () => {
      alive = false;
    };
  }, [component]);

  const selected = useMemo(() => {
    if (!cases?.length) return null;
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
      "input, textarea, button, a, [role='tab'], [role='link']",
    );
    if (!el) return;
    el.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );
    el.focus();
    el.classList.add("Mui-focusVisible");
  }, [selected]);

  useEffect(() => {
    const root = subjectRef.current;
    if (!root) return;
    delete root.dataset.cadsForcePseudo;
    if (selected?.state === "hover" || selected?.state === "press") {
      root.dataset.cadsForcePseudo = selected.state;
    }
  }, [selected]);

  if (loadError || (!cases && !CASE_LOADERS[component])) {
    return (
      <main data-cads-fixture-root="" style={{ padding: 24 }}>
        <p>
          Unknown fixture component: <code>{component}</code>
        </p>
      </main>
    );
  }

  if (!selected) {
    return (
      <main data-cads-fixture-root="" style={{ padding: 24 }}>
        Loading fixture…
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
        [data-cads-fixture-root] a:hover {
          text-decoration: none;
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
