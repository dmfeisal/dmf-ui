# M17: React parity

**In progress.** Planned in the [roadmap](DMF-UI-ROADMAP.md).

This record covers the React adapter (`packages/react`, `@dmf-ui/react`) against shadcn/ui base-nova. It uses the same extractor and status rules as the Astro record (`docs/DMF-UI-SHADCN-PARITY.json`). It is static: names, data-slot values, props and defaults, button variant axes and data attributes. Rendered measurement of the React components is not part of it yet.

- **Record:** `docs/DMF-UI-REACT-PARITY.json`, written by `scripts/react-parity.mjs`.
- **Decisions:** `docs/DMF-UI-REACT-PARITY-DECISIONS.json`.
- **Checks:** `npm run react:check` runs in `npm run precheck`. The record fails when it is stale or a decision matches nothing.

## Results

13 React families map to shadcn families. Blocks, Text and the adapter's own helpers have no shadcn family and are listed as DMF-only.

| | Count |
| --- | --- |
| Match | 77 |
| Intentional | 25 |
| Gap | 19 |
| Extra | 0 |

**Gaps**
- **Select (16):** the React Select is a native `<select>` with native options and groups. shadcn's Select is a popup listbox with trigger, content, item, label, separator, value and scroll buttons. Closing these gaps means building a custom listbox, which is a decision for the owner: keep the native select as the React design, or build the listbox.
- **Switch (3):** the track and thumb have no data-slot names, and there is no `size` prop. Both are small and can be done next.

**Intentional (25)**
- Native inputs for checkbox and radio: no indicator element, as in the Astro record.
- Defaults the adapter sets: button `type`, alert and field `role`, the separator's `decorative`.
- Field and radio props that the React form needs: `onValueChange`, `onChange`, controlled `value`, `name`, `required`, `orientation`.

## What's left for Astro

- Batch 5 part 2 is in review ([dmfeisal/dmf-ui#42](https://github.com/dmfeisal/dmf-ui/pull/42)). When it merges, Navigation Menu has no gaps and Sidebar has two: the mobile sheet and `data-open`.
- Combobox multi-select chips (9 gaps).
- Drawer snap-point list (3 gaps). The runtime takes one snap point.
- Batch 6, data display and feedback: 41 gaps, and 152 DMF-only props and attributes still to decide.
- Two extras in the shared foundations still need a decision.
- A dropdown bug: a second dropdown on a page stops the first from opening. It affects any page with two menus.
