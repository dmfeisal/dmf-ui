# Sheet and Alert Dialog

Added 26 October 2026 to the Astro adapter. Core remains 0.4.0 and React remains 0.1.0-alpha.3. The preceding form-composition work is preserved in the working tree. No package or release tag is published.

## Shared modal behavior

Both components use the existing pinned @data-slot/dialog 1.1.2 controller for portalling, focus trapping, Escape, scroll locking, state events and focus return. New wrappers keep inactive triggers disabled until enhancement and avoid dangling controls references for closed content.

An additional wrapper-owned isolation layer marks background content inert and hidden from assistive technology while a new modal is open. It preserves original attributes, follows the topmost new modal, restores the parent after nested dismissal, and restores the page on teardown. This is exercised through teardown/reinitialization and restoration of authored inert/ARIA state. Associated floating portals are recognized through the public @data-slot/core containsWithPortals helper. Core 1.1.2 was already a runtime dependency of Dialog and is now declared directly; no upstream version changes.

This isolation enhancement is scoped to the new Sheet and Alert Dialog wrappers. The existing Dialog component is unchanged. Cross-component modal/floating-control combinations require their own integration verification.

## Sheet

`dmf-ui/sheet` exports Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose and setSheetOpen.

SheetContent supports inline-start, inline-end, top and bottom. Inline edges mirror in RTL. Panels use bounded scrolling and small entrance motion; reduced motion removes the new entrance animation. The panel is modal, with a visible close control by default. It is distinct from the nonmodal Sidebar and Responsive Navigation components.

One trigger/content belongs to each root. Titles/descriptions remain authored; the controller links them. Focus defaults to the first appropriate focusable control. Use autofocus on a suitable field or a focusable title for long content. The docs use an explicitly focused draft field and a nested panel example. Changes stay in local input nodes; there is no save operation or persistence.

Outside clicks dismiss by default and may be disabled through closeOnClickOutside=false. Escape and close controls return focus to the invoking trigger. setSheetOpen(root, boolean) requests open/close through the existing dialog:set event API.

## Alert Dialog

`dmf-ui/alert-dialog` exports AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction and setAlertDialogOpen.

The controller exposes role=alertdialog, aria-modal and associated visible title/message. Cancel receives autofocus. Backdrop clicks do not dismiss; Escape or Cancel dismisses without performing the confirm action. The trigger receives focus after dismissal.

Action is a native type=button and does not auto-close. Host code owns the operation, pending/error feedback and the decision to close after success. A handler that does not complete leaves the modal open. The docs demonstrate resetting local sample text only; no files or saved data are deleted.

Both trigger families support label-only, icon with label and named icon-only versions. Icon-only triggers have native titles. Slot content may include decorative icons alongside readable Cancel/Action labels. These confirmation prompts should be reserved for decisions that warrant an interruption; persistent nonmodal feedback belongs in Alert.

The semantic and focus choices follow [WAI-ARIA modal-dialog guidance](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and [alert-dialog guidance](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/), without claiming full accessibility certification.

## Verification

Astro check: zero errors, warnings or hints. Production build: 67 pages. Source/package suite: 33 tests passed, including state-event requests, safe trigger markup, cancellation and nonclosing confirm-action contracts. The isolated packed-consumer lock was regenerated for the explicit core dependency; its locked installation, production build and eight consumer tests pass. No dependency versions changed.

Isolated Chrome checks cover all four sheet edges, three trigger presentations, initial focus, forward/backward focus containment, close/Escape/backdrop behavior, nested parent restoration and inert background. Alert Dialog checks cover role/labels, Cancel autofocus, blocked backdrop dismissal, cancellation without changes, an action without host completion, explicit local completion and trigger focus return.

Preset-aware portal checks cover DMF, CB, Horego and Portfolio; dark mode, enlarged mobile RTL, reduced motion and forced colors are exercised. Twenty-two modal-open and closed page states are audited with axe with zero violations. Ten contrast-overlap review nodes were recorded; the minimum independently measured ratio was 4.74:1. Contrast-overlap incompletes on description text are recorded separately, with independently computed foreground/opaque-background ratios of at least 4.5:1 and screenshot review. These are manual-review findings, not a claim of zero incomplete results. All other incompletes and all violations fail the scenario. Native no-JavaScript checks confirm disabled modal triggers, hidden content and ordinary page editing/navigation. No-JavaScript hosts must provide any essential fallback outside the hidden modal.

Existing form composition, selection, documentation, Create and search flows are regression checked. Browser verification uses isolated Chrome; Safari, Firefox, touch/virtual keyboards and spoken screen-reader checks remain pending. No React counterpart or portfolio repository changes are included.
