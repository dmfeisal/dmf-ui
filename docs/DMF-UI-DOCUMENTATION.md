# Documentation site

## Ownership and audience

The standalone DMF UI repository owns its documentation site as well as the library source. The primary audience is designers and technical collaborators evaluating the available Astro components and product presets. The next action is to inspect a component or follow installation; framework support and verification claims must match evidence.

The portfolio's `/ui/` remains an integration lab. Its pages, Canvas, navigation and stored/public data are not moved into this site. This documentation is a separate local build, not a new portfolio route or a deployed domain.

## Information architecture

- `/`: Home. Explain the foundation, show real component previews and lead to Components or installation.
- `/components/`: Searchable catalog of the 17 implemented component families, grouped by purpose. Static links remain available without JavaScript; search is progressive enhancement with a result count and an empty state.
- `/components/<slug>/`: One page per exported family, with DMF/CB previews where supported, a complete Astro usage snippet, focused option table and behavior notes. Dialog and Toast preview DMF only while CB portal acceptance remains pending.
- `/create/`: Local preset configurator with live components, CSS export, JSON download and shareable query links. Astro only; CB primary stays #26ade4 and CB appearance stays light.
- `/docs/`: Guide index.
- `/docs/introduction/`, `/docs/installation/`, `/docs/theming/`, `/docs/presets/`, `/docs/accessibility/`, `/docs/credits/`: Six guides covering setup, ownership, customization and verified limits.
- `/examples/dmf-ui/`: Existing independent integration examples; its route and anchors remain available.

The 28-page build includes only implemented families. React, WordPress, additional product presets and complete accessibility/cross-browser certification remain future or manual-verification work. No npm publication or live documentation domain is implied.

## Source boundaries

`src/data/documentation.ts` supplies typed catalog/guide content. `src/layouts/DocumentationLayout.astro` owns Home/Components/Docs navigation, visible breadcrumbs, sidebar/mobile disclosure, a right-side desktop contents rail, local theme control and attribution links. `src/components/docs/ComponentPreview.astro` composes actual shared library components. `src/styles/documentation.css` uses existing DMF tokens and the relative 14px root/100rem container; it does not become a library stylesheet.

The documentation uses static Astro page navigation. Its theme control is page-local and does not write preferences. Shared component roots still own their normal lifecycle. If ClientRouter is later added to the documentation shell, its shell listeners need lifecycle review; the existing separate navigation fixture tests the library components rather than promising this shell's client routing.

Since 0.3.0, shared token CSS is generated from typed JSON. See [token authoring and migration](DMF-UI-TOKENS.md). The installation guide derives its archive version from package metadata. Create continues to derive its preview themes from the generated foundation stylesheet.

Documentation pages, layouts, data, preview wrappers and host CSS are excluded from the component archive. Keep package exports and source ownership unchanged. Update metadata when a component API changes; the option tables are a focused overview, not a generated exhaustive API reference.

## Design and accessibility

Fulldev is a directional reference for the three-part information architecture and component-first documentation. Use DMF's own wording and restrained typography rather than copying Fulldev's marketing claims or unimplemented inventory. Keep the existing semantic colors and product preset boundaries.

Native navigation and mobile details/summary remain keyboard accessible. Sidebar and contents landmarks have distinct names. Scrollable code samples are focusable, named regions with visible focus. Components retain their authored labels, headings, descriptions and portal scopes. Essential instructions stay visible; Tooltip text remains supplemental.

## Verification and local preview

Run `npm run check`, `npm run build` and `npm test`. Contract tests check that every exported component has a catalog/detail page, that built local links and fragments resolve, and that documentation host files stay out of the package.

Run `npm run test:dmf-ui:docs` for the local Ego Browser suite. It checks navigation, search/reset/empty state, a live Accordion, guide selection, light/dark themes, mobile section navigation, Tooltip containment/focus and axe page states. Reports remain in ignored `.dmf-ui-test-results/`. Browser-space recovery follows the existing managed runner rules; do not silently replace unavailable spaces.

Use `npm run dev` in this repository for a local preview. Publishing the documentation, configuring a domain and changing the portfolio's navigation are separate actions. Safari/Firefox and spoken screen-reader checks remain pending as recorded in `DMF-UI-ACCESSIBILITY.md`.

## Future platforms

See [the accepted cross-platform direction](DMF-UI-PLATFORMS.md) for portable tokens and separate React, React Native and SwiftUI implementations. These adapters remain planned.

## Create configurator

The Create page uses a compact control column and live shared Button, Input, Switch and Tabs previews. DMF/CB foundation, accent (DMF only), radius, existing bundled Nunito/system font, preview appearance and direction are supported. Light/dark preview tokens are derived from the canonical token stylesheet at build time. No parallel token source is maintained.

Settings are visit-local and encoded as allowlisted query parameters; no localStorage or server writes occur. Copy CSS, Copy link and JSON download export the current choices. Clipboard failure announces a manual-copy fallback. Reset restores DMF defaults and clears query settings. Generated CSS loads after library styles on a `data-preset="custom"` wrapper; CB also needs its existing preset import and `data-system="cb-ui" data-color-mode="light"`. Exported JSON is settings metadata, not a published package or native adapter. No installer, registry, deployment or shadcn preset-code compatibility is claimed.

Fulldev’s [Create page](https://ui.full.dev/create/) is the flow reference. DMF supports only options backed by its existing implementation. Host configurator files stay outside the library archive. Browser checks cover exported values, URL restoration and invalid-query handling, reset, CB restrictions, live interaction, download, clipboard error handling, dark/mobile/RTL containment and axe checks.
