# DMF UI quality checks

Group 2 now includes GitHub validation, a local browser runner, automated accessibility state checks and a real Astro ClientRouter fixture. Safari/Firefox and spoken screen-reader verification remain pending; see `DMF-UI-ACCESSIBILITY.md` for scope and the manual matrix.

## Automated checks

`.github/workflows/dmf-ui.yml` runs on pushes to main, pull requests and manual dispatch. It uses immutable action revisions, read-only repository permissions, a 15-minute job limit and Node 22/24. Each matrix job performs `npm ci`, source checks, the production build and `npm test`. The portfolio workflow additionally rejects uncommitted generated notice/provenance changes. The standalone DMF UI repository has its own matching workflow, running its distribution, isolation and harness tests with `npm test`.

The workflows do not deploy, publish packages, contact application APIs or require secrets. The initial pushed workflows passed on source `1b86918` and consumer `f4d6a0f`; see the linked runs in `DMF-UI-ACCESSIBILITY.md`. Later local changes require a fresh hosted run after commit/push. The local validation environment may use a different Node/OS version, so local success is not a claim that the hosted matrix has already passed.

## Local browser runner

Install Ego Browser CLI and keep its desktop browser available. Run:

```sh
npm run test:dmf-ui
```

The command builds first. `node scripts/test-dmf-ui.mjs` reuses an unchanged build for a diagnosed rerun. The runner snapshots `dist/` into a temporary private directory, serves it on an available loopback port, blocks/reports writes and closes/deletes the fixture afterward. Other dev servers and concurrent builds cannot replace the snapshot mid-run. No existing preview port, sibling checkout or active Chrome profile is required.

Seven importable scenario modules cover pilot/dialog/toast, tabs, forms, switch geometry, Select, overlays, and Accordion/Tooltip. Portfolio scenarios visit both `/ui/` and `/examples/dmf-ui/`; source-repository scenarios visit only their own standalone page. Do not run individual scenario modules directly through stdin; the runner owns configuration and lifecycle.

Each scenario resets viewport, touch, media and page scale. Navigation waits for fonts and finite short animations, then a layout frame boundary; scenarios still wait for component readiness markers. Shared touch/open/focus helpers observe actual state with bounded failure deadlines. Mobile geometry checks require a real 390px layout viewport instead of allowing an expanded `innerWidth` to mask overflow. No fixed sleeps or blanket retries turn failures into passes.

## Filtering, failure and recovery

```sh
DMF_UI_TEST_FILTER=select,overlays node scripts/test-dmf-ui.mjs
DMF_UI_TEST_SPACE_ID=<printed-number> DMF_UI_TEST_FILTER=overlays node scripts/test-dmf-ui.mjs
```

Filters use exact suite names: pilot, tabs, forms, switch, select, overlays, disclosures. Empty or unknown selections fail. A filtered pass is not a full-suite pass. Default successful runs finish their agent-managed space; failures retain it, print the suite/space, and save the bootstrap plus failure state/screenshot under ignored `.dmf-ui-test-results/`. Resume only that same accessible agent-owned space. Explicit space-ID mode leaves space lifecycle to the caller. `DMF_UI_TEST_KEEP_SPACE=1` also lets a supervising caller retain a successful space; `DMF_UI_TEST_TASK` selects an intentional task name before a new run, never as a workaround for losing access to a failed space.

The runner contract tests verify read-only serving, decoded/symlink containment, actual build snapshots, nonzero browser exit propagation and cleanup. Missing browser tooling or a browser failure remains a failure. Artifacts stay local and may be overwritten by a later failure of the same suite.

## What remains

- Spoken screen-reader verification and remaining manual accessibility review. Automated contrast, naming, state, focus trap and AX status checks now have a dedicated source-owned suite.
- Firefox and Safari verification. Ego's Chromium checks are not evidence for those engines.
- Broader host-specific navigation coverage. The new source-owned fixture verifies real ClientRouter links/history; old dispatch-based regressions remain handler tests.
- CI-hosted browser interaction checks. Normal GitHub-hosted runners do not have the Ego desktop app; the current workflow intentionally runs Node/build contracts, not a fictitious browser gate.

The follow-up accessibility changes ship as `0.1.1`; source ownership is unchanged. Run `npm run test:dmf-ui:accessibility` and `npm run test:dmf-ui:navigation` in the source repository. CI additionally builds the navigation fixture; the desktop interaction suites remain local. See `DMF-UI-ACCESSIBILITY.md` for the exact exceptions and manual checks.

## Component expansion in 0.2.0

The `disclosures` browser family covers Accordion and Tooltip. The source accessibility audit expands to 34 states and the actual ClientRouter fixture covers their owners and open-tooltip teardown. See `DMF-UI-DISCLOSURES.md`. The consumer now pins the 0.2.0 snapshot; Safari/Firefox and spoken screen-reader evidence remain pending.

## Documentation site

The normal source build now contains 28 pages: Home, Create, the component catalog and 17 detail pages, the Docs index and six guides, plus the existing standalone gallery. `npm test` checks catalog/export coverage, local links/fragments and host-file distribution boundaries. `npm run test:dmf-ui:docs` runs the documentation and Create browser suites; these are separate from the seven component regression families and the real-navigation fixture. See `DMF-UI-DOCUMENTATION.md`.

## Portable tokens in 0.3.0

`npm run tokens:check` rejects stale generated CSS/data. Source contracts validate typed values, alias failures and the 0.2.0 token inventory. `npm run test:dmf-ui:tokens` compares computed properties against immutable 0.2.0 fixtures in both presets and explicit/system modes. See `DMF-UI-TOKENS.md`; this is not native adapter verification.
