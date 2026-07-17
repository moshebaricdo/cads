export default function PrototypesPage() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--text-heading-lg)",
        }}
      >
        Prototype gallery
      </h1>
      <p style={{ color: "var(--text-neutral-secondary)" }}>
        Designer-created prototypes built with{" "}
        <code>@codeai/cads-react</code> land here so engineers can inspect real
        component and prop usage — not screenshots alone.
      </p>
      <div
        style={{
          marginTop: 24,
          padding: 24,
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--border-neutral-primary)",
          background: "var(--background-neutral-secondary)",
        }}
      >
        <strong>Coming soon</strong>
        <p style={{ marginBottom: 0, fontSize: "var(--text-body-sm)" }}>
          Publish a prototype by adding a page under{" "}
          <code>apps/docs/app/prototypes/</code> that imports CADS components
          and documents the Figma source frame. The Lab2 sandbox{" "}
          <code>/design-system/cads</code> parity route is the first consumer
          bridge.
        </p>
      </div>
    </div>
  );
}
