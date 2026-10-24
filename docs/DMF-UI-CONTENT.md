# Content primitives and contracts in 0.4.0

## Direction and boundaries

The owner selected Fulldev as the main component reference. This release preserves DMF's semantic neutral palette, primary action color, relative 14px documentation root and existing inherited fonts; CB uses its light reconstruction preset, bundled Nunito and #26ade4 primary. No alternate palette, font service, visual assets or motion dependency is introduced.

ENERGY 1 / RHYTHM 1 / MOTION 1: documentation is for inspecting components, so comparison and predictable hierarchy take priority. Existing page layouts remain. A live component preview is the focal point; usage and options follow. Neutral Card surfaces group related content with the small upstream shadow. Badge labels communicate actual example states in text. No decorative icons, gradients or repeated feature-card marketing sections are added. New links have specific destinations; static labels are not focusable controls.

UI UX Pro Max searches returned Astro slot-composition guidance and compact-label/contextual-announcement guidance. The first semantic-components Astro query had no match; a narrower slots query produced verified guidance. These recommendations supplement the owner's existing visual direction. Relative 14px root behavior follows the repository contract rather than the skill's generic 16px suggestion.

## Exports and authoring

- `dmf-ui/text`: Text with `as` (p/span/div/h1-h6), `size` (sm/default/lg/title), `tone` (default/muted) and `weight` (normal/medium/semibold). Defaults are p/default/default/normal. Visual size does not choose heading semantics. Slots preserve authored content and native attributes; no truncation or live region.
- `dmf-ui/card`: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent and CardFooter. Sizes default/sm. Root and title retain polymorphic `as`; both default to div. CardAction belongs in the header. Use an article/section and an appropriate heading when the content calls for them. Card has no click, selection, loading or disabled behavior; real child controls own actions.
- `dmf-ui/badge`: Badge and badgeVariants with default/secondary/destructive/outline/ghost/link variants. Default span is static. `as="a" href="..."` provides native navigation, focus and at least 44px targets. Variant link alone does not create link semantics. Compact labels stay on one line when space permits; long labels can grow and wrap instead of truncating or requiring hover-only recovery. Async announcements are host-owned and contextual.
- `dmf-ui/alert`: Alert, AlertTitle, AlertDescription and AlertAction. Default/destructive variants. Default role is note for persistent static content. Explicit native role=status or role=alert enables author-selected polite or urgent announcement semantics. Color does not choose urgency. Actions flow after content instead of overlapping it; no dismissal, timers, focus movement or request behavior is added.
- `dmf-ui/contracts.json`: Experimental, platform-neutral intent and state metadata for these four families. This is not a runtime renderer or a claim that native adapters exist. Other families retain their existing source/component-page contracts.

Shared rules: variant names describe appearance, `as` selects web semantics, states require actual state ownership, preset values stay in tokens, slots keep content authored and semantic native controls provide keyboard behavior. Future adapters can preserve intent while using platform-specific APIs.

## Reference provenance and adaptations

`docs/DMF-UI-UPSTREAM.json` records the exact registry URL, retrieval date and SHA-256 for Card, Badge, Alert and the Typography reference. Text adapts selected paragraph/lead/heading typography into a DMF-specific API; the full upstream Typography family and typeset stylesheet are not installed. Existing license notices already cover Fulldev, shadcn/ui and the shared dependencies.

Card removes overflow clipping to preserve content/focus, uses min-width-safe layout, container-aware header stacking and wrapping footers. Badge uses logical spacing, natural label growth, native-link targets and a foreground-colored focus outline; destructive text follows the existing Button contrast adaptation. Alert uses logical alignment, semantic borders, flowing actions and an opt-in live role. No new runtime dependency or controller is required.

## Integration and verification

SystemExamples composes ContentExamples under both presets, so the source gallery and portfolio `/ui/` and `/examples/dmf-ui/` consume the same implementation. The source catalog adds four pages (21 families total), and Docs adds the Component contracts guide (seven guides, 33 total pages). Create composes Text, Card, Badge and Alert with its existing controls.

`npm test` covers distribution, contract exports, catalog coverage and SSR semantics. `npm run test:dmf-ui:content` checks both preset examples, native link navigation, card spacing, contrast, long content, mobile RTL and enlarged text. This is also the eighth component-regression family in `npm run test:dmf-ui`. `npm run test:dmf-ui:docs` includes the four new documentation pages and Create composition.

Verification is scoped accurately: at normal text size the gallery page must fit the viewport. At 200% text, isolated copies of the actual rendered components load the built styles and must keep their content within viewport bounds and remain unclipped in LTR and RTL. The older gallery Tabs currently overflow at 200% text independently of these components; this is recorded follow-up, not a claim of whole-gallery text-resize conformance. Safari/Firefox and spoken VoiceOver/NVDA checks remain pending.

React, React Native, SwiftUI and WordPress adapters remain planned. This release adds Astro content primitives and shared intent metadata, not native rendering or public npm publication.
