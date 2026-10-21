# DMF UI

Experimental, source-owned Astro components adapted from Fulldev base-vega, using Tailwind v4 and Data Slot. This independent repository includes DMF and the light-only CB UI 2026 reconstruction preset. It has no portfolio layout, Canvas, storage, publishing or Netlify dependency.

## Run

Use Node 22.12 or newer (see installed Astro engine requirements).

```sh
npm ci
npm run check
npm run build
npm test
npm run preview -- --host 127.0.0.1 --port 4402
```

For a fresh export before its lockfile is generated, run `npm install` once. Open /examples/dmf-ui/. Run `ego-browser nodejs < tests/browser/consumer.mjs` with preview running on port 4402.

## Source contract

Components live in src/components/dmf-ui; import their directory index files. Import src/styles/dmf-ui.css and wrap rendered components in .dmf-ui. The example page demonstrates independent forms, host-owned notifications and themes; component controllers dispose before Astro swaps. Include public/dmf-ui fonts and public/dmf-ui-notices.txt. CB wrappers use data-system="cb-ui" and data-color-mode="light"; its primary is --dmf-cb-ui-color-primary: #26ade4.

Add consumer source paths to Tailwind discovery when moving examples. Preserve scoped utilities and native normalization instead of global Preflight. Shared component styles currently include example layout classes; these can be separated in a later packaging pass.

## Status and attribution

This is an Astro source distribution, not a published npm package or a React/WordPress adapter. Keep local development private until distribution licensing and API governance are decided. Preserve upstream notices for Fulldev, shadcn/ui, Tailwind CSS, Data Slot, Lucide and other bundled dependencies. Radix is not a runtime dependency. Source URLs, exact hashes and modifications are in docs/DMF-UI-UPSTREAM.json; license text is in public/dmf-ui-notices.txt. The CB preset is a present-day reconstruction, not a historical shipped-system claim.

Exported by scripts/export-dmf-ui.mjs in the portfolio repository. The local snapshot is independent; subsequent changes should be deliberately synchronized rather than assuming automatic updates.
