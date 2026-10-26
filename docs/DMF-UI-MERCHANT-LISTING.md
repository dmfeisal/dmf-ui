# MerchantListingBlock composition

26 October 2026. Started from clean main at 50832797ce7b6aeac2fd21821a5ef03562dd1801. This is the first Food Discovery Block, using the existing Astro and React distributions. Core remains private 0.4.0 and React remains private 0.1.0-alpha.3. No dependency, lock graph, portfolio, commit, push, tag, package publication or deployment change is included. No exact-commit hosted CI is claimed for this local work.

## API and ownership

Both adapters require a unique id, nonempty title, readonly items and getItemKey returning unique nonempty string identities. Keys come from stable application identity, not array positions. React uses generic MerchantListingBlockProps<Item> and renderItem; Astro uses unknown data at the key callback and an item function slot when ready results are populated. React keys preserve item identity during reconciliation. Astro validates identities while producing static HTML; no client reconciliation or hydration runtime is implied.

The Astro callback is passed through a native wrapper, for example div with slot="item", and rendered using Astro.slots.render('item', [item]). The compiler transfers that callback without rendering the wrapper. A component Fragment wrapper does not forward these function arguments. This adapter boundary follows [Astro's documented function-slot convention](https://docs.astro.build/en/reference/astro-syntax/#astroslotsrender). The catalog now extracts the named render call as well as ordinary slot tags. Only output from the authored Astro slot renderer is inserted into the list, not arbitrary item-supplied HTML.

status defaults to ready and accepts ready/loading/error. A ready empty array produces the empty view; empty is not another status. Loading/error hide stale results and pagination and do not call item/key callbacks. Status transitions belong to the host. A polite atomic status region sits outside the aria-busy result body. Its default loading copy is configurable; hosts provide statusMessage for actual result updates. Result counts are not fabricated or automatically announced. Custom error content is wrapped in an alert; hosts own retry behavior and post-error focus.

headingLevel defaults to h2 (h1/h2/h3), with associated heading/description IDs. Empty/error message headings follow the section heading level. Loading placeholders are decorative, unanimated and unfocusable. Optional copy, actions, pagination, empty/error/loading content and default children/slots allow host customization. Native section attributes, class/style and React section refs remain available. Custom item markup must preserve list semantics, heading order, labels and unique IDs. Avoid nested interactive card targets and custom live regions that duplicate the shell's announcements.

No merchant data schema, public MerchantCard, remote fetch, location, favorite, reservation, ordering, voucher, payment, persistence or transport abstraction is introduced. The examples compose existing Card, Text, Image and Badge; those are host choices rather than mandatory item APIs. Astro reuses Text, EmptyState and Skeleton; React reuses Text and existing skeleton styling. No new generic component is extracted solely for this Block.

## Responsive and brand behavior

The section is a container-aware grid: one column below 36rem, two at 36rem and three at 60rem of actual available section width. These are layout thresholds, not device detection. Tracks shrink with minmax(0,1fr); cards wrap, images remain within their item, and controls retain natural sizing. A narrow host container stacks on desktop. Logical spacing supports standard RTL. Enlarged text is a separate acceptance case, never enabled by direction.

Nova/Neutral remains the default. DMF light/dark and HUI light are the scoped browser matrix; existing CB/HUI primary-label preferences and unchanged fills remain. Owner-selected white labels have known normal-text contrast exceptions, not blanket accessibility approval. Native focus outlines use semantic foreground and system CanvasText in forced colors. No new motion or brand assets are added.

All merchant records, destinations and images in the proofs are explicitly illustrative. Names such as Sample café A are not real recommendations, locations, ratings or customer claims. The existing source-owned geometric image is decorative. No fabricated review statistics, prices, distance or purchase result is displayed.

## Distribution and documentation

Astro exports the Block through dmf-ui/blocks and the existing root barrel; React exports it from @dmf-ui/react. The catalog records four Astro Blocks and three React Blocks separately from 79 Astro component families and 14 React component families. React has 38 named component/Block exports. Both adapter declarations, hashes, state ownership and actual Astro slots remain in the existing generator. No new package or registry is added.

/blocks/merchant-listing/ includes four live states, source-owned CodeSnippet usage/API/defaults for both adapters, dependency/ownership rules, responsive behavior and acceptance limits. The Blocks index has a real Food Discovery category and global search includes the new Block. Existing roadmap statements are updated without rewriting historical verification records.

The locked packed React consumer adds /listing.html with SSR/hydration, locale/state/count controls and local retry/pagination demonstrations. Its authored per-item input proves stable identity across host reordering. The packed Astro consumer adds /listing/ with public imports and four static states. Neither uses documentation internals or sibling aliases. Their native item destinations exist in the fixture; they do not represent real merchant pages or network services.

## Verification

Final local results:

- React source/types/server/hydration: all 7 tests passed. The locked packed React consumer passed 20 tests, including four listing-specific tests. These cover native lists/heading associations, string-key validation and duplicate rejection, no key/item callback execution while nonready, empty versus error semantics, live status outside busy content, custom loading/empty content, section refs and cleanup, independent IDs and SSR/hydration node preservation.
- Native per-item input nodes and values survive host reordering by stable key. The host-owned local retry returns focus to its state control. Both generic item inference and invalid key/status/renderer TypeScript contracts passed. No DOM test is described as spoken-announcement verification.
- Independent packed Astro consumer: isolated installation and three-page build passed. The listing page renders its item function slot, heading associations, populated/empty/loading/error states and custom extension content using public imports. It contains no Block script. Existing authentication/search/Hero proofs remain passing.
- Astro check: 546 files, zero errors/warnings/hints. Source build: 118 pages. All 42 root tests passed. Contract generation/check, tokens/foundations, upstream provenance and whitespace checks passed.
- Scoped Chromium packed listing: 29 audit states passed across DMF light/dark and HUI light, 1280/820/390px standard LTR/RTL, loading/error/empty/one-item examples, separate 200% HUI RTL ready/error cases and a narrow host container on desktop. There were zero unexpected violations, incomplete rules or captured page/runtime/console errors. One standard-size HUI error state retains only the existing primary retry-label contrast exception; the enlarged case uses the applicable large-text threshold.
- Three/two/one-column geometry follows available section width. Loading shows no stale list/pagination/input targets; skeletons are unanimated and decorative. Native item links, keyboard focus, host retry, independent instances, forced-color focus and no-JavaScript links in both adapters passed. Neither read-only consumer server received a write request.
- The enlarged localized recovery action initially overflowed its panel. A shrinkable message track and naturally wrapping button corrected the defect; it was reverified in the packed browser suite and visually inspected in a focused screenshot. No touch minimum or brand fill was changed.
- Documentation browser checks passed four authored states, shared code blocks, actual card destinations, preset/light-only mode controls, standard RTL, separate enlarged containment and the global search entry. Desktop, normal narrow RTL, enlarged text and the enlarged recovery panel were visually inspected. Raw audit data and screenshots stay under ignored .dmf-ui-test-results/react/listing-*.

Server/DOM tests, Chromium emulation and spoken AT/physical-device evidence remain distinct. No Safari, Firefox, spoken VoiceOver/NVDA or physical-device MerchantListingBlock acceptance is claimed.

```sh
npm test --prefix packages/react
npm run test:dmf-ui:react-consumer -- --keep
npm run test:dmf-ui:blocks-consumer -- --keep
DMF_UI_TEST_REACT_SCENARIO=merchant-listing npm run test:dmf-ui:react-browser -- <react-consumer> <astro-consumer>
DMF_UI_TEST_FILTER=listing-docs npm run test:dmf-ui:docs
```

## Scoped design gate

Reading: existing Nova/Neutral result-composition documentation for application authors. ENERGY 1 / RHYTHM 1 / MOTION 1. Native list/card grouping explains each result; spacing separates heading, host controls and results; the primary accent appears only on a real authored action. Static skeletons indicate the explicitly selected loading example without invented progress. No decorative illustration, new font or motion is added. 

- Hard Gate PASS within the scoped matrix and owner-approved contrast policy: production builds, external packed imports, native interaction/state checks, 29 audit states and containment assertions passed. No real merchant, service or accessibility certification is invented.
- Purpose-Gate PASS: native list semantics and Card grouping organize authored results, foundation spacing separates controls/results, static skeletons indicate loading, and the scoped outline preserves keyboard focus. The existing geometric image is decorative, explicitly illustrative content.
- Liveliness PASS: energy/rhythm/motion 1; headings and state copy establish hierarchy, structural whitespace groups results, and the existing primary accent identifies a real host recovery action.
- Craftsmanship PASS for the scoped matrix: identity retention, no stale rendering, localized state copy, native destinations, focus recovery, normal/forced colors and standard/separate enlarged RTL are verified. The observed recovery overflow was fixed rather than exempted. Manual browser/reader/device limits and owner contrast exceptions remain explicit.

## Next

The three-family proof now covers authentication, marketing and discovery. Next, connect search/filter input to listing presentation in a host-owned discovery example and document the search/error/recovery pattern. Evaluate a React SearchFiltersBlock adapter using existing native fields before creating SearchDiscoveryBlock or a full page Template. Domain card extraction still requires independent reuse evidence; ordering/payment remain optional future extensions.
