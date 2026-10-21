# DMF UI independent source consumer

The first independent Astro consumer is generated from the owned DMF UI source with:

```sh
node scripts/export-dmf-ui.mjs /absolute/path/to/new/dmf-ui
```

The destination must not exist. The exporter refuses to overwrite directories; it does not initialize Git, install packages, publish or deploy. The initial working checkout is `/Users/daengdoang/Dev/dmf-ui`, outside the portfolio, with an independent package manifest, lockfile, node_modules, Astro configuration and build. Its preview uses port 4402; the portfolio remains on 4399.

## Included boundary

- All `src/components/dmf-ui/` source, including explicit lifecycle controllers and local examples.
- DMF foundation CSS, upstream styles/tokens and optional CB reconstruction preset; CB primary remains `--dmf-cb-ui-color-primary: #26ade4`.
- Bundled Nunito font, full third-party notices and upstream provenance.
- A consumer-owned standalone page, local Home redirect, strict TypeScript configuration, exact direct dependency versions and README.
- Structural isolation test and a combined browser suite covering the standalone component examples.

No portfolio layouts, Canvas, protected content, Netlify handlers, storage code, environment files or unrelated assets are copied. Component source is copied without rewrites except the example's CB evidence link, which becomes an external reference. CSS source discovery drops the two portfolio-only entries; the standalone breadcrumb points locally. `EXPORT-MANIFEST.json` records SHA-256 hashes of the exported snapshot. The consumer generates its own package lock during installation; subsequent changes are deliberate local edits, not an automatic sync mechanism.

## Verification

Inside the generated checkout, use Node >=22.12 and run:

```sh
npm install
npm run check
npm run build
npm test
npm run preview -- --host 127.0.0.1 --port 4402
ego-browser nodejs < tests/browser/consumer.mjs
```

After the first install, use `npm ci` with the consumer lockfile. The browser suite targets only port 4402 and the standalone route; it does not load `/ui/`. It tests base light/dark themes, DMF/CB scope, independent dialogs and notifications, tab activation/RTL, native form validation/FormData/reset, switch endpoint geometry, Select keyboard/typeahead/reset, popover editing, menu checkbox/radio states, mobile bounds/targets and teardown/rebinding. The structure test checks built output and disallows portfolio runtime markers, Canvas files and portfolio-only dependencies. The portfolio-side `tests/dmf-ui-export.test.mjs` additionally verifies export hashes, unchanged component copies, generated script syntax and refusal to overwrite.

## Repository and adapter status

The independent checkout is a private local Git repository with no remote or deployment. It is an experimental Astro source distribution, not a published package or stable cross-framework API. Keep Fulldev's technical foundation and attribution. React and WordPress adapters still require real consumers and their own runtime validation; do not claim support from shared CSS alone.

The portfolio remains the source of the initial snapshot. Choose a deliberate synchronization or dependency strategy before editing both repositories independently. Shared CSS currently also includes specimen layout classes; separating component and documentation styles is a future packaging task. CB modal dialog preset propagation, additional browser engines and real Astro client navigation remain separate acceptance work.
