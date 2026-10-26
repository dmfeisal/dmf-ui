# HeroBlock composition

26 October 2026. Started from clean main at 2f9a18f, one commit ahead of origin/main. This milestone adds HeroBlock to the existing Astro and React distributions. Core remains private 0.4.0 and React remains private 0.1.0-alpha.3. No dependency, lock graph, portfolio, commit, push, tag, publication or deployment change is included. Hosted CI for this local work is not claimed.

## API and ownership

Import HeroBlock from dmf-ui/blocks in Astro or @dmf-ui/react in React, with the respective shared stylesheet and a .dmf-ui scope. Keep the same required id/title and bounded headingLevel, layout and mediaPosition contracts in both adapters. headingLevel defaults to h1 (h1/h2); layout defaults to centered (centered/split); mediaPosition defaults to end (start/end). Empty id/title and unsupported enum values are rejected. eyebrow and description are optional. Heading and description associations derive from the unique instance id. Native section attributes and React section refs are preserved.

Astro composes existing Section/Text, with actions/media/default slots. Existing Button anchors and Image can be authored in those slots. React composes native section/Text, with actions/media props and children; applications provide native anchors, router links or image components. No new Section/Image adapter, polymorphic React Button or image provider is invented. Source order matches mediaPosition at every width, including centered layouts, rather than changing only visual order through CSS. Authors must preserve meaningful reading order and label media/actions.

The Block has no script, effect, event controller, fetch, router, analytics or autoplay. Hosts own destinations, content, image alternatives and dimensions, loading priority and media failure recovery. A failed image must not remove the heading or action content. Media/action wrappers are absent when content is omitted. Loading/error/disabled APIs are not added to a static section; hosts compose those states in the relevant content. Root class/style and default content are extension points, not a page Template.

## Responsive design

Shared Hero styles are scoped to .dmf-hero-* rather than changing existing component typography. Foundation spacing, semantic surfaces/text, inherited brand fonts and natural action variants preserve Nova/Neutral defaults. The heading uses bounded fluid typography and an authored line length. Centered stays one column; split uses two equal columns only with media and at least 44rem of section-container width. A narrow container stacks on a wide desktop. Media-free split has no empty column. The media region constrains images/video/SVG to available width, while hosts provide intrinsic dimensions and alternatives.

Both grid tracks explicitly use minmax(0,1fr), and actions wrap with natural sizing. The browser review found an implicit content-grid minimum that overflowed at 200% text in narrow RTL; the explicit shrinking track corrects that defect. Standard RTL remains standard-sized. Brand, direction, root text scale, pointer behavior and available container width remain independent.

The documentation uses an existing source-owned geometric illustration, explicitly labelled as an illustration rather than a product screen. No new image, testimonial, metric, brand asset, security claim or service is fabricated. DMF light/dark is the default matrix; HUI light uses the existing verified-reference application mapping. White HUI/CB primary labels and their documented contrast exceptions are preserved, with no new brand fill or dark-mode specification.

## Distribution and documentation

The existing catalog generator records three Astro Blocks and two React Blocks separately from 79 component families and 14 React component families. React now has 37 named component/Block exports. Source declarations, source hashes, native/host ownership and defaults remain in the existing metadata pipeline, with no new registry or package.

/blocks/hero/ includes live centered/split compositions, preset controls, source-owned CodeSnippet examples for both adapters, API/defaults, anatomy, responsive/accessibility rules, dependencies and acceptance limits. The Blocks index now has a real Marketing category and global search includes HeroBlock. The architecture guide reflects the available exports. The independent packed React consumer has /hero.html, with SSR/hydration and host-selected layout, media position, locale and fallback. The independent Astro consumer has /hero/ with public Block, Button and Image imports. Neither uses sibling aliases or documentation internals.

## Verification

Final local results:

- React source/type/server/hydration suite: 7 tests passed. Locked packed React consumer: 16 acceptance tests passed, including four Hero-specific tests. These verify heading associations, defaults, optional content, source order, SSR/hydration node preservation, independent instances, replaceable locale/layout/media, native anchor activation, a bare section ref and cleanup, and host-owned media-error fallback. The media-error check dispatches a DOM error to a host-authored image; it does not claim a real network-provider recovery test. External TypeScript checks reject missing title, an unsupported layout and an incompatible SVG ref.
- Separate packed Astro consumer: clean isolated install and two-page build passed. The Hero page uses only public Block/Button/Image imports; static heading associations, split metadata, authored links and image dimensions/alternatives passed. The built page contains no script. Existing sign-in/search consumer checks remain passing.
- Astro check inspected 537 files with zero errors/warnings/hints. The source production build generated 117 pages. All 42 root tests passed. Contracts, tokens/foundations, upstream provenance and whitespace checks passed.
- The scoped Chromium packed-Hero suite passed 24 audit states: DMF light/dark and HUI light at 1280/820/390px in standard LTR/RTL, separate enlarged HUI RTL, source-order changes, a narrow host container on desktop, centered layout, authored media fallback and media-free split. There were zero unexpected violations, incomplete rules or captured page/runtime/console errors. Six standard-size HUI states retain only the existing normal-text primary-action contrast exception. The enlarged state uses the applicable large-text threshold; this does not erase the normal-text exception.
- Geometry checks verify two columns only when the actual section container is wide enough, one column without media, no measured horizontal overflow, and heading sizes bounded between 1.75rem and 3rem. The first enlarged pass exposed an implicit grid minimum; explicit shrinking tracks corrected it. Visual inspection then exposed a Text utility overriding fluid title sizing; the scoped selector and browser typography-bound assertion corrected that issue.
- Keyboard Tab/Enter and visible focus passed. Forced-colors emulation initially removed the shadow-based action focus ring; a Hero-scoped outline now passes using system CanvasText. Static React and Astro links remain usable with scripts disabled. No writes were attempted against either read-only consumer server. The Hero itself adds no motion or initialization.
- Documentation browser checks passed the Blocks index route, shared code compositions, image loading, preset/light-only mode controls, standard RTL and separate enlarged containment, the real composition-guide destination and global HeroBlock search entry.
- Desktop, standard narrow RTL and separate enlarged RTL screenshots were visually inspected. Raw reports and screenshots remain ignored under .dmf-ui-test-results/react/hero-*. Browser acceptance is distinct from packed server/DOM evidence.

Tests distinguish server/DOM evidence, Chromium emulation and manual browser/reader/device acceptance. No Safari, Firefox, spoken VoiceOver/NVDA or physical-device HeroBlock acceptance is claimed. Prior sign-in and original-family evidence retains its own scope.

Run:

```sh
npm test --prefix packages/react
npm run test:dmf-ui:react-consumer -- --keep
npm run test:dmf-ui:blocks-consumer -- --keep
DMF_UI_TEST_REACT_SCENARIO=hero npm run test:dmf-ui:react-browser -- <react-consumer> <astro-consumer>
DMF_UI_TEST_FILTER=hero-docs npm run test:dmf-ui:docs
```

## Scoped design gate

Reading: existing Nova/Neutral composition documentation for application and website authors. ENERGY 1 / RHYTHM 1 / MOTION 1. The introductory heading establishes the focal point; space separates introductory copy, real actions and optional media. The primary accent identifies the authored destination. The illustration explains the media slot; it makes no product claim. No entrance animation is introduced. 

- Hard Gate PASS for the scoped matrix and owner-approved primary-label policy: production builds, packed external imports, native interaction/no-JavaScript checks, 24 audit states and containment assertions passed. No live service or accessibility certification is fabricated.
- Purpose-Gate PASS: foundation tokens, authored type hierarchy, content/media grouping, native destinations and a system-color focus outline have concrete composition/accessibility purposes. Existing source-owned illustration and explicit caption make its role clear.
- Liveliness PASS: energy/rhythm/motion 1; the bounded fluid headline is the focal point, spacing separates tasks, and the existing primary accent identifies the main destination without decorative animation.
- Craftsmanship PASS for the scoped matrix: three observed defects (intrinsic grid minimum, forced-color focus and overridden fluid title size) were corrected and reverified. Standard RTL does not enlarge text. Owner contrast exceptions and unperformed manual browser/reader/device checks remain explicit.

## Next milestone

MerchantListingBlock follows this composition proof. Begin with host-owned items, stable keys and renderItem, native destinations, explicit populated/empty/loading/error presentation and the existing generic Card/Image/Rating/Badge primitives. Extract a public MerchantCard only when independent reuse justifies it. Fetching, favorites, geolocation, ordering, payments and product Templates remain outside that first listing milestone.
