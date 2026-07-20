import Link from "next/link";
import { PageHeader } from "@/components/docs-ui";

export default function PrototypesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Resources"
        title="Prototype gallery"
        lead={
          <>
            Designer-created prototypes built with{" "}
            <code>@codeai/cads-react</code> land here so engineers can inspect
            real component and prop usage — not screenshots alone.
          </>
        }
      />
      <div
        style={{
          padding: 24,
          borderRadius: "var(--radius-lg)",
          border: "1px dashed var(--border-neutral-primary)",
          background: "var(--background-neutral-secondary)",
        }}
      >
        <strong>Coming soon</strong>
        <p
          style={{
            marginBottom: 0,
            fontSize: "var(--text-body-sm)",
            lineHeight: "var(--leading-body-sm)",
            color: "var(--text-neutral-secondary)",
          }}
        >
          Publish a prototype by adding a page under{" "}
          <code>apps/docs/app/prototypes/</code> that imports CADS components
          and documents the Figma source frame. In the meantime, see the{" "}
          <Link href="/ai">AI setup</Link> page for the Claude artifact
          workflow — the fastest way to produce a shareable CADS prototype
          today.
        </p>
      </div>
    </div>
  );
}
