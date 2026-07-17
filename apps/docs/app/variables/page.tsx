import Link from "next/link";

export default function VariablesIndexPage() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--text-heading-lg)",
        }}
      >
        Variables
      </h1>
      <p style={{ color: "var(--text-neutral-secondary)" }}>
        CADS design variables are generated from the Figma file into{" "}
        <code>@codeai/cads-variables</code>. Import{" "}
        <code>@codeai/cads-variables/variables.css</code> once at the app root.
        Components consume semantic color custom properties (e.g.{" "}
        <code>--background-brand-primary</code>) directly — no{" "}
        <code>--ds-</code> prefix.
      </p>
      <ul>
        <li>
          <Link href="/variables/color">Color</Link> — primitives + semantic
          roles (light/dark)
        </li>
        <li>
          <Link href="/variables/typography">Typography</Link> — type scale and
          families
        </li>
        <li>
          <Link href="/variables/spacing">Spacing &amp; shape</Link> — space,
          radii, elevation
        </li>
      </ul>
      <h2 style={{ fontSize: "var(--text-heading-xs)" }}>Selected vs brand</h2>
      <p style={{ fontSize: "var(--text-body-sm)" }}>
        Use <strong>brand</strong> tokens for primary actions, CTAs, and links.
        Use <strong>selected</strong> tokens for filled selected chrome
        (segmented controls, checked checkboxes, selected menu items). Do not
        paint selected surfaces with brand fills.
      </p>
    </div>
  );
}
