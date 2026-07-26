import MuiDrawer from "@mui/material/Drawer";
import { forwardRef } from "react";
import { Button } from "../button/index";
import { CloseIconButton } from "../close-icon-button";
import styles from "./drawer.module.scss";
import type { DrawerProps } from "./types";

export type { DrawerProps, DrawerType } from "./types";

function DrawerSurface({
  type,
  title,
  description,
  hasDescription,
  hasActionRow,
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryAction,
  onSecondaryAction,
  children,
  isDismissible,
  onClose,
  className,
  surfaceRef,
}: Omit<DrawerProps, "open" | "surfaceOnly"> & {
  surfaceRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={surfaceRef}
      className={className ? `${styles.surface} ${className}` : styles.surface}
      data-cads-component="Drawer"
      data-cads-surface=""
      data-cads-surface-state="enter"
      role="dialog"
      aria-modal={false}
      style={{ "--cads-surface-origin": "bottom center" } as React.CSSProperties}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {hasDescription ? (
            <div className={styles.description}>{description}</div>
          ) : null}
        </div>

        {type === "customContent" ? (
          <div className={styles.customSlot}>{children}</div>
        ) : null}

        {hasActionRow ? (
          <div className={styles.actions}>
            <Button
              size="medium"
              variant="outlined"
              color="secondary"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
            <Button
              size="medium"
              variant="contained"
              color="primary"
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </Button>
          </div>
        ) : null}
      </div>

      {isDismissible ? (
        <CloseIconButton
          onClick={onClose}
          size="large"
          color="secondary"
          sx={{
            position: "absolute",
            top: 11,
            right: 11,
          }}
        />
      ) : null}
    </div>
  );
}

/**
 * CADS Drawer — bottom sheet over content without dimming.
 * Spec: Figma Drawer `10708:17779` / key `b2cd3a35f20d344f38d677d0dfd992d64f503b87`.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  {
    type = "textOnly",
    title = "This is a heading",
    description = "This is descriptive text.",
    hasDescription = true,
    hasActionRow = true,
    primaryActionLabel = "Button",
    secondaryActionLabel = "Button",
    onPrimaryAction,
    onSecondaryAction,
    children,
    isDismissible = true,
    onClose,
    open = false,
    surfaceOnly = false,
    className,
  },
  ref,
) {
  const surface = (
    <DrawerSurface
      surfaceRef={ref}
      type={type}
      title={title}
      description={description}
      hasDescription={hasDescription}
      hasActionRow={hasActionRow}
      primaryActionLabel={primaryActionLabel}
      secondaryActionLabel={secondaryActionLabel}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      isDismissible={isDismissible}
      onClose={onClose}
      className={className}
    >
      {children}
    </DrawerSurface>
  );

  if (surfaceOnly) return surface;

  /* sx on MUI Drawer paper slot — required to reset MUI's paper chrome. */
  return (
    <MuiDrawer
      anchor="bottom"
      open={open}
      onClose={(_e, _reason) => onClose?.()}
      hideBackdrop
      disableScrollLock
      disableEnforceFocus
      slotProps={{
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        },
      }}
    >
      {surface}
    </MuiDrawer>
  );
});
