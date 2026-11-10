# @moshebari/cads-react

## 0.4.0

### Minor Changes

- a2e0002: Realign GlobalHeader, ProgressWidget, CardButton, and Modal with Figma.

  - **GlobalHeader**: new `template` state with `startContent` / `centerContent` slots; breakpoints now follow Figma (≥992 `desktop`, 768–991 `tablet`, 576–767 `smallTablet`, <576 `mobile`). Phone layout per Figma: CodeAI mark, menu-only end cluster, icon-only standalone actions, and labLevel Share / Remix in the Progress Widget "More" menu (the ellipsis overflow is removed). tutorPlus shows the Tutor+ glyph. `tabletMobile` is a deprecated alias of `tablet`.
  - **ProgressWidget**: 768–991 puts the active bubble in its own slot; below 768 the dropdown and cloud fold into a back + ellipsis "More" menu (`moreMenuOptions`, `onMoreMenuAction`). New `saveStatus="unsaved"` (`offline` deprecated alias), `showSaveStatus`, and `version="template"` with `startSlot` / `middleSlot` / `endSlot`. `levelLabel` is now optional. The old number-only phone dropdown is retired.
  - **CardButton**: Figma geometry refresh (horizontal/medium 56px, small 40px, 4px title↔description gap, tighter line-heights, vertical top-weighted padding) and a new `startIconColor` prop.
  - **Modal**: new `footerStartContent` slot on the left of the footer (Figma `actionGroup`).

## 0.3.0

### Minor Changes

- 5da3db8: Add `CardButton`: a clickable card with horizontal/vertical layout, medium/small size, title + optional description, start icon or `startContent` slot, end icon, selected state, `fullWidth`, link cards via `href`, and experimental Motion Press.

## 0.2.1

### Patch Changes

- fcd0e19: Dropdown checklist menus now show a single Select all / Clear all toggle plus a Done button that closes the menu, with Action Row buttons one size smaller than the menu (matches Figma Menu List).
- b692cd8: Dropdown checklist Done button shows the selected count, e.g. "Done (3)".

## 0.2.0

### Minor Changes

- 0e8c5c2: Add Global Header chrome components: `GlobalHeader` (six page states with desktop / tablet-mobile behavior under 960px), `ProgressWidget` (hug-until-truncate level dropdown, cloud sync IconTooltip, bubble rail that folds into a nested dropdown bubble below 960px), and `ProgressBubble` (levelType × status × isActive × isAssessment with hover/press/focus/disabled states).
- 3dbe682: Publish to public npm as `@moshebari/*`. Docs keep FA7 Pro OTFs; the published tarball ships Font Awesome 7 Free webfonts.

### Patch Changes

- c53fa28: ProgressWidget shows a leading outlined Back button (`hasLeftAction`) on tablet/mobile, matching the Figma left action slot.
- Updated dependencies [3dbe682]
  - @moshebari/cads-variables@0.2.0

## 0.1.2

### Patch Changes

- a1f1641: Dialog and Modal honor `isDismissable` (no forced close chrome) and accept `maxWidth`.
- cf973a2: Dropdown adds menuType=custom (blank canvas + customContent) and an action trigger slot. Breadcrumb Overflow now nests that Dropdown menu.
- Updated dependencies [a1f1641]
  - @moshebari/cads-variables@0.1.2

## 0.1.1

### Patch Changes

- 2dfffd4: AiChatMessage accepts inline rich children and an optional customContent slot for upcoming in-chat cards.
