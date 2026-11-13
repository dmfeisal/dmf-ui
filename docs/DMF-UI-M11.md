# M11: docs site performance

Completed 13 November 2026. Planned in the [roadmap](DMF-UI-ROADMAP.md) (dmfeisal/dmf-ui#15) and shipped in dmfeisal/dmf-ui#16. It ships in `dmf-ui` 0.7.0 (M12).

## What shipped

**Search index served once**
- The search entries move to `src/data/search-index.ts` and are served as `/search-index.json`.
- Pages no longer inline them. The dialog carries `data-search-index`.
- The script fetches the file once: on the first hover or focus of the search button, or at the latest when search opens.
- While it loads, the dialog shows "Loading search…". If the fetch fails, it shows an error with a "Browse all components" link, and the next open retries.
- Entries, ranking, shortcuts and the no-JS fallback are unchanged.

**One DMF UI stylesheet per page**
- `Layout` no longer imports `styles/dmf-ui.css`. That import came from Fulldev's `@/styles/global.css`, which the importer used to rewrite.
- The importer now drops such imports, and fails on any it can't handle. The adaptation is recorded in `docs/DMF-UI-FULLDEV-CATALOG.json`.
- Hosts import `dmf-ui/styles.css` once, as the README already required for every other component. The standalone layout example now does the same.

**Guard test.** `tests/docs-build.test.mjs` reads the built site and fails if:
- the index is inlined again, or the shared index is invalid
- any page loads two DMF UI builds

The React proof and Discovery are the only exceptions. They pair the docs build with the React stylesheet by design.

## Before and after

Both builds have 131 pages. The baseline is `3ebc0ee`; the result is the M11 build.

| | Before | After |
| --- | --- | --- |
| Inline search index | 28,614 bytes on 127 pages, about 3.6MB of HTML | none; `search-index.json` is 28,550 bytes (6,646 gzip), fetched once |
| Homepage HTML | 71,767 bytes | 43,192 bytes |
| Component page CSS (84 pages) | 464,885 bytes (71,856 gzip) | 252,100 bytes (39,568 gzip) |
| Discovery CSS | 346,477 bytes (54,662 gzip) | unchanged, by design |

## Exit criteria

| Criterion | Result |
| --- | --- |
| No page inlines the index; search loads one JSON file on first open; the search browser scenario passes, including loading and failure | Pass. The search scenario covers the failure state, the retry and a single fetch. |
| No page links two stylesheets that both contain DMF UI's root token block, checked over `dist` | Pass: `tests/docs-build.test.mjs` |
| Component pages load at most about 252KB raw CSS | Pass: 252,100 bytes |
| `upstream:check`, `npm test`, `check`, `build`, the navigation build, the docs browser checks and both consumers pass | Pass. The docs browser suite was broken on `main` before M11; see Verification. |
| This report written; roadmap updated | Pass |

## Verification

**Local, before merge:**
- `npm test`: 66 tests.
- `contracts:check` and `upstream:check`.
- `npm run check`: 0 errors across 627 files.
- `npm run build`, `build:dmf-ui:navigation` and `test:dmf-ui:blocks-consumer`.
- React adapter: 7 tests.
- `test:dmf-ui:react-consumer`: 40 tests, through the guarded runner.

**Docs browser suite** (Ego Browser, not in CI):
- With M11, 16 of 25 scenarios passed, including `search`, `documentation-layout` and `fulldev-catalog`.
- The other 9 failed identically on `main`. I checked this by building `main` in a separate worktree and running each failing scenario on its own. The icons page, for example, loads the same single stylesheet in both builds.
- dmfeisal/dmf-ui#17 then repaired all 9 in a separate session, and all 25 pass in one run.
- Running the suite in CI is M13.

**Hosted:** CI passed on Node 22 and 24 for #16, and on the `main` merge (`db94646`). The Netlify preview built with the `/search-index.json` route.

**Review:** no findings.

## Not covered

- **Discovery and the React proof** still load two Tailwind builds, because the React stylesheet is the consumer path they demonstrate.
- **No change to the search engine** and no docs page-weight budget. dmf-web has its own budget.
- **Packing:** `Layout`, the Fulldev catalog, the component catalog and the README changed. `dmf-ui` 0.7.0 carries them (M12).
