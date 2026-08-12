import {
  AiChatFileChip,
  AiChatInput,
  AiChatMessage,
  Alert,
  Button,
  Chip,
  Dropdown,
  SegmentedButton,
  Slider,
  Tag,
  TextInput,
  Toggle,
} from "@moshebaricdo/cads-react";
import type { CSSProperties } from "react";
import type { PackedComponent, PackedItem, Tone } from "./shapeGrid";
import styles from "./ModuleCell.module.scss";

const ICONS = [
  "sparkles",
  "wand-magic-sparkles",
  "robot",
  "bolt",
  "star",
  "play",
] as const;

/* Curated tone → prop maps. The packer picks the tone (weighted toward
   brand/neutral with rare accents); each kind maps it to its closest prop. */

const BUTTON_COLOR: Record<Tone, "primary" | "orange" | "secondary"> = {
  brand: "primary",
  pink: "primary",
  orange: "orange",
  success: "secondary",
  info: "secondary",
  neutral: "secondary",
};

const TAG_COLOR: Record<
  Tone,
  "brand" | "pink" | "orange" | "success" | "info"
> = {
  brand: "brand",
  pink: "pink",
  orange: "orange",
  success: "success",
  info: "info",
  neutral: "brand",
};

const ALERT_SENTIMENT: Record<
  Tone,
  "brand" | "pink" | "success" | "info"
> = {
  brand: "brand",
  pink: "pink",
  orange: "pink",
  success: "success",
  info: "info",
  neutral: "brand",
};

export function ModuleItem({ item }: { item: PackedItem }) {
  const { content } = item;

  if (content.type === "swatch") {
    return (
      <div
        className={styles.swatch}
        style={{ background: `var(${content.varName})` }}
        title={content.label}
      />
    );
  }

  const grow = content.sizing === "grow";
  const wrapStyle: CSSProperties = grow
    ? {
        flex: `1 1 ${content.minWidth ?? 100}px`,
        minWidth: content.minWidth,
        maxWidth: content.maxWidth,
      }
    : { flex: "0 0 auto" };

  const className = [
    grow ? styles.componentGrow : styles.componentFixed,
    content.chrome ? styles.card : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} style={wrapStyle}>
      <ComponentPreview content={content} />
    </div>
  );
}

function ComponentPreview({ content }: { content: PackedComponent }) {
  const { kind, variant, label, tone } = content;
  const icon = ICONS[variant % ICONS.length];

  switch (kind) {
    case "alert":
      // Small (42px min) + released min-height stretches flush to the
      // 40px reference band; medium is 48px and would overflow.
      return (
        <Alert
          size="small"
          sentiment={ALERT_SENTIMENT[tone]}
          isDismissible={false}
          hasAction={false}
        >
          {label}
        </Alert>
      );
    case "field":
      return (
        <TextInput
          size="medium"
          placeholder={label}
          startIconName="sparkles"
          defaultValue={variant % 2 === 0 ? "Warm-up idea" : undefined}
          color="primary"
        />
      );
    case "dropdown":
      return (
        <Dropdown
          role="input"
          size="medium"
          placeholder={`Select ${label.toLowerCase()}`}
          width="full"
          options={[
            { value: "a", label: "Option A", iconName: "sparkles" },
            { value: "b", label: "Option B", iconName: "robot" },
            { value: "c", label: "Option C" },
          ]}
          defaultValue={variant % 2 === 0 ? "a" : undefined}
        />
      );
    case "chatMessage":
      // Stretch the bubble itself to the band height (the root wrapper
      // stretches, but the bubble hugs its text by default).
      return (
        <div className={styles.chatMessageFill}>
          <AiChatMessage
            context={variant % 3 === 0 ? "Tutor" : "TA"}
            author={variant % 2 === 1 ? "AI" : "Human"}
            hasActionRow={false}
            hasLeftActions={false}
            hasRightActions={false}
            hasFlagging={false}
          >
            {label}
          </AiChatMessage>
        </div>
      );
    case "chatInput":
      // The composer is naturally two rows (textarea + action row). For the
      // mosaic we flatten it to one row: field + send inline, no Add file.
      return (
        <div className={styles.chatInputSlim}>
          <AiChatInput
            defaultValue={variant % 2 === 0 ? "Draft a lesson intro" : undefined}
            placeholder={label}
            onSubmit={(e) => e.preventDefault()}
          />
        </div>
      );
    case "chatFile":
      return (
        <AiChatFileChip
          type="file"
          useCase="chatStream"
          fileName={label}
          iconName={variant % 2 === 0 ? "file-code" : "file"}
        />
      );
    case "slider":
      return (
        <div className={styles.sliderWrap}>
          <Slider
            size="medium"
            showLabelRow={false}
            defaultValue={20 + (variant % 5) * 15}
            min={0}
            max={100}
          />
        </div>
      );
    case "button": {
      const iconProps =
        variant % 2 === 0 ? { startIconName: icon } : { endIconName: icon };
      const color = BUTTON_COLOR[tone];
      // Orange is contained-only in CADS; otherwise alternate variants
      const buttonVariant =
        color === "orange" || variant % 3 !== 0 ? "contained" : "outlined";
      return (
        <Button
          size="small"
          color={color}
          variant={buttonVariant}
          {...iconProps}
        >
          {label}
        </Button>
      );
    }
    case "chip":
      return (
        <Chip
          size="small"
          color={tone === "neutral" ? "secondary" : "primary"}
          selected
          label={label}
          startIconName={icon}
        />
      );
    case "tag":
      return (
        <Tag
          size="medium"
          color={TAG_COLOR[tone]}
          label={label}
          startIconName="circle-info"
        />
      );
    case "toggle":
      return (
        <Toggle
          size="small"
          checked
          hasIcons
          label={label.length > 0 ? label : undefined}
        />
      );
    case "segmented":
      return (
        <SegmentedButton
          size="small"
          value="a"
          aria-label="Mode"
          options={
            label === "3"
              ? [
                  { value: "a", label: "Draft" },
                  { value: "b", label: "Review" },
                  { value: "c", label: "Share" },
                ]
              : [
                  { value: "a", label: "AI", iconName: "sparkles" },
                  { value: "b", label: "Edit", iconName: "pen" },
                ]
          }
        />
      );
    default:
      return null;
  }
}
