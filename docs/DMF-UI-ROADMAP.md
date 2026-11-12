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
- Done: foundations ([M1](DMF-UI-M1.md)), portable tokens in 0.3.0 ([tokens](DMF-UI-TOKENS.md)), Blocks ([M4](DMF-UI-M4-BLOCKS.md)), documentation and production quality ([M5](DMF-UI-M5.md)), React alpha ([notes](DMF-UI-0.5.0-REACT-ALPHA-RELEASE-NOTES.md)), Authentication Blocks ([M6.1](DMF-UI-M6.md), [M6.2](DMF-UI-M6-2-RESET.md), [M6.3](DMF-UI-M6-3-OTP.md)), Nova profile ([Nova](DMF-UI-NOVA.md)), 0.5.0 release, release records and the [new-brand guide](DMF-UI-NEW-BRAND.md) ([M7](DMF-UI-M7.md)), preset showcase pages in dmf-web ([M8](DMF-UI-M8.md)).
- Every archive given to dmf-web has a record in `releases/`. See `releases/README.md`.

## Now: M9 — shared core for React

Goal: a React app installs the tokens, CSS and contracts without Astro. Today the packed React consumer fixture installs `dmf-ui`, and with it Astro, Vite plugins, `@lucide/astro` and the `@data-slot` runtimes: 426 lock entries for 15 React families that use only `dmf-ui/styles.css` and `dmf-ui/button/variants`.

1. **`@dmf-ui/core` 0.1.0** in `packages/core`, private and experimental like the React adapter. It holds:
   - `tokens/*.json`, `contracts/*.json`, the token, foundation, Nova and preset stylesheets (`cb-ui`, `hui`, `qdi`, `portfolio`), and `button/variants`.
   - The upstream shadcn CSS with its license notice.
   - Dependencies: `class-variance-authority` and `tw-animate-css`, with `tailwindcss` as a peer. No Astro peer and no component files.
2. **One source.** The files stay where they are in this repository. The core package's build copies them, the way `packages/react/build.mjs` does, and a test fails if any copy differs from its source.
3. **Stylesheet split.** The core `styles.css` keeps every `@import` from `dmf-ui.css` that React needs, but not `@source "../components/dmf-ui"`, so Tailwind no longer scans Astro components. Its only `@source` is its own `button/variants`. Whether Blocks CSS belongs in core is decided by the React fixture's needs, not assumed.
4. **React `0.1.0-alpha.5`.** Its peer changes from `dmf-ui` to `@dmf-ui/core ^0.1.0`, and its imports move to `@dmf-ui/core/...`.
5. **`dmf-ui` itself is unchanged.** Astro consumers, including dmf-web, keep the 0.5.0 archive and its exports. Making `dmf-ui` depend on core is later work, and only if it removes real duplication.

Done when:

- The guarded React consumer run (`scripts/test-dmf-ui-react-consumer.mjs`) installs packed `@dmf-ui/core` and `@dmf-ui/react` archives and passes its existing tests.
- The fixture lock has no `astro`, `@astrojs/*`, `@lucide/astro` or `@data-slot/*` entries. The report records the new entry count against 426.
- A core test checks that every shipped file is byte-identical to its source and that the manifest has no Astro dependency or peer.
- `npm pack --dry-run` of `dmf-ui` lists the same files as `releases/0.5.0/pack.json`, so no `dmf-ui` version bump is needed.
- `docs/DMF-UI-M9.md` records what shipped and what was verified, and this page moves M9 to "Where it stands".

Out of scope: publication, a native adapter, moving Astro components onto core, and handing a core archive to dmf-web. Archives are packed and recorded only when one is given to a consumer.

Ongoing, not a milestone gate:

3. **Manual acceptance backlog.** Safari and Firefox, real password managers, phones and tablets, spoken screen readers for the Authentication Blocks and React alpha. Firefox automation is blocked by a geckodriver profile error.

## Next

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
