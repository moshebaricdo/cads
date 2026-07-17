"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cadsManifest } from "@codeai/cads-react/manifest";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/variables", label: "Variables" },
  { href: "/variables/color", label: "Color" },
  { href: "/variables/typography", label: "Typography" },
  { href: "/variables/spacing", label: "Spacing & shape" },
  { href: "/prototypes", label: "Prototype gallery" },
  { href: "/llms.txt", label: "llms.txt" },
];

/** Figma page / section order (file DGekOeToRVifvFAhfqpeC1). */
const COMPONENT_SECTIONS = [
  {
    id: "actions",
    label: "Actions",
    items: [
      { exportName: "Button", label: "Button" },
      { exportName: "SegmentedButton", label: "Segmented Button" },
      { exportName: "IconToggle", label: "Icon Toggle Button" },
      { exportName: "CloseIconButton", label: "Close Icon Button" },
    ],
  },
  {
    id: "inputs",
    label: "Inputs",
    items: [
      { exportName: "FieldWrapper", label: "Field Wrapper" },
      { exportName: "TextInput", label: "Text Input" },
      { exportName: "Dropdown", label: "Dropdown" },
      { exportName: "Checkbox", label: "Checkbox" },
      { exportName: "Radio", label: "Radio Button" },
      { exportName: "Toggle", label: "Toggle" },
      { exportName: "Slider", label: "Slider" },
      { exportName: "Chip", label: "Chip" },
      { exportName: "ChipGroup", label: "Chip Group" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    items: [
      { exportName: "Link", label: "Link" },
      { exportName: "Breadcrumbs", label: "Breadcrumbs" },
      { exportName: "Tabs", label: "Tabs" },
    ],
  },
  {
    id: "messaging",
    label: "Messaging",
    items: [
      { exportName: "Alert", label: "Alert" },
      { exportName: "Toast", label: "Toast" },
      { exportName: "NotificationBanner", label: "Notification Banner" },
      { exportName: "Tag", label: "Tag" },
    ],
  },
  {
    id: "overlays",
    label: "Overlays",
    items: [
      { exportName: "Tooltip", label: "Tooltip" },
      { exportName: "Popover", label: "Popover" },
      { exportName: "Drawer", label: "Drawer" },
      { exportName: "Dialog", label: "Dialog" },
      { exportName: "Modal", label: "Modal" },
    ],
  },
] as const;

type SectionId = (typeof COMPONENT_SECTIONS)[number]["id"];

const DEFAULT_OPEN: Record<SectionId, boolean> = {
  actions: true,
  inputs: true,
  navigation: true,
  messaging: true,
  overlays: true,
};

function componentHref(name: string) {
  return `/components/${name.toLowerCase()}`;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden
      style={{
        flexShrink: 0,
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 120ms ease",
      }}
    >
      <path
        d="M4.25 2.5L7.75 6l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN);
  const isCanvas =
    pathname?.startsWith("/fixtures") || pathname?.startsWith("/prototype");

  const componentsByExport = useMemo(() => {
    const map = new Map(
      cadsManifest.components.map((c) => [c.exportName, c] as const),
    );
    return map;
  }, []);

  const activeSectionId = useMemo(() => {
    for (const section of COMPONENT_SECTIONS) {
      for (const item of section.items) {
        const component = componentsByExport.get(item.exportName);
        if (!component) continue;
        if (pathname === componentHref(component.name)) return section.id;
      }
    }
    return null;
  }, [componentsByExport, pathname]);

  useEffect(() => {
    if (isCanvas) return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark, isCanvas]);

  useEffect(() => {
    if (!activeSectionId) return;
    setOpenSections((prev) =>
      prev[activeSectionId] ? prev : { ...prev, [activeSectionId]: true },
    );
  }, [activeSectionId]);

  if (isCanvas) {
    return <>{children}</>;
  }

  function toggleSection(id: SectionId) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        minHeight: "100vh",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid var(--border-neutral-primary)",
          background: "var(--background-neutral-secondary)",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 500,
              fontSize: "var(--text-heading-xs)",
            }}
          >
            CADS
          </div>
          <div
            style={{
              color: "var(--text-neutral-secondary)",
              fontSize: "var(--text-body-xs)",
            }}
          >
            CodeAI Design System
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "6px 10px",
                borderRadius: "var(--radius-sm)",
                background:
                  pathname === item.href
                    ? "var(--background-selected-primary)"
                    : "transparent",
                color:
                  pathname === item.href
                    ? "var(--text-selected-primary)"
                    : "var(--text-neutral-primary)",
                textDecoration: "none",
                fontSize: "var(--text-body-sm)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          style={{
            marginTop: 28,
            marginBottom: 8,
            fontSize: "var(--text-body-xs)",
            color: "var(--text-neutral-secondary)",
            letterSpacing: "var(--tracking-overline)",
            textTransform: "uppercase",
          }}
        >
          Components
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {COMPONENT_SECTIONS.map((section) => {
            const open = openSections[section.id];
            const panelId = `nav-section-${section.id}`;
            return (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={open}
                  aria-controls={panelId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    width: "100%",
                    padding: "4px 6px",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    background: "transparent",
                    color: "var(--text-neutral-primary)",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-body-sm)",
                    fontWeight: 600,
                    textAlign: "left",
                  }}
                >
                  <Chevron open={open} />
                  {section.label}
                </button>
                {open ? (
                  <div
                    id={panelId}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      marginTop: 2,
                      paddingLeft: 8,
                    }}
                  >
                    {section.items.map((item) => {
                      const component = componentsByExport.get(item.exportName);
                      if (!component) return null;
                      const href = componentHref(component.name);
                      const active = pathname === href;
                      return (
                        <Link
                          key={item.exportName}
                          href={href}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "var(--radius-sm)",
                            background: active
                              ? "var(--background-selected-primary)"
                              : "transparent",
                            color: active
                              ? "var(--text-selected-primary)"
                              : "var(--text-neutral-primary)",
                            textDecoration: "none",
                            fontSize: "var(--text-body-sm)",
                          }}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          style={{
            marginTop: 32,
            width: "100%",
            height: "var(--control-height-s)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-neutral-primary)",
            background: "var(--background-neutral-primary)",
            color: "var(--text-neutral-primary)",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-xs)",
          }}
        >
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </aside>

      <main style={{ padding: "40px 48px", maxWidth: 960 }}>{children}</main>
    </div>
  );
}
