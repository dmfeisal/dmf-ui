# DMF UI React alpha

Private proof `0.1.0-alpha.3`, not published. Install the root repository dependencies, then run `npm ci` here and `npm test`. `npm run build` emits ESM, TypeScript declarations and third-party notices; `npm pack` builds before packing. Import components from `@dmf-ui/react` and styles from `@dmf-ui/react/styles.css` in a Tailwind v4 host. Supply a `.dmf-ui` ancestor and the same theme/preset attributes as the Astro foundation. The source is included for CSS class discovery, while runtime exports use compiled modules.

A separate Vite consumer installs packed archives and verifies production assets, TypeScript, native ESM imports, refs, simulated keyboard input and controlled forms. Run `npm run test:dmf-ui:react-consumer` from the root. The optional `test:dmf-ui:react-browser` command reviews its retained production build in Ego Browser. Chromium keyboard/touch, preset/theme, font, focus, mobile/RTL, 200% text and contrast checks pass; Safari desktop/narrow-frame checks passed for the earlier five-component scope. The expanded Badge/Alert fixture passes Chromium; Firefox and spoken screen-reader checks remain pending. Alpha.3 strengthens Input and Switch boundaries using existing semantic colors and provides explicit native-input focus. The core dependency currently brings its full Astro/Data Slot dependency graph; the React runtime does not initialize those controllers.

The current seven component families are Button, Text, Input, Switch, Card, Badge and Alert. Alert also exports AlertTitle, AlertDescription and AlertAction.

Button uses the shared Fulldev-based variant definition. Text preserves author-selected heading semantics; Card is a non-interactive content container. Input forwards native React input props and refs. Switch is a labeled native checkbox with `role="switch"`; use `checked` plus `onChange` for controlled state, or `defaultChecked` for native uncontrolled state. Do not switch between those modes. Native required/disabled/name/value/form/reset behavior applies. Switch read-only behavior, unchecked-value submission, compact sizes and Astro controller attributes are not exposed.

The component package does not import React DOM or create roots. Hosts own rendering, hydration, controlled form reset and unmount. The source documentation proof uses Strict Mode, server rendering, hydration and an explicit unmount action. It sends no requests and disables its form until hydrated. Card subcomponents, overlays and other families are outside this proof.

React Native and SwiftUI cannot consume this CSS or browser implementation. `@dmf-ui/react/notices` includes core attribution and the bundled clsx license. React dependency licensing remains in the installed React distribution.

## Badge and Alert

Badge defaults to a static `span`. Set `as="a"` and a required `href` for native navigation; anchor refs and native link props are supported. Variants: default, secondary, destructive, outline, ghost and link. Text supplies the status meaning; badges do not announce changes automatically. Button rendering is not exposed.

Alert defaults to a static `div` with `role="note"`. Authors may explicitly choose `role="status"` or `role="alert"`; there is no automatic live region, focus transfer, dismissal or timer. AlertTitle, AlertDescription and AlertAction are native div containers with refs. Authors supply heading semantics inside the title, connect labels/descriptions with native attributes, and provide real links/buttons inside the action area. Variants: default and destructive.

```tsx
<Alert aria-labelledby="preview-title">
  <AlertTitle id="preview-title">Local preview</AlertTitle>
  <AlertDescription>Values stay on this page.</AlertDescription>
  <AlertAction>
    <Badge as="a" href="#preferences" variant="link">Review preferences</Badge>
  </AlertAction>
</Alert>
```

The expanded packed fixture checks typed link/ref contracts, static versus opt-in announcement semantics, independent-root IDs, all content refs and cleanup, and both-preset SSR hydration. The original three adapter tests are now four; packed acceptance is now five tests. The alpha version remains unchanged during this unpublished local iteration.
