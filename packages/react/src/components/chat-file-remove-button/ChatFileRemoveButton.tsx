import ButtonBase from "@mui/material/ButtonBase";
import { forwardRef } from "react";
import { FaIcon } from "../../icons/FaIcon";
import styles from "./chatFileRemoveButton.module.scss";
import type { ChatFileRemoveButtonProps } from "./types";

export type { ChatFileRemoveButtonProps } from "./types";

/**
 * Compact remove control for AI chat file chips in the input field.
 * Spec: Figma Chat File Remove Button `17228:10910`.
 */
export const ChatFileRemoveButton = forwardRef<
  HTMLButtonElement,
  ChatFileRemoveButtonProps
>(function ChatFileRemoveButton(
  {
    className,
    "aria-label": ariaLabel = "Remove",
    type = "button",
    sx,
    ...rest
  },
  ref,
) {
  return (
    <ButtonBase
      ref={ref}
      type={type}
      focusRipple={false}
      disableRipple
      aria-label={ariaLabel}
      data-cads-component="ChatFileRemoveButton"
      data-cads-press=""
      className={className ? `${styles.root} ${className}` : styles.root}
      sx={sx}
      {...rest}
    >
      <FaIcon name="xmark" family="solid" fontSize="0.5rem" aria-hidden />
    </ButtonBase>
  );
});
