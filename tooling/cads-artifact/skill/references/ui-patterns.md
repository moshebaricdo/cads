# CodeAI UI patterns

How to compose CADS components so a prototype *feels like CodeAI*, not just
"uses the right widgets." Derived from the shipping product surfaces (Lab2
student labs, Web Lab 2, the assessment builder, the teacher dashboard, and
public workshop pages). Follow these rules in addition to the component
manifest — they cover the layout and color decisions the manifest can't.

## 1. Pick the territory first

Every CodeAI screen belongs to one of four territories. Decide which one you
are prototyping before placing components — density and chrome follow from it.

| Territory | Model | Density | Typical gaps |
|---|---|---|---|
| Lab shell (student/creator tools) | fixed full-viewport app shell | dense | `xs` gaps, `xs`–`s` padding |
| Dashboard page (teacher/admin) | brand bar + scrolling page | medium | `s` gaps, `s`–`m` padding |
| Marketing / public page | centered column, big headings | airy | `m`–`xxl` spacing |
| Dialog / overlay | dimmed page + centered card | medium | `s` padding, `xs` gaps |

Rule of thumb: **chrome is tight, content is airy.** Never pad chrome
(headers, rails, property rows) to look luxurious; give the extra room to
headings, body copy, and empty space around content.

## 2. Layout scaffolds

### App shell (lab territory)

```
[ Brand top bar — 50px, --background-brand-primary, white text/icons ]
[ left icon rail | collapsible panel (280–360px) | workspace ........ ]
```

- Top bar: logo left; centered white progress pill with green lesson bubbles
  (`--background-success-primary`) when there is a progression; outline
  "user" button right (transparent fill, white text).
- Panel headers are 40px, white, with a bottom hairline
  (`--border-neutral-primary`) and a **centered small-caps overline label**
  ("WORKSPACE", "AI TUTOR") in `--text-neutral-quaternary`.
- The Continue CTA is a full-width brand-primary Button at the bottom of the
  left panel (or top-bar right), usually with a trailing arrow: "Continue →".
  It is the only persistent brand-filled control in lab chrome.

### Dashboard page (teacher territory)

```
[ Brand top bar ]
[ optional 220px sidebar | white content column ]
```

- Sidebar: `--background-neutral-secondary` fill, right hairline, groups
  labeled with overlines ("CLASS SECTIONS", "PERFORMANCE"); items are
  icon + label rows; the active item gets `--background-neutral-tertiary`
  plus a 3–4px `--background-selected-primary` edge bar — **not** a brand
  fill.
- Content column: big page heading (headingLarge), then bordered cards.
- Card nesting signature: white bordered card → gray
  (`--background-neutral-secondary`) inner well → smaller white bordered
  sub-cards/action rows inside the well.

### Marketing / public page

```
[ Brand top bar ] [ breadcrumbs ] [ light-gray heading band with H1 ]
[ two-column: content | sidebar cards ] [ near-black footer ]
```

- Heading band: `--background-neutral-secondary`, headingLarge title.
- Sidebar cards hold enrollment/identity info with overline field labels
  ("FULL NAME", "EMAIL") above values.
- Footer: `--background-neutral-black-fixed` with small white links.

### Inspector / property panel (builder territory)

A floating card 226–280px wide: white, 1px hairline, radius-md, soft shadow.
Structure it as:

1. A 32px gray header strip (`--background-neutral-secondary`) with an
   overline label naming the selection ("SHAPE") and a bare close glyph.
2. Hairline-separated sections, each with a sentence-case semibold title
   ("Appearance", "Typography", "Rotation", "Actions").
3. Dense rows (~24–28px): label left in small secondary text, compact
   control right (`size: "extraSmall"` or `"small"`).

### Dialog

- Use the CADS Dialog/Modal components. Celebration variant: centered
  illustration/icon on top, heading, centered copy, optional overline-labeled
  utility row, and exactly one brand-primary CTA.
- Success/save feedback belongs in an **inline banner inside the owning
  panel** (Alert with success sentiment) — not a floating toast — with a
  dismiss control.

## 3. Composition and density rules

- Group with **overlines**: small semibold uppercase labels
  (letter-spacing wide, `--text-neutral-quaternary`/`secondary`). This is the
  universal CodeAI grouping device for sidebars, panel headers, eyebrows, and
  field groups. Do not invent bold sentence-case section labels in chrome.
- Cards default to: white fill + 1px `--border-neutral-primary` +
  radius-md. Tinted cards (no border) use `--background-brand-light` for
  promos or `--background-neutral-secondary` for resource groups only.
- One brand-primary CTA per screen region. Everything else is outline or
  text/tertiary.
- Icon + label pairs lead nav items and action rows; icon-only buttons are
  allowed only in rails/toolbars and always need an accessible name.
- Empty states are invitational and inline: a dashed/ghost affordance where
  the content will appear, with the action embedded ("Assign a course +").

## 4. Color language (brand vs selected vs status)

- **Brand** (`--background-brand-primary`, `--text-brand-primary`,
  `--border-brand-primary`): global top bar, primary CTAs, links. Nothing
  else.
- **Selected** (`--background-selected-primary` + `--text-selected-primary`
  + `--border-selected-primary`): active tabs and segmented buttons, selected
  canvas objects, active-nav edge bars, filled selected chips. The three
  selected tokens are designed as a set — never mix a selected fill with any
  other text color, and never use brand fill for a selected state.
- **Status:** success = progress and saved states; warning = stale/attention
  banners; error = destructive actions and validation; info = neutral
  callouts. Use the `-light` backgrounds for banners with `-secondary` text.
- **Accent orange** (`--background-accent-orange-primary`): Run buttons and
  small hover accents only. Never a generic CTA color.
- **Neutrals** do all layout work: white primary surfaces,
  `--background-neutral-secondary` wells/rails, hairlines via
  `--border-neutral-primary`, text stepping primary → secondary →
  quaternary → placeholder.
- Focus is always a 2px `--border-focused-primary` ring (never removed).

## 5. Type rules

- Space Grotesk (`headingLarge` in prototype specs / `--font-heading`) only
  at display sizes — page titles and dialog headlines. Everything else is
  the body family.
- Body copy in cards is small (`bodySmall`) and `--text-neutral-secondary`;
  reserve primary text color for titles, labels, and values.
- Buttons and controls get their type from `size` — do not restyle them.

## 6. Do / Don't

**Do**

- Choose control heights via `size`: large 48 / medium 40 / small 32 /
  extraSmall 24. Dense panels use small/extraSmall; marketing CTAs use
  medium/large.
- Start lab/builder prototypes from the shell (top bar + panels), then fill
  the workspace.
- Use `surface` layout nodes (or bordered cards) for every grouped block on
  dashboard/marketing pages.
- Pair every icon-only control with an `aria-label`.
- Put save/success feedback inline in the panel that owns the action.

**Don't**

- Don't hard-code hex colors or invent variables (`--ds-*` does not exist in
  CADS).
- Don't use brand purple for selected states, or selected tokens for CTAs.
- Don't put more than one brand-filled button in a region.
- Don't use Space Grotesk for body text, labels, or small headings.
- Don't pad chrome rows/headers beyond their compact heights; don't cram
  content sections to lab density on dashboard/marketing pages.
- Don't use toasts for save confirmation; don't use dialogs for inline
  validation.
