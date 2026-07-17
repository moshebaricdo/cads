import * as react from 'react';
import { ButtonBaseProps } from '@mui/material/ButtonBase';

type CloseIconButtonSize = "large" | "medium" | "small" | "extraSmall";
type CloseIconButtonColor = "primary" | "secondary" | "brand" | "pink" | "orange" | "success" | "error" | "warning" | "info";
interface CloseIconButtonProps extends Omit<ButtonBaseProps, "children" | "color"> {
    /** @default "large" */
    size?: CloseIconButtonSize;
    /** @default "primary" */
    color?: CloseIconButtonColor;
}
/**
 * Icon-only close action for dismissible surfaces.
 * Spec: Figma Close Icon Button `6368:7269`.
 */
declare const CloseIconButton: react.ForwardRefExoticComponent<Omit<CloseIconButtonProps, "ref"> & react.RefAttributes<HTMLButtonElement>>;

export { CloseIconButton, type CloseIconButtonColor, type CloseIconButtonProps, type CloseIconButtonSize };
