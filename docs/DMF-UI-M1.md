# M1 reconciliation and Component Contract v2

26 October 2026. Starting HEAD and origin/main: `609fceda52bbbc1f06c5da6a2374d9b4138a5143`, branch main, clean worktree. Commit 609fced exists locally and was pushed. Its exact GitHub Actions run [40280320233](https://github.com/dmfeisal/dmf-ui/actions/runs/40280320233) passed Source / Node 22 and Source / Node 24. Those checks verify the checkpoint, not the uncommitted work below.

The comparison against f537de9 confirms 18 changed files, 382 additions and 21 removals. It added the reviewed selection input and five native state configurators, mixed Checkbox initialization/reset, current Select portal preset handling, selection aliases, Tabs rounding and documentation dropdown spacing. Button architecture and Figma mapping were not part of that commit. No reset or history changes were needed.

## Reconciliation matrix

| Requirement at checkpoint | Status before this continuation | Action |
| --- | --- | --- |
| Nova/Neutral defaults, versions and size names | Complete and verified in exact-commit CI | Preserve |
| Button six variants and compact size/icon variants | Implemented; current acceptance needed | Retain; connect dimensions to shared aliases and verify |
| Button content placement configurator | Complete in preceding browser evidence | Reuse; preserve actual icon sizes |
| Width independent of size | Partially complete: authored class works, configurator missing | Add natural/full width configuration |
| Shared source-owned code examples | Implemented; configured Button code still plain | Reuse CodeSnippet and CodeTabs, including exact configured copy |
| Button Astro/React API, native behavior and Figma mapping | Partially complete | Add architecture section on existing Button page |
| LoadingButton architecture | Implemented; pending accessible name changed | Reuse; keep action name stable while pending text changes |
| Checkbox/Switch/RadioGroup interactive behavior | Implemented with preceding Chromium evidence | Rerun relevant acceptance; do not reimplement |
| M1.1 defaults, controlled state and adapter boundaries | Partially complete | Enrich existing reviewed input and generated catalog |
| Contract v2 integration | Not implemented | Merge existing review input into existing catalog generator |
| Safari/Firefox, spoken AT and physical devices | Verification pending | Keep separate manual acceptance gates |
| M1.2 Select/NativeSelect/Combobox complete review | Partially complete | Prepare follow-up; do not claim current full acceptance |

## Button decision

Keep XS/SM/default-MD/LG at 24/28/32/36px for a 16px reference root. Icon-xs/icon-sm/icon/icon-lg use the matching square dimensions. The earlier 28/32/40/48/56px proposal changes existing meanings and is not adopted. No demonstrated consumer requires a larger public size; XL remains unsupported. If needed later, design an explicit opt-in comfortable profile with proportional padding, typography and icons. No separate mobile Button and no automatic touch minimum are introduced.

Shared control-height primitives feed component height aliases. Default Button padding and gap now consume their existing component tokens instead of leaving them inert. Existing semantic colors, radius, border, ring, font utilities, icon sizes and disabled opacity remain the styling architecture; brand values stay outside Button logic. Input resolves the same default control-height primitive without changing its value. Small Button radius expressions now use the scoped base radius directly rather than an unavailable runtime alias.

Width stays class/className layout, with no fullWidth prop. Astro can infer an anchor from href or use as; React Button is a native button with refs and does not accept Astro polymorphism. Both share buttonVariants. Native submit/reset requires explicit type and form association. The Button page includes shared-code Astro/React examples, anatomy, the complete compact scale, content and navigation guidance, accessibility, compatibility notes and a Figma-ready property table. No Figma file was created.

Reuse Astro LoadingButton rather than add loading to Button. It preserves both the visible action label and accessible name, disables duplicate activation, exposes aria-busy, reserves both labels' space and restores authored disabled state. loadingLabel now goes to a separate status region; the host owns completion/failure announcements. A stable name with a visibly different pending label produced an axe label-content-name-mismatch finding during verification, so that intermediate approach was corrected. React has no LoadingButton export; host async state can compose the native Button attributes. This deliberately changes pending label presentation without removing any prop.

## Contract v2

The existing contracts/selection.json path remains the reviewed input, now including Button. No additional contract source is introduced. scripts/component-contracts.mjs merges its records into catalog.json as reviewedContract and records a hashed reviewSource. The documentation consumes the generated record, not a second direct read of the input. Contract version is 2.0.0; the outer inventory schema stays 1 and all prior fields remain. This is contract metadata, not a package version bump.

Button, Checkbox, Switch and Radio Group reviews now state anatomy/defaults, actual public properties, size applicability, native forms, state ownership, errors, fallback and Astro/React differences. The item contract is contained in the Radio Group family with its explicit value/disabled/indicator properties. React supports native refs and its own controlled/uncontrolled patterns; Astro uses initial values and existing DOM/Data Slot events. Native Checkbox does not gain readOnly behavior, and React does not gain Astro's Switch/Radio Group readOnly API. React mixed Checkbox state uses the native input ref and host-owned reset.

Generated lexical state evidence and test references remain separate from reviewed applicability and acceptance. Catalog-wide status stays partial: this work does not expand every inherited browser/runtime type or certify all brand/content/state combinations. Existing exported JSON consumers retain old fields and should tolerate the additive reviewedContract/reviewSource fields and the new contract version.

## Accessibility policy and next milestone

CB/HUI white primary labels and unchanged fills remain owner exceptions: approximately 2.57:1 and 4.29:1 at the base fill. They are not WCAG AA normal-text passes. Existing narrow exception handling retains raw results; unknown violations still fail. An outline action or separately approved higher-contrast semantic pairing is an available remediation strategy without silently changing the preset.

Forced-color Astro Switch track/thumb and Radio Group indicators use system colors and visible boundaries. Checkbox keeps native forced-color appearance. Keyboard, errors, focus and native form ownership remain independent from visual sizing.

M1.2 is prepared rather than expanded here because full cross-browser, physical-device and spoken-assistive-technology acceptance for M1.0/M1.1 is still open. The focused next implementation should review NativeSelect (including native multiple/list behavior), the existing custom Select and local searchable Combobox; retain native fallback and actual adapter APIs. Check open/close, optional clearing, required/reset, popup collision, RTL, forced colors and virtual keyboard geometry. React's native Select must not receive unsupported search/custom-popup APIs. Existing Select/Combobox normalization should be reused, not repeated. No Blocks/Templates or unrelated development is started.

## Verification record

Fresh results are recorded after the final run. Historical checkpoint CI is listed above separately. Safari, Firefox, VoiceOver/NVDA and real mobile/device checks have not been performed for this continuation; no cross-browser or accessibility certification is implied. Core remains 0.4.0; React remains 0.1.0-alpha.3. No dependency, package publication, release tag, Figma file, portfolio change, commit, push or deployment is authorized by this handoff.

### Fresh results

| Check | Result for this working tree |
| --- | --- |
| Token generation and contract drift | Pass; regenerated outputs current |
| Astro check | 510 files, zero errors/warnings/hints |
| Production build | Pass, 112 pages |
| Source/package tests | 41 passed |
| React adapter tests | 7 passed |
| Locked packed-consumer tests | 8 passed; no lockfile regeneration |
| M1 Chromium acceptance | Pass: compact/icon dimensions, independent width, exact configured copy, token override, keyboard activation, property reset, enlarged RTL dark containment, stable visible/loading name and status, no pending geometry shift, reduced motion and Checkbox label/Space |
| Selection Chromium acceptance | Pass: five families, required focus/error association, successful values, disabled omission, reset, read-only, mixed state, preset/size controls, property reset and no-JavaScript fallback |
| Existing forms and Switch regression | Pass: native values/validity/reset, keyboard, lifecycle, both sizes, RTL and 14/16/28px roots |
| Documentation regression | Nova code/copy suite, foundation/Button/Input/QDI suite and seven-viewport layout suite pass |
| Packed React Chromium acceptance | Pass: 12 audited states, native/controlled forms, refs, reset, keyboard, DMF/CB fonts/presets, enlarged mobile LTR/RTL and four forced-color cases |
| Forced-color Astro Switch | DMF, CB, HUI and QDI: settled track/thumb contrast at least 3:1, boundary and visible focus pass |
| Computed browser tokens | All six DMF/CB surrounding-mode cases match resolved values |
| Safari | Not performed; verification pending |
| Firefox | Not performed; verification pending |
| Spoken VoiceOver/NVDA | Not performed; verification pending |
| Physical mobile/virtual keyboard | Not performed; viewport/touch emulation only |

The all-preset forced-color check exposed the normal CB/QDI thumb rules taking priority over generic system cues. A forced-color-only rule now wins that cascade and uses system Highlight/HighlightText and focus colors. Normal brand fills and white primary labels remain unchanged.

The property configurators now update after the native reset default action instead of reading stale values in a microtask. Both Button and selection property resets have browser regressions. Required selection errors now preserve helper descriptions while associating the visible focused control with the error text. Long token-name prose wraps in enlarged RTL layouts; code remains in its intentional scrollers. Enlarged RTL Button captures were visually inspected.

### Findings retained

Raw local reports remain ignored under .dmf-ui-test-results/. The five M1 audit states have zero violations; two retain native-dropdown background-image color-contrast incompletes. The 30 selection states retain ten owner-label exception states and native-dropdown incompletes in all 30 states. Foundation acceptance retains two owner exception states and seven incomplete states; Nova code acceptance retains two owner exception states and six incomplete states. Native dropdown background images, a code export scroller and an enlarged navigation text node remain review findings; they are not silently removed.

The React report retains six CB exception states and no incomplete states. Narrow exception classification covers only the existing primary submit actions/default primary Badge in the CB consumer and the specifically named CB/HUI foundation primary-action specimens. Raw violations remain in the reports; all other violations and the existing non-text contrast assertions remain strict. No rule is globally disabled. The intermediate loading label-in-name finding was fixed rather than waived.

Independent opaque native-dropdown text/background samples measure approximately 19.80:1 in light mode and 18.97:1 in dark mode. The separate native-select-contrast-review.json records those samples; they do not replace raw background-image incompletes or certify every option/state. Clipboard tests use deterministic success/denial stubs, not actual permission dialogs. The full imported catalog and unrelated specialized suites were not rerun.

### Delivery status and compatibility

| Requirement | Current status |
| --- | --- |
| Checkpoint reconciliation | Complete and verified |
| M1.0 Button implementation, API review, sizing decision, tokens, docs and Figma-ready mapping | Complete and verified for the automated scope |
| M1.1 Checkbox/Switch/RadioGroup contracts, actual configurators, native behavior and adapter review | Complete and verified for the automated scope |
| Whole-milestone browser/device/AT acceptance | Implemented, verification pending; overall acceptance remains partial |
| Complete expansion of every inherited native/imported runtime type | Partially complete; explicit types and native references remain, not a full resolver |
| XL/automatic comfortable/mobile sizing | Not implemented by design; compact meanings preserved |
| Additional Button loading API/runtime | Not applicable; existing LoadingButton reused |
| M1.2 | Partially complete from the preceding Select/Combobox work; focused follow-up prepared, not expanded here |

The catalog still has 79 Astro families and 35 named React exports. All public Button size/variant names, md equivalence, native form APIs and separate Astro/React boundaries remain. No package/lockfile version changes were made. Contract metadata version 2.0.0 is distinct from a package release.

Scoped delivery gate: functionality/keyboard/forms PASS (M1, selection, foundation and React scenarios); design-purpose PASS (existing Nova/Neutral, compact dimensions and source-owned code compositions); layout/motion PASS (enlarged RTL containment, seven-viewport regression and reduced-motion checks); evidence/compatibility PASS (raw findings retained, source/consumer tests, explicit adapter and migration boundaries). Direction remains calm documentation: energy 1, rhythm 1, motion 1. Owner contrast exceptions and pending manual acceptance prevent any blanket WCAG or catalog-wide certification claim.

Verification used 609fced as the starting checkpoint. The user subsequently authorized committing this continuation after automated verification. No push, publication, tag, Figma file, portfolio change or deployment is included in that authorization.
