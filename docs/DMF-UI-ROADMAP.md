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

- Astro package `dmf-ui@0.5.0`, framework-neutral `@dmf-ui/core@0.1.0` and `@dmf-ui/react@0.1.0-alpha.5`, all private and experimental. React depends on core, not on the Astro package. dmf-web runs the recorded 0.5.0 archive; the next `dmf-ui` archive needs a version bump (see `releases/README.md`).
- 80 Astro families, Authentication and discovery Blocks, 15 React families. Counts come from `contracts/catalog.json`.
- Done: foundations ([M1](DMF-UI-M1.md)), portable tokens in 0.3.0 ([tokens](DMF-UI-TOKENS.md)), Blocks ([M4](DMF-UI-M4-BLOCKS.md)), documentation and production quality ([M5](DMF-UI-M5.md)), React alpha ([notes](DMF-UI-0.5.0-REACT-ALPHA-RELEASE-NOTES.md)), Authentication Blocks ([M6.1](DMF-UI-M6.md), [M6.2](DMF-UI-M6-2-RESET.md), [M6.3](DMF-UI-M6-3-OTP.md)), Nova profile ([Nova](DMF-UI-NOVA.md)), 0.5.0 release, release records and the [new-brand guide](DMF-UI-NEW-BRAND.md) ([M7](DMF-UI-M7.md)), preset showcase pages in dmf-web ([M8](DMF-UI-M8.md)), shared core for React ([M9](DMF-UI-M9.md)).
- Every archive given to dmf-web has a record in `releases/`. See `releases/README.md`.

## Now: M10 — preset completeness from recorded sources

Goal: close the past-work preset gaps that the recorded sources support, and make the records say plainly what they cannot support. Nothing is invented.

Audit, 13 November 2026:
- **No dark-mode source for any past-work preset.**
  - CB's recovered token file (`public/css/cb-ui-tokens.css` in dmf-web) has a `dark` colour role, but no dark theme.
  - The HUI and QDI brand books record no dark mode.
  - Dark variants would therefore be new design, not reconstruction. They are not part of M10.
- **Docs contradict what ships.** The CB and HUI preset pages still say primary actions use dark or black labels. The shipped CSS and `brands.json` use white labels by owner preference.

1. **HUI Black headline weight.**
   - The brand book's typography page specifies Black headlines; the preset ships M PLUS Rounded 1c only at 500 and 700.
   - Add the Latin 900 WOFF2 from the same Fontsource 5.2.8 release, under the OFL licence already bundled.
   - Add its `@font-face` through the token generator, and use 900 for HUI headings where the brand book specifies Black.
   - Replace the first HUI gap with whatever remains true, such as Latin-only coverage.
2. **Correct the CB and HUI preset docs.**
   - They should state the white primary label, the owner preference and the recorded ratio (about 2.57:1 for CB and 4.29:1 for HUI) as a contrast exception, matching `actionTextPolicy`.
   - Any other contrast pair the docs mention stays as measured.
3. **Explicit dark-mode gaps.** Every past-work preset records in `brands.json` that no dark-mode source exists and it stays light-only. CB gains the gap it lacks today; HUI and QDI keep theirs, in consistent wording.
4. **A drift check.** A test reads `brands.json` and each preset's doc. It fails when:
   - a preset with an `actionTextPolicy` describes a different label colour, or omits its exception ratio
   - a preset whose `modes` is light-only claims a dark mode

Done when:

- HUI headings render at weight 900 from the packaged font.
- Package and token tests assert the new WOFF2 file is packed, and check its signature.
- The notices still cover M PLUS Rounded 1c.
- The CB and HUI docs match `actionTextPolicy`, and the drift check passes.
- `brands.json` gaps are updated, and `contracts:check`, `npm test`, `check` and `build` pass, along with the React consumer and Blocks consumer runs.
- `docs/DMF-UI-M10.md` records what shipped and what was verified, and this page moves M10 to "Where it stands".

Not in M10:
- **Dark palettes.** They would need source material or an explicit decision to design new ones.
- **A complete CB specification.** That needs an original source.
- **HUI spacing, radius and state scales.** The brand book has none.
- **Packing.** New font bytes change both `dmf-ui` and `@dmf-ui/core`, so the next archive of each needs a version bump before it is given to a consumer. dmf-web's preset pages pick up the new gaps only with that archive.

Ongoing, not a milestone gate:

3. **Manual acceptance backlog.** Safari and Firefox, real password managers, phones and tablets, spoken screen readers for the Authentication Blocks and React alpha. Firefox automation is blocked by a geckodriver profile error.

## Next

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
