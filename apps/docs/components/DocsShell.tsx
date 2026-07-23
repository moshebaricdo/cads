"use client";

import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";
import { usePathname } from "next/navigation";
import { Button, SegmentedButton, TextInput } from "@codeai/cads-react";
import { cadsManifest } from "@codeai/cads-react/manifest";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DocsNavItem, DocsNavSection } from "@/components/DocsNavItem";
import {
  COMPONENT_SECTIONS,
  FOUNDATIONS_NAV,
  RESOURCES_NAV,
  componentHref,
  type ComponentSectionId,
} from "@/lib/nav";

/** Collapsed by default; the section containing the current page auto-opens. */
const DEFAULT_OPEN: Record<ComponentSectionId, boolean> = {
  actions: false,
  inputs: false,
  navigation: false,
  messaging: false,
  overlays: false,
};

const DARK_STORAGE_KEY = "cads-docs-dark";
const SIDEBAR_STORAGE_KEY = "cads-docs-sidebar-collapsed";
const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 50;
const TOPBAR_HEIGHT = 48;
const MOBILE_MQ = "(max-width: 760px)";

function normalizePath(path: string | null): string {
  if (!path) return "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

function readSidebarCollapsed(): boolean {
  try {
    return window.sessionStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = normalizePath(usePathname());
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState(DEFAULT_OPEN);
  /** Desktop collapsed preference. Null until session storage is read. */
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  /** Mobile overlay drawer — independent of the desktop preference. */
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathnameRef = useRef(pathname);
  const isCanvas =
    pathname.startsWith("/fixtures") || pathname.startsWith("/prototype");

  const componentsByExport = useMemo(
    () => new Map(cadsManifest.components.map((c) => [c.exportName, c] as const)),
    [],
  );

  const query = search.trim().toLowerCase();
  const sidebarCollapsed = collapsed ?? false;
  const drawerOpen = isMobile && mobileDrawerOpen;
  // Mobile never uses collapsed chrome — drawer is always full labels when open.
  const chromeCollapsed = isMobile ? false : sidebarCollapsed;

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

    setCollapsed(readSidebarCollapsed());

    const mq = window.matchMedia(MOBILE_MQ);
    let wasMobile = mq.matches;
    function syncViewport() {
      const mobile = mq.matches;
      // Close the drawer only when crossing into the mobile breakpoint.
      if (mobile && !wasMobile) {
        setMobileDrawerOpen(false);
      }
      wasMobile = mobile;
      setIsMobile(mobile);
    }
    syncViewport();
    mq.addEventListener("change", syncViewport);
    return () => mq.removeEventListener("change", syncViewport);
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

  // Persist only after hydration so the default never overwrites the session preference.
  useEffect(() => {
    if (isCanvas || collapsed === null) return;
    try {
      window.sessionStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
  }, [collapsed, isCanvas]);

  useEffect(() => {
    if (!activeSectionId || chromeCollapsed) return;
    setOpenSections((prev) =>
      prev[activeSectionId] ? prev : { ...prev, [activeSectionId]: true },
    );
  }, [activeSectionId, chromeCollapsed]);

  useEffect(() => {
    if (!query || isMobile || collapsed !== true) return;
    // Wait for session preference before expanding so we don't clobber hydration.
    setCollapsed(false);
  }, [query, isMobile, collapsed]);

  // Close the mobile drawer after navigation (not on mobile breakpoint entry).
  useEffect(() => {
    if (isMobile && pathnameRef.current !== pathname) {
      setMobileDrawerOpen(false);
    }
    pathnameRef.current = pathname;
  }, [pathname, isMobile]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileDrawerOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  if (isCanvas) {
    return <>{children}</>;
  }

  function toggleSection(id: ComponentSectionId) {
    if (chromeCollapsed) {
      setCollapsed(false);
      setOpenSections((prev) => ({ ...prev, [id]: true }));
      return;
    }
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleDesktopSidebar() {
    setCollapsed((value) => !(value ?? false));
    queueMicrotask(() => {
      (document.activeElement as HTMLElement | null)?.blur?.();
    });
  }

  function toggleMobileDrawer() {
    setMobileDrawerOpen((value) => !value);
  }

  function closeDrawer() {
    setMobileDrawerOpen(false);
  }

  const brandLogos = (
    <>
      <Image
        src={withBasePath("/codeai-logo.svg")}
        alt={chromeCollapsed && !isMobile ? "" : "CodeAI"}
        width={128}
        height={22}
        className="docs-topbar-logo docs-topbar-logo--full"
        priority
      />
      <Image
        src={withBasePath("/codeai-mark-light.png")}
        alt=""
        width={24}
        height={24}
        className="docs-topbar-logo docs-topbar-logo--mark docs-topbar-logo--mark-light"
        aria-hidden
        priority
      />
      <Image
        src={withBasePath("/codeai-mark-dark.png")}
        alt=""
        width={24}
        height={24}
        className="docs-topbar-logo docs-topbar-logo--mark docs-topbar-logo--mark-dark"
        aria-hidden
        priority
      />
    </>
  );

  function matchesQuery(label: string) {
    return !query || label.toLowerCase().includes(query);
  }

  function renderSearchField() {
    return (
      <TextInput
        size="extraSmall"
        color="secondary"
        startIconName="magnifying-glass"
        placeholder="Search CADS"
        showHelper={false}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        aria-label="Search CADS"
      />
    );
  }

  const resources = RESOURCES_NAV.filter((item) => matchesQuery(item.label));
  const foundations = FOUNDATIONS_NAV.filter((item) => matchesQuery(item.label));
  // Mobile: no in-flow rail. Desktop: honor collapsed preference.
  const layoutSidebarWidth = isMobile
    ? 0
    : sidebarCollapsed
      ? SIDEBAR_COLLAPSED_WIDTH
      : SIDEBAR_WIDTH;
  const shellStyle = {
    "--docs-sidebar-width": `${layoutSidebarWidth}px`,
    "--docs-sidebar-drawer-width": `${SIDEBAR_WIDTH}px`,
    "--docs-topbar-height": `${TOPBAR_HEIGHT}px`,
  } as CSSProperties;

  return (
    <div
      className="docs-shell"
      data-sidebar={
        isMobile ? "expanded" : sidebarCollapsed ? "collapsed" : "expanded"
      }
      data-mobile={isMobile ? "true" : undefined}
      data-mobile-drawer={drawerOpen ? "open" : undefined}
      style={shellStyle}
    >
      <header className="docs-topbar">
        <div className="docs-mobile-menu">
          <Button
            variant="outlined"
            color="secondary"
            size="extraSmall"
            iconOnly
            startIconName="table-layout"
            aria-label={drawerOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={drawerOpen}
            aria-controls="docs-sidebar"
            onClick={toggleMobileDrawer}
          />
        </div>

        <div className="docs-topbar-brand-cell">
          {chromeCollapsed ? (
            <div className="docs-topbar-brand" aria-hidden>
              {brandLogos}
            </div>
          ) : (
            <Link
              href="/"
              className="docs-topbar-brand"
              aria-label="CodeAI home"
            >
              {brandLogos}
            </Link>
          )}

          <div className="docs-sidebar-toggle">
            <Button
              variant="outlined"
              color="secondary"
              size="extraSmall"
              iconOnly
              startIconName={
                chromeCollapsed
                  ? "arrow-right-from-line"
                  : "arrow-left-from-line"
              }
              aria-label={
                chromeCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              aria-expanded={!chromeCollapsed}
              onClick={toggleDesktopSidebar}
            />
          </div>
        </div>

        <div className="docs-topbar-main">
          <Link
            href="/"
            className="docs-topbar-brand docs-topbar-brand--mobile"
            aria-label="CodeAI home"
          >
            <Image
              src={withBasePath("/codeai-mark-light.png")}
              alt=""
              width={24}
              height={24}
              className="docs-topbar-logo docs-topbar-logo--favicon docs-topbar-logo--mark-light"
              priority
            />
            <Image
              src={withBasePath("/codeai-mark-dark.png")}
              alt=""
              width={24}
              height={24}
              className="docs-topbar-logo docs-topbar-logo--favicon docs-topbar-logo--mark-dark"
              priority
            />
          </Link>

          <div className="docs-search docs-search--topbar">
            {renderSearchField()}
          </div>

          <div className="docs-topbar-right">
            <SegmentedButton
              size="extraSmall"
              iconOnly
              value={dark ? "dark" : "light"}
              onChange={(value) => setDark(value === "dark")}
              aria-label="Color mode"
              options={[
                { value: "light", label: "Light", iconName: "sun" },
                { value: "dark", label: "Dark", iconName: "moon" },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="docs-body">
        {drawerOpen ? (
          <button
            type="button"
            className="docs-sidebar-scrim"
            aria-label="Close navigation"
            onClick={closeDrawer}
          />
        ) : null}

        <div className="docs-sidebar-slot">
          <aside
            id="docs-sidebar"
            className="docs-sidebar"
            style={{
              top: TOPBAR_HEIGHT,
              height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
            }}
          >
            <div className="docs-sidebar-scroll">
              {resources.length > 0 ? (
                <DocsNavSection label="Resources" collapsed={chromeCollapsed}>
                  {resources.map((item) => (
                    <DocsNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      iconName={item.iconName}
                      active={pathname === item.href}
                      collapsed={chromeCollapsed}
                    />
                  ))}
                </DocsNavSection>
              ) : null}

              {foundations.length > 0 ? (
                <DocsNavSection label="Foundations" collapsed={chromeCollapsed}>
                  {foundations.map((item) => (
                    <DocsNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      iconName={item.iconName}
                      active={pathname === item.href}
                      collapsed={chromeCollapsed}
                    />
                  ))}
                </DocsNavSection>
              ) : null}

              <DocsNavSection label="Components" collapsed={chromeCollapsed}>
                {COMPONENT_SECTIONS.map((section) => {
                  const open =
                    !chromeCollapsed &&
                    (openSections[section.id] || Boolean(query));
                  const visibleItems = section.items.filter((item) => {
                    if (
                      !matchesQuery(item.label) &&
                      !matchesQuery(section.label)
                    ) {
                      return false;
                    }
                    return componentsByExport.has(item.exportName);
                  });

                  if (
                    query &&
                    visibleItems.length === 0 &&
                    !matchesQuery(section.label)
                  ) {
                    return null;
                  }

                  const panelId = `nav-section-${section.id}`;
                  const sectionActive = activeSectionId === section.id;
                  return (
                    <div key={section.id} className="docs-nav-group">
                      <DocsNavItem
                        kind="group"
                        label={section.label}
                        iconName={section.iconName}
                        active={sectionActive}
                        expanded={open}
                        collapsed={chromeCollapsed}
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

            <div className="docs-sidebar-search">{renderSearchField()}</div>
          </aside>
        </div>

        <main className="docs-main">
          <div className="docs-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
