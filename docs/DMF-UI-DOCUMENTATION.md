# Documentation site

## Ownership and audience

The standalone DMF UI repository owns its documentation site as well as the library source. The primary audience is designers and technical collaborators evaluating the available Astro components and product presets. The next action is to inspect a component or follow installation; framework support and verification claims must match evidence.

The portfolio's `/ui/` remains an integration lab. Its pages, Canvas, navigation and stored/public data are not moved into this site. The standalone documentation is deployed at https://ui.feisal.id through Netlify.

## Information architecture

- `/`: Home. Explain the foundation, show real component previews and lead to Components or installation.
- `/components/`: Searchable catalog of the 21 implemented component families, grouped by purpose. Static links remain available without JavaScript; search is progressive enhancement with a result count and an empty state.
- `/components/<slug>/`: One page per exported family, with one full-width DMF preview, a copyable Astro usage snippet with a manual clipboard fallback, focused option table and behavior notes. Product preset customization is shown on Create rather than repeated across component pages.
- `/create/`: Local preset configurator with live components, CSS export, JSON download and shareable query links. Astro only; CB primary stays #26ade4. CB and the brand-derived Horego preset stay light; Portfolio offers Light, Dark and Yellow.
- `/docs/`: Guide index.
- `/docs/icons/`: Lucide guidance and a searchable curated gallery with sizing, stroke options and copyable examples.
- `/docs/contracts/`, `/docs/introduction/`, `/docs/installation/`, `/docs/theming/`, `/docs/presets/`, `/docs/accessibility/`, `/docs/credits/`: Seven guides covering component intent, setup, ownership, customization and verified limits.
- `/examples/dmf-ui/`: Existing independent integration examples; its route and anchors remain available.

The 34-page build includes implemented Astro families and an experimental React proof at `/examples/react/`. Stable React support, WordPress, native adapters, additional product presets and complete accessibility/cross-browser certification remain future or manual-verification work. Packages remain unpublished.

## Source boundaries

`src/data/documentation.ts` supplies typed catalog/guide content. `src/layouts/DocumentationLayout.astro` owns Home/Components/Docs navigation, visible breadcrumbs, sidebar/mobile disclosure, a right-side desktop contents rail, local theme control, grouped component navigation, global search and attribution links. `src/scripts/documentation.ts` owns the progressively enhanced search and code-copy controls. `src/components/docs/ComponentPreview.astro` composes actual shared library components. `src/styles/documentation.css` uses existing DMF tokens and the relative 14px root/100rem container; it does not become a library stylesheet.

The documentation uses static Astro page navigation. Its theme control is page-local and does not write preferences. Shared component roots still own their normal lifecycle. If ClientRouter is later added to the documentation shell, its shell listeners need lifecycle review; the existing separate navigation fixture tests the library components rather than promising this shell's client routing.

Since 0.3.0, shared token CSS is generated from typed JSON. See [token authoring and migration](DMF-UI-TOKENS.md). The installation guide derives its archive version from package metadata. Create continues to derive its preview themes from the generated foundation stylesheet.

Version 0.4.0 adds four content primitive pages, a contract guide and a shared Card/Text/Badge/Alert composition in Create. See [content contracts](DMF-UI-CONTENT.md).

Documentation pages, layouts, data, preview wrappers and host CSS are excluded from the component archive. Keep package exports and source ownership unchanged. Update metadata when a component API changes; the option tables are a focused overview, not a generated exhaustive API reference.

## Design and accessibility

Fulldev is a directional reference for the three-part information architecture and component-first documentation. Use DMF's own wording and restrained typography rather than copying Fulldev's marketing claims or unimplemented inventory. Keep the existing semantic colors and product preset boundaries.

Native navigation and mobile details/summary remain keyboard accessible. Sidebar and contents landmarks have distinct names. Scrollable code samples are focusable, named regions with visible focus. Components retain their authored labels, headings, descriptions and portal scopes. Essential instructions stay visible; Tooltip text remains supplemental.

## Verification and local preview

Run `npm run check`, `npm run build` and `npm test`. Contract tests check that every exported component has a catalog/detail page, that built local links and fragments resolve, and that documentation host files stay out of the package.

Run `npm run test:dmf-ui:docs` for the local Ego Browser suite. It checks navigation, search/reset/empty state, all scripted component previews and local Button/menu feedback, guide selection, light/dark themes, mobile section navigation, Tooltip containment/focus and axe page states. Reports remain in ignored `.dmf-ui-test-results/`. Browser-space recovery follows the existing managed runner rules; do not silently replace unavailable spaces.

Use `npm run dev` in this repository for a local preview. The Netlify site builds this repository independently of the portfolio. Safari/Firefox and spoken screen-reader checks remain pending as recorded in `DMF-UI-ACCESSIBILITY.md`.

## Future platforms

See [the accepted cross-platform direction](DMF-UI-PLATFORMS.md) for portable tokens and separate platform implementations. A private [React web alpha](DMF-UI-REACT.md) now has a packed consumer proof; stable React support, React Native and SwiftUI remain planned.

## Create configurator

The Create page uses a compact control column and live shared Button, Input, Switch and Tabs previews. DMF/CB foundation, accent (DMF only), radius, existing bundled Nunito/system font, preview appearance and direction are supported. Light/dark preview tokens are derived from the canonical token stylesheet at build time. No parallel token source is maintained.

Settings are visit-local and encoded as allowlisted query parameters; no localStorage or server writes occur. Copy CSS, Copy link and JSON download export the current choices. Clipboard failure announces a manual-copy fallback. Reset restores DMF defaults and clears query settings. Generated CSS loads after library styles on a `data-preset="custom"` wrapper; CB also needs its existing preset import and `data-system="cb-ui" data-color-mode="light"`. Exported JSON is settings metadata, not a published package or native adapter. No installer, registry, deployment or shadcn preset-code compatibility is claimed.

Fulldev’s [Create page](https://ui.full.dev/create/) is the flow reference. DMF supports only options backed by its existing implementation. Host configurator files stay outside the library archive. Browser checks cover exported values, URL restoration and invalid-query handling, reset, CB restrictions, live interaction, download, clipboard error handling, dark/mobile/RTL containment and axe checks.

## Development interaction fix — 25 October 2026

The running localhost documentation server reproduced `504 Outdated Optimize Dep` responses for interaction modules, leaving controls inert. Vite caches are now isolated by Astro command (dev/build/preview/sync), so validation does not share the running development optimizer directory. All ten Data Slot packages are explicitly prebundled instead of being discovered as individual preview pages are visited. This changes host tooling only; core package versions and component controllers are unchanged.

Each component detail now contains one DMF preview. Create retains its CB foundation option, primary/light restrictions and working Switch/Tabs. Button and menu examples provide local polite feedback; unavailable actions remain disabled. Their page-local listeners are idempotent and cleaned up before a swap, with no persistence or network writes.

The live server was kept open while Astro check/build and the source suite ran, then rechecked with isolated Chrome 155. Documentation/Create/content browser scenarios pass with no runtime errors or failed document/script/style requests. Coverage includes all scripted previews, Checkbox/Switch label activation, keyboard radio/select/Tabs, Accordion disclosure, modal Escape/focus return, Popover Done, menu selection feedback, Toast/Tooltip, search/navigation, themes, mobile containment and Create exports/reset. There are 17 passing source tests, including the new single-DMF-preview/CB-on-Create contract. Earlier historical two-preset detail-page evidence no longer describes the current component-page layout. Local evidence remains under ignored `.dmf-ui-test-results/`.

The documentation Tooltip stays within the main preview landmark (`portal={false}`), avoiding the prior supplemental-content landmark exception while retaining collision positioning and Escape/focus behavior. The documentation browser audit now requires zero violations and zero incomplete rules.

Final verification also passes against a read-only server for the production build. The six documentation, four Create and eight content-detail axe states have zero violations and zero incomplete rules. Live and production network reports contain no runtime errors or failed page/script/style requests. Astro check reports 188 files with zero errors/warnings/hints; the production build contains 34 pages. The mobile single-preview Tooltip capture was visually inspected. Component pages now instantiate one preset preview instead of two; no new core controller or persistence layer was added. Existing Field/Card work and unrelated portfolio changes remain preserved. This documentation fix requires its own hosted CI result.

## Netlify hosting

The production hostname is `ui.feisal.id`. `netlify.toml` builds the static documentation into `dist` on Node 24. Netlify installs root dependencies; the build command also installs the separate locked React dependencies because `/examples/react/` imports the experimental adapter source. No Astro server adapter or SPA fallback is needed. Missing routes should retain Netlify's 404 response.

Local Netlify linkage is ignored under `.netlify/` and must not be committed. Keep custom-domain DNS separate from the portfolio's apex hostname. The external DNS provider is Cloudflare; only the `ui` subdomain needs a record pointing at this documentation project's assigned Netlify hostname. Deployment/domain verification is recorded after the project is configured.

Netlify project created: `dmf-ui` (`fa4ed270-7ba4-4172-8f0d-5aa285632415`) in workspace `daengdoang`. Assigned hostname: `dmf-ui.netlify.app`. Project dashboard: https://app.netlify.com/projects/dmf-ui. At preparation time the project has no deploy; repository connection, `ui.feisal.id` assignment, Cloudflare CNAME and HTTPS verification remain pending authentication/configuration.

## Documentation refinement — 2026-10-25

Global search covers components, guide topics and Create. Open it from the header, Cmd/Ctrl K, or `/` outside editable controls. Native links support arrow navigation and Enter; Escape closes directly and returns focus. Results are ranked by title, match multiple words, and render query text safely. Search, copying and grouped navigation use the existing DMF tokens. Without JavaScript, catalog links and usage text remain available.

Verification includes production and development browser flows, search empty/results states, shortcuts, focus return, exact code copying and denied-clipboard fallback, mobile containment and enlarged text. Automated checks do not replace spoken screen-reader or Safari/Firefox verification. Core remains 0.4.0 and React remains 0.1.0-alpha.3.

Astro check: 190 files, zero errors/warnings/hints. Production build: 34 pages. Source tests: 17/17 passed with localhost permissions and a writable temporary npm cache. Isolated Chrome passed documentation, Create, content pages and global search flows with no runtime or failed asset requests. Search axe checks cover empty/results, dark and mobile states. At 200% mobile text, axe requested manual contrast review for a wrapped result description; screenshot review found readable, separated text using the same verified token colors. Layout containment and controls passed at that size.

## Rounded website accents

The documentation shell owns separate `--docs-radius-control` (0.75rem), `--docs-radius-panel` (1.25rem), and `--docs-radius-dialog` (1.5rem) values. They round website controls, catalog entries, navigation highlights, code/preview frames, the icon gallery and search dialog. Create's surrounding controls and brand summary use these host values; its actual component preview keeps the selected foundation/custom radius. Shared semantic tokens and package versions are unchanged.

Verification: Astro check (194 files) and 35-page production build passed, as did all 18 source tests and production documentation/Create/content/search browser flows, including mobile and enlarged-text containment. Existing keyboard and accessibility checks passed. The styling change remains local until committed and pushed.

The portfolio extraction adds `/examples/portfolio/`, a scoped Portfolio preset and four reusable patterns. See [source inventory and boundaries](DMF-UI-PORTFOLIO.md).

See [layout, layering, density and motion refinement](DMF-UI-WEB-REFINEMENT.md) for measured header clearance, collapsible rail groups, native anchor transitions and responsive verification.
