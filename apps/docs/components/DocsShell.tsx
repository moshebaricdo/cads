"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, TextInput, Toggle } from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";
import { cadsManifest } from "@codeai/cads-react/manifest";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { DocsNavItem, DocsNavSection } from "@/components/DocsNavItem";
import {
  COMPONENT_SECTIONS,
  FOUNDATIONS_NAV,
  RESOURCES_NAV,
  componentHref,
  type ComponentSectionId,
} from "@/lib/nav";

const FIGMA_URL =
  "https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-";

const DEFAULT_OPEN: Record<ComponentSectionId, boolean> = {
  actions: true,
  inputs: true,
  navigation: true,
  messaging: false,
  overlays: false,
};

const DARK_STORAGE_KEY = "cads-docs-dark";
const SIDEBAR_WIDTH = 200;
const TOPBAR_HEIGHT = 48;

function normalizePath(path: string | null): string {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = normalizePath(usePathname());
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN);
  const isCanvas =
    pathname.startsWith("/fixtures") || pathname.startsWith("/prototype");
  const isExplore = pathname.startsWith("/explore");

  const componentsByExport = useMemo(
    () => new Map(cadsManifest.components.map((c) => [c.exportName, c] as const)),
    [],
  );

  const query = search.trim().toLowerCase();

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
    try {
      setDark(window.localStorage.getItem(DARK_STORAGE_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (isCanvas) return;
    document.documentElement.classList.toggle("dark", dark);
    try {
      window.localStorage.setItem(DARK_STORAGE_KEY, dark ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
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

  function toggleSection(id: ComponentSectionId) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function matchesQuery(label: string) {
    return !query || label.toLowerCase().includes(query);
  }

  const resources = RESOURCES_NAV.filter((item) => matchesQuery(item.label));
  const foundations = FOUNDATIONS_NAV.filter((item) => matchesQuery(item.label));

  return (
    <div className="docs-shell">
      <header className="docs-topbar" style={{ height: TOPBAR_HEIGHT }}>
        <div
          className="docs-topbar-brand-cell"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <Link href="/" className="docs-topbar-brand" aria-label="CodeAI home">
            <Image
              src="/codeai-logo.svg"
              alt="CodeAI"
              width={128}
              height={22}
              className="docs-topbar-logo"
              priority
            />
          </Link>
        </div>

        <div className="docs-topbar-main">
          <div className="docs-search">
            <FaIcon
              name="magnifying-glass"
              fontSize="12px"
              className="docs-search-icon"
            />
            <TextInput
              size="extraSmall"
              color="secondary"
              placeholder="Search CADS"
              showHelper={false}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search CADS"
              className="docs-search-field"
            />
          </div>

          <div className="docs-topbar-right">
            <Button
              href={FIGMA_URL}
              variant="outlined"
              color="secondary"
              size="extraSmall"
              aria-label="Open in Figma"
              className="docs-topbar-figma"
              {...({
                target: "_blank",
                rel: "noreferrer",
              } as Record<string, string>)}
            >
              <FaIcon name="figma" family="brands" fontSize="12px" />
            </Button>
            <span className="docs-topbar-divider" aria-hidden />
            <Toggle
              size="small"
              checked={dark}
              onChange={(_, next) => setDark(next)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            />
          </div>
        </div>
      </header>

      <div
        className="docs-body"
        style={{ gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr` }}
      >
        <aside
          className="docs-sidebar"
          style={{ top: TOPBAR_HEIGHT, height: `calc(100vh - ${TOPBAR_HEIGHT}px)` }}
        >
          <div className="docs-sidebar-scroll">
            {resources.length > 0 ? (
              <DocsNavSection label="Resources">
                {resources.map((item) => (
                  <DocsNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    iconName={item.iconName}
                    active={pathname === item.href}
                  />
                ))}
              </DocsNavSection>
            ) : null}

            {foundations.length > 0 ? (
              <DocsNavSection label="Foundations">
                {foundations.map((item) => (
                  <DocsNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    iconName={item.iconName}
                    active={pathname === item.href}
                  />
                ))}
              </DocsNavSection>
            ) : null}

            <DocsNavSection label="Components">
              {COMPONENT_SECTIONS.map((section) => {
                const open = openSections[section.id] || Boolean(query);
                const visibleItems = section.items.filter((item) => {
                  if (!matchesQuery(item.label) && !matchesQuery(section.label)) {
                    return false;
                  }
                  return componentsByExport.has(item.exportName);
                });

                if (query && visibleItems.length === 0 && !matchesQuery(section.label)) {
                  return null;
                }

                const panelId = `nav-section-${section.id}`;
                return (
                  <div key={section.id} className="docs-nav-group">
                    <DocsNavItem
                      kind="group"
                      label={section.label}
                      iconName={section.iconName}
                      expanded={open}
                      onClick={() => toggleSection(section.id)}
                    />
                    {open ? (
                      <div id={panelId} className="docs-nav-children">
                        {visibleItems.map((item) => {
                          const component = componentsByExport.get(
                            item.exportName,
                          );
                          if (!component) return null;
                          const href = componentHref(component.name);
                          return (
                            <DocsNavItem
                              key={item.exportName}
                              kind="child"
                              href={href}
                              label={item.label}
                              active={pathname === href}
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </DocsNavSection>
          </div>
        </aside>

        <main className={isExplore ? "docs-main docs-main--explore" : "docs-main"}>
          <div className="docs-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
