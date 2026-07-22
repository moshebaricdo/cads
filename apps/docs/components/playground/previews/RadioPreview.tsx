"use client";

import { useState } from "react";
import { Radio } from "@codeai/cads-react/components/Radio";

const OPTIONS = [
  { slot: "a", value: "a", label: "Option A" },
  { slot: "b", value: "b", label: "Option B" },
  { slot: "c", value: "c", label: "Option C" },
] as const;

type OptionEdit = {
  label?: string;
  value?: string;
  disabled?: boolean;
};

export default function RadioPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const [selected, setSelected] = useState("a");
  const size = v.size as
    | "large"
    | "medium"
    | "small"
    | "extraSmall"
    | undefined;
  const labelStyle = v.labelStyle as "thin" | "thick" | undefined;
  const groupDisabled = Boolean(v.disabled);
  const edits =
    v.optionEdits && typeof v.optionEdits === "object"
      ? (v.optionEdits as Record<string, OptionEdit>)
      : {};

  const options = OPTIONS.map((opt) => {
    const edit = edits[opt.slot] ?? {};
    return {
      slot: opt.slot,
      value: String(edit.value ?? opt.value),
      label: String(edit.label ?? opt.label),
      disabled: Boolean(edit.disabled) || groupDisabled,
    };
  });

  return (
    <div
      role="radiogroup"
      aria-label={String(v["aria-label"] || "Options")}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--space-xs, 8px)",
      }}
    >
      {options.map((opt) => (
        <div
          key={opt.slot}
          data-cads-nested-item=""
          data-nested-target="radioItem"
          data-value={opt.slot}
        >
          <Radio
            name="cads-docs-radio"
            value={opt.value}
            label={opt.label}
            size={size}
            labelStyle={labelStyle}
            checked={selected === opt.slot || selected === opt.value}
            disabled={opt.disabled}
            onChange={() => setSelected(opt.slot)}
          />
        </div>
      ))}
    </div>
  );
}
