# M15: shadcn parity audit

**Done.** Planned in the [roadmap](DMF-UI-ROADMAP.md).
- Part 1 (dmfeisal/dmf-ui#26): the static audit of names, variants and attributes.
- Part 2a (dmfeisal/dmf-ui#27): rendered measurement.
- Part 2b (dmfeisal/dmf-ui#28): the per-family optimization baseline.
- Part 2c (dmfeisal/dmf-ui#29): compound parts, measured inside their parent and in open overlays.
- M16 batches (this report's last part): the record ordered into six batches.

M15 changes no component file.

## What part 1 adds

**References** (`vendor/shadcn/`, not packed)
- shadcn/ui base-nova sources for 57 families (`base/<family>.tsx.txt`), plus their docs pages (`docs/<family>.mdx`, which include Data Table, Date Picker and Typography).
- They come from the revision already pinned in `contracts/design-profile.json` (`481d523`). Sonner has no base docs page at that revision.
- `MANIFEST.json` records each file's source path and SHA-256.
- `npm run shadcn:vendor` refetches the files. This is only needed when the pin changes.

**Parity record** (`docs/DMF-UI-SHADCN-PARITY.json`)
- It has one entry for each of the 50 families that both libraries have. Each entry has a status per item:

| Section | What it compares |
| --- | --- |
| `parts` | exported components, e.g. `DialogHeader` |
| `slots` | `data-slot` names |
| `variants` | every variant axis and value: `cva` variants and literal-union props such as Avatar `size` |
| `props` | props and their defaults for each component both sides export |
| `dataAttributes` | `data-*` attributes set in markup or by scripts |
| `stateHooks` | state attributes the styles use, e.g. `data-active`, `aria-invalid`, `data-[variant=line]` |
| `nova` | the Nova utilities from `style-nova.css` behind each slot, variant and size |

- **Statuses:**
  - `match`
  - `gap`: shadcn has it and DMF UI doesn't.
  - `differs`: both have it, with different defaults.
  - `extra`: DMF UI has it and shadcn doesn't.
  - `intentional`: a recorded owner decision covers the difference.
- Decisions live in `docs/DMF-UI-SHADCN-PARITY-DECISIONS.json`. There are two so far, both for Button: the `md` size alias and the `as` prop.

**Checks**
- `npm run shadcn:check` runs as part of `npm run check`. It fails when a vendored file changes, when the record is stale, or when a decision no longer covers a difference.
- `tests/shadcn-parity.test.mjs` tests the extractor and checks that the record is current and covers every shared family.
- Gaps are reported, not failed. M16 closes them.

## Findings

Totals across the 50 families:

| Status | Items |
| --- | --- |
| match | 643 |
| intentional | 2 |
| gap | 345 |
| differs | 2 |
| extra | 619 |

**17 families have no gaps:** Accordion, Aspect Ratio, Badge, Button, Button Group, Card, Dialog, Empty, Hover Card, Item, Kbd, Native Select, Popover, Radio Group, Skeleton, Spinner and Switch. Their remaining work is reviewing their extras.

**Gaps and differences by family** (families with any):

| Family | Total | Parts | Slots | Variants | Props | Data attrs | State hooks | Extras |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sidebar | 76 | 22 | 20 | 14 | 4 | 6 | 10 | 5 |
| combobox | 42 | 14 | 16 | 0 | 0 | 1 | 11 | 6 |
| navigation-menu | 25 | 7 | 6 | 0 | 1 | 0 | 11 | 8 |
| alert-dialog | 23 | 3 | 11 | 2 | 3 | 1 | 3 | 4 |
| input-group | 20 | 3 | 1 | 11 | 1 | 2 | 2 | 1 |
| toggle-group | 17 | 1 | 1 | 2 | 3 | 4 | 6 | 14 |
| sheet | 16 | 0 | 10 | 2 | 1 | 0 | 3 | 7 |
| pagination | 12 | 6 | 4 | 0 | 0 | 2 | 0 | 6 |
| breadcrumb | 11 | 6 | 5 | 0 | 0 | 0 | 0 | 6 |
| dropdown-menu | 11 | 4 | 4 | 0 | 1 | 0 | 2 | 51 |
| avatar | 10 | 5 | 4 | 0 | 0 | 0 | 1 | 6 |
| drawer | 10 | 0 | 2 | 0 | 2 | 2 | 4 | 46 |
| toast | 10 | 2 | 1 | 0 | 2 | 0 | 5 | 34 |
| toggle | 9 | 0 | 1 | 3 | 1 | 0 | 4 | 11 |
| carousel | 8 | 1 | 4 | 0 | 3 | 0 | 0 | 20 |
| progress | 8 | 4 | 4 | 0 | 0 | 0 | 0 | 10 |
| slider | 7 | 0 | 3 | 0 | 1 | 0 | 3 | 7 |
| select | 6 | 2 | 2 | 0 | 1 | 0 | 1 | 37 |
| table | 5 | 1 | 2 | 0 | 0 | 0 | 2 | 8 |
| checkbox | 3 | 0 | 1 | 0 | 0 | 0 | 2 | 2 |
| collapsible | 3 | 2 | 1 | 0 | 0 | 0 | 0 | 5 |
| field | 2 | 0 | 1 | 0 | 0 | 0 | 1 | 7 |
| input | 2 | 0 | 1 | 0 | 1 | 0 | 0 | 1 |
| tooltip | 2 | 1 | 1 | 0 | 0 | 0 | 0 | 32 |
| alert, attachment, code-block, command, label, resizable, separator, tabs, textarea | 1 each | | | | | | | |

**What stands out**
- **Single-component families.**
  - Sidebar, Combobox and Navigation Menu are each one Astro component in DMF UI. shadcn splits them into 7–22 parts (`SidebarMenuButton`, `ComboboxChips`, `NavigationMenuTrigger` and so on).
  - These three account for 143 of the 347 gaps and differences. They are the largest M16 batch, and they change public API.
- **Missing variants.**
  - Input Group lacks shadcn's addon `align` (inline-start, inline-end, block-start, block-end) and the button sizes `xs`, `sm`, `icon-xs` and `icon-sm`.
  - Toggle lacks `size` (`default`, `sm`, `lg`).
  - Alert Dialog lacks `size` (`default`, `sm`).
  - Sheet uses logical `side` values (`inline-start`, `inline-end`) where shadcn uses `left` and `right`, and it defaults to `inline-end` where shadcn defaults to `right`.
- **State attributes.**
  - shadcn's Base UI styles boolean state attributes: `data-open`, `data-closed`, `data-active`, `data-highlighted`, `data-starting-style`.
  - DMF UI mostly uses `data-state="open"` and ARIA.
  - Each family needs a decision in M16: match the attribute, or record the equivalent as intentional.
- **Extras.** These are mostly DMF configuration attributes that its enhancement scripts read, such as `data-close-delay` and `data-mount-strategy`, and its own props: `mountStrategy`, `activationMode`, Table `density`, Skeleton `shape`. Each needs a keep-or-remove decision. Decisions accept a `*` suffix, so one decision can cover a group such as `dataAttributes:data-close-*`.

**Known limits of part 1**
- Base UI sets some attributes and props at runtime that its source doesn't name. Tabs `orientation` is one: it shows as a DMF extra although shadcn supports it. These are found only where shadcn styles them. Each extra should be reviewed against the vendored docs page before a decision.
- Variant axes are merged per family on both sides.
- Rendered sizes, colours and spacing are not measured yet. The `measured` field is empty until part 2.

## Part 2a: rendered measurement

**How it measures**
- The internal page `/internal/shadcn-parity/` renders each case as the real DMF UI component. It is not linked, has `noindex`, and isn't packed.
- The cases come from `src/data/shadcn-parity-cases.json`, which `npm run shadcn:write` generates from the record. That gives 95 cases across 22 root components. Button covers the full product of its 6 variants and 8 sizes (48 cases); other components cover each axis value.
- The `shadcn-parity` browser scenario builds the matching shadcn element beside each one: same tag, the same base-nova classes and data attributes, and the same text.
- The reference styles come from `src/styles/shadcn-reference.css`. It compiles the vendored `style-nova.css` and the case classes against DMF UI's own Tailwind theme, so both sides resolve the same Neutral tokens.
- The scenario compares computed styles in light and dark: height, padding, gap, radius, border width and colour, font size, weight, line height, letter spacing, colour, background, opacity, plus width for void elements.
- A border colour is only compared when there is a border. Sizes within half a pixel count as matching.

**What the reference adds to stand in for shadcn's runtime**
- The parts of Tailwind preflight that shadcn assumes, scoped to the reference elements, plus its base border colour.
- DMF UI's radius scale, because a raw `var(--radius-md)` inside an arbitrary value is not emitted as a theme variable.
- Base UI's resting attributes where the source doesn't show them: `data-unchecked` on Checkbox and Switch, `data-orientation` on Separator.
- The element tags Base UI renders for Checkbox, Switch and Toggle are an assumption. With the preflight reset and classes that set `display`, the tag doesn't change the measured box.

**Guard**
- The differences are stored per family under `measured` in the record.
- The scenario fails when the set of differing case, property and theme combinations changes. The values themselves are informative only, because font metrics differ between platforms.
- To accept a change: `npm run shadcn:write -- --measured .dmf-ui-test-results/shadcn-parity-measured.json`.

**Results**

12 of 95 cases match in light and 11 in dark. These match fully:
- Alert, Aspect Ratio, Button Group, Checkbox, Input, Label, Separator and Switch
- Spinner, in light only

| Family | Match (light / dark) | Differing properties |
| --- | --- | --- |
| button | 0/48 | padding, plus sm font size and destructive colour (see below) |
| item | 0/9 | padding, gap, height, radius |
| badge | 0/6 | height, colour |
| toggle | 0/6 | height, padding, gap, border, font, radius |
| avatar | 0/3 | size 40px vs 32px, radius, gap |
| field | 0/3 | gap |
| card | 0/2 | height |
| empty, input-group, native-select, skeleton, textarea, kbd | 0/1 each | see record |

**Notable**
- **Button padding.** Every Button case differs only by padding. DMF UI's base styles don't reset the browser's default button padding, so text buttons get 1px of block padding and icon buttons get 1px 6px. Heights still match. This is a real DMF difference worth fixing in M16, because the 6px inline padding narrows icon buttons' content box.
- **Button `sm`.** DMF UI uses 14px/20px text where Nova uses 0.8rem (12.8px).
- **Destructive colour.** Text is `182,10,19` in DMF UI and `231,0,11` in Nova.
- **Item, Toggle, Avatar and Empty** use larger spacing or sizes than Nova. **Kbd** uses foreground text where Nova uses muted foreground.
- **Not measured yet:** parts that need a parent, children or an open state. That covers Progress (track), Table (rows) and overlay contents, plus the 26 other shared families with no standalone root case. They are listed for the next measuring round.

**State hooks, a correction to part 1.** DMF UI's Tailwind setup (`src/styles/upstream/shadcn.css`) defines `data-open`, `data-closed`, `data-checked`, `data-unchecked`, `data-active`, `data-disabled`, `data-horizontal` and `data-vertical` as custom variants. They match both Base UI's boolean attributes and DMF UI's `data-state`/`data-orientation`. Many of part 1's state-hook gaps are therefore bridged in styling, and M16 should review them as likely `intentional`, not as work.

## Part 2b: optimization baseline

The baseline records what each of the 80 catalog families costs today, so M16 can show that a fix doesn't make a family heavier, less accessible or more dependent on JavaScript. The record is `docs/DMF-UI-BASELINE.json` (not packed).

**What it measures**

| Field | How |
| --- | --- |
| `css.utilities` | The Tailwind utilities the family's own sources emit, compiled against DMF UI's theme the way a consumer's build does. |
| `css.rules` | Hand-written rules in the shipped stylesheets that target the family's `.dmf-<family>` classes or its data slots. |
| `shadcnCss` | For the 50 shared families: the base-nova rules for the family's `cn-*` classes, plus the utilities its source writes inline, compiled against the same theme. |
| `js` | The family's own client `<script>` blocks, bundled and minified with what they import (Data Slot, DMF helpers). Toast counts the `createToast` runtime its consumers start. |
| `axe` | axe-core 4.14 (WCAG 2.2 AA and best practice) on the family's docs preview, in light and dark. |
| `withoutJs` | The docs preview with JavaScript disabled, compared with the enhanced page: visible elements, focusable controls and visible text. |

- Sizes are minified bytes and gzip (level 9) bytes.
- Each number is the family's cost on its own. Families share utilities and Data Slot code, so the numbers don't add up to the package size.
- The hand-written part of the stylesheet compiles to 74.8 KB (12.5 KB gzip). 30.4 KB of it is attributed to a family; the rest is theme, tokens and presets.

**Checks**
- `npm run baseline:check` runs as part of `npm run check`. It fails when the sizes are stale. Byte counts must match exactly; gzip sizes may differ by up to 2% (at least 8 bytes), because zlib builds differ between Node versions.
- The `baseline` browser scenario fails when a family's axe rule ids or its `withoutJs` status change. The counts are informative only.
- To accept a change: `npm run baseline:write`, adding `-- --browser .dmf-ui-test-results/baseline-browser.json` after a browser run.
- The browser workflow now also runs when `docs/DMF-UI-BASELINE.json` or `docs/DMF-UI-SHADCN-PARITY.json` changes, since its scenarios compare against them.

**Results**

*Accessibility.* No family's docs preview has an axe violation in light or dark. Merchant Card has its own documentation page with no `[data-docs-preview]`, so it isn't audited.

*CSS, shared families.*
- Together the 50 families cost 281.8 KB (65.1 KB gzip) in DMF UI and 335.8 KB (71.3 KB gzip) in base-nova.
- DMF UI is smaller for 21 of the 50. The largest savings are in families where DMF UI has fewer parts: Sidebar, Input Group, Navigation Menu, Combobox, Avatar, Slider. Those gaps are M16 work, so these families will grow.
- DMF UI is larger for 29. In gzip: Skeleton 1.6×, Card 1.5×, Command 1.5×, Radio Group 1.4×, Switch 1.4×, Carousel 1.4×, Button 1.35×, Tabs 1.3× and Toast 1.3×. Collapsible is 380 bytes against shadcn's empty styling.
- The heaviest DMF families are Drawer (18.6 KB, 3.2 KB gzip), Toast (17.7 / 3.1), Code Block, Select, Attachment, Tabs and Button.

*JavaScript.*
- 30 families ship client code.
- The heaviest are Select (33.4 KB, 11.6 KB gzip), Drawer (32.7 / 11.0), Dropdown Menu (30.8 / 10.5), Toast (26.3 / 8.9), Hover Card, Tooltip, Popover and Marquee.
- The overlay families each carry their own copy of Data Slot's positioning and dismiss code in this measure. In a site build Vite shares it between them, so their combined cost is lower than the sum.
- shadcn's JavaScript isn't compared: it runs on React and Base UI, which a DMF UI consumer doesn't load.

*Without JavaScript.*

| Status | Families | What it means |
| --- | --- | --- |
| `static` | 33 | No client script, and the preview renders the same. |
| `same` | 10 | Accordion, Banner, Checkbox, Collapsible, Dialog, Drawer, Dropdown Menu, Popover, Tabs, Toast. Same content and controls; scripts only add behaviour. |
| `reduced` | 20 | The preview shows fewer elements or controls. |
| `more` | 16 | The preview shows extra elements. |

What the `reduced` and `more` results are:
- **Disabled until ready.** Sheet, Alert Dialog, Toggle, Toggle Group, Native Select's action, Resizable and Theme Toggle render their triggers `disabled` until the script runs. This is deliberate, but without JavaScript those controls do nothing and can't be focused.
- **Fallbacks.** Combobox falls back to a native `<select>`. Number Field shows a plain input without its stepper buttons.
- **Script-only extras.** Code Block's copy buttons and Marquee's pause button only appear with JavaScript, which is correct.
- **Empty popup wrappers.** Tooltip, Hover Card and Select leave their portal and positioner wrappers with a box when JavaScript is off. Their content stays hidden. Most `more` families (Button, Breadcrumb, Pagination, the navigation families) get this result from a Tooltip inside their example.

**Limits**
- CSS attribution is by selector. A rule for one family that only names another family's slot is counted under that other family.
- The no-JavaScript comparison counts what's visible. It doesn't operate the controls, so `same` means the content renders, not that the behaviour works.
- Docs previews include other families, so axe and no-JavaScript results describe the family as documented, not in isolation.

## Part 2c: compound parts

Part 2a measured 22 root components on their own. Part 2c measures the parts that only make sense inside a parent, with children, or in an open overlay: 94 parts across 18 families.

**How it measures**
- `compositions` in `scripts/shadcn-parity.mjs` describes one small composition per family, such as a Card with a header, title, description, action, content and footer.
- `npm run shadcn:write` turns each into a `<family>/compound` case.
  - The internal page renders the composition with the real DMF UI components.
  - The scenario builds the same tree from base-nova classes beside it.
  - Both sides are 24rem wide, so text wraps the same way.
- Each part gets an id such as `card/compound#card-title`. A repeated part is numbered: `table/compound#table-cell:4`.
- **Overlays** (Dialog, Popover, Dropdown Menu, Select, Tooltip, Hover Card):
  - The scenario opens the DMF trigger, waits for the content and its opening transition, measures the content and its parts, then closes it with Escape.
  - The shadcn side is built open, with `data-open` and `data-side`.
  - Hover Card opens through its `hover-card:set` event, because it only opens on a real pointer hover or a keyboard focus.
- **What the reference adds for shadcn's runtime:**
  - Base UI's state attributes: `data-active` on the selected tab, `data-open` on the open accordion item, `data-checked` on the selected radio.
  - The elements its primitives render: a tab is a `<button>`, a radio a `<span>`, a dialog title an `<h2>`.
  - The open Accordion panel's settled height.
  - The classes of components a part renders through: FieldLabel renders Label, and InputGroupInput renders Input.
- shadcn's Table wraps its `<table>` in a scroll container. The record compares DMF UI's table with the inner `<table>`.
- Looping animations are paused at their first frame before measuring. Spinner's rotation had made its box change between runs.

**Results**

28 of the 94 parts match in both themes. Across all 189 measured cases and parts, 40 match in light and in dark.

| Family | Parts matching | Differing properties |
| --- | --- | --- |
| tooltip | 1/1 | none |
| item | 8/11 | padding, gap, radius of the items |
| field | 4/10 | gaps, label line height |
| tabs | 3/5 | trigger padding, radius and colours |
| alert | 2/4 | height, padding next to the action |
| button-group | 2/3 | text radius and border colour |
| card | 2/7 | gaps, title line height |
| empty | 2/6 | padding, radius, title size |
| popover | 2/4 | padding, gap, radius |
| dialog | 1/5 | content radius, title size, footer |
| kbd | 1/3 | colour |
| accordion, dropdown-menu, hover-card, input-group, radio-group, select, table | 0 each | see record |

**Notable**
- **Dialog radius.** DMF UI's dialog content measures 0px radius where Nova has 14px. Its rule uses `var(--radius-xl)`, which is empty on the portaled content in the parity page's stylesheet. M16 should check whether a consumer build has the same problem.
- **Table** is larger than Nova throughout: 16px text where Nova uses 14px, and 14px by 16px cell padding against 8px. DMF UI draws a top border on every cell and tints its header; Nova borders only the footer.
- **Menus** (Dropdown Menu, Select): items are 32px tall with 6px by 8px padding, against Nova's 28px with 4px by 6px. Nova's popup background is translucent (70% white in light); DMF UI's is opaque.
- **Radio Group** items inherit the browser's button padding (1px by 6px), the same reset gap Button has.
- **Input Group**'s addon uses 16px foreground text where Nova uses 14px muted text. The group itself has 4px by 8px padding that Nova doesn't have.
- **Tabs** triggers are 2px wider each side than Nova's. The active trigger has a white background, where Nova's default list leaves it transparent.
- **Kbd** in a group keeps the foreground colour, as in part 2a.

**Not measured**
- Parts whose DMF component has no data slot: FieldGroup and InputGroupInput (both already recorded as slot gaps).
- Parts DMF UI doesn't have yet: Progress track and indicator, Avatar image and fallback, the Sidebar, Combobox and Navigation Menu parts.
- Sheet and Alert Dialog, whose DMF content uses Dialog's slots.
- Their composition cases come with the M16 batches that add those parts.

## M16 batches

The 50 shared families are split into six batches, in order. `docs/DMF-UI-M16-BATCHES.json` lists them, and `tests/m16-batches.test.mjs` checks that every shared family is in exactly one batch.

| # | Batch | Families | Gaps | Measured differing | Extras to decide |
| --- | --- | --- | --- | --- | --- |
| 1 | Shared foundations | Button, Kbd, plus fixes across families | 0 | 51 of 52 | 2 |
| 2 | Actions and inputs | Button Group, Toggle, Toggle Group, Input, Textarea, Label, Field, Input Group, Native Select, Checkbox, Switch | 55 | 21 of 34 | 63 |
| 3 | Selection | Radio Group, Slider, Select, Combobox | 55 | 9 of 9 | 66 |
| 4 | Overlays and menus | Dialog, Alert Dialog, Sheet, Drawer, Popover, Hover Card, Tooltip, Dropdown Menu, Command, Accordion, Collapsible | 66 | 17 of 21 | 286 |
| 5 | Navigation | Tabs, Breadcrumb, Pagination, Navigation Menu, Sidebar | 125 | 2 of 5 | 43 |
| 6 | Data display and feedback | Card, Item, Badge, Avatar, Table, Alert, Empty, Progress, Skeleton, Spinner, Toast, Separator, Aspect Ratio, Resizable, Carousel, Attachment, Code Block | 46 | 49 of 68 | 159 |

Gaps include the two `differs` items (Sheet's `side` default and Carousel's `orientation` default), 347 in all. Measured counts are in light mode, from parts 2a and 2c.

**Why this order**
1. **Shared foundations first.** A few causes account for many measured differences, and fixing them changes later batches' measurements:
   - DMF UI doesn't reset the browser's button padding. That accounts for all 48 Button cases and the Radio Group items.
   - `--radius-xl` resolves empty on portaled Dialog content.
   - Kbd uses foreground text where Nova uses muted foreground.
   - The state-hook gaps that the custom variants already bridge are recorded as `intentional` here, family by family, so later batches only see real gaps.
   - Button's `sm` text size (14px against Nova's 12.8px) and the destructive colour are decided here too.
2. **Actions and inputs.** These are the building blocks the later families compose: Field and Input Group sit inside Combobox, Command and dialog forms. The batch adds Input Group's addon `align` and button sizes, Toggle's `size`, and Toggle Group's parts.
3. **Selection.** Combobox is the largest public API change in the batch (42 gaps: 14 parts and 16 slots) and reuses batch 2's Input Group. Select and Radio Group are small by comparison.
4. **Overlays and menus.** This batch carries the most JavaScript (six families at 6–11 KB gzip each) and the most extras: 286 configuration attributes and props, which each need a keep-or-remove decision. Alert Dialog and Sheet move from Dialog's slot names to their own.
5. **Navigation.** It has the most gaps, 125, of which Sidebar has 76 and Navigation Menu 25. It splits two single-component families into shadcn's parts, and comes after overlays because Navigation Menu's viewport and Sidebar's mobile sheet build on them.
6. **Data display and feedback.** These are mostly spacing and size differences (Table, Item, Card, Empty), plus Avatar's image and fallback, Progress's track and indicator, and Toast's parts.

**What each batch must do**
- Turn its `gap` and `differs` items into `match`, or into `intentional` with a reason in `docs/DMF-UI-SHADCN-PARITY-DECISIONS.json`.
- Decide every `extra` in its families: keep it as `intentional`, or remove it.
- Add composition cases for parts it adds, such as Progress's track or Combobox's chips, so they are measured.
- Leave each measured difference matched or recorded as intentional. Some differences are DMF UI choices, such as roomier menus or a larger Table, and an owner decision can keep them.
- Not make the baseline worse:
  - axe results and `withoutJs` statuses must stay the same or improve;
  - CSS and JavaScript bytes may grow only where the batch adds parts shadcn has or matches Nova's styling, and the PR says by how much.
- Keep natural sizing, the 32px header controls and the CB/HUI white primary labels. Presets change theme only.
