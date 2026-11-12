# Adding a brand preset

Recorded 12 November 2026 for M7. A preset lets a past or future brand wear the shared components. It changes theme values only: colours, fonts, radius, spacing aliases and narrowly scoped non-text adaptations. It never changes component structure, behaviour or API. Existing presets follow this guide: [CB](DMF-UI-CB-PRESET.md), [HUI](DMF-UI-HUI-PRESET.md), [QDI](DMF-UI-QDI-PRESET.md) and the portfolio preset ([portfolio](DMF-UI-PORTFOLIO.md)).

## Before you start

- **Pick a public identifier.** Use a short lowercase id (`hui`, `qdi`, `cb-ui`) and the matching prefix (`hui-`, `qdi-`, `cb-`). Follow the confidential naming rules in `AGENTS.md`: never expand an abbreviation into a client or company identity, in code, comments, filenames, font-family names or docs.
- **Record the source, not the file.** Name the guideline document, its version, its SHA-256 and the page numbers you used. Do not copy private PDFs, proprietary assets or identifying filenames into the repository.
- **Separate reference from mapping.** Exact source values (palette, type scale, radii) are reference data. Which value becomes `--primary`, which text colour sits on it, and focus or hover behaviour are DMF mappings. Record which is which; never present a mapping as an official brand rule.

## Steps

| # | File | What to add |
| --- | --- | --- |
| 1 | `tokens/design.tokens.json` | A `<id>` group with one sub-group per mode (`light`, and `dark` only if the source defines one). Raw values as `<id>-<family>-<step>` tokens; semantic roles (`primary`, `primary-foreground`, `secondary`, `accent`, `destructive`, `border`, `input`, `ring`, …) as whole-token aliases. |
| 2 | `scripts/design-tokens.mjs` | Add each `<id>.<mode>` to `groups`, emit `src/styles/dmf-ui-<id>.css` scoped to `:root .dmf-ui[data-system="<id>"]`, and list it in the returned outputs. Keep any extra rules (card radius, switch outline) as small, commented, data-slot-scoped adaptations. |
| 3 | `npm run tokens:build` | Regenerates the preset CSS, `src/styles/dmf-ui-tokens.css` and `tokens/resolved.json`. Never edit generated files by hand; `tokens:check` rejects stale output. |
| 4 | Fonts (only if bundled) | WOFF2 files under `src/assets/fonts/<id>/` with their licence text beside them (`*-OFL.txt`), `@font-face` rules with a `DMF <ID> <Family>` family name, and the attribution in `public/dmf-ui-notices.txt`. Subset honestly: say which scripts are covered. If the source says products use system fonts, do that instead of bundling. |
| 5 | `src/styles/dmf-ui.css` | `@import "./dmf-ui-<id>.css";` before `dmf-ui-nova.css`. Add Nova code-highlighting overrides in `dmf-ui-nova.css` only if the preset needs them. |
| 6 | `package.json` `exports` | `"./presets/<id>.css": "./src/styles/dmf-ui-<id>.css"`. Shipped fonts are already covered by `files` (`src/assets`). |
| 7 | `contracts/brands.json` | An entry with `status`, `modes`, `source` (document, SHA-256, pages), reference values, `mapping`, `gaps` and, where action labels deviate, an `actionTextPolicy`. Then `npm run contracts:build`. |
| 8 | Create (`src/pages/create.astro`, `src/scripts/create.ts`) | Add the id to `allowed.system`, the Foundation `<select>`, the accent note, the preset summary and any brand swatch panel. Lock controls the source fixes (accent, dark mode) rather than offering invented variants. |
| 9 | Docs | A `docs/DMF-UI-<ID>-PRESET.md` page (sources, mapping table, modes, fonts, use snippet, contrast, gaps, verification) and a row in the brand-mappings foundation page (`src/data/foundation-documentation.ts`). |
| 10 | Tests | Extend `tests/tokens.test.mjs` and/or `tests/foundations.test.mjs`: exact palette values against `brands.json`, the scoped selector, the export path, declared modes (and no undeclared dark group), WOFF2 signatures and licence files for bundled fonts. |

## Contrast and accessibility

- Text pairs meet WCAG 2.2 AA (4.5:1 normal, 3:1 large) and essential non-text boundaries meet 3:1, measured on the actual mapped tokens.
- When an owner deliberately keeps a failing pair (for example CB and HUI white primary labels), record the measured ratio, the affected states and the decision in the preset page, `brands.json` `actionTextPolicy` and [DMF-UI-NOVA.md](DMF-UI-NOVA.md). Browser axe helpers may allow only those named combinations; every other finding still fails.
- Natural sizing applies: no blanket 44px minimums. Header tools stay 32px.
- Keep keyboard behaviour and visible `:focus-visible` outlines unchanged; a preset may recolour focus, never remove it.

## Done when

- `npm run tokens:check`, `npm run contracts:check` and `npm test` pass.
- `npm run check` and `npm run build` pass, and Create renders the preset in light (and dark, if defined), LTR and RTL.
- The browser foundations suite (`tests/browser/dmf-ui-foundations.mjs`) includes the new `data-system` value, and it passes when run.
- The preset page lists remaining gaps instead of filling them with guesses.
- Adding a preset changes shipped files, so it lands in a new core version and gets a release record (`npm run release:record`; see `releases/README.md`).
