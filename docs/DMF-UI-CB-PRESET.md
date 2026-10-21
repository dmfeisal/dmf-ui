# CB UI reconstruction preset for DMF UI

Status: experimental, present-day 2026 reconstruction. Examples are in `/ui/#fulldev-pilot` and `/examples/dmf-ui/#standalone-forms-title`. This does not change or claim to reproduce the original employer-period system or migrate the existing CB UI playground.

## Verified source and translation

Raw palette, Nunito typography and shape values come from `public/css/cb-ui-tokens.css`, documented by `/playground/cb-ui-2026/`. `docs/DMF-UI-UPSTREAM.json` records its hash. New semantic assignments below are explicit present-day adaptations using those values, not additional historical evidence.

| Role | Source value | Current use |
| --- | --- | --- |
| Primary / brand | Cashbac 50, `#26ade4` | `--dmf-cb-ui-color-primary` feeds `--primary` and `--cb-brand`; action backgrounds and selected controls use this brand blue, with dark `#23282c` foreground for readable labels |
| Focus / accent ink | Cashbac 80, `#166788` | Focus ring and text on pale accent surfaces |
| Secondary | Tosca 10 `#ebfffc` / Tosca 80 `#0d4a41` | Secondary surface and foreground |
| Foreground | Semantic text, `#23282c` | Text on white, contrast 14.88:1 |
| Muted foreground / input boundary | Black 40, `#4b5764` | Muted text and essential form boundaries; contrast against white 7.38:1 |
| Muted | Black 10, `#e9eaec` | Muted surface |
| Accent | Cashbac 10, `#e9f6fc` | Accent surface |
| Border | Semantic border, `#c8ced3` | Nonessential surface dividers; inputs use the stronger boundary above |
| Error ink | 60% original Red 50 `#f86c6b` mixed with Black 80 `#0c1218` | Derived semantic error shade for readable validation; not an original palette value |
| Radius | Default radius, `.25rem` | Base input to Fulldev's relative corner scale |
| Font | Nunito variable, weight 200–900 | Bundled from Google Fonts' official Nunito source under SIL OFL 1.1; fallback family mirrors the recovered family list |

No verified historical dark-mode palette is asserted. The CB preset stays light when the surrounding DMF example uses Dark or Yellow. `data-color-mode="light"` excludes upstream dark utility variants while the preset's scoped variables override the base dark tokens.

## Scope and behavior

Use a wrapper with `class="dmf-ui" data-system="cb-ui" data-color-mode="light"`. `src/styles/dmf-ui-cb.css` provides scoped token overrides and a uniquely named font family. DMF sibling examples retain the Fulldev defaults. The same Button, Tabs and form source is used in both presets; no alternate behavior implementation is introduced.

Select, Popover and Dropdown Menu propagate the CB preset and light color mode onto relocated portal roots. Browser regressions verify font, surface color and RTL containment. CB-branded modal dialog portals remain a future acceptance criterion; the base DMF dialog/toast examples remain unchanged.

## Verification

`tests/browser/dmf-ui-forms.mjs` checks both preset forms and their independent state, native validation and submission values, reset, keyboard, mobile/RTL geometry, light-only CB behavior in dark surroundings, and absence of duplicate native proxies on repeated initialization. Existing Tabs/browser regressions cover the shared interactions. Contrast numbers above are calculated from the documented sRGB colors; they do not represent a complete accessibility certification.

Keep product-specific patterns and governance separate from the shared implementation. The next step after this source-owned proof is a separately built consumer and a deliberate production component migration, not an automatic rewrite of historical product documentation.
