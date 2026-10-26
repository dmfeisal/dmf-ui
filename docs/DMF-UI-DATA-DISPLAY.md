# Table, Description List and Slider

Added 25 October 2026 to the Astro adapter. Core remains 0.4.0 and React remains 0.1.0-alpha.3. Packages remain unpublished. No release tags are created.

## Table

`dmf-ui/table` exports Table, TableHeader, TableBody, TableFooter, TableRow, TableHead and TableCell. The root requires a visible caption. Header cells default to scope=col; authors use scope=row for row headers. Native colspan, rowspan, links and controls remain available. Default/compact density and optional striped body rows use preset tokens.

A named, keyboard-focusable scroll region contains wide tables. The caption uses the scroll region's inline container size and stays within view while columns scroll. Native table semantics remain intact on mobile. Sorting, selection, pagination and remote data are host concerns; this is not an editable grid. Numeric cells can use data-align=end. Icons may supplement text or appear in separately named actions; record content remains visible.

## Description List

`dmf-ui/description-list` exports DescriptionList, DescriptionItem, DescriptionTerm and DescriptionDetails. It renders native dl with grouped dt/dd pairs. Horizontal rows stack below 40rem; vertical orientation stays stacked. Both densities preserve wrapping and reading direction. Values accept authored content, including real links. There are no synthetic states, live announcements or focus stops.

## Slider

`dmf-ui/slider` exports Slider, a single native range input with a required unique id and visible label. An optional Lucide icon can accompany the label. Bounds must be finite with max > min; step must be positive or any. The initial value must be in bounds and aligned to the step grid. Decimal steps tolerate floating-point rounding.

The browser owns keyboard arrows, direction, Home/End, bounds, native form values, disabled behavior and reset. The optional displayed caption and unit-aware aria-valuetext synchronize on input/change. Reset synchronization runs after the native reset default action, including when reset has been cancelled. A host assigning input.value should dispatch a bubbling input event to refresh the caption. There is no automatic live region or persistence.

Without JavaScript, the native range and form remain usable. The enhanced numeric caption stays hidden and no fixed aria-valuetext is authored, avoiding stale values. This component covers one thumb; multiple-thumb ranges, custom drag geometry and direct numeric text entry are outside its scope.

## Documentation and verification

All three families have root and subpath exports, catalog/search entries, copyable examples and live previews. Table previews use explicitly illustrative records with real documentation links. Slider previews inspect local FormData; they neither play audio nor save anything.

- Astro check: zero errors, warnings or hints. Production build: 58 pages.
- Source and package suite: 27 tests passed, including invalid slider configurations and decimal step grids.
- Isolated Chrome: native range keys, Home/End, RTL, fractional steps, FormData, disabled exclusion, reset and host input updates; table keyboard scrolling, caption containment and native links; description stacking.
- Preview-region axe audits: DMF, CB, HUI and Portfolio; DMF dark; 390px mobile RTL at 200% of the site's default text size. No violations or incomplete findings in those audit states.
- Forced-colors/reduced-motion emulation preserves native range interaction. JavaScript-disabled checks cover native range/FormData/reset, hidden enhanced captions, table links and semantic description content.

The deliberately forced wide-table keyboard-scroll state produces axe contrast incompletes for partially clipped cell text. That state is verified for keyboard scrolling and caption containment separately; it is not reported as an all-clear contrast audit. Screenshots confirm the caption remains visible while columns scroll. Browser checks use Chrome only; Safari, Firefox and spoken screen-reader checks for this batch remain pending.

Earlier feedback and header work remains in the working tree. The portfolio repository is untouched. No React implementation is added.
