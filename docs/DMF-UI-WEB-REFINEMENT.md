# Documentation layout and motion refinement

The 2026-10-25 screenshot showed the component rail painting into the sticky header and excessive spacing around reading content. This refinement retains DMF's existing tokens, relative 14px root, rounded website accents and component presets.

UI/UX Pro Max was applied as targeted guidance for focus not obscured, reduced-motion scrolling and Astro static structure. No generated design-system override or new animation dependency was introduced.

## Layout and layers

The header remains an opaque, isolated layer at z-index 40. The component and contents rails are sticky containers at z-index 10 with contained scrolling; their inner navigation is no longer a separate sticky scroller. ResizeObserver measures actual header and footer heights, including responsive wrapping, and publishes one shared clearance variable. The rails reserve footer/layout clearance as well, so their containing block cannot push their first rows behind the header near the end of a short page. CSS fallback offsets support no-JavaScript rendering.

Native collapsible category groups keep the current component's group open. They shorten the initial rail without removing links from server HTML, and retain native keyboard disclosure behavior. Mobile keeps its existing section-browser disclosure. The rail yields below 960px; the contents rail yields below 1281px. Code and table overflow remain local, keyboard-accessible and visibly scrollable.

The reading layout uses consistent 16/24/32/40 spacing tiers, adaptive preview padding, a smaller component-page heading scale and quieter code/table density. Header controls keep 44px targets. Font sizes remain relative and zoom is unrestricted. The existing library/preset tokens are not replaced by website density values.

## Scrolling and motion

One measured header offset controls document scroll padding; section margins add only a small gap instead of duplicating a second header-sized offset. Native anchor navigation, URL hashes and browser history remain intact. The contents rail updates aria-current=location through passive, coalesced scroll work while visible, and respects a visible explicitly selected anchor.

Motion consists of native smooth in-page anchor scrolling, 120ms disclosure fades, 140ms color feedback and a 160ms search-dialog entrance. Reduced motion restores immediate scrolling and suppresses decorative transitions. No scroll hijacking, whole-page entrance reveal, GSAP runtime or Astro ClientRouter is added. The experimental cross-document fade was removed after it caused transient snapshot-layer conflicts.

Tooltip examples have sufficient interior room and a bottom placement. Icon-only vertical navigation/action hints use inline-end placement so they do not paint over the next label in the same rail. Existing tooltip focus, Escape, collision and preset behavior remain owned by the shared component.

## Verification

The dedicated layout scenario checks measured header height, rail containment, header paint ordering, focused-link visibility, anchor clearance, active contents, seven desktop/tablet/phone/landscape viewports, 200% relative text and reduced-motion behavior. Browser settling now also observes document-level finite animations and native scroll completion before inspecting state.

The standard documentation, Create, search, navigation, portfolio and product-details scenarios remain part of verification. Production build and source checks must pass before committing. Browser evidence remains Chromium; Safari/Firefox and spoken screen-reader verification are not inferred from these checks. No package version, publication or release tag is part of this change.

Final local results: Astro check passed with zero errors/warnings/hints; 51 production pages built; all 22 source tests passed. Production browser scenarios passed for documentation/Create/content/search, navigation presentations, Portfolio, product details, native pagination and dedicated layout checks, with no page errors or failed document/script/style requests. Layout and standard documentation flows also passed on localhost. The no-JavaScript Sidebar/mobile navigation proof passed. These results cover the current source, not a package release.
