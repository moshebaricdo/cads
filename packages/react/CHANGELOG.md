# @moshebari/cads-react

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
