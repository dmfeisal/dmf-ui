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

- Core `dmf-ui@0.4.0` and `@dmf-ui/react@0.1.0-alpha.3`, both private and experimental.
- 80 Astro families, Authentication and discovery Blocks, 15 React families. Counts come from `contracts/catalog.json`.
- Done: foundations ([M1](DMF-UI-M1.md)), portable tokens in 0.3.0 ([tokens](DMF-UI-TOKENS.md)), Blocks ([M4](DMF-UI-M4-BLOCKS.md)), documentation and production quality ([M5](DMF-UI-M5.md)), React alpha ([notes](DMF-UI-0.5.0-REACT-ALPHA-RELEASE-NOTES.md)), Authentication Blocks ([M6.1](DMF-UI-M6.md), [M6.2](DMF-UI-M6-2-RESET.md), [M6.3](DMF-UI-M6-3-OTP.md)), Nova profile ([Nova](DMF-UI-NOVA.md)).
- Everything after the 0.4.0 source commit (`fe93ad9`) is unreleased: dmf-web still runs the 0.4.0 archive. See `releases/README.md`.

## Now

1. **Release 0.5.0.** Bump core, record the archive with `npm run release:record`, update dmf-web's vendored archive and verify it. This puts Nova, React alpha.3 and M6 into the portfolio so the showcase matches the source.
2. **New-brand guide.** One document for adding a preset: required token groups and modes, font bundling and licences, the `brands.json` entry (status, source, gaps, action-text policy), contrast exceptions, export path and the tests that must pass. Today each preset is documented separately and QDI has no preset page of its own; the guide closes that and makes the next brand a small, checked addition.
3. **Manual acceptance backlog.** Safari and Firefox, real password managers, phones and tablets, spoken screen readers for the Authentication Blocks and React alpha. Firefox automation is blocked by a geckodriver profile error.

## Next

4. **Preset showcase in dmf-web.** Present each past-work preset as a case study rendered by the real package (not screenshots), one route per preset.
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

Update this page when an item ships or the order changes; move finished items to "Where it stands" with a link to their report.
