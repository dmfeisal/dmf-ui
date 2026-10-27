# M6.2 first stage: ResetPasswordBlock

27 October 2026. Implemented locally on main from `a348d065861cefb30334ba6d8dc788ce44df20a9`. Versions remain private core `0.4.0` and React `0.1.0-alpha.3`; dependencies, presets and existing authentication APIs remain unchanged. No commit, push, tag, package publication, manual deployment or portfolio edit is included.

## Baseline CI and production acceptance

The exact starting commit passed both [Source / Node 22](https://github.com/dmfeisal/dmf-ui/actions/runs/40485811970/job/122127186197) and [Source / Node 24](https://github.com/dmfeisal/dmf-ui/actions/runs/40485811970/job/122127185993). The connector's combined commit status omitted Actions checks, so the actual check-run API was inspected separately.

Netlify's current Ready deployment `6ae07776df2914b1bec651aa` reports that exact SHA, published at `2026-10-27T10:06:03.751Z`. Production `/blocks/sign-up/`, `/blocks/password-recovery/`, `/examples/authentication/` and `/docs/authentication/` return 200 with correct canonical paths. The production journey's guarded previews initialize, its Create Account link navigates locally and its local error demonstration works. No credentials were entered or submitted in production. These observations concern the deployed M6 checkpoint, not the new uncommitted ResetPasswordBlock.

## API and security boundary

`ResetPasswordBlock` is a native POST composition in Astro and React, exported from `dmf-ui/blocks` (and the existing core barrel) and `@dmf-ui/react`. It reuses Card, Field, Input, Alert and the established submit primitives. React prop types are exported with the Block. It does not implement an authentication service, credential validator, password policy, storage or session controller.

`credentialState` defaults to `unverified`. Only `ready` renders password and extension fields. `invalid` and `expired` render localizable instructions and optional host recovery navigation. `complete` omits the input group and shows host-authored instructions. The host must validate the recovery credential before rendering ready and must revalidate authorization, expiry, binding and single-use on every POST. A client-editable UI flag is not a security boundary. No token, account identifier or initial-password prop is introduced.

Required id/action, heading/copy, password field name/help, optional confirmation, per-field errors, form errors, pending, disabled, submitDisabled and extension conventions follow SignInBlock/SignUpBlock. Confirmation is opt-in and uses its own required field when included; equality and password strength are host decisions. Both password fields use new-password autocomplete and never render initial values. Native reset clears the password fields; it does not change host-owned credentialState, complete or error props. React forwards the native form ref/events and keeps fields uncontrolled. Astro fields/footer/default slots correspond to React fields/footer/children. Real endpoints, CSRF, transport and completion decisions belong to the host.

A persistent `id-status` paragraph is available for host focus after an explicit expiry/invalid/completion transition removes the initiating control. It does not autofocus initial server-rendered content. The React specimen demonstrates this focus policy and clears fields by removing the ready group; returning to ready does not restore previously entered passwords.

## Documentation and composition

- Canonical `/blocks/reset-password/` uses shared support metadata, generated API/defaults, Astro/React examples and server-rendered unverified/invalid/expired/error/pending/completion specimens with distinct form landmark names.
- Blocks index and global search are fed by the existing registry/generator. Inventory is now 80 Astro families, seven Astro Blocks, 15 React families, seven React Blocks and 43 runtime exports. All remain experimental.
- The authentication journey links to an explicitly illustrative ready reset form. It says that no recovery credential was validated; local submission is guarded before enhancement and intercepted afterward. No password is changed, read or stored by the demonstration. Finish/reset clears entered values.
- The authentication pattern and architecture guidance explain the host-validation boundary and the separate recovery-request/reset steps. Source-owned CodeSnippet compositions are retained.
- Existing 28rem form bounds, logical spacing, wrapping, natural sizing and Nova/Neutral defaults are reused. Existing primary fills and owner-selected white CB/HUI labels remain unchanged. No blanket 44px sizing rule or public Template API is added.

## Verification

All checks ran serially with the existing bounded-process helpers; React consumer runs retain the exclusive lock, per-step RSS/deadline limits and bounded DOM assertion diagnostics. The existing 384MiB build heap/8MiB semi-space settings are retained.

| Check | Result |
| --- | --- |
| Tokens, foundations, upstream provenance and generated contracts | Pass |
| Astro/type checks | 607 files; zero errors, warnings or hints |
| Static build | 130 site pages |
| Root tests | 56 pass, including built local links/fragments, source support and reset metadata/password boundaries |
| Separate packed Astro consumer | Pass; five pages including native reset, custom field names, slots, help/error relations and absent password values |
| Guarded packed React consumer | 37 pass, including existing sign-in/sign-up/recovery/discovery regressions |
| Reset documentation browser suite | 13 scoped audit states plus touch/native validation, pending/reset, search and no-JavaScript guards |
| Packed Reset browser suite | 19 audit states plus native validation, expiry/completion focus, independent disabled instance, reset/ref behavior and no-JavaScript source forms |

New consumer tests cover omission of extension/password fields until ready, localized expired copy, optional confirmation, unsupported credential states, distinct field names, native values, hydration identity, host errors, reset, state-transition removal and native ref cleanup. Actual types reject token and initial-password props. Browser coverage includes DMF light/dark; CB/HUI/QDI light; Portfolio light/dark/yellow; 1280/820/390px; standard RTL and separate 200% text; reduced motion; and long pending labels in both directions. Geometry assertions compare spinner bounds with actual text-line ranges.

No unexpected axe violations or incomplete scans occur in the recorded Reset reports. CB/HUI filled-primary normal-text contrast findings remain explicit owner exceptions, approximately 2.57:1 and 4.29:1; they are not AA passes. Helpers permit only the documented primary-submit/preset combinations and retain raw findings. No brand color or label was changed to hide those exceptions.

The React browser monitor captures runtime/console failures for the exercised specimen. Native no-JavaScript Astro checks verify required-password/confirmation focus, POST action, extension values, inactive-state omission and reset. Read-only fixture servers received no write requests; this does not establish real endpoint or token-service integration.

## Remaining acceptance and next work

Safari, Firefox, spoken screen readers, physical devices/virtual keyboards and real password-manager integration remain unverified for ResetPasswordBlock. Autocomplete/label/error semantics, DOM focus and Chromium emulation do not establish those manual results or WCAG conformance. Real host endpoint authorization, expiry/single-use policy and secure credential handling must be tested by the integrating application. New local changes have no exact-commit hosted CI result until separately authorized for commit/push.

Next review OTP entry semantics before implementing an OTP primitive/OTPVerificationBlock. Validate autofill, paste, input modes, error/status focus, retry/resend and expiry ownership with a concrete host flow. AuthCenteredTemplate remains a later extraction: several documentation specimens inside one shell do not validate a reusable public logo/form/support/footer API.

Final review: branch main and HEAD remain at the starting `a348d06` checkpoint with local changes only. Reviewed the enlarged pending screenshot and retained ignored audit artifacts. Temporary consumer checkouts were cleaned up after successful verification.
