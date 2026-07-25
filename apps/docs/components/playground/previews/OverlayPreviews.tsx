"use client";

import { useState } from "react";
import { Button } from "@codeai/cads-react/components/Button";
import { Drawer } from "@codeai/cads-react/components/Drawer";
import { Dialog } from "@codeai/cads-react/components/Dialog";
import { Modal } from "@codeai/cads-react/components/Modal";
import type { FaIconName } from "@codeai/cads-react/icons";
import type { PreviewProps } from "./shared";

/** Bottom-sheet Drawer via portal — playground shows only a trigger. */
export function DrawerPlaygroundPreview({
  values: v,
  inspect = false,
}: PreviewProps) {
  const [open, setOpen] = useState(false);
  const type = (v.type as "textOnly" | "customContent") ?? "textOnly";
  const close = () => setOpen(false);

  const drawer = (
    <Drawer
      open={inspect ? false : open}
      onClose={close}
      onPrimaryAction={close}
      onSecondaryAction={close}
      type={type}
      title={v.title != null ? String(v.title) : undefined}
      description={
        v.description != null ? String(v.description) : undefined
      }
      hasDescription={v.hasDescription !== false}
      hasActionRow={v.hasActionRow !== false}
      primaryActionLabel={
        v.primaryActionLabel != null
          ? String(v.primaryActionLabel)
          : undefined
      }
      secondaryActionLabel={
        v.secondaryActionLabel != null
          ? String(v.secondaryActionLabel)
          : undefined
      }
      isDismissible={v.isDismissible !== false}
      surfaceOnly={inspect}
    >
      {type === "customContent" ? (
        <div style={{ height: 120, width: "100%" }} />
      ) : null}
    </Drawer>
  );

  if (inspect) {
    return <div style={{ width: "100%" }}>{drawer}</div>;
  }

  return (
    <>
      <Button size="medium" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      {drawer}
    </>
  );
}

/** Full-viewport Dialog via portal — playground shows only a trigger. */
export function DialogPlaygroundPreview({
  values: v,
  inspect = false,
}: PreviewProps) {
  const [open, setOpen] = useState(false);
  const type =
    (v.type as "default" | "iconTop" | "customContent") ?? "default";
  const close = () => setOpen(false);

  const dialog = (
    <Dialog
      open={inspect ? false : open}
      onClose={close}
      onPrimaryAction={close}
      onSecondaryAction={close}
      type={type}
      title={v.title != null ? String(v.title) : undefined}
      description={
        v.description != null ? String(v.description) : undefined
      }
      hasImage={Boolean(v.hasImage)}
      topIconName={
        type === "iconTop"
          ? ((String(v.topIconName || "smile").trim() ||
              "smile") as FaIconName)
          : undefined
      }
      hasSecondaryAction={v.hasSecondaryAction !== false}
      primaryActionLabel={
        v.primaryActionLabel != null
          ? String(v.primaryActionLabel)
          : undefined
      }
      secondaryActionLabel={
        v.secondaryActionLabel != null
          ? String(v.secondaryActionLabel)
          : undefined
      }
      isDismissable={v.isDismissable !== false}
      surfaceOnly={inspect}
    >
      {type === "customContent" ? (
        <div style={{ height: 130, width: "100%" }} />
      ) : null}
    </Dialog>
  );

  if (inspect) {
    return (
      <div style={{ width: "100%", maxWidth: 800, marginInline: "auto" }}>
        {dialog}
      </div>
    );
  }

  return (
    <>
      <Button size="medium" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      {dialog}
    </>
  );
}

/** Full-viewport Modal via portal — playground shows only a trigger. */
export function ModalPlaygroundPreview({
  values: v,
  inspect = false,
}: PreviewProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const modal = (
    <Modal
      open={inspect ? false : open}
      onClose={close}
      onPrimaryAction={close}
      onSecondaryAction={close}
      type={
        (v.type as "default" | "verticalImage" | "horizontalImage") ??
        "default"
      }
      title={v.title != null ? String(v.title) : undefined}
      body={v.body != null ? String(v.body) : undefined}
      hasSecondaryAction={v.hasSecondaryAction !== false}
      primaryActionLabel={
        v.primaryActionLabel != null
          ? String(v.primaryActionLabel)
          : undefined
      }
      secondaryActionLabel={
        v.secondaryActionLabel != null
          ? String(v.secondaryActionLabel)
          : undefined
      }
      isDismissable={v.isDismissable !== false}
      surfaceOnly={inspect}
    />
  );

  if (inspect) {
    return <div style={{ width: "100%" }}>{modal}</div>;
  }

  return (
    <>
      <Button size="medium" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      {modal}
    </>
  );
}
