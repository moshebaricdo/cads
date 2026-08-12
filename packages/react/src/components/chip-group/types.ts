import type { ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { ChipColor, ChipLabelStyle, ChipSize } from "../chip/types";

export type ChipGroupSize = ChipSize;
export type ChipGroupColor = ChipColor;
export type ChipGroupLabelStyle = ChipLabelStyle;

export interface ChipGroupOption {
  value: string;
  label: ReactNode;
  /** Leading FA icon. Omit for no start icon. */
  startIconName?: FaIconName | (string & {});
  /** Trailing FA icon. Omit for no end icon. */
  endIconName?: FaIconName | (string & {});
  disabled?: boolean;
}

export interface ChipGroupProps {
  /**
   * @default "medium"
   */
  size?: ChipGroupSize;
  /**
   * Unselected chip border treatment.
   * @default "primary"
   */
  color?: ChipGroupColor;
  /**
   * @default "thick"
   */
  labelStyle?: ChipGroupLabelStyle;
  label?: ReactNode;
  helperText?: ReactNode;
  /**
   * Optional Field Wrapper helper icon for default sentiment. Omit for no
   * icon; non-default sentiments use fixed icons.
   */
  helperIconName?: FaIconName | (string & {});
  /**
   * @default true
   */
  showHelper?: boolean;
  options: ChipGroupOption[];
  /** Multi-select selected values. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}
