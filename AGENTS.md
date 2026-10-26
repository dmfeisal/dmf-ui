# Repository instructions

## Confidential naming

Use only these public preset labels and identifiers:

- HUI: `hui` identifiers and `hui-` prefixes; H App/H Company are acceptable prose alternatives.
- QDI: `qdi` identifiers and `qdi-` prefixes; Q App/Q Company are acceptable prose alternatives.
- CB: retain the existing `cb-ui` preset identifier and `cb-` prefixes; C App/C Company are acceptable prose alternatives.

Never expand these abbreviations into client or company identities. Apply this rule to source, scripts, comments, documentation, search indexes, filenames, font-family names, assets, exports and generated outputs. Do not copy private guideline PDFs or identifying filenames into the repository. Preserve required third-party license text. Do not rewrite Git history without an explicit request.

## Natural sizing

Do not impose a blanket 44px mobile/touch minimum width or height. Use component variants, content and padding for natural sizing, preserving keyboard behavior and visible focus.

## Default design profile

Use Nova style with Neutral base color and Neutral theme by default. shadcn/ui is a primary reference for visual specifications and documentation design; Fulldev UI remains a primary Astro source reference. Preserve natural sizing. Header search, GitHub and theme controls share a 32px height.

CB and HUI filled primary actions use white text by explicit owner preference. Preserve the unchanged brand fills and record contrast exceptions instead of silently reverting those labels to black. Code examples use the shared source-owned Code Block compositions.
