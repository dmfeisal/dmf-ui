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
| Match | 80 |
| Intentional | 25 |
| Gap | 16 |
| Extra | 0 |

**Fixed in this milestone**
- **Switch:** the input and thumb carry data-slot names, and `size` (`default`, `sm`) sets the track and thumb sizes. Switch now matches in all four measured parts.

**Gaps**
- **Select (16):** the React Select is a native `<select>` with native options and groups. shadcn's Select is a popup listbox with trigger, content, item, label, separator, value and scroll buttons. Closing these gaps means building a custom listbox, which is a decision for the owner: keep the native select as the React design, or build the listbox.

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

## Presets: theme only

AGENTS.md makes Nova the design profile and says presets change the theme only. The shadcn record compares against Nova's structure, so presets are checked separately.

- **Scenario:** `tests/browser/dmf-ui-preset-theme.mjs` renders every parity case under the `dmf` preset and under each other preset (`cb-ui`, `hui`, `qdi`, `portfolio`).
- **Compared:** height, padding, gaps, font size and weight, line height, letter spacing, border width and opacity. Colours, the corner radius and the font are theme properties and may differ.
- **Not compared:** width. It follows the preset's font (text, and an input's intrinsic size), so it is a theme effect.
- **Record:** `docs/DMF-UI-PRESET-THEME.json`. It fails when the set of structural differences changes; `DMF_UI_PRESET_WRITE=1` accepts a change.

**Result:** 203 cases under four presets, 0 structural differences. The presets change theme only, on the measured properties.

**Not checked by this:** the React components under presets, which are not rendered in this scenario.
