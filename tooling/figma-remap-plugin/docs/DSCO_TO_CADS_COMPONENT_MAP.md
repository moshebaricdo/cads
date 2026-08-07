# DSCO → CADS component & prop mapping (proposal)

**Status:** Pass 1 **wired** into Audit (`componentSwaps.ts` Waves A–E + nested/slot apply) — validate on a fixture frame  
**Date:** 2026-08-06  
**Sources:**

- Published `(OLD) DSCO Components` (`ahYTsb3I7rsJNW0n2vnXm6`) — props via `importComponentSetByKeyAsync` / `componentPropertyDefinitions`
- Live CADS file (`DGekOeToRVifvFAhfqpeC1`) — same harvest + local page reads for unpublished/building-block sets
- Existing plugin data: `dscoComponents.ts`, `componentSwaps.ts` (Wave A/B)
- Designer review comments (`MB:`) folded into this revision

Goal: a **deterministic, non-AI** swap table so Audit can update instances in a frame by published DSCO key → CADS set + prop remaps.

### Pass scope (confirmed)

| Pass | Rows | Contents |
| --- | --- | --- |
| **Pass 1** (now) | **#1–46** + **#77–78** | Actions → Overlays (through Modal) + Font Awesome Icon / Duotone |
| **Pass 2** (later) | **#47–76** | Content & Media (🔴), Shell / Lab / AI, Logo, Resize Handle, etc. |

Pass 2 rows stay as `deferred`. True `drop` (no successor) remains report-only.

---

## What “hard” means (slots & nested instances)

Earlier notes used “hard” loosely. It does **not** mean impossible. It means the remap is **not a top-level `setProperties` call** after `swapComponent`.

| Kind | What Figma gives us | What Pass 1 apply must do |
| --- | --- | --- |
| **Top-level props** | Exposed TEXT / BOOLEAN / VARIANT on the instance | Remap names/values → `setProperties` (Wave A/B today) |
| **Nested instances** | Child instances inside the swapped set (Field Wrapper, Text Input Building Block, Dropdown Button, Popover Core, Slider Bar, …) | After swap, find nested instance(s) by stable name/path → `setProperties` on those nodes |
| **SLOT content** | Slot is a container; placeholder TEXT or nested instances live as **children**, not as a single exposed prop | After swap, find TEXT (or known nested instances) inside the slot → set `characters` / swap those children. Cannot “assign a string to the SLOT prop” via `setProperties` |

**Can we / can’t we?**

- **Can:** Walk `instance.findAll` / named children after swap; set nested props; set characters on default TEXT inside a slot (Modal body, Breadcrumb `pageName`, etc.).
- **Can’t (without synthesizing structure):** Invent N new slot children from a DSCO `Quantity=5` axis if the swapped CADS instance doesn’t already contain equivalent nested instances. For that case we **best-effort remap existing nested children** + always apply shell props (e.g. `size`); we do **not** rebuild quantity from scratch in Pass 1.

**Pass 1 approach for composed CADS sets** (Text Input, Dropdown, Chip Group, Breadcrumbs, Popover, Modal, Slider):

1. `swapComponent` → public CADS set.
2. Apply top-level props that exist on that set.
3. **Nested apply** for Field Wrapper / Building Block / Dropdown Button / Popover Core / Slider Bar / etc.
4. **Slot TEXT apply** when a default text node exists in the slot (Modal `customContent`, etc.).
5. Never delete/rebuild the CADS composition from scratch.

---

## Confidence legend

| Level | Meaning |
| --- | --- |
| **High** | Decisions closed; mechanical remap (incl. agreed nested/slot apply). Safe to encode. |
| **Medium** | Successor + values agreed; nested path needs implementation care / light validation in Figma. |
| **Low** | Still structurally fuzzy or intentionally deferred/dropped. |
| **None** | No CADS successor (report-only). |

**Swap status**

| Tag | Meaning |
| --- | --- |
| `shipped` | Already in `componentSwaps.ts` (Wave A/B) — may still need value-table fixes noted below |
| `proposed` | Ready to encode |
| `fix` | Shipped rule exists but MB review requires a value-table correction |
| `drop` | No CADS target / out of scope for migration |
| `deferred` | Out of Pass 1 |

**Global conventions**

| DSCO | CADS | Notes |
| --- | --- | --- |
| Size `L`/`M`/`S`/`XS` | `large`/`medium`/`small`/`extraSmall` | Also accept long form |
| State `Default`/`Hover`/`Focus`/`Pressed`/`Disabled` | `default`/`hover`/`focus`/`press` (or set-specific `pressed`/`focused`) | **Apply forces interactive state → `default`** except where noted (`isActive`, `isCurrent`, `selected`, `isOn`) |
| Boolean-ish `Yes`/`No` | `yes`/`no` or BOOLEAN | Match target type |
| TEXT icon names | pass-through | FA shortcode |

---

## 1. Summary — Pass 1 focus (#1–46, #77–78)

| # | DSCO | → CADS | Comp. | Prop | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Button | Button | High | High | `shipped` |
| 2 | Destructive Button | Button (`color=error`) | High | High | `shipped` |
| 3 | Close Icon Button | Close Icon Button | High | High | `shipped` |
| 4 | Segmented Button Group | Segmented Button Group | High | High | `proposed` |
| 5 | Segmented Button Block | Segmented Button Block | High | High | `proposed` |
| 6 | Icon Toggle Button | Icon Toggle | High | High | `proposed` |
| 7 | Icon Toggle Group | Icon Toggle + Label | High | High | `proposed` |
| 8 | Text Field | Text Input (`type=field`) + nested FW/BB | High | Medium | `proposed` |
| 9 | Text Area | Text Input (`type=area`) + nested FW/BB | High | Medium | `proposed` |
| 10 | Dropdown Field | Dropdown (`role=input`) + nested FW/Button | High | Medium | `proposed` |
| 11 | Input Dropdown | **Dropdown Button** | High | High | `proposed` |
| 12 | Action Dropdown | Dropdown (`role=action`) | High | High | `proposed` |
| 13 | Dropdown Menu Button | Dropdown Button | High | High | `proposed` |
| 14 | Dropdown Menu List | Dropdown Menu List | High | High | `proposed` |
| 15 | Dropdown Menu Items | Dropdown Menu Item | High | High | `proposed` |
| 16 | Checkbox | Checkbox + Label (or bare Checkbox) | High | High | `proposed` |
| 17 | Checkbox Blocks | Checkbox | High | High | `proposed` |
| 18 | Radio Button | Radio Button + Label (or bare Block) | High | High | `proposed` |
| 19 | Radio Buttons Blocks | Radio Buttons Block | High | High | `proposed` |
| 20 | Toggle | Toggle + Label (or bare Toggle) | High | High | `proposed` |
| 21 | Toggle Building Block | Toggle | High | High | `proposed` |
| 22 | Slider | Slider + nested Slider Bar | High | Medium | `proposed` |
| 23 | Slider Bar | Slider Bar | High | High | `proposed` |
| 24 | Slider Stepper | Slider Stepper | High | High | `proposed` |
| 25 | Chip | Chip | High | High | `fix` |
| 26 | Chip Group | Chip Group + nested Field Wrapper | High | Medium | `proposed` |
| 27 | Link | Link | High | High | `shipped` |
| 28 | Tag | Tag | High | High | `shipped` |
| 29 | Breadcrumbs | Breadcrumbs (+ nested children best-effort) | High | Medium | `proposed` |
| 30 | Breadcrumb Link | Breadcrumb Links | High | High | `proposed` |
| 31 | Breadcrumbs Blocks | Breadcrumb Separators | High | High | `proposed` |
| 32 | Tab | Tab Item | High | High | `proposed` |
| 33 | Tab Group | Tab Group | High | High | `proposed` |
| 34 | Pagination Dots | — | None | — | `drop` |
| 35 | Pagination Group | — | None | — | `drop` |
| 36 | Alert | Alert | High | High | `fix` |
| 37 | Toast | Toast | High | High | `fix` |
| 38 | Notification Banner | Notification Banner | High | High | `fix` |
| 39 | Tooltip | Tooltip | High | High | `proposed` |
| 40 | Tooltip Icon | — *(BB nested in Tooltip only)* | None | — | `drop` |
| 41 | Tooltip Tails | — | None | — | `drop` |
| 42 | Popover | Popover + nested Popover Core | High | Medium | `proposed` |
| 43 | Popover Building Blocks | — | None | — | `drop` |
| 44 | Drawer | Drawer | High | High | `proposed` |
| 45 | Dialog | Dialog | High | High | `proposed` |
| 46 | Modal | Modal (+ slot TEXT best-effort) | High | Medium | `proposed` |
| 77 | Font Awesome Icon | Font Awesome Icon v7 | High | High | `shipped` |
| 78 | Font Awesome Duotone Icon | Font Awesome Duotone Icon v7 | High | High | `shipped` |

**Pass 2 (#47–76):** still `deferred` / true `drop` as before — omitted from detail below.

**Also shipped (non-DSCO):** Pegasus FA Icon `6315f244…` → FA Icon v7.

---

## 2. Detailed prop maps (Pass 1)

Interaction `state` omitted unless it carries selection semantics (`isActive`, `isCurrent`, `selected`, `isOn`). Otherwise force CADS `default` on apply.

### 2.1 Actions

#### Button → Button — High / `shipped`

Unchanged Wave A/B. `white (deprecated)` → `secondary`. Restricted combos already handled.

#### Destructive Button → Button — High / `shipped`

Force `color=error`.

#### Close Icon Button → Close Icon Button — High / `shipped`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Size` | `size` | L/M/S/XS |
| `Color` | `color` | Default→primary, Strong→secondary, Solid Black→primary, Solid White→**primary** |
| `State` | `state` | Pressed→press; force default on apply |

CADS-only colors (`brand|pink|…`) are net-new — no DSCO source. OK.

#### Segmented Button Group → Segmented Button Group — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Size` | `size` | L/M/S/XS |
| `Icon Only` | `iconOnly` | Yes/No → yes/no |
| `Color` Primary/Strong | — | **Drop** — collapse to CADS primary chrome |

#### Segmented Button Block → Segmented Button Block — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Label` | `label` | |
| `Left Icon` / `Right Icon` | `startIconName` / `endIconName` | |
| `Show Left/Right Icon` | `startIcon` / `endIcon` | |
| `Size` | `size` | |
| `Position` | `position` | First/Middle/Last → first/middle/last |
| `Icon Only` | `iconOnly` | Yes/No → yes/no |
| `Color` | — | **Drop** |
| `State` **Pressed** | `isActive` | Pressed→**yes**; else `no` (Focus alone does **not** select) |

#### Icon Toggle Button → Icon Toggle — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Icon` | `iconName` | |
| `Size` | `size` | |
| `Type` | `isOn` | **Off to On→`off`**, **On to Off→`on`** |
| `Color` | `color` | Gray→primary, Black→secondary, White→secondary, Teal→brand, Negative→error, Affirmative→success |

#### Icon Toggle Group → Icon Toggle + Label — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Label` | `labelText` | |
| `Show Label` | `hasLabel` | |
| `2nd Button` | `hasTwoToggles` | |
| `Size` | `size` | |
| `Color` | — | **Drop** |

---

### 2.2 Forms

#### Text Field / Text Area → Text Input — Medium / `proposed`

**Strategy:** swap to public **Text Input** (`type=field|area`, `size`), then **nested apply** to Field Wrapper + Text Input Building Block (do not rebuild composition).

| DSCO | Destination | Values |
| --- | --- | --- |
| — | Text Input `type` | Field→`field`, Area→`area` |
| `Size` | Text Input `size` (+ nested) | L/M/S |
| `Label Text` | nested FW `labelText` | |
| `Show Label` | nested FW (no show-label axis yet — label text still applied) | |
| `Help Message` / `Show Help Text` / `Show Icon` / `Icon Name` | nested FW helper\* | |
| `Field Text` / `Show field text` | nested BB placeholder / `isFilled` | |
| `Color` | nested BB `color` | **Black→primary, White→primary, Gray→secondary** |
| `State` | nested BB `state` | Focused→focus, **Activated→press**, Error→error, Read Only→readOnly; apply still may force default for pure interaction |

#### Dropdown Field → Dropdown — Medium / `proposed`

CADS **Dropdown** is already the composed field (Field Wrapper + nested Dropdown Button / menu). Same nested-apply strategy as Text Input.

| DSCO | Destination | Values |
| --- | --- | --- |
| `Size` | Dropdown `size` + nested | |
| Label / Help props | nested Field Wrapper | |
| `Color` | nested Dropdown Button `color` | Black→primary, White→primary, Gray→secondary |
| `State` | nested Dropdown Button `state` | map readOnly/error/disabled; force default for hover/focus/press |
| — | `role` | **Force `input`** |

#### Input Dropdown → Dropdown Button — High / `proposed`

DSCO Input Dropdown was nested inside Dropdown Field — maps to **Dropdown Button**, not the composed Dropdown.

| DSCO | CADS | Values |
| --- | --- | --- |
| `Size` | `size` | |
| `Color` Black/White/Grey | `color` | Black→primary, White/Grey→secondary |
| `Type` Checkbox / Icon List | — | **Drop** (confirmed) — menu type lives on parent Dropdown / Menu List |
| `Open` | — | **Drop** (confirmed) |

#### Action Dropdown → Dropdown — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Size` | `size` | |
| `Alignment` Left/Right | `menuPlacement` | Left→bottomLeft, Right→bottomRight |
| `Mode` Light/Dark | — | **Drop** (frame/theme) |
| `Open` | `open` | |
| — | `role` | **Force `action`** |
| — | `menuType` | default |

#### Dropdown Menu Button → Dropdown Button — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Label` / `Icon Name` / `Show Icon` | `label` / `iconName` / `startIcon` | |
| `Size` | `size` | |
| `Thickness` | `labelStyle` | Thick/Thin → thick/thin |
| `Color` | `color` | Black→primary, White/Grey→secondary |
| `State` | `state` | Read-only→readOnly, Error→error |

#### Dropdown Menu List → Dropdown Menu List — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Show Action Items` | `showActionRow` | |
| `Size` | `size` | |
| `Type` Icon List | `menuType` + `role` | default + **action** |
| `Type` Checkbox List | `menuType` + `role` | checklist + **input** |
| `Select All` / `Color` | — | **Drop** |

#### Dropdown Menu Items → Dropdown Menu Item — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Icon` | `iconName` | |
| `List Item Text` | `label` | |
| — | `hasStartIcon` | **Force `true`** (DSCO always had icons) |
| `Size` | `size` | |
| `Type` | `role` + `itemType` | matrix below |
| `State` Selected | `selected` | Selected→yes |

| DSCO Type | `role` | `itemType` |
| --- | --- | --- |
| Icon - Input | input | default |
| Checkbox - Input | input | checkbox |
| Icon - Action | action | default |
| Destructive - Action | action | **defaultError** |

#### Checkbox → Checkbox + Label — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Text` | `Text` | |
| `Show Text` | retarget | **false → swap to bare Checkbox** |
| `Size` | `size` | |
| `Label Weight` | `labelStyle` | Thick/Thin |
| `Selected` + `Indeterminate` | nested `status` | indeterminate wins; else selected/unselected |

#### Checkbox Blocks → Checkbox — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Size` | `size` | |
| `Selected` / `Indeterminate` | `status` | same merge |
| `State` | `state` | Focused→focused, Pressed→pressed (CADS spelling) |

#### Radio Button → Radio Button + Label — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Text` | `Text` | |
| `Show Text` | retarget | **false → bare Radio Buttons Block** |
| `Size` / `Label Weight` | `size` / `labelStyle` | |
| `Type` Selected/Unselected | nested `selected` | Selected→yes |

#### Radio Buttons Blocks → Radio Buttons Block — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Size` | `size` | |
| `Selected` | `selected` | Yes/No → yes/no |
| `State` | `state` | Focused→focus, Pressed→press |

#### Toggle → Toggle + Label — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Text` | `labelText` | |
| `Show Label` | retarget | false → bare **Toggle** |
| `Size` | `size` | |
| `On/Off` | nested `isOn` | on/off |
| `Label Position` | `labelPlacement` | left/right |
| — | nested `hasIcons` / `onIcon` / `offIcon` | **Force `hasIcons=true`**, `onIcon=check`, `offIcon=xmark` (DSCO always showed these) |

#### Toggle Building Block → Toggle — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Size` | `size` | |
| `Status` | `isOn` | on/off |
| — | `hasIcons` / icons | **Same force:** `hasIcons=true`, check / xmark |

#### Slider → Slider — Medium / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Slider Label` / `Show Label` | `labelText` / `showLabelRow` | |
| `Show Left/Right Button` | `showControls` | true if either |
| `Show Stepper` | `showStepper` | |
| `Input Value` | `displayValue` | |
| `Show Tooltip Icon` | `showHelper` | approximate |
| `Color` | — | **Drop** |
| `Type` Range/Centered | nested Slider Bar `startsFrom` | Range→side, **Centered→center** |

#### Slider Bar → Slider Bar — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `% Filled` | `percentFilled` | remap to CADS option strings (`100% (side)`, etc.) |
| `Starts From` Side/Middle | `startsFrom` | side/center |
| `Type` / `Color` | — | **Drop** |
| `State` | `state` | Disabled→disabled; else default |

#### Slider Stepper → Slider Stepper — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Count` | `stepCount` | 3–6 |
| `Mode` | — | **Drop** |

---

### 2.3 Selection / chips / link / tag

#### Chip → Chip — High / `fix`

Shipped Wave A/B color table is **wrong** vs MB — correct to:

| DSCO | CADS |
| --- | --- |
| Color **Black** | `color=primary` |
| Color **Gray** | `color=secondary` |
| `Selected=Yes` **or** Color **Selected** | `selected=yes` **and** `color=selected (n/a)` |
| `Selected=No` + Gray/Black | `selected=no` + primary/secondary as above |
| `Text` → `label`, `Type` → `labelStyle`, Size L/M/S/XS | as shipped |

Start/end icons: leave off (DSCO Chip had none).

#### Chip Group → Chip Group — Medium / `proposed`

Composed like Text Input (Field Wrapper + chip slot). Nested-apply label via FW.

| DSCO | CADS | Values |
| --- | --- | --- |
| `Size` / `Type` | `size` / `labelStyle` | |
| `Color` Gray/Black | `color` | **Gray→secondary, Black→primary** (same as Chip) |
| `Group Label` / `Show Label` | nested Field Wrapper | apply when present |

#### Link → Link — High / `shipped`

`captureText` → `linkText` remains.

#### Tag → Tag — High / `shipped`

| DSCO | CADS |
| --- | --- |
| `Label` → `labelText`, `Icon Name` → `startIconName` | |
| `Icon` Left/Right/None → `startIcon`/`endIcon` | |
| `Is Removable` → `isDismissible` | |
| Color Teal→brand, Purple→pink, Aqua→info, Error/Warning/Success, Gray/Disabled→neutral | |
| `Fill Style` | **Drop** |
| `State` Disabled | **Drop** |

---

### 2.4 Navigation

#### Breadcrumbs → Breadcrumbs — Medium / `proposed`

| DSCO | CADS | Strategy |
| --- | --- | --- |
| `Size` | `size` | always |
| Nested Breadcrumb Link / Blocks | nested instances in SLOT | **best-effort** remap children that exist after swap (same rules as #30/#31) |
| `Quantity` / `Show Home Link` | — | **Do not synthesize** missing children from Quantity |

#### Breadcrumb Link → Breadcrumb Links — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Type` Text/Icon | `iconOnly` | Icon→yes, Text→no |
| `Size` | `size` | |
| `State` Active | `isCurrent` | Active→Yes; Visited→default |
| child text / icon | `pageName` / `iconName` / `startIcon` | capture |

#### Breadcrumbs Blocks → Breadcrumb Separators — High / `proposed`

`Size` → `size`. Drop `Type=Separator`.

#### Tab → Tab Item — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Label` / icons / Closeable | `labelText` / start|end icon\* / `isDismissible` | |
| `Size` / `Type` / `ONLY Icon` | `size` / `type` / `iconOnly` | lower-case type |
| `State` Active | `isCurrent` | Active→yes |
| `Mode` | — | **Drop** |

#### Tab Group → Tab Group — High / `proposed`

`Size` + `Type`; drop `Mode`.

#### Pagination Dots / Group — None / `drop`

No DSCO→CADS Pagination migration. CADS Pagination is net-new. Report-only if these DSCO instances appear.

---

### 2.5 Messaging & overlays

#### Alert / Toast / Notification Banner — High / `fix`

Sentiment corrections from MB:

| DSCO Meaning | Alert / Banner | Toast |
| --- | --- | --- |
| Primary | brand | **brand** (CADS Toast axis renamed from `primary` → `brand` — fix Wave A/B) |
| Brand | brand | brand |
| Success / Danger|Error / Warning / Info | same | same |
| Gray | neutral | neutral |
| Aqua | **brand** | **brand** (was pink) |

Other shipped prop renames unchanged (`hasLink`→`hasAction`, etc.).

#### Tooltip → Tooltip — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Tooltip Text` | `text` | |
| `Has Tail` | `hasCaret` | |
| `Type` IconLeft / IconRight / Label | `startIcon` (+ icon name from nested Tooltip Icon if present) | IconLeft **or IconRight** → startIcon true; Label → false |
| `Size` | — | **Drop** |
| `Direction` | `caretPlacement` | **Inverted:** DSCO Direction = vs anchor; CADS = caret side on bubble. OnBottom→**top**, OnTop→**bottom**, OnLeft→**right**, OnRight→**left** |

When converting a Tooltip that nests DSCO **Tooltip Icon**, read that nested icon’s glyph → CADS Tooltip `iconName` / `startIcon`. Do **not** swap the nested node to CADS Icon Tooltip (unrelated component).

#### Tooltip Icon → `drop`

DSCO building block only — nests into Tooltip. **No** mapping to CADS Icon Tooltip (different component; no connection). Surface instances of Tooltip Icon alone → report-only / no swap. Glyph transfer happens only via parent Tooltip conversion above.

#### Tooltip Tails → `drop`

Absorbed into Tooltip caret.

#### Popover → Popover + nested Core — Medium / `proposed`

| DSCO | Destination |
| --- | --- |
| `Direction` (≠ None) | Popover `hasCaret=true` + `caretPlacement` (**inverted** like Tooltip: OnBottom→topCenter, OnTop→bottomCenter, OnLeft→rightCenter, OnRight→leftCenter) |
| `Direction=None` | `hasCaret=false` |
| `Text` / `Title` / Icon / actions / Image | **nested Popover Core** props (`bodyText`, `titleText`, `hasActionRow`, `content`, etc.) |

Swap top-level to **Popover**, then nested-apply Core. Do not split into two top-level instances.

#### Popover Building Blocks → `drop`

Never used independently in DSCO; Core is not a standalone migration target.

#### Drawer → Drawer — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| Title / Description / Show\* | titleText / descriptionText / has\* | |
| `Has Custom Content` | `type` | Yes→customContent, No→textOnly |
| `Success State` | — | **Drop** |

#### Dialog → Dialog — High / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| Title / Text | titleText / descriptionText | |
| Show Secondary / Top Icon / Show Image / Closeable | hasSecondaryAction / topIconName / hasImage / isDismissable | |
| Type Default / Icon Top | type | default / iconTop |

#### Modal → Modal — Medium / `proposed`

| DSCO | CADS | Values |
| --- | --- | --- |
| `Title` | `titleText` | |
| `Content` TEXT | TEXT inside `customContent` slot | **best-effort:** after swap, find default TEXT in slot → set `characters` |
| Closeable / Show 2ary | isDismissable / hasSecondaryAction | |
| Scrollbar | — | **Drop** |
| Type Default / Image Top / Image Inline | type | default / verticalImage / horizontalImage |

---

### 2.8 Icons (Pass 1)

#### Font Awesome Icon / Duotone → v7 — High / `shipped`

Identity prop surfaces.

---

## 3. Implementation sketch (Pass 1)

1. **Fix shipped tables (`fix`):** Chip Black→primary / Gray→secondary / Selected→`selected=yes` + `color=selected (n/a)`; Alert/Banner/Toast Aqua→brand; Toast Primary→**brand**.
2. **Encode Wave C** High `proposed` rules (Segmented, Icon Toggle, Checkbox/Radio/Toggle, Dropdown Button/List/Item, Action Dropdown, Input Dropdown→Dropdown Button, Tabs, Breadcrumb Links/Separators, Drawer, Dialog, Tooltip, Slider Bar/Stepper, …).
3. **Add nested-apply helper** in `components.ts`: after `swapComponent`, resolve nested instances by name and apply a second prop payload (FW, BB, Dropdown Button, Popover Core, Slider Bar).
4. **Add slot-TEXT helper:** find default TEXT under a named slot / frame → set characters (Modal Content, Breadcrumb pageName when needed).
5. **Retarget-by-boolean:** Checkbox/Radio/Toggle Show\* = false → bare control set.
6. **Drops:** Pagination Dots/Group, Tooltip Icon, Tooltip Tails, Popover Building Blocks — `cadsName: null`, no swap. (Tooltip Icon glyph still folds into parent Tooltip nested apply.)
7. **Clear stale suggestion:** ~~Tooltip Icon → Icon Tooltip~~ → `cadsName: null` (**done** in `dscoComponents.ts`).
8. **Wave E composed sets** (Text Input, Dropdown Field, Chip Group, Breadcrumbs shell, Popover, Modal, Slider+Bar): ship with nested/slot helpers; validate on a fixture frame.
9. Pass 2 later: shell/AI/media.

---

## 4. Open questions

**Pass 1: none.** Final confirms (2026-08-06):

1. Toast CADS sentiment `primary` → **`brand`** (live Figma renamed).
2. Chip selected color option string = **`selected (n/a)`**.
3. Tooltip Icon → **`drop`** (DSCO BB only; no link to CADS Icon Tooltip). Glyph via parent Tooltip nested apply only.
4. Input Dropdown `Type` / `Open` → **drop** on Dropdown Button swap.

### Deferred (Pass 2)

Shell/AI/media, Lab Nav→Studio Global Nav catalog key, 🔴 publish-key refresh.

---

## 5. Implementation waves (updated)


| Wave | Pass | Scope | Status |
| --- | --- | --- | --- |
| **A/B** | 1 | Button, Destructive, Close, Link, Tag, FA | `shipped` — Chip/Alert/Toast/Banner/`Close` value fixes applied |
| **C** | 1 | Flat High remaps (Segmented, Icon Toggle, Checkbox/Radio/Toggle, Dropdown Button/List/Item, Action Dropdown, Input→Dropdown Button, Tabs, Breadcrumb Links/Separators, Drawer, Dialog, Tooltip, Slider Bar/Stepper, …) | **Wired** |
| **E** | 1 | Nested/slot: Text Input, Dropdown Field, Chip Group, Breadcrumbs, Popover, Modal, Slider→Bar | **Wired** (FW `labelText` prop) |
| **D / F** | 2 | Shell/AI + 🔴 media | Deferred |

---

## 6. Harvest notes

- Props harvested 2026-08-06 via Figma MCP `use_figma` + `importComponentSetByKeyAsync`.
- MB review answers incorporated same day; confidence bumped where decisions closed.
- Nested/slot work is an apply-path feature, not a mapping blocker.
