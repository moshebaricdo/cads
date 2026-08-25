import MuiDialog from "@mui/material/Dialog";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import {
  overlayDismissHandler,
  resolveOverlayMaxWidth,
} from "../../shared/overlaySurface";
import { Button } from "../button/index";
import { CloseIconButton } from "../close-icon-button";
import styles from "./modal.module.scss";
import type { ModalProps } from "./types";

export type { ModalProps, ModalType } from "./types";

const SCRIM =
  "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";

const DEFAULT_BODY =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

/** Custom content (`children`) replaces the body text slot across all types. */
function resolveContent(children: ReactNode, body: ReactNode): ReactNode {
  if (children != null) return children;
  return (
    <div className={styles.bodyDefaultText}>{body ?? DEFAULT_BODY}</div>
  );
}

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
  maxWidth,
  className,
  surfaceRef,
}: Omit<ModalProps, "open" | "surfaceOnly"> & {
  surfaceRef?: React.Ref<HTMLDivElement>;
}) {
  const content = resolveContent(children, body);
  const resolvedMaxWidth = resolveOverlayMaxWidth(maxWidth);

  return (
    <div
      ref={surfaceRef}
      className={className ? `${styles.surface} ${className}` : styles.surface}
      data-cads-component="Modal"
      data-cads-surface=""
      data-cads-surface-state="enter"
      role="dialog"
      aria-modal
      style={
        {
          "--cads-surface-origin": "center",
          maxWidth: resolvedMaxWidth,
        } as CSSProperties
      }
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {isDismissable ? (
          <CloseIconButton onClick={onClose} size="large" color="secondary" />
        ) : null}
      </div>

      {type === "default" ? (
        <div className={styles.bodyDefault}>{content}</div>
      ) : null}

      {type === "verticalImage" ? (
        <div className={styles.bodyVertical}>
          <div className={styles.imageSlotVertical}>{image}</div>
          {content}
        </div>
      ) : null}

      {type === "horizontalImage" ? (
        <div className={styles.bodyHorizontal}>
          <div className={styles.imageSlotHorizontal}>{image}</div>
          <div className={styles.textSlotHorizontal}>{content}</div>
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
    maxWidth,
    open = false,
    surfaceOnly = false,
    className,
  },
  ref,
) {
  const resolvedMaxWidth = resolveOverlayMaxWidth(maxWidth);

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
      maxWidth={maxWidth}
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
      onClose={overlayDismissHandler(isDismissable, onClose)}
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
            overflow: "hidden",
            maxWidth: resolvedMaxWidth,
            maxHeight: "calc(100% - 48px)",
            width: "100%",
            m: "24px",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {surface}
    </MuiDialog>
  );
});
