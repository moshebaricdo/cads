import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import { forwardRef, type ReactNode } from "react";
import { Button } from "./Button";
import { CloseIconButton } from "./CloseIconButton";

/** Figma Drawer `type`. */
export type DrawerType = "textOnly" | "customContent";

export interface DrawerProps {
  /**
   * @default "textOnly"
   */
  type?: DrawerType;
  /** Figma `titleText`. */
  title?: ReactNode;
  /** Figma `descriptionText`. */
  description?: ReactNode;
  /**
   * @default true
   */
  hasDescription?: boolean;
  /**
   * @default true
   */
  hasActionRow?: boolean;
  /** @default "Button" */
  primaryActionLabel?: ReactNode;
  /** @default "Button" */
  secondaryActionLabel?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /** Custom slot when `type="customContent"`. */
  children?: ReactNode;
  /**
   * Always dismissible in Figma (close control present).
   * @default true
   */
  isDismissible?: boolean;
  onClose?: () => void;
  /** Controlled open. */
  open?: boolean;
  /**
   * When true, render the panel surface without MUI Drawer portal (fixtures).
   * @default false
   */
  surfaceOnly?: boolean;
  className?: string;
}

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
    <Box
      ref={surfaceRef}
      className={className}
      data-cads-component="Drawer"
      role="dialog"
      aria-modal={false}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        width: "100%",
        gap: "10px",
        pt: "40px",
        pb: "48px",
        px: "10px",
        backgroundColor: "var(--background-neutral-secondary)",
        borderTop: "1px solid var(--border-neutral-primary)",
        // Medium elevation cast upward (drawer sits at the bottom edge).
        boxShadow:
          "0 -10px 15px -3px rgb(0 0 0 / 10%), 0 -4px 6px -4px rgb(0 0 0 / 10%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          flex: 1,
          minWidth: 0,
          maxWidth: 1160,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            width: "100%",
            maxWidth: 700,
            textAlign: "center",
            color: "var(--text-neutral-primary)",
          }}
        >
          <Box
            component="h2"
            sx={{
              m: 0,
              width: "100%",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "var(--text-heading-lg)",
              lineHeight: "var(--leading-heading-lg)",
            }}
          >
            {title}
          </Box>
          {hasDescription ? (
            <Box
              sx={{
                width: "100%",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "var(--text-body-md)",
                lineHeight: "var(--leading-body-md)",
              }}
            >
              {description}
            </Box>
          ) : null}
        </Box>

        {type === "customContent" ? (
          <Box
            sx={{
              width: "100%",
              maxWidth: 1160,
              minWidth: 500,
              minHeight: 72,
              boxSizing: "border-box",
              backgroundColor: "var(--background-neutral-primary)",
              border: "1px solid var(--border-neutral-primary)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
          >
            {children}
          </Box>
        ) : null}

        {hasActionRow ? (
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              justifyContent: "center",
              width: "100%",
            }}
          >
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
          </Box>
        ) : null}
      </Box>

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
    </Box>
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

  return (
    <MuiDrawer
      anchor="bottom"
      open={open}
      onClose={(_e, _reason) => onClose?.()}
      hideBackdrop
      disableScrollLock
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
