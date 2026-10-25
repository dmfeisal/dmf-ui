# DMF UI

Experimental Astro UI components adapted from Fulldev base-vega, using Tailwind v4 and Data Slot. This repository is the source of truth for component source, semantic tokens and the DMF / CB UI reconstruction presets. The portfolio consumes a pinned package snapshot.

## Develop

Use Node >=22.12. Run `npm ci`, `npm run check`, `npm run build` and `npm test`. `npm run dev` opens the local documentation; `/examples/dmf-ui/` contains independent examples. Run `npm run test:dmf-ui` for local Ego Browser acceptance checks against an isolated build snapshot on a free port. See docs/DMF-UI-QUALITY.md for CI, filtering and failure recovery.

## Consume

Install a packed version of this repository with `npm install ./vendor/dmf-ui-0.4.0.tgz --save-exact`. The package is private and has not been published to npm.

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

Astro is the primary implemented adapter. A separate experimental React web alpha lives in `packages/react`; stable React support, WordPress support, API guarantees and npm publication remain future work. Preserve notices for Fulldev, shadcn/ui, Tailwind CSS, Data Slot, Lucide and bundled dependencies. Radix is not a runtime dependency. Full notices are in `public/dmf-ui-notices.txt`. `EXPORT-MANIFEST.json` records the original extraction snapshot and is historical, not a current package inventory.

Quality follow-up: `npm run test:dmf-ui:accessibility` runs the pinned axe audit and focused keyboard/AX checks. `npm run test:dmf-ui:navigation` builds an isolated ClientRouter fixture and tests actual links/history. These local browser commands require Ego Browser; see docs/DMF-UI-QUALITY.md for exact coverage and manual browser/screen-reader gaps.

Version 0.2.0 adds `dmf-ui/accordion` and `dmf-ui/tooltip`, with shared DMF/CB examples and the `disclosures` browser family. See docs/DMF-UI-DISCLOSURES.md for usage and behavior boundaries.

## Portable tokens in 0.3.0

Edit `tokens/design.tokens.json`, then run `npm run tokens:build`. The generated CSS keeps existing public custom-property names and theme selectors. `npm run tokens:check` rejects stale output during development, checks and builds. Consumers can import `dmf-ui/tokens.json` or `dmf-ui/tokens/resolved.json` for typed token data. This prepares future adapters; React, React Native and SwiftUI components are not included. See [token authoring and migration](docs/DMF-UI-TOKENS.md).

## Documentation site

Version 0.4.0 adds Text, Card, Badge and Alert, with both-preset previews, a Component contracts guide and the experimental `dmf-ui/contracts.json` export. The catalog contains 21 families. See [content contracts and authoring](docs/DMF-UI-CONTENT.md).

The source repository builds Home (`/`), the searchable Components catalog (`/components/`), individual component pages and Docs (`/docs/`). The existing `/examples/dmf-ui/` remains the independent integration gallery. Run `npm run dev` to view it locally and `npm run test:dmf-ui:docs` for documentation browser checks. See [documentation ownership and routes](docs/DMF-UI-DOCUMENTATION.md). Documentation host files are excluded from the component archive.

## React web alpha

The private `packages/react` proof provides Button, Text, Input, Switch and Card. After the root `npm ci`, run `npm ci --prefix packages/react` before source checks or documentation builds. Run `npm test --prefix packages/react` for type, server rendering and DOM hydration checks. Run `npm run test:dmf-ui:react-consumer` for a separate locked Vite app installed from packed archives, with production asset and form/ref checks. Alpha.2 exports compiled ESM and declarations. The documentation proof is `/examples/react/`. See [React alpha boundaries](docs/DMF-UI-REACT.md). Astro-only consumers do not install React or this package.

### Horego preset

Use the brand-derived Horego light preset in [Create](https://ui.feisal.id/create/?system=horego). Load `dmf-ui/presets/horego.css` after `dmf-ui/styles.css`, then use `class="dmf-ui" data-system="horego" data-color-mode="light"`. See [Horego preset scope and evidence](docs/DMF-UI-HOREGO-PRESET.md). This is a new semantic mapping of the confirmed brand foundations, not a historical product-system reconstruction.

### Navigation components

Native Astro `Breadcrumb`, `Pagination` and `NavigationMenu` are exported from `dmf-ui/breadcrumb`, `dmf-ui/pagination` and `dmf-ui/navigation-menu`. They preserve real-link behavior without client controllers. See [navigation semantics and verification](docs/DMF-UI-NAVIGATION-COMPONENTS.md), or run the local site and open `/examples/navigation/1/` for the three-page pagination example.

### Product details

Astro `Avatar`, `Rating` and `Chip` are available from `dmf-ui/avatar`, `dmf-ui/rating` and `dmf-ui/chip`. Avatar supports image-error initials; Rating offers read-only scores or native radio input; Chip provides native checkbox filters. See [product detail semantics and verification](docs/DMF-UI-PRODUCT-DETAILS.md).

### Portfolio preset and extracted patterns

The `dmf-ui/presets/portfolio.css` export provides Light, Dark and Yellow appearances from dmf-web's palette, with local Inter/Plus Jakarta Sans. `TagList`, `ProjectActionBar`, `SectionNavigation` and `ArchiveIndex` are available as root and individual exports. See [extraction inventory, source provenance and boundaries](docs/DMF-UI-PORTFOLIO.md). The standalone example is `/examples/portfolio/`; Create accepts `?system=portfolio&mode=yellow`.

### Sidebar, responsive menus and presentation options

`Sidebar` and `ResponsiveNavigation` provide native disclosure navigation. Existing navigation and applicable product-detail components now offer `presentation="label"`, `"icon-label"` and `"icon"`, with named icon-only controls and shared tooltips. Numeric pagination destinations and archive markers retain their meaning. See [the presentation matrix, defaults and boundaries](docs/DMF-UI-NAVIGATION-PRESENTATIONS.md).

`Skeleton`, `EmptyState`, `Progress` and `LoadingButton` cover loading, missing results and pending actions in the Astro adapter. Progress and Loading Button expose explicit host-driven state helpers; native semantics and reduced-motion behavior are preserved. See [feedback components and verification](docs/DMF-UI-FEEDBACK.md).

`Table`, `DescriptionList` and `Slider` add native tabular records, semantic key/value details and a labeled range input. Table overflow stays local; Slider preserves native keyboard, form and reset behavior. See [data display and range verification](docs/DMF-UI-DATA-DISPLAY.md).

`Collapsible`, `Toggle`, `ToggleGroup` and `Combobox` add optional disclosure, pressed commands and searchable local selection. All appropriate command presentations are available; Combobox retains a native select fallback. See [selection behavior and verification](docs/DMF-UI-SELECTION.md).

`InputGroup`, `NumberField` and `FileInput` add composed native inputs, bounded step actions and local file selection metadata. Native editing, validity, form values and reset remain available. See [form composition behavior and verification](docs/DMF-UI-FORM-COMPOSITION.md).

`Sheet` and `AlertDialog` add modal panels and explicit confirmation flows with three trigger presentations, safe focus return and wrapper-owned background isolation. Confirmation actions close only when the host requests it. See [modal components and verification](docs/DMF-UI-MODAL-COMPONENTS.md).
