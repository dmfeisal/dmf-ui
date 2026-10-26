# SearchFiltersBlock and connected discovery example

27 October 2026. Continues from 651b94e. Core remains 0.4.0 and React remains 0.1.0-alpha.3. No dependency, lockfile, package publication, tag, portfolio or deployment change is included. The owner authorized a commit after verification; push is separate.

## Delivered scope

The React SearchFiltersBlock adapts the existing Astro native GET composition using the existing Input, Select, Checkbox, Field, Button and Alert exports. It forwards native form attributes, events and ref. query, selectedValue and checked facet values are uncontrolled initial/reset defaults. Native reset restores authored defaults without changing the URL. fields and children are host extension points. pending disables the fieldset; submitDisabled only guards submission. Capture FormData before setting pending. Labels, heading, errors and the separate pending announcement are configurable.

The public contract remains host-owned: no fetching, URL parser, application state, custom popup, persistence or search service is added to the Block. Validation rejects empty IDs/actions, colliding field names, duplicate/empty option values and disabled/missing initial choices. Each instance remains independent.

The catalog has 79 Astro component families, five Astro Blocks, 14 React component families and five React Blocks, with 40 named React component/Block exports. Actual declarations, source hashes and ownership are generated through the existing inventory. No public Template or registry is introduced.

## Connected example

`/examples/discovery/` renders a React host that composes SearchFiltersBlock, MerchantListingBlock and MerchantCard. The same source under packages/react/examples is copied into the isolated packed consumer, where its UI import resolves to @dmf-ui/react. Documentation compiles JSX using the React package's existing configuration; examples are now included in that package's type check. Library declaration output still contains only src.

The host owns six explicitly illustrative records, three-result pagination, case-insensitive query matching, category and supplied-photo filters. Photos reuse the owner-supplied MerchantCard assets; there are no invented ratings, availability, distances, merchant profiles or requests. Card destinations explain the sample data rather than impersonating real merchant pages.

- Draft fields do not alter results until Apply filters.
- Applying captures FormData, resets the page, derives matching records, writes the known URL parameters and focuses the result summary.
- Real page links retain native modified-click behavior. Ordinary enhanced activation updates results and history together.
- Initial client mount and popstate restore applied values and results. Unknown categories and invalid/out-of-range pages fall back to supported values for display. Later application/page activation writes normalized state.
- The example deliberately intercepts Reset filters to clear its known URL parameters and remount empty field defaults. Unrelated parameters remain. This clear policy does not change native Block reset semantics.
- An unmatched query shows an empty state. Explicit state-preview controls demonstrate loading/error without timers or fabricated requests. Loading hides stale results and disables filter editing. Recovery preserves applied filters and focuses the query.
- The static build cannot render server-filtered GET results. A visible pre-enhancement note states that limitation. Native GET submission/reset and sample links remain usable without JavaScript; only appearance/state-preview controls start disabled. Real hosts must supply their own GET endpoint and request/error/cancellation policy.

The searchable documentation includes the example and `/docs/search-and-recovery/` pattern. The Blocks index and SearchFiltersBlock API link to both. DiscoveryListingTemplate remains a future extraction after page-structure reuse is proven. Merchant-detail Blocks and authentication expansion remain separate backlog items.

## Design decisions

Reading this as a working documentation example for application developers in the established Nova/Neutral language: energy 1, rhythm 1, motion 1.

- Neutral semantic colors preserve the default; HUI is an explicit scoped comparison. White HUI primary labels retain the owner's existing contrast exception.
- Existing type roles and natural control sizes keep the example consistent with the catalog; no new fonts or blanket touch minimums.
- A compact wrapping appearance toolbar separates illustrative controls from real filter fields.
- The filter form precedes the result summary and container-aware card grid, matching the search task and keyboard reading order.
- MerchantCard supplies the repeated visual identity because records are merchant summaries; the original image strip and gradient are inherited reference anatomy, not new decoration.
- Logical spacing, a bounded wrapper and visible result/link focus support narrow, RTL and enlarged layouts. RTL alone never changes font size.

## Verification

Astro check passes for 566 files with zero errors, warnings or hints. The production build generates 121 pages. All 42 repository tests, seven React adapter tests and 28 locked packed-consumer tests pass. Token/foundation, pinned upstream, generated contract and whitespace checks pass. Versions and dependency/lock graphs are unchanged.

The packed consumer proves public imports, native GET/reset/ref cleanup, independent forms, localized labels/pending/error text, option/field validation, URL normalization, combined filters, hydration without warnings, deep-link restoration and the honest pre-enhancement fallback. It uses an installed archive rather than sibling package aliases.

Chromium verifies Apply/Reset, combined query/category/photo filtering, page reset, pagination, Back/Forward, reload, empty/loading/error/recovery, keyboard submission/result focus, native card destinations, forced-color control boundaries and native GET submission with JavaScript disabled. The scenario reports no runtime/hydration errors and the local server reports no write requests. Normal RTL is distinct from the separate 200% text case.

The 22 full-page axe states cover Neutral light/dark and HUI light at 1280/820/390px in LTR/RTL, the three explicit result states and enlarged HUI RTL. Six HUI states retain only the owner-selected white primary-label contrast finding (approximately 4.28:1 measured here). The other 16 states have zero violations. All 22 have zero incompletes and remain horizontally contained. Unknown violations are not waived. Desktop, standard RTL, enlarged RTL and the built documentation captures were visually reviewed.

The real documentation page passes client hydration from a category deep link, filtering/clear behavior, scoped preset changes, React Block API links and the recovery guide route. The shared source-owned example works independently in the packed app. Reports and captures remain local ignored artifacts under .dmf-ui-test-results/react, including discovery-audit.json and discovery-documentation.png.

Safari/Firefox, physical devices and spoken-reader acceptance remain untested for this milestone. The known owner label policy is not a WCAG AA pass; local Chromium evidence does not certify the complete catalog.

## Scoped delivery gate

- Hard gate PASS under the owner's existing contrast exception policy: all new controls have tested behavior, sample content is labeled, real destinations exist, layouts remain contained and no unknown contrast finding is waived. Native GET remains enabled before enhancement.
- Purpose gate PASS: photos and their inherited gradient reproduce the selected card reference, while the form/grid order, compact toolbar, semantic colors and existing type roles serve documented tasks. No new decorative assets or fabricated business claims are added.
- Liveliness PASS: energy/rhythm/motion 1/1/1 matches the established documentation direction; the merchant image strip provides a specific visual motif, with the query/results workflow providing hierarchy and structural spacing.
- Craftsmanship PASS: packed reuse, 77 passing automated tests, 121 built pages, recorded browser click-through, normal/separate enlarged RTL, and visual inspection substantiate the scoped delivery. Manual platform/AT acceptance remains explicitly bounded above.

## Next milestone

Evaluate DiscoveryListingTemplate with replaceable page regions and host data only after a second page proves the composition boundary. The next domain expansion can introduce MenuItemCard and merchant-detail Blocks from supplied designs, reusing current Card/Image/Rating primitives. SignUpBlock, PasswordRecoveryBlock and PageHeaderBlock remain independent backlog work; no ordering, payment or live merchant backend is implied.
