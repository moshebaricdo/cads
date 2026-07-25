import MuiDialog from "@mui/material/Dialog";
import { forwardRef } from "react";
import { Button } from "../button/index";
import { CloseIconButton } from "../close-icon-button";
import styles from "./modal.module.scss";
import type { ModalProps } from "./types";

export type { ModalProps, ModalType } from "./types";

const SCRIM =
  "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";

function ModalSurface({
  type,
  title,
  body,
  image,
  children,
  hasSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  isDismissable,
  onClose,
  className,
  surfaceRef,
}: Omit<ModalProps, "open" | "surfaceOnly"> & {
  surfaceRef?: React.Ref<HTMLDivElement>;
}) {
  const defaultBody =
    body ??
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

  return (
    <div
      ref={surfaceRef}
      className={className ? `${styles.surface} ${className}` : styles.surface}
      data-cads-component="Modal"
      data-cads-surface=""
      role="dialog"
      aria-modal
      style={{ "--cads-surface-origin": "center" } as React.CSSProperties}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {isDismissable ? (
          <CloseIconButton onClick={onClose} size="large" color="secondary" />
        ) : null}
      </div>

      {type === "default" ? (
        <div className={styles.bodyDefault}>
          {children ?? (
            <div className={styles.bodyDefaultText}>{defaultBody}</div>
          )}
        </div>
      ) : null}

      {type === "verticalImage" ? (
        <div className={styles.bodyVertical}>
          <div className={styles.imageSlotVertical}>{image}</div>
          <div className={styles.bodyDefaultText}>{defaultBody}</div>
        </div>
      ) : null}

      {type === "horizontalImage" ? (
        <div className={styles.bodyHorizontal}>
          <div className={styles.imageSlotHorizontal}>{image}</div>
          <div className={styles.textSlotHorizontal}>{defaultBody}</div>
        </div>
      ) : null}

      <div className={styles.footer}>
        {hasSecondaryAction ? (
          <Button
            size="medium"
            variant="outlined"
            color="secondary"
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </Button>
        ) : null}
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={onPrimaryAction}
        >
          {primaryActionLabel}
        </Button>
      </div>
    </div>
  );
}

/**
 * CADS Modal — blocking overlay for rich interactive content.
 * Spec: Figma Modal `2190:8284` / key `0fe4d86d9d16ed81da4f995fc1e8fae90f7cf0e5`.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    type = "default",
    title = "Title",
    body,
    image,
    children,
    hasSecondaryAction = true,
    primaryActionLabel = "Button",
    secondaryActionLabel = "Button",
    onPrimaryAction,
    onSecondaryAction,
    isDismissable = true,
    onClose,
    open = false,
    surfaceOnly = false,
    className,
  },
  ref,
) {
  const surface = (
    <ModalSurface
      surfaceRef={ref}
      type={type}
      title={title}
      body={body}
      image={image}
      hasSecondaryAction={hasSecondaryAction}
      primaryActionLabel={primaryActionLabel}
      secondaryActionLabel={secondaryActionLabel}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      isDismissable={isDismissable}
      onClose={onClose}
      className={className}
    >
      {children}
    </ModalSurface>
  );

  if (surfaceOnly) {
    return <div className={styles.scrim}>{surface}</div>;
  }

  /* sx on MUI Dialog backdrop/paper slots — required to override MUI chrome. */
  return (
    <MuiDialog
      open={open}
      onClose={(_e, _reason) => onClose?.()}
      maxWidth={false}
      fullWidth
      disableEnforceFocus
      slotProps={{
        backdrop: {
          sx: { backgroundColor: SCRIM },
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
            maxWidth: 800,
            width: "100%",
            m: "24px",
          },
        },
      }}
    >
      {surface}
    </MuiDialog>
  );
});
