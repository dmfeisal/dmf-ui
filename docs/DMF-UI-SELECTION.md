# Collapsible, Toggle, Toggle Group and Combobox

Added 26 October 2026 to the Astro adapter. Core remains 0.4.0; React remains 0.1.0-alpha.3. No packages or release tags are published.

## Deployed checkpoint

The preceding feedback/data/header batch, `eb1d80c1c91ef70a6208bfffd0ace551ff555da0`, was pushed to main. [GitHub CI](https://github.com/dmfeisal/dmf-ui/actions/runs/40214633420) completed successfully for that exact SHA. Netlify production deploy `6ade366ebda97f8bdcdb99fb` is ready for the same SHA at [ui.feisal.id](https://ui.feisal.id). Live Chrome smoke checks also passed the deployed feedback and data component flows without runtime or failed document/script/style requests. The new components described below are a separate working-tree batch.

## Components

- **Collapsible** uses native details/summary, with independent open state and label, icon with label, and named icon-only summaries. Native title supplements icon-only labels. Escape enhancement closes and returns focus to the summary; native Enter/Space still works without JavaScript. Content is authored and there is no modal layer or persistence.
- **Toggle** is a native type=button with a stable label and aria-pressed. Label, icon with label and named icon-only variants are supported; icon-only commands use the shared Tooltip. Native Enter/Space activates it. Authored disabled state is preserved. No-JavaScript commands remain disabled rather than presenting an inert active button.
- **Toggle Group** is a named role=group containing Toggle buttons. Single mode permits zero or one pressed command; multiple mode permits any combination. Every available button is a normal Tab stop. This does not claim toolbar or radio-group keyboard behavior. Toggle commands do not submit form values or automatically reset; use Radio Group, Checkbox or Chip for form choices.
- **Combobox** is a local searchable single-select control. It enhances a native select into an editable input with listbox suggestions and manual commitment. Text remains visible, with optional decorative option icons. Native select remains the usable fallback without JavaScript.

Toggle emits bubbling `toggle:change` with `detail.pressed` and optional `detail.value`; groups emit `toggle-group:change` with `detail.values` after all states are applied. `setTogglePressed(button, boolean)` preserves single-group exclusivity and emits these events. Host code owns command effects and persistence. Documentation previews apply formatting/alignment to local sample text.

Combobox keeps focus on its input. Up/Down moves an active descendant among available matches, skipping disabled options. Enter or pointer selection commits. Escape, Tab or leaving the field discards a temporary query and restores the committed label. Standard text editing and composition are preserved. Optional controls expose Clear selection. Empty matches show a message with the listbox hidden; no unavailable synthetic option is created.

The native select owns the submitted name/value. After enhancement, the visible input owns required validity; the hidden select is no longer required. The unenhanced text input is disabled so it cannot interfere with fallback validation. Reset synchronizes after the native default action. Host code can assign the native select's value and dispatch change to synchronize the enhanced input. There is no remote data source, free-text submission or multiple selection.

Popup placement considers available space above/below and the host document's scroll padding. Keyboard highlighting scrolls the option list without moving the document. Overlays remain local and inherit preset/direction; hosts must allow overflow rather than clipping the popup. These patterns follow the [WAI-ARIA combobox guidance](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and [stable-label toggle guidance](https://www.w3.org/WAI/ARIA/apg/patterns/button/); this does not establish full accessibility certification.

## Verification

- Astro check: no errors, warnings or hints. Production build: 62 pages. Source/package suite: 29 tests passed, including toggle exclusivity, final event state, idempotent updates and native fallback markup.
- Isolated Chrome: independent disclosure state and Escape focus; all Toggle presentations; single/multiple groups; required combobox validity, filtering, empty results, keyboard/pointer commit, disabled-option skipping, Escape/Tab cancellation, optional clearing, reset and FormData.
- Component-preview axe states cover DMF, CB, HUI and Portfolio, DMF dark, mobile RTL and text enlarged to 200% of the site's default. Open combobox audits target the active control region because its popup intentionally covers later form controls. They do not claim a whole-page contrast audit while those controls are covered.
- Enlarged mobile testing checks both input and popup against the usable viewport. Screenshots are inspected alongside containment assertions.
- Shared icon-only Tooltip focus/Escape checks and forced-colors/reduced-motion emulation preserve command and selection behavior. Existing documentation, Create and search regressions pass without runtime or failed document/script/style requests.
- JavaScript-disabled checks cover native disclosure, safely disabled commands, native select required validity, FormData and reset.

Safari, Firefox, touch/virtual-keyboard and spoken screen-reader checks for this batch remain pending. This is an Astro-only addition. The portfolio repository is untouched.
