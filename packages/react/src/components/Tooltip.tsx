import MuiTooltip, {
  type TooltipProps as MuiTooltipProps,
} from "@mui/material/Tooltip";
import type { ReactElement } from "react";

export interface TooltipProps extends Omit<MuiTooltipProps, "title"> {
  /** Tooltip content. */
  title: MuiTooltipProps["title"];
  children: ReactElement;
}

/**
 * CADS Tooltip — dark inverse surface over the trigger.
 * Spec source: CADS Figma Tooltip component set.
 */
export function Tooltip({ children, title, ...rest }: TooltipProps) {
  return (
    <MuiTooltip
      title={title}
      arrow
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: "var(--ds-background-neutral-primary-inverse)",
            color: "var(--ds-text-neutral-primary-inverse)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-body-xs)",
            padding: "6px 10px",
            boxShadow: "var(--shadow-md)",
          },
        },
        arrow: {
          sx: {
            color: "var(--ds-background-neutral-primary-inverse)",
          },
        },
      }}
      {...rest}
    >
      {children}
    </MuiTooltip>
  );
}
