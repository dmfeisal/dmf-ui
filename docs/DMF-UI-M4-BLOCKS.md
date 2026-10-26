# M4 initial Blocks reconciliation

26 October 2026. Starting checkout: main at aad9f298f9701ebf16490aa95326c356c3b64266, with a clean working tree. origin/main and the GitHub main ref remain 609fceda52bbbc1f06c5da6a2374d9b4138a5143. GitHub returned no commit for aad9f29, so no remote CI result is claimed for it. This continuation does not push the local checkpoint.

## Actual milestone state

aad9f29 changed 29 files, adding 572 lines and removing 62. It implemented M1 Button architecture, compact control-height aliases, stable LoadingButton labels/status, reviewed Contract v2 integration, selection error/reset behavior and tests. It introduced no Blocks, Blocks routes, pilot compositions or Navigation/Disclosure reviews.

The handoff's expansion condition was therefore not met. This iteration closes initial architecture and the two missing pilots first. SignUpBlock, PasswordRecoveryBlock and PageHeaderBlock remain planned rather than being presented as shipped. No existing Block was renamed or rebuilt.

| Requirement at checkpoint | Reconciled status |
| --- | --- |
| Blocks architecture/source exports | Not implemented; added in this continuation |
| Blocks index, detail routes and global search | Not implemented; added in this continuation |
| SignInBlock | Not implemented; added in this continuation |
| SearchFiltersBlock | Not implemented; added in this continuation |
| Three proposed expansion Blocks | Not implemented; deferred under the initial-pilots fallback |
| Navigation/Disclosure v2 applicability review | Partially implemented as source inventory; eight reviews added |
| Blocks-specific tests | Not implemented; source/archive and browser acceptance added |
| Existing component/React tests | Existing baseline retained; rerun for compatibility |
| Brand render/layout/interaction acceptance | Verification scoped to recorded browser states; owner contrast findings retained |
| Safari/Firefox, spoken AT and physical devices | Verification pending, not automatically certified |

## Architecture and distribution

SignInBlock and SearchFiltersBlock live under src/components/dmf-ui/blocks and compose exported components. Import them from dmf-ui/blocks or the existing core barrel. Existing exports remain unchanged. The current core remains Astro-oriented source distribution; tokens and contracts are portable specifications, while React remains its separate experimental web adapter. No new package, dependency, registry installer or Block runtime was introduced.

The existing catalog generator now adds a separate blocks inventory with source hashes, actual Props declarations, authored defaults, slots, dependencies and limitations. Blocks are excluded from the component-family enumeration rather than being mislabeled as a new component family. Their documentation registry feeds the index and global search. Source/archive tests cover the namespace and included source/styles. Existing component records and fields stay available.

## Pilots

SignInBlock composes Card, Field, Input, FieldError, Alert and LoadingButton. It requires a unique id and host action, uses POST, requires email/password, preserves username/current-password autocomplete and accepts no initial password. Hosts configure heading/copy, field names, errors and optional actual footer destinations. Named fields/footer and default slots support extensions without nested forms. pending/disabled affect the native fieldset; submitDisabled can guard readiness without disabling editing. The host owns authentication, transport, session state, CSRF handling and completion/error decisions.

SearchFiltersBlock composes Field, Input, NativeSelect, Checkbox, Button and Alert. It uses a host-supplied GET destination, configurable query/choice field names, unique enabled initial choice, optional checkbox facets and a filters slot. Native reset restores authored defaults rather than rewriting the URL or fetching results. The host owns query parsing, results, async work and persistence. It does not add a remote-search, multi-select or custom combobox API.

Both Blocks work as native forms without JavaScript against a supplied host endpoint. Props represent server-rendered state, not a new client controller. Capture values before disabling controls for pending work. Documentation scripts intercept only demonstration instances, never authenticate or request results, never log credentials, and keep uninitialized submit actions disabled. Pending/error controls are local illustrations, not fabricated application effects. Repeated enhancement is guarded and listeners abort before Astro swaps.

## Documentation and design

/blocks/ lists only implemented categories: Authentication and Search & Filtering. /blocks/sign-in/ and /blocks/search-filters/ include live previews, anatomy, dependencies, actual Props/defaults, slots, shared CodeSnippet usage, interaction/fallback rules, responsive behavior, brand scope, source guidance and limitations. Header navigation and global search include Blocks. Patterns/Templates remain taxonomy boundaries, not empty available routes.

Direction stays Nova/Neutral, calm documentation (energy 1, rhythm 1, motion 1). The narrow sign-in Card groups a repeated account-entry structure; the search grid groups query/choice/facets and stacks on narrow screens. Actions wrap naturally and logical spacing supports RTL. Components supply colors, focus and state behavior; Blocks add only scoped composition layout. No blanket touch minimum or client-specific assets are added.

## Navigation and disclosure review

The existing reviewed-input/catalog pipeline now covers Breadcrumb, Pagination, NavigationMenu, Sidebar, ResponsiveNavigation, SectionNavigation, Accordion and Collapsible. The review records native versus enhanced state ownership, actual props/defaults, meaningful presentation modes, current-page/location semantics, native link versus action behavior, keyboard/focus rules, progressive enhancement and cleanup boundaries.

No navigation redesign or unsupported universal presentation API was added. Accordion keeps its Data Slot API; native Collapsible remains the no-JavaScript disclosure option. The generated parts/type references remain the complete-source entry point; full inherited/runtime type resolution, all content/preset combinations and manual AT acceptance remain partial.

## Accessibility and compatibility

CB/HUI primary labels retain white text on their unchanged fills, with the existing approximately 2.57:1 and 4.29:1 normal-text exceptions. Browser tests retain raw findings and classify only primary Block submit controls or their label descendants in those presets as known exceptions; unrelated violations fail. Incomplete findings remain for manual review. These results are not a WCAG AA or full-catalog certification.

Package versions remain core 0.4.0 and React 0.1.0-alpha.3. No existing component API, preset identifiers, source attribution or license text was removed. No portfolio repository, release tag, package publication, push or deployment is included. The user subsequently authorized a commit after successful checks.

## Roadmap

Next: expand the now-established architecture with SignUpBlock and PasswordRecoveryBlock using the sign-in composition and explicit host state, then PageHeaderBlock using the reviewed Breadcrumb/navigation primitives. Reuse the same source export, catalog and documentation conventions.

Prepare M4.2 after that scoped expansion: evaluate MerchantCard, MenuItemCard, OfferCard, ReviewCard and RatingDisplay against existing generic Card/Image/Rating/Badge/Button primitives. Add domain structure only when those primitives cannot express the actual data. Then consider MerchantGrid, NearbyMerchantsBlock, MerchantMenuBlock and MerchantReviewsBlock before DiscoveryListingTemplate/MerchantDetailTemplate and realistic host-owned examples. No Food Discovery implementation, cloned product screen or client-specific logic is introduced here.

## Verification

Final source verification: Astro check inspected 520 files with zero errors, warnings or hints; all 42 source/archive tests passed; the production build generated 115 pages. Tokens, contracts, pinned upstream provenance and whitespace checks passed. The existing React adapter tests passed 7 checks and its locked packed consumer passed 8 checks. The inventory remains 79 component families, 2 Astro Blocks and 35 React exports; Blocks do not imply new React adapters.

Browser regression evidence includes 16 navigation-component audit states, 42 navigation-pattern states, global search and documentation layout at seven viewports. The separate final Blocks suite passed native validation, keyboard submission, native values/reset, pending/error and independent instances, footer/filter slots, preset layouts, forced colors, reduced motion, repeated initialization and no-JavaScript guards. Its 20 audited states retained four CB/HUI exception states with zero incompletes and no unrelated violations. Native-dropdown image-related axe incompletes are retained in the raw reports and reviewed by independently measuring opaque foreground/background text contrast and reserved chevron padding. Unknown incompletes and unrelated violations fail. Keyboard tooltip checks scroll controls into view before exercising real focus transitions. The isolated disclosure regression passed Accordion defaults/single/multiple/disabled/keyboard/ARIA, Tooltip hover/focus/Escape/native links, CB mobile RTL portal geometry, reduced motion and lifecycle cleanup. Its test now observes running animations and tooltip visibility with deadlines instead of waiting indefinitely on animation finished promises; no disclosure runtime was changed.

The Block audit found and fixed inherited dark NativeSelect text in the Portfolio scope by explicitly applying the existing foreground token. Its adapted-source hash was recorded with the upstream tool; original upstream hashes and license text are unchanged. Long Block names now wrap in enlarged RTL documentation layouts.

Scoped design gate: PASS for the implemented compositions, Nova/Neutral defaults, natural sizing, existing primary-label preferences, readable hierarchy, real host boundaries, scoped styles and documented fallback. The two pilots are the completed initial phase; the three proposed expansion Blocks remain deferred. Known CB/HUI primary-text contrast exceptions remain open by owner preference.

Safari, Firefox, spoken VoiceOver/NVDA and physical-device acceptance remain pending. Forced colors, reduced motion and narrow/enlarged RTL checks use Chromium emulation. These are scoped results, not full accessibility certification. Exact-commit remote CI is unavailable for the local-only checkpoint and this continuation; no push or deployment was performed.
