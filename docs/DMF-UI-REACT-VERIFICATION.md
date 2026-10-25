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
- Hosted alpha.3 status was verified on 25 October 2026 through the connected GitHub API. Remote `main` matches local HEAD and recorded `origin/main` in both repositories: source `4bdc35da35b9a63529e04e54b3a5583af1348ace` and portfolio `984777fe9977f43c3f61d6354036ba3e3c8a7214`. [Source run 40144790900](https://github.com/dmfeisal/dmf-ui/actions/runs/40144790900) passes `Source / Node 22` and `Source / Node 24`, including locked installs, adapter tests, packed-consumer acceptance, Astro check, documentation/navigation builds and all source contracts. [Portfolio run 40144807012](https://github.com/dmfeisal/dmf-web/actions/runs/40144807012) passes `Consumer / Node 22` and `Consumer / Node 24`, including source/build, package/browser harness, Canvas contracts and generated-mirror checks. The portfolio still consumes core 0.4.0; its uncommitted Canvas documentation is outside those CI snapshots.

## Follow-up verification — 25 October 2026

Local Node v26.11.1/npm 11.20.0: all three React adapter tests pass; Astro check reports 188 files with zero errors, warnings or hints; the production documentation build passes for 34 pages and the navigation fixture for four pages. Token consistency checks pass. All 16 source tests pass after allowing their temporary localhost servers and using a writable temporary npm cache, resolving the earlier four permission-blocked checks.

The normal locked packed-consumer rerun also passes after allowing dependency downloads: clean installation of 273 packages, compiled adapter build, TypeScript consumption, Vite production build, server prerender and all four acceptance tests. No fixture lock update or dependency/version change was needed. This rerun uses DOM simulation; the Chromium evidence above remains the previous documented review, not a new browser run.

Local Git/CLI network access still fails, but the connected GitHub API independently confirms the remote heads, exact run SHAs and successful job steps. The initial source working tree was clean; the portfolio contained only existing changes to `docs/CANVAS.md` and `docs/CANVAS-ROADMAP.md`. Their bytes are preserved. The cited CI runs precede these documentation-only follow-up edits; they verify the exact snapshots named above.

## Safari and forced-colors follow-up — 25 October 2026

Safari 27.0.1 on macOS 27.0.1 ran against the isolated packed alpha.3 production consumer using Apple's `/usr/bin/safaridriver`. The owner enabled Allow remote automation. Native Option-Tab/Space checks verify visible Switch focus (2px outline), controlled toggling, disabled-control skipping, native required-consent validation, submitted values, ref-driven focus and native/controlled reset. Plain Tab retained the text-input focus with the current Safari preferences; the all-controls Option-Tab shortcut passed. No global keyboard settings were changed.

Twelve Safari axe states report zero violations and zero incomplete rules: both presets with light/dark surroundings on desktop, and both presets at 390px in LTR/RTL with normal and doubled root text (87.5% to 175%). The narrow cases use a same-origin 390px iframe, not mobile device or touch emulation. Document width stays 390px with no inspected horizontal clipping. CB Nunito loads successfully. Pre-module instrumentation captures uncaught errors, rejected promises and console errors, including hydration warnings; none were reported. This does not independently prove preservation of SSR nodes; that remains covered by the packed-consumer DOM tests. Safari non-text contrast was not separately measured. Desktop CB/dark and enlarged CB/RTL screenshots were visually inspected; the latter shows only the upper portion of the scrollable narrow frame.

The Safari matrix passed both before and after the stylesheet correction below. Report, harness and screenshots are retained locally under ignored `.dmf-ui-test-results/react/safari-2026-10-25/`. These local results cover the stylesheet follow-up after source `910b394`; the prior hosted CI links verify their named snapshots, not this later change.

Chromium forced-colors emulation exposed a real Switch defect: automatic color forcing made the thumb and track both white, removing the visible checked-position cue. The initial screenshot was visually inspected. The adapter stylesheet now scopes `forced-color-adjust:none` to the visual track and uses system Canvas/CanvasText, Highlight/HighlightText and GrayText colors, preserving the user's system palette. The optional Chromium scenario adds four forced-colors preset/scheme cases checking thumb distinction, checked-position geometry, visible keyboard focus, Space toggling and reset. The correction now **passes four forced-colors emulation states** in owner-authorized isolated Chrome 155.0.8059.85, covering both presets and light/dark emulated system palettes. The thumb differs from its track, checked position moves from 2px to 16px, keyboard focus has a 2px outline, and Space toggling and reset pass. Light DMF and dark CB screenshots were visually inspected. The full existing browser scenario also passes again: twelve axe states, native keyboard/forms/ref/reset, bundled font, 390px mobile LTR/RTL, doubled text and touch toggle/reset. Ego Lite repeatedly disconnected, including the owner-approved replacement; the owner then authorized isolated Chrome. A temporary Playwright-core adapter used the installed Chrome executable and a fresh disposable context/profile, enabled Page instrumentation before navigation and synchronized screenshot viewport sizing with device metrics. No personal browser profile was used. The adapter is retained under ignored `.dmf-ui-test-results/react/chrome-acceptance-harness.mjs`; results are `report.json`, `forced-colors-report.json` and `forced-*.png` in that folder. This is emulated Chromium coverage; no Windows high-contrast or device result is claimed. See [CSS Color Adjustment](https://www.w3.org/TR/css-color-adjust-1/).

After the correction, three React adapter tests, all four newly packed-consumer tests, Astro check (188 files, zero errors/warnings/hints), the 34-page build and all 16 source tests pass. Versions remain core 0.4.0 and React 0.1.0-alpha.3.

Firefox 157.0 is installed. Official Mozilla geckodriver 0.37.1 was downloaded into a temporary folder; headless sessions fail before navigation with `Could not find profile folder` / process exit 1. The visible attempt also exits before navigation, logging an operation-not-permitted error for its helper process and invalid system-service connections. Default, dedicated temporary and workspace-only profiles were attempted without touching the personal Firefox profile. Firefox acceptance remains blocked. Spoken VoiceOver/NVDA and real-device checks were not performed; DOM/axe evidence is not spoken-screen-reader evidence.

## Limits

Firefox, spoken VoiceOver/NVDA, Windows high-contrast device testing, native device testing and broader application integrations remain pending. Safari coverage is limited to the desktop and narrow-frame checks above. The browser matrix uses the fixture's existing variants/content and the documented DMF/CB scopes. It does not approve arbitrary author styles, every future component state or a stable 0.5.0 release.

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

Firefox was retried during the final follow-up using the existing isolated workspace profile. It again exits before navigation with helper-process permission errors and invalid system-service connections. This is an environment blocker, not a component test failure. Spoken screen-reader and real-device checks remain manual; no suitable live device or spoken-reader testing surface was available.
