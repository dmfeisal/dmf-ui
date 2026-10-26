# HUI preset

The HUI preset adds the brand direction confirmed in the owner's 2026-10-25 HUI discussions and portfolio case study. It uses shared Astro components and changes their theme, not their behavior. Core stays 0.4.0; React stays 0.1.0-alpha.3. No package publication or release tag is part of this work.

## Foundations and evidence

Confirmed brand colors: Off Red #EC2A00, Amber #FFB800, White #FFFFFF, Egyptian Blue #29329B, Kelly Green #63C132, Eerie Black #232323. Confirmed type direction: Rounded Mplus headings and Inter body. The preset bundles Latin WOFF2 editions of M PLUS Rounded 1c (500 and 700) and variable Inter from Fontsource 5.2.8, with their supplied OFL licenses and attribution. Other scripts fall back to the declared sans-serif families; this is not a multilingual font-coverage claim.

Source context: the owner's private portfolio report and design-system case study, based on confirmed 2023 foundations. Identifying private source paths are omitted from this public record. The original 48-page guideline PDF was unavailable at the initial extraction; subsequent local verification is recorded in DMF-UI-FOUNDATIONS.md. No logo, lockup, clear-space ratio or historical product token has been inferred.

## Present-day semantic mapping

The six brand colors are preserved as `--hui-*` variables in `hui.light`. Primary uses Off Red; its label is black because white on #EC2A00 is approximately 4.29:1, below the normal-text threshold. Black on Off Red is approximately 4.90:1. Links and focus use Egyptian Blue. Amber secondary surfaces use Eerie Black labels. Kelly Green remains a brand/chart token, not small text on white. Error red, neutral surfaces, borders, shadows and the 0.5rem radius are new DMF implementation choices, not recovered product tokens. Chart colors do not promise adjacent-segment contrast; chart authors still need labels and suitable boundaries.

The preset is light only, including inside a dark documentation page. A dark HUI palette requires a separate decision and verification. Typography/radius overrides in Create are customizations, rather than official brand variants. Consumer App, Biz Suites and POS share this starting point; this change does not invent separate product themes.

## Use

```astro
---
import 'dmf-ui/styles.css';
import 'dmf-ui/presets/hui.css';
import {Button} from 'dmf-ui/button';
---
<section class="dmf-ui" data-system="hui" data-color-mode="light">
  <Button>Continue</Button>
</section>
```

The current shared stylesheet already includes available presets; the explicit preset export also supports direct stylesheet use. Tokens and local fonts ship in the archive. The portable `tokens/resolved.json` includes `hui.light`, but does not constitute a React or native theme adapter. Existing DMF and CB token values remain unchanged.

Create at `/create/?system=hui` supports preview, normalized share links, CSS copy, JSON download, font/radius customization, reset and RTL direction. Product preset accent and dark controls are locked to the verified brand foundation. Component detail pages remain DMF-only; preset comparison stays in Create.

## Verification — 2026-10-25

Astro check passed across 190 files with zero errors, warnings or hints. The production build generated 34 pages. All 18 source tests passed, including deterministic token generation, unchanged DMF/CB migration inventories, brand values, contrast pairs, WOFF2 signatures and packaged font/license assets.

Isolated Chrome passed Create and global-search flows on both the production build and localhost development server, with no page errors or failed document/script/style requests. Create's seven axe states had zero violations and zero incomplete checks: default, customized DMF dark, CB RTL, HUI RTL, HUI inside a dark page, HUI mobile RTL and default mobile RTL. Actual local Inter and Rounded Mplus face loading was verified. Share restoration, JSON contents, export instructions, primary action feedback, reset and mobile containment passed.

These are Chromium checks. Safari/Firefox, spoken screen readers and other-script typography remain pending.
