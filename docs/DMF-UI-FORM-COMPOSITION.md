# Input Group, Number Field and File Input

Added 26 October 2026 to the Astro adapter. Core stays 0.4.0 and React stays 0.1.0-alpha.3. No package publication or release tag is part of this batch. Earlier component work is committed and deployed separately.

## Input Group

`dmf-ui/input-group` exports InputGroup, InputGroupAddon and InputGroupInput. The input part reuses the existing Input foundation. Prefixes, suffixes and actions are authored as addons; there is no interception of native editing, validation or form submission. Layout wraps on narrow screens and keeps native action targets reachable.

Always associate a visible Label with the actual input. The optional root label names the group only. Reference meaningful prefix/suffix text with aria-describedby. Only the native input's value is submitted; an address prefix is not silently added to FormData. Decorative icons may be hidden from assistive technology; addons containing buttons must remain exposed. Action buttons can be label-only, icon with label, or named icon-only controls with supplemental Tooltip help.

The docs demonstrate a prefixed address and a local clear-search action. Inspect buttons use local FormData without transport. JavaScript-only demo actions start disabled until their handlers are ready; native typing and reset remain available without JavaScript.

## Number Field

`dmf-ui/number-field` exports NumberField. A visible label names a native type=number input. Finite optional min/max, positive numeric step, initial value and standard input attributes are supported. Initial values must be in range and on the browser's min/value step grid. Equal min/max is valid. Text entry remains native; invalid user-entered values are not silently clamped.

Enhanced step actions call native stepUp/stepDown, then emit bubbling input/change only when a value changed. Label-only, icon-with-label and named icon-only step actions are available. The icon-only actions use shared Tooltip help. The numeric input label remains visible in all presentations.

Boundary, disabled, readonly and bad-input states disable unavailable step buttons. Reset synchronization runs after the native default action, so cancelled reset preserves state. Hosts changing input value, bounds or disabled status programmatically should dispatch input or change to refresh action availability. FormData, required validity and keyboard arrows remain browser-owned. No auto-submit, persistence or arbitrary-step arithmetic is introduced.

Without JavaScript, extra step actions stay hidden; the native number input still supports typing, keyboard arrows, validity and reset.

## File Input

`dmf-ui/file-input` exports FileInput. It preserves native file selection, accept, multiple, required, disabled and form integration. multiple=false omits the boolean attribute rather than rendering a truthy string. A visible label names the picker. Optional enhanced metadata lists file names and byte sizes with text nodes, and politely updates the selection count after change/reset.

The component does not read contents, create object URLs, validate an upload policy or make a network request. accept remains a native picker hint; hosts own content/size policy, transport and persistence. showSelection=false keeps just the native picker. Native filename display still works without JavaScript while enhanced metadata remains hidden.

## Verification

- Astro check: no errors, warnings or hints. Production build: 65 pages. Source/package suite: 31 tests passed, including finite numeric configuration, native step base and correct file-input booleans.
- Isolated Chrome: grouped input editing, clear/focus, FormData and reset; native and fractional number stepping, bounds, invalid typed values, required emptiness, readonly/disabled actions and native values; file names/byte sizes, text escaping, multiple selection, required validity, FormData and reset/cancelled reset.
- File scenarios supply synthetic local fixtures through Chrome's file-input test API. They do not read real user documents or automate an upload. Actual OS picker interaction remains a manual check.
- Preview-region axe audits cover DMF, CB, Horego and Portfolio; DMF dark; 390px mobile RTL with 200% of the site's default text size. No violations or incomplete results in these scoped states.
- Shared step Tooltip focus/Escape and forced-colors/reduced-motion emulation retain numeric interaction. Native no-JavaScript checks cover grouped input values, number keys/reset and file selection/FormData/reset.
- Existing selection, documentation, Create and search flows are regression checked. Browser artifacts are local test outputs, not shipped package assets.

Safari, Firefox, mobile virtual keyboards, actual file-picker dialogs and spoken screen-reader checks remain pending. These are Astro components; no React counterparts are added. Portfolio files are untouched. Package versions remain unchanged.
