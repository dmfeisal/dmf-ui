# 0.5.0 React alpha milestone — release notes

Prepared 24 October 2026; hosted acceptance verified 25 October 2026. This records the completed scoped React alpha checkpoint. Core remains private `dmf-ui@0.4.0`; the separate private adapter remains `@dmf-ui/react@0.1.0-alpha.3`. The milestone name does not change either package version or promise a stable API.

## Added

- Experimental React web Button, Text, Input, Switch and Card components, using shared semantic tokens and DMF/CB presets.
- React 19 native props and refs, controlled/uncontrolled form ownership, and host-owned rendering, hydration and unmounting.
- Compiled ESM, TypeScript declarations and bundled third-party notices. Source is included for Tailwind discovery.
- A separate locked Vite/React/Tailwind consumer that installs packed core and adapter archives without sibling links or source aliases.
- Production server rendering and both-preset hydration checks, including stable label/title associations and preservation of input nodes.

## Alpha.3 fixes

- Strengthened light DMF Input and unchecked Switch boundaries using existing semantic colors. The earlier measured 1.2597:1 boundary contrast is corrected; the lowest measured enabled boundary/indicator ratio in the reviewed fixture is 4.7417:1.
- Added explicit native-input focus styling.
- Applied the fixture's theme scope to its body and removed an unnecessary accessible label from its non-interactive Card container.
- Added a local Chromium production-consumer scenario with keyboard, form, touch, theme, RTL, enlarged-text, font and contrast checks.

Core tokens, the CB primary color `#26ade4` and Astro 0.4.0 runtime source are unchanged by alpha.3.

## Verification

Existing local evidence records three adapter tests and four separate-consumer acceptance tests passing, covering types, native ESM, assets, forms/reset, refs/cleanup, independent roots and hydration. The Chromium 154 review passed twelve axe states with zero violations or incomplete rules, plus native keyboard/touch checks, 390px LTR/RTL layouts and 200% root text. Bundled Nunito loading and asset hashes were verified. See [the verification record](DMF-UI-REACT-VERIFICATION.md) for scope and evidence limits.

Hosted alpha.3 checks are **verified** for the exact current commits:

- Source `4bdc35da35b9a63529e04e54b3a5583af1348ace`: [run 40144790900](https://github.com/dmfeisal/dmf-ui/actions/runs/40144790900), successful `Source / Node 22` and `Source / Node 24` jobs. Both include locked installs, the adapter suite, packed consumer, Astro check, documentation/navigation builds and source contracts. This snapshot contains browser-fix commit `3d828d3`; no separate run for that ancestor is claimed.
- Portfolio `984777fe9977f43c3f61d6354036ba3e3c8a7214`: [run 40144807012](https://github.com/dmfeisal/dmf-web/actions/runs/40144807012), successful `Consumer / Node 22` and `Consumer / Node 24` jobs, including source/build, package/browser harness, Canvas contracts and generated mirrors.

The connected GitHub API confirms both remote `main` heads match local HEAD and recorded `origin/main`. Earlier push/network failures are historical and no longer indicate unpushed commits. The hosted acceptance item in [React web alpha](DMF-UI-REACT.md) is closed; the manual checks below remain pending. This follow-up changes documentation only and is not included in those CI snapshots.

## Accepted alpha boundaries and pending checks

- React 19 and an ESM host are required. Hosts select themes/scopes and own routing, transport, roots and controlled reset behavior.
- Switch uses a labeled native checkbox with `role="switch"`; read-only behavior, unchecked-value submission, compact sizes and Astro controller attributes are excluded.
- Card currently exposes a non-interactive root without the full Astro slot family.
- React consumers still install the full core package, including its Astro/Data Slot dependency graph. Those runtimes do not initialize in the React app; a smaller framework-neutral foundation is future work.
- Safari desktop and narrow-frame checks now pass as detailed below. Firefox, spoken VoiceOver/NVDA, Windows high-contrast device testing, native-device testing and broader application integration remain pending. Fixture evidence is not full WCAG certification.
- React Native and SwiftUI require separate implementations; this adapter is browser-only.

No package publication, release tag, root version bump or portfolio archive-pin change is part of this preparation.

## Follow-up validation — 25 October 2026

- React adapter: all three tests pass, including TypeScript checking, SSR semantics and hydration/form/reset/unmount behavior.
- Astro check: 188 files, zero errors, warnings or hints. Production build passes for all 34 pages; navigation fixture build passes for four pages; token consistency checks pass.
- Root suite: all 16 tests pass with a writable temporary npm cache and permission for temporary localhost servers. This resolves the earlier four localhost permission blockers.
- Isolated packed consumer: the normal locked install, TypeScript check, production build, server prerender and all four acceptance tests pass after dependency downloads are permitted. No lock regeneration was needed. Local reruns use Node v26.11.1/npm 11.20.0; hosted Node 22/24 evidence is linked above.
- Local Git and GitHub CLI still cannot reach GitHub; connected GitHub API reads supplied remote-head and exact-commit CI confirmation instead. No push was needed.
- Previous Chromium evidence remains historical. New Safari desktop/narrow-frame evidence is recorded below; Firefox and spoken-screen-reader checks remain pending.
- Existing uncommitted portfolio Canvas documentation is preserved byte-for-byte. No package versions, archive pins, tags or publications are changed.

## Browser follow-up — 25 October 2026

- Safari 27.0.1 WebDriver: native Option-Tab/Space, controlled form values, disabled skipping, required consent, ref focus and reset pass. Twelve axe states have zero violations/incomplete rules. Both presets and light/dark surroundings pass; CB Nunito loads. At 390px, LTR/RTL and doubled text reflow pass in a same-origin iframe. This is desktop Safari evidence, not an iPhone, touch or separate contrast-measurement pass. Plain Tab retained text-input focus under current Safari preferences; Option-Tab reached controls.
- Forced-colors emulation found an invisible Switch thumb. The system-color correction now passes four preset/light-dark emulation states in owner-authorized isolated Chrome 155.0.8059.85: distinct thumb/track, checked position, visible focus, Space toggling and reset. Light/dark screenshots were reviewed. The full twelve-state Chromium scenario, including mobile touch, also passes again. Ego Lite disconnects required the explicitly authorized isolated-Chrome fallback. Windows high-contrast device support remains unverified.
- Firefox 157.0 with official geckodriver 0.37.1 fails before navigation with a missing-profile error/process exit 1, including isolated temporary/workspace profiles. No personal profile was used. Firefox remains blocked; spoken VoiceOver/NVDA and real-device testing remain pending.
- After the stylesheet correction, Safari's twelve-state review, three adapter tests, four packed-consumer tests, Astro check, production build and all 16 source tests pass. Earlier CI runs cover their named snapshots; this later stylesheet/regression follow-up requires its own hosted run. Core/React versions remain unchanged; no publication or tag is created.

See [the verification record](DMF-UI-REACT-VERIFICATION.md) for local evidence paths and limits.

## Next component iteration — Badge and Alert

Added Badge (static span/native anchor; six variants) and Alert with AlertTitle, AlertDescription and AlertAction. Alert defaults to a static note; authors choose status/urgent roles and supply real actions. Native refs, TypeScript link contracts and authored semantics are preserved. The package remains unpublished alpha.3; the core remains 0.4.0.

Four adapter tests, five packed-consumer tests, Astro check, production build and all 16 source tests pass. The expanded Chrome scenario passes twelve axe/layout states, native Badge link keyboard navigation, static Alert checks and the four existing forced-colors cases. Earlier Safari evidence does not establish coverage of these new components. Firefox, spoken reader and real-device checks remain pending. This iteration has no hosted CI result yet.

## Native form iteration — Label, Textarea, Checkbox and Separator

Added native Label, Textarea, Checkbox and decorative/semantic Separator, bringing React to eleven families. Native form values, validation, refs, reset and authored label/error relationships remain host-owned. Checkbox uses native browser artwork and ref-owned indeterminate state; Separator is not an interactive splitter. Core stays 0.4.0 and the unpublished React adapter stays 0.1.0-alpha.3.

Five adapter tests, six packed-consumer tests, Astro check/build and all 16 source tests pass. The expanded isolated-Chrome suite passes twelve axe/layout states, native new-control keyboard/form/reset checks and four forced-colors states. Textarea boundary contrast is at least 4.7417:1 in the fixture. Safari/Firefox, spoken-reader and real-device acceptance for these new components remains pending. No hosted CI result is recorded for this iteration; no push, publication or tag is implied.

## Composition iteration — Field and Card parts

Added Field, FieldGroup, FieldContent, FieldLabel, FieldTitle, FieldDescription, FieldError, FieldSet, FieldLegend and FieldSeparator, plus CardHeader, CardTitle, CardDescription, CardAction, CardContent and CardFooter. Hosts own IDs, heading choices, validation, error timing and native form state. FieldError defaults to an alert for supplied messages; empty errors render nothing and authored role/content overrides are supported. Card root padding and non-interactive behavior remain intact.

Six adapter tests, seven packed-consumer tests, Astro check/build and all 16 source tests pass. Chrome's expanded twelve-state matrix, responsive Field layouts, authored error associations, keyboard/forms/reset and four forced-colors states pass. Safari/Firefox, spoken readers and real-device coverage remain pending for this expansion. The preceding native-control batch is committed locally as `2fa3e9d` (source) and `51d405a` (portfolio records); this new batch requires its own hosted CI result. No package version change, publication or tag is implied.

## Selection iteration — Radio Group and Select

Added RadioGroup/RadioGroupItem and native Select/SelectOption/SelectGroup. React now has fourteen families. Native radio grouping/keyboard behavior, typed refs, controlled/native reset, required/disabled choices and multiple selection are verified through seven adapter tests and eight packed-consumer tests. Chrome's twelve-state layout/accessibility matrix and four forced-colors cases pass. Astro check/build and all 17 source tests pass. Native OS picker, Safari/Firefox, spoken-reader and device coverage remains pending. No version bump, package publication or release tag is included.
