# DMF UI roadmap

Recorded 12 November 2026. This is the single place for direction and sequencing. Milestone reports (M1–M6, React alpha) remain the evidence for what each stage shipped; this page links to them instead of repeating them. Nothing here promises a date, a stable API or publication.

## Purpose

DMF UI is the owner's own design system. It has two jobs:

- **Past work:** reconstruct earlier client design systems faithfully, as presets that run on shared components.
- **Future work:** be the starting point for new products and brands, on the web and later on native platforms.

Every change is judged against both. A component that only fits one brand, or a preset that forks component behaviour, works against the system.

## Three layers

| Layer | What it holds | Rule |
| --- | --- | --- |
| **Core** | Components, semantic tokens, foundations, contracts. Nova style, Neutral base and theme by default. | Brand-free. Names describe roles (`--primary`), not brands. |
| **Presets** | `cb-ui`, `hui`, `qdi`, `portfolio`, plus the DMF default. Each sets colours, fonts and recorded exceptions on top of core. | Additive. A preset changes theme, never behaviour or structure. |
| **Adapters and patterns** | Astro (primary), React web alpha, future React Native and SwiftUI. Blocks and examples for real flows (authentication, merchant discovery). | Each platform owns rendering and accessibility; tokens and contracts are shared. |

The brand registry is `contracts/brands.json`; token source is `tokens/design.tokens.json`; cross-platform direction is [DMF-UI-PLATFORMS.md](DMF-UI-PLATFORMS.md).

## Where it stands

- Core `dmf-ui@0.5.0` and `@dmf-ui/react@0.1.0-alpha.4`, both private and experimental. dmf-web runs the recorded 0.5.0 archive.
- 80 Astro families, Authentication and discovery Blocks, 15 React families. Counts come from `contracts/catalog.json`.
- Done: foundations ([M1](DMF-UI-M1.md)), portable tokens in 0.3.0 ([tokens](DMF-UI-TOKENS.md)), Blocks ([M4](DMF-UI-M4-BLOCKS.md)), documentation and production quality ([M5](DMF-UI-M5.md)), React alpha ([notes](DMF-UI-0.5.0-REACT-ALPHA-RELEASE-NOTES.md)), Authentication Blocks ([M6.1](DMF-UI-M6.md), [M6.2](DMF-UI-M6-2-RESET.md), [M6.3](DMF-UI-M6-3-OTP.md)), Nova profile ([Nova](DMF-UI-NOVA.md)), 0.5.0 release, release records and the [new-brand guide](DMF-UI-NEW-BRAND.md) ([M7](DMF-UI-M7.md)).
- Every archive given to dmf-web has a record in `releases/`. See `releases/README.md`.

## Now: M8 — preset showcase

Goal: make the past-work layer visible. Each past-work preset gets a page in dmf-web rendered by the installed package, not screenshots.

1. **Routes.** `/examples/dmf-ui/presets/` lists the presets; `/examples/dmf-ui/presets/<id>/` shows one (`cb-ui`, `hui`, `qdi`). Standalone like `/examples/dmf-ui/`: no portfolio styles, scripts or fonts.
2. **Content from package data only.** Status, modes, source, mapping, gaps and action-text policy come from `dmf-ui/contracts/brands`; swatches render the preset's own CSS variables. dmf-web adds only the link to its company hub. Nothing is invented.
3. **Specimen.** The same component set under each `data-system`: Buttons, Badge, Alert, Card with Field, Input, Checkbox and Switch, Tabs. Recorded contrast exceptions are shown with their measured ratio.
4. **Links.** Each company hub's Documentation section and the `/ui/` page link to the matching preset page.

Done when:

- The four routes build in dmf-web from the 0.5.0 archive, and a dmf-web test asserts each page uses its `data-system`, shows its recorded gaps and exception, and links its hub.
- dmf-web `check`, `build` and tests pass locally and in CI on Node 22 and 24.
- `docs/DMF-UI-M8.md` records what shipped and what was verified, and this page moves M8 to "Where it stands".

Ongoing, not a milestone gate:

3. **Manual acceptance backlog.** Safari and Firefox, real password managers, phones and tablets, spoken screen readers for the Authentication Blocks and React alpha. Firefox automation is blocked by a geckodriver profile error.

## Next

5. **Smaller shared core for React.** React consumers currently install the full Astro package. Split a framework-neutral foundation (tokens, CSS, contracts) so React — and later native — consumers take only what they use.
6. **Preset completeness.** Dark modes where a source exists (CB, HUI and QDI are light-only today); close the gaps listed in `brands.json` without inventing values the sources do not support.
7. **Performance follow-ups** from M5: the ~27KB inline search index per docs page and ~458KB decoded CSS on Discovery, after measuring.

## Later

8. **`AuthCenteredTemplate`** once a second real authentication page validates its logo, form, support and footer API.
9. **React Native, then SwiftUI** proofs with Button, Text, Input, Switch and Card, generated from the shared token JSON ([platform direction](DMF-UI-PLATFORMS.md)).
10. **Product patterns** for the first future product that needs them: Food Discovery Templates, dashboards, tablet POS. Each needs its interaction and data requirements first.

## Deferred

Templates registry, npm publication and a stable API promise, WordPress integration, marketing Blocks, new domain families without a concrete product.

## Standing constraints

- Keep the confidential naming rules in `AGENTS.md` for every preset, past or future.
- Natural sizing: no blanket 44px minimums. Header tools share 32px.
- CB and HUI filled primary actions keep white labels by owner preference (about 2.57:1 and 4.29:1); they stay recorded exceptions, not WCAG AA passes.
- Released versions are immutable and recorded in `releases/`.

Each milestone is planned here and reported in its own `DMF-UI-M<n>.md`; reports are not merged into this page. Update this page when an item ships or the order changes; move finished items to "Where it stands" with a link to their report.
