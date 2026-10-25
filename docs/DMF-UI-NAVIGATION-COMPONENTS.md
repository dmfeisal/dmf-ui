# Navigation components

This batch adds three native Astro families: Breadcrumb, Pagination and Navigation Menu. They use shared semantic tokens, Lucide direction indicators, logical layout and visible focus. Core remains 0.4.0; React remains 0.1.0-alpha.3. No React counterparts, package publication or release tags are included.

- `dmf-ui/breadcrumb`: An ordered hierarchy with ancestor links and one final non-link `aria-current=page`. Authors provide item labels and optional ancestor hrefs. Decorative chevrons mirror in RTL; long labels reflow.
- `dmf-ui/pagination`: Integer `page` and `totalPages`, plus an authored `pageHref(page)` function. First/last and a bounded current-page window produce real links. Boundary Previous/Next are disabled spans, not dead anchors. Ellipsis is non-interactive. Invalid ranges throw at render time. The host owns the routes, collection and page validation.
- `dmf-ui/navigation-menu`: A named native list of links with authored current/unavailable states and horizontal/vertical layouts. Unavailable entries are spans. Only one enabled item can be current. This is website navigation, not an ARIA menubar, dropdown, roving-focus widget or responsive hamburger. Use Dropdown Menu for action popups and Tabs for in-page panels.

No controllers or event listeners are required. Native Enter, Tab, modified-click and browser navigation remain available. The components do not truncate labels or fetch data. Distinct labels are required when a page includes several navigation landmarks.

The catalog and individual component pages show usage, props and interactive native examples. `/examples/navigation/1/`, `/examples/navigation/2/` and `/examples/navigation/3/` form a real static guide collection for pagination verification; the example is excluded from the component archive. All three families are available from the root and individual exports.

## Verification — 2026-10-25

Astro check: 202 files, zero errors/warnings/hints. Production build: 41 pages. Source tests: 19/19 pass, including package exports, all built links and static page boundaries. Isolated Chrome passed real 1 → 2 → 3 → 2 page navigation, native menu links and disabled/current semantics. Sixteen axe states passed with zero violations or incomplete items across DMF/CB/Horego, dark surroundings, mobile RTL and 200% text containment. Global documentation search passed after catalog expansion.

Additional browser verification covers JavaScript-disabled pagination. Safari/Firefox, spoken VoiceOver/NVDA, touch on real devices and native-platform adapters remain pending. Automated checks do not establish complete accessibility certification.
