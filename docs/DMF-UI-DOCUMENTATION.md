# Documentation site

## Ownership and audience

The standalone DMF UI repository owns its documentation site as well as the library source. The primary audience is designers and technical collaborators evaluating the available Astro components and product presets. The next action is to inspect a component or follow installation; framework support and verification claims must match evidence.

The portfolio's `/ui/` remains an integration lab. Its pages, Canvas, navigation and stored/public data are not moved into this site. This documentation is a separate local build, not a new portfolio route or a deployed domain.

## Information architecture

- `/`: Home. Explain the foundation, show real component previews and lead to Components or installation.
- `/components/`: Searchable catalog of the 17 implemented component families, grouped by purpose. Static links remain available without JavaScript; search is progressive enhancement with a result count and an empty state.
- `/components/<slug>/`: One page per exported family, with DMF/CB previews where supported, a complete Astro usage snippet, focused option table and behavior notes. Dialog and Toast preview DMF only while CB portal acceptance remains pending.
- `/docs/`: Guide index.
- `/docs/introduction/`, `/docs/installation/`, `/docs/theming/`, `/docs/presets/`, `/docs/accessibility/`, `/docs/credits/`: Six guides covering setup, ownership, customization and verified limits.
- `/examples/dmf-ui/`: Existing independent integration examples; its route and anchors remain available.

The 27-page build includes only implemented families. React, WordPress, additional product presets and complete accessibility/cross-browser certification remain future or manual-verification work. No npm publication or live documentation domain is implied.

## Source boundaries

`src/data/documentation.ts` supplies typed catalog/guide content. `src/layouts/DocumentationLayout.astro` owns Home/Components/Docs navigation, visible breadcrumbs, sidebar/mobile disclosure, a right-side desktop contents rail, local theme control and attribution links. `src/components/docs/ComponentPreview.astro` composes actual shared library components. `src/styles/documentation.css` uses existing DMF tokens and the relative 14px root/100rem container; it does not become a library stylesheet.

The documentation uses static Astro page navigation. Its theme control is page-local and does not write preferences. Shared component roots still own their normal lifecycle. If ClientRouter is later added to the documentation shell, its shell listeners need lifecycle review; the existing separate navigation fixture tests the library components rather than promising this shell's client routing.

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
