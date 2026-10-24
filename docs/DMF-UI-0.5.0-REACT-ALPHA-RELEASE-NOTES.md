# 0.5.0 React alpha milestone — draft release notes

Prepared 24 October 2026. This is a milestone draft, pending hosted verification. Core remains private `dmf-ui@0.4.0`; the separate private adapter remains `@dmf-ui/react@0.1.0-alpha.3`. The milestone name does not change either package version or promise a stable API.

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

Hosted alpha.3 checks are **not verified**. On 24 October, pushing source commit `3d828d3` and portfolio documentation commit `984777f` failed because the execution environment could not resolve `github.com`. The GitHub CLI could not connect to `api.github.com` either. Both commits remain local, one ahead of their recorded `origin/main`. Earlier alpha.2 hosted passes do not establish alpha.3 success.

After network access is available, push both existing commits and verify runs for their exact full SHAs. Source requires successful `Source / Node 22` and `Source / Node 24` jobs; also verify the portfolio's validation workflow for `984777f`. Only then close the remaining hosted acceptance item in [React web alpha](DMF-UI-REACT.md) and update this draft with run links. These notes are release preparation; hosted acceptance remains open.

## Accepted alpha boundaries and pending checks

- React 19 and an ESM host are required. Hosts select themes/scopes and own routing, transport, roots and controlled reset behavior.
- Switch uses a labeled native checkbox with `role="switch"`; read-only behavior, unchecked-value submission, compact sizes and Astro controller attributes are excluded.
- Card currently exposes a non-interactive root without the full Astro slot family.
- React consumers still install the full core package, including its Astro/Data Slot dependency graph. Those runtimes do not initialize in the React app; a smaller framework-neutral foundation is future work.
- Safari, Firefox, spoken VoiceOver/NVDA, forced-colors, native-device testing and broader application integration remain pending. Fixture evidence is not full WCAG certification.
- React Native and SwiftUI require separate implementations; this adapter is browser-only.

No package publication, release tag, root version bump or portfolio archive-pin change is part of this preparation.

## Follow-up validation — 25 October 2026

- React adapter: all three tests pass, including TypeScript checking, SSR semantics and hydration/form/reset/unmount behavior.
- Astro check: 188 files, zero errors, warnings or hints. Production build passes for all 34 pages; token outputs pass their consistency check.
- Root suite: 12 of 16 tests pass after using a writable temporary npm cache. Four browser-server tests are blocked by `listen EPERM` on `127.0.0.1`; this rerun does not establish their acceptance.
- The isolated packed-consumer rerun cannot complete its locked dependency installation: the temporary cache lacks a required registry archive. Its earlier successful evidence remains historical, not a new pass.
- Pushes of both repositories fail again because `github.com` cannot resolve. Hosted checks remain unverified. GitHub CLI authentication also reports invalid credentials in this environment.
- Safari automation exits without starting a server, and no geckodriver is installed for Firefox. Localhost restrictions prevent the existing browser fixture server from running. Safari/Firefox and spoken screen-reader checks remain pending.
- Unrelated uncommitted portfolio Canvas documentation is preserved. No package versions, tags or publications are changed.
