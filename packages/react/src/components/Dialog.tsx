import Box from "@mui/material/Box";
import MuiDialog from "@mui/material/Dialog";
import { forwardRef, type ReactNode } from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import { Button } from "./Button";
import { CloseIconButton } from "./CloseIconButton";

/** Figma Dialog `type`. */
export type DialogType = "default" | "iconTop" | "customContent";

const SCRIM =
  "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";

export interface DialogProps {
  /**
   * @default "default"
   */
  type?: DialogType;
  /** Figma `titleText`. */
  title?: ReactNode;
  /** Figma `descriptionText`. */
  description?: ReactNode;
  /**
   * Optional illustration above title when `type="default"`.
   * @default false
   */
  hasImage?: boolean;
  image?: ReactNode;
  /** FA name for the floating brand badge when `type="iconTop"`. */
  topIconName?: FaIconName | (string & {});
  /**
   * @default true
   */
  hasSecondaryAction?: boolean;
  /** @default "Button" */
  primaryActionLabel?: ReactNode;
  /** @default "Button" */
  secondaryActionLabel?: ReactNode;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /**
   * @default true
   */
  isDismissable?: boolean;
  onClose?: () => void;
  /** Custom slot when `type="customContent"`. */
  children?: ReactNode;
  open?: boolean;
  /**
   * Render surface without MUI Dialog portal (fixtures).
   * @default false
   */
  surfaceOnly?: boolean;
  className?: string;
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
  children,
  className,
  surfaceRef,
}: Omit<DialogProps, "open" | "surfaceOnly"> & {
  surfaceRef?: React.Ref<HTMLDivElement>;
}) {
  const isIconTop = type === "iconTop";
  const isCustom = type === "customContent";

  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        isolation: "isolate",
      }}
    >
      {isIconTop ? (
        <Box
          sx={{
            zIndex: 2,
            mb: "-30px",
            width: 64,
            height: 64,
            borderRadius: "var(--radius-round)",
            backgroundColor: "var(--background-brand-primary)",
            boxShadow: "0px 3px 3px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-neutral-white-fixed)",
          }}
        >
          <FaIcon
            name={(topIconName as FaIconName) || "smile"}
            fontSize="32px"
            style={{ color: "var(--text-neutral-white-fixed)" }}
          />
        </Box>
      ) : null}

      <Box
        ref={surfaceRef}
        role="dialog"
        aria-modal
        data-cads-component="Dialog"
        sx={{
          zIndex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          boxSizing: "border-box",
          width: "100%",
          minWidth: 630,
          maxWidth: 800,
          padding: isCustom
            ? "30px"
            : isIconTop
              ? "56px 56px 40px"
              : "40px 56px",
          backgroundColor: "var(--background-neutral-primary)",
          border: "1px solid var(--border-neutral-primary)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {isCustom ? (
          <Box sx={{ width: "100%", minHeight: 130 }}>{children}</Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "28px",
                width: "100%",
              }}
            >
              {type === "default" && hasImage ? (
                <Box
                  sx={{
                    width: 260,
                    height: 138,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--background-neutral-tertiary)",
                    flexShrink: 0,
                  }}
                >
                  {image}
                </Box>
              ) : null}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Box
                  component="h2"
                  sx={{
                    m: 0,
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "var(--text-heading-xl)",
                    lineHeight: "var(--leading-heading-xl)",
                    letterSpacing: "var(--tracking-heading-display, -0.38px)",
                    color: "var(--text-neutral-primary)",
                  }}
                >
                  {title}
                </Box>
                <Box
                  sx={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 400,
                    fontSize: "var(--text-body-md)",
                    lineHeight: "var(--leading-body-md)",
                    color: "var(--text-neutral-tertiary)",
                  }}
                >
                  {description}
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
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
            </Box>
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
      </Box>
    </Box>
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
    isDismissable = true,
    onClose,
    children,
    open = false,
    surfaceOnly = false,
    className,
  },
  ref,
) {
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
      className={className}
    >
      {children}
    </DialogSurface>
  );

  if (surfaceOnly) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: "56px 24px",
          backgroundColor: SCRIM,
          minHeight: 360,
        }}
      >
        {surface}
      </Box>
    );
  }

  return (
    <MuiDialog
      open={open}
      onClose={(_e, _reason) => onClose?.()}
      maxWidth={false}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: SCRIM },
        },
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
            overflow: "visible",
            maxWidth: "none",
            m: 0,
          },
        },
      }}
    >
      {surface}
    </MuiDialog>
  );
});
