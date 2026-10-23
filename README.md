# DMF UI

Experimental Astro UI components adapted from Fulldev base-vega, using Tailwind v4 and Data Slot. This repository is the source of truth for component source, semantic tokens and the DMF / CB UI reconstruction presets. The portfolio consumes a pinned package snapshot.

## Develop

Use Node >=22.12. Run `npm ci`, `npm run check`, `npm run build` and `npm test`. `npm run dev` opens the local documentation; `/examples/dmf-ui/` contains independent examples. Run `npm run test:dmf-ui` for local Ego Browser acceptance checks against an isolated build snapshot on a free port. See docs/DMF-UI-QUALITY.md for CI, filtering and failure recovery.

## Consume

Install a packed version of this repository with `npm install ./vendor/dmf-ui-0.1.0.tgz --save-exact`. The package is private and has not been published to npm.

```astro
---
import { Button } from 'dmf-ui/button';
import 'dmf-ui/styles.css';
---
<div class="dmf-ui"><Button>Continue</Button></div>
```

Enable the Tailwind Vite plugin in your Astro configuration. Component classes are discovered from the installed package. Add explicit `@source` paths for consumer-authored utility classes in your own stylesheet. Core styles preserve scoped normalization instead of global Preflight and never set a global root font size. The examples retain a relative 14px root.

Public imports include component directories (`dmf-ui/dialog`, `dmf-ui/select`, etc.), the aggregate `dmf-ui` entry, `dmf-ui/button/variants`, `dmf-ui/styles.css`, `dmf-ui/tokens.css`, and `dmf-ui/presets/cb-ui.css`. Host-owned toast controllers are available from `dmf-ui/toast`. Optional specimens use `dmf-ui/examples/*` and `dmf-ui/examples.css`; component CSS does not import documentation layout rules.

The CB preset uses `data-system="cb-ui" data-color-mode="light"` on `.dmf-ui` and retains `--dmf-cb-ui-color-primary: #26ade4`. Its licensed Nunito font is bundled through CSS asset URLs, without a consumer-owned font route. The preset is a 2026 reconstruction, not a historical shipped-system claim.

## Update a consumer

1. Make and verify changes here. Bump `package.json` and its lockfile for a new snapshot.
2. Run `npm pack --ignore-scripts --pack-destination /tmp`.
3. Put the new archive in the consumer's `vendor/` directory and install that exact file with `npm install --save-exact`.
4. Verify the consumer and review its package-lock integrity change. Commit source and consumer changes when requested.

Do not edit installed package files or recreate component copies in consumers. A future Git SHA or registry release can replace archive pins. No local folder link is required for clean builds.

Preserve `dmf-ui/notices` in distributed sites and source. `dmf-ui/provenance` records source URLs, hashes, dependency versions and adaptations. The portfolio mirrors those two files during dev/build; fonts are resolved by Vite.

## Scope and attribution

Astro is the implemented adapter. React and WordPress support, stable API guarantees and npm publication remain future work. Preserve notices for Fulldev, shadcn/ui, Tailwind CSS, Data Slot, Lucide and bundled dependencies. Radix is not a runtime dependency. Full notices are in `public/dmf-ui-notices.txt`. `EXPORT-MANIFEST.json` records the original extraction snapshot and is historical, not a current package inventory.

Quality follow-up: `npm run test:dmf-ui:accessibility` runs the pinned axe audit and focused keyboard/AX checks. `npm run test:dmf-ui:navigation` builds an isolated ClientRouter fixture and tests actual links/history. These local browser commands require Ego Browser; see docs/DMF-UI-QUALITY.md for exact coverage and manual browser/screen-reader gaps.
