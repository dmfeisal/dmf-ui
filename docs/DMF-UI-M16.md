# M16: shadcn parity fixes

**In progress.** Planned in the [roadmap](DMF-UI-ROADMAP.md). The batches and their order are in [M15](DMF-UI-M15.md#m16-batches) and `docs/DMF-UI-M16-BATCHES.json`.

| Batch | Status |
| --- | --- |
| 1. Shared foundations | Done (dmfeisal/dmf-ui#33) |
| 2. Actions and inputs | 2a in this report; 2b (Toggle, Toggle Group) next |
| 3–6 | Planned |

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
