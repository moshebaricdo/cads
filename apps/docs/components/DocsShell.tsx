"use client";

import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";
import { usePathname } from "next/navigation";
import { Button, SegmentedButton, TextInput } from "@moshebaricdo/cads-react";
import { cadsManifest } from "@moshebaricdo/cads-react/manifest";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import s from "./DocsShell.module.scss";
import {
  DocsNavChildren,
  DocsNavItem,
  DocsNavSection,
} from "@/components/DocsNavItem";
import nav from "./DocsNavItem.module.scss";
import { DocsNavScroller } from "@/components/DocsNavScroller";
import { ExperimentsControl } from "@/components/ExperimentsControl";
import {
  COMPONENT_SECTIONS,
  FOUNDATIONS_NAV,
  RESOURCES_NAV,
  navItemHref,
  type ComponentSectionId,
} from "@/lib/nav";
import {
  readDocsThemePreference,
  resolveDocsDark,
  writeDocsThemePreference,
  type DocsThemePreference,
} from "@/lib/docsTheme";

/** Collapsed by default; the section containing the current page auto-opens. */
const DEFAULT_OPEN: Record<ComponentSectionId, boolean> = {
  actions: false,
  inputs: false,
  navigation: false,
  messaging: false,
  overlays: false,
  ai: false,
  chrome: false,
};

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
  const [themePreference, setThemePreference] =
    useState<DocsThemePreference>("system");
  /** False until localStorage is read so we never overwrite a stored preference. */
  const [themeReady, setThemeReady] = useState(false);
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
        if (pathname === navItemHref(item, component.name)) return section.id;
      }
    }
    return null;
  }, [componentsByExport, pathname]);

  useEffect(() => {
    setThemePreference(readDocsThemePreference());
    setThemeReady(true);
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
    if (!themeReady || isCanvas) return;
    document.documentElement.classList.toggle(
      "dark",
      resolveDocsDark(themePreference),
    );
    writeDocsThemePreference(themePreference);
  }, [themePreference, themeReady, isCanvas]);

  useEffect(() => {
    if (!themeReady || isCanvas || themePreference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function syncSystemTheme() {
      document.documentElement.classList.toggle("dark", mq.matches);
    }
    syncSystemTheme();
    mq.addEventListener("change", syncSystemTheme);
    return () => mq.removeEventListener("change", syncSystemTheme);
  }, [themePreference, themeReady, isCanvas]);

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
        className={`${s.topbarLogo} ${s.topbarLogoFull}`}
        priority
      />
      <Image
        src={withBasePath("/codeai-mark-light.png")}
        alt=""
        width={24}
        height={24}
        className={`${s.topbarLogo} ${s.topbarLogoMark} ${s.topbarLogoMarkLight}`}
        aria-hidden
        priority
      />
      <Image
        src={withBasePath("/codeai-mark-dark.png")}
        alt=""
        width={24}
        height={24}
        className={`${s.topbarLogo} ${s.topbarLogoMark} ${s.topbarLogoMarkDark}`}
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
      className={`docs-shell ${s.shell}`}
      data-sidebar={
        isMobile ? "expanded" : sidebarCollapsed ? "collapsed" : "expanded"
      }
      data-mobile={isMobile ? "true" : undefined}
      data-mobile-drawer={drawerOpen ? "open" : undefined}
      style={shellStyle}
    >
      <header className={s.topbar}>
        <div className={s.mobileMenu}>
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

        <div className={s.topbarBrandCell}>
          {chromeCollapsed ? (
            <div className={s.topbarBrand} aria-hidden>
              {brandLogos}
            </div>
          ) : (
            <Link
              href="/"
              className={s.topbarBrand}
              aria-label="CodeAI home"
            >
              {brandLogos}
            </Link>
          )}

          <div className={s.sidebarToggle}>
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

        <div className={s.topbarMain}>
          <Link
            href="/"
            className={`${s.topbarBrand} ${s.topbarBrandMobile}`}
            aria-label="CodeAI home"
          >
            <Image
              src={withBasePath("/codeai-mark-light.png")}
              alt=""
              width={24}
              height={24}
              className={`${s.topbarLogo} ${s.topbarLogoFavicon} ${s.topbarLogoMarkLight}`}
              priority
            />
            <Image
              src={withBasePath("/codeai-mark-dark.png")}
              alt=""
              width={24}
              height={24}
              className={`${s.topbarLogo} ${s.topbarLogoFavicon} ${s.topbarLogoMarkDark}`}
              priority
            />
          </Link>

          <div className={`${s.search} ${s.searchTopbar}`}>
            {renderSearchField()}
          </div>

          <div className={s.topbarRight}>
            <ExperimentsControl />
            <SegmentedButton
              size="extraSmall"
              iconOnly
              value={themePreference}
              onChange={(value) =>
                setThemePreference(value as DocsThemePreference)
              }
              aria-label="Color mode"
              options={[
                { value: "light", label: "Light", iconName: "sun" },
                { value: "dark", label: "Dark", iconName: "moon" },
                {
                  value: "system",
                  label: "System",
                  iconName: "desktop",
                  tooltip: "System",
                },
              ]}
            />
          </div>
        </div>
      </header>

      <div className={s.body}>
        {drawerOpen ? (
          <button
            type="button"
            className={s.sidebarScrim}
            aria-label="Close navigation"
            onClick={closeDrawer}
          />
        ) : null}

        <div className={s.sidebarSlot}>
          <aside
            id="docs-sidebar"
            className={s.sidebar}
            style={{
              top: TOPBAR_HEIGHT,
              height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
            }}
          >
            <DocsNavScroller
              className={s.sidebarScroll}
              activeKey={`${pathname}|${chromeCollapsed}|${query}|${Object.entries(
                openSections,
              )
                .map(([id, open]) => (open ? id : ""))
                .join(",")}`}
            >
              {resources.length > 0 ? (
                <DocsNavSection
                  label="Resources"
                  sectionId="resources"
                  collapsed={chromeCollapsed}
                >
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
                <DocsNavSection
                  label="Foundations"
                  sectionId="foundations"
                  collapsed={chromeCollapsed}
                >
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

              <DocsNavSection
                label="Components"
                sectionId="components"
                collapsed={chromeCollapsed}
              >
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
                    <div
                      key={section.id}
                      className={nav.group}
                      data-open={open || undefined}
                    >
                      <DocsNavItem
                        kind="group"
                        label={section.label}
                        iconName={section.iconName}
                        active={sectionActive}
                        expanded={open}
                        collapsed={chromeCollapsed}
                        onClick={() => toggleSection(section.id)}
                      />
                      <DocsNavChildren id={panelId} open={open}>
                        {visibleItems.map((item) => {
                          const component = componentsByExport.get(
                            item.exportName,
                          );
                          if (!component) return null;
                          const href = navItemHref(item, component.name);
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
                      </DocsNavChildren>
                    </div>
                  );
                })}
              </DocsNavSection>
            </DocsNavScroller>

            <div className={s.sidebarSearch}>{renderSearchField()}</div>
          </aside>
        </div>

        <main className={`docs-main ${s.main}`}>
          <div className={`docs-main-inner ${s.mainInner}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
