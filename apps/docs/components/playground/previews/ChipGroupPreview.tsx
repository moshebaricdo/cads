"use client";

import { useState } from "react";
import { Chip, FieldWrapper } from "@moshebaricdo/cads-react";
import type { FaIconName } from "@moshebaricdo/cads-react/icons";

const OPTIONS = [
  { slot: "art", value: "art", label: "Art" },
  { slot: "music", value: "music", label: "Music" },
  { slot: "sports", value: "sports", label: "Sports" },
  { slot: "coding", value: "coding", label: "Coding" },
] as const;

const GROUP_GAP = {
  large: "0.5rem",
  medium: "0.375rem",
  small: "0.375rem",
  extraSmall: "0.25rem",
} as const;

type OptionEdit = {
  label?: string;
  value?: string;
  disabled?: boolean;
  startIconName?: string;
  endIconName?: string;
};

export default function ChipGroupPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  const [selected, setSelected] = useState<string[]>(["art"]);
  const size = (v.size as keyof typeof GROUP_GAP | undefined) ?? "medium";
  const color = v.color as "primary" | "secondary" | undefined;
  const labelStyle = v.labelStyle as "thick" | "thin" | undefined;
  const groupDisabled = Boolean(v.disabled);
  const helperIconName = String(v.helperIconName ?? "").trim();
  const edits =
    v.optionEdits && typeof v.optionEdits === "object"
      ? (v.optionEdits as Record<string, OptionEdit>)
      : {};

  const options = OPTIONS.map((opt) => {
    const edit = edits[opt.slot] ?? {};
    const startIconName = String(edit.startIconName ?? "").trim();
    const endIconName = String(edit.endIconName ?? "").trim();
    return {
      slot: opt.slot,
      value: String(edit.value ?? opt.value),
      label: String(edit.label ?? opt.label),
      disabled: Boolean(edit.disabled) || groupDisabled,
      startIconName: (startIconName || undefined) as FaIconName | undefined,
      endIconName: (endIconName || undefined) as FaIconName | undefined,
    };
  });

  const toggle = (slot: string) => {
    setSelected((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
    );
  };

  return (
    <FieldWrapper
      size={size}
      label={v.label == null || v.label === "" ? "Interests" : String(v.label)}
      helperText={
        v.helperText == null || v.helperText === ""
          ? "Select all that apply"
          : String(v.helperText)
      }
      helperIconName={
        (helperIconName || undefined) as FaIconName | undefined
      }
      showHelper={v.showHelper == null ? true : Boolean(v.showHelper)}
      disabled={groupDisabled}
    >
      <div
        role="group"
        aria-label={v["aria-label"] ? String(v["aria-label"]) : undefined}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: GROUP_GAP[size] ?? GROUP_GAP.medium,
        }}
      >
        {options.map((opt) => (
          <div
            key={opt.slot}
            data-cads-nested-item=""
            data-nested-target="chipItem"
            data-value={opt.slot}
            data-label={opt.label}
          >
            <Chip
              size={size}
              color={color}
              labelStyle={labelStyle}
              label={opt.label}
              selected={selected.includes(opt.slot)}
              startIconName={opt.startIconName}
              endIconName={opt.endIconName}
              disabled={opt.disabled}
              onClick={() => toggle(opt.slot)}
            />
          </div>
        ))}
      </div>
    </FieldWrapper>
  );
}
