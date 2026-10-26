# React web alpha

Merchant listing follow-up, 26 October 2026: MerchantListingBlock adds generic item/key/render callbacks and host-owned ready/loading/error presentation. There are 14 component families and three Blocks, totaling 38 named component/Block exports. No merchant service, schema, Card export, dependency or version change is introduced. See [listing composition](DMF-UI-MERCHANT-LISTING.md).

Hero composition follow-up, 26 October 2026: HeroBlock adds a static section/Text composition with host-authored media and actions. The adapter has 14 component families and two Blocks, totaling 37 named component/Block exports. Versions remain unchanged. See [HeroBlock](DMF-UI-HERO-BLOCK.md) for scope, independent packed consumers and verification. This does not add Astro Section/Image APIs to React or broaden older browser evidence.

Current composition follow-up, 26 October 2026: the adapter adds experimental SignInBlock using the existing 14 component families. There are now 36 named component/Block exports, with separate Block metadata in the catalog. Core remains 0.4.0 and React remains 0.1.0-alpha.3. See [sign-in composition](DMF-UI-SIGN-IN-COMPOSITION.md) for API, packed-consumer proof and scoped acceptance. Earlier verification sections below retain their original scope; they do not establish new Block acceptance.

24 October 2026. The separate private `@dmf-ui/react` package at `packages/react`, version `0.1.0-alpha.3`, implements Button, Text, Input, Switch, Card, Badge, Alert (with AlertTitle, AlertDescription and AlertAction), Label, Textarea, Checkbox, Separator, Field, Radio Group and Select. The Astro archive remains 0.4.0. This is preparation for the 0.5.0 React milestone, not a stable release, native adapter or npm publication.

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

Switch read-only behavior, unchecked-value submission, compact sizes and Astro controller attributes are not exposed. Card provides a non-interactive div root plus CardHeader, CardTitle, CardDescription, CardAction, CardContent and CardFooter. CardTitle supports authored div/h1–h6 semantics; other parts are divs. Existing root padding is preserved, so parts add no double padding. The package creates no React roots; hosts own rendering, hydration and unmount.

Badge defaults to a static span; `as="a"` requires `href` and preserves native anchor props/ref/keyboard behavior. Its six variants follow the shared content contract. It does not infer status meaning, announce changing text or render a button. Alert defaults to a static note; authors opt into status/alert roles, supply meaningful title/description content and real actions, and own dynamic updates. AlertTitle, AlertDescription and AlertAction forward div refs; title styling does not choose a heading level. No dismiss timer, root or global listener is created. See the adapter README for usage.

Label preserves authored label/control association and native refs. Textarea uses native controlled/uncontrolled values, validation, form participation and host-owned reset/error descriptions. Checkbox preserves native checkbox artwork, keyboard and form behavior; its indeterminate property is host-owned through the input ref. Native label hit areas remain a host responsibility. Separator is decorative by default; opt into semantic orientation with `decorative={false}`. It is not a focusable splitter. The adapter README documents exclusions and usage.

Field adds native FieldSet/FieldLegend, FieldLabel, FieldDescription, FieldContent, FieldGroup, FieldTitle, FieldSeparator and FieldError composition. Hosts own IDs, descriptions, native disabled state and validation. FieldError deduplicates supplied messages, is absent when empty and defaults to role=alert; authored children and role override that output. No automatic validation, generated associations or root is added. Field orientation can be vertical/horizontal/responsive; responsive layout requires FieldGroup's container. The README records the fixed native elements and usage.

RadioGroup/RadioGroupItem use a native fieldset and radios with shared or uniquely generated names. Hosts author group labels and controlled reset. Select/SelectOption/SelectGroup are native select/option/optgroup with browser-owned pickers, native events, refs, required/disabled/multiple and form/reset behavior. They do not expose the Astro custom-popup API. The README describes mode constraints and form naming.

## Verification and limits

The separate app checks TypeScript consumption, including invalid variant/ref contracts; native ESM imports; all five refs and cleanup; controlled typing; simulated Tab/Space and disabled skipping; validation; local submission; native and controlled reset; independent roots; and preset/theme host attributes. Production asset checks verify generated utilities/focus rules, DMF/CB selectors, primary #26ade4, and a locally bundled Nunito file whose hash matches the installed core asset. Bundled notices preserve Fulldev, shadcn/ui, Tailwind, CVA and clsx credit.

The subsequent owner-authorized Chromium review covers native keyboard/form/ref/reset behavior, touch toggling/reset, both presets in light/dark surroundings, bundled Nunito loading, 390px LTR/RTL layout and 200% text. Twelve axe states have no violations or incomplete rules. Measured enabled input/Switch boundary and thumb contrast is at least 4.74:1. Alpha.3 fixes the earlier light DMF boundaries, which measured only 1.26:1, using existing semantic colors. It also adds explicit native-input focus and removes a redundant label from the fixture's generic Card container.

Run `npm run test:dmf-ui:react-consumer -- --keep`, then `npm run test:dmf-ui:react-browser -- <printed-consumer-directory>`. The latter serves its production output read-only and runs the local Ego browser scenario; it does not run on ordinary GitHub runners. Reports and screenshots stay under ignored `.dmf-ui-test-results/react/`. Explicit `DMF_UI_TEST_SPACE_ID` reuses an accessible agent-owned space and leaves lifecycle to the caller; the default run finishes its space on success. Failure retains its space for diagnosis, without permission to replace a missing/inactive one.

Safari 27.0.1 desktop WebDriver checks now pass for native Option-Tab/Space, forms/reset, preset/theme/font rendering and twelve axe states. A 390px same-origin frame verifies LTR/RTL and 200% text reflow; this is not iPhone or touch evidence. Plain Tab follows the current Safari keyboard-navigation preference and did not reach Switch; Option-Tab did. The forced-colors review found and corrected a disappearing Switch thumb using system colors. Isolated Chrome 155 passes the four preset/light-dark emulation states, including visible thumb/checked position, focus, Space toggle and reset. This is emulation, not Windows high-contrast device evidence. Firefox, spoken screen-reader, native-device and broader application integration remain unverified. This review is not full WCAG certification or native-platform support. See [verification record](DMF-UI-REACT-VERIFICATION.md).

React Native and SwiftUI need separate implementations using shared token data and contracts. They cannot reuse this CSS or browser implementation.

## 0.5.0 React alpha checkpoint acceptance

- [x] Install packed packages into a separate, locked React web app without sibling links.
- [x] Build compiled ESM/types and preserve shared CSS, font assets and notices.
- [x] Verify native refs, controlled forms, simulated keyboard input and independent roots.
- [x] Produce server-rendered HTML and verify both-preset hydration without replacing nodes.
- [x] Complete the scoped Chromium checks for mobile/RTL, themes, visible focus, font loading and contrast. Other engines and spoken screen readers remain separate manual work.
- [x] Commit/push alpha.2 and confirm the hosted Node 22/24 matrix: [source](https://github.com/dmfeisal/dmf-ui/actions/runs/40090789479), [portfolio](https://github.com/dmfeisal/dmf-web/actions/runs/40090790578).
- [x] Review the five-component alpha API: React 19 ESM, native refs/form ownership, opt-in text semantics, non-interactive Card and deliberate Switch exclusions. Existing API limitations above remain accepted alpha boundaries; no stable API guarantee is added.
- [x] Confirm pushed alpha.3 snapshots and hosted Node 22/24 matrices on 25 October 2026: source `4bdc35da35b9a63529e04e54b3a5583af1348ace` ([run](https://github.com/dmfeisal/dmf-ui/actions/runs/40144790900)) and portfolio `984777fe9977f43c3f61d6354036ba3e3c8a7214` ([run](https://github.com/dmfeisal/dmf-web/actions/runs/40144807012)). The source snapshot includes browser-fix commit `3d828d3`; this is verification of the current snapshot, not a claim of a separate run for that ancestor. This closes the scoped React alpha checkpoint. Core remains 0.4.0 and React alpha.3; pending manual checks above remain open. No root version bump, Git tag or npm publication is implied.

References: [React native input contracts](https://react.dev/reference/react-dom/components/input), [React refs](https://react.dev/reference/react/useRef), [React hydration](https://react.dev/reference/react-dom/client/hydrateRoot), [React server/client ID prefixes](https://react.dev/reference/react/useId), [W3C non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), [Vite production builds](https://vite.dev/guide/build).
