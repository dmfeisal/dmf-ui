# M9: shared core for React

Completed 12 November 2026. Planned in the [roadmap](DMF-UI-ROADMAP.md). Adds private `@dmf-ui/core@0.1.0` and moves `@dmf-ui/react` to `0.1.0-alpha.5`. `dmf-ui` stays 0.5.0, and dmf-web is unchanged.

## What shipped

All of this landed in dmfeisal/dmf-ui#10.

- **`@dmf-ui/core` 0.1.0** ([packages/core](../packages/core/README.md)):
  - **Contents:** tokens, contracts, the shared and preset stylesheets, preset fonts and example images, third-party notices, and Button variants.
  - **Dependencies:** `class-variance-authority` and `tw-animate-css`, with `tailwindcss` as a peer. There is no Astro dependency.
- **One source.** `packages/core/build.mjs` copies files from their existing repository paths. Only two outputs are derived:
  - `styles.css` is `src/styles/dmf-ui.css`, with its Astro component scan replaced by a scan of the Button variants.
  - `button/variants` is compiled to ESM with declarations.
- **React `0.1.0-alpha.5`:**
  - Its peer moves from `dmf-ui ^0.5.0` to `@dmf-ui/core ^0.1.0`, and its imports move to `@dmf-ui/core/...`.
  - Components and APIs are unchanged.
- **Packed React consumer:**
  - The guarded runner now builds and packs core instead of `dmf-ui`.
  - The fixture's assets and Button variants come from `@dmf-ui/core`.
- **Build order:** CI and Netlify build core before installing the React adapter. The docs site's React setup guide packs and installs both archives.

## Exit criteria

| Criterion | Result |
| --- | --- |
| The guarded React consumer installs packed `@dmf-ui/core` and `@dmf-ui/react` and passes its existing tests | Pass: 40 tests |
| The fixture lock has no `astro`, `@astrojs/*`, `@lucide/astro` or `@data-slot/*` entries; the new count is recorded | Pass: 426 → **194** entries, and `dmf-ui` is gone too. A root test keeps it that way. |
| A core test checks every shipped file is byte-identical to its source and the manifest has no Astro dependency | Pass: `tests/core-package.test.mjs` |
| `npm pack --dry-run` of `dmf-ui` lists the same files as `releases/0.5.0`, so no version bump is needed | Partly met. The file list is the same: 434 paths. Two shipped files have new bytes:<br>• `contracts/catalog.json`, which is generated from the React version and source hash<br>• `README.md`, which gains a core note<br>No archive was packed for a consumer. The next `dmf-ui` archive needs a version bump, which `releases/README.md` records. |
| This report written; roadmap updated | Pass |

## Verification

**Local, before merge:**

- `npm test`: 61 tests, including 3 for core.
- `release:check` and `contracts:check`.
- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: 131 pages.
- `build:dmf-ui:navigation`.
- `test:dmf-ui:blocks-consumer`.
- `npm test --prefix packages/react`: 7 tests.
- `test:dmf-ui:react-consumer`: 40 tests, through the guarded runner. It ran once with `--update-lock` under npm 10, then twice on the locked path with npm 11.

**Lockfile.** It was written with npm 10. The 18 `libc` fields npm 10 drops were restored from the previous lock. Beyond the removed packages, the only differences are:
- the two `@dmf-ui/*` entries
- dev and optional flags on `esbuild`, `jiti` and `yaml`, which Astro no longer pulls in

**CSS.** React components still get their styles without the Astro component scan:
- Their dynamic class names are either literal Tailwind utilities in React source or `dmf-*` classes defined in the shipped stylesheets.
- The built React proof page's CSS still contains the Button variant utilities.

**Hosted:**
- CI passed on Node 22 and 24, on the PR and on the `main` merge (`60b69b3`).
- The Netlify deploy preview built with the new order: core first, then the React adapter, then the site.
- Codex reported no findings.

## Not covered

- **`dmf-ui` does not use core yet.** It still ships its own copies of the shared files. Making it depend on core is later work, and only if it removes real duplication.
- **No release records for core or React.** Neither archive has been given to a consumer, so `releases/` has no records for them. dmf-web stays on the recorded `dmf-ui@0.5.0` archive.
- **Superset notices.** Core ships the full `dmf-ui` notices file, which also covers packages core doesn't include. This keeps every required licence text.
- **Manual backlog unchanged.** Safari, Firefox, real devices and spoken screen readers remain on it.
