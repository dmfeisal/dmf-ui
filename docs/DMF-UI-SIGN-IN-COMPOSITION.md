# Sign-in composition and independent consumer proof

26 October 2026. Starting checkpoint: clean main at b100ebe066affd078ccc62e28ff0f1c518a9e4c5. That pushed checkpoint has successful Node 22/24 CI in run 40324445552. This follow-up is local work and has no exact-commit hosted CI result. Versions remain private core 0.4.0 and React 0.1.0-alpha.3. No new dependencies, portfolio change, commit, push, tag, publication or deployment is included.

## Scope and ownership

Existing Astro SignInBlock is retained. A separate React SignInBlock composes its existing Card/Field/Input/Button/Alert families. It is exported through the adapter's compiled ESM/declarations, with no generic SignInFormBlock alias. React has 14 component families plus this Block; the catalog separately records its declaration, source hash and native/host state ownership. SearchFiltersBlock remains Astro-only. No registry, Template, HeroBlock, MerchantListingBlock, sign-up, recovery or PageHeader implementation is added.

Both sign-in implementations require a unique id and real action, use POST, and preserve required username/current-password fields. No initial password is accepted. The existing Astro error heading is now an additive errorTitle prop so hosts can localize all visible error copy. React email uses defaultValue: it supplies the native initial/reset value without overwriting current edits. The form ref, native events and attributes remain available. fields/footer props and children correspond to Astro's named/default slots. Custom controls must be labelled and must not introduce nested forms or duplicate IDs.

Hosts own transport, security/session/CSRF policy, account-existence decisions, validation, focus after application errors, completion and persistence. Capture FormData before setting pending. The Block does not inspect credentials or create async behavior. pending/disabled disable the native fieldset; submitDisabled guards readiness only. The action name stays stable, with a separate pending status and a reduced-motion-aware visual indicator.

## Architecture and responsive conventions

Core token data and contracts are portable specifications; its package remains an Astro source distribution. React uses shared web styling but owns rendering, events and refs. Its installed core dependency still carries Astro/Data Slot dependencies. No package separation is justified solely by this one composition.

Use maintained framework exports and copyable usage examples now. Registry distribution and installer tooling remain deferred until independent consumers demonstrate a need. The source documentation owns the full system site; the portfolio continues consuming its older integrity-pinned archive and is unchanged.

The sign-in maximum stays 28rem. Natural input/button variants and content padding are preserved; footer links wrap. The consumer's older mandatory 44px label minimum is replaced by natural padding. Logical spacing, min-inline-size:0 and wrapping support narrow containers. Test 390px, 820px and 1280px; these are layout probes, not proof of physical devices. RTL changes direction only. Standard RTL and 200% text are separate test states. The consumer heading explicitly wraps long words so enlarged text cannot widen the page.

Nova/Neutral remains the default. DMF light/dark and HUI light form the new consumer matrix. HUI uses its verified reference and existing derived application mapping; no new brand specification is invented. The owner-selected white HUI primary label retains its documented approximately 4.29:1 exception. CB's existing approximately 2.57:1 exception is unchanged; this scoped Block matrix does not certify every other preset.

## Independent consumers

The existing locked React consumer now has a separate /sign-in.html entry, server rendering and hydration using the installed public adapter. It has no sibling source alias. Its local host prevents submission, never reads/logs credentials, guards submit before hydration, and explicitly illustrates pending/error/reset. Disabled secondary composition and authored extra field/footer content demonstrate independence and extension points. Tests also mount the bare installed Block outside that demo host.

The isolated Astro Blocks consumer installs the freshly packed core as a real directory. It reuses the source lock's exact toolchain dependency graph, adding only the generated archive integrity record in a temporary lock. No fixture lock refresh or remote version resolution is used. It imports both Blocks and Input through public package exports and builds with its own Astro/Tailwind configuration, outside documentation source. Its native POST/GET forms, field errors, Indonesian copy, extension slots and password boundary are inspected. No authentication/search endpoint is implemented.

Commands:

```sh
npm test --prefix packages/react
npm run test:dmf-ui:react-consumer -- --keep
npm run test:dmf-ui:blocks-consumer -- --keep
DMF_UI_TEST_REACT_SCENARIO=sign-in npm run test:dmf-ui:react-browser -- <react-consumer> <astro-consumer>
```

The hosted workflow now includes the packed Astro proof alongside the existing React proof. Browser checks remain local desktop work, not a claimed hosted-browser gate.

## Verification

Final local results:

- React source/types/server/hydration: 7 tests passed.
- Locked packed React consumer: 12 tests passed, including four new sign-in checks for native SSR/API boundaries, hydration with field-node preservation, host pending/error/reset/localization, bare form ref/reset/unmount and guarded production HTML. External TypeScript cases reject missing action, wrong form ref, method override and an authored password.
- Separate packed Astro consumer: install and one-page production build passed. Public Block/Input imports, POST/GET markup, Indonesian error copy, custom field/footer slots and password boundaries passed.
- Astro check: 528 files, zero errors/warnings/hints. Source build: 116 pages. All 42 root tests passed. Token/foundation, contract, upstream provenance and whitespace checks passed.
- Scoped Chromium packed-consumer suite passed 21 audit states: pending/error, DMF light/dark and HUI light at 1280/820/390px in standard LTR/RTL, plus a separate HUI RTL 200% text case. Six standard-size HUI states retain only the documented primary-submit contrast exception. There were zero unexpected violations, incomplete rules or captured page/runtime/console errors. The enlarged case uses the applicable large-text threshold; it is not a removal of the normal-text exception.
- Native Enter submission, required-field focus, Tab order, visible normal/forced-color focus, pending/disabled independence, local error/reset, footer link, reduced-motion indicator and both locales passed. With scripts disabled, the React preview stays guarded; the independent Astro form retains its native POST endpoint, required-password focus, reset defaults and disabled instance without a Block runtime. No write request was made to either read-only fixture server.
- Standard RTL, separate enlarged RTL and settled DMF desktop screenshots were visually inspected. Artifacts stay under ignored .dmf-ui-test-results/react/sign-in-*. Input contrast is measured after finite transitions settle; a transitional measurement is not suppressed as an exception. The narrow enlarged heading initially overflowed, and the consumer's wrapping correction was verified before acceptance.

Browser/DOM, server rendering, spoken AT and physical-device evidence remain distinct. The previous Safari acceptance is scoped to its earlier original-five-family React fixture; it does not establish sign-in Block acceptance. No current Firefox, spoken VoiceOver/NVDA or physical-device Block acceptance is claimed.

## Design gate

Reading: existing Nova/Neutral documentation and native authentication composition for application authors. ENERGY 1 / RHYTHM 1 / MOTION 1. The Card groups account fields; shared type/spacing preserve hierarchy; the primary accent identifies submission; the only added motion indicates authored pending state and respects reduced motion. No imagery, decorative background, invented account result or product/security claim is introduced. Scoped gate report:

- Hard Gate PASS within the owner-approved contrast policy: production builds, native interaction tests, 21 audited browser states, containment checks and no-JavaScript fallbacks passed. No live-auth, compliance or performance claim is made.
- Purpose-Gate PASS: existing Card/Field anatomy groups account entry; inherited tokens and typography preserve the system; wrapping has a verified enlarged-text purpose; the pending indicator communicates host state.
- Liveliness PASS: energy/rhythm/motion 1; the title and primary submit establish hierarchy, field gaps separate work, and the existing Card/Field structure repeats the system's visual language.
- Craftsmanship PASS for the scoped matrix: keyboard, state ownership, packed external reuse, localization, default/preset colors and standard/enlarged RTL were tested; screenshots were inspected. Owner contrast exceptions and unperformed browser/reader/device acceptance remain explicit.

## Next

After this proof, implement HeroBlock with authored media/actions and the existing Section/Image/Text/Button primitives. Then validate MerchantListingBlock with host-owned data and a renderItem boundary before extracting a domain card or adding a fetching abstraction. Sign-up/recovery and PageHeader remain separate later work. Patterns document behavior across layers; introduce Templates only after repeated page structures demonstrate the need.
