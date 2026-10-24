# React web alpha

24 October 2026. The separate private `@dmf-ui/react` package at `packages/react`, version `0.1.0-alpha.2`, implements Button, Text, Input, Switch and Card. The Astro archive remains 0.4.0. This is preparation for the 0.5.0 React milestone, not a stable release, native adapter or npm publication.

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

These are build, asset and JSDOM checks. They do not establish browser keyboard behavior, computed contrast, actual font decoding, mobile/RTL layout, visible focus or screenshot parity. The owner selected existing verification only; no replacement browser space is created. Those visual and assistive-technology checks remain pending before broader React support or a completed 0.5.0 claim. See [verification record](DMF-UI-REACT-VERIFICATION.md).

React Native and SwiftUI need separate implementations using shared token data and contracts. They cannot reuse this CSS or browser implementation.

## Remaining 0.5.0 acceptance

- [x] Install packed packages into a separate, locked React web app without sibling links.
- [x] Build compiled ESM/types and preserve shared CSS, font assets and notices.
- [x] Verify native refs, controlled forms, simulated keyboard input and independent roots.
- [x] Produce server-rendered HTML and verify both-preset hydration without replacing nodes.
- [ ] Complete actual browser checks for mobile/RTL, themes, visible focus, font rendering and contrast. Deferred by the owner's current verification choice.
- [ ] Commit/push this alpha.2 checkpoint and confirm the hosted Node 22/24 matrix. Local checks do not establish hosted success.
- [ ] Review the accepted React API scope and release/version notes before declaring the broader 0.5.0 milestone complete. No tag or npm publication is implied.

References: [React native input contracts](https://react.dev/reference/react-dom/components/input), [React refs](https://react.dev/reference/react/useRef), [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [React server/client ID prefixes](https://react.dev/reference/react/useId), [Vite production builds](https://vite.dev/guide/build).
