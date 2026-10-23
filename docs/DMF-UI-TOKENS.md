# Portable tokens in 0.3.0

## Source and outputs

`tokens/design.tokens.json` is the editable source for the existing shared semantic foundation. It contains `dmf.light`, `dmf.dark` and `cb.light` groups, using DTCG 2025.10 color, dimension, shadow and fontFamily types and whole-token aliases. The small local generator implements these authored constructs, not the complete DTCG resolver specification. No new dependency is required.

Run `npm run tokens:build` after editing the source. Commit the source and its generated outputs together:

- `src/styles/dmf-ui-tokens.css`: Existing `.dmf-ui` light, explicit root dark and system-dark fallback selectors.
- `src/styles/dmf-ui-cb.css`: Existing light-only CB scope and bundled Nunito font-face.
- `tokens/resolved.json`: Platform-neutral, alias-resolved authored groups with explicit types and units. These are not complete native themes: `dmf.dark` overlays `dmf.light`; the CB group overrides the ambient DMF values, retaining the existing CSS inheritance for roles it does not define.

Development, check, build and pack hooks run `tokens:check`, which fails on stale files rather than silently changing the checkout. `npm test` also checks determinism, alias errors, invalid values and baseline inventory. CI explicitly validates generated output. The generator writes complete declared outputs; it does not patch authored UI source or append CSS overrides.

Consumers keep existing CSS imports and custom-property names. Two additive data exports are available: `dmf-ui/tokens.json` and `dmf-ui/tokens/resolved.json`. Distribution includes both JSON files. No installed-package generation or sibling checkout is required.

## Preserving current behavior

The migration covers existing shared colors, radii, shadows and CB font roles only. It does not copy the portfolio's page-specific spacing, container or typography system, and does not change the host's relative 14px root. Existing aliases remain CSS custom-property references so runtime brand overrides still work. CB primary remains `--dmf-cb-ui-color-primary: #26ade4`, with light-only behavior and its original reconstruction attribution.

OKLCH values retain their color space. sRGB values retain numeric components and consistent hex fallbacks. Dimensions retain `rem` or `px`; there is no implicit conversion to native points, density-independent pixels or scaled text. Shadows retain all layers, offsets, blur, spread and alpha. The CB destructive color retains its existing CSS sRGB mix through one validated web extension; the typed color also holds its numerically equivalent sRGB value. Original upstream hashes remain historical provenance, not hashes of generated files.

## Platform boundaries

Typed source and resolved JSON are data foundations, not React, React Native or SwiftUI component adapters. Future adapters must choose explicit color-space conversion, typography/Dynamic Type, density, shadow and font-asset policies. Do not assume one rem equals a fixed native size or flatten wide-gamut colors silently. Native generation and native device verification remain future milestones. The current framework exports remain Astro.

## Verification

`tests/fixtures/tokens/0.2.0-{dmf,cb}.css` are immutable migration references, not alternate editable sources or distributed styles. `npm run test:dmf-ui:tokens` compares each token's resolved browser property against those fixtures in DMF light/dark/system-dark and CB under all three surrounding modes. Font-face loading is excluded from the isolated value comparison; normal component/browser checks cover bundled font loading.

Run source checks, build, contract tests, computed-token parity, documentation/Create browser checks and affected consumer regressions before advancing the archive pin. Browser evidence is Chromium-only; Safari/Firefox and spoken screen-reader checks remain pending.

## Design and Anti Slop scope

Direction: preserve Fulldev-based DMF UI and the owner's CB preset. This is a data/build migration with no new screen, navigation, assets, typography choices, motion or decorative treatment. Existing semantic names preserve color hierarchy; dimensions and font roles retain their authored units and families. ENERGY 1, RHYTHM 1, MOTION 1 apply to this maintenance scope, not a redesign claim about every existing example. Verification must demonstrate parity rather than invent visual novelty.

[Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) provides the interchange types. The generator deliberately rejects unsupported constructs rather than claiming full tool conformance.
