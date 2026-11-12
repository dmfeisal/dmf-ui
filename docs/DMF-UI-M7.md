# M7: 0.5.0 release and new-brand guide

Completed 12 November 2026. Planned in the [roadmap](DMF-UI-ROADMAP.md). Core `dmf-ui@0.5.0` and `@dmf-ui/react@0.1.0-alpha.4`, both private and experimental.

## What shipped

- **Release records** (dmfeisal/dmf-ui#4): `scripts/release-record.mjs` with `release:record`, `release:verify` and `release:check`. Records for 0.1.0–0.4.0 were backfilled by repacking their source commits; each reproduced the archive vendored in dmf-web byte for byte.
- **0.5.0** (dmfeisal/dmf-ui#6): everything merged since the 0.4.0 source commit `fe93ad9` — Nova/Neutral defaults and Code Block compositions, Fulldev family adoption, form, modal, navigation, selection and data-display families, Product Details, Merchant Discovery and Authentication Blocks (sign-up, recovery, reset, OTP), the portfolio, HUI and QDI presets and the React alpha. Recorded in `releases/0.5.0/` from `2133e70` (SHA-256 `587a688946dafedbece58930b59c2c8bf8a80c54a3f9ae3150da05ac48517386`).
- **React `0.1.0-alpha.4`**: its only change widens the core peer range to `^0.5.0`; `^0.4.0` excludes 0.5.0. The packed-consumer fixture lock changes only those version and peer entries.
- **[New-brand guide](DMF-UI-NEW-BRAND.md)**: the ten files and steps for a preset, contrast and exception rules, and the done criteria. Linked from the README and the CB and HUI pages.
- **[QDI preset page](DMF-UI-QDI-PRESET.md)**: the first page written through the guide. No values changed.
- **dmf-web on 0.5.0** (dmfeisal/dmf-web#15): vendors `dmf-ui-0.5.0.tgz`, with the notices and upstream record the build syncs from the package.

## Exit criteria

| Criterion | Result |
| --- | --- |
| `releases/0.5.0/` recorded; `release:verify` matches dmf-web's archive | Pass (`dmf-ui-0.5.0.tgz: matches releases/0.5.0 (source 2133e70ed680)`) |
| dmf-web lock integrity equals `releases/0.5.0/pack.json` | Pass (`sha512-viwgLTb0…aLzrA==` in both) |
| dmf-web build and tests on Node 22 and 24 | Pass: hosted CI on the PR and on `main` (`689947d`) |
| New-brand guide exists; QDI documented through it; CB and HUI link to it | Pass |
| This report written; roadmap updated | Pass |

## Verification

Local, before merge:

- dmf-ui: `npm test` (58), `npm run contracts:check`, `npm run check` (619 files, 0 errors), `npm run build`, `npm run build:dmf-ui:navigation`, `npm test --prefix packages/react` (7), `npm run test:dmf-ui:react-consumer` (40, through the guarded runner), `npm run test:dmf-ui:blocks-consumer`, `npm run release:check`.
- dmf-web: `npm run check` (0 errors), `npm run build` (52 pages), `npm test` (41), `npm run test:dmf-ui:contracts` (8). The lock was written with npm 10 and `npm ci` was also checked with npm 11.

Hosted: CI passed on dmfeisal/dmf-ui#6 and dmfeisal/dmf-web#15 and on both `main` merges (`bb88342`, `689947d`).

Review: two Codex findings were answered without code changes. The 0.5.0 source commit is reachable from `main` because the PR was merged with a merge commit. The 44px coarse-pointer minimums that 0.4.0 applied are intentionally absent under the natural-sizing rule; dmf-web's rule asks for practical touch targets, not a fixed size.

## Not covered

- Safari, Firefox, real devices, password managers and spoken screen readers remain the standing manual backlog; no new browser acceptance is claimed.
- Preset dark modes and `brands.json` gaps are unchanged.
- Package publication, tags and hosted releases were not part of M7.
