# M6.3 stage: OTPVerificationBlock

30 October 2026. Implemented locally on main following commit `6c15caf1a07cf509efc0be1e8131528cf3f432b0`. Versions remain private core `0.4.0` and React `0.1.0-alpha.3`; dependencies, presets and existing authentication APIs remain unchanged.

## Architecture and security boundaries

`OTPVerificationBlock` is a native verification composition in Astro and React, exported from `dmf-ui/blocks` (and core barrel) and `@dmf-ui/react`. It composes Card, Field, Input, LoadingButton, Button and Alert.

- **Native text semantics with numeric input mode**: The block composes the existing `Input` as a single text field with `inputmode="numeric"`, `autocomplete="one-time-code"`, `autocapitalize="none"`, `spellcheck={false}`, `dir="ltr"` and `pattern="[0-9]{length}"`.
- **Deliberate rejection of digit-cell fragmentation**: Single native input preserves whole-code paste, selection, clipboard managers, native autofill, screen reader announcement and keyboard navigation without fragile multi-input focus hacks.
- **Sibling forms**: The verification action and optional resend action are structured as sibling `<form>` elements to prevent illegal nested form markup. Both use native `POST` methods with independent action endpoints and extension slots (`fields` and `resend-fields` / `resendFields`).
- **Host-gated challenge states**: `challengeState` defaults to `'unverified'`. Only `'ready'` exposes the code field and submit control. `'locked'` and `'expired'` present host copy and status messaging. The host owns challenge issuance, delivery, code validity, attempt limits, cooldowns and expiry. The UI never generates, validates or stores verification codes.

## Source and exports

- Astro block: `src/components/dmf-ui/blocks/otp-verification.astro`
- React block: `packages/react/src/blocks/otp-verification.tsx`
- Documentation and previews: `src/components/docs/OTPVerificationDocumentation.astro`, `src/components/docs/OTPVerificationPreview.astro`
- Canonical route: `/blocks/otp-verification/`
- Authentication journey: `/examples/authentication/`
- Tests: `tests/otp-verification.test.mjs`, `tests/fixtures/react-consumer/tests/otp.test.mjs`, `tests/fixtures/blocks-consumer/src/pages/otp.astro`

## Verification

| Check | Result |
| --- | --- |
| Tokens, foundations, upstream provenance and contracts | Pass |
| Astro type check | 616 files; zero errors, warnings or hints |
| Static documentation build | 131 pages |
| Root test suite | Blocks and OTP unit tests pass |
| React adapter suite | 7/7 tests pass |
