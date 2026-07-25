import type { ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { ControlSize } from "../../shared/controlSize";

export type SegmentedButtonSize = ControlSize;

export interface SegmentedButtonOption {
  value: string;
  label: ReactNode;
  iconName?: FaIconName;
  endIconName?: FaIconName;
  disabled?: boolean;
}

export interface SegmentedButtonProps {
  /**
   * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
   * @default "medium"
   */
  size?: SegmentedButtonSize;
  /** Currently selected value (exclusive). */
  value?: string;
  /** Uncontrolled default. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: SegmentedButtonOption[];
  disabled?: boolean;
  /** Square icon-only segments (Figma `iconOnly`). */
  iconOnly?: boolean;
  "aria-label"?: string;
  className?: string;
}
