# Nova / Neutral default and shared code documentation

26 October 2026. Core remains 0.4.0; React remains 0.1.0-alpha.3. No package publication, tag, commit or deployment is included.

## Primary references

shadcn/ui is a primary reference for sizing, spacing, semantic colors, component specifications and documentation design. Fulldev UI remains a primary reference for the Astro source/adaptation foundation. Existing upstream notices and source records remain intact.

The shadcn snapshot is pinned to `481d523374745e77d0cf9c53a4115ab5dd7c8481`. `contracts/design-profile.json` records Nova style, Neutral base, Neutral theme and source hashes. Reference files and the MIT license are stored under `vendor/shadcn`; foreign TSX examples use a text extension so they are data, not compiled code. These snapshots are excluded from the packed component archive.

References: [theming](https://ui.shadcn.com/docs/theming), [Button](https://ui.shadcn.com/docs/components/base/button), [Code Block](https://ui.shadcn.com/docs/components/base/code-block). Nova dimensions come from the pinned style specification and transformed Button reference. Current Neutral semantic colors come from the pinned current theming scaffold, rather than the legacy HSL registry file.

This is a source-owned Astro adaptation with the existing native/Data Slot behavior. No Radix/Base UI React runtime, shadcn CLI installation or full catalog parity is claimed.

## Defaults and sizing

- Default semantic primary, surfaces, borders, muted roles and dark mode follow Neutral. Existing public semantic token names remain.
- Button/Input default height is 2rem; Button md remains an alias for default. XS, SM, LG and icon variants follow the compact Nova scale. Root browser text size and zoom remain meaningful.
- Default Card spacing is 1rem, small Card spacing .75rem, compact Alert/Dialog/Tabs/Select rules follow the Nova reference. Structural/product-specific APIs remain source-owned.
- Documentation uses a 16px reference root, compact type and spacing, restrained rounding and shared code surfaces. Header search, GitHub and theme controls use the same explicit 32px height and alignment.
- The natural-sizing policy remains: no blanket 44px mobile target minimum is reintroduced.
- `dmf-ui/design-profile` exports the machine-readable configuration. Create uses these defaults and includes profile metadata in its JSON export. Optional accents remain explicit user overrides.

## Preset text policy

CB and HUI primary labels are white, including components that consume the primary foreground role. Their palette/fill values stay unchanged. This is an explicit owner choice, separate from official palette verification.

At the base fill, white/CB primary has a measured ratio of approximately 2.57:1 and white/HUI primary approximately 4.29:1. These do not meet 4.5:1 for normal-size text; hover opacity can lower contrast further. Expected primary-label contrast findings remain in the browser report, not hidden under an accessibility all-clear. Other unknown violations still fail the scenario. Non-text Switch cues retain contrasting thumb/track treatments.

## Code components

The catalog now has 79 documented Astro families. The existing Code Block family gains `CodeSnippet`; new families are `CodeTabs` and `CommandBlock`.

- CodeSnippet composes the existing parts with a filename/language header, server-side syntax highlighting, line numbers/start line, highlighted lines, wrapping, optional bounded scrolling and copy/fallback.
- Syntax uses Astro's built-in Code renderer and high-contrast light/dark themes. No browser syntax-highlighter bundle or new dependency is added.
- Copy uses the exact authored source, without generated line numbers or markup. Its accessible name stays stable; a status announces success/failure. Permission failure focuses/selects the code for manual copying. Stale asynchronous copy results are ignored; timers clean up on Astro swaps.
- Code Tabs uses the existing audited Tabs behavior, unique authored values and an initial server-rendered panel. Command Block accepts supplied npm/pnpm/yarn/bun strings and never runs them.
- Component usage, guide examples and expanded component-property declarations use the shared code presentation. Dynamic host-generated configuration samples can remain plain text inside their existing export flow.

The initial code panel remains readable without JavaScript and copy controls stay hidden until initialized. Alternate tab activation requires enhancement. No real clipboard-permission or spoken screen-reader claim is made.

## Compatibility

Existing family exports and Code Block parts remain available. The extra language/highlight props and CodeSnippet composition are additive. The default appearance intentionally changes from the previous palette/density to Nova/Neutral. The immutable 0.2.0 token fixtures remain historical references; current browser token verification compares against the resolved portable contract, so an intentional new theme is not misreported as baseline parity.

## Verification

Final results are recorded after the implementation run. Remaining full-catalog brand combinations, Safari/Firefox, real device/virtual keyboard and spoken screen-reader acceptance stay outside the local Chromium evidence.

### Verified results — 26 October 2026

Astro check passes with zero errors, warnings or hints. Production build passes for 112 pages. All 41 source/package tests, seven React adapter tests and eight locked packed-consumer tests pass. No dependency or lockfile update is required.

The new Chromium scenario verifies profile metadata, 32px header tools at desktop/tablet/mobile widths, exact copy text and stable accessible names, manual copy selection, syntax/line/highlight rendering, scoped and document dark modes, wrapping, enlarged 390px RTL containment, Code Tabs keyboard selection and Command Block package-manager copying. Nine audit states are retained: seven have no violations; the two owner-selected CB/HUI states retain their expected primary-label color-contrast violations. One enlarged RTL code-scroll contrast incomplete remains for manual review. No unknown violation is waived.

Current resolved/browser token agreement passes all six DMF/CB surrounding-mode cases, with equivalent browser color serializations normalized for comparison. Existing imported-component interaction flows pass; all 84 imported-catalog light/dark/enlarged RTL states have zero violations and retain one Marquee clipped-edge contrast incomplete. Global search and responsive documentation layout pass, including seven viewport cases, anchor clearance, focus/layers, active contents and reduced-motion scrolling.

Code without JavaScript remains readable, source markup stays escaped, the initial panel is present and uninitialized copy actions remain hidden. Desktop and enlarged RTL mobile code captures were visually inspected. The test settling helper now ignores unrendered transitions inside closed native API details; visible page animations stay enabled. All recorded browser runs finish without runtime errors or failed document/script/style requests.

The current archive scan reports zero confidential identifying-name matches, and the four local live code/profile routes return successfully. Reports remain ignored local artifacts, including `nova-docs-audit.json`, `fulldev-catalog-audit.json` and the search/layout reports. Real clipboard permission dialogs, Safari/Firefox and spoken screen-reader checks were not performed. Changes remain uncommitted and undeployed.

### Tabs and dropdown refinement

Filled Tabs use the resolved scoped radius: 10px outer corners and 7px inner corners at the default profile, a 3px inset, 2px item gap and 32px horizontal track. Line Tabs retain their underline presentation. This fixes the unresolved runtime radius alias and keeps the compact Nova scale.

Documentation native dropdowns reserve space for a shared chevron with a .625rem outer inset and 2.25rem end padding. The icon mirrors in RTL; forced colors restore native arrows. The shared rule covers component previews, property controls, guides and Create, excluding multiple/list selects, generated proxies and Native Select's separate icon. Shared Select triggers also receive a .625rem chevron inset and resolved rounding; Combobox field rounding uses the scoped radius directly.

Verification: the 112-page build passes. Browser checks cover 176 visible native dropdowns across component/guide pages plus all seven Create controls. Enlarged 390px RTL controls remain contained and mirror the icon. Desktop captures were inspected. Existing Tabs and Select suites pass keyboard, focus, orientation, presets, mobile RTL and lifecycle behavior. Forced-color native arrows, `contracts:check` and `git diff --check` pass. Scoped delivery gate passes for rounding, spacing, keyboard behavior and containment. Existing owner contrast exceptions, versions and Git HEAD remain unchanged; this refinement is uncommitted and undeployed.
