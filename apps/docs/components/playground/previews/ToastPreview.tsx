"use client";

import { useState } from "react";
import { Button, Toast, type ToastPlacement } from "@moshebaricdo/cads-react";
import type { FaIconName } from "@moshebaricdo/cads-react/icons";
import type { PreviewProps } from "./shared";

/**
 * Toast playground — trigger + snackbar host (`open` / `placement` / `offset`).
 * Surface enter/exit follows experimental motion when the docs flag is on.
 * Inspect mode shows the elevated surface inline (no trigger / portal).
 */
export default function ToastPreview({
  values,
  inspect = false,
}: PreviewProps) {
  const v = values;
  const [open, setOpen] = useState(false);
  const iconName = String(v.iconName ?? "").trim();
  const actionStart = String(v.actionStartIconName ?? "").trim();
  const actionEnd = String(v.actionEndIconName ?? "").trim();
  const resolvedIconName =
    v.hasIcon === false
      ? false
      : ((iconName || undefined) as FaIconName | undefined);
  const offsetRaw = Number(v.offset);
  const offset = Number.isFinite(offsetRaw) ? offsetRaw : 64;

  const toast = (
    <Toast
      open={inspect ? undefined : open}
      surfaceOnly={inspect || undefined}
      placement={
        (v.placement as ToastPlacement | undefined) ?? "bottomCenter"
      }
      offset={offset}
      sentiment={
        v.sentiment as
          | "primary"
          | "pink"
          | "success"
          | "error"
          | "warning"
          | "info"
          | "neutral"
          | undefined
      }
      iconName={resolvedIconName}
      hasAction={Boolean(v.hasAction)}
      actionLabel={String(v.actionLabel || "Button")}
      actionStartIconName={
        (actionStart || undefined) as FaIconName | undefined
      }
      actionEndIconName={(actionEnd || undefined) as FaIconName | undefined}
      isDismissible={v.isDismissible !== false}
      onClose={() => setOpen(false)}
    >
      {String(v.children ?? "This is a toast.")}
    </Toast>
  );

  if (inspect) return toast;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <Button size="medium" onClick={() => setOpen((prev) => !prev)}>
        {open ? "Hide toast" : "Show toast"}
      </Button>
      {toast}
    </div>
  );
}
