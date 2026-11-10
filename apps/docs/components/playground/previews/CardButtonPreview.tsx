"use client";

import { CardButton } from "@moshebari/cads-react";
import { FaIcon, type FaIconName } from "@moshebari/cads-react/icons";

/** Demo stand-in for a product section avatar (startContent slot). */
function SectionAvatar({ size }: { size: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--background-neutral-primary-inverse)",
        color: "var(--text-neutral-primary-inverse)",
      }}
    >
      <FaIcon name="ghost" fontSize={`${size / 2}px`} />
    </span>
  );
}

export default function CardButtonPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const layout = (v.layout as "horizontal" | "vertical" | undefined) ??
    "horizontal";
  const startIconName = v.hasStartContent
    ? ""
    : String(v.startIconName ?? "").trim();
  const endIconName = String(v.endIconName ?? "").trim();
  const description = String(v.description ?? "").trim();
  const startIconColor = String(v.startIconColor ?? "").trim();
  return (
    <div style={{ width: v.fullWidth ? "100%" : undefined, maxWidth: "100%" }}>
      <CardButton
        layout={layout}
        size={v.size as "medium" | "small" | undefined}
        title={String(v.title ?? "") || "Card button title"}
        description={description || undefined}
        startIconName={(startIconName || undefined) as FaIconName | undefined}
        startIconColor={startIconColor || undefined}
        startContent={
          v.hasStartContent ? (
            <SectionAvatar size={v.size === "small" ? 32 : 48} />
          ) : undefined
        }
        endIconName={
          layout === "horizontal"
            ? ((endIconName || undefined) as FaIconName | undefined)
            : undefined
        }
        selected={v.selected ? true : undefined}
        fullWidth={Boolean(v.fullWidth)}
        disabled={Boolean(v.disabled)}
      />
    </div>
  );
}
