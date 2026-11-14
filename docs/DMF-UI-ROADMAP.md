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
- Done: foundations ([M1](DMF-UI-M1.md)), portable tokens in 0.3.0 ([tokens](DMF-UI-TOKENS.md)), Blocks ([M4](DMF-UI-M4-BLOCKS.md)), documentation and production quality ([M5](DMF-UI-M5.md)), React alpha ([notes](DMF-UI-0.5.0-REACT-ALPHA-RELEASE-NOTES.md)), Authentication Blocks ([M6.1](DMF-UI-M6.md), [M6.2](DMF-UI-M6-2-RESET.md), [M6.3](DMF-UI-M6-3-OTP.md)), Nova profile ([Nova](DMF-UI-NOVA.md)), 0.5.0 release, release records and the [new-brand guide](DMF-UI-NEW-BRAND.md) ([M7](DMF-UI-M7.md)), preset showcase pages in dmf-web ([M8](DMF-UI-M8.md)), shared core for React ([M9](DMF-UI-M9.md)), preset completeness from recorded sources ([M10](DMF-UI-M10.md)), docs site performance ([M11](DMF-UI-M11.md)), the 0.7.0 release (M12), the docs browser suite in CI ([M13](DMF-UI-M13.md)).
- Every archive given to dmf-web has a record in `releases/`. See `releases/README.md`.
- The 26 docs browser scenarios run in CI (`DMF UI browser`, 4 shards, about 2 min 20 s wall clock). The check stays non-blocking until 27 November 2026. After that, if it has had no flaky failures, the owner makes it required in the repository settings.
- `main` has shipped-file changes since 0.7.0 (Tabs, EmptyState and Button reflow), so the next `dmf-ui` archive needs a version bump.

## Now: M14 — manual acceptance pass

Goal: check what CI cannot automate.

- Safari and Firefox, including the geckodriver profile error that blocks Firefox automation.
- Real phones and tablets, password managers, and VoiceOver and NVDA, for the Authentication Blocks and the React adapter.
- *Ships in:* nothing, or `dmf-ui` patches for bugs it finds.

## Versions

Milestones are units of work; versions are what a consumer receives. A milestone that changes shipped files names the release it **ships in**. Milestones that only change tests or docs ship nothing, and several milestones can share one release. Archives are packed and recorded only when given to a consumer. The version rules are in `releases/README.md`.

## Next

Ready to start, in this order, after M14. First the Astro families are brought to shadcn/ui parity, so that React ports start from audited specifications instead of copying today's differences. Then React becomes a real option for future products.

"Parity" means matching shadcn/ui's Nova specification: variants, sizes, attributes, parts and behaviour. It does not mean adopting its runtime. DMF UI keeps native elements, Data Slot and its own enhancement scripts, and adds no Radix or Base UI dependency. Natural sizing, preset rules and the CB/HUI white-label exceptions still apply.

- **M15 — shadcn parity audit.** Measure the gap; change no component file. Part 1 (static audit) and part 2a (rendered measurement of 95 cases) are reported in [M15](DMF-UI-M15.md); the optimization baseline and compound-part measurement are next.
  - **References:** vendor each shared family's Nova source and docs from the pinned shadcn snapshot into `vendor/shadcn`. Today only Button and the Nova stylesheet are vendored. Each file keeps its text extension, the pin is recorded in `contracts/design-profile.json`, and the files stay out of the packed archive.
  - **Parity record:** add `docs/DMF-UI-SHADCN-PARITY.json` (kept out of the packed archive), with one entry per family that both libraries have. Each entry records shadcn's value, DMF's value and a status (`match`, `intentional` with a reason, or `gap`) for:
    - **Variants:** every `variant` value and its colours in rest, hover, focus-visible, active, disabled and `aria-invalid` states, in light and dark.
    - **Sizes:** every size (`xs`, `sm`, `default`, `lg`, the icon sizes, and family-specific ones): height, inline and block padding, gap, radius, font size and weight, and icon size.
    - **Attributes:** public props and their defaults, `data-slot` names, state attributes (`data-state`, `data-orientation`, `data-side`, `data-align`, `data-disabled`, `data-variant`, `data-size`), ARIA roles and properties, and icon placement (`data-icon="inline-start"` and `"inline-end"`).
    - **Parts:** sub-components (for example `DialogHeader`, `DialogFooter`, `DialogClose`) and how they nest.
    - **Behaviour:** keyboard support, focus management, dismissal, RTL and reduced motion.
  - **Check:** `npm run shadcn:check` (part of `npm run check`) keeps the record in step with the catalog. A browser scenario renders every variant × size, measures computed dimensions, and reads attributes against the record. `gap` entries are reported, not failed, until M16 closes them.
  - **Optimization baseline:** per family, record CSS and JavaScript bytes, axe results, and whether it works without JavaScript.
  - **Exit:** all shared families recorded, with a gap list ordered by family.
  - *Ships in:* nothing.
- **M16 — shadcn parity fixes.** Close the gaps from M15 in batches of related families: actions and inputs, then selection, overlays and menus, navigation, then data display and feedback.
  - Each batch turns its `gap` entries into `match` or `intentional`, and its scenario then fails on any new gap.
  - DMF additions (for example Button's `md` alias and per-preset size variables) stay, recorded as `intentional`. Presets change theme only.
  - Byte, axe and no-JavaScript results must not get worse than the M15 baseline.
  - *Ships in:* `dmf-ui` minors, one per batch or a few batches together.
- **M17 — missing shadcn families.** Add the general-purpose shadcn families that DMF UI lacks:
  - Context Menu, Menubar and Scroll Area.
  - Input OTP, extracted from the OTP verification Block as a family, with the Block then using it.
  - Data Table, as a documented composition of Table, Pagination, Dropdown Menu and Checkbox, not a new runtime.
  - Sonner is matched by the existing Toast; any gap goes in the parity record instead of a second toast family.
  - Calendar, Date Picker and Chart wait for M28, which needs a real dashboard.
  - Each new family enters the parity record at `match` or `intentional`.
  - *Ships in:* a `dmf-ui` minor.

- **M18 — React parity, round 1.** Each React family matches its audited Astro entry in the parity record. Interactive families a real app needs first: Dialog, Tabs, Tooltip, Popover, Dropdown Menu and Toast. React has 15 families today; Astro has 80.
  - *Ships in:* `@dmf-ui/react` 0.2.0-alpha.n. These are not recorded until a consumer exists.
- **M19 — React parity, round 2.** Form and data families: Combobox, Number Field, Table, Pagination, Breadcrumb, Accordion and Sheet.
  - *Ships in:* `@dmf-ui/react` 0.2.0-alpha.n.
- **M20 — first recorded core and React release.** Pack and record both packages for a real consumer, the way `dmf-ui` is recorded.
  - **Needs:** a React consumer.
  - *Ships in:* `@dmf-ui/core` 0.1.0 and `@dmf-ui/react` 0.2.0. These are the first recorded release of each, and React drops its alpha tag.

## Later

Each item waits for the condition it names. Version numbers are assigned when the item is planned, not before.

**Cross-platform** (see [platform direction](DMF-UI-PLATFORMS.md))

- **M21 — native token outputs.** Generate React Native and Swift token files from `tokens/design.tokens.json`, checked like the CSS outputs. This is the prerequisite for M22 and M23.
  - *Ships in:* `@dmf-ui/core` 0.2.0, for the new exports.
- **M22 — React Native proof.** Button, Text, Input, Switch and Card, using the generated tokens and presets.
  - *Ships in:* a new package, starting at 0.1.0-alpha.1.
- **M23 — SwiftUI proof.** The same five components.
  - *Ships in:* a new Swift package, starting at 0.1.0-alpha.1.

**Patterns and presets**

- **M24 — `AuthCenteredTemplate`.** A shared sign-in page template covering logo, form, support and footer.
  - **Needs:** a second real authentication page to validate the API.
  - *Ships in:* a `dmf-ui` minor.
- **M25 — new-brand preset tooling.** A scaffold command that creates the files and checks the [new-brand guide](DMF-UI-NEW-BRAND.md) describes.
  - *Ships in:* nothing, because the scripts are not packed.
- **M26 — first future-product preset**, built through the guide and the tooling.
  - **Needs:** that product's brand direction.
  - *Ships in:* a `dmf-ui` minor.
- **M27 — Food Discovery templates.** Full pages built from the merchant Blocks.
  - **Needs:** that product's interaction and data requirements.
  - *Ships in:* a `dmf-ui` minor.
- **M28 — dashboard patterns.** Layout, filters, tables and charts for admin views. It adds the shadcn Calendar, Date Picker and Chart families, entered in the parity record from M15.
  - **Needs:** a real dashboard.
  - *Ships in:* a `dmf-ui` minor.
- **M29 — tablet POS patterns.** Touch-first ordering and checkout layouts.
  - **Needs:** a POS product.
  - *Ships in:* a `dmf-ui` minor.
- **M30 — past-work source follow-ups.** A complete CB specification, HUI subheadline mapping, and dark palettes for CB UI, HUI and QDI.
  - **Needs:** new source files, or an owner decision to design dark variants as new work.
  - *Ships in:* a `dmf-ui` minor, or nothing if only records change.

## Deferred

Kept as milestones so their order is clear. None starts without an explicit decision.

- **M31 — stable API policy.** The 1.0 criteria, deprecation process and the gates for calling a family stable.
  - *Ships in:* nothing. It defines what 1.0.0 requires.
- **M32 — npm publication.** Publish the packages that meet M31's gates, instead of handing over archives.
  - **Needs:** M31.
  - *Ships in:* 1.0.0 for those packages.
- **M33 — templates registry.** Installable page templates.
  - **Needs:** M27–M29 to have produced templates worth registering.
- **M34 — WordPress integration and marketing Blocks.**
  - **Needs:** a concrete site.

New domain families are not planned without a concrete product.

## Standing constraints

- Keep the confidential naming rules in `AGENTS.md` for every preset, past or future.
- Natural sizing: no blanket 44px minimums. Header tools share 32px.
- CB and HUI filled primary actions keep white labels by owner preference (about 2.57:1 and 4.29:1); they stay recorded exceptions, not WCAG AA passes.
- Released versions are immutable and recorded in `releases/`.
- **CI rule for browser suites** (decided in M13; applies to every future browser suite and deployment check):
  - **Triggers:**
    - Pull requests that change `src/`, `packages/`, `tokens/`, `contracts/`, `tests/browser/`, `scripts/` or build config. Docs-only PRs skip it.
    - A nightly full run on `main`.
    - A manual "Run workflow" trigger.
  - **Shape:**
    - The suite is sharded across parallel jobs on one Node version (24); the Node 22/24 matrix stays on the source checks.
    - Browser downloads are cached.
    - A failing scenario uploads its screenshots and axe results as artifacts.
  - **Adoption:** a new browser check starts non-blocking. It becomes required after two weeks without flaky failures. Full-suite-on-every-PR, nightly-only and required-from-day-one were rejected.

Each milestone is planned here and reported in its own `DMF-UI-M<n>.md`; reports are not merged into this page. Update this page when an item ships or the order changes; move finished items to "Where it stands" with a link to their report.
