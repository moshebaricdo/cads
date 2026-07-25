const e = {
  large: "var(--control-height-large)",
  medium: "var(--control-height-medium)",
  small: "var(--control-height-small)",
  extraSmall: "var(--control-height-extra-small)"
}, r = {
  large: {
    height: e.large,
    paddingInline: "var(--spacing-p-xs)",
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
    height: e.medium,
    paddingInline: "var(--spacing-p-xs)",
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
    height: e.small,
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
    height: e.extraSmall,
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
}, a = {
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
}, i = {
  large: {
    trackWidth: "2.625rem",
    // 42px
    trackHeight: "1.375rem",
    // 22px — matches Checkbox/Radio large
    handle: "1.125rem",
    // 18px
    pad: "0.125rem",
    // 2px
    handleTravelPx: 20,
    // 42 − 18 − 4
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
    handleTravelPx: 18,
    // 38 − 16 − 4
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
    handleTravelPx: 16,
    // 34 − 14 − 4
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
    handleTravelPx: 14,
    // 30 − 12 − 4
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
}, n = {
  large: {
    size: e.large,
    padding: "0.75rem",
    // 12px
    iconPx: "1.1875rem",
    // 19px
    iconSlot: "1.5rem"
    // 24px
  },
  medium: {
    size: e.medium,
    padding: "0.625rem",
    // 10px
    iconPx: "1rem",
    // 16px
    iconSlot: "1.25rem"
    // 20px
  },
  small: {
    size: e.small,
    padding: "0.4375rem",
    // 7px
    iconPx: "0.875rem",
    // 14px
    iconSlot: "1.125rem"
    // 18px
  },
  extraSmall: {
    size: e.extraSmall,
    padding: "0.25rem",
    // 4px
    iconPx: "0.75rem",
    // 12px
    iconSlot: "1rem"
    // 16px
  }
}, m = "0 0 0 2px var(--background-neutral-primary), 0 0 0 4px var(--border-focused-primary)", o = "var(--transition-colors)", t = "var(--transition-fade)", d = {
  large: {
    height: e.large,
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
    height: e.medium,
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
    height: e.small,
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
    height: e.extraSmall,
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
}, l = {
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
}, g = {
  large: {
    height: e.large,
    areaHeight: "6.5rem",
    // 104px
    paddingInline: "var(--spacing-p-xs)",
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
    height: e.medium,
    areaHeight: "5.5rem",
    // 88px
    paddingInline: "var(--spacing-p-xs)",
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
    height: e.small,
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
    height: e.extraSmall,
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
}, p = {
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
}, c = {
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
}, x = {
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
}, s = {
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
}, y = {
  large: {
    height: e.large,
    paddingInline: "var(--spacing-p-xs)",
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
    height: e.medium,
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
    height: e.small,
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
    height: e.extraSmall,
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
}, h = {
  large: {
    height: e.large,
    groupGap: "1.5rem",
    // 24px
    mobileGroupGap: "var(--spacing-p-xs)",
    // 16px
    clusterGap: "var(--spacing-p-xs)",
    // 16px
    dividerHeight: "1rem",
    // 16px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)"
  },
  medium: {
    height: e.medium,
    groupGap: "1.5rem",
    // 24px
    mobileGroupGap: "0.75rem",
    // 12px
    clusterGap: "var(--spacing-p-xs)",
    // 16px
    dividerHeight: "1rem",
    // 16px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)"
  },
  small: {
    height: e.small,
    groupGap: "var(--spacing-p-xs)",
    // 16px
    mobileGroupGap: "0.5rem",
    // 8px
    clusterGap: "0.5rem",
    // 8px
    dividerHeight: "1rem",
    // 16px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)"
  },
  extraSmall: {
    height: e.extraSmall,
    groupGap: "var(--spacing-p-xs)",
    // 16px
    mobileGroupGap: "0.375rem",
    // 6px
    clusterGap: "0.5rem",
    // 8px
    dividerHeight: "1rem",
    // 16px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)"
  }
}, b = {
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
}, v = {
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
}, S = {
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
}, I = {
  /**
   * Figma symbol width for the default string ("This is a toast.").
   * Surface layout is hug — this is a reference size, not a hard CSS width.
   */
  defaultWidthPx: 300,
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
  radius: "var(--shape-md)",
  // shape/md — 8px
  shadow: "var(--shadow-lg)"
}, H = {
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
  radius: "var(--shape-md)"
  // shape/md — 8px
};
export {
  v as ALERT_SIZE,
  s as BREADCRUMB_SIZE,
  r as BUTTON_SIZE,
  a as CHECKBOX_SIZE,
  d as CHIP_SIZE,
  e as CONTROL_HEIGHT,
  p as FIELD_WRAPPER_SIZE,
  m as FOCUS_RING,
  n as ICON_TOGGLE_SIZE,
  b as LINK_SIZE,
  H as NOTIFICATION_BANNER_CHROME,
  c as RADIO_SIZE,
  y as SEGMENTED_SIZE,
  l as SLIDER_CHROME,
  h as TABLE_PAGINATION_SIZE,
  x as TABS_SIZE,
  S as TAG_SIZE,
  g as TEXT_INPUT_SIZE,
  I as TOAST_CHROME,
  i as TOGGLE_SIZE,
  o as TRANSITION_COLORS,
  t as TRANSITION_FADE
};
//# sourceMappingURL=controlSize.js.map
