# MerchantCard reference implementation

27 October 2026. Core 0.4.0 and React 0.1.0-alpha.3 remain unchanged. No dependency, lockfile, portfolio, publication, tag or deployment change.

## Source and mapping

Owner-selected [Figma node 1:597](https://www.figma.com/design/M9PisJq2AJbRpgMbzxyvmO?node-id=1-597). Figma design context, node geometry, screenshot and image fill properties were inspected read-only. Code Connect mappings were unavailable for the connected seat; no Figma file was modified.

The 328px reference has a 108.67px three-photo strip, 1px dividers, 104px footer, 16px outside corners, 12px inset, Inter 16px/600 title and 12px details, with a 58×40px review badge. Photos use the source centered FILL mapping. Original SVG roots remain 16×16, 12×12, 12×12 and 14.1177×14.1177; no path or color edits. Card and Text are shared components. The one-star, two-row rating is a local read-only composition because the existing multi-star Rating API does not express that anatomy.

Nova/Neutral remains the default. HUI mappings are scoped to MerchantCard. Source hours text #1B998B on white measures about 3.51:1; derived text #14796E measures about 5.26:1. The original clock SVG is retained. This text adaptation is documented rather than presented as an official palette value. Existing owner-selected white CB/HUI primary-label exceptions remain unchanged.

Long titles wrap; full address content remains in the DOM/title with visual ellipsis. Long localized review counts can expand the badge. These resilience choices avoid fixed-height clipping. RTL changes logical direction only; enlarged text is tested separately.

## Distribution and ownership

MerchantCard is exported through dmf-ui/blocks and @dmf-ui/react. Public assets are available from dmf-ui/assets/merchant-card/*; reference photos from dmf-ui/assets/examples/merchant-card/*. Hosts import/copy local URLs and supply them to the component. This keeps SSR and client URLs stable without runtime Figma dependencies. Photos are required data, never a library default. MerchantListingBlock renders the card through its existing item callback.

One native title link covers the card, with visible keyboard focus. Verification, price and rating are read-only accessible summaries. No nested controls, invented merchant data, business-hours calculation, image provider, favorites, navigation service or review action is added. Hosts own destinations, heading context, localized labels, photo alternatives and image error/replacement policy. Empty photos have a textual fallback; broken URLs retain native browser image behavior. Reference business text and numbers are authored design content, not verified live facts.

## Verification

- Astro check: 555 files, no errors/warnings/hints. Production documentation: 119 pages.
- Repository: 42 tests; React adapter: seven tests; locked packed React consumer: 23 tests. Separate packed Astro app builds four routes with public imports and assets. No sibling source aliases or fixture lock regeneration.
- Both browser adapters measure 328×212.664px, a 108.664px photo strip and 104px footer. Intrinsic icon dimensions and square cover image boxes match. Reference screenshots were visually compared with the supplied node.
- Ten strict axe states pass with no violations or incomplete rules: React reference, eight preset/direction/text-size combinations and Astro reference. HUI light and Neutral dark, 390px LTR/RTL, normal and separate 200% root text remain contained. Native link activation, one tab stop per card, visible focus and links without JavaScript pass. Packed tests verify SSR hydration node preservation, zero/optional data, invalid inputs and exact installed asset bytes.
- Built documentation checks pass for HUI switching, light-only mode, loaded local imagery, shared source code and the native card destination. The scoped delivery review passes for reference geometry, asset reuse, natural sizing, responsive containment and keyboard behavior.
- Browser evidence is local Chromium only. Safari/Firefox, physical device, spoken-reader and live business acceptance remain untested. No accessibility certification is claimed.

Local ignored evidence: .dmf-ui-test-results/react/card-audit.json, card-geometry.json and card screenshots.

## Original asset SHA-256

| Asset | SHA-256 |
| --- | --- |
| src/assets/merchant-card/distance.svg | `b3e6c02ef6444a6786ef777bc127de0d0fcf315acfc911ed06de3cdde80db13d` |
| src/assets/merchant-card/verified.svg | `1a93cd51a07f56ff4af11966cc387b41643d450d9744e587b8a9c5a70f2b7fce` |
| src/assets/merchant-card/hours.svg | `4d483aea7c18651f43f0c0d609329e4f6eeb510853287776933acdc0a499906f` |
| src/assets/merchant-card/star.svg | `5daca7df93dc0468831908e47a66933678b287ba4d3ea7f6f02fbf3a692414e7` |
| src/assets/examples/merchant-card/photo-3.png | `834a27a316f994cddc3cca5b4771b3fc56ab7c22eb4fa6405aaab708f7dfbb77` |
| src/assets/examples/merchant-card/photo-2.png | `2d82f292adec50e0f6066f429d1a4820c12baf826a81798adaefb16a43bb686e` |
| src/assets/examples/merchant-card/photo-1.png | `1c3cd85b2b8f934b3e6d338136ceb7030ba87ec7c780225adb62a4539ea14fea` |
