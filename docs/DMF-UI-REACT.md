# React web alpha

24 October 2026. The separate private `@dmf-ui/react` package at `packages/react`, version `0.1.0-alpha.3`, implements Button, Text, Input, Switch and Card. The Astro archive remains 0.4.0. This is preparation for the 0.5.0 React milestone, not a stable release, native adapter or npm publication.

## Ownership and setup

Commands and fixture paths below refer to the standalone `dmfeisal/dmf-ui` repository, not the portfolio consumer.

Core semantic tokens, preset CSS and Button variants remain shared web inputs. React owns rendering and native input events, without Data Slot initialization or global Astro listeners. Adapter-specific checkbox track CSS is scoped to the React label. Hosts own theme selection, `.dmf-ui` scope, routing, transport and root lifetime.

Run root `npm ci`, then `npm ci --prefix packages/react`. Run `npm test --prefix packages/react` for source types, server rendering and JSDOM hydration/form/reset/unmount checks. Run `npm run build --prefix packages/react` to produce ESM, TypeScript declarations and bundled third-party notices. `npm pack` in that package runs this build automatically. The package exports compiled ESM rather than requiring the consumer to transform dependency TSX. Its source remains included only for Tailwind discovery. React 19 and an ESM host are required.

The documentation proof remains `/examples/react/`. React is not installed by Astro-only consumers of the core archive. A React consumer currently installs the full core package for shared CSS and tokens; that package's Astro/Data Slot dependencies and Astro peer are still in its installed dependency graph. They do not initialize in the React app. A smaller framework-neutral web foundation is future packaging work.

## Separate packed consumer

Run `npm run test:dmf-ui:react-consumer`. The runner builds the adapter, packs both current checkouts into temporary archives, copies the fixture into a separate temporary directory and performs a clean locked install. Both installed packages must be real directories inside that consumer, with matching package versions, rather than sibling checkout links. No source alias or Astro integration is configured. The app builds with Vite, React and Tailwind v4.

`tests/fixtures/react-consumer` contains complete fixture templates, a locked dependency graph and acceptance tests. The `.template` suffix keeps fixture TSX outside the source documentation type check; the runner removes it only when materializing the temporary app. Each run substitutes only the two generated archive integrity values in the temporary lock. Changed package versions or dependency contracts require an explicit `--update-lock` run. No fixture archive, node_modules or generated build is committed.

The default run cleans up its temporary app. Add `--keep` to retain a result for inspection; the runner prints its directory. Run `npm run dev` there for a local preview. `--update-lock` refreshes fixture metadata from the new archives when intentionally changing dependency contracts; it is maintenance, not a normal test retry. CI runs the normal locked path on Node 22/24.

The production build also renders the app into its HTML using the installed adapter's native ESM entry. The client hydrates that content; the development server falls back to client rendering when its host is empty. Server and client import one shared identifier prefix, and component instances use React `useId` for label/title associations. The local demo's fieldset and preset controls remain disabled until hydration, avoiding native submission before its local handlers exist. Tests check the generated production HTML and hydrate both preset configurations without recoverable errors or replacing input nodes.

## Component contracts

Input forwards native React input props and refs. Switch uses a labeled native checkbox with `role="switch"`. Use `checked` and `onChange` for controlled state, or `defaultChecked` for uncontrolled state; do not change modes. Native required/disabled/name/value/form/reset behavior applies. Controlled values must be reset by the host; the consumer demonstrates that responsibility.

Switch read-only behavior, unchecked-value submission, compact sizes and Astro controller attributes are not exposed. Card currently provides a non-interactive root, without the complete Astro slot family. The package creates no React roots; hosts own rendering, hydration and unmount.

## Verification and limits

The separate app checks TypeScript consumption, including invalid variant/ref contracts; native ESM imports; all five refs and cleanup; controlled typing; simulated Tab/Space and disabled skipping; validation; local submission; native and controlled reset; independent roots; and preset/theme host attributes. Production asset checks verify generated utilities/focus rules, DMF/CB selectors, primary #26ade4, and a locally bundled Nunito file whose hash matches the installed core asset. Bundled notices preserve Fulldev, shadcn/ui, Tailwind, CVA and clsx credit.

The subsequent owner-authorized Chromium review covers native keyboard/form/ref/reset behavior, touch toggling/reset, both presets in light/dark surroundings, bundled Nunito loading, 390px LTR/RTL layout and 200% text. Twelve axe states have no violations or incomplete rules. Measured enabled input/Switch boundary and thumb contrast is at least 4.74:1. Alpha.3 fixes the earlier light DMF boundaries, which measured only 1.26:1, using existing semantic colors. It also adds explicit native-input focus and removes a redundant label from the fixture's generic Card container.

Run `npm run test:dmf-ui:react-consumer -- --keep`, then `npm run test:dmf-ui:react-browser -- <printed-consumer-directory>`. The latter serves its production output read-only and runs the local Ego browser scenario; it does not run on ordinary GitHub runners. Reports and screenshots stay under ignored `.dmf-ui-test-results/react/`. Explicit `DMF_UI_TEST_SPACE_ID` reuses an accessible agent-owned space and leaves lifecycle to the caller; the default run finishes its space on success. Failure retains its space for diagnosis, without permission to replace a missing/inactive one.

Safari, Firefox, spoken screen-reader, forced-colors and broader application integration remain unverified. This review is not full WCAG certification or native-platform support. See [verification record](DMF-UI-REACT-VERIFICATION.md).

React Native and SwiftUI need separate implementations using shared token data and contracts. They cannot reuse this CSS or browser implementation.

## Remaining 0.5.0 acceptance

- [x] Install packed packages into a separate, locked React web app without sibling links.
- [x] Build compiled ESM/types and preserve shared CSS, font assets and notices.
- [x] Verify native refs, controlled forms, simulated keyboard input and independent roots.
- [x] Produce server-rendered HTML and verify both-preset hydration without replacing nodes.
- [x] Complete the scoped Chromium checks for mobile/RTL, themes, visible focus, font loading and contrast. Other engines and spoken screen readers remain separate manual work.
- [x] Commit/push alpha.2 and confirm the hosted Node 22/24 matrix: [source](https://github.com/dmfeisal/dmf-ui/actions/runs/40090789479), [portfolio](https://github.com/dmfeisal/dmf-web/actions/runs/40090790578).
- [x] Review the five-component alpha API: React 19 ESM, native refs/form ownership, opt-in text semantics, non-interactive Card and deliberate Switch exclusions. Existing API limitations above remain accepted alpha boundaries; no stable API guarantee is added.
- [ ] Commit/push the browser-driven alpha.3 fixes and confirm its hosted matrix before closing the 0.5.0 checkpoint. Core remains 0.4.0 and React alpha.3; no root version bump, Git tag or npm publication is implied by browser acceptance.

References: [React native input contracts](https://react.dev/reference/react-dom/components/input), [React refs](https://react.dev/reference/react/useRef), [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [React server/client ID prefixes](https://react.dev/reference/react/useId), [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), [Vite production builds](https://vite.dev/guide/build).
