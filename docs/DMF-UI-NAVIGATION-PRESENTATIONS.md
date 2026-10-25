# Navigation patterns and presentations

This batch adds Sidebar and Responsive Navigation to Astro and updates the existing navigation/product patterns with useful label/icon presentations. Core stays 0.4.0 and React stays 0.1.0-alpha.3. No publication, release tag, React parity or browser certification is implied.

## New navigation patterns

`dmf-ui/sidebar` accepts label, native link items, presentation and defaultOpen. It renders an aside with native details/summary and a vertical Navigation Menu. Summary toggles via Enter/Space. Escape closes only that disclosure and returns focus to its summary. Instances keep independent native open states. Layout width, sticky placement and persistence remain host-owned; this is not a modal drawer.

`dmf-ui/responsive-navigation` shows wrapping links above the 48rem media breakpoint and native details navigation below it. The hidden presentation leaves the keyboard and accessibility tree. The compact menu is a nonmodal disclosure, with Escape-to-summary enhancement. Native links remain links; no menubar role, arrow-key roving, body scroll lock or fabricated routes are added. Native disclosure and navigation still work when JavaScript is absent; tooltips and Escape enhancement need the runtime.

The shared disclosure helper binds each details once and aborts listeners before Astro swaps. Common icon links compose the existing Tooltip and retain normal keyboard navigation; their tooltip roots stay local to the originating preset.

## Presentation contract

Use `presentation="label"`, `"icon-label"` or `"icon"` where supported. Labels always remain meaningful accessible text. Item icons are named Lucide Astro component imports passed through server props, not strings resolved from a shipped full-library registry. `NavigationItem`, `NavigationIcon` and `Presentation` types are exported from the root.

| Component | Label only | Icon + label | Icon only |
| --- | --- | --- | --- |
| Navigation Menu, Sidebar, Responsive Navigation | Native text links | Authored icon and text | Named link with shared hover/focus Tooltip; each item requires an icon |
| Breadcrumb | Ancestor names/current text | Item icon and name | Named ancestor links with tooltips; current item stays non-interactive with its accessible name and native title |
| Pagination | Previous/Next text | Direction icon and text | Named direction links with shared Tooltip; numeric destinations always stay visible |
| Section Navigation | Numbered section labels | Authored item icon and label | Named native hash links with shared Tooltip |
| Project Action Bar | Text actions | Authored or default direction icon and text | Named native action links with shared Tooltip |
| Chip | Checkbox label | Authored icon and label | Requires icon plus explicit label; real input remains the named Tooltip trigger and native checkbox |
| Tag List | Informational text pills | Authored icon and text | Focusable informational icon with shared Tooltip; does not become a button or navigation link |
| Avatar | Name text | Avatar/initials and name | Existing named image/initials; decorative follows the existing opt-in boundary |
| Rating | Numeric score or numbered radio choices | Stars plus numbers | Read-only named stars or named radio choices; editable choices use shared Tooltip and retain native form behavior |
| Button | Existing text slot | Existing icon and text slots | Existing icon size plus accessible name and Tooltip composition; no new Button presentation prop is invented |
| Archive Index | Existing number | Not applicable | Not applicable; replacing the index with an arbitrary glyph would lose its meaning |

Defaults preserve existing intent: Navigation Menu/Breadcrumb/Section Navigation/Sidebar/Responsive Navigation/Chip/Tag List use label, Pagination/Project Action Bar/Rating use icon-label, and Avatar uses icon. Static labels/images do not receive action semantics. Disabled navigation remains a non-focusable named span. Selection checkmarks and disclosure indicators communicate state independently of the chosen content presentation.

Icon-only links require an icon and label; invalid icon-only compositions throw during server rendering rather than leaving an unnamed action. Read-only Rating keeps its named value and maximum even when its visible number is suppressed. Its visible numeric score stays isolated left-to-right in RTL. Editable Rating keeps distinct names and native arrow/reset/required behavior.

## Documentation and boundaries

The affected component pages show all three presentations, including mobile and vertical patterns. Examples link to real local pages or existing section targets and keep their instances independent. The previous portfolio, product-detail and pagination examples remain available. Avatar images/initials and demonstration scores stay illustrative; no backend or user state is added.

The two new components do not implement a flyout Navigation Menu, off-canvas drawer, nested application tree or routing framework. Those require their own semantics and verification. Consumer migration, real Astro ClientRouter fixture expansion and Safari/Firefox/spoken screen-reader checks remain separate acceptance work.

Section tracking was hardened during regression: observer margins use viewport-height pixels, geometry is refreshed on observer callbacks, hash destinations are respected while their headings are visible, and resize work is coalesced/disposed per instance. This avoids stale active links after native hash jumps.

The portfolio component audits target their named preview regions; the Create/example-page audits remain full-page. Full-page review of a long, scrolling documentation sidebar can produce a manual contrast finding for a partially clipped bottom row. That is not counted as a verified zero-incomplete full-page result for those component pages.

The subsequent website refinement contains the documentation rail below the measured header, makes category groups native disclosures, reserves tooltip room in previews and checks active rail/current-section state. See DMF-UI-WEB-REFINEMENT.md for final host-layer and motion behavior.

Final validation: both new families and all three presentations are documented on their component pages. The keyboard/mobile/RTL presentation scenario passed across twelve pages, including open icon-link/Chip/Rating tooltips, Sidebar independence, Escape/focus return and real mobile navigation. Existing product/portfolio/pagination/search regressions passed. Source tests passed 22/22; the production site built 51 pages. Core and React versions are unchanged.
