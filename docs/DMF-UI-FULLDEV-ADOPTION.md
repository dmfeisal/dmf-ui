# Pinned Fulldev catalog adoption

26 October 2026. Core remains private 0.4.0; React remains private 0.1.0-alpha.3. No package publication, release tag or portfolio update is part of this work.

## Scope

Fulldev UI 0.25.5, Git revision `10427beee3c8faf9d077c1dec66fce41b0bae2d0`, provides 65 Astro UI families in its base-vega registry. DMF already covered 37 of those names; those implementations and their existing APIs are retained. The remaining 28 are imported and adapted:

Aspect Ratio, Attachment, Banner, Button Group, Carousel, Code Block, Command, Drawer, Empty, Form, Header, Hover Card, Icon, Image, Item, Kbd, Layout, Logo, Marquee, Native Select, Price, Resizable, Section, Spinner, Theme Toggle, Table of Contents, Typography and Video.

This is family coverage, not drop-in upstream API parity: retained DMF families can expose different props and parts. All imported parts ship with family subpaths and aggregate exports. The complete DMF catalog now contains 77 documented Astro families, including its additional product and portfolio components. Blocks, Liquid and new React components are outside this Astro adoption.

## Source and reuse

The pinned source and registry payloads are MIT-licensed. Original payloads and the license are kept under vendor/fulldev. docs/DMF-UI-FULLDEV-CATALOG.json records payload hashes, original/adapted file hashes and pinned URLs. The original DMF upstream record retains its earlier source history and links this newer catalog adoption.

`npm run upstream:check` validates 65 original payloads and 161 adapted files. The importer only creates missing files and never replaces existing customized source. `--record` updates adopted hashes after a deliberate review. Vendored payloads stay out of the packed component archive; the public `dmf-ui/fulldev-provenance` export ships the hash record. Full notices remain in `dmf-ui/notices`.

## Adaptations

- Host aliases resolve to package-owned DMF modules. Existing semantic tokens and base-vega classes remain the foundation. No initializer resets tokens or configuration.
- Layout imports scoped core styles, includes DMF normalization on its document/body and enables no automatic cross-document transition. Its complete-document example is isolated at `/examples/layout/`.
- Content Icon uses local Lucide and Simple Icons package imports instead of hard-coded consumer-root node_modules globs. Fixed icons can continue to use named Lucide imports. Icon lookup happens on the server; no remote icon fetch is introduced.
- Theme Toggle uses data-theme, coordinates with the documentation header and respects active state. Optional ThemeProvider owns storage/system preference only when explicitly rendered by a host. Documentation does not automatically install a storage provider.
- Drawer and Hover Card portals inherit originating preset and direction. Command Dialog uses the existing DMF isolated-modal foundation. Global documentation search respects an active modal's inert background.
- Native Select, Banner, command adornments and carousel behavior use logical spacing/direction. Kbd foreground is strengthened to meet light-mode contrast. Controls retain appropriate target sizes and visible focus. Scoped anchor normalization and button-link decoration preserve semantic colors without browser-default blue links; the attachment example uses a text-sized action rather than an icon-only size.
- A local SVG sample is exported for copyable asset examples. The optional video preview is kept in an inert template until explicitly requested; the source Video component itself remains a normal YouTube embed.
- Runtime versions are pinned. Added runtimes are Data Slot Command/Drawer/Hover Card/Resizable 1.1.2, Embla Carousel/Auto Scroll 8.6.0, SEO 0.4.0 and Simple Icons 16.33.0. Existing versions are retained. MIT/CC0 notices are preserved. The packed-consumer lock is regenerated and verified in locked mode.

## Verification and boundaries

Astro check: no errors, warnings or hints. Production build: 97 pages. Source/package suite: 35 tests passed. Packed consumer: locked install, production build and all eight tests passed after the dependency update.

The catalog browser scenario visits all 28 imported pages in light, dark and enlarged 390px RTL layouts: 84 scoped audit states. It records axe violations and incompletes separately. The keyboard-label contrast defect found in the first pass was corrected; the final pass has zero violations and zero incomplete results across these scoped states. Attachment action sizing and closed Drawer control references were also corrected. This scoped automated result does not replace manual accessibility acceptance.

Interaction checks cover Banner dismissal/restoration; carousel controls, keyboard and RTL reinitialization; Command filtering and native link activation; isolated Command Dialog focus/Escape and global shortcut containment; native select FormData; keyboard and pointer panel resizing; simulated clipboard success/denial; marquee pause and reduced-motion behavior; theme synchronization and the standalone provider; Drawer focus/Escape; Hover Card opening; and the inert video preview. Existing modal, form composition, selection, documentation, Create and search suites also pass without runtime or failed document/script/style requests.

This does not certify every upstream prop combination. Touch swipe detail, real clipboard permissions, provider storage failure modes, native picker/virtual keyboard behavior, Safari, Firefox and spoken screen readers remain acceptance work. Several source interactions require JavaScript; hosts must keep essential content and meaningful fallbacks available. No backend or remote data integration is fabricated by the previews.
