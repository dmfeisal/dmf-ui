# Foundations and Component Contract v1

Implementation milestone started 26 October 2026 from clean `ce3894b`. Core stays private 0.4.0; React stays private 0.1.0-alpha.3. No publication, release tag, portfolio edit or deployment is included. The repository contains the implementation; remaining acceptance below prevents a claim that the entire 0.5.0 milestone is complete.

## Audit and architecture

The current catalog contains 77 documented/exported Astro families and 35 named React component exports. Astro subpath exports, family source files, local part property declarations, inherited native type references, authored defaults, CVA variant axes, slots, semantic token references and source hashes are recorded in `contracts/catalog.json`. React exported type declarations and its source hash are inventoried separately. The previous content-only `contracts/components.json` remains compatible and is not replaced.

`scripts/component-contracts.mjs` reads source using the installed TypeScript parser; it does not execute component source or downloaded instructions. `npm run contracts:build` refreshes the record; `contracts:check` detects drift. Every family has an entry, but every entry retains partial acceptance: lexical state evidence does not resolve runtime types, prove applicability, validate all native HTML attributes or replace behavioral testing. Test-file references identify evidence locations, not complete coverage.

The source-owned Astro barrel/subpath archive and separate React web alpha remain the distribution mechanism. No registry installer or new CLI is added. Existing API names and inherited native attributes remain valid. Common behavior continues to use existing native controls, Data Slot runtimes and shared scope helpers; no per-brand component implementations are created.

## Foundations delivered

`tokens/design.tokens.json` retains existing theme primitives/semantic roles and gains the QDI light group plus additive verified HUI reference colors. Existing DMF/CB declarations retain their fixture inventory. `tokens/foundations.json` adds an explicitly scoped application schema with primitive scales, semantic assignments and component aliases. It is not a claim of complete DTCG resolver support.

- Colors: existing semantic roles, complete QDI page-67 UI palette/neutral alpha reference values, readable action pairings and verified HUI palette values. Shared components do not hardcode brand hex values.
- Typography: relative web type specimens, font-weight/line-height tokens, wrapping guidance and independent heading semantics. Existing preset fonts remain intact.
- Spacing and density: primitive rem scale, layout/control/surface assignments; opt-in compact/comfortable surface density. Density is not a universal component prop and does not shrink hit areas.
- Layout: bounded fluid containers, documented breakpoints, responsive grid specimen and logical alignment. Breakpoint variables are reference values, not directly interpolatable CSS media conditions.
- Borders/radius: primitive shapes, border width, existing semantic radius compatibility and exact QDI 12px card mapping.
- Elevation: separate layer tokens, theme shadow role and four exact QDI reference shadows. Native modal top-layer semantics remain independent of z-index.
- Motion: explicit durations/easing, user-triggered specimen and reduced-motion override with feedback preserved.
- Iconography: shared sizes/stroke, naming/decorative guidance and separate QDI sizing/construction reference. Lucide does not replace official logos or custom brand icon assets.
- Accessibility: focus width/offset, target minimum, disabled opacity, read-only/disabled specimen and explicit native-state distinctions.

The core stylesheet includes generated foundation variables; React imports that stylesheet and inherits the same variables. Button/Input dimensions match their previous defaults while exposing component assignments. Default Astro Card spacing uses the surface assignment. Remaining families still mix existing utilities and semantic roles; converting all of them to component-specific assignments is staged work.

## Contract and normalization delivered

All 77 component pages include anatomy/property declarations, local variant axes, part defaults, state vocabulary, extracted tokens, preset boundaries and acceptance gaps. Full native attributes and imported runtime types remain referenced rather than incompletely restated as a guaranteed complete API. Every page offers real preset/theme preview controls; light-only brands disable unsupported modes.

Button accepts additive `size="md"`, identical to the existing `default`. The React adapter inherits the shared variant type; a packed consumer fixture proves the alias and rejects unsupported XL. No existing size or variant is removed. Other families retain their meaningful subsets and legacy names. A future naming migration requires aliases before deprecation.

Button's live configurator exercises six existing variants, supported sizes, authored leading/trailing/both/icon-only content, disabled state and native activation. Input's configurator uses real disabled/readonly/required attributes and native validity, field-associated error text, invalid focus, value reset and FormData omission. Enhanced configuration controls stay hidden until initialized. A combobox near a viewport edge now scrolls its input into the usable center before positioning the popup, avoiding clipped focus after enlarged documentation controls change page geometry. These are the first normalized interactive contracts, not a claim that every family's combinations have been normalized.

State taxonomy covers interaction, selection, disclosure, validation, async and specialized states. It distinguishes pressed/selected, focus/focus-visible, disabled/read-only, checked/selected, open/expanded and loading/disabled. Unsupported or unreviewed states remain not-established rather than being exposed as arbitrary visual props. Async/business behavior remains host-owned.

## Brand sources and mappings

`contracts/brands.json` records document identity, SHA-256, relevant pages, verified values, application mappings and gaps. Both PDFs were read locally and palette pages visually inspected. No PDF, proprietary logo, Quru artwork or other proprietary brand asset is copied into this repository.

HUI v1.3: palette page 20, typography page 23, CTA page 25, icon guidance pages 45–46. Existing primary and accessible action pairings are preserved. The official headline is Rounded Mplus Black; shipped font files cover weights 500/700, so exact headline parity remains unresolved. Kerning -25 is recorded as the source statement, without inventing a CSS conversion. The marketing CTA rule is not represented as a complete application button-state system. Missing application spacing/radius/dark mode use shared DMF policy, never an official-brand label.

QDI v3: corporate palette page 38; UI colors page 67, typography page 68, layout page 69, spacing page 70, radius page 71, elevation page 72 and iconography pages 75–78. Raw palette values remain exact. The source has an eight-point layout rhythm and separate four-point spacing increments; radius includes 2 despite the prose's general multiples-of-four rule. Typography source sizes use sp; web specimens/adaptations do not imply native scaling parity.

QDI is light-only. DMF maps yellow/black to primary, pale yellow/black to secondary and pale rose/dark rose to accent. Dark rose links and strong native-control boundaries are application accessibility choices. System fonts follow the guideline's actual-product policy. The Create page supports QDI preview, safe query restoration and CSS/JSON settings export. Checked Switch thumbs and track boundaries use strong semantic contrast rather than a white-on-yellow cue. No official dark mode or exact custom-icon implementation is claimed.

CB's existing reconstruction and values are preserved; a complete newly verified official specification remains unavailable. Portfolio tokens remain intact and the portfolio repository is not edited.

## Documentation delivered

Twelve new guide pages cover the foundation overview, nine foundation topics, Component Contract v1 and brand mappings. The documentation navigation groups foundations, contracts and presets; search indexes these guides. Live specimens include typography, spacing rulers, responsive grid controls, radius/shadow comparisons, reduced-motion behavior, icon sizes, native accessibility states and copyable verified palette values with manual-copy fallback.

## Verification

Evidence is recorded after the final implementation run below. Automated results apply to the tested content and combinations, not a blanket accessibility certification. Search contrast-overlap incompletes retain their raw findings and independently measured opaque foreground/background ratios rather than being silently discarded. Foundation audit incompletes are recorded separately for manual review.

## Remaining acceptance and continuation

- [x] Inventory every documented Astro family and separate React exports.
- [x] Add shared foundations, source validation, generated CSS and live documentation.
- [x] Record Contract v1 conventions, state taxonomy, all family declarations and known gaps.
- [x] Verify HUI/QDI palette sources; preserve CB and existing APIs.
- [x] Implement QDI light preset and live switching/export.
- [x] Normalize and interactively verify Button/Input as the first contract tranche.
- [ ] Review state applicability and complete imported/native/runtime property expansion per part; the generated inventory does not replace this review.
- [ ] Normalize remaining interactive families: Checkbox/Switch/Radio first, then Select/Combobox, navigation/disclosure, overlays and feedback. Preserve each family's meaningful subset and native/React differences.
- [ ] Replace remaining utility dimensions with component assignments where that provides a useful API; preserve defaults and source hashes.
- [ ] Add valid variant/size/content controls beyond Button/Input and record per-combination acceptance.
- [ ] Complete full per-family QDI/preset keyboard, portal, forced-color and contrast acceptance beyond the tested foundation/Create examples.
- [ ] Resolve HUI headline font-weight fidelity without synthetic claims; audit marketing CTA versus application mappings.
- [ ] Safari/Firefox acceptance for this milestone, real-device/virtual-keyboard behavior and spoken VoiceOver/NVDA checks. Previous React-only Safari evidence does not approve the new catalog.

### Future portfolio note

A future portfolio case study can describe the shipped source-owned Astro catalog, separate React alpha, layered token generation, machine-readable component inventory, existing CB/HUI/portfolio presets and new verified-reference QDI application mapping. Describe Contract v1 normalization and complete brand acceptance as staged until the checklist closes. AI-agent consumption can use the exported JSON; registry/CLI/native integration remains planned. No portfolio changes or deployment are authorized by this implementation task.

### Compatibility

No existing property or export is removed. Existing default size names remain valid; only Button gains the additive md alias. Existing token names remain available, including the immutable DMF/CB fixture inventory. Adding QDI expands the resolved group list, so consumers that enumerate groups should accept the new light group rather than assume a fixed count. Existing APIs should continue to consume their named groups. No adapter receives undocumented universal state/size props.

### Verified results — 26 October 2026

- Astro check: 498 files, zero errors/warnings/hints. Production build: 109 pages.
- Source/package tests: 38 passed. React adapter: seven passed. Locked packed consumer: eight passed, including external TypeScript acceptance of Button md and rejection of XL. No dependency additions or fixture-lock regeneration were required.
- Existing DMF/CB computed token parity: all six preset/surrounding-theme cases match the immutable baseline fixtures.
- New foundation acceptance: 29 Chromium audit states, zero violations. Four enlarged RTL states retain color-contrast incompletes for horizontally scrollable code (foundation overview, contract guide, brand mapping guide and QDI Create export); these remain manual-review findings, not an accessibility all-clear.
- Imported catalog regression: 84 light/dark/enlarged RTL states, zero violations; one Marquee clipped-edge contrast incomplete remains recorded.
- Selection regression: 29 audited states, zero violations. Two partially clipped list-row contrast incompletes are retained; each affected text node passes a separate contrast audit after being scrolled fully into its list viewport. Popup/input geometry, keyboard selection and forced-color behavior pass. The popup calculation now accounts for actual CSS offset, padding, borders and an 8px viewport margin.
- Documentation, Create, global search, Sheet/Alert Dialog and form-composition browser scenarios pass. Search retains a scroll-edge contrast incomplete with an independently measured opaque text/background ratio of 4.7417:1. Unknown incomplete findings still fail the strict review path.
- Native Button/Input configuration, exact medium-alias geometry, palette copy success/denial, QDI light-only restoration/export, Switch thumb/boundary contrast, keyboard toggle and reduced motion pass. Clipboard branches use deterministic test stubs; real permission dialogs remain untested.
- No-JavaScript checks confirm readable native/source content, hidden uninitialized enhancement controls and disabled uninitialized validation submission. Foundation and QDI desktop captures were visually inspected, correcting a squeezed specimen card and white-on-yellow Switch cue.
- The isolated Chrome runs report no runtime errors or failed document/script/style requests. Tests use disposable contexts and no personal browser profile. New Safari/Firefox, real touch/virtual keyboard and spoken screen-reader acceptance were not performed.

Reports remain local ignored artifacts under `.dmf-ui-test-results/`, including `foundations-audit.json`, `selection-audit.json`, `search-audit.json` and `fulldev-catalog-audit.json`. No full-catalog API, state or accessibility certification is implied. Versions and Git HEAD remain unchanged; implementation changes are uncommitted.

## Owner sizing preference — 26 October 2026

The owner requested removal of forced 44px touch minimums. Core, React, documentation and Create controls now use natural content, padding and explicit variant sizes. Coarse-pointer overrides, blanket 44px link/button/label minimums and forced 44px icon-control widths were removed. The shared target-min token is 0px and does not impose a size. Existing explicit component size variants remain. Earlier target-size evidence above describes the previous policy, not the current requirement. Browser assertions now retain containment and non-collapsed geometry rather than enforcing 44px.

Natural-sizing verification: Astro check and 109-page build pass; 38 source tests and eight locked packed-consumer tests pass. Chromium foundation, responsive documentation layout, native form and global search scenarios pass. A targeted fine/coarse-pointer check confirms the XS Button keeps its 21px variant height in both modes; no 44px minimum is imposed. These checks supersede the earlier mandatory-target assertions, while focus, native semantics, containment and content sizing remain covered.

## Confidential public naming

Public labels are HUI, QDI and CB. Runtime identifiers are hui, qdi and the existing cb-ui. Preset stylesheet exports use hui.css and qdi.css; the shared local font directory is fonts/hui. Consumer code and saved preset settings must use these identifiers. Earlier identifying aliases are intentionally not shipped. Reference-document titles are anonymized while verification hashes and page numbers remain available; private PDF filenames and proprietary assets are not distributed. Git history and deployed versions are separate from this working-tree update.

Confidential-naming verification: current authored source, scripts, documentation, public notices headings, font paths, preset identifiers and exports use the approved abbreviations. The production build and packed archive scan report zero identifying-name matches. Local live preset, brand-mapping and Create routes also pass the scan. Astro check, the 109-page build, 38 source tests, eight locked consumer tests and foundation/Create/search/icon browser checks pass with no runtime or document/script/style failures. The naming policy is persisted in AGENTS.md. This is an uncommitted local update; production deployment and existing Git history are unchanged.
