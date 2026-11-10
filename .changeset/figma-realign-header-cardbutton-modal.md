---
"@moshebari/cads-react": minor
---

Realign GlobalHeader, ProgressWidget, CardButton, and Modal with Figma.

- **GlobalHeader**: new `template` state with `startContent` / `centerContent` slots; breakpoints now follow Figma (≥992 `desktop`, 768–991 `tablet`, 576–767 `smallTablet`, <576 `mobile`). Phone layout per Figma: CodeAI mark, menu-only end cluster, icon-only standalone actions, and labLevel Share / Remix in the Progress Widget "More" menu (the ellipsis overflow is removed). tutorPlus shows the Tutor+ glyph. `tabletMobile` is a deprecated alias of `tablet`.
- **ProgressWidget**: 768–991 puts the active bubble in its own slot; below 768 the dropdown and cloud fold into a back + ellipsis "More" menu (`moreMenuOptions`, `onMoreMenuAction`). New `saveStatus="unsaved"` (`offline` deprecated alias), `showSaveStatus`, and `version="template"` with `startSlot` / `middleSlot` / `endSlot`. `levelLabel` is now optional. The old number-only phone dropdown is retired.
- **CardButton**: Figma geometry refresh (horizontal/medium 56px, small 40px, 4px title↔description gap, tighter line-heights, vertical top-weighted padding) and a new `startIconColor` prop.
- **Modal**: new `footerStartContent` slot on the left of the footer (Figma `actionGroup`).
