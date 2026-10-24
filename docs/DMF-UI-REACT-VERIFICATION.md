# React alpha.2 consumer verification

24 October 2026. Scope: separate packed React web consumer, compiled adapter exports, shared asset inclusion and simulated input/ref contracts. The owner selected existing verification only; no replacement browser test space was created. This is an automated acceptance checkpoint, not completed visual acceptance or a 0.5.0 release.

## Evidence

- Prior source checks: 185 files with zero errors/warnings/hints; 34-page documentation build; 16 core tests and three original React adapter tests pass. The expanded consumer now adds four passing acceptance tests. Hosted CI for this uncommitted change has not run.

- Both packages install as real directories inside a temporary consumer outside the repository. Installed versions are checked against the packed metadata, and neither package may link back to the checkout.
- The first independent app exposed a JSX-runtime failure hidden by the source checkout configuration. Alpha.2 exports compiled ESM and declarations, retains source only for Tailwind scanning, and supports direct native Node ESM imports in acceptance tests.
- The clean consumer runs strict TypeScript checks, including expected rejection of invented variants, wrong native refs, read-only Switch and Button href props.
- Vite produces a production app. CSS tests find adapter rules, generated utility and focus rules, DMF/dark/CB selectors and primary #26ade4. The emitted local Nunito asset matches the installed core font SHA-256. This verifies asset inclusion and identity, not actual font decoding or browser computed styles.
- Four consumer tests pass: production CSS/font/notices and server HTML; controlled typing and simulated Tab/Space, disabled skipping, validation/submission/reset/preset state and independent roots; native refs for all five components and cleanup; packed-package server rendering and both-preset hydration. React warnings and recoverable hydration errors fail the tests. The original adapter hydration suite remains separate.
- The generated production HTML includes the form before scripts run, with its local fieldset disabled until hydration. Server rendering requires no browser globals. Both presets hydrate without replacing the original input or changing its label association, then submit local values and unmount correctly. Shared identifier configuration and `useId` also prevent duplicate labels/headings across independent roots. These checks use JSDOM, not a real browser.
- Generated adapter notices retain the core attribution plus the bundled clsx MIT license. The core archive remains 0.4.0; the portfolio pin is not changed. Temporary test packs are not published or substituted for distributed archives.
- Actual browser layout, mobile/RTL, screenshots, computed contrast, visible focus, font rendering and spoken screen-reader behavior remain unverified. React Native and SwiftUI have no implementation or device evidence from this work.

## Anti Slop validation report

Mode: during, owner-selected. This report applies to the packaging/test change and the local acceptance fixture; it does not approve the experimental UI for production. Direction remains Fulldev-based DMF/CB, with ENERGY 1 / RHYTHM 1 / MOTION 1.

### Hard Gate

PASS for automated scope: archives build and install without checkout links; all fixture controls are exercised through local DOM tests; form validation/reset and disabled behavior are observed; reports distinguish simulation from browser evidence. No invented claims, testimonials, assets, live services or dead marketing controls are added. The fixture has a visible empty result state, native validation errors and local submission feedback. Visual acceptance stays pending under the owner's existing-verification constraint.

### Purpose-Gate

PASS for scope: existing semantic tokens, component anatomy and CB primary are reused. No decorative icon, pattern, glass, glow, illustration, new font or motion system is introduced. The fixture's simple stacked form demonstrates native state ownership; its preset controls compare the two existing systems. The Nunito font is an existing preset asset and its bytes are verified.

### Liveliness

PASS for scope: quiet reference content, a clear form heading, structural spacing and the existing primary accent match ENERGY 1 / RHYTHM 1 / MOTION 1. No marketing composition or additional decorative lever is warranted by a consumer acceptance fixture.

### Craftsmanship and quality locks

PASS for automated scope: the external app found and resolved a real distribution failure; locks, version/dependency guards, native ESM imports, ref cleanup and independent roots provide evidence beyond source-local tests. Existing identity, typography, radii and themes are reused. No broad accessibility, cross-browser, performance or production-readiness claim is made. Full visual delivery remains pending rather than being inferred from simulated tests.
