const CONTROL_HEIGHT = {
  large: "var(--control-height-large)",
  medium: "var(--control-height-medium)",
  small: "var(--control-height-small)",
  extraSmall: "var(--control-height-extra-small)"
};
const BUTTON_SIZE = {
  large: {
    height: CONTROL_HEIGHT.large,
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.625rem",
    // 10px
    gap: "0.556em",
    // 10px @ 18px type
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.125rem",
    // 18px
    iconOnlyPadding: "0.75rem"
    // 12px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.5rem",
    // 8px
    gap: "0.5em",
    // 8px @ 16px type
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem",
    // 16px
    iconOnlyPadding: "0.625rem"
    // 10px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingInline: "0.75rem",
    // 12px
    paddingBlock: "0.3125rem",
    // 5px
    gap: "0.429em",
    // 6px @ 14px type
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem",
    // 14px
    iconOnlyPadding: "0.4375rem"
    // 7px
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingInline: "0.5rem",
    // 8px
    paddingBlock: "0.125rem",
    // 2px
    gap: "0.333em",
    // 4px @ 12px type (Figma Button)
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem",
    // 12px
    iconOnlyPadding: "0.25rem"
    // 4px
  }
};
const CHECKBOX_SIZE = {
  large: {
    box: "1.375rem",
    // 22px
    iconPx: "0.875rem",
    // 14px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    labelAlignOffset: "0.125rem"
    // 2px
  },
  medium: {
    box: "1.25rem",
    // 20px
    iconPx: "0.75rem",
    // 12px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    labelAlignOffset: "0.125rem"
    // 2px
  },
  small: {
    box: "1.125rem",
    // 18px
    iconPx: "0.625rem",
    // 10px
    gap: "0.375rem",
    // 6px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    labelAlignOffset: "0.125rem"
    // 2px
  },
  extraSmall: {
    box: "1rem",
    // 16px
    iconPx: "0.625rem",
    // 10px
    gap: "0.375rem",
    // 6px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    labelAlignOffset: "0"
    // Figma: no optical offset on XS
  }
};
const TOGGLE_SIZE = {
  large: {
    trackWidth: "2.625rem",
    // 42px
    trackHeight: "1.375rem",
    // 22px — matches Checkbox/Radio large
    handle: "1.125rem",
    // 18px
    pad: "0.125rem",
    // 2px
    iconPx: "0.75rem",
    // 12px
    iconGap: "0.375rem",
    // 6px
    iconInsetLeft: "0.5rem",
    // 8px
    iconInsetRight: "0.5625rem",
    // 9px
    labelGap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)"
  },
  medium: {
    trackWidth: "2.375rem",
    // 38px
    trackHeight: "1.25rem",
    // 20px — matches Checkbox/Radio medium
    handle: "1rem",
    // 16px
    pad: "0.125rem",
    // 2px
    iconPx: "0.6875rem",
    // 11px
    iconGap: "0.25rem",
    // 4px
    iconInsetLeft: "0.375rem",
    // 6px
    iconInsetRight: "0.375rem",
    // 6px
    labelGap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)"
  },
  small: {
    trackWidth: "2.125rem",
    // 34px
    trackHeight: "1.125rem",
    // 18px — matches Checkbox/Radio small
    handle: "0.875rem",
    // 14px
    pad: "0.125rem",
    // 2px
    iconPx: "0.625rem",
    // 10px
    iconGap: "0.25rem",
    // 4px
    iconInsetLeft: "0.375rem",
    // 6px
    iconInsetRight: "0.375rem",
    // 6px
    labelGap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)"
  },
  extraSmall: {
    trackWidth: "1.875rem",
    // 30px
    trackHeight: "1rem",
    // 16px — matches Checkbox/Radio extraSmall
    handle: "0.75rem",
    // 12px
    pad: "0.125rem",
    // 2px
    iconPx: "0.5625rem",
    // 9px
    iconGap: "0.25rem",
    // 4px
    iconInsetLeft: "0.375rem",
    // 6px
    iconInsetRight: "0.375rem",
    // 6px
    labelGap: "0.375rem",
    // 6px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)"
  }
};
const ICON_TOGGLE_SIZE = {
  large: {
    size: CONTROL_HEIGHT.large,
    padding: "0.75rem",
    // 12px
    iconPx: "1.1875rem",
    // 19px
    iconSlot: "1.5rem"
    // 24px
  },
  medium: {
    size: CONTROL_HEIGHT.medium,
    padding: "0.625rem",
    // 10px
    iconPx: "1rem",
    // 16px
    iconSlot: "1.25rem"
    // 20px
  },
  small: {
    size: CONTROL_HEIGHT.small,
    padding: "0.4375rem",
    // 7px
    iconPx: "0.875rem",
    // 14px
    iconSlot: "1.125rem"
    // 18px
  },
  extraSmall: {
    size: CONTROL_HEIGHT.extraSmall,
    padding: "0.25rem",
    // 4px
    iconPx: "0.75rem",
    // 12px
    iconSlot: "1rem"
    // 16px
  }
};
const FOCUS_RING = "0 0 0 2px var(--background-neutral-primary), 0 0 0 4px var(--border-focused-primary)";
const TRANSITION_COLORS = "var(--transition-colors)";
const CHIP_SIZE = {
  large: {
    height: CONTROL_HEIGHT.large,
    paddingInline: "1.25rem",
    // 20px
    paddingBlock: "0.625rem",
    // 10px
    gap: "0.625rem",
    // 10px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.125rem",
    // 18px
    groupGap: "0.5rem"
    // 8px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingInline: "1rem",
    // 16px
    paddingBlock: "0.5rem",
    // 8px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem",
    // 16px
    groupGap: "0.375rem"
    // 6px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingInline: "0.75rem",
    // 12px
    paddingBlock: "0.3125rem",
    // 5px
    gap: "0.375rem",
    // 6px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem",
    // 14px
    groupGap: "0.375rem"
    // 6px
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingInline: "0.5rem",
    // 8px
    paddingBlock: "0.125rem",
    // 2px
    gap: "0.25rem",
    // 4px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem",
    // 12px
    groupGap: "0.25rem"
    // 4px
  }
};
const SLIDER_CHROME = {
  trackHeight: "0.375rem",
  // 6px
  knob: "1rem",
  // 16px
  /**
   * Half knob — insets thumb travel (and end ticks) only; rail stays full-bleed
   * so the bar stays label-aligned and tight to ± controls.
   */
  knobInset: "0.5rem",
  // 8px
  barRadius: "0.25rem",
  // 4px
  controlGap: "0.375rem",
  // 6px between ± buttons and track
  /** Root gap: labelRow ↔ sliderWrapper; also bar ↔ stepper. */
  stackGap: "0.625rem",
  // 10px
  /** Helper row bottom pad before the stack gap (Figma helperFieldWrapper pb). */
  helperPaddingBottom: "0.5rem",
  // 8px
  /** 24px button + 6px gap — offsets stepper so ticks align to the track. */
  controlOffset: "1.875rem",
  // 30px
  stepperTickHeight: "0.375rem",
  // 6px
  stepperTickGap: "0.25rem",
  // 4px tick ↔ label
  stepperLabelHeight: "0.875rem"
  // 14px
};
const TEXT_INPUT_SIZE = {
  large: {
    height: CONTROL_HEIGHT.large,
    areaHeight: "6.5rem",
    // 104px
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.625rem",
    // 10px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconGap: "0.625rem",
    // 10px
    iconPx: "1.125rem"
    // 18px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    areaHeight: "5.5rem",
    // 88px
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.5rem",
    // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconGap: "0.625rem",
    // 10px
    iconPx: "1rem"
    // 16px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    areaHeight: "4.75rem",
    // 76px
    paddingInline: "0.75rem",
    // 12px
    paddingBlock: "0.3125rem",
    // 5px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconGap: "0.5rem",
    // 8px
    iconPx: "0.875rem"
    // 14px
  },
  extraSmall: {
    // Approved exception: Figma field is 22px; CADS uses shared 24px control height.
    height: CONTROL_HEIGHT.extraSmall,
    areaHeight: "3.625rem",
    // 58px
    paddingInline: "0.5rem",
    // 8px
    paddingBlock: "0.125rem",
    // 2px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconGap: "0.375rem",
    // 6px
    iconPx: "0.75rem"
    // 12px
  }
};
const FIELD_WRAPPER_SIZE = {
  large: {
    labelFontSize: "var(--text-body-md)",
    labelLineHeight: "var(--leading-body-md)",
    helperFontSize: "var(--text-body-md)",
    helperLineHeight: "var(--leading-body-md)",
    helperGap: "0.375rem",
    // 6px
    helperIconPx: "1rem",
    // 16px
    helperIconSlot: "1.125rem"
    // 18px
  },
  medium: {
    labelFontSize: "var(--text-body-sm)",
    labelLineHeight: "var(--leading-body-sm)",
    helperFontSize: "var(--text-body-sm)",
    helperLineHeight: "var(--leading-body-sm)",
    helperGap: "0.25rem",
    // 4px
    helperIconPx: "0.875rem",
    // 14px
    helperIconSlot: "1rem"
    // 16px
  },
  small: {
    labelFontSize: "var(--text-body-xs)",
    labelLineHeight: "var(--leading-body-xs)",
    helperFontSize: "var(--text-body-xs)",
    helperLineHeight: "var(--leading-body-xs)",
    helperGap: "0.25rem",
    // 4px
    helperIconPx: "0.75rem",
    // 12px
    helperIconSlot: "0.875rem"
    // 14px
  },
  extraSmall: {
    labelFontSize: "var(--text-body-xxs)",
    labelLineHeight: "var(--leading-body-xxs)",
    helperFontSize: "var(--text-body-xxs)",
    helperLineHeight: "var(--leading-body-xxs)",
    helperGap: "0.25rem",
    // 4px
    helperIconPx: "0.625rem",
    // 10px
    helperIconSlot: "0.75rem"
    // 12px
  }
};
const RADIO_SIZE = {
  large: {
    box: "1.375rem",
    // 22px
    dot: "0.625rem",
    // 10px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    controlPaddingTop: "0.125rem"
    // 2px
  },
  medium: {
    box: "1.25rem",
    // 20px
    dot: "0.5rem",
    // 8px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    controlPaddingTop: "0.125rem"
    // 2px
  },
  small: {
    box: "1.125rem",
    // 18px
    dot: "0.5rem",
    // 8px
    gap: "0.375rem",
    // 6px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    controlPaddingTop: "0.125rem"
    // 2px
  },
  extraSmall: {
    box: "1rem",
    // 16px
    dot: "0.4375rem",
    // 7px
    gap: "0.375rem",
    // 6px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    controlPaddingTop: "0"
    // Figma: no optical offset on XS
  }
};
const TABS_SIZE = {
  large: {
    primaryHeight: "3.5rem",
    // 56 (+8 vs control)
    secondaryHeight: "2rem",
    // 32
    primaryGroupGap: "1.25rem",
    // 20
    secondaryGroupGap: "0.25rem",
    // 4
    primaryPadY: "0.875rem",
    // 14
    secondaryPadX: "0.75rem",
    // 12
    primaryItemGap: "0.5rem",
    // 8
    secondaryItemGap: "0.375rem",
    // 6
    primaryFontSize: "var(--text-body-lg)",
    primaryLineHeight: "var(--leading-body-lg)",
    secondaryFontSize: "var(--text-body-md)",
    secondaryLineHeight: "var(--leading-body-md)",
    primaryIconPx: "1.125rem",
    // 18
    secondaryIconPx: "1rem",
    // 16
    primaryIconOnlyPadX: "1rem",
    // 16
    secondaryIconOnlyPadX: "0.625rem",
    // 10
    secondaryIconOnlyMinWidth: "2.25rem"
    // 36
  },
  medium: {
    primaryHeight: "3rem",
    // 48 (+8 vs control)
    secondaryHeight: "1.75rem",
    // 28
    primaryGroupGap: "1.125rem",
    // 18
    secondaryGroupGap: "0.25rem",
    // 4
    primaryPadY: "0.625rem",
    // 10
    secondaryPadX: "0.625rem",
    // 10
    primaryItemGap: "0.5rem",
    // 8
    secondaryItemGap: "0.375rem",
    // 6
    primaryFontSize: "var(--text-body-md)",
    primaryLineHeight: "var(--leading-body-md)",
    secondaryFontSize: "var(--text-body-sm)",
    secondaryLineHeight: "var(--leading-body-sm)",
    primaryIconPx: "1rem",
    // 16
    secondaryIconPx: "0.875rem",
    // 14
    primaryIconOnlyPadX: "0.875rem",
    // 14
    secondaryIconOnlyPadX: "0.625rem",
    // 10
    secondaryIconOnlyMinWidth: "2rem"
    // 32
  },
  small: {
    primaryHeight: "2.5rem",
    // 40 (+8 vs control)
    secondaryHeight: "1.5rem",
    // 24
    primaryGroupGap: "1rem",
    // 16
    secondaryGroupGap: "0.25rem",
    // 4
    primaryPadY: "0.5rem",
    // 8
    secondaryPadX: "0.5rem",
    // 8
    primaryItemGap: "0.375rem",
    // 6
    secondaryItemGap: "0.25rem",
    // 4
    primaryFontSize: "var(--text-body-sm)",
    primaryLineHeight: "var(--leading-body-sm)",
    secondaryFontSize: "var(--text-body-xs)",
    secondaryLineHeight: "var(--leading-body-xs)",
    primaryIconPx: "0.875rem",
    // 14
    secondaryIconPx: "0.75rem",
    // 12
    primaryIconOnlyPadX: "0.75rem",
    // 12
    secondaryIconOnlyPadX: "0.5rem",
    // 8
    secondaryIconOnlyMinWidth: "1.75rem"
    // 28
  },
  extraSmall: {
    primaryHeight: "2rem",
    // 32 (+8 vs control)
    secondaryHeight: "1.25rem",
    // 20
    primaryGroupGap: "0.875rem",
    // 14
    secondaryGroupGap: "0.125rem",
    // 2
    primaryPadY: "0.375rem",
    // 6
    secondaryPadX: "0.375rem",
    // 6
    primaryItemGap: "0.25rem",
    // 4
    secondaryItemGap: "0.1875rem",
    // 3
    primaryFontSize: "var(--text-body-xs)",
    primaryLineHeight: "var(--leading-body-xs)",
    secondaryFontSize: "var(--text-body-xxs)",
    secondaryLineHeight: "var(--leading-body-xxs)",
    primaryIconPx: "0.75rem",
    // 12
    secondaryIconPx: "0.625rem",
    // 10
    primaryIconOnlyPadX: "0.25rem",
    // 4
    secondaryIconOnlyPadX: "0.375rem",
    // 6
    secondaryIconOnlyMinWidth: "1.5rem"
    // 24
  }
};
const BREADCRUMB_SIZE = {
  large: {
    linkGap: "0.625rem",
    // 10px
    trailGap: "0.375rem",
    // 6px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem",
    // 16px
    sepBox: "1.75rem",
    // 28px
    sepIconPx: "0.75rem"
    // 12px
  },
  medium: {
    linkGap: "0.5rem",
    // 8px
    trailGap: "0.25rem",
    // 4px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem",
    // 14px
    sepBox: "1.625rem",
    // 26px
    sepIconPx: "0.6875rem"
    // 11px
  },
  small: {
    linkGap: "0.375rem",
    // 6px
    trailGap: "0.25rem",
    // 4px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem",
    // 12px
    sepBox: "1.5rem",
    // 24px
    sepIconPx: "0.6875rem"
    // 11px
  },
  extraSmall: {
    linkGap: "0.375rem",
    // 6px
    trailGap: "0.125rem",
    // 2px
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
    iconPx: "0.625rem",
    // 10px
    sepBox: "1.5rem",
    // 24px
    sepIconPx: "0.625rem"
    // 10px
  }
};
const SEGMENTED_SIZE = {
  large: {
    height: CONTROL_HEIGHT.large,
    paddingInline: "var(--space-xs)",
    // 16px
    paddingBlock: "0.625rem",
    // 10px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.1875rem",
    // 19px
    iconOnlyPadding: "0.75rem"
    // 12px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingInline: "0.75rem",
    // 12px
    paddingBlock: "0.5rem",
    // 8px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem",
    // 16px
    iconOnlyPadding: "0.625rem"
    // 10px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingInline: "0.625rem",
    // 10px
    paddingBlock: "0.3125rem",
    // 5px
    gap: "0.5rem",
    // 8px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem",
    // 14px
    iconOnlyPadding: "0.4375rem"
    // 7px
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingInline: "0.5rem",
    // 8px
    paddingBlock: "0.125rem",
    // 2px
    gap: "0.25rem",
    // 4px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem",
    // 12px
    iconOnlyPadding: "0.25rem"
    // 4px
  }
};
const LINK_SIZE = {
  large: {
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    gap: "0.5rem",
    // 8px
    iconPx: "1.125rem"
    // 18px
  },
  medium: {
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    gap: "0.5rem",
    // 8px
    iconPx: "0.875rem"
    // 14px
  },
  small: {
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    gap: "0.375rem",
    // 6px
    iconPx: "0.75rem"
    // 12px
  },
  extraSmall: {
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    gap: "0.25rem",
    // 4px
    iconPx: "0.625rem"
    // 10px
  },
  extraExtraSmall: {
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
    gap: "0.25rem",
    // 4px
    iconPx: "0.625rem"
    // 10px
  }
};
const ALERT_SIZE = {
  large: {
    minHeight: "3.5rem",
    // 56px
    paddingInline: "1rem 0.875rem",
    // 16 / 14
    paddingBlock: "0.875rem",
    // 14
    gap: "1rem",
    // 16
    contentGap: "0.625rem",
    // 10
    actionGap: "0.625rem",
    // 10
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.125rem",
    // 18
    iconSlot: "1.5rem",
    // 24
    actionButtonSize: "medium"
  },
  medium: {
    minHeight: "3rem",
    // 48px
    paddingInline: "0.875rem 0.75rem",
    // 14 / 12
    paddingBlock: "0.75rem",
    // 12
    gap: "1rem",
    // 16
    contentGap: "0.4375rem",
    // 7
    actionGap: "0.5rem",
    // 8
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem",
    // 16
    iconSlot: "1.25rem",
    // 20
    actionButtonSize: "small"
  },
  small: {
    minHeight: "2.625rem",
    // 42px
    paddingInline: "0.75rem 0.625rem",
    // 12 / 10
    paddingBlock: "0.625rem",
    // 10
    gap: "0.875rem",
    // 14
    contentGap: "0.375rem",
    // 6
    actionGap: "0.375rem",
    // 6
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem",
    // 14
    iconSlot: "1.125rem",
    // 18
    actionButtonSize: "extraSmall"
  },
  extraSmall: {
    minHeight: "2.125rem",
    // 34px
    paddingInline: "0.625rem 0.5rem",
    // 10 / 8
    paddingBlock: "0.5rem",
    // 8
    gap: "0.875rem",
    // 14
    contentGap: "0.375rem",
    // 6
    actionGap: "0.3125rem",
    // 5
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem",
    // 12
    iconSlot: "1rem",
    // 16
    actionButtonSize: "extraSmall"
  }
};
const TAG_SIZE = {
  large: {
    height: "1.75rem",
    // 28
    paddingInline: "0.625rem",
    // 10
    paddingBlock: "0.3125rem",
    // 5
    gap: "0.5rem",
    // 8
    contentGap: "0.375rem",
    // 6
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem",
    // 14
    closeWidth: "0.75rem"
    // 12
  },
  medium: {
    height: "1.5rem",
    // 24
    paddingInline: "0.5rem",
    // 8
    paddingBlock: "0.3125rem",
    // 5
    gap: "0.375rem",
    // 6
    contentGap: "0.25rem",
    // 4
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem",
    // 12
    closeWidth: "0.625rem"
    // 10
  },
  small: {
    height: "1.25rem",
    // 20
    paddingInline: "0.375rem",
    // 6
    paddingBlock: "0.3125rem",
    // 5
    gap: "0.375rem",
    // 6
    contentGap: "0.25rem",
    // 4
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
    iconPx: "0.625rem",
    // 10
    closeWidth: "0.5rem"
    // 8
  }
};
const TOAST_CHROME = {
  width: "18.75rem",
  // 300
  paddingInline: "0.875rem 0.75rem",
  // 14 / 12
  paddingBlock: "0.75rem",
  // 12
  gap: "1rem",
  // 16
  contentGap: "0.5rem",
  // 8
  actionGap: "0.625rem",
  // 10
  fontSize: "var(--text-body-md)",
  lineHeight: "var(--leading-body-md)",
  iconPx: "1rem",
  // 16
  iconSlot: "1.25rem",
  // 20
  radius: "var(--radius-md)",
  // shape/md — 8px
  shadow: "var(--shadow-lg)"
};
const NOTIFICATION_BANNER_CHROME = {
  padding: "1rem",
  // 16
  gap: "1.5rem",
  // 24
  contentGap: "0.875rem",
  // 14
  actionGap: "0.875rem",
  // 14
  buttonGap: "0.5rem",
  // 8
  iconSize: "2.875rem",
  // 46
  iconBorder: "3px",
  iconPx: "1.375rem",
  // 22
  titleSize: "var(--text-body-lg)",
  titleLineHeight: "var(--leading-body-lg)",
  descriptionSize: "var(--text-body-sm)",
  descriptionLineHeight: "var(--leading-body-sm)",
  radius: "var(--radius-md)"
  // shape/md — 8px
};

export { ALERT_SIZE, BREADCRUMB_SIZE, BUTTON_SIZE, CHECKBOX_SIZE, CHIP_SIZE, CONTROL_HEIGHT, FIELD_WRAPPER_SIZE, FOCUS_RING, ICON_TOGGLE_SIZE, LINK_SIZE, NOTIFICATION_BANNER_CHROME, RADIO_SIZE, SEGMENTED_SIZE, SLIDER_CHROME, TABS_SIZE, TAG_SIZE, TEXT_INPUT_SIZE, TOAST_CHROME, TOGGLE_SIZE, TRANSITION_COLORS };
//# sourceMappingURL=controlSize.js.map
//# sourceMappingURL=controlSize.js.map