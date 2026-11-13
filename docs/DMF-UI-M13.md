# M13: docs browser suite in CI

Completed 13 November 2026. Planned in the [roadmap](DMF-UI-ROADMAP.md) and shipped in dmfeisal/dmf-ui#20, with the follow-ups dmfeisal/dmf-ui#21, dmfeisal/dmf-ui#22 and dmfeisal/dmf-ui#23. M13 itself ships nothing: it changes tests, scripts and the workflow. The shipped-file fixes it uncovered (Tabs, EmptyState and Button reflow in #22 and #23) need a `dmf-ui` version bump past the recorded 0.7.0 before the next archive is packed.

## What shipped

**Playwright executor** (`scripts/dmf-ui-browser/playwright.mjs`)
- It supplies the runner's `taskSpace()` and `page` interface on headless Chromium, with `page.cdp()` backed by a Chromium CDP session. Playwright is pinned at 1.64.1.
- `DMF_UI_BROWSER=playwright` selects it. Ego Browser stays the default locally.
- Four adapter gaps were fixed in the adapter. None of them was fixed by weakening a scenario:
  - the CDP session enables the `Page` domain
  - non-character keys are sent as `rawKeyDown`
  - `evaluate` retries across redirects
  - screenshots go through `Page.captureScreenshot`, so device-metrics emulation is kept

**Sharding.** `DMF_UI_TEST_SHARD=i/n` runs every n-th scenario. `tests/browser-runner.test.mjs` checks that the shards are disjoint and cover the whole suite.

**Workflow** (`.github/workflows/dmf-ui-browser.yml`). It follows the CI rule in the roadmap's "Standing constraints":
- **Triggers:** path-filtered pull requests, a nightly run on `main` (03:17 UTC) and manual dispatch.
- **Shards:** 4, on Node 24, with `fail-fast` off.
- **Chromium:** cached.
- **Evidence:** a failing shard uploads `.dmf-ui-test-results/` and its screenshots for 14 days (#21 added `include-hidden-files`). A failing scenario's saved state names the innermost elements that overflow the viewport.

**Real bugs that Linux CI found.** Linux's wider fallback fonts exposed overflow at 390px RTL with enlarged text that macOS hid. These were fixed in layout, never by hiding the overflow:
- the taxonomy page (#21)
- seven docs pages, plus the shipped Tabs and EmptyState (#22)
- the shipped Button, which now wraps long labels (#23)

The Table scroller's clipped cells are reviewed by `tests/browser/table-scroll-contrast.mjs`. It accepts a cell only when it sits inside an overflowing `.dmf-table-scroll` and measures at least 4.5:1. #22 also added a 26th scenario, `large-text-reflow`.

## CI time

From the manual run on `main` at `55f7a19` ([run 43422995132](https://github.com/dmfeisal/dmf-ui/actions/runs/43422995132)). All 26 scenarios passed.

| Shard | Job | Scenarios step |
| --- | --- | --- |
| 1 of 4 | 1 min 43 s | 66 s |
| 2 of 4 | 1 min 34 s | 49 s |
| 3 of 4 | 1 min 59 s | 77 s |
| 4 of 4 | 2 min 14 s | 90 s |
| **Total** | **2 min 18 s wall clock; 7 min 30 s of runner time** | 282 s |

In each job, Chromium installation takes about 18 s from cache and the docs build about 6 s.

## Exit criteria

| Criterion | Result |
| --- | --- |
| All scenarios pass headless under Playwright, locally and in hosted CI | Pass. 26 of 26 locally and on `main` in hosted CI. |
| The workflow runs on a PR that changes `src/`, and skips a docs-only PR | Runs: Pass (#20–#23). Skips: this report's PR changes only `docs/`, so the browser workflow should not run on it. |
| CI time per shard and in total recorded here; roadmap updated | Pass |
| Required check after two weeks without flaky failures | Pending. That step is the owner's. |

## Failures during adoption

- **#20:** shard 4 failed in `taxonomy`. That was a real Linux overflow, fixed in #21.
- **#22 and #23:** shard 4 failed in `data-display` with "partially obscured" table cells. Neither branch contained f7f8445, the commit that added the clipped-cell review. Every run that includes it has passed. These are not counted as flaky failures.

## Next

- If the nightly and PR runs stay free of flaky failures until 27 November 2026, make "Docs browser / shard n of 4" a required check in the branch protection settings.
- Firefox and Safari remain manual. They are M14.
