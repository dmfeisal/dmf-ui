# M16: shadcn parity fixes

**In progress.** Planned in the [roadmap](DMF-UI-ROADMAP.md). The batches and their order are in [M15](DMF-UI-M15.md#m16-batches) and `docs/DMF-UI-M16-BATCHES.json`.

| Batch | Status |
| --- | --- |
| 1. Shared foundations | This report |
| 2. Actions and inputs | Next |
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
