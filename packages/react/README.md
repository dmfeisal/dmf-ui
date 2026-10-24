# DMF UI React alpha

Private proof `0.1.0-alpha.1`, not published. Install the root repository dependencies, then run `npm ci` here and `npm test`. Import components from this package's source exports and styles from `./styles.css` in a Tailwind v4 build. Supply a `.dmf-ui` ancestor; use the same theme/preset attributes as the Astro foundation. Standalone consumption outside this repository has not been verified.

Button uses the shared Fulldev-based variant definition. Text preserves author-selected heading semantics; Card is a non-interactive content container. Input forwards native React input props and refs. Switch is a labeled native checkbox with `role="switch"`; use `checked` plus `onChange` for controlled state, or `defaultChecked` for native uncontrolled state. Do not switch between those modes. Native required/disabled/name/value/form/reset behavior applies. Switch read-only behavior, unchecked-value submission, compact sizes and Astro controller attributes are deliberately not exposed in this alpha.

The component package does not import React DOM or create roots. Hosts own rendering, hydration, controlled form reset and unmount. The proof host uses Strict Mode, server rendering, hydration and an explicit unmount action. It sends no requests and disables its form until hydrated. Card subcomponents, overlays and other families are outside this proof.

React Native and SwiftUI cannot consume this CSS or browser implementation. Core notices in `../../public/dmf-ui-notices.txt` remain applicable. React dependency licensing is retained through the installed dependency distribution.
