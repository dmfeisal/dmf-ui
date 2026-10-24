# React alpha.3 browser verification

24 October 2026. Scope: the five-component packed React web consumer, source/build regressions and a real Chromium review. The owner subsequently authorized the pending browser checks after initially choosing existing verification only. This completes that scoped browser review, not a stable API, native adapter or full accessibility certification.

## Evidence

- The separate locked consumer installs real core/adapter archives without sibling links, builds its production CSS/font assets and server-rendered HTML, and passes four acceptance tests for assets, forms/keyboard simulation, refs/cleanup and both-preset hydration. The original React adapter's three tests also pass.
- A local Ego Chromium space ran native Tab/Space, required consent, form values, disabled skipping, ref focus, reset and mobile touch toggle/reset checks. Captured runtime/hydration errors are failures; none were reported.
- Twelve axe-core 4.14.0 states pass with zero violations and zero incomplete rules: DMF/CB in light/dark surroundings on desktop, plus each preset at 390px in LTR/RTL at normal and 200% root text size. Browser identification: Chromium 154 on macOS. This is not Safari evidence despite its compatibility user-agent string.
- Computed boundary/indicator checks cover enabled native-input borders and Switch outlines/thumbs. The lowest measured ratio is 4.7417:1; the test requires at least 3:1. Disabled controls are excluded. Text contrast is covered by the axe states, without claiming every possible caller-provided variant or background.
- The initial review found 1.2597:1 light DMF input and unchecked Switch boundaries. Alpha.3 uses existing muted-foreground/foreground roles for stronger boundaries and explicit input focus. No core token, CB primary #26ade4 or Astro 0.4.0 runtime source is changed.
- The fixture now gives its body shared theme scope, removing white margins around the DMF dark preview. Its generic Card container no longer carries an unnecessary accessible label; the visible heading and named fieldset remain. The prior manual-review axe item is gone.
- The browser loads DMF CB Nunito, confirms its applied font family and primary value, and retains the separate asset-byte hash check. Coarse-pointer controls/label hit areas are at least 44px. The measured mobile document remains 390px wide, with no inspected content clipping at either text size.
- Desktop theme/preset, mobile LTR/RTL, enlarged RTL and keyboard Input/Switch focus screenshots were captured. Desktop dark, mobile CB RTL, enlarged CB RTL and input-focus captures were visually inspected; remaining captures are retained for review. Reports and screenshots are local ignored artifacts under `.dmf-ui-test-results/react/`.
- Alpha.2 previously passed hosted [source Node 22/24](https://github.com/dmfeisal/dmf-ui/actions/runs/40090789479) and [portfolio validation](https://github.com/dmfeisal/dmf-web/actions/runs/40090790578). Alpha.3 is a new local snapshot; its hosted run remains pending commit/push. The portfolio still consumes core 0.4.0; no archive pin, publication, tag or deployment is changed.

## Limits

Safari, Firefox, spoken VoiceOver/NVDA, forced-colors, native device testing and broader application integrations remain pending. The browser matrix uses the fixture's existing variants/content and the documented DMF/CB scopes. It does not approve arbitrary author styles, every future component state or a stable 0.5.0 release.

## Anti Slop delivery gate

Mode: during, owner-selected. Direction remains the owner's Fulldev foundation, DMF semantics and CB reconstruction. ENERGY 1 / RHYTHM 1 / MOTION 1 apply to this quiet reference fixture.

### Hard Gate

PASS for the reviewed scope: the application builds and runs; all fixture actions are exercised with real browser keyboard/pointer/touch or the separate DOM suite; native validation/reset and disabled states work. Mobile LTR/RTL and 200% text have no measured clipping. Twelve axe states and explicit non-text measurements pass; input/Switch keyboard focus is visible. Presets and dark surroundings render coherently. No invented assets, testimonials, metrics, security claims, marketing sections or live services were introduced. Native platform support and full conformance are not claimed.

### Purpose-Gate

PASS: control-boundary changes have a measured accessibility reason and reuse semantic colors. The body uses the existing theme scope. Form grouping, restrained spacing and the existing accent explain every visual choice. No new decoration, illustration, icon family, pattern, glass, glow, motion system or typeface was added. Nunito remains the existing CB font.

### Liveliness

PASS: headings establish focus; spacing separates preset selection from form content; the primary accent marks submission and checked controls. Repeated component anatomy and existing typography preserve identity. ENERGY 1 / RHYTHM 1 / MOTION 1 match the fixture's reference purpose.

### Craftsmanship and quality locks

PASS: the browser review found and corrected concrete contrast/theme/semantics issues, rather than assuming build success established visual quality. Screenshots, font loading, native interactions, scope-specific contrast checks and source-owned regression commands support the result. Existing component-specific radii, palettes and brand direction are preserved. Remaining manual checks and hosted status are explicit; no production-readiness or native support claim is fabricated.

Reference: [W3C Understanding Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast).
