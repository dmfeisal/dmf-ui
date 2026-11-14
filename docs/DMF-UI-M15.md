# M15: shadcn parity audit

**In progress.** Planned in the [roadmap](DMF-UI-ROADMAP.md).
- Part 1 (dmfeisal/dmf-ui#26): the static audit of names, variants and attributes.
- Part 2a (this report's second half): rendered measurement.
- Still open: the per-family optimization baseline.

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

## Still open in M15

- The optimization baseline: CSS and JavaScript bytes per family, axe results, and whether each family works without JavaScript.
- Measurement cases for compound parts (with a parent, children or an open state).
- Then the gap list becomes the ordered M16 batches.
