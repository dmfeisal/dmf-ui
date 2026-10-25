# Feedback components

Added 2026-10-25. Core remains 0.4.0; React remains 0.1.0-alpha.3. These four components extend the Astro adapter only. No package publication or tag is part of this work.

- **Skeleton**: decorative line, rectangle and circle placeholders. The host owns the loading region, actual operation and replacement content. Optional pulse respects reduced motion.
- **Empty State**: visible title, description and optional decorative icon, with a slot for real recovery actions. Supports text-only and icon-with-text layouts; the explanation stays visible.
- **Progress**: named native progress, known or unknown completion, three track sizes and optional percentage caption. `setProgressValue` synchronizes the native value, caption and marker. Invalid values throw before changing state. The host owns meaningful status announcements and completion/error handling.
- **Loading Button**: label-only, icon-with-label and named icon-only presentations. Pending state disables the native button and exposes aria-busy. Both captions reserve their width. `setLoadingButtonState` restores the authored disabled state. The host owns the operation, failure handling and external feedback; there is no automatic timer or request.

Every component has a package subpath, root export, searchable catalog entry, usage example and live preview. Progress and Loading Button previews use deliberate manual controls and explicitly describe the illustrative state. They do not imply a saved draft or active upload. Icon-only Loading Button uses a native title; custom tooltip styling is not part of this component.

## Verification

Astro check: no errors, warnings or hints. Production build: 55 pages. Source/package suite: 25 tests passed, including invalid progress transitions and disabled-state restoration. Isolated Chrome verification covers native progress updates, unknown/reset/completed states, keyboard activation, all loading presentations, stable button widths, restored disabled state, four preset contexts, dark mode, mobile RTL at enlarged text, reduced motion and scoped axe audits. Search regression verifies indexing and real navigation.

Browser audits cover the component preview regions, not a full accessibility certification. Safari, Firefox and spoken screen-reader checks for this batch remain pending. No React counterparts are introduced. Existing portfolio files remain untouched.
