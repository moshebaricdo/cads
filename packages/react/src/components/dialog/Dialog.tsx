import MuiDialog from "@mui/material/Dialog";
import { forwardRef, type CSSProperties } from "react";
import { FaIcon } from "../../icons/FaIcon";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import {
  overlayDismissHandler,
  resolveOverlayMaxWidth,
} from "../../shared/overlaySurface";
import { Button } from "../button/index";
import { CloseIconButton } from "../close-icon-button";
import styles from "./dialog.module.scss";
import type { DialogProps } from "./types";

export type { DialogProps, DialogType } from "./types";

const SCRIM =
  "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function DialogSurface({
  type,
  title,
  description,
  hasImage,
  image,
  topIconName,
  hasSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  isDismissable,
  onClose,
  maxWidth,
  children,
  className,
  surfaceRef,
}: Omit<DialogProps, "open" | "surfaceOnly"> & {
  surfaceRef?: React.Ref<HTMLDivElement>;
}) {
  const isIconTop = type === "iconTop";
  const isCustom = type === "customContent";
  const resolvedMaxWidth = resolveOverlayMaxWidth(maxWidth);

  return (
    <div className={cx(styles.outerWrap, className)}>
      {isIconTop ? (
        <div className={styles.iconBadge}>
          <FaIcon
            name={(topIconName as FaIconName) || "smile"}
            fontSize="32px"
            style={{ color: "var(--text-neutral-white-fixed)" }}
          />
        </div>
      ) : null}

      <div
        ref={surfaceRef}
        role="dialog"
        aria-modal
        data-cads-component="Dialog"
        data-cads-surface=""
        data-cads-surface-state="enter"
        className={cx(
          styles.surface,
          type === "default" && styles.default,
          isIconTop && styles.iconTop,
          isCustom && styles.customContent,
        )}
        style={
          {
            "--cads-surface-origin": "center",
            maxWidth: resolvedMaxWidth,
          } as CSSProperties
        }
      >
        {isCustom ? (
          <div className={styles.customSlot}>{children}</div>
        ) : (
          <>
            <div className={styles.contentWrap}>
              {type === "default" && hasImage ? (
                <div className={styles.imageSlot}>{image}</div>
              ) : null}
              <div className={styles.copy}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.description}>{description}</div>
              </div>
            </div>
            <div className={styles.actions}>
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
          </>
        )}

        {isDismissable ? (
          <CloseIconButton
            onClick={onClose}
            size="large"
            color="secondary"
            sx={{
              position: "absolute",
              top: 7,
              right: 7,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

/**
 * CADS Dialog — blocking confirmation overlay.
 * Spec: Figma Dialog `3453:3938` / key `75feff93418c9804cbd3075e8a7f85bce1a5ff1e`.
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    type = "default",
    title = "Dialog Title",
    description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    hasImage = false,
    image,
    topIconName = "smile",
    hasSecondaryAction = true,
    primaryActionLabel = "Button",
    secondaryActionLabel = "Button",
    onPrimaryAction,
    onSecondaryAction,
    isDismissable = false,
    onClose,
    maxWidth,
    children,
    open = false,
    surfaceOnly = false,
    className,
  },
  ref,
) {
  const resolvedMaxWidth = resolveOverlayMaxWidth(maxWidth);

  const surface = (
    <DialogSurface
      surfaceRef={ref}
      type={type}
      title={title}
      description={description}
      hasImage={hasImage}
      image={image}
      topIconName={topIconName}
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
    </DialogSurface>
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
            overflow: "visible",
            maxWidth: resolvedMaxWidth,
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
