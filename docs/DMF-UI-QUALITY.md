# DMF UI quality checks

This checkpoint implements the first two Group 2 tasks: GitHub validation and a reliable local browser runner. It does not certify accessibility, Firefox/Safari support or real Astro client-navigation behavior.

## Automated checks

`.github/workflows/dmf-ui.yml` runs on pushes to main, pull requests and manual dispatch. It uses immutable action revisions, read-only repository permissions, a 15-minute job limit and Node 22/24. Each matrix job performs `npm ci`, source checks, the production build and `npm test`. The portfolio workflow additionally rejects uncommitted generated notice/provenance changes. The standalone DMF UI repository has its own matching workflow, running its distribution, isolation and harness tests with `npm test`.

The workflows do not deploy, publish packages, contact application APIs or require secrets. They are configured locally; hosted checks begin only after these files are committed and pushed. The local validation environment may use a different Node/OS version, so local success is not a claim that the hosted matrix has already passed.

## Local browser runner

Install Ego Browser CLI and keep its desktop browser available. Run:

```sh
npm run test:dmf-ui
```

The command builds first. `node scripts/test-dmf-ui.mjs` reuses an unchanged build for a diagnosed rerun. The runner snapshots `dist/` into a temporary private directory, serves it on an available loopback port, blocks/reports writes and closes/deletes the fixture afterward. Other dev servers and concurrent builds cannot replace the snapshot mid-run. No existing preview port, sibling checkout or active Chrome profile is required.

Six importable scenario modules cover pilot/dialog/toast, tabs, forms, switch geometry, Select, and overlays. Portfolio scenarios visit both `/ui/` and `/examples/dmf-ui/`; source-repository scenarios visit only their own standalone page. Do not run individual scenario modules directly through stdin; the runner owns configuration and lifecycle.

Each scenario resets viewport, touch, media and page scale. Navigation waits for fonts and finite short animations, then a layout frame boundary; scenarios still wait for component readiness markers. Shared touch/open/focus helpers observe actual state with bounded failure deadlines. Mobile geometry checks require a real 390px layout viewport instead of allowing an expanded `innerWidth` to mask overflow. No fixed sleeps or blanket retries turn failures into passes.

## Filtering, failure and recovery

```sh
DMF_UI_TEST_FILTER=select,overlays node scripts/test-dmf-ui.mjs
DMF_UI_TEST_SPACE_ID=<printed-number> DMF_UI_TEST_FILTER=overlays node scripts/test-dmf-ui.mjs
```

Filters use exact suite names: pilot, tabs, forms, switch, select, overlays. Empty or unknown selections fail. A filtered pass is not a full-suite pass. Default successful runs finish their agent-managed space; failures retain it, print the suite/space, and save the bootstrap plus failure state/screenshot under ignored `.dmf-ui-test-results/`. Resume only that same accessible agent-owned space. Explicit space-ID mode leaves space lifecycle to the caller. `DMF_UI_TEST_KEEP_SPACE=1` also lets a supervising caller retain a successful space; `DMF_UI_TEST_TASK` selects an intentional task name before a new run, never as a workaround for losing access to a failed space.

The runner contract tests verify read-only serving, decoded/symlink containment, actual build snapshots, nonzero browser exit propagation and cleanup. Missing browser tooling or a browser failure remains a failure. Artifacts stay local and may be overwritten by a later failure of the same suite.

## What remains

- A dedicated accessibility audit, including contrast, screen-reader announcements and manual keyboard review beyond existing regression assertions.
- Firefox and Safari verification. Ego's Chromium checks are not evidence for those engines.
- Real Astro client navigation. Existing dispatch-based teardown/rebind tests only verify lifecycle handlers.
- CI-hosted browser interaction checks. Normal GitHub-hosted runners do not have the Ego desktop app; the current workflow intentionally runs Node/build contracts, not a fictitious browser gate.

No component runtime, package snapshot or source ownership changes are required for this tooling checkpoint.
