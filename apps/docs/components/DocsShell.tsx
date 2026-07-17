"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cadsManifest } from "@codeai/cads-react/manifest";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/variables", label: "Variables" },
  { href: "/variables/color", label: "Color" },
  { href: "/variables/typography", label: "Typography" },
  { href: "/variables/spacing", label: "Spacing & shape" },
  { href: "/prototypes", label: "Prototype gallery" },
  { href: "/llms.txt", label: "llms.txt" },
];

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const isFixture = pathname?.startsWith("/fixtures") ?? false;

  useEffect(() => {
    if (isFixture) return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark, isFixture]);

  if (isFixture) {
    return <>{children}</>;
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

        <div style={{ marginTop: 28, marginBottom: 8, fontSize: "var(--text-body-xs)", color: "var(--text-neutral-secondary)", letterSpacing: "var(--tracking-overline)", textTransform: "uppercase" }}>
          Components
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {cadsManifest.components
            .filter((c) => c.exportName !== "FaIcon")
            .map((c) => {
              const href = `/components/${c.name.toLowerCase()}`;
              const active = pathname === href;
              return (
                <Link
                  key={c.name}
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
                  {c.name}
                </Link>
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
