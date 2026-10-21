# DMF UI Fulldev-first foundation

Status: experimental, Astro-first. Live reference: `/ui/#fulldev-pilot`. Standalone consumer: `/examples/dmf-ui/` (noindex; not in the sitemap).

## Reference priority and ownership

Fulldev is the primary reference for DMF UI component anatomy, tokens, styling, variants and interaction behavior. Prefer upstream defaults over inferior or conflicting legacy DMF rules. Button, Input, Dialog, Toast, Tabs and the core forms retain base-vega source structure and Data Slot behavior. The former palette mapping, square shapes, desktop 44px sizing and extra focus outline have been removed. The old button/input specimens now render shared components instead of maintaining competing styles.

Source is in `src/components/dmf-ui/`; `DmfUIPilot.astro` composes the foundation examples and notification triggers. This is not yet a standalone package or a React/WordPress API. Existing Canvas, publishing and storage remain page-owned. Portfolio token/color/media specimens are explicitly labeled as existing site references; they do not override the new foundation.

`DMF-UI-UPSTREAM.json` records upstream source URLs, the observed repository revision, exact downloaded registry hashes, dependency versions and modifications. Live registry responses may differ from that Git revision. Review changes before updating local source.

## Foundations

`src/styles/upstream/fulldev-base.json` preserves the adopted base registry definition. `src/styles/dmf-ui-tokens.css` contains its full light/dark semantic colors, chart/sidebar tokens, radius and shadows. These defaults do not depend on portfolio token values. Yellow currently uses Fulldev's light palette inside component surfaces, while the portfolio retains its Yellow mode. A separate Yellow product preset can be designed later.

`src/styles/dmf-ui.css` keeps Tailwind spacing, system sans typography, upstream radius mappings, component sizing/focus utilities and animation behavior. It imports tw-animate-css and a source-owned copy of shadcn's Tailwind stylesheet. The shadcn CLI is not needed at runtime or build time. The class helper is the upstream `cn` package.

The site keeps its existing 14px root during this incremental migration; rem sizes scale accordingly. New component corners follow Fulldev; portfolio layout and specialized object artwork do not automatically adopt those shapes.

## Isolation and lifecycle

Utilities and native normalization use CSS `@scope (.dmf-ui)` instead of global Preflight while portfolio pages migrate. Modern CSS @scope support is required. Both `/ui/` and the standalone example import the foundation. The standalone page loads no portfolio layout, tokens, styles, fonts, Canvas or site scripts. Tokens are scoped to `.dmf-ui`; dialog portals carry their own scope and theme values. Toast keeps `portal=false` and a bounded three-item viewport.

Retain intentional safeguards: dialog viewport bounds, notification stacking above site chrome, 44px coarse-pointer targets, native hidden semantics and reduced motion. They do not reinstate older DMF visual defaults.

Dialog initialization discovers explicit `data-dmf-dialog` component roots, independent of a pilot wrapper, and prevents repeated binding; controllers are destroyed before Astro swaps. The pilot owns one toast controller, delegated listener and teardown. Data Slot owns focus trapping, Escape, dismissal and notification behavior.

## Credits and maintenance

`public/dmf-ui-notices.txt` includes full notices for Fulldev, shadcn, Tailwind, Data Slot, Lucide, CVA, cn and tw-animate-css. Radix is not used in this implementation. Include relevant notices in future source/package distributions. New product presets require verified brand foundations; present-day CB UI reconstruction and historical employer systems remain distinct.

## Verification

Run `npm run check` and `npm run build`. With a server on port 4399, run:

```
ego-browser nodejs < tests/browser/dmf-ui-pilot.mjs
```

The browser regression checks upstream token inheritance, rounded button defaults, dialog semantics/initial focus/trapping/editing/Escape/close/focus return, notification rendering/dismissal, utility isolation, and 390px RTL with reduced motion. The same regression also visits the standalone page, rejects portfolio assets/tokens, checks two independent dialogs and toast controllers, native required-field validation, dark mode and 390px RTL. Other browser engines, Astro client navigation remain future validation; the independent Astro consumer is documented in `DMF-UI-EXTRACTION.md`.

The CB UI preset and independent Astro consumer now have dedicated examples and acceptance checks. See `DMF-UI-EXTRACTION.md` for reproducible export, repository boundaries and remaining packaging work. Dependencies should be audited at release; the existing seven toolchain advisories were present before this foundation change.

## Standalone consumption contract

`src/pages/examples/dmf-ui/index.astro` imports the shared component directories and `src/styles/dmf-ui.css` directly, without BaseLayout or StyleguideLayout. Its local CSS owns page layout, breadcrumbs and the relative 14px root; shared component styles own component appearance. The examples have independent dialog roots, form inputs and toast controllers. Theme switching is page-local with System/Light/Dark and no storage writes.

For a future clean Astro consumer, copy `src/components/dmf-ui/`, `src/styles/dmf-ui*.css`, and `src/styles/upstream/`, retaining their notices. Install the versions recorded in `DMF-UI-UPSTREAM.json`, enable the Tailwind Vite plugin, import the shared stylesheet, and add the consumer's example/page files to Tailwind's source discovery. Wrap rendered UI in `.dmf-ui`; do not import portfolio tokens or scripts. Toast currently requires a host-owned controller and disposal; the standalone page demonstrates that integration. This is source consumption guidance, not a stable public package API.

## Tabs

Fulldev base-vega Tabs is implemented in `src/components/dmf-ui/tabs/`, with `@data-slot/tabs` 1.1.2. Both `/ui/` and `/examples/dmf-ui/` render the same source-owned `examples/TabsExamples.astro` specimens: rounded automatic horizontal tabs with a disabled item, underline manual tabs with a non-first default, and a vertical list. Existing section navigation and page links are unchanged.

Use explicit, matching `value` properties on triggers and content. Give each list an accessible name; defaultValue selects an enabled initial tab. The upstream server-rendered initial-panel logic is retained, so the default content is visible before JavaScript. Other panels stay hidden until enhancement; this is not a no-JavaScript navigation replacement. Data Slot supplies tab/tablist/tabpanel roles, unique IDs, ARIA associations, roving focus, Home/End, disabled skipping and automatic/manual activation. Keep links for navigation between pages.

Each rendered root has `data-dmf-tabs`. Initialization is idempotent, scoped to these roots and independent of the documentation wrappers. Controllers and the RTL adapter are destroyed on Astro before-swap; page-load rediscovers roots. The runtime's horizontal arrows are DOM-ordered, so a narrow capture adapter mirrors Left/Right only in computed RTL lists, respecting disabled items, nested roots, modifiers and manual activation. Other keyboard/mouse behavior stays upstream-owned. No persistence, history or Canvas behavior is added.

Existing foundation rules provide coarse-pointer 44px targets and reduced motion. Tab-list height can grow on coarse pointers so the target size does not clip. Themes and local scope use the same foundation tokens as the other components.

Run `ego-browser nodejs < tests/browser/dmf-ui-tabs.mjs` with the preview on port 4399. It checks both pages: server-rendered default panels, ARIA/IDs, disabled skipping, roving focus, Home/End, Enter/Space manual activation, vertical arrows, independent instances, RTL mirrored arrows, 390px targets/overflow, reduced-motion layout, dark tokens, repeated initialization and teardown/reinitialization. Source provenance and dependency version are recorded in `DMF-UI-UPSTREAM.json`; the existing Fulldev/Data Slot notices cover this addition.

## Core forms and native behavior

Label, Field (including content/description/error/group/legend/set/separator/title), Textarea, native Checkbox, Radio Group and Switch are adapted from the recorded Fulldev source. Field's Separator dependency is included. Radio Group and Switch use Data Slot 1.1.2, discover explicit DMF roots, initialize idempotently and destroy controllers/generated proxies before Astro swaps. Ready events allow each form to enable only after its required controls are bound. Native form fieldsets stay disabled without JavaScript; there is no accidental GET fallback exposing sample values.

`examples/FormExample.astro` composes required text/email/message fields, a required radio group with an unavailable item, a required checkbox, optional named switch, disabled checkbox/switch/input, read-only reference, FieldError feedback and submit/reset actions. Native validity prevents submission. The submit handler reads native FormData into a text-only local preview and prevents transport. Errors are associated through aria-describedby/aria-invalid and cleared on valid input or reset. No storage, publishing, API requests or history are added.

`examples/SystemExamples.astro` renders independent DMF and CB UI forms plus Buttons and Tabs in both documentation pages. The CB UI preset is scoped and light-only; see `docs/DMF-UI-CB-PRESET.md`. Checkbox/radio/switch artwork retains upstream geometry on touch layouts, while associated labels offer 44px targets. Textarea receives scoped native font normalization. Switch tracks explicitly clear native button padding and use pixel-matched thumbs with equal 2px endpoint insets at both sizes, independent of root font size. Switch artwork uses an LTR track in RTL reading layouts, retaining correct checked-state positioning. Field descriptions use logical start alignment.

Run `ego-browser nodejs < tests/browser/dmf-ui-forms.mjs` for native validation, error states, keyboard checkbox/radio/switch operation, exact FormData, disabled exclusions, read-only inclusion, reset, instance isolation, preset/theme isolation, coarse-pointer RTL geometry and controller teardown/rebinding. The standalone example passes without portfolio assets. This is a source-owned Astro implementation; other framework adapters remain future work; the separate Astro consumer is documented in `DMF-UI-EXTRACTION.md`.

Copy `public/dmf-ui/` and `public/dmf-ui-notices.txt` with the styles and components when testing a clean consumer: the optional CB UI preset references its bundled Nunito font. No Google Fonts request or portfolio stylesheet is required.

## Select

`select/` adopts Fulldev base-vega Select with Data Slot 1.1.2, including server-rendered placeholders/default labels, grouped options, separators, both trigger sizes, disabled states and popper/item-aligned positioning. Each explicit DMF root initializes once and disposes on before-swap. Form examples wait for Select readiness alongside Radio Group and Switch.

Both presets demonstrate a required channel with a disabled option, plus a disabled default-valued control. Native generated select controls own validity, FormData and reset; the host associates errors with the visible trigger. Data Slot owns arrows, Home/End, typeahead, Enter/Space, Escape, outside dismissal and focus return. Popups carry their own `.dmf-ui` scope and the source preset/color mode, with logical direction refreshed on open. Long option text wraps, content stays viewport-bounded, and coarse-pointer options have 44px targets. No values are persisted or sent.

Run `ego-browser nodejs < tests/browser/dmf-ui-select.mjs` and the existing form regression. Other framework adapters remain future work. Existing Fulldev, Data Slot and Lucide notices cover this addition.

## Popover and Dropdown Menu

`popover/` and `dropdown-menu/` adopt the recorded Fulldev base-vega source with Data Slot 1.1.2. `examples/OverlayExamples.astro` renders both inside each preset on both documentation pages. Popover demonstrates a named nonmodal dialog with a labeled visit-local draft and Done button. Dropdown Menu demonstrates grouped actions, a disabled action, separators, checkbox and single-selection radio items; `closeOnSelect=false` keeps these settings available while editing. A polite host status confirms menu selection without transport or persistence.

Explicit DMF roots initialize once and destroy controllers before Astro swaps. `overlay-scope.ts` gives relocated portals their source preset/color mode and reading direction, updated on open. Native link keyboard activation is delegated to the menu portal with scoped cleanup. Data Slot owns positioning/collision handling, focus return, Escape/outside dismissal, menu roving navigation and checked state. Popover is nonmodal; native field editing and Tab remain available. Panel dimensions are viewport-bounded; menu items offer 44px coarse-pointer targets and logical spacing supports RTL. Existing Fulldev/Data Slot/Lucide notices apply.

Run `ego-browser nodejs < tests/browser/dmf-ui-overlays.mjs` for both pages/presets: editing, close/reopen, focus return, disabled skipping, checkbox/radio state, action feedback, outside dismissal, mobile RTL theme/containment/targets and repeated init/destroy/rebind. These examples do not migrate portfolio or Canvas menus.
