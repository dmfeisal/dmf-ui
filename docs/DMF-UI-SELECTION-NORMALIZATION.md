# Selection contract normalization

26 October 2026. Continued from clean `f537de99f6ef083eadddb1368acc92dd5a0d7181`. Core stays 0.4.0; React stays 0.1.0-alpha.3. Changes are local and uncommitted.

## Starting verification

GitHub Actions run [40278251938](https://github.com/dmfeisal/dmf-ui/actions/runs/40278251938) passed Source / Node 22 and Source / Node 24 for that exact commit. GitHub's legacy combined status had no contexts; it is not the evidence for the successful checks.

Netlify production deploy `6adeeec5efb52256342bf3fd` is ready and its commit_ref matches the full SHA above. Its primary URL is [ui.feisal.id](https://ui.feisal.id), which returned HTTP 200. No deployment was triggered by this continuation.

## Reviewed scope

`contracts/selection.json` records the applicable state/property/sizing/fallback contract for Checkbox, Switch, Radio Group, Select and Combobox. Each component's contract page renders this review separately from the generated lexical inventory. Native attributes and upstream runtime options remain referenced rather than represented as universally expanded or certified.

Each family gains authored state specimens and controls for supported states and sizes, preset selection, native validity inspection and reset. Required errors are associated with the visible control and focus it. Disabled fields demonstrate omission; Switch/Radio Group read-only fields demonstrate preserved submission. Checkbox mixed state is separate from its checked value. Specimen controls stay hidden and inspection stays disabled without enhancement; server content remains readable.

Checkbox gains additive `indeterminate`; initialization sets the native DOM property and uncancelled form reset restores it. Checkbox still owns checked/required/disabled/FormData semantics. No readOnly behavior is invented for it. Lifecycle cleanup aborts listeners before Astro swaps.

Select portals refresh preset, scoped mode and direction on each open, including after switching back to the default. Select now tolerates an absent scope rather than crashing during setup. Combobox retains its native fallback and local popup, with compact Nova field typography/spacing and visible invalid boundaries. No additional Combobox size or readOnly API is introduced.

`--dmf-selection-size`, `--dmf-select-height` and `--dmf-select-height-sm` expose useful component assignments. Existing Switch sizes and thumb geometry stay intact. No blanket touch minimum or new universal variant vocabulary is introduced.

## Design decisions

Nova/Neutral remains the default because this continues the source-owned profile. Existing documentation rhythm and typography remain calm (energy 1, rhythm 1, motion 1); state feedback is the only added motion. Specimens are grouped by actual supported state so their form behavior is inspectable without exposing unsupported properties. Compact selection fields align with the existing 2rem Input and Select scale. Semantic roles keep preset changes centralized.

CB/HUI fills and owner-selected white primary labels remain unchanged. The known approximately 2.57:1 CB and 4.29:1 HUI normal-text contrast exceptions remain explicit. The browser scenario permits only contrast findings on the actual primary inspection buttons in those presets; all other violations fail. Incompletes remain recorded for review.

## Verification boundaries

The new browser scenario covers the five selection families, required errors/focus, selection, FormData, disabled omission, reset, supported read-only states, mixed Checkbox state, existing small variants, presets and Select portal scope, enlarged RTL dark layouts and forced-color Checkbox activation. Existing form, Switch, Select and selection suites remain regression evidence. The React adapter keeps native APIs; there is no new React Combobox or Astro/React API parity claim.

Safari/Firefox, actual touch/virtual keyboards and spoken assistive technology remain manual acceptance. Enhanced Astro Switch/Radio Group/Select still need JavaScript for generated form integration; Combobox supplies a working native select fallback. No package publication, tag, commit, push, portfolio edit or version update is part of this work.

## Verified results

Astro check passes for 508 files with zero errors, warnings or hints. Production build passes for 112 pages. All 41 source/package tests, seven React adapter tests and eight locked packed-consumer tests pass. The local test servers require execution permission; tests use a temporary npm cache rather than changing the user's cache ownership.

The selection-contract scenario passes 30 scoped Chromium audit states. Twenty have zero violations; ten retain only the actual inspection button's expected CB/HUI primary-label contrast finding. There are no incomplete findings in that report. Required errors/focus, native successful values, disabled omission, resets, read-only preservation, mixed initialization/activation/reset, both existing small variants, current Select portal presets, enlarged dark RTL containment and native forced-color Checkbox appearance/focus all pass. No-JavaScript checks verify hidden property controls, disabled inspection actions and the required native Combobox fallback.

Existing forms, Switch and Select scenarios pass, including generated proxy lifecycle, keyboard behavior, presets, resets, mobile RTL and 14/16/28px Switch geometry. Existing selection regression passes 29 audited states; two retain the narrowly recorded owner primary-label exceptions, with no incomplete findings. Raw findings remain in ignored local `selection-contract-audit.json` and `selection-audit.json` reports. The larger imported catalog and unrelated documentation suites were not rerun for this batch.

Enlarged RTL dark Checkbox and Combobox specimen captures were visually inspected. The forced-color rule uses native Checkbox appearance so checked/mixed marks remain system-rendered; selection focus outlines use the system Highlight color. Browser runs finish without runtime errors or failed document/script/style requests. `contracts:check` and `git diff --check` pass. Package manifests and lockfiles have no changes; HEAD remains the starting SHA.

Delivery gate: PASS for scoped functional controls and keyboard/form checks, PASS for the existing calm Nova/Neutral design direction and content-driven specimens, PASS for enlarged RTL containment and inspected focus/label rendering. The owner's explicit CB/HUI contrast policy is preserved as an exception, not presented as a WCAG pass. No complete-catalog or manual assistive-technology certification is claimed.
