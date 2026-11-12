# QDI preset

Recorded 12 November 2026 for M7, documenting the existing preset through the [new-brand guide](DMF-UI-NEW-BRAND.md). No values change. The machine-readable record is `brands.qdi` in `contracts/brands.json`; foundation context is in [DMF-UI-FOUNDATIONS.md](DMF-UI-FOUNDATIONS.md).

## Source

QDI Brand Guidelines v3.0, verified by SHA-256 in `brands.json`. Pages used: UI palette 67, typography 68, layout 69, spacing 70, radius 71, elevation 72, iconography 75–78. The guideline itself is not stored in this repository.

Reference values are exact: the yellow, rose, danger, warning, success and info palette steps; spacing 4–40px; radii 2–24px with a 12px card radius; four elevation shadows; the type scale (H1 28/40 down to Tag 10/14, specified in sp); icon sizes and a 512-grid, 40-stroke rounded construction; a 360×800 reference layout with 12 columns, an 8-point layout rhythm and 4-point spacing increments.

## DMF mapping

These are DMF application choices, not brand rules:

| Role | Mapping |
| --- | --- |
| Primary | Yellow 2 (`#FFED35`) with black labels |
| Secondary | Yellow 3 (`#FFFCDB`) with black labels |
| Accent | Rose 3 (`#FFEBF4`) with Rose 1 (`#C80058`) text |
| Destructive | Danger 1 (`#E31F1F`) |
| Input boundary | Black, for visible control edges |
| Card radius | 12px (`--qdi-radius-12`) |
| Spacing | `--dmf-space-*` steps alias the QDI 4–40px scale |
| Switch | Black checked thumb and an outlined track: non-text contrast adaptations |

Links and focus use dark rose and strong native-control boundaries as accessibility choices. Black-on-yellow action labels meet AA, so QDI has no recorded contrast exception.

## Modes and fonts

Light only. The source defines no dark mode, and none is invented; the preset stays light inside a dark page.

The guideline specifies Roboto for design files and system fonts for products. The preset follows the product policy: no font is bundled.

## Use

```astro
---
import 'dmf-ui/styles.css';
import 'dmf-ui/presets/qdi.css';
import {Button} from 'dmf-ui/button';
---
<section class="dmf-ui" data-system="qdi" data-color-mode="light">
  <Button>Continue</Button>
</section>
```

`dmf-ui/styles.css` already includes the preset; the explicit export supports direct stylesheet use. Create supports `/create/?system=qdi`, with accent and dark controls locked to the source.

## Gaps

- Semantic role assignments and hover/focus behaviour are DMF mappings.
- No official dark mode.
- The 10px caption and tag sizes are recorded, not imposed on essential application text.
- Full per-family keyboard, portal, forced-colours and contrast acceptance beyond the tested foundations and Create examples remains open.

## Verification

`tests/foundations.test.mjs` checks every palette value in `tokens/resolved.json` against `brands.json`, the light-only mode list and the elevation values. Browser foundation and authentication suites include the `qdi` system. Safari, Firefox and spoken screen readers remain unverified, as for the other presets.
