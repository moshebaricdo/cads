import Box from "@mui/material/Box";
import MuiDialog from "@mui/material/Dialog";
import { forwardRef, type ReactNode } from "react";
import { Button } from "./Button";
import { CloseIconButton } from "./CloseIconButton";

/** Figma Modal `type`. */
export type ModalType = "default" | "verticalImage" | "horizontalImage";

const SCRIM =
  "color-mix(in srgb, var(--background-neutral-black-fixed) 80%, transparent)";

export interface ModalProps {
  /**
   * @default "default"
   */
  type?: ModalType;
  /** Figma `titleText`. */
  title?: ReactNode;
  /** Body copy for image layouts; default type uses `children` / `customContent`. */
  body?: ReactNode;
  /** Image slot for vertical/horizontal types. */
  image?: ReactNode;
  /** Custom body when `type="default"`. */
  children?: ReactNode;
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
   * Figma `isDismissable`.
   * @default true
   */
  isDismissable?: boolean;
  onClose?: () => void;
  open?: boolean;
  /**
   * Render surface without portal (fixtures).
   * @default false
   */
  surfaceOnly?: boolean;
  className?: string;
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
  className,
  surfaceRef,
}: Omit<ModalProps, "open" | "surfaceOnly"> & {
  surfaceRef?: React.Ref<HTMLDivElement>;
}) {
  const defaultBody =
    body ??
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s";

  return (
    <Box
      ref={surfaceRef}
      className={className}
      data-cads-component="Modal"
      role="dialog"
      aria-modal
      sx={{
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 800,
        overflow: "hidden",
        backgroundColor: "var(--background-neutral-primary)",
        border: "1px solid var(--border-neutral-primary)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          boxSizing: "border-box",
          pl: "24px",
          pr: "20px",
          py: "18px",
          borderBottom: "1px solid var(--border-neutral-primary)",
        }}
      >
        <Box
          component="h2"
          sx={{
            m: 0,
            flex: 1,
            minWidth: 0,
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "var(--text-heading-lg)",
            lineHeight: "var(--leading-heading-lg)",
            color: "var(--text-neutral-primary)",
          }}
        >
          {title}
        </Box>
        {isDismissable ? (
          <CloseIconButton
            onClick={onClose}
            size="large"
            color="secondary"
          />
        ) : null}
      </Box>

      {type === "default" ? (
        <Box sx={{ p: "24px", width: "100%", boxSizing: "border-box" }}>
          {children ?? (
            <Box
              sx={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-body-md)",
                lineHeight: "var(--leading-body-md)",
                color: "var(--text-neutral-primary)",
              }}
            >
              {defaultBody}
            </Box>
          )}
        </Box>
      ) : null}

      {type === "verticalImage" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            p: "24px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 200,
              minHeight: 200,
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--background-neutral-tertiary)",
              overflow: "hidden",
            }}
          >
            {image}
          </Box>
          <Box
            sx={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-md)",
              lineHeight: "var(--leading-body-md)",
              color: "var(--text-neutral-primary)",
            }}
          >
            {defaultBody}
          </Box>
        </Box>
      ) : null}

      {type === "horizontalImage" ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: "18px",
            p: "24px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              flex: "1 0 0",
              minWidth: 200,
              height: 200,
              minHeight: 200,
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--background-neutral-tertiary)",
              overflow: "hidden",
            }}
          >
            {image}
          </Box>
          <Box
            sx={{
              flex: "1 0 0",
              minWidth: 200,
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-body-md)",
              lineHeight: "var(--leading-body-md)",
              color: "var(--text-neutral-primary)",
            }}
          >
            {defaultBody}
          </Box>
        </Box>
      ) : null}

      <Box
        sx={{
          display: "flex",
          gap: "8px",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          width: "100%",
          boxSizing: "border-box",
          pl: "24px",
          pr: "20px",
          py: "18px",
          borderTop: "1px solid var(--border-neutral-primary)",
        }}
      >
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
    </Box>
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
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: "56px 24px",
          backgroundColor: SCRIM,
          minHeight: 400,
          width: "100%",
          maxWidth: 800,
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
      fullWidth
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
