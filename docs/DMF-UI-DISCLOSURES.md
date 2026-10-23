# Accordion and Tooltip

Version 0.2.0 adds the Fulldev base-vega Accordion and Tooltip to the experimental Astro adapter. Source registry URLs, exact response hashes and retrieval dates are in `DMF-UI-UPSTREAM.json`. New runtime dependencies are pinned to `@data-slot/accordion@1.1.2` and `@data-slot/tooltip@1.1.2`; the existing Data Slot MIT notice applies. No new framework, global stylesheet reset, persistence or service is introduced.

## Imports and examples

Use `dmf-ui/accordion` for Accordion, AccordionItem, AccordionTrigger and AccordionContent; use `dmf-ui/tooltip` for Tooltip, TooltipTrigger and TooltipContent. Both are also in the aggregate export. `dmf-ui/examples/DisclosureExamples` is an optional source-owned specimen, included by SystemExamples in each preset.

Standalone anchors are `#standalone-form-dmf-accordion-title` and `#standalone-form-dmf-tooltip-title`. The portfolio pilot uses `#pilot-form-dmf-accordion-title` and `#pilot-form-dmf-tooltip-title`. Replace `dmf` with `cb-ui` for the light-only CB reconstruction. Its primary remains `--dmf-cb-ui-color-primary: #26ade4`.

## Accordion contract

Retain Fulldev anatomy and sizing. Authors wrap each trigger in a heading appropriate to the host hierarchy, give items unique values and supply matching defaultValue. Single mode is collapsible; multiple mode can retain several open sections. Data Slot owns expansion, ARIA associations, native disabled states, keyboard navigation, focus wrapping, measurement and animation. Default examples use vertical ArrowUp/ArrowDown, Home/End and Enter/Space; disabled items are skipped. The inherited horizontal/orientation and hidden-until-found options are not additional cross-browser certification.

DefaultValue is read by enhancement. To expose default content in server HTML, authors explicitly set that content's hidden=false and trigger aria-expanded=true, with matching authored control/panel IDs, as the specimen does. Keep these aligned with defaultValue. The examples' initial content is readable before JavaScript; closed sections require enhancement. This is not a rewrite of portfolio case disclosures or navigation.

Each explicit `data-dmf-accordion` root initializes once and destroys its controller before Astro swaps. Trigger alignment and icon margin use logical direction. Shared focus, coarse-pointer target and reduced-motion rules apply. Repeat example region names include a screen-reader-only preset suffix so DMF and CB regions remain distinguishable.

## Tooltip contract

Use concise supplemental plain text. Essential instructions and the control's accessible name stay visible; use Popover for interactive content. Use a native button/link trigger; adding a tooltip does not make a generic span keyboard accessible. Disabled triggers do not open a tooltip.

Fulldev's 300ms delay and skip-delay defaults are retained. Data Slot handles hoverable content, focus, Escape, blur, logical placement, collision handling and lazy mounting. Escape preserves focus; links retain native activation. Touch pointer hover is ignored and a tap dismisses/cancels the transient tooltip, rather than turning it into a second tap-to-open menu. Keyboard focus still works at coarse-pointer/mobile widths. These are Chromium observations; Safari touch behavior still needs manual review.

Tooltip portals reuse the existing source-preset/color-mode/direction scope adapter. Copy wraps within viewport limits and each root has idempotent initialization and disposal. Multiple instances remain independent. The visual review includes a 390px RTL CB tooltip in a dark outer theme; CB stays light, uses bundled Nunito and retains its own colors. Source examples explicitly color link triggers with semantic ink instead of inheriting browser visited-link colors.

## Verification

`DMF_UI_TEST_FILTER=disclosures npm run test:dmf-ui` checks authored SSR defaults, single/multiple Accordion behavior, keyboard/ARIA/disabled states, hoverable Tooltip text, focus descriptions, Escape, native links, touch cancellation, mobile RTL containment/preset fonts, reduced motion and repeated init/teardown. The source suite visits its standalone page; the portfolio suite visits both `/examples/dmf-ui/` and `/ui/`.

The source-owned accessibility audit includes open Accordion and Tooltip states in both presets/themes (34 total states with the existing component checks). The existing narrow popup-landmark review also covers Tooltip portals; the axe `region` warning stays in the report, while all other failures still block. The real ClientRouter fixture now exercises Accordion/Tooltip reinitialization and an open Tooltip swap to an empty page. CI builds the fixture; browser interaction remains local.

Safari, Firefox and spoken screen-reader verification remain pending because the current automation controls Chromium only. See `DMF-UI-ACCESSIBILITY.md` for the manual matrix. Passing automated ARIA/contrast checks does not verify spoken output or certify full accessibility.
