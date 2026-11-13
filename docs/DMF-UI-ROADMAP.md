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

- Astro package `dmf-ui@0.7.0`, framework-neutral `@dmf-ui/core@0.1.0` and `@dmf-ui/react@0.1.0-alpha.5`, all private and experimental. React depends on core, not on the Astro package. dmf-web runs the recorded 0.7.0 archive.
- 80 Astro families, Authentication and discovery Blocks, 15 React families. Counts come from `contracts/catalog.json`.
- Done: foundations ([M1](DMF-UI-M1.md)), portable tokens in 0.3.0 ([tokens](DMF-UI-TOKENS.md)), Blocks ([M4](DMF-UI-M4-BLOCKS.md)), documentation and production quality ([M5](DMF-UI-M5.md)), React alpha ([notes](DMF-UI-0.5.0-REACT-ALPHA-RELEASE-NOTES.md)), Authentication Blocks ([M6.1](DMF-UI-M6.md), [M6.2](DMF-UI-M6-2-RESET.md), [M6.3](DMF-UI-M6-3-OTP.md)), Nova profile ([Nova](DMF-UI-NOVA.md)), 0.5.0 release, release records and the [new-brand guide](DMF-UI-NEW-BRAND.md) ([M7](DMF-UI-M7.md)), preset showcase pages in dmf-web ([M8](DMF-UI-M8.md)), shared core for React ([M9](DMF-UI-M9.md)), preset completeness from recorded sources ([M10](DMF-UI-M10.md)), docs site performance ([M11](DMF-UI-M11.md)), the 0.7.0 release (M12).
- Every archive given to dmf-web has a record in `releases/`. See `releases/README.md`.

## Now

No milestone in progress. M13 is next.

## Versions

Milestones are units of work; versions are what a consumer receives. A milestone that changes shipped files names the release it **ships in**. Milestones that only change tests or docs ship nothing, and several milestones can share one release. Archives are packed and recorded only when given to a consumer. The version rules are in `releases/README.md`.

## Next

Ready to start, in this order. M12 (M11 report and `dmf-ui` 0.7.0) is done. They keep what exists healthy, then make React a real option for future products.

- **M13 — docs browser suite in CI.**
  - dmfeisal/dmf-ui#17 repaired all 25 scenarios. They run only in Ego Browser on the owner's machine, which is how 9 failed unnoticed.
  - Run them on every PR with a CI-capable headless browser, keeping the same scenarios and assertions.
  - *Ships in:* nothing.
- **M14 — manual acceptance pass.**
  - Safari and Firefox, including the geckodriver profile error that blocks Firefox automation.
  - Real phones and tablets, password managers, and VoiceOver and NVDA, for the Authentication Blocks and the React adapter.
  - *Ships in:* nothing, or `dmf-ui` patches for bugs it finds.
- **M15 — React parity, round 1.** Interactive families a real app needs first: Dialog, Tabs, Tooltip, Popover, Dropdown Menu and Toast. React has 15 families today; Astro has 80.
  - *Ships in:* `@dmf-ui/react` 0.2.0-alpha.n. These are not recorded until a consumer exists.
- **M16 — React parity, round 2.** Form and data families: Combobox, Number Field, Table, Pagination, Breadcrumb, Accordion and Sheet.
  - *Ships in:* `@dmf-ui/react` 0.2.0-alpha.n.
- **M17 — first recorded core and React release.** Pack and record both packages for a real consumer, the way `dmf-ui` is recorded.
  - **Needs:** a React consumer.
  - *Ships in:* `@dmf-ui/core` 0.1.0 and `@dmf-ui/react` 0.2.0. These are the first recorded release of each, and React drops its alpha tag.

## Later

Each item waits for the condition it names. Version numbers are assigned when the item is planned, not before.

**Cross-platform** (see [platform direction](DMF-UI-PLATFORMS.md))

- **M18 — native token outputs.** Generate React Native and Swift token files from `tokens/design.tokens.json`, checked like the CSS outputs. This is the prerequisite for M19 and M20.
  - *Ships in:* `@dmf-ui/core` 0.2.0, for the new exports.
- **M19 — React Native proof.** Button, Text, Input, Switch and Card, using the generated tokens and presets.
  - *Ships in:* a new package, starting at 0.1.0-alpha.1.
- **M20 — SwiftUI proof.** The same five components.
  - *Ships in:* a new Swift package, starting at 0.1.0-alpha.1.

**Patterns and presets**

- **M21 — `AuthCenteredTemplate`.** A shared sign-in page template covering logo, form, support and footer.
  - **Needs:** a second real authentication page to validate the API.
  - *Ships in:* a `dmf-ui` minor.
- **M22 — new-brand preset tooling.** A scaffold command that creates the files and checks the [new-brand guide](DMF-UI-NEW-BRAND.md) describes.
  - *Ships in:* nothing, because the scripts are not packed.
- **M23 — first future-product preset**, built through the guide and the tooling.
  - **Needs:** that product's brand direction.
  - *Ships in:* a `dmf-ui` minor.
- **M24 — Food Discovery templates.** Full pages built from the merchant Blocks.
  - **Needs:** that product's interaction and data requirements.
  - *Ships in:* a `dmf-ui` minor.
- **M25 — dashboard patterns.** Layout, filters, tables and charts for admin views.
  - **Needs:** a real dashboard.
  - *Ships in:* a `dmf-ui` minor.
- **M26 — tablet POS patterns.** Touch-first ordering and checkout layouts.
  - **Needs:** a POS product.
  - *Ships in:* a `dmf-ui` minor.
- **M27 — past-work source follow-ups.** A complete CB specification, HUI subheadline mapping, and dark palettes for CB UI, HUI and QDI.
  - **Needs:** new source files, or an owner decision to design dark variants as new work.
  - *Ships in:* a `dmf-ui` minor, or nothing if only records change.

## Deferred

Kept as milestones so their order is clear. None starts without an explicit decision.

- **M28 — stable API policy.** The 1.0 criteria, deprecation process and the gates for calling a family stable.
  - *Ships in:* nothing. It defines what 1.0.0 requires.
- **M29 — npm publication.** Publish the packages that meet M28's gates, instead of handing over archives.
  - **Needs:** M28.
  - *Ships in:* 1.0.0 for those packages.
- **M30 — templates registry.** Installable page templates.
  - **Needs:** M24–M26 to have produced templates worth registering.
- **M31 — WordPress integration and marketing Blocks.**
  - **Needs:** a concrete site.

New domain families are not planned without a concrete product.

## Standing constraints

- Keep the confidential naming rules in `AGENTS.md` for every preset, past or future.
- Natural sizing: no blanket 44px minimums. Header tools share 32px.
- CB and HUI filled primary actions keep white labels by owner preference (about 2.57:1 and 4.29:1); they stay recorded exceptions, not WCAG AA passes.
- Released versions are immutable and recorded in `releases/`.

Each milestone is planned here and reported in its own `DMF-UI-M<n>.md`; reports are not merged into this page. Update this page when an item ships or the order changes; move finished items to "Where it stands" with a link to their report.
