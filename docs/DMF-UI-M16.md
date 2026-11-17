# M16: shadcn parity fixes

**In progress.** Planned in the [roadmap](DMF-UI-ROADMAP.md). The batches and their order are in [M15](DMF-UI-M15.md#m16-batches) and `docs/DMF-UI-M16-BATCHES.json`.

| Batch | Status |
| --- | --- |
| 1. Shared foundations | Done (dmfeisal/dmf-ui#33) |
| 2. Actions and inputs | Done (dmfeisal/dmf-ui#35, #36) |
| 3. Selection | 3a (dmfeisal/dmf-ui#37) and 3b in this report |
| 4. Overlays and menus | Gaps closed except drawer snap-point list; extras decided |
| 5. Navigation | Done (Sidebar mobile sheet and data-open closed in the follow-up PR) |
| 6. Data display and feedback | Done (dmfeisal/dmf-ui#44, and Progress parts in the follow-up PR) |

## Batch 1: shared foundations

**Changes**

| Change | Files | Effect |
| --- | --- | --- |
| Buttons lose the browser's default padding inside `.dmf-ui`, as under Tailwind's preflight. A component's padding now comes only from its own classes. | `src/styles/dmf-ui.css` | Button (all 48 cases) and Radio Group items lose 1px of block padding, and icon buttons lose 6px at each side. Accordion triggers lose 6px at each side. |
| Hand-written rules use `--theme(--radius-*)` in place of `var(--radius-*)`. | `src/styles/dmf-ui-nova.css`, `src/styles/dmf-ui-examples.css` | Dialog content gets its rounded corners back (0px → 14px). Card footer's bottom corners and the code snippet radius now resolve too. |
| Button `sm` uses Nova's 0.8rem text, text-sm's line height and 14px icons. | `src/components/dmf-ui/button/button-variants.ts` | Its text goes from 14px/20px to 12.8px/18.3px, as in Nova. |

**Why the radius was empty.** The theme declares `--radius-xl: calc(var(--radius) * 1.4)` on `:root`. `--radius` is only defined on `.dmf-ui` and its presets, so at `:root` the calculation is invalid and `--radius-xl` is empty for every element. Utilities such as `rounded-xl` were unaffected, because Tailwind inlines the calculation into the class. `--theme()` does the same for hand-written rules, so the radius is worked out on the element, with that element's `--radius`.
- `--dmf-card-radius` in the foundation tokens has the same problem.
- Only QDI reads it, and QDI sets its own value, so nothing renders wrong today.
- The token check doesn't allow `*` in a value, so fixing it needs a change to the token format. It is left as a note.

**Owner decisions recorded**
- **Destructive text colour stays darker than Nova's.** It mixes a fifth of the foreground into `--destructive` to keep 4.5:1 on its tint, where Nova's gives about 4:1.
- **Kbd keeps foreground text.** Nova's muted-foreground on the muted background is about 4.4:1 in Neutral, below AA for 12px text.
- **State hooks with a real DMF equivalent:**
  - Tabs' active trigger uses `data-[state=active]`, which the `data-active` variant also matches.
  - Field uses `has-[[data-checked],:checked]`.
  - Checkbox is a native input, so it uses `:checked` and needs no `aria-checked`.
- The other state-hook gaps (Combobox, Navigation Menu, Sidebar, Slider, Toggle Group, Input Group and others) stay gaps. Their batches rebuild those families and decide them there.

**Decisions on measured differences.** `docs/DMF-UI-SHADCN-PARITY-DECISIONS.json` now accepts keys of the form `measured.<property>:<case or part id>`, and the id may end in `*`.
- A matching difference stays in the record with status `intentional` and the reason.
- Each family's `measured.accepted` counts the cases whose remaining differences are all intentional.
- A decision that matches nothing fails `npm run shadcn:check`, like the others.

**Results**

| | Before | After |
| --- | --- | --- |
| Measured cases and parts matching (light / dark) | 40 / 40 of 189 | 82 / 82 |
| Remaining differences all intentional | — | 11 / 11 |
| Button cases matching | 0 of 48 | 40; the other 8 (destructive) differ only in the intentional colour |
| Static gaps | 345 | 341 |
| axe violations in docs previews | 0 | 0 |
| Without-JS statuses | unchanged | unchanged |

**Size changes**
- Button CSS: 14,399 → 14,748 bytes (2,404 → 2,466 gzip), from the `sm` text, line-height and icon-size classes.
- Card and Sheet: +18 and +9 bytes, from the inlined radius calculation.
- The compiled hand-written stylesheet: +8 bytes.
- No JavaScript changed.

**Effect on consumers.** A consumer's own `<button>` inside `.dmf-ui` without padding classes now has no padding. Its own classes still apply, as with Tailwind's preflight.

## Batch 2a: actions and inputs, without the toggles

Batch 2 is split in two. 2a covers Button Group, Input, Textarea, Label, Field, Input Group, Native Select, Checkbox and Switch. 2b covers Toggle and Toggle Group, whose item API is a larger change.

**Input Group, ported to Nova**
- **New parts**, as in shadcn: `InputGroupButton` (a ghost Button with sizes `xs`, `sm`, `icon-xs`, `icon-sm`), `InputGroupText` and `InputGroupTextarea`.
- **`align` on `InputGroupAddon`:** `inline-start`, `inline-end`, `block-start` or `block-end`. This is the only place 2a departs from shadcn. With no `align`, the addon keeps its written position, and the first and last addons get Nova's inline padding. Markup written before `align` existed renders as it did. shadcn defaults to `inline-start`, which would move a trailing suffix to the front.
- **Control slot:** the input and textarea now carry `data-slot="input-group-control"`, so Nova's focus and invalid rings apply to the group.
- **Click to focus:** a click on an addon's text focuses the control, as in shadcn. A small script does this, and links and buttons inside the addon keep their own clicks.
- **Styles:** the hand-written `.dmf-input-group*` CSS is replaced by Nova's utilities.
- **No props removed**, as the contract conventions require.

**Nova spacing**
- **Field:** `gap-3` becomes `gap-2`. Field Set goes from `gap-6` to `gap-4`, Field Group from `gap-7` to `gap-5`, and Field Content from `gap-1` to `gap-0.5`.
- **Field Label** takes Label's `leading-none`, as Nova's stylesheet order gives it. Field Title takes `leading-snug`.
- **Textarea** and **Button Group Text** use `rounded-lg`. Button Group Text drops its shadow.

**Border colour.** The scoped base rules set `border: 0 solid` with no colour, so any border without a colour class was drawn in the foreground colour. Button Group Text was one example. The base rules now use `--border`, as shadcn/ui's base layer does.

**Docs example.** The Input Group page's clear button is now Nova's 24px ghost icon button, and the suffix uses `align="inline-end"`. Nova's tighter addon had left the old 18px trigger short of the 24px target size, which the baseline caught as a new `target-size` violation.

**Extractor and catalog fixes**
- The catalog now finds slots set as an overridable prop default (`"data-slot": dataSlot = "input"`). Input, Textarea, Label, Field Group and Header had appeared slot-less.
- The parity extractor follows local type aliases, so shadcn Native Select's `size` is read and matches.
- It also takes a component's first element as its root when the component marks no slot at all, as InputGroupButton does.
- It ignores the `data-slot` prop, which the slot comparison already covers.
- Native Select is measured as a composition: its `<select>` inside the wrapper.

**Decisions recorded**
- **Button Group:** the `as` polymorphism, the separator's `decorative` choice and Button Group Text's data slot.
- **Field:** the `as` props, and `FieldError`'s `message`.
- **Input:** `type` is passed through as a native attribute.
- **Input Group:** the `label` prop.
- **Checkbox:** it is a native input with no indicator element, and it server-renders `indeterminate`.
- **Switch:** the form props and runtime attributes its Data Slot runtime reads. Base UI takes these through its props spread.

**Results**

| | Before 2a | After |
| --- | --- | --- |
| Gaps and differs, 2a families | 31 | 0 |
| Extras, 2a families | 49 | 0 (all decided) |
| Static gaps, all families | 341 | 310 |
| Measured cases and parts matching (light / dark) | 82 / 82 of 189 | 100 / 100 of 193 |
| Input Group measured | 0 of 3 | 6 of 6 |
| axe violations in docs previews | 0 | 0 |

Field Set is the one 2a part still measuring differently, 6px taller than Nova (164.5 against 170.5). The remaining Field parts match.

**Size changes**
- **Input Group:** CSS goes from 0.7 KB to 11.7 KB (0.3 → 2.2 KB gzip), because its styles moved from hand-written rules into Nova's utilities. The addon focus script adds 303 bytes (209 gzip).
- **Button Group:** −1.6 KB, mostly from the removed shadow.
- **Hand-written stylesheet:** −0.6 KB.
- **Header and Input** show about 0.1 KB more each. This is attribution, not growth: the catalog now sees their slots, so existing rules for `[data-slot=header]` and `[data-slot=input]` are counted under them.

**Local suites.** The examples and accessibility suites still fail only on CB's white primary labels, as on `main`.

## Batch 2b: Toggle and Toggle Group

**Toggle**
- **Size:** gains Nova's `size` (`default`, `sm`, `lg`).
- **Styles:** Nova's classes, from a `toggleVariants` cva that the family now exports, replace the hand-written `.dmf-toggle` CSS.
- **Kept from DMF UI:**
  - `label`, `icon` and `presentation`, so every look keeps the same accessible name. Icon-only toggles use the shared Tooltip.
  - `value`, `defaultPressed`, the `toggle:change` event, and buttons that stay disabled until the script runs.
- **Pressed state:** it keeps an inset underline on top of Nova's muted fill. The fill alone is about 1.1:1 against the page, so it can't carry the state by itself. The forced-colors pressed outline stays.

**Toggle Group**
- **`ToggleGroupItem`:** a new part, so items can be written as children, as in shadcn. The `items` array still works, and no prop is removed.
- **New group props:**
  - `size`;
  - `spacing`: a number of spacing steps, default 2, with 0 joining the items as in Nova;
  - `orientation`: `horizontal` or `vertical`.
- **Inheritance:** shadcn passes the group's variant and size to its items through React context, and Astro has none. Items therefore take them from the group's `data-variant`, `data-size` and `data-spacing` through `group-data-*` classes. As in shadcn, the group's value wins over the item's.
- **Kept from DMF UI:**
  - `type` (single or multiple), where Base UI uses a boolean `multiple`;
  - a required group `label`;
  - wrapping at narrow widths, which the enlarged mobile test relies on.

**Extractor and catalog**
- The catalog reads the string literals inside a `data-slot={…}` expression, plus a `slotName` passed to a shared control. Toggle's control renders `toggle` or `tooltip-trigger`, and Toggle Group items render `toggle-group-item`. As a side effect, Chip and Rating also gain their `tooltip-trigger` slot.
- A cva that a shadcn family imports from another counts as its own. ToggleGroup takes Toggle's `variant` and `size` this way.
- The single Toggle cases now pass DMF's required `label`. Without it, DMF rendered an empty button, which was the 18px height measured before.
- Toggle Group is measured as a composition of two outline items.

**Decisions recorded:** the presentation model (`label`, `icon`, `presentation`), `value`, `defaultPressed` and `type`, the `items` API, and the runtime's data attributes.

**Results**

| | Before 2b | After |
| --- | --- | --- |
| Gaps, Toggle and Toggle Group | 26 | 0 |
| Extras, Toggle and Toggle Group | 25 | 0 (all decided) |
| Static gaps, all families | 310 | 284 |
| Toggle measured | 0 of 6 | 6 of 6 |
| Toggle Group measured | — | 3 of 3 |
| Measured cases and parts matching (light / dark) | 100 / 100 of 193 | 109 / 109 of 196 |
| axe violations in docs previews | 0 | 0 |

**Size changes**
- **Toggle CSS:** 1.2 → 6.4 KB (0.6 → 1.7 KB gzip). Nova's version is 5.2 KB.
- **Toggle Group CSS:** 0.4 → 6.2 KB (0.3 → 1.2 KB gzip). Nova's version is 3.3 KB. The difference is mostly the classes items use to read the group's variant, size and spacing, which stand in for React context.
- **Hand-written stylesheet:** −0.8 KB.
- No JavaScript changed.

Batch 2 is complete.

## Batch 3a: Radio Group, Slider and Select

Batch 3 is split in two. Combobox has 42 gaps on its own, and moving it to shadcn's parts is a public API change, so it follows in 3b.

**Slider**
- **Native input, Nova styling:** DMF UI's Slider stays a native `<input type="range">`, so it keeps working without JavaScript, submits with its form, and gets the browser's keyboard support. It's drawn as Nova's slider: a 4px muted track filled with the primary colour up to the value, and a 12px white thumb with a ring border and Nova's hover and focus ring.
- **Fill:** follows `--slider-fill`, which the server renders and the script updates. It follows `direction` too, so it fills from the right in RTL. Without JavaScript, the fill shows the initial value only; the thumb still moves.
- **New props:** `orientation` (`horizontal` or `vertical`), drawn with `writing-mode`. `defaultValue` is an alias for `value`, shadcn's name for the initial value.
- **Forced colours:** the native drawing returns, so system colours apply.
- **Recorded as intentional:** shadcn's track, range and thumb are elements; here they're the input's pseudo-elements, so their slots are recorded as intentional. Multiple thumbs (range selection) aren't supported; a native input has one.

**Select**
- **Trigger:** Nova's heights, 32px default and 28px `sm` (they were 36px and 32px), plus `rounded-lg`, and no shadow.
- **Content and items:** content `rounded-lg`; items `rounded-md` with Nova's tighter padding; the label takes Nova's spacing too.
- **`alignItemWithTrigger` on `SelectContent`:** shadcn's name for Data Slot's default `item-aligned` position; `false` means `position="popper"`.
- **Recorded as intentional:**
  - **Scroll buttons:** DMF UI's list scrolls natively, so there are no scroll buttons.
  - **Opaque menus:** DMF UI keeps them. Nova's source marks the popup `cn-menu-translucent`, a 70% background with a backdrop blur.
  - **The open list highlights the selected item:** Base UI's focus does the same, but the static reference isn't focused.
  - **Runtime config:** the elements and attributes the `@data-slot/select` runtime needs.

**Radio Group:** takes Nova's `gap-2`. Its 16 extras are the form props and runtime attributes of `@data-slot/radio-group`, recorded with reasons.

**Results**

| | Before 3a | After |
| --- | --- | --- |
| Gaps, 3a families | 13 | 0 |
| Extras, 3a families | 60 | 0 (all decided) |
| Static gaps, all families | 284 | 271 |
| Radio Group measured | 2 of 3 | 3 of 3 |
| Select measured | 0 of 6 | 3 of 6 match, 3 intentional only |
| Measured cases and parts matching (light / dark) | 109 / 109 of 196 | 113 / 113, plus 14 intentional only |
| axe violations in docs previews | 0 | 0 |

Slider is not in the measured set. Its shadcn reference is a tree of Base UI elements with no counterpart in a native input.

**Size changes**
- **Slider CSS:** 0.8 → 3.5 KB (0.4 → 0.9 KB gzip), for the pseudo-element styles. Its script grows by 0.1 KB to keep the fill in step.
- **Select CSS:** +26 bytes.
- **Hand-written stylesheet:** +2.5 KB, all of it the Slider rules.

**Local suites.** The accessibility suite still fails only on CB's white primary labels, as on `main`. The `region` items it lists are the popup portals it already allows.

## Batch 3b: Combobox

The owner chose single-selection parts: restyle the Combobox to Nova and add shadcn's composable parts, keep the native-select fallback, and leave multi-select chips as recorded gaps.

**Two ways to write it**
- **Items mode**, the existing API: `<Combobox id label items={[…]} />`. It now renders the parts internally, so its markup and behaviour follow parts mode. The ids the tests and docs rely on are unchanged: `<id>`, `<id>-list` and `<id>-option-<n>`.
- **Parts mode**, as in shadcn: `ComboboxInput` (with `showTrigger` and `showClear`), `ComboboxContent`, `ComboboxList`, `ComboboxItem`, `ComboboxGroup`, `ComboboxLabel`, `ComboboxSeparator`, `ComboboxEmpty`, `ComboboxTrigger` and `ComboboxValue`.

**Keeping the no-JavaScript fallback in parts mode**
- **On the server:** the root renders its children, reads each item's value, label and disabled state back from their markup, and builds the same native `<select>` from them.
- **In the browser:** the runtime gives the input, list, options and group labels their ids and relationships, because a part can't see the root's id.

**Markup and styling**
- **Input:** an Input Group (batch 2a) with the combobox input and an inline-end addon holding the chevron trigger and an optional clear button. The trigger stays out of the tab order, because the input owns focus and the arrow keys open the list. As in shadcn, the trigger hides while the clear button shows, and the clear button shows only when there is a value.
- **Content, list and items:** Nova's popover surface, padding and item spacing. The highlighted option keeps DMF UI's `data-active`, with `aria-activedescendant`.
- **Group and separator:** groups are `role=group`, named by their label. The separator is presentational, because a listbox may own only groups and options.
- **Filtering:** a group with no matching option hides, and separators hide while there is a query.
- **CSS:** the hand-written option and input CSS is gone. What's left positions the popup and styles the native fallback at Nova's native-select size.
- **Visual change in items mode:** the leading search icon is gone, as Nova's input has none.

**Decisions recorded**
- `ComboboxCollection`: a React render-prop. Astro maps arrays directly.
- Positioning props: the list opens below and flips above when there isn't room.
- `disabled` belongs on the root.
- The runtime's state markers stand in for Base UI's hooks: `data-active`, `aria-disabled` and `hidden`.
- Opaque menus.

**Still gaps:** multi-select chips, 9 items: `ComboboxChips`, `ComboboxChip` and `ComboboxChipsInput`, their slots, and `data-chips`.

**Results**

| | Before 3b | After |
| --- | --- | --- |
| Gaps, Combobox | 42 | 9 (chips only) |
| Extras, Combobox | 6 | 0 (all decided) |
| Static gaps, all families | 271 | 238 |
| Combobox measured | — | 5 of 7 match, 2 intentional only |
| Measured cases and parts matching (light / dark) | 113 / 113 of 196 | 118 / 118 of 203, plus 16 intentional only |
| axe violations in docs previews | 0 | 0 |

**Tests.** The selection scenario now covers a parts-mode example on the Combobox docs page:
- ids and named groups;
- filtering that hides an empty group and the separator;
- keyboard commit;
- the clear button;
- the trigger;
- an axe audit.

The items-mode tests and the selection contracts pass unchanged.

**Size changes**
- **Combobox CSS:** 2.8 → 6.4 KB (0.9 → 1.8 KB gzip). Nova's is 15.9 KB.
- **Combobox JS:** 4.5 → 5.8 KB (1.7 → 2.0 KB gzip), for the parts wiring, trigger, clear and group filtering.
- **Hand-written stylesheet:** −1.8 KB.

## Batch 4: overlays and menus (in progress)

**Done in this pass**
- **Sheet:** `side` accepts shadcn's `left` and `right` as aliases for the logical sides, so they follow reading direction. The default stays `inline-end`.
- **Alert Dialog:** `size` (`default`, `sm`) on the content, with a narrower `sm` width.
- **Dropdown Menu:** `DropdownMenuRadioGroup`, a group for radio items.
- **Collapsible:** the summary carries `data-slot="collapsible-trigger"`.

**Decided as intentional**
- **Shared overlay slots** (Alert Dialog and Sheet): they reuse Dialog's slot names, and `data-component` identifies each overlay. Owner's choice.
- **Animation and state hooks:** DMF UI runs open and close from keyframes on `data-open` and `data-closed`, and matches `data-state` through its custom variants.
- **Tooltip provider:** DMF UI sets each tooltip's delay on the instance, so there's no shared provider.
- **Collapsible parts:** one component, with the summary as trigger and the body as content.
- **Dropdown Menu and Command:** `aria-expanded` and `aria-selected` stand in for Base UI's `data-popup-open` and `data-checked`.

**Earlier list, now handled in part 2 below.**

**Still gaps (20)**
- **Dropdown Menu submenus:** `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`, and their slots. This is a nested-menu feature.
- **Drawer:** `snapPoints`, the swipe handle and its props, swipe axis, and nested-drawer state. These need the drawer's gesture runtime.
- **Drawer overlay slot.**
- **Alert Dialog Cancel:** `size` and `variant` props, and `data-size` on the content.
- **Dropdown Menu checkbox item:** a `checked` prop.

**Extras decided**
- All 286 DMF-only props and attributes now have a recorded reason, so none is undecided. They're kept as DMF API, and each reason says what it is: runtime configuration the family's script reads, the element a positioner or portal creates, a DMF part name, or a DMF option value.
- Nothing was removed. Removing runtime options would break consumers, so that's left for a later decision if the owner wants it.

**Results so far**

| | Before | Now |
| --- | --- | --- |
| Gaps, batch 4 | 66 | 20 |
| Extras, batch 4 | 286 | 0 undecided (all recorded as intentional) |

| Static gaps, all families | 238 | 193 |
| Static extras, all families | 619 | 197 |

Accessibility, no-JavaScript and the overlay browser scenarios (Sheet, Alert Dialog, navigation components) are unchanged. The docs suite and unit tests pass.

## Batch 4, part 2: the features

Batch 4 now closes its feature gaps, except one: the drawer's snap-point list.

**Dropdown Menu submenus.** Data Slot's dropdown has no nested menus, so DMF UI runs its own small submenu runtime.
- **Parts:** `DropdownMenuSub`, `DropdownMenuSubTrigger` and `DropdownMenuSubContent`.
- **Opening:** Enter, Space or the forward arrow opens it and focuses its first item. Hover opens it too, with a short delay before it closes.
- **Keyboard:** arrow keys move through enabled items and skip disabled ones; Home and End jump to the ends. Escape or the back arrow closes the submenu only and returns focus to its trigger, and the menu stays open.
- **Activation:** Enter on a submenu item clicks it. The menu runtime doesn't handle submenu items itself, so a plain key press wouldn't select them.
- **Placement:** the panel is `fixed`, and its offsets are taken from the containing block. Data Slot's positioner uses a transform, which makes it that containing block. Without this correction, the panel landed far from its trigger.
- **Props:** `side` (`inline-end`, `inline-start`, `left`, `right`), `sideOffset`, `align` and `alignOffset`.

**Dropdown checkbox items.** `checked` is rendered on the server, as `data-checked` and `aria-checked`. Once the menu runtime is running, it owns later changes.

**Alert Dialog Cancel.** `size` and `variant` are now declared props and pass to Button. `variant` still defaults to `outline`. The sm width moved into the content's class, so `data-size` is styled in source.

**Drawer.** Most of what the record called missing already exists under DMF UI's names:
- Data Slot's drawer runtime names its backdrop `drawer-backdrop` and its nested state `data-nested-swiping`. DMF UI uses those names.
- Swipe direction is `data-swipe-direction`. The swipe handle sits on `DrawerContent`, next to the popup it belongs to.
- Modal state is set by aria attributes, so there's no `data-modal` hook.
These are recorded as intentional with those reasons.

**Still a gap: the snap-point list.** shadcn's `snapPoints` takes a list. Data Slot's runtime takes one snap point (`snapPoint` and `defaultSnapPoint`, which DMF UI exposes), and it has no way to switch between several. Building the list would mean DMF UI implementing the switching itself, so I've left it as a gap.

**Found along the way: two dropdown menus on one page.** On `main`, a page with one dropdown opens it normally. Add a second dropdown, with no submenu or other parts, and the first no longer opens. The same happens with two plain dropdowns, so the cause is the dropdown runtime, not the submenu. This is an existing issue, and it would affect any page with two menus. I haven't fixed it. The submenu example sits inside the existing Actions menu so the docs page keeps one menu.

**Results**

| | Before part 2 | Now |
| --- | --- | --- |
| Batch 4 gaps | 20 | 3 (drawer snap-point list) |
| Batch 4 extras undecided | 0 | 0 |
| Static gaps, all families | 193 | 177 (176 gaps and 1 differs) |
| Static extras, all families | 197 | 197 |

Browser scenarios: the new submenu scenario, the documentation, modal, navigation, parity and baseline scenarios all pass. The full docs suite runs 30 scenarios and passes. 83 unit tests and the type check pass.

**Size changes**
- **Dropdown Menu CSS:** 10.4 → 12.8 KB (2.4 → 2.8 KB gzip). The submenu styles and the new parts.
- **Dropdown Menu JS:** 30.8 → 34.2 KB (10.5 → 11.3 KB gzip). The submenu runtime and the checked-item change.
- **Alert Dialog CSS:** 1.7 → 1.7 KB, with the sm width now in the class.
- Drawer and Collapsible are unchanged.

## Batch 5: navigation (in progress)

Batch 5 started with 124 gaps. This part closes Breadcrumb, Pagination and Tabs. Navigation Menu (25 gaps) and Sidebar (76 gaps) are still open.

**Breadcrumb**
- **Parts:** `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage` (aria-current and disabled), `BreadcrumbSeparator` (decorative, with a default chevron) and `BreadcrumbEllipsis`.
- **Root:** without `items`, the children are the parts. The items mode is unchanged.

**Pagination**
- **Parts:** `PaginationContent`, `PaginationItem`, `PaginationLink` (aria-current and data-active when current, `size` `default` or `icon`), `PaginationPrevious` and `PaginationNext` (with `text`, and `data-icon` on their chevrons), and `PaginationEllipsis`.
- **Root:** without `page`, the children are the parts. The items mode is unchanged. Its props are now optional in the type, and a check enforces them in items mode.

**Tabs:** it had no gaps; its 18 DMF-only options (activation mode, orientation, runtime attributes) now have recorded reasons.

**Decided as intentional**
- The breadcrumb link slot, and the items-mode props.
- Pagination's `size` default: `default`, where shadcn's is `icon`. Switching would restyle every numbered link, so `icon` is available by passing it.
- The tabs indicator and the activation mode, which Data Slot's tabs runtime owns.

**Results**

| | Before | Now |
| --- | --- | --- |
| Breadcrumb gaps | 11 | 0 |
| Pagination gaps | 12 | 0 |
| Tabs gaps | 0 | 0 |
| Batch 5 gaps | 124 | 101 (Navigation Menu 25, Sidebar 76) |

**Checks run locally**
- `npm test` (83 pass), `precheck`, `astro check` (0 errors)
- All 30 docs browser scenarios, including the existing navigation, pagination and breadcrumb scenarios in items mode.

**Not yet tested in a browser:** the new parts. Their markup is covered by the type check and the existing items-mode scenarios, but they need a scenario of their own before this is merged.

**Next:** Navigation Menu, which needs dropdown panels, a viewport and an indicator, and Sidebar, which needs a provider, collapse modes and a mobile sheet. Each is its own piece of work and needs a decision on scope.

## Batch 5, part 2: Navigation Menu and Sidebar

**Navigation Menu** now has its parts: `NavigationMenuList`, `Item`, `Trigger`, `Content`, `Link`, `Positioner` and `Indicator`.
- **Panels:** each trigger opens its panel beside it. Only one panel is open at a time.
- **Pointer:** a click opens or closes it; hovering opens it, and leaving the trigger and panel closes it after a short delay.
- **Keyboard:** Enter, Space or ArrowDown opens and focuses the first link. ArrowLeft and ArrowRight move between triggers, reversed in right-to-left text. Escape closes and returns focus to the trigger. Focus leaving the item closes it.
- **Placement:** `side`, `sideOffset`, `align` and `alignOffset` on `NavigationMenuPositioner`.
- **No-JavaScript:** items mode still works without JavaScript. The parts need the runtime for their panels, as shadcn's do; the unit test checks that the component's only script loads that runtime.

**Sidebar** now has shadcn's parts: `SidebarProvider`, `SidebarTrigger`, `SidebarRail`, `SidebarInset`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, the group parts, the menu parts (button, action, badge, sub, skeleton), `SidebarSeparator`, `SidebarInput`, plus the layout pieces (gap, container, inner, wrapper).
- **Toggle:** the trigger and rail flip the provider's `data-state` between expanded and collapsed, and keep `aria-expanded` in step.
- **Collapse modes:** `collapsible` (`offcanvas`, `icon`, `none`) and `side` and `variant` control the layout through the provider's state.
- **Items mode:** unchanged.
- **Inset:** rendered as a `div`, so a page that already has its own `main` doesn't nest one.

**Still open in Sidebar (2 gaps)**
- **Mobile sheet** (`data-mobile`): on small screens shadcn turns an offcanvas sidebar into a sheet. DMF UI doesn't do that yet.
- **`data-open`**: shadcn styles its open state with this attribute, and DMF UI styles the sidebar's open state through `data-state`.

**Recorded as intentional:** Astro callbacks (`onOpenChange` and `onClick` are replaced by reading `data-state` or listening for clicks), `dir` (read from the page), and `data-sidebar` (DMF UI styles its parts by `data-slot`), plus the navigation menu's animation hooks, which DMF UI doesn't use.

**Results**

| | Before part 2 | Now |
| --- | --- | --- |
| Navigation Menu gaps | 25 | 0 |
| Sidebar gaps | 76 | 2 |
| Batch 5 gaps | 101 | 2 |
| Static gaps, all families | 177 | 42 |

**Tests:** a new browser scenario (`navigation-parts`) covers the menu's click, hover, arrow keys, Escape and placement; the sidebar toggle; and the breadcrumb and pagination current pages. The full docs suite runs 31 scenarios and passes. Unit tests (83) and the type check pass.

**Fixed along the way:** the large-text scenario caught the Sidebar example overflowing on a phone at enlarged text; the example now stacks on narrow screens.

**Size:** the Sidebar and Navigation Menu runtimes and styles are new, so their CSS and JS grow. I haven't measured the change here.

## Batch 6: data display and feedback

Batch 6 started with 41 gaps and 152 DMF-only props and attributes. It now has 8 gaps (all Progress) and no undecided extras.

**Closed**
- **Alert:** `variant` (`default`, `destructive`) is declared as a prop. It already worked; the contract could not see it.
- **Attachment trigger:** `type` is declared. Buttons still default to `type="button"`.
- **Table:** a `TableCaption` part, and the scroll wrapper carries `data-slot="table-container"`.
- **Avatar:** parts `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup` and `AvatarGroupCount`. With no `name`, the root takes them as children. The image still hides itself when it fails, so the fallback shows.

**Decided as intentional**
- **React-only callbacks:** the carousel's `setApi` and `CarouselApi`, the toast manager, and the code block's copy `onClick`. Astro has no callbacks, so each runtime is driven directly.
- **Data Slot runtime attributes:** the toast's stacking, swipe and animation attributes, and the toast's provider and portal, which Toaster renders through Data Slot.
- **DMF names and defaults:** the resizable group, the carousel's orientation default, and the toast icon that follows the notification's kind.
- **Table and avatar state:** tables have no row state, and avatar sizing uses classes, with `data-size` for hosts.

**Progress (follow-up)**
- **Parts:** `ProgressTrack` (holds the native progress element, with `value`, `max` and `label`), `ProgressIndicator` (the moving bar while indeterminate), `ProgressLabel` and `ProgressValue`. With no `label`, the root takes them as children.
- **Decided:** the track's value, max and label props, since the native progress is what carries them.
- **Result:** Progress matches in 11 parts and has 13 recorded decisions, with no gaps and no extras.

**Extras**
- 152 DMF-only props and attributes now have recorded reasons: runtime configuration, positioner and portal elements, part names, and option values. Nothing was removed.

**Results**

| | Before | Now |
| --- | --- | --- |
| Batch 6 gaps | 41 | 0 |
| Batch 6 undecided extras | 152 | 0 |

**Checks:** unit tests (85 pass), `precheck`, the type check, and all 32 docs browser scenarios. The adapted attachment trigger was re-recorded with `import-fulldev-components.mjs --record`, because its source changed.

**Not covered by a browser scenario yet:** the new Avatar and Table parts. The existing avatar and data-display scenarios cover the items mode.

## Batch 5 follow-up: Sidebar mobile sheet and data-open

Batch 5 was left with two Sidebar gaps. Both are closed.

- **Mobile sheet:** below the `md` breakpoint, a sidebar that can collapse (`icon` or `offcanvas`) opens as an overlay sheet. It starts collapsed, and the trigger opens it over the page. A backdrop closes it. `collapsible="none"` stays visible at every size, as in shadcn.
- **`data-mobile`:** each sidebar records whether the breakpoint is mobile.
- **`data-open`:** the container carries it while the sidebar is expanded, and the sheet styles read it.
- **Decided:** the backdrop, which DMF UI draws itself. shadcn draws its overlay inside its Sheet component.

**Checks:** a browser scenario covers the sheet at phone width (starts collapsed, opens, the backdrop closes it). Desktop collapse is covered by the existing scenario. The full docs suite runs 32 scenarios and passes.

**Results:** Sidebar has no gaps and no undecided extras.

## Batch 3 follow-up: Combobox chips

Batch 3 left nine Combobox gaps: multi-select chips. They are closed.

- **Parts:** `ComboboxChips` (the box), `ComboboxChip` (one selected option, with a remove button and `showRemove`) and `ComboboxChipsInput` (the search input).
- **Root:** `multiple` and `defaultValues` in parts mode. The native fallback becomes a `select multiple`. Items mode stays single-select.
- **Runtime:** choosing an option toggles it and keeps the list open. A chip shows while its option is selected. Its remove button clears it, and Backspace on an empty input removes the last chip.
- **Decided:** the chip's `value`, which names its option; the multi-select marker `data-combobox-multiple`; and `data-chips`, which shadcn sets on the content but DMF UI doesn't need.

**Checks:** the parts scenario covers the default, choosing with Enter, the remove button and Backspace. The docs suite runs 33 scenarios and passes; unit tests (85) and the type check pass.

**Results:** Combobox has no gaps and no undecided extras.
