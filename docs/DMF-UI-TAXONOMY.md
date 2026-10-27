# Components taxonomy refinement

27 October 2026. Starting HEAD: 32d8e6d, clean main, two commits ahead of origin/main. Verified historical checkpoint b100ebe066affd078ccc62e28ff0f1c518a9e4c5 is an ancestor six commits behind HEAD. No portfolio changes, version/dependency changes, publication, tags, commit or push are included.

## Ownership and mapping

Eight ordered functional categories replace the mixed Foundation/Forms/Content/Portfolio/Product details groups. The existing registry and generator consume contracts/taxonomy.json, an additive dmf-ui/taxonomy.json export. Secondary collections serve discovery, not duplicate pages or implementations. The catalog combines query, responsibility and domain filters; global search uses the same category/domain keywords. All 80 canonical pages are Components. Four section compositions remain Blocks. Patterns and Examples remain separate, and no public Templates are invented.

MerchantCard changes ownership from a Food Discovery Block to a Data Display component with a Food Discovery collection tag. Its canonical Astro source/entry is src/components/dmf-ui/merchant-card and dmf-ui/merchant-card. Its previous Astro Block source is a typed forwarding wrapper, dmf-ui/blocks and root exports remain valid, and the old Block URL redirects to /components/merchant-card/. The existing React name, props, implementation and source path remain valid. Its experimental catalog record moves to react.domainComponents; react.blocks now contains four actual Blocks. Consumers of this experimental inventory must follow canonical names rather than hardcoding prior block membership. No runtime component API is removed.

Generic Card stays Data Display. LoadingButton moves to Actions & Controls because its core contract is an action with busy feedback. Badge is Data Display; Alert is Feedback & Status. Header is Layout & Structure; navigation systems remain Navigation. Code Tabs and Command Block remain Media & Content despite composing interactive controls. Portfolio-oriented bounded compositions are functionally categorized and tagged Marketing & Editorial. Existing names such as Rating, Price, Empty and EmptyState are preserved; overlapping semantics are documented rather than silently merged.

## Naming and platform boundaries

Public React names remain PascalCase; folder/subpath/slugs remain kebab-case. Human-readable titles retain existing spelling. No brand/device duplicates or universal variants are introduced. Domain tags do not certify native, mobile/tablet/desktop, POS, payment or authentication workflows. Astro records remain partial acceptance, React families experimental, and actual source/native/runtime types remain authoritative. Current rendering support is web only.

The inventory has 80 Astro component families, four Astro Blocks, 15 React component families and four React Blocks; 40 React named exports remain. Export/source filenames use only approved confidential abbreviations. Natural sizing, Nova/Neutral defaults and owner-selected CB/HUI label exceptions remain unchanged.

## Foundations icons and design

Use existing Lucide assets: Layers for the overview, SwatchBook for color, Type for typography, Ruler for spacing, Grid2x2 for layout, SquareRoundCorner for radius, Layers2 for elevation, MoveRight for motion, Shapes for iconography and Accessibility for interaction. These are decorative topic cues paired with visible labels in sidebar, overview links and subpage headings, not new icon-only actions. The shared monochrome stroke and size preserve the existing documentation language.

Design read: a documentation catalog for developers, using the existing calm Nova/Neutral hierarchy, energy/rhythm/motion 1/1/1. Categories reduce ambiguity; plain domain labels explain alternate contexts. Native dropdown filters combine naturally and the clear action restores all entries with search focus. No extra marketing surfaces, assets, dependencies or motion are added.

## Before/after inventory

All rows have one implemented documentation page and partial Astro acceptance. React availability below refers to the experimental web family, not native or full adapter parity. Risk is limited to navigation/metadata except the explicitly preserved MerchantCard compatibility path.

| Component | Previous grouping | Canonical responsibility | Collections | Public Astro subpath | React web | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| Accordion | Disclosure | Overlays & Disclosure | Point of Sale | dmf-ui/accordion | Not implemented | Metadata only |
| Alert | Feedback | Feedback & Status | Authentication, Point of Sale | dmf-ui/alert | Experimental | Metadata only |
| Alert Dialog | Disclosure | Overlays & Disclosure | Commerce & Campaigns | dmf-ui/alert-dialog | Not implemented | Metadata only |
| Archive Index | Portfolio | Navigation | Marketing & Editorial | dmf-ui/archive-index | Not implemented | Metadata only |
| Aspect Ratio | Content | Layout & Structure | Shared | dmf-ui/aspect-ratio | Not implemented | Metadata only |
| Attachment | Content | Media & Content | Marketing & Editorial | dmf-ui/attachment | Not implemented | Metadata only |
| Avatar | Product details | Data Display | Marketing & Editorial | dmf-ui/avatar | Not implemented | Metadata only |
| Badge | Feedback | Data Display | Commerce & Campaigns, Business Dashboard, Point of Sale | dmf-ui/badge | Experimental | Metadata only |
| Banner | Feedback | Feedback & Status | Business Dashboard | dmf-ui/banner | Not implemented | Metadata only |
| Breadcrumb | Navigation | Navigation | Business Dashboard | dmf-ui/breadcrumb | Not implemented | Unchanged ownership |
| Button | Foundation | Actions & Controls | Authentication, Commerce & Campaigns, Point of Sale | dmf-ui/button | Experimental | Metadata only |
| Button Group | Forms | Actions & Controls | Commerce & Campaigns, Point of Sale | dmf-ui/button-group | Not implemented | Metadata only |
| Card | Content | Data Display | Marketing & Editorial, Food Discovery, Commerce & Campaigns | dmf-ui/card | Experimental | Metadata only |
| Carousel | Content | Media & Content | Marketing & Editorial | dmf-ui/carousel | Not implemented | Metadata only |
| Checkbox | Forms | Forms & Inputs | Authentication, Food Discovery | dmf-ui/checkbox | Experimental | Metadata only |
| Chip | Product details | Data Display | Food Discovery | dmf-ui/chip | Not implemented | Metadata only |
| Code Block | Content | Media & Content | Marketing & Editorial | dmf-ui/code-block | Not implemented | Metadata only |
| Code Tabs | Content | Media & Content | Marketing & Editorial | dmf-ui/code-tabs | Not implemented | Metadata only |
| Collapsible | Disclosure | Overlays & Disclosure | Point of Sale | dmf-ui/collapsible | Not implemented | Metadata only |
| Combobox | Forms | Forms & Inputs | Food Discovery, Business Dashboard | dmf-ui/combobox | Not implemented | Metadata only |
| Command | Navigation | Navigation | Business Dashboard | dmf-ui/command | Not implemented | Unchanged ownership |
| Command Block | Content | Media & Content | Marketing & Editorial | dmf-ui/command-block | Not implemented | Metadata only |
| Description List | Content | Data Display | Business Dashboard | dmf-ui/description-list | Not implemented | Metadata only |
| Dialog | Disclosure | Overlays & Disclosure | Authentication, Point of Sale | dmf-ui/dialog | Not implemented | Metadata only |
| Drawer | Disclosure | Overlays & Disclosure | Point of Sale | dmf-ui/drawer | Not implemented | Metadata only |
| Dropdown Menu | Disclosure | Overlays & Disclosure | Point of Sale | dmf-ui/dropdown-menu | Not implemented | Metadata only |
| Empty | Feedback | Feedback & Status | Shared | dmf-ui/empty | Not implemented | Metadata only |
| Empty State | Feedback | Feedback & Status | Food Discovery, Business Dashboard | dmf-ui/empty-state | Not implemented | Metadata only |
| Field | Forms | Forms & Inputs | Authentication | dmf-ui/field | Experimental | Metadata only |
| File Input | Forms | Forms & Inputs | Business Dashboard | dmf-ui/file-input | Not implemented | Metadata only |
| Form | Forms | Forms & Inputs | Authentication, Commerce & Campaigns | dmf-ui/form | Not implemented | Metadata only |
| Header | Navigation | Layout & Structure | Marketing & Editorial | dmf-ui/header | Not implemented | Metadata only |
| Hover Card | Disclosure | Overlays & Disclosure | Point of Sale | dmf-ui/hover-card | Not implemented | Metadata only |
| Icon | Foundation | Media & Content | Marketing & Editorial | dmf-ui/icon | Not implemented | Metadata only |
| Image | Content | Media & Content | Marketing & Editorial, Food Discovery, Commerce & Campaigns | dmf-ui/image | Not implemented | Metadata only |
| Input | Forms | Forms & Inputs | Authentication, Food Discovery, Commerce & Campaigns | dmf-ui/input | Experimental | Metadata only |
| Input Group | Forms | Forms & Inputs | Business Dashboard | dmf-ui/input-group | Not implemented | Metadata only |
| Item | Content | Data Display | Business Dashboard | dmf-ui/item | Not implemented | Metadata only |
| Kbd | Content | Data Display | Business Dashboard | dmf-ui/kbd | Not implemented | Metadata only |
| Label | Forms | Forms & Inputs | Authentication | dmf-ui/label | Experimental | Metadata only |
| Layout | Foundation | Layout & Structure | Marketing & Editorial | dmf-ui/layout | Not implemented | Metadata only |
| Loading Button | Feedback | Actions & Controls | Authentication, Point of Sale | dmf-ui/loading-button | Not implemented | Metadata only |
| Logo | Content | Media & Content | Marketing & Editorial | dmf-ui/logo | Not implemented | Metadata only |
| Marquee | Content | Media & Content | Marketing & Editorial | dmf-ui/marquee | Not implemented | Metadata only |
| MerchantCard | Block / Food Discovery | Data Display | Food Discovery | dmf-ui/merchant-card | Experimental | Ownership/redirect; imports retained |
| Native Select | Forms | Forms & Inputs | Food Discovery, Business Dashboard | dmf-ui/native-select | Not implemented | Metadata only |
| Navigation Menu | Navigation | Navigation | Business Dashboard | dmf-ui/navigation-menu | Not implemented | Unchanged ownership |
| Number Field | Forms | Forms & Inputs | Commerce & Campaigns, Point of Sale | dmf-ui/number-field | Not implemented | Metadata only |
| Pagination | Navigation | Navigation | Food Discovery, Business Dashboard | dmf-ui/pagination | Not implemented | Unchanged ownership |
| Popover | Disclosure | Overlays & Disclosure | Business Dashboard | dmf-ui/popover | Not implemented | Metadata only |
| Price | Content | Data Display | Commerce & Campaigns | dmf-ui/price | Not implemented | Metadata only |
| Progress | Feedback | Feedback & Status | Commerce & Campaigns, Business Dashboard | dmf-ui/progress | Not implemented | Metadata only |
| Project Action Bar | Portfolio | Actions & Controls | Marketing & Editorial | dmf-ui/project-action-bar | Not implemented | Metadata only |
| Radio Group | Forms | Forms & Inputs | Business Dashboard | dmf-ui/radio-group | Experimental | Metadata only |
| Rating | Product details | Data Display | Food Discovery | dmf-ui/rating | Not implemented | Metadata only |
| Resizable | Content | Layout & Structure | Business Dashboard | dmf-ui/resizable | Not implemented | Metadata only |
| Responsive Navigation | Navigation | Navigation | Business Dashboard | dmf-ui/responsive-navigation | Not implemented | Unchanged ownership |
| Section | Foundation | Layout & Structure | Marketing & Editorial | dmf-ui/section | Not implemented | Metadata only |
| Section Navigation | Navigation | Navigation | Business Dashboard | dmf-ui/section-navigation | Not implemented | Unchanged ownership |
| Select | Forms | Forms & Inputs | Food Discovery, Business Dashboard | dmf-ui/select | Experimental | Metadata only |
| Separator | Foundation | Layout & Structure | Authentication | dmf-ui/separator | Experimental | Metadata only |
| Sheet | Disclosure | Overlays & Disclosure | Point of Sale | dmf-ui/sheet | Not implemented | Metadata only |
| Sidebar | Navigation | Navigation | Business Dashboard | dmf-ui/sidebar | Not implemented | Unchanged ownership |
| Skeleton | Feedback | Feedback & Status | Food Discovery, Business Dashboard | dmf-ui/skeleton | Not implemented | Metadata only |
| Slider | Forms | Forms & Inputs | Business Dashboard | dmf-ui/slider | Not implemented | Metadata only |
| Spinner | Feedback | Feedback & Status | Point of Sale | dmf-ui/spinner | Not implemented | Metadata only |
| Switch | Forms | Forms & Inputs | Business Dashboard | dmf-ui/switch | Experimental | Metadata only |
| Table | Content | Data Display | Business Dashboard, Point of Sale | dmf-ui/table | Not implemented | Metadata only |
| Tabs | Navigation | Navigation | Business Dashboard | dmf-ui/tabs | Not implemented | Unchanged ownership |
| Tag List | Portfolio | Data Display | Marketing & Editorial | dmf-ui/tag-list | Not implemented | Metadata only |
| Text | Foundation | Media & Content | Marketing & Editorial | dmf-ui/text | Experimental | Metadata only |
| Textarea | Forms | Forms & Inputs | Authentication | dmf-ui/textarea | Experimental | Metadata only |
| Theme Toggle | Forms | Actions & Controls | Business Dashboard | dmf-ui/theme-toggle | Not implemented | Metadata only |
| Toast | Feedback | Feedback & Status | Business Dashboard | dmf-ui/toast | Not implemented | Metadata only |
| Table of Contents | Navigation | Navigation | Marketing & Editorial | dmf-ui/toc | Not implemented | Unchanged ownership |
| Toggle | Forms | Actions & Controls | Business Dashboard, Point of Sale | dmf-ui/toggle | Not implemented | Metadata only |
| Toggle Group | Forms | Actions & Controls | Business Dashboard, Point of Sale | dmf-ui/toggle-group | Not implemented | Metadata only |
| Tooltip | Disclosure | Overlays & Disclosure | Business Dashboard | dmf-ui/tooltip | Not implemented | Metadata only |
| Typography | Content | Media & Content | Marketing & Editorial | dmf-ui/typography | Not implemented | Metadata only |
| Video | Content | Media & Content | Marketing & Editorial | dmf-ui/video | Not implemented | Metadata only |

## Verification

Astro check passes with zero errors, warnings or hints. The production build generates 123 pages, including the canonical MerchantCard component, the retained legacy redirect and the taxonomy guide. All 51 repository tests, seven React adapter tests and 30 locked packed React consumer tests pass. The separate packed Astro app builds four routes and renders both the new component subpath and old Block alias. No sibling package aliases or dependency/lockfile changes are introduced.

The taxonomy browser scenario passes combined query/category/domain filtering, all six implemented collections, empty/clear behavior and focus recovery, one canonical global search result, the legacy URL redirect, Foundation sidebar/overview/heading icons, and the full catalog without JavaScript. Seven full-page axe states have zero violations and zero incomplete findings. Desktop/tablet/mobile, light/dark, normal RTL and separate enlarged RTL remain contained. Foundation overview and enlarged RTL captures were visually inspected.

The browser review identified a shared-header enlarged-text overlap. Navigation links now retain their normal compact minimum while growing naturally with enlarged labels; search/GitHub/theme tools remain 32px. NativeSelect supplies the catalog's shared select appearance and chevron padding. No contrast incomplete is suppressed or waived for this scenario; existing owner-selected CB/HUI exceptions elsewhere remain unchanged.

Verification stayed serial under the external RSS watchdog. Compiler heap caps are now explicit in npm scripts: 640 MiB for Astro check and 512 MiB for build. The 1 GiB external verification RSS budget was retained; an uncapped compiler attempt was stopped rather than allowed to grow. This does not cap the independent dev server or claim cross-platform/browser performance certification.

Generated contracts, pinned upstream/token checks and whitespace checks pass. Local ignored evidence is stored under .dmf-ui-test-results, including taxonomy-audit.json, foundation-topic-icons.png and taxonomy-enlarged-rtl.png. Safari/Firefox, physical-device and spoken-reader acceptance remain separate. No portfolio edits, publication, tags, commit, push or deployment were performed.

## Scoped delivery review

- Functional and accessibility gate PASS: filtering, keyboard focus, canonical navigation, no-JavaScript content and seven strict audit states have direct browser evidence; no new contrast exception is introduced.
- Purpose gate PASS: functional categories and secondary tags reduce duplicate ownership, and existing monochrome icons identify Foundation topics while visible labels carry meaning.
- Direction gate PASS: energy/rhythm/motion 1/1/1 preserves the existing Nova/Neutral documentation language, natural sizing and restrained source-owned composition.
- Compatibility gate PASS: original component names, React exports, source behavior and legacy MerchantCard imports remain available; the before/after table and experimental metadata migration are explicit above.

## Follow-up decisions

1. Group and tag existing Blocks using the proven component metadata conventions; preserve their section-level host boundaries.
2. Consider a second discovery page before extracting a public DiscoveryListingTemplate.
3. Add menu/merchant-detail components only from an actual supplied design and independent reuse requirement.
4. Review Empty/EmptyState and future RatingDisplay/PriceDisplay naming separately; retain current APIs until a versioned migration is justified.
5. Full native/runtime property expansion, cross-browser, physical-device and spoken-reader acceptance remain separate from taxonomy.
