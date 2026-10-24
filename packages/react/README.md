# DMF UI React alpha

Private proof `0.1.0-alpha.2`, not published. Install the root repository dependencies, then run `npm ci` here and `npm test`. `npm run build` emits ESM, TypeScript declarations and third-party notices; `npm pack` builds before packing. Import components from `@dmf-ui/react` and styles from `@dmf-ui/react/styles.css` in a Tailwind v4 host. Supply a `.dmf-ui` ancestor and the same theme/preset attributes as the Astro foundation. The source is included for CSS class discovery, while runtime exports use compiled modules.

A separate Vite consumer installs packed archives and verifies production assets, TypeScript, native ESM imports, refs, simulated keyboard input and controlled forms. Run `npm run test:dmf-ui:react-consumer` from the root. Browser visual and assistive-technology checks remain pending. The core dependency currently brings its full Astro/Data Slot dependency graph; the React runtime does not initialize those controllers.

Button uses the shared Fulldev-based variant definition. Text preserves author-selected heading semantics; Card is a non-interactive content container. Input forwards native React input props and refs. Switch is a labeled native checkbox with `role="switch"`; use `checked` plus `onChange` for controlled state, or `defaultChecked` for native uncontrolled state. Do not switch between those modes. Native required/disabled/name/value/form/reset behavior applies. Switch read-only behavior, unchecked-value submission, compact sizes and Astro controller attributes are not exposed.

The component package does not import React DOM or create roots. Hosts own rendering, hydration, controlled form reset and unmount. The source documentation proof uses Strict Mode, server rendering, hydration and an explicit unmount action. It sends no requests and disables its form until hydrated. Card subcomponents, overlays and other families are outside this proof.

React Native and SwiftUI cannot consume this CSS or browser implementation. `@dmf-ui/react/notices` includes core attribution and the bundled clsx license. React dependency licensing remains in the installed React distribution.
