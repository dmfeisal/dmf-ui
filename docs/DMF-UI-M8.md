# M8: preset showcase

Completed 12 November 2026. Planned in the [roadmap](DMF-UI-ROADMAP.md). No package change: dmf-web renders the recorded `dmf-ui@0.5.0` archive.

## What shipped

- **Plan** (dmfeisal/dmf-ui#8): the M8 section of the roadmap.
- **Showcase** (dmfeisal/dmf-web#16):
  - `/examples/dmf-ui/presets/` lists CB UI, HUI and QDI.
  - `/examples/dmf-ui/presets/<id>/` shows one preset with these sections:
    - Record: status, modes, source and font policy.
    - Specimen: swatches of the preset's own CSS variables, then Buttons, Badges, Alert, a Card with Field, Input, Checkbox and Switch, and Tabs.
    - Recorded contrast exception, where one exists.
    - Token mapping.
    - Gaps.
  - The pages are standalone, like `/examples/dmf-ui/`: no portfolio styles, scripts or fonts, and `noindex`.
  - Preset facts are read from `dmf-ui/contracts/brands` at build time. dmf-web adds only the link from each preset to its company hub, and nothing is restated or invented.
  - Each company hub and the `/ui/` page link to their preset page.

## Exit criteria

| Criterion | Result |
| --- | --- |
| Four routes build from the 0.5.0 archive | Pass |
| A dmf-web test asserts, for each page:<br>• its `data-system`<br>• its recorded gaps<br>• a contrast exception only where `actionTextPolicy` is recorded<br>• the hub link | Pass: `tests/dmf-ui-presets.test.mjs`, in `test:dmf-ui:contracts`. CB UI and HUI show their exceptions (about 2.57:1 and 4.29:1); QDI shows none. |
| dmf-web `check`, `build` and tests on Node 22 and 24 | Pass, locally and in hosted CI on the PR and on `main` (`4fb8def`) |
| This report written; roadmap updated | Pass |

## Verification

**Local, before merge** (all in dmf-web):

- `npm run check`: 0 errors and 8 hints, the same as `main`.
- `npm run build`.
- `npm run test:dmf-ui:contracts`: 10 tests.
- `npm test`: 43 tests.

**Browser** (built output served locally):

- axe scans of all four pages:
  - The only findings are the recorded CB UI and HUI white-on-primary exception.
  - That exception also covers default Badges, which use the same fill, so the page's exception text names Badges too.
  - QDI has no findings.
- At 375px width, no page scrolls horizontally.

**Hosted:** CI passed on dmfeisal/dmf-ui#8 and dmfeisal/dmf-web#16, and on both `main` merges (`f9e8e0a`, `4fb8def`).

**Review:** one Codex finding on #8 was accepted. The roadmap's done-when line now ties the exception check to recorded data instead of expecting an exception on every page.

## Not covered

- Preset dark modes and the `brands.json` gaps are unchanged; the pages show the gaps rather than fill them.
- Whether the preset pages should be indexed is still open; they are `noindex` for now.
- Safari, Firefox, real devices and spoken screen readers remain the standing manual backlog.
