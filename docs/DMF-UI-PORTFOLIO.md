# Portfolio components and preset

## Source and ownership

This extraction reads the existing dmf-web repository at `c43d8fc421338d10e900da394b9e9e515a1d0da0`. Source paths and SHA-256 hashes are recorded in `DMF-UI-PORTFOLIO-SOURCE.json`. The portfolio checkout is read-only for this work. No live project data, protected content, public Guestbook notes, saved Canvas files or external account credentials are copied.

The new components are adapted APIs and scoped styles, rather than a verbatim page migration. Components already authoritative in DMF UI are reused rather than copied back from the portfolio consumer.

## Reusable patterns promoted

| Portfolio source | DMF UI export | Adaptation |
| --- | --- | --- |
| TagList.astro / global.css .dmf-tag | `dmf-ui/tag-list` | Visible string items replace the portfolio-specific tag IDs/data import. Static outlined pills; optional square treatment. |
| ProjectActionBar.astro | `dmf-ui/project-action-bar` | Native project links, scoped semantic styling, Lucide direction marks, responsive stacking. No page-specific CSS or transport. |
| SectionNavigation.astro / section-navigation.js | `dmf-ui/section-navigation` | Native numbered anchors with instance-owned observer/hash tracking. No portfolio-header measurements, global click handlers or floating mobile menu. |
| ArchiveIndex.astro | `dmf-ui/archive-index` | Zero-based input displayed from 01; decorative by default. Global root variables and grid-view hiding remain host-owned. |

Basic actions, forms, floating panels, content cards, badges, tags-as-filters and navigation patterns already have DMF UI primitives. Portfolio pages can adopt those separately; this change does not rewrite the consumer or update its archive pin.

## Integration inventory and boundaries

| Existing portfolio component/runtime | Treatment |
| --- | --- |
| DmfUIPilot | Consumer integration of the existing library; not copied as a second source. |
| ProjectLogo | Retains portfolio company/project data and approved-logo ownership. The generic library does not import that domain inventory. |
| LiveWebsitePreview | Remains a page integration: remote frames, website URLs and privacy/network policy need a separate host decision. |
| CaseLockBlur | Remains with protected case access; no authentication or protected content is moved. |
| SpotifyTicker | Remains with external account/functions integration; no credentials or activity data are moved. |
| PageTransition / GsapRuntime | Remain page-wide navigation/motion integrations. They are not instance-scoped component controllers. |
| HomeHeroPrimary / HomeHeroProcess / HomeHeroSystem | Remain authored homepage compositions with Canvas and content ownership. |
| CanvasExport / CanvasNoteColors / CanvasLifecycleDemo and Canvas runtime | Retain their separate owner, history, storage and public-data boundaries. The source AGENTS.md explicitly says the isolation work is an internal spike without a public package API. This extraction does not promote it to a public API. |
| Global header/footer, work/writing filters and media layouts | Remain page compositions. Shared primitives may be composed to reproduce these after a host migration; whole global stylesheets are not imported. |
| QDS, Muhammadiyah, Vimonia product themes | Not inferred from portfolio styling. Their independent authoritative design evidence is still required. Existing CB and Horego presets stay distinct. |

## Portfolio preset

Use `dmf-ui/presets/portfolio.css` with `.dmf-ui[data-system="portfolio"]`. Explicit `data-color-mode="light"`, `"dark"` and `"yellow"` scopes isolate each appearance from its surroundings. Without an explicit mode the preset follows the root theme/system preference. Create exposes these three appearances and exports the required wrapper/import instructions, JSON and share URLs.

Confirmed source backgrounds are Light `#f4f3ef`, Dark `#111111`, Yellow `#f2d43d`; source surfaces, ink and secondary text values are preserved in the typed groups. Shared semantic mappings are present-day adaptations: muted surfaces use full ink for small-text contrast, input/border roles use the stronger source secondary ink, and destructive/chart roles come from explicit library decisions rather than invented historical palette claims. Editorial action bars retain square boundaries. Other shared controls keep the existing library radius policy; this is a reusable preset rather than a pixel-identical portfolio page.

Inter body and Plus Jakarta Sans headings are bundled locally as Latin WOFF2 with supplied OFL notices. Inter reuses the existing font bytes rather than duplicating them. Heading feature `ss03` follows the source. The preset does not force the document's root font size, page padding, container, media grain, animation or all portfolio spacing variables. Non-Latin font coverage is not claimed.

No remote font import, sibling checkout, portfolio runtime script or data service is needed. The original DMF/CB/Horego groups remain separate. Core stays 0.4.0 and React stays 0.1.0-alpha.3; no React/native adapter, package publication, release tag or consumer migration is implied.

## Examples

- `/examples/portfolio/`: isolated Light, Dark and Yellow panels using extracted and existing components.
- `/create/?system=portfolio&mode=yellow`: scoped preset builder.
- Component pages for Archive Index, Tag List, Project Action Bar and Section Navigation include source boundaries and usage.

## Verification

Source tests cover native exports, scoped palette groups, source hashes, built anchors and existing package/token contracts. Browser verification covers local font loading, appearance isolation, shared-link restoration, exported JSON, Yellow normalization when switching foundations, native section/hash tracking, extracted pattern states, mobile RTL and enlarged text. Host-specific Canvas, storage, external integrations and protected case behavior are intentionally not exercised by this independent library extraction. Safari/Firefox and spoken screen readers remain pending.

Recorded results: Astro check passed across 225 files with zero errors/warnings/hints; the production build generated 49 pages; all 21 source tests passed. Isolated Chrome passed ten Portfolio axe states with zero violations/incomplete items, plus existing Create and search regressions, with no runtime or failed document/script/style requests. The portfolio repository remained clean at its original source commit. Pending navigation and product-details work in dmf-ui was preserved.
