import ButtonBase from "@mui/material/ButtonBase";
import { forwardRef, type CSSProperties } from "react";
import { FaIcon } from "../../icons/FaIcon";
import styles from "./cardButton.module.scss";
import type { CardButtonLayout, CardButtonProps, CardButtonSize } from "./types";

export type {
  CardButtonLayout,
  CardButtonProps,
  CardButtonSize,
} from "./types";

/** Figma glyph sizes per layout × size (start icon / end icon). */
const ICON_FONT_SIZE: Record<
  CardButtonLayout,
  Record<CardButtonSize, { start: string; end: string }>
> = {
  horizontal: {
    medium: { start: "var(--text-body-lg)", end: "var(--text-body-md)" },
    small: { start: "var(--text-body-md)", end: "var(--text-body-sm)" },
  },
  vertical: {
    medium: { start: "var(--text-heading-md)", end: "var(--text-body-md)" },
    small: { start: "var(--text-heading-xs)", end: "var(--text-body-sm)" },
  },
};

/**
 * CADS Card Button — a clickable card for actions, navigation, and choices
 * that need more presence than a Button.
 * Spec: Figma Card Button `17848:283` (layout × size × state × selected).
 *
 * Hugs its content by default (like Button); pass `fullWidth` to fill the
 * container (stacks, grid cells, equal-width tiles). Pass `href` for a link card.
 */
export const CardButton = forwardRef<HTMLButtonElement, CardButtonProps>(
  function CardButton(
    {
      layout = "horizontal",
      size = "medium",
      title,
      description,
      startIconName,
      startIconColor,
      startContent,
      endIconName,
      selected,
      fullWidth = false,
      className,
      style,
      disabled,
      ...rest
    },
    ref,
  ) {
    const icons = ICON_FONT_SIZE[layout][size];
    const isLink = rest.href != null;
    const showEnd = layout === "horizontal" && Boolean(endIconName);

    const hasStartContent = startContent != null && startContent !== false;

    if (process.env.NODE_ENV !== "production" && hasStartContent && startIconName) {
      console.warn(
        `[CADS CardButton] startContent and startIconName are both set; rendering startContent and ignoring startIconName="${startIconName}".`,
      );
    }
    if (
      process.env.NODE_ENV !== "production" &&
      layout === "vertical" &&
      endIconName
    ) {
      console.warn(
        `[CADS CardButton] endIconName is only defined in Figma for layout="horizontal"; ignoring "${endIconName}".`,
      );
    }

    return (
      <ButtonBase
        ref={ref}
        disableRipple
        disabled={disabled}
        data-layout={layout}
        data-size={size}
        data-selected={selected ? "" : undefined}
        data-full-width={fullWidth ? "" : undefined}
        // Experimental Motion Press recipe (scale on :active) — no-op unless
        // CadsProvider experimentalMotion is on.
        data-cads-press=""
        aria-pressed={!isLink && selected !== undefined ? selected : undefined}
        className={[styles.root, className].filter(Boolean).join(" ")}
        style={
          startIconColor
            ? ({ ...style, "--cb-start-custom": startIconColor } as CSSProperties)
            : style
        }
        {...rest}
      >
        {hasStartContent ? (
          <span className={styles.startContent} data-slot="start-content">
            {startContent}
          </span>
        ) : startIconName ? (
          <span className={styles.startIcon} data-slot="start-icon">
            <FaIcon name={startIconName} family="solid" fontSize={icons.start} />
          </span>
        ) : null}
        <span className={styles.content}>
          <span className={styles.title}>{title}</span>
          {description != null && description !== "" ? (
            <span className={styles.description}>{description}</span>
          ) : null}
        </span>
        {showEnd ? (
          <span className={styles.endIcon} data-slot="end-icon">
            <FaIcon name={endIconName!} family="solid" fontSize={icons.end} />
          </span>
        ) : null}
      </ButtonBase>
    );
  },
);
