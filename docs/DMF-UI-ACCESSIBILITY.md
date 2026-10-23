# DMF UI accessibility and browser checkpoint

## Scope

This is an experimental Astro adapter audit, not a WCAG conformance certificate. Fulldev remains the primary foundation. The changes below are explicit DMF accessibility adaptations, with original upstream hashes retained in `DMF-UI-UPSTREAM.json`.

## Source changes in 0.1.1

- Dark DMF primary and sidebar-primary colors retain their orange fill but use dark foreground ink. White text on the orange primary measured about 3.06:1; the new pair meets normal-text contrast in the tested states, including hover. Both explicit and system dark modes use the new token.
- Primary button hover retains 95% fill instead of 80%. The previous faded fill failed normal-text contrast in both DMF light and dark modes.
- Inactive Tabs use foreground at 75% instead of 60%. The old CB muted/white backgrounds produced approximately 3.8–4.08:1 for small labels. The tested new labels meet 4.5:1 in both presets. CB's `--dmf-cb-ui-color-primary: #26ade4` is unchanged.
- `Toaster` accepts `viewportLabel`. Authors rendering multiple Toasters must provide distinct names; the standalone examples now do so. The individual notification remains a polite, atomic `status`.

## Repeatable checks

Run `npm run test:dmf-ui:accessibility` in the source repository. The pinned development-only `axe-core@4.14.0` checks light/dark defaults; both DMF/CB Select, Popover and Menu open states; primary hover; invalid forms; an open dialog; and notifications. The audit stores browser identity, violations and incomplete/manual findings in ignored `.dmf-ui-test-results/accessibility-report.json`. The scenarios also assert dialog Tab/Shift+Tab wrapping, Escape focus return, validation semantics and the Chromium accessibility tree's polite status property. These assertions do not verify spoken output.

To audit an already-built portfolio consumer with the same tool, run from the source repository:

```sh
DMF_UI_AUDIT_BUILD=/absolute/path/to/dmf-web/dist node scripts/test-dmf-ui-accessibility.mjs
```

No UI source or axe dependency is copied into the portfolio. Build the consumer first. The audit runs its independent `/examples/dmf-ui/` page; it does not certify all portfolio or Canvas UI.

The audit fails every violation except a narrowly reviewed `region` best-practice finding on Select/Menu/Tooltip portal wrappers with accessible trigger relationships. These transient popups deliberately live outside reading landmarks. Select/Menu remain named and linked to their triggers; plain Tooltip text supplies the focused trigger's aria-describedby. The finding is retained in the report rather than hidden by changing roles or disabling a rule. New region findings elsewhere still fail. Incomplete findings require review: lazy closed-popup `aria-controls` targets (confirm resolution when opened), a decorative Home symbol whose accessible name is Home, and contrast where a floating popup obscures underlying content. Existing keyboard regressions cover Tabs activation/disabled/RTL, native form values/reset, Select and overlay dismissal/focus.

## Real Astro navigation

`npm run test:dmf-ui:navigation` builds a private fixture under `.dmf-ui-test-results/navigation-dist/`. Its pages use Astro's actual `ClientRouter`, shared source components and native links. The test preserves a document identity and observes real lifecycle events; it never dispatches fake Astro events. It covers A → B → empty → Back → Forward → A, plus a final Select-open swap, detached old owners, portal/toast teardown, reinitialization, Tab selection, form binding, dialog focus and duplicate-handler detection. The fixture is excluded from the package and normal site build. CI builds it but does not pretend to run desktop browser tests.

For manual browser review, run `npm run preview:dmf-ui:navigation` and open the printed loopback URL. The server is read-only; stop it afterward. Nothing is submitted or saved.

## Browser and assistive-technology matrix

| Check | Status / required evidence |
| --- | --- |
| Ego / Chromium | Automated state audit, keyboard regressions and real navigation fixture; exact browser identity is recorded in the local report |
| Safari | Pending manual verification; no Safari control is available in the current browser tooling |
| Firefox | Pending manual verification; no Firefox control is available in the current browser tooling |
| VoiceOver / NVDA spoken output | Pending human assistive-technology review; an accessibility-tree assertion is not speech verification |

For each pending browser, record browser/OS versions and pass/fail notes. In light and dark modes, then at 390px/RTL and with reduced motion: Tab to each control, use Tabs arrows/Home/End/manual activation, toggle checkbox/radio/switch, validate and reset forms, select/typeahead/skip disabled choices, open/edit/Escape/outside-dismiss Popover and Menu, verify focus visibility/return and containment. Use the navigation fixture with each popup open before leaving, then Back/Forward and return from the empty page. Confirm no duplicate notifications or stale portals.

For screen readers, confirm control names/roles/states, selected/disabled tabs, required/invalid descriptions, polite validation/notification speech, dialog title/description and modal focus confinement, menu checks/radios, and page-change announcements. Document actual spoken results rather than inferring them from ARIA attributes.

## Hosted checks already observed

The 0.1.1 source commit `1b86918` passed [DMF UI source](https://github.com/dmfeisal/dmf-ui/actions/runs/39913592682). The consumer commit `f4d6a0f` passed [DMF UI consumer](https://github.com/dmfeisal/dmf-web/actions/runs/39913597111). These results were checked before starting 0.2.0; the new local component additions need their own hosted run after commit/push.

References: [Astro view transitions](https://docs.astro.build/en/guides/view-transitions/), [axe API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md).

## Local verification on 2026-10-23

Both the source build and the installed portfolio 0.1.1 standalone page passed 26 audited states with axe 4.14.0 in Ego (reported Chromium 154). There were no blocking violations; eight open Select/Menu states retained the reviewed `region` best-practice warning. The three incomplete rule families described above remain explicit manual-review findings. The real navigation fixture passed, all six existing regression families passed on both portfolio UI pages, source contract tests passed 8/8 and consumer contract tests passed 7/7. Source checks reported no errors, warnings or hints; portfolio checks reported no errors/warnings and eight existing hints. Clean temporary installs passed for both lockfiles. This is local evidence for the working changes, not a new hosted matrix result or Safari/Firefox/screen-reader certification.

## Component expansion in 0.2.0

The source audit now includes open Accordion and Tooltip in both presets/themes, for 34 states. Real navigation also covers their owner cleanup and reinitialization. The region-label suffixes in the examples distinguish DMF and CB landmarks. See `DMF-UI-DISCLOSURES.md`; manual engine/screen-reader rows remain pending.
