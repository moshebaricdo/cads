"use client";

import { useEffect, useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

/**
 * Rare fallback (e.g. FaIcon). Loads react-live + CADS scope only when mounted.
 */
export function LivePlayground({ code }: { code: string }) {
  const [scope, setScope] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      import("@codeai/cads-react"),
      import("@codeai/cads-react/icons"),
    ]).then(([cads, icons]) => {
      if (!alive) return;
      setScope({
        Button: cads.Button,
        SegmentedButton: cads.SegmentedButton,
        IconToggle: cads.IconToggle,
        FieldWrapper: cads.FieldWrapper,
        TextInput: cads.TextInput,
        TextField: cads.TextField,
        Dropdown: cads.Dropdown,
        Checkbox: cads.Checkbox,
        Radio: cads.Radio,
        Toggle: cads.Toggle,
        Slider: cads.Slider,
        Chip: cads.Chip,
        ChipGroup: cads.ChipGroup,
        Alert: cads.Alert,
        Toast: cads.Toast,
        NotificationBanner: cads.NotificationBanner,
        Tag: cads.Tag,
        Tooltip: cads.Tooltip,
        Popover: cads.Popover,
        Drawer: cads.Drawer,
        Dialog: cads.Dialog,
        Modal: cads.Modal,
        FaIcon: icons.FaIcon,
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!scope) {
    return <div style={{ minHeight: 80 }} aria-hidden />;
  }

  return (
    <LiveProvider code={code} scope={scope} noInline={false}>
      <div
        style={{
          border: "1px solid var(--border-neutral-primary)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 24,
            background: "var(--background-neutral-primary)",
            minHeight: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <LivePreview />
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border-neutral-primary)",
            background: "var(--background-neutral-secondary)",
          }}
        >
          <LiveEditor
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              minHeight: 100,
              padding: 12,
            }}
          />
        </div>
        <LiveError
          style={{
            color: "var(--text-error-primary)",
            padding: 12,
            fontSize: 13,
            margin: 0,
            background: "var(--background-error-light)",
          }}
        />
      </div>
    </LiveProvider>
  );
}
