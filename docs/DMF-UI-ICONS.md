# Icons

DMF UI uses Lucide for interface icons. The existing locked Astro dependency is `@lucide/astro` 1.60.0; no additional package or icon runtime was added. Named imports render inline SVG on the server, and only selected icons are authored into the page. Consumers import icons directly from Lucide, alongside DMF components, rather than a DMF wrapper or dynamic full-library registry.

`/docs/icons/` provides a curated gallery of 36 icons for navigation, forms, status and commerce. Search matches names and purposes; selection updates a copyable Astro example with size and stroke options. Decorative icons use `aria-hidden=true`; icon-only button examples put the accessible name on the button. SVGs use currentColor. React guidance names the optional `lucide-react` consumer dependency and its `strokeWidth` prop, without adding it to the private React alpha.

The main documentation search trigger now uses the same Lucide Search component. The guide is discoverable through the Docs sidebar, component catalog link and global documentation search. Existing Lucide license notices remain included. Company/product logos remain approved original assets; the interface gallery does not substitute brand marks.

The gallery is documentation UI, excluded from the library archive. Core remains 0.4.0 and React remains 0.1.0-alpha.3. No release tag or package publication is included.

References: [Lucide packages](https://lucide.dev/packages), [accessibility guidance](https://lucide.dev/guide/accessibility).

Verification (2026-10-25): Astro check passed across 193 files with no errors, warnings or hints; production build generated 35 pages; all 18 source tests passed. Isolated Chrome passed the Icons and global-search flows on the production build and development preview with no runtime errors or failed document/script/style requests. Icon checks cover all 36 SVGs, multiword search, empty/reset states, Enter/Space selection, size/stroke updates, exact copying and denied-clipboard fallback. Light, dark and mobile axe checks had zero violations or incomplete items; mobile layout contained 200% text. Safari/Firefox and spoken screen-reader checks remain pending. This verification does not claim full accessibility certification.

## Web and documentation integration

The header uses Lucide icons for primary navigation and a repository link with visible GitHub text. The theme button cycles System/Light/Dark with Monitor/Sun/Moon icons, updating its accessible name without replacing its SVG content. On compact screens its text is visually hidden while the accessible name remains available. Component and guide lists use small decorative icons next to their visible labels; the table of contents stays text-only. Copy, export, share and reset actions pair their labels with corresponding icons. Search Close retains its visible label and Escape hint.

The source-owned `NavigationIcon.astro` mapping serves documentation navigation only; it is excluded from the library archive. Final Astro check: 194 files, zero errors/warnings/hints. All 18 source tests passed. Production browser verification covers the full documentation, Create, content, search and icon-gallery flows, including header repository target and theme icon/name updates.
