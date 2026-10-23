# DMF UI cross-platform direction

Recorded 23 October 2026 following the owner’s request.

## Accepted direction

Maintain one DMF design system with separate implementations for Astro, React web, React Native and native iOS using SwiftUI. Keep Fulldev as the existing web foundation. React, React Native and SwiftUI are planned, not currently supported adapters. WordPress remains a future web integration.

Share portable design tokens, semantic names, brand presets, component variants, states and behavior specifications. Keep rendering, interaction, accessibility and lifecycle code platform-specific. Do not attempt to reuse Astro components, browser DOM behavior or CSS directly as native components.

Use interoperable design-token JSON as the eventual canonical source, generating web CSS variables, React Native values and Swift definitions. Migrate existing values without visual changes; preserve CB UI primary `#26ade4`. Keep platform mappings explicit for units, fonts, shadows and accessibility scaling.

## Delivery order

The 0.3.0 milestone establishes typed token JSON, deterministic web CSS and resolved data exports. It preserves existing web behavior; no native code generator or component adapter is included. See [token authoring](DMF-UI-TOKENS.md).

1. Stabilize the Astro library and documentation.
2. Extract portable tokens and document component contracts while preserving existing web output.
3. Implement React web with shared web styling and React-owned behavior.
4. Prove React Native with Button, Text, Input, Switch and Card.
5. Prove SwiftUI with the same five components.
6. Expand adapters according to actual application needs.

Keep compatible variant/state names where useful, while respecting each platform’s conventions, native controls, touch targets, Dynamic Type and assistive technology. Verify each adapter independently; web test results do not establish native accessibility.

A future repository layout may separate tokens, contracts, web assets and platform adapters, with a Swift package for iOS. This is a direction, not an authorization to introduce new tooling, dependencies, packages or restructure working code now.

## References

- [Design Tokens Community Group format](https://www.designtokens.org/tr/2025.10/)
- [React Native platform-specific code](https://reactnative.dev/docs/platform-specific-code.html)
- [Apple SwiftUI documentation](https://developer.apple.com/documentation/swiftui/)
