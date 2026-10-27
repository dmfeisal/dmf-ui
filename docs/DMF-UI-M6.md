# M6.1: Authentication Blocks expansion

27 October 2026. Local implementation based on `main` at `10e813c3f059b65caed02ad4d5669972e2f2b70c`. The initial checkout was clean and aligned with the intended M5 checkpoint. This milestone remains uncommitted and unpushed; no tags, publication, deployment or portfolio edits are included. Core remains `0.4.0`; React remains `0.1.0-alpha.3`. Dependencies are unchanged.

## M5 production closure

[Production acceptance](DMF-UI-M5-PRODUCTION-ACCEPTANCE.md) records the independent public HTTP checks and Netlify Ready deployment `6ae036f85a2eca340fbedcea` at the exact M5 SHA. Both legacy MerchantCard URLs return 301 to the canonical component, which returns 200. The sampled fingerprinted CSS has one-year immutable caching; sampled HTML revalidates. Canonical/Open Graph paths and a query-bearing discovery URL are correct. The original [M5 local report](DMF-UI-M5.md) remains intact with a follow-up link.

Production configuration acceptance passes for the recorded samples. Manual browser/device/spoken-AT gaps and owner contrast exceptions remain explicit, rather than blocking unrelated local work or becoming implied compliance.

## Architecture and API assessment

SignInBlock supplies the existing convention: a native POST form with required unique id and host action, derived title/description/field/error IDs, uncontrolled inputs, authored state and composition extensions. M6 reuses these conventions and primitives directly. SignInBlock itself is unchanged; no generic authentication engine or transport abstraction was introduced.

- `SignUpBlock` exists in Astro and React. It composes Card, Field/Label/Error/Description, Input, Alert and existing submit primitives. Password and optional confirmation use `new-password`; email uses `email`. Confirmation is opt-in, required only when included, and has its own name/error relation. Additional fields, footer content, Sign In and terms links are optional. Matching, password policy and consent remain host decisions. Password initialization is not a supported prop, and no password value is emitted into SSR inputs.
- `PasswordRecoveryBlock` exists in both adapters and requests recovery only. It provides native email entry, error/pending/disabled/submit-disabled states and generic configurable instructions through `complete`/`completionMessage`. It knows nothing about account existence, email delivery, credentials, sessions or reset tokens. Completion replaces the input group. The persistent status paragraph has the stable `id-completion` identity; the host moves focus there after an explicit asynchronous transition removes the initiating control. Initial server-rendered content does not autofocus.
- Both retain required POST destinations, including when a React `onSubmit` handler enhances submission. Native form refs/events/attributes are available. Astro fields/footer/default slots correspond to React fields/footer/children. `email` supplies native initial/reset values. Capture values before setting pending, since disabled controls are excluded from FormData.
- All headings, labels, help, pending text, field errors, error headings and completion copy are host-configurable. Give repeated forms distinct descriptive titles as well as unique IDs so named landmarks remain distinguishable. Extension controls need their own labels and IDs; nested forms are unsupported.

Hosts own secure endpoints, CSRF protection, rate limits, server validation, registration, password/confirmation policy, sessions, account-enumeration policy and focus after application feedback. The library never reads, logs or persists credentials. Native required/type validation is not an account-security decision. Native POST requires a real host endpoint; test servers intentionally reject writes and no authentication service was exercised.

## Source, exports and metadata

New source files:

- `src/components/dmf-ui/blocks/sign-up.astro`
- `src/components/dmf-ui/blocks/password-recovery.astro`
- `packages/react/src/blocks/sign-up.tsx`
- `packages/react/src/blocks/password-recovery.tsx`

Core Blocks/root exports and the React root exports add both names and React prop types. Existing exports, including MerchantCard compatibility aliases, remain available. The Blocks registry and contract generator produce the new API/default/slot/support records; generated inventory is not edited by hand. Counts remain source-derived: 80 Astro families, six Astro Blocks, 15 React families, six React Blocks and 42 named React exports. All remain experimental; no Stable promotion or native adapter is implied.

Shared Block CSS uses semantic roles, logical sizing and the existing focused 28rem form bound. New submit labels and documentation demonstration controls wrap naturally in narrow/enlarged layouts. New React pending indicators stay in flex layout instead of overlapping long wrapped labels; this is scoped to the two new Blocks, preserving existing SignInBlock styling. No blanket 44px minimum, new brand token or theme engine was added. Header tools remain unchanged at 32px.

## Documentation, example and Template evaluation

Canonical routes `/blocks/sign-up/` and `/blocks/password-recovery/` provide live previews, real Astro/React exports, generated Props/defaults, dependencies, extension points, server error/pending/completion specimens, accessibility and ownership limits. Static specimen forms use distinct contextual titles after axe identified duplicate landmark names. Shared CodeSnippet compositions remain in use.

`/examples/authentication/` composes SignInBlock, SignUpBlock and PasswordRecoveryBlock with native links and safe local pending/error/reset/completion demonstrations. Enhancement guards submission before readiness. No account is created, email sent or credential inspected. Reset/finish clears entered password fields. The host demonstration explicitly owns completion focus. `/docs/authentication/` documents the workflow, state/security boundaries and next-step separation. Examples, Blocks support panels, global search, architecture and implementation guidance cross-link the actual routes.

The centered example validates ordinary page composition around existing form bounds. A public `AuthCenteredTemplate` is not ready: there is one journey inside the documentation shell, without independent evidence for a reusable logo, form, supporting-content and footer API. Keep those as host composition until another concrete page validates reuse, heading/focus behavior and responsive responsibilities. No public Template export, package or registry was introduced.

## Verification and resource safeguards

- Token/foundation/provenance/generated-contract prechecks and Astro type checks pass: 600 files, zero errors, warnings or hints.
- The static build produces 129 pages. All 55 root tests pass, including generated support, actual new documentation/API markup, password SSR boundaries, canonical paths, and built local links/fragments.
- Existing adapter unit/DOM suite: seven passing tests.
- Separate packed Astro consumer passes public imports, native POST/GET markup, error relations, optional confirmation, extension slots, independent instances and absent password values. Browser checks exercise native required-field focus and reset with scripts disabled; no write request is sent.
- Guarded isolated packed React consumer: 34 passing tests. New cases cover SSR/localizable feedback, real declarations/types, optional confirmation, IDs, hydration identity, native validation, independent pending states, field/form errors, native reset, refs and unmount cleanup, recovery completion focus and pre-hydration guards. Existing SignIn, SearchFilters/discovery and content/Block lifecycle regressions remain included.
- The 28 new scoped Chromium documentation audits cover DMF light/dark; CB, HUI and QDI light; Portfolio light/dark/yellow; server-rendered errors/pending/completion; 1280/820/390px layouts, standard RTL and separate 200% long-copy states; mobile touch/native validation; keyboard focus/order; reduced motion; generic completion/focus and no-JavaScript guards. Search finds both new Blocks, the guide and example.
- The 19 packed Chromium audit states exercise both new React Blocks with the real installed package and the separate Astro consumer, including host pending/error/reset, completion focus, presets, responsive RTL/enlarged layout and no-JavaScript forms. React reduced-motion and Astro recovery-required focus are checked separately. The existing SignInBlock/SearchFiltersBlock source browser suite also passes its 20 audit states, native keyboard/reset/pending/independence and no-JavaScript regression checks. Across these scoped audit reports there are no unexpected violations or incomplete results; owner-primary contrast exceptions remain raw findings.

One initial build exceeded the 1GiB process-tree RSS gate and was stopped by the watchdog; it was not allowed to continue or overlap a retry. The default build now uses a 384MiB old-space cap and 8MiB semi-spaces. A subsequent sampled default build peaked around 926MiB and passed the same gate. Type/build/consumer/browser verification runs serially with external deadlines and bounded output. React consumers retain their existing exclusive lock and per-step RSS limits; DOM assertions use bounded diagnostics/boolean identity rather than cyclic React object diffs. These safeguards are not a guarantee against every future memory regression.

## Accessibility and remaining acceptance

CB/HUI filled primary labels remain white on unchanged brand fills by explicit owner preference. Their approximately 2.57:1/4.29:1 normal-text exceptions, including affected hover behavior, remain recorded findings. They are not WCAG AA passes. New axe helpers retain raw violations and permit only those known primary-submit/preset combinations; unrelated findings and incomplete scans fail. Input colors are measured after finite appearance transitions settle, rather than waiving transitional incompletes. A long-copy test must update the visible label and accessible name together.

Geometry checks compare pending-spinner bounds against actual text-line ranges at 200% text in both LTR and RTL. Layout errors found during verification were corrected: long demonstration buttons wrap, new page titles use the existing long-title treatment, and multiple static form examples have distinguishable landmark names. Standard RTL and text enlargement are separate states; RTL does not enlarge the default UI.

Firefox, Safari, physical devices/virtual keyboards, real password-manager integration and spoken screen readers remain unverified for these new Blocks. Browser/DOM evidence establishes the recorded semantics and interactions only. No WCAG conformance, authentication security, email delivery, real endpoint or native-platform acceptance claim is made.

## Prioritized M6.2 work

1. Recheck the new Blocks in Safari/Firefox, real password managers, mobile/tablet devices and spoken AT; verify host-specific submission/focus behavior before adoption.
2. Implement a separate ResetPasswordBlock only after defining the host-validated recovery-credential boundary, new-password/confirmation semantics, expiry and recovery navigation.
3. Review OTP entry requirements before adding an OTP primitive and OTPVerificationBlock: native autofill/input modes, paste, error announcement, focus, retry/resend ownership and expiry policy need a concrete contract first.
4. Extract AuthCenteredTemplate only after a second concrete auth page validates its logo/form/support/footer responsibilities. Keep workflow Patterns distinct from a page shell and from authentication services.

No M7/M8/dashboard/POS expansion is part of this milestone. No commit, push, tag, publication or deployment is authorized by this implementation request.

## Final repository and artifact status

Final HEAD and inspected origin/main remain `10e813c3f059b65caed02ad4d5669972e2f2b70c` on main; M6 source, documentation and tests remain uncommitted. Whitespace checks pass. No exact-commit hosted CI is claimed for these local changes.

Ignored audit JSON and reviewed screenshots remain in `.dmf-ui-test-results/`; bounded logs are in `/tmp/dmf-m6-*`. Temporary consumer checkouts created for browser verification were removed where recorded by this run. Browser suites completed successfully; the owned browser space was already unavailable when cleanup attempted to close it, and no replacement or unrelated browser was opened.
