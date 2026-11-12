# DMF UI core

`@dmf-ui/core` 0.1.0 is the framework-neutral part of DMF UI: semantic tokens, contracts, the shared and preset stylesheets with their fonts, and the Button variant definition. It is private and experimental, like the React adapter, and is not published.

It has no Astro dependency. Hosts need Tailwind CSS v4; `class-variance-authority` and `tw-animate-css` are its only dependencies.

## One source

This package has no source of its own. `node build.mjs` copies files from the repository into `dist/`:

| Export | Copied from |
| --- | --- |
| `./tokens.json`, `./tokens/resolved.json`, `./foundations` | `tokens/` |
| `./contracts.json`, `./contracts/catalog`, `./contracts/brands`, `./design-profile`, `./taxonomy.json` | `contracts/` |
| `./tokens.css`, `./presets/*.css` and the stylesheets `./styles.css` imports | `src/styles/` |
| `./assets/*` (preset fonts and example images) | `src/assets/` |
| `./notices` | `public/dmf-ui-notices.txt` |

Two files are derived, not copied:

- `./styles.css` is `src/styles/dmf-ui.css` with its Astro component scan (`@source "../components/dmf-ui"`) replaced by a scan of the Button variants, so Tailwind no longer reads Astro files.
- `./button/variants` is `src/components/dmf-ui/button/button-variants.ts` compiled to ESM with declarations.

`tests/core-package.test.mjs` in the repository root fails if any copy differs from its source.

## Use

Import `@dmf-ui/core/styles.css` from a Tailwind v4 stylesheet, add an `@source` for your own components, and render inside a `.dmf-ui` ancestor with the same `data-system` and `data-color-mode` attributes as the Astro package. `@dmf-ui/react` depends on this package; React apps import `@dmf-ui/react/styles.css`, which imports this one.

The Astro package `dmf-ui` is unchanged and still ships its own copies of these files.
